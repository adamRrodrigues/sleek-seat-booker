// src/hooks/useUserBookings.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

// --- Define/Update the UserBooking Type ---

// Type for a single seat reservation including the seat details
type SeatReservationWithDetails = Database['public']['Tables']['seat_reservations']['Row'] & {
  seats: { // Nested seat details
    row_letter: string | null;
    seat_number: number | null;
  } | null; // seats relation might be null
};

// Type for a showtime row including its related movie and cinema
type ShowtimeWithDetails = Database['public']['Tables']['showtimes']['Row'] & {
    movies: Database['public']['Tables']['movies']['Row'] | null;
    theatre: Database['public']['Tables']['theatre']['Row'] | null;
};

// The main UserBooking type, now including seat reservations
export type UserBooking = Database['public']['Tables']['bookings']['Row'] & {
    showtimes: ShowtimeWithDetails | null;
    // Add the seat reservations - it's an array as one booking has many reservations
    seat_reservations: SeatReservationWithDetails[]; // Array should not be null if booking exists
};

// --- Updated Hook ---

export const useUserBookings = () => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery<UserBooking[], Error>({
    queryKey: ['userBookings', userId],
    queryFn: async (): Promise<UserBooking[]> => {
      if (!userId) return [];

      // Updated select query to include seat_reservations and nested seats
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          showtimes (
            *,
            movies (*),
            theatre (*)
          ),
          seat_reservations (
            *,
            seats (
              row_letter,
              seat_number
            )
          )
        `)
        .eq('user_id', userId)
        .order('booking_date', { ascending: false });

      if (error) {
        console.error('Error fetching user bookings with seats:', error);
        throw new Error('Failed to fetch your bookings.');
      }

      // Log raw data for debugging if needed
      // console.log('Raw Supabase booking data with seats:', JSON.stringify(data, null, 2));

      // Ensure seat_reservations is always an array, even if empty from DB
      const bookingsWithEnsuredSeatReservations = (data || []).map(booking => ({
          ...booking,
          seat_reservations: booking.seat_reservations || []
      }));


      // Type assertion needed because Supabase TS inference might struggle with deep nesting
      return (bookingsWithEnsuredSeatReservations as UserBooking[]) || [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};