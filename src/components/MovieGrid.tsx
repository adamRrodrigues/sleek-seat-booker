
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  title: string;
  movies: Movie[];
}

const MovieGrid = ({ title, movies }: MovieGridProps) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <div key={movie.id} className="opacity-0 animate-fade-in animate-fill-both" style={{ animationDelay: `${index * 75}ms` }}>
            <MovieCard movie={movie} className="h-[350px]" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
