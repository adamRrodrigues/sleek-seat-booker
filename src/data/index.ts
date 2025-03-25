
import { Movie, Theatre, Showtime } from '../types';

export const movies: Movie[] = [
  {
    id: "m1",
    title: "Interstellar: Beyond Time",
    poster: "/interstellar.jpg",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: "2h 49m",
    releaseDate: "2023-11-15",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival after Earth becomes uninhabitable.",
    status: "now-showing"
  },
  {
    id: "m2",
    title: "The Grand Budapest Hotel",
    poster: "/budapest.jpg",
    genre: ["Comedy", "Drama"],
    duration: "1h 39m",
    releaseDate: "2023-10-22",
    director: "Wes Anderson",
    cast: ["Ralph Fiennes", "F. Murray Abraham", "Mathieu Amalric"],
    description: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
    status: "now-showing"
  },
  {
    id: "m3",
    title: "Parasite",
    poster: "/parasite.jpg",
    genre: ["Thriller", "Drama", "Comedy"],
    duration: "2h 12m",
    releaseDate: "2023-11-01",
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    status: "now-showing"
  },
  {
    id: "m4",
    title: "Dune: Part Two",
    poster: "/dune2.jpg",
    genre: ["Sci-Fi", "Adventure"],
    duration: "2h 35m",
    releaseDate: "2024-01-20",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    status: "upcoming"
  },
  {
    id: "m5",
    title: "The Eternal Sunshine",
    poster: "/eternal.jpg",
    genre: ["Romance", "Drama"],
    duration: "1h 58m",
    releaseDate: "2024-02-14",
    director: "Sofia Coppola",
    cast: ["Emma Stone", "Ryan Gosling", "Tilda Swinton"],
    description: "Two lovers discover a revolutionary technology that allows them to relive their most precious memories together.",
    status: "upcoming"
  },
  {
    id: "m6",
    title: "Quantum Horizons",
    poster: "/quantum.jpg",
    genre: ["Sci-Fi", "Action"],
    duration: "2h 15m",
    releaseDate: "2024-03-10",
    director: "Alejandro González Iñárritu",
    cast: ["Idris Elba", "Saoirse Ronan", "John Boyega"],
    description: "A physicist discovers how to manipulate the fabric of reality, but faces ethical dilemmas when governments try to weaponize his research.",
    status: "upcoming"
  },
  {
    id: "m7",
    title: "The Silent Echo",
    poster: "/echo.jpg",
    genre: ["Mystery", "Thriller"],
    duration: "2h 05m",
    releaseDate: "2024-02-28",
    director: "David Fincher",
    cast: ["Cate Blanchett", "Daniel Kaluuya", "Rooney Mara"],
    description: "A detective with a unique ability to revisit crime scenes through psychic visions investigates a series of mysterious disappearances in a small coastal town.",
    status: "upcoming"
  }
];

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
