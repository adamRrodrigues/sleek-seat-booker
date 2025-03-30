import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client'; // Direct import of client
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext'; // Use your custom AuthContext hook

interface BookTicketsVariables {
  showtimeId: number;
  selectedSeatIds: string[]; // IDs from UI
}

// Define the structure we want to return on success
interface ClientBookingSuccessResponse {
  booking: Database['public']['Tables']['bookings']['Row'];
  seatReservations: Database['public']['Tables']['seat_reservations']['Row'][];
}

export const useBookTickets = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth(); // Get session from your context hook

  return useMutation<
    ClientBookingSuccessResponse, // Type of data returned on success
    Error,                     // Type of error thrown on failure
    BookTicketsVariables       // Type of variables passed to the mutationFn
  >({
    mutationFn: async (variables) => {
      if (!session?.user || !session?.access_token) {
        throw new Error('User is not authenticated or session is invalid.');
      }

      const { showtimeId, selectedSeatIds } = variables;
      const userId = session.user.id;

      if (selectedSeatIds.length === 0) {
        throw new Error('No seats selected.');
      }

      const numericSeatIds = selectedSeatIds.map(Number); // Convert UI strings to numbers

      // --- TRANSACTIONAL LOGIC (Simulated on Client - Not truly atomic!) ---
      // This sequence is vulnerable to failures between steps.

      // 1. Pre-check Seat Availability (Client-side check - vulnerable to race conditions)
      // This check happens BEFORE the insert, another user could book in between.
      // The UNIQUE constraint in the DB is the ultimate safeguard here.
      const { data: existingReservations, error: checkError } = await supabase
        .from("seat_reservations")
        .select("seat_id")
        .eq("showtime_id", showtimeId)
        .in("seat_id", numericSeatIds);

      if (checkError) {
        console.error("Error checking seat availability:", checkError);
        throw new Error(`Failed to check seat availability: ${checkError.message}`);
      }

      if (existingReservations && existingReservations.length > 0) {
        const bookedIds = existingReservations.map(r => r.seat_id);
        // Find which of the requested seats are already booked
        const conflictingSeats = selectedSeatIds.filter(id => bookedIds.includes(Number(id)));
        throw new Error(`Seats ${conflictingSeats.join(', ')} are already booked.`);
      }

      // 2. Fetch Showtime Price (Needed for total amount)
      const { data: showtimeData, error: showtimeError } = await supabase
        .from("showtimes")
        .select("price")
        .eq("id", showtimeId)
        .single();

      if (showtimeError || !showtimeData) {
          console.error("Error fetching showtime price:", showtimeError);
          throw new Error("Could not retrieve price information for the showtime.");
      }
      const pricePerTicket = showtimeData.price || 0; // Default to 0 if price is null? Decide handling.
      const calculatedTotalAmount = selectedSeatIds.length * pricePerTicket;


      // 3. Create Booking
      // RLS Policy MUST ensure user_id matches session user_id
      const { data: newBooking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          showtime_id: showtimeId,
          user_id: userId, // RLS crucial here
          number_of_tickets: selectedSeatIds.length,
          total_amount: calculatedTotalAmount, // Insert calculated amount directly
        })
        .select() // Select the newly created booking
        .single(); // Expect only one row

      if (bookingError || !newBooking) {
        console.error("Error creating booking:", bookingError);
        // Attempt to cleanup is difficult here without transactions
        throw new Error(`Failed to create booking: ${bookingError?.message || 'Unknown error'}`);
      }

      // 4. Create Seat Reservations
      const reservationInserts = numericSeatIds.map(seatId => ({
        showtime_id: showtimeId,
        seat_id: seatId,
        booking_id: newBooking.id, // Use the ID from the created booking
        // RLS Policy MUST ensure user owns the booking_id or has rights
      }));

      const { data: insertedReservations, error: reservationError } = await supabase
        .from("seat_reservations")
        .insert(reservationInserts)
        .select(); // Select the newly created reservations

      if (reservationError || !insertedReservations || insertedReservations.length !== numericSeatIds.length) {
        console.error("Error creating seat reservations:", reservationError);
        // !!! CRITICAL PROBLEM: Booking exists, but reservations failed/partially failed !!!
        // Attempt to rollback the booking (best effort)
        await supabase.from("bookings").delete().eq("id", newBooking.id);
        // This rollback might also fail! Database is potentially inconsistent.
        throw new Error(`Failed to reserve seats: ${reservationError?.message || 'Partial failure'}. Booking cancelled.`);
      }

      // If we reach here, all steps likely succeeded
      return {
        booking: newBooking,
        seatReservations: insertedReservations,
      };
    },
    onSuccess: (data, variables) => {
      // Invalidate queries as before
      queryClient.invalidateQueries({ queryKey: ['bookedSeats', variables.showtimeId] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      console.log("Booking successful (Client-side):", data);
      toast.success("Tickets booked successfully!");
    },
    onError: (error) => {
      console.error("Booking Mutation Error (Client-side):", error);
      toast.error(error.message || "Booking failed. Please try again.");
    },
  });
};