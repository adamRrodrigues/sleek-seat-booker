
import { useQuery } from '@tanstack/react-query';
import { Movie } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useMovies = (status?: 'now-showing' | 'upcoming') => {
  return useQuery({
    queryKey: ['movies', status],
    queryFn: async () => {
      let query = supabase
        .from('movies')
        .select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Failed to fetch movies');
      }
      
      // Transform the database result to match our app's Movie interface
      const movies: Movie[] = data.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        genre: movie.genre,
        duration: movie.duration,
        releaseDate: movie.release_date,
        director: movie.director,
        cast: movie.actors, // Note mapping actors field to cast
        description: movie.description,
        status: movie.status as 'now-showing' | 'upcoming'
      }));
      
      return movies;
    }
  });
};

export const useMovie = (id: string | undefined) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching movie:', error);
        throw new Error('Failed to fetch movie');
      }
      
      if (!data) return null;
      
      // Transform the database result to match our app's Movie interface
      const movie: Movie = {
        id: data.id,
        title: data.title,
        poster: data.poster,
        genre: data.genre,
        duration: data.duration,
        releaseDate: data.release_date,
        director: data.director,
        cast: data.actors, // Note mapping actors field to cast
        description: data.description,
        status: data.status as 'now-showing' | 'upcoming'
      };
      
      return movie;
    },
    enabled: !!id
  });
};
