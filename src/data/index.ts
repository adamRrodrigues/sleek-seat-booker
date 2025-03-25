
import { Theatre, Showtime } from '../types';

export const theatres: Theatre[] = [
  {
    id: "t1",
    name: "Lumière Cinema",
    location: "123 Main Street, Downtown",
    screens: [
      {
        id: "s1-t1",
        name: "Screen 1",
        seats: generateSeats("A", "E", 8) // 5 rows of 8 seats (40 total)
      }
    ]
  },
  {
    id: "t2",
    name: "Evergreen Pictures",
    location: "456 Park Avenue, Uptown",
    screens: [
      {
        id: "s1-t2",
        name: "Screen 1",
        seats: generateSeats("A", "E", 8) // 5 rows of 8 seats (40 total)
      }
    ]
  }
];

export const showtimes: Showtime[] = [
  // Interstellar showtimes
  {
    id: "st1",
    movieId: "m1",
    theatreId: "t1",
    screenId: "s1-t1",
    time: "13:30",
    date: "2023-11-15"
  },
  {
    id: "st2",
    movieId: "m1",
    theatreId: "t1",
    screenId: "s1-t1",
    time: "19:45",
    date: "2023-11-15"
  },
  {
    id: "st3",
    movieId: "m1",
    theatreId: "t2",
    screenId: "s1-t2",
    time: "15:00",
    date: "2023-11-15"
  },
  
  // Grand Budapest Hotel showtimes
  {
    id: "st4",
    movieId: "m2",
    theatreId: "t1",
    screenId: "s1-t1",
    time: "16:15",
    date: "2023-11-15"
  },
  {
    id: "st5",
    movieId: "m2",
    theatreId: "t2",
    screenId: "s1-t2",
    time: "18:30",
    date: "2023-11-15"
  },
  
  // Parasite showtimes
  {
    id: "st6",
    movieId: "m3",
    theatreId: "t1",
    screenId: "s1-t1",
    time: "21:00",
    date: "2023-11-15"
  },
  {
    id: "st7",
    movieId: "m3",
    theatreId: "t2",
    screenId: "s1-t2",
    time: "20:15",
    date: "2023-11-15"
  }
];

// Helper function to generate seats
function generateSeats(startRow: string, endRow: string, seatsPerRow: number) {
  const seats = [];
  const startCharCode = startRow.charCodeAt(0);
  const endCharCode = endRow.charCodeAt(0);
  
  for (let rowCode = startCharCode; rowCode <= endCharCode; rowCode++) {
    const row = String.fromCharCode(rowCode);
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      seats.push({
        id: `${row}${seatNum}`,
        row,
        number: seatNum,
        status: Math.random() > 0.8 ? 'occupied' : 'available' // 20% chance of being occupied
      });
    }
  }
  
  return seats;
}
