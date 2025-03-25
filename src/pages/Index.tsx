
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Movie } from '../types';
import MovieGrid from '../components/MovieGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useMovies } from '@/hooks/useMovies';
import { toast } from 'sonner';

const Index = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  
  // Fetch movies from Supabase
  const { data: nowShowingMovies, isLoading: loadingNowShowing, error: nowShowingError } = useMovies('now-showing');
  const { data: upcomingMovies, isLoading: loadingUpcoming, error: upcomingError } = useMovies('upcoming');
  
  useEffect(() => {
    if (nowShowingMovies && nowShowingMovies.length > 0) {
      // Set the first now showing movie as featured
      setFeaturedMovie(nowShowingMovies[0]);
    }
  }, [nowShowingMovies]);
  
  // Show error messages
  useEffect(() => {
    if (nowShowingError) {
      toast.error('Failed to load now showing movies');
    }
    if (upcomingError) {
      toast.error('Failed to load upcoming movies');
    }
  }, [nowShowingError, upcomingError]);

  const isLoading = loadingNowShowing || loadingUpcoming;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-cinema-accent border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section with featured movie */}
        {featuredMovie && (
          <div className="relative h-[70vh] overflow-hidden animate-fade-in animate-fill-both">
            <img 
              src={featuredMovie.poster} 
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
              <div className="container mx-auto">
                <div className="max-w-2xl animate-slide-up animate-fill-both">
                  <div className="flex space-x-2 mb-2">
                    {featuredMovie.genre.map((genre, index) => (
                      <span key={index} className="text-xs md:text-sm px-2 py-1 bg-white/10 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">{featuredMovie.title}</h1>
                  
                  <div className="flex flex-wrap items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>{featuredMovie.duration}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>{new Date(featuredMovie.releaseDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  
                  <p className="mb-5 text-sm md:text-base opacity-90 line-clamp-3">
                    {featuredMovie.description}
                  </p>
                  
                  <Link 
                    to={`/movies/${featuredMovie.id}`}
                    className="inline-block px-6 py-3 bg-cinema-accent text-cinema-primary font-medium rounded-md hover:bg-cinema-accent/90 transition-colors"
                  >
                    Book Tickets
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Movies sections */}
        <div className="container mx-auto px-6">
          <MovieGrid title="Now Showing" movies={nowShowingMovies || []} />
          <MovieGrid title="Coming Soon" movies={upcomingMovies || []} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
