import React, { useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path
import { useUserBookings, UserBooking } from "@/hooks/useUserBookings"; // Adjust path
import Navbar from "@/components/Navbar"; // Adjust path
import Footer from "@/components/Footer"; // Adjust path
import { toast } from "sonner";
import {
  User,
  LogOut,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have this utility

import { Armchair } from "lucide-react"; // Or use Ticket icon again
import { Badge } from "@/components/ui/badge"; // Assuming you use shadcn/ui or similar for badges

// --- BookingCard Component ---
const BookingCard = ({ booking }: { booking: UserBooking }) => {
  const movie = booking.showtimes?.movies;
  const showtime = booking.showtimes;
  const theatre = booking.showtimes?.theatre;
  const seatReservations = booking.seat_reservations;

  const movieTitle = movie?.title ?? "Movie Title Unavailable";
  const moviePoster = movie?.poster ?? "/placeholder.svg";
  const theatreName = theatre?.name ?? "Theatre Unavailable";
  const showtimeDateTime = showtime?.showtime
    ? new Date(showtime.showtime)
    : null;
  const bookingDateTime = booking.booking_date
    ? new Date(booking.booking_date)
    : null;

  // --- Check if the showtime has expired ---
  const isExpired = showtimeDateTime ? showtimeDateTime < new Date() : false;
  // ------------------------------------------

  const formattedSeats = useMemo(() => {
    // ... (keep existing seat formatting logic) ...
    if (!seatReservations || seatReservations.length === 0) {
      return "Seat details unavailable";
    }
    return seatReservations
      .map((res) =>
        res.seats ? `${res.seats.row_letter}${res.seats.seat_number}` : "?"
      )
      .sort((a, b) => {
        const rowA = a.match(/[A-Z]+/)?.[0] || "";
        const rowB = b.match(/[A-Z]+/)?.[0] || "";
        const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
        if (rowA !== rowB) return rowA.localeCompare(rowB);
        return numA - numB;
      })
      .join(", ");
  }, [seatReservations]);

  return (
    <div
      className={cn(
        "bg-cinema-card rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row gap-4 p-4 transition-shadow hover:shadow-lg",
        isExpired ? "opacity-70" : "" // Optional: Dim expired bookings slightly
      )}
    >
      {/* Movie Poster */}
      <div className="flex-shrink-0 w-full sm:w-24 md:w-32 aspect-[2/3] rounded overflow-hidden">
        <img
          src={moviePoster}
          alt={`${movieTitle} poster`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
            target.onerror = null;
          }}
        />
      </div>

      {/* Booking Details */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {" "}
            {/* Flex container for title and badge */}
            <Link to={`/movies/${movie.id}`} className="flex-grow min-w-0">
              {" "}
              {/* Allow title to truncate */}
              <h3 className="text-lg font-semibold text-cinema-primary hover:text-cinema-accent transition-colors line-clamp-2 truncate">
                {movieTitle}
              </h3>
            </Link>
            {/* --- Expired Badge --- */}
            {isExpired && (
              <Badge
                variant="outline"
                className="text-xs bg-gray-500 text-white border-gray-600 whitespace-nowrap"
              >
                Expired
              </Badge>
            )}
            {/* --------------------- */}
          </div>
          {/* Theatre, Date/Time, Seats */}
          <div className="text-sm text-cinema-muted space-y-1.5">
            <p className="flex items-center">
              <MapPin size={14} className="mr-1.5 flex-shrink-0" />{" "}
              {theatreName}
            </p>
            {showtimeDateTime && (
              <p className="flex items-center">
                <Calendar size={14} className="mr-1.5 flex-shrink-0" />
                {showtimeDateTime.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                <span className="mx-1">•</span>
                <Clock size={14} className="mr-1 flex-shrink-0" />
                {showtimeDateTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            )}
            <p className="flex items-center">
              <Armchair size={14} className="mr-1.5 flex-shrink-0" />
              {booking.number_of_tickets} Seat(s):{" "}
              <span className="ml-1 font-medium text-cinema-primary truncate">
                {formattedSeats}
              </span>
            </p>
          </div>
        </div>
        {/* Booking Footer */}
        <div className="text-xs text-cinema-muted mt-3 pt-2 border-t border-cinema-border">
          Booked on:{" "}
          {bookingDateTime
            ? bookingDateTime.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"}
          <span className="float-right font-medium text-cinema-primary">
            Total: ${booking.total_amount?.toFixed(2) ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user, session, signOut, loading: authLoading } = useAuth(); // Get user, session, and signOut from context
  const navigate = useNavigate();
  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useUserBookings();

  useEffect(() => {
    // Redirect if not logged in after initial auth check
    if (!authLoading && !user) {
      toast.info("Please sign in to view your profile.");
      navigate("/auth"); // Redirect to your login/auth page
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      navigate("/"); // Redirect to home page after sign out
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
      console.error("Sign out error:", error);
    }
  };

  // Display loading indicator while checking auth state or fetching bookings
  if (authLoading || bookingsLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin h-10 w-10 border-4 border-cinema-accent border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // If loading is finished but there's no user, show nothing or a message (should be redirected)
  if (!user) {
    return null; // Or a message indicating redirection is happening
  }

  return (
    <div className="flex flex-col min-h-screen bg-cinema-background text-cinema-primary">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Profile</h1>

        {/* User Information Section */}
        <section className="mb-12 bg-cinema-card p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <User size={20} className="mr-2" /> User Information
              </h2>
              <p className="text-cinema-muted">
                Email:{" "}
                <span className="font-medium text-cinema-primary">
                  {user.email}
                </span>
              </p>
              {/* Display other user meta data if needed */}
              {/* <p className="text-cinema-muted">Member since: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p> */}
            </div>
            <button
              onClick={handleSignOut}
              className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
            >
              <LogOut size={16} className="mr-1.5" /> Sign Out
            </button>
          </div>
        </section>

        {/* Bookings Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Ticket size={22} className="mr-2" /> Your Bookings
          </h2>

          {bookingsError && (
            <div className="text-center py-10 text-red-500 bg-cinema-card rounded-lg shadow p-4">
              <p>Could not load your bookings.</p>
              <p className="text-sm mt-1">
                {(bookingsError as Error)?.message}
              </p>
            </div>
          )}

          {!bookingsError && (!bookings || bookings.length === 0) && (
            <div className="text-center py-10 text-cinema-muted bg-cinema-card rounded-lg shadow p-4">
              <p>You haven't booked any tickets yet.</p>
              <Link
                to="/"
                className="text-cinema-accent hover:underline mt-2 inline-block"
              >
                Find Movies to Book
              </Link>
            </div>
          )}

          {!bookingsError && bookings && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
