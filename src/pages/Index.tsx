
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { movies } from '../data';
import { Movie } from '../types';
import MovieGrid from '../components/MovieGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Index = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);

  useEffect(() => {
    // Filter movies by status
    const nowShowingMovies = movies.filter(movie => movie.status === 'now-showing');
    const upcomingMovies = movies.filter(movie => movie.status === 'upcoming');
    
    // Set featured movie (first now showing movie)
    setFeaturedMovie(nowShowingMovies[0] || null);
    
    // Set movies by category
    setNowShowing(nowShowingMovies);
    setUpcoming(upcomingMovies);
  }, []);

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
          <MovieGrid title="Now Showing" movies={nowShowing} />
          <MovieGrid title="Coming Soon" movies={upcoming} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
