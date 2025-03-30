import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useMovies = (status?: "now-showing" | "upcoming") => {
  return useQuery({
    queryKey: ["movies", status],
    queryFn: async () => {
      let query = supabase.from("movies").select("*");

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching movies:", error);
        throw new Error("Failed to fetch movies");
      }

      // Transform the database result to match our app's Movie interface
      const movies: Movie[] = data.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        genre: movie.genre,
        duration: movie.duration,
        releaseDate: movie.release_date,
        director: movie.director,
        cast: movie.actors, // Note mapping actors field to cast
        description: movie.description,
        status: movie.status as "now-showing" | "upcoming",
        trailer: movie.movie_trailer,
      }));

      return movies;
    },
  });
};

export const useMovie = (id: string | undefined) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('movies')
        .select('*') // Ensure movie_trailer is selected if using '*' or add it explicitly
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching movie:', error);
        // Consider throwing a more specific error or returning null based on error type
        if (error.code === 'PGRST116') { // Code for "No rows found"
             return null; // Treat not found as null, not an error
        }
        throw new Error('Failed to fetch movie');
      }

      if (!data) return null;

      // Transform the database result
      const movie: Movie = {
        id: data.id,
        title: data.title,
        poster: data.poster, // Use correct column name
        trailer: data.movie_trailer, // *** Map the trailer URL ***
        genre: data.genre, // Example parsing if genre is comma-separated
        duration: data.duration ? `${data.duration} min` : 'N/A', // Example formatting
        releaseDate: data.release_date,
        director: data.director ?? 'N/A', // Handle potential null director
        cast: data.actors ?? [], // Use actors column, handle potential null
        description: data.description ?? 'No description available.', // Handle potential null
        status: data.status as 'now-showing' | 'upcoming'
      };

      return movie;
    },
    enabled: !!id,
    retry: false, // Don't retry automatically if movie not found
  });
};