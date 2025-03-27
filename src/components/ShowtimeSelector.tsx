import React, { useState, useEffect } from "react";
import { Database } from "../integrations/supabase/types"; // Adjust path
import { supabase } from "@/integrations/supabase/client"; // Adjust path

// Define the types for Showtimes and Cinemas from your Supabase types
type Showtime = Database["public"]["Tables"]["showtimes"]["Row"];
type Cinema = Database["public"]["Tables"]["theatre"]["Row"];

interface ShowtimeSelectorProps {
  movieId: string; // Add a movieId prop to filter showtimes
  onSelect: (showtime: Showtime) => void;
}

const ShowtimeSelector = ({ movieId, onSelect }: ShowtimeSelectorProps) => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [theatre, setCinemas] = useState<Cinema[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowtimesAndCinemas = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch showtimes for the specified movie
        let { data: showtimesData, error: showtimesError } = await supabase
          .from("showtimes")
          .select("*")
          .eq("movie_id", movieId)
          .order("showtime", { ascending: true }); // Order by showtime for better display

        if (showtimesError) {
          throw new Error(
            `Error fetching showtimes: ${showtimesError.message}`
          );
        }

        if (!showtimesData || showtimesData.length === 0) {
          setShowtimes([]);
          setCinemas([]);
          setLoading(false);
          return; // Exit early if no showtimes are found
        }

        // Fetch theatre
        let cinemaIds = [...new Set(showtimesData.map((st) => st.cinema_id))];
        let { data: cinemasData, error: cinemasError } = await supabase
          .from("theatre")
          .select("*")
          .in("id", cinemaIds);

        if (cinemasError) {
          throw new Error(`Error fetching theatre: ${cinemasError.message}`);
        }

        setShowtimes(showtimesData);
        setCinemas(cinemasData || []);

        // Initialize selectedDate to the earliest showtime's date
        const earliestShowtime = showtimesData[0]?.showtime;
        if (earliestShowtime) {
          const initialDate = new Date(earliestShowtime)
            .toISOString()
            .split("T")[0]; // Get YYYY-MM-DD
          setSelectedDate(initialDate);
        } else {
          setSelectedDate(""); // No showtimes, so clear the selected date
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimesAndCinemas();
  }, [movieId]); // Re-fetch when the movieId changes

  // Get unique dates from showtimes (format: YYYY-MM-DD)
  const uniqueDates = [
    ...new Set(
      showtimes.map((st) => new Date(st.showtime).toISOString().split("T")[0])
    ),
  ];

  // Filter showtimes by selected date
  const filteredShowtimes = showtimes.filter(
    (st) => new Date(st.showtime).toISOString().split("T")[0] === selectedDate
  );

  // Group showtimes by cinema (using cinema ID)
  const showtimesByCinema: Record<number, Showtime[]> = {};
  filteredShowtimes.forEach((st) => {
    if (!showtimesByCinema[st.cinema_id]) {
      showtimesByCinema[st.cinema_id] = [];
    }
    showtimesByCinema[st.cinema_id].push(st);
  });

  if (loading) {
    return <div className="text-center py-8">Loading showtimes...</div>;
  }

  if (error) {
    return <div className="text-center py-8">Error: {error}</div>;
  }

  if (!showtimes || showtimes.length === 0) {
    return (
      <div className="text-center py-8">
        No showtimes available for this movie.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Select Date</h3>

      {/* Date selection */}
      <div className="flex overflow-x-auto space-x-2 pb-2 mb-6">
        {uniqueDates.map((date, index) => {
          const dateObj = new Date(date);
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center p-2 min-w-[80px] rounded-md transition-colors ${
                selectedDate === date
                  ? "bg-cinema-accent text-cinema-primary"
                  : "bg-cinema-card hover:bg-cinema-card-hover"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-xs font-medium">
                {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-lg font-semibold">{dateObj.getDate()}</span>
              <span className="text-xs">
                {dateObj.toLocaleDateString("en-US", { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cinemas and showtimes */}
      {Object.keys(showtimesByCinema).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(showtimesByCinema).map(
            ([cinemaId, cinemaShowtimes]) => {
              const cinema = theatre.find((c) => c.id === parseInt(cinemaId)); // Find cinema by ID
              return (
                <div
                  key={cinemaId}
                  className="animate-slide-up animate-fill-both"
                >
                  <h3 className="text-lg font-medium mb-3">{cinema?.name}</h3>
                  <p className="text-sm text-cinema-muted mb-3">
                    {cinema?.address}, {cinema?.city}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {cinemaShowtimes.map((showtime) => {
                      const showtimeDate = new Date(showtime.showtime);
                      const timeString = showtimeDate.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      );
                      return (
                        <button
                          key={showtime.id}
                          onClick={() => onSelect(showtime)}
                          className="px-4 py-2 rounded-md bg-cinema-card hover:bg-cinema-card-hover transition-colors"
                        >
                          {timeString}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-cinema-muted">
            No showtimes available for this date.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowtimeSelector;
