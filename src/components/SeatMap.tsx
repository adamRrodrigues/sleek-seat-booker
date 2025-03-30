import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client"; // Adjust path

type Seat = {
  id: string;
  row: string;
  number: number;
  status: "available" | "occupied"; // Assuming 'available' or 'occupied' for now
};

type Screen = {
  id: number;
  seats: Seat[];
};

interface SeatMapProps {
  screenId: number;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  showtimeId: number; // Pass showtimeId to fetch booked seats
}

const SeatMap = ({ screenId, selectedSeats, onSeatSelect, showtimeId }: SeatMapProps) => {
  const [screen, setScreen] = useState<Screen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedSeatIds, setBookedSeatIds] = useState<string[]>([]); // Store booked seat IDs

  useEffect(() => {
    const fetchScreenAndSeats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch screen details
        const { data: screenData, error: screenError } = await supabase
          .from("screens")
          .select("*")
          .eq("id", screenId)
          .single();

        if (screenError) {
          throw new Error(`Error fetching screen: ${screenError.message}`);
        }

        if (!screenData) {
          throw new Error("Screen not found");
        }

        // Fetch seats for the screen
        const { data: seatsData, error: seatsError } = await supabase
          .from("seats")
          .select("*")
          .eq("screen_id", screenId);

        if (seatsError) {
          throw new Error(`Error fetching seats: ${seatsError.message}`);
        }

        // Construct the screen object with its seats
        const screenWithSeats: Screen = {
          id: screenData.id,
          seats: (seatsData || []).map((seat) => ({
            id: String(seat.id), // Convert seat.id to string
            row: seat.row_letter, // Use row_letter directly
            number: seat.seat_number,
            status: "available", //Initially all seats are available. this will be updated based on booked seats
          })),
        };

        setScreen(screenWithSeats);

        // Fetch booked seats for the showtime
        const { data: bookedSeatsData, error: bookedSeatsError } = await supabase
          .from("seat_reservations")
          .select("seat_id")
          .eq("showtime_id", showtimeId);

        if (bookedSeatsError) {
          throw new Error(`Error fetching booked seats: ${bookedSeatsError.message}`);
        }

        setBookedSeatIds((bookedSeatsData || []).map(reservation => String(reservation.seat_id)));

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenAndSeats();
  }, [screenId, showtimeId]); // Refetch when screenId or showtimeId changes

  if (loading) {
    return <p>Loading seat map...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!screen) {
    return <p>Screen not found.</p>;
  }

  // Group seats by row
  const seatsByRow: Record<string, Seat[]> = {};
  screen.seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="mt-8 animate-fade-in animate-fill-both">
      <div className="flex flex-col items-center mb-8">
        <div className="w-3/4 h-8 bg-cinema-accent/20 rounded-t-full mb-6 text-center text-sm pt-1">
          Screen
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex items-center">
            <div className="seat seat-available w-5 h-5 mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="seat seat-selected w-5 h-5 mr-2"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="seat seat-occupied w-5 h-5 mr-2"></div>
            <span className="text-sm">Occupied</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col items-center space-y-2 min-w-fit">
          {sortedRows.map((row, rowIndex) => (
            <div
              key={row}
              className="flex items-center"
              style={{ animationDelay: `${rowIndex * 50}ms` }}
            >
              <div className="w-6 text-center font-medium mr-2">{row}</div>
              <div className="flex">
                {seatsByRow[row]
                  .sort((a, b) => a.number - b.number)
                  .map((seat, seatIndex) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isBooked = bookedSeatIds.includes(seat.id); // Check if seat is booked

                    return (
                      <div
                        key={seat.id}
                        className={cn("seat", {
                          "seat-available":
                            !isSelected && !isBooked, // Available if not selected and not booked
                          "seat-selected": isSelected,
                          "seat-occupied": isBooked,    // Occupied if booked
                        })}
                        onClick={() => {
                          if (!isBooked) { // Disable click if seat is booked
                            onSeatSelect(seat.id);
                          }
                        }}
                        style={{
                          animationDelay: `${rowIndex * 50 + seatIndex * 10}ms`,
                          pointerEvents: isBooked ? "none" : "auto", // Disable click if booked
                          cursor: isBooked ? "not-allowed" : "pointer", // Change cursor if booked
                        }}
                      >
                        {seat.number}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;