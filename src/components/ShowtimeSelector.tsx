// src/components/ShowtimeSelector.tsx (or wherever it's located)

import React, { useState, useEffect } from 'react';
import { Database } from "../integrations/supabase/types";

import { supabase } from '../integrations/supabase/client'; // Adjust path

type Showtime = Database["public"]["Tables"]["showtimes"]["Row"];
type Theatre = Database["public"]["Tables"]["theatre"]["Row"]; // Keep Cinema table, rename the Type

interface ShowtimeSelectorProps {
    movieId: string;
    onSelect: (showtime: Showtime) => void;
}

const ShowtimeSelector = ({ movieId, onSelect }: ShowtimeSelectorProps) => {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShowtimesAndTheatres = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get the current timestamp in ISO format (UTC)
                const now = new Date().toISOString();

                // Fetch showtimes for the specified movie THAT ARE IN THE FUTURE
                let { data: showtimesData, error: showtimesError } = await supabase
                    .from('showtimes')
                    .select('*')
                    .eq('movie_id', movieId)
                    .gte('showtime', now) // *** Filter for showtimes greater than or equal to now ***
                    .order('showtime', { ascending: true });

                if (showtimesError) {
                    throw new Error(`Error fetching showtimes: ${showtimesError.message}`);
                }

                // Filter out any showtimes that might have slipped through (client-side safety check)
                // This handles potential slight time differences between client and server
                const futureShowtimes = (showtimesData || []).filter(st => new Date(st.showtime) >= new Date());

                if (futureShowtimes.length === 0) {
                    setShowtimes([]);
                    setTheatres([]);
                    setSelectedDate(''); // No future showtimes
                    setLoading(false);
                    return;
                }

                // Fetch theatres for the *filtered* future showtimes
                let theatreIds = [...new Set(futureShowtimes.map(st => st.cinema_id))];
                // Avoid fetching theatres if there are no future showtimes
                if (theatreIds.length > 0) {
                    let { data: theatresData, error: theatresError } = await supabase
                        .from('theatre')
                        .select('*')
                        .in('id', theatreIds);

                    if (theatresError) {
                        throw new Error(`Error fetching theatres: ${theatresError.message}`);
                    }
                    setTheatres(theatresData || []);
                } else {
                     setTheatres([]);
                }


                setShowtimes(futureShowtimes);


                // Initialize selectedDate to the earliest *future* showtime's date
                const earliestShowtime = futureShowtimes[0]?.showtime;
                if (earliestShowtime) {
                    // Adjust date to local timezone for display grouping if needed,
                    // but keep YYYY-MM-DD for internal state
                    const initialDate = new Date(earliestShowtime).toISOString().split('T')[0];
                    setSelectedDate(initialDate);
                } else {
                    setSelectedDate('');
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimesAndTheatres();
    }, [movieId]);  // Re-fetch when the movieId changes

    // Get unique dates from the *filtered future* showtimes (format: YYYY-MM-DD)
    // Adjust date parsing to handle local time for display grouping if necessary
    const uniqueDates = [...new Set(showtimes.map(st => {
        // Get date part in local timezone for grouping display buttons
        const localDate = new Date(st.showtime);
        return localDate.toISOString().split('T')[0]; // Keep YYYY-MM-DD format
    }))].sort(); // Sort the dates chronologically


    // Filter showtimes by selected date (using the same YYYY-MM-DD format)
    const filteredShowtimes = showtimes.filter(st => {
        const localDate = new Date(st.showtime);
        return localDate.toISOString().split('T')[0] === selectedDate;
    });


    // Group showtimes by theatre (using cinema ID)
    const showtimesByTheatre: Record<number, Showtime[]> = {};
    filteredShowtimes.forEach(st => {
        const theatreId = st.cinema_id; // Use actual column name
        if (!showtimesByTheatre[theatreId]) {
            showtimesByTheatre[theatreId] = [];
        }
        // Sort showtimes within each theatre group by time
        showtimesByTheatre[theatreId].push(st);
        showtimesByTheatre[theatreId].sort((a, b) => new Date(a.showtime).getTime() - new Date(b.showtime).getTime());
    });

    if (loading) {
        return <div className="text-center py-8">Loading showtimes...</div>;
    }

    if (error) {
        return <div className="text-center py-8">Error: {error}</div>;
    }

    // Update the message when no *future* showtimes are found
    if (!showtimes || showtimes.length === 0) {
        return <div className="text-center py-8">No upcoming showtimes available for this movie.</div>;
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Select Date</h3>

            {/* Date selection */}
            <div className="flex overflow-x-auto space-x-2 pb-2 mb-6">
                 {/* Handle case where uniqueDates might be empty */}
                 {uniqueDates.length > 0 ? uniqueDates.map((date, index) => {
                    // Parse the date correctly, considering potential timezone offset if needed for display
                    // Using setUTCHours(0,0,0,0) ensures we compare dates without time influence
                    const dateObj = new Date(date);
                    dateObj.setUTCHours(0,0,0,0); // Normalize to start of day UTC for button display consistency

                    // Format button display using local date parts
                    const displayDate = new Date(date + 'T00:00:00Z'); // Treat date string as UTC start of day

                    return (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center p-2 min-w-[80px] rounded-md transition-colors ${selectedDate === date
                                ? 'bg-cinema-accent text-cinema-primary'
                                : 'bg-cinema-card hover:bg-cinema-card-hover'
                                }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <span className="text-xs font-medium">
                                {displayDate.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className="text-lg font-semibold">
                                {displayDate.getUTCDate()} {/* Use getUTCDate for consistency */}
                            </span>
                            <span className="text-xs">
                                {displayDate.toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                        </button>
                    );
                }) : (
                     <p className="text-cinema-muted">No available dates.</p>
                )}
            </div>

            {/* Theatres and showtimes */}
            {Object.keys(showtimesByTheatre).length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(showtimesByTheatre).map(([theatreId, theatreShowtimes]) => {
                         // Ensure theatreId is parsed correctly if needed
                        const numericTheatreId = parseInt(theatreId, 10);
                        const theatre = theatres.find(t => t.id === numericTheatreId);
                        return (
                            <div key={theatreId} className="animate-slide-up animate-fill-both">
                                <h3 className="text-lg font-medium mb-3">{theatre?.name ?? `Theatre ${theatreId}`}</h3>
                                <p className="text-sm text-cinema-muted mb-3">{theatre?.address}, {theatre?.city}</p>

                                <div className="flex flex-wrap gap-2">
                                    {theatreShowtimes.map((showtime) => {
                                        // Display time in local timezone
                                        const showtimeDate = new Date(showtime.showtime);
                                        const timeString = showtimeDate.toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                            // timeZoneName: 'short' // Optional: include timezone abbreviation
                                        });
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
                    })}
                </div>
            ) : (
                // This message now reflects filtering by the selected future date
                <div className="text-center py-8">
                    <p className="text-cinema-muted">No showtimes available for this date.</p>
                </div>
            )}
        </div>
    );
};

export default ShowtimeSelector;