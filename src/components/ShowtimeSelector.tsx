
import { useState } from 'react';
import { Showtime, Theatre } from '../types';

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  theatres: Theatre[];
  onSelect: (showtime: Showtime) => void;
}

const ShowtimeSelector = ({ showtimes, theatres, onSelect }: ShowtimeSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(showtimes[0]?.date || '');
  
  // Get unique dates from showtimes
  const uniqueDates = [...new Set(showtimes.map(st => st.date))];
  
  // Filter showtimes by selected date
  const filteredShowtimes = showtimes.filter(st => st.date === selectedDate);
  
  // Group showtimes by theatre
  const showtimesByTheatre: Record<string, Showtime[]> = {};
  filteredShowtimes.forEach(st => {
    if (!showtimesByTheatre[st.theatreId]) {
      showtimesByTheatre[st.theatreId] = [];
    }
    showtimesByTheatre[st.theatreId].push(st);
  });
  
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
                  ? 'bg-cinema-accent text-cinema-primary'
                  : 'bg-cinema-card hover:bg-cinema-card-hover'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-xs font-medium">
                {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-lg font-semibold">
                {dateObj.getDate()}
              </span>
              <span className="text-xs">
                {dateObj.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Theatres and showtimes */}
      {Object.keys(showtimesByTheatre).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(showtimesByTheatre).map(([theatreId, theatreShowtimes]) => {
            const theatre = theatres.find(t => t.id === theatreId);
            return (
              <div key={theatreId} className="animate-slide-up animate-fill-both">
                <h3 className="text-lg font-medium mb-3">{theatre?.name}</h3>
                <p className="text-sm text-cinema-muted mb-3">{theatre?.location}</p>
                
                <div className="flex flex-wrap gap-2">
                  {theatreShowtimes.map((showtime) => (
                    <button
                      key={showtime.id}
                      onClick={() => onSelect(showtime)}
                      className="px-4 py-2 rounded-md bg-cinema-card hover:bg-cinema-card-hover transition-colors"
                    >
                      {showtime.time}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-cinema-muted">No showtimes available for this date.</p>
        </div>
      )}
    </div>
  );
};

export default ShowtimeSelector;
