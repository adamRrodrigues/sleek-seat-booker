
import { useState } from 'react';
import { Seat, Screen } from '../types';
import { cn } from '@/lib/utils';

interface SeatMapProps {
  screen: Screen;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

const SeatMap = ({ screen, selectedSeats, onSeatSelect }: SeatMapProps) => {
  // Group seats by row
  const seatsByRow: Record<string, Seat[]> = {};
  screen.seats.forEach(seat => {
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
        <div className="w-3/4 h-8 bg-cinema-accent/20 rounded-t-full mb-6 text-center text-sm pt-1">Screen</div>
        
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
            <div key={row} className="flex items-center" style={{ animationDelay: `${rowIndex * 50}ms` }}>
              <div className="w-6 text-center font-medium mr-2">{row}</div>
              <div className="flex">
                {seatsByRow[row]
                  .sort((a, b) => a.number - b.number)
                  .map((seat, seatIndex) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                      <div 
                        key={seat.id} 
                        className={cn(
                          "seat",
                          {
                            "seat-available": seat.status === 'available' && !isSelected,
                            "seat-selected": isSelected,
                            "seat-occupied": seat.status === 'occupied'
                          }
                        )}
                        onClick={() => {
                          if (seat.status !== 'occupied') {
                            onSeatSelect(seat.id);
                          }
                        }}
                        style={{ animationDelay: `${rowIndex * 50 + seatIndex * 10}ms` }}
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
