
import { Link } from 'react-router-dom';
import { Clock, CalendarDays } from 'lucide-react';
import { Movie } from '../types';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
  const isNowShowing = movie.status === 'now-showing';

  return (
    <Link to={`/movies/${movie.id}`} className={cn('movie-card block h-full', className)}>
      <div className="relative h-full">
        {/* Default poster if image fails to load */}
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Status badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isNowShowing 
              ? 'bg-cinema-accent text-cinema-primary' 
              : 'bg-cinema-muted text-white'
          }`}>
            {isNowShowing ? 'Now Showing' : 'Coming Soon'}
          </span>
        </div>
        
        {/* Overlay with movie details */}
        <div className="movie-card-overlay">
          <h3 className="text-white font-medium">{movie.title}</h3>
          
          <div className="flex items-center space-x-3 mt-1">
            <div className="flex items-center text-white/80 text-xs">
              <Clock size={12} className="mr-1" />
              <span>{movie.duration}</span>
            </div>
            
            <div className="flex items-center text-white/80 text-xs">
              <CalendarDays size={12} className="mr-1" />
              <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
