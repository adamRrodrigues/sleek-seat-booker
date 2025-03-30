export interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string[];
  duration: string;
  releaseDate: string;
  director: string;
  cast: string[];
  description: string;
  status: "now-showing" | "upcoming";
  trailer: string;
}

export interface Theatre {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Screen {
  id: number;
  theatre_id: number;
  screen_number: number;
  total_seats: number;
}

export interface Seat {
  id: number;
  screen_id: number;
  row_letter: string;
  seat_number: number;
}

export interface Showtime {
  id: number;
  movie_id: string;
  theatre_id: number;
  screen_number: number;
  showtime: string; // format: "HH:MM"
  date: string; // format: "YYYY-MM-DD"
  price: number;
}

export interface Seat_Reservations {
  id: number;
  showtime_id: number;
  seat_id: number;
  booking_id: number;
}
