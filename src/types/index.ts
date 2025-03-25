
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
  status: 'now-showing' | 'upcoming';
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
  screens: Screen[];
}

export interface Screen {
  id: string;
  name: string;
  seats: Seat[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
}

export interface Showtime {
  id: string;
  movieId: string;
  theatreId: string;
  screenId: string;
  time: string; // format: "HH:MM"
  date: string; // format: "YYYY-MM-DD"
}
