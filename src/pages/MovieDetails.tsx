
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, Film, User } from 'lucide-react';
import { movies, theatres, showtimes } from '../data';
import { Movie, Showtime, Seat } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShowtimeSelector from '../components/ShowtimeSelector';
import SeatMap from '../components/SeatMap';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieShowtimes, setMovieShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<'showtime' | 'seats' | 'summary'>('showtime');
  
  useEffect(() => {
    // Find movie by id
    const foundMovie = movies.find(m => m.id === id);
    if (foundMovie) {
      setMovie(foundMovie);
      
      // Filter showtimes for this movie
      const movieShowtimes = showtimes.filter(st => st.movieId === foundMovie.id);
      setMovieShowtimes(movieShowtimes);
    } else {
      // Redirect to not found page if movie doesn't exist
      navigate('/not-found');
    }
  }, [id, navigate]);
  
  const handleShowtimeSelect = (showtime: Showtime) => {
    // Check if user is logged in before allowing seat selection
    if (!user) {
      toast.error("Please sign in to book tickets");
      navigate('/auth');
      return;
    }
    
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    setStep('seats');
  };
  
  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => {
      // If seat is already selected, remove it
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      // Otherwise add it
      return [...prev, seatId];
    });
  };
  
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    
    setStep('summary');
  };
  
  const handleConfirmBooking = () => {
    toast.success("Tickets booked successfully!");
    // In a real app, you would send booking data to a server
    // Reset the form
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setStep('showtime');
  };
  
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cinema-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Find the theatre for the selected showtime
  const selectedTheatre = selectedShowtime 
    ? theatres.find(t => t.id === selectedShowtime.theatreId) 
    : null;
  
  // Find the screen for the selected showtime
  const selectedScreen = selectedTheatre && selectedShowtime
    ? selectedTheatre.screens.find(s => s.id === selectedShowtime.screenId)
    : null;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Movie details header */}
        <div className="relative h-[50vh] overflow-hidden">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover animate-fade-in animate-fill-both"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <div className="container mx-auto">
              <div className="max-w-3xl animate-slide-up animate-fill-both">
                <div className="flex space-x-2 mb-2">
                  {movie.genre.map((genre, index) => (
                    <span key={index} className="text-xs md:text-sm px-2 py-1 bg-white/10 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold mb-3">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{movie.duration}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Film size={16} className="mr-1" />
                    <span>{movie.director}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left column - Movie details */}
            <div className="lg:col-span-1 animate-fade-in animate-fill-both">
              <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
              <p className="mb-8 text-cinema-primary/80">{movie.description}</p>
              
              <h2 className="text-xl font-semibold mb-4">Cast</h2>
              <div className="flex flex-wrap gap-3 mb-8">
                {movie.cast.map((actor, index) => (
                  <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-cinema-card rounded-md">
                    <User size={16} className="text-cinema-muted" />
                    <span>{actor}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column - Booking section */}
            <div className="lg:col-span-2 animate-fade-in animate-fill-both animate-delay-100">
              {movie.status === 'now-showing' ? (
                <>
                  {step === 'showtime' && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">Book Tickets</h2>
                      <ShowtimeSelector 
                        showtimes={movieShowtimes} 
                        theatres={theatres} 
                        onSelect={handleShowtimeSelect} 
                      />
                    </div>
                  )}
                  
                  {step === 'seats' && selectedScreen && (
                    <div className="animate-fade-in animate-fill-both">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Select Seats</h2>
                        <button 
                          onClick={() => setStep('showtime')}
                          className="text-cinema-accent hover:underline"
                        >
                          Change Showtime
                        </button>
                      </div>
                      
                      <div className="bg-cinema-card p-4 rounded-md mb-4">
                        <p className="font-medium">{selectedTheatre?.name} • {selectedScreen.name}</p>
                        <p className="text-sm text-cinema-muted">
                          {selectedShowtime && new Date(selectedShowtime.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })} • {selectedShowtime?.time}
                        </p>
                      </div>
                      
                      <SeatMap 
                        screen={selectedScreen}
                        selectedSeats={selectedSeats}
                        onSeatSelect={handleSeatSelect}
                      />
                      
                      <div className="mt-8 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Selected Seats: {selectedSeats.length}</p>
                          <p className="text-sm text-cinema-muted">
                            {selectedSeats.join(', ')}
                          </p>
                        </div>
                        
                        <button 
                          onClick={handleBooking}
                          disabled={selectedSeats.length === 0}
                          className={`px-6 py-3 rounded-md font-medium ${
                            selectedSeats.length > 0
                              ? 'bg-cinema-accent text-cinema-primary hover:bg-cinema-accent/90'
                              : 'bg-cinema-muted/30 text-cinema-muted cursor-not-allowed'
                          } transition-colors`}
                        >
                          Continue to Booking
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {step === 'summary' && (
                    <div className="animate-fade-in animate-fill-both">
                      <h2 className="text-2xl font-semibold mb-6">Booking Summary</h2>
                      
                      <div className="bg-cinema-card p-6 rounded-lg mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-cinema-muted/10">
                          <div>
                            <h3 className="font-semibold text-lg">{movie.title}</h3>
                            <p className="text-cinema-muted">{movie.duration}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="text-xs px-2 py-1 bg-cinema-accent/20 text-cinema-accent rounded-full">
                              {movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-cinema-muted">Theatre</span>
                            <span className="font-medium">{selectedTheatre?.name}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-cinema-muted">Date & Time</span>
                            <span className="font-medium">
                              {selectedShowtime && new Date(selectedShowtime.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric'
                              })} • {selectedShowtime?.time}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-cinema-muted">Seats</span>
                            <span className="font-medium">{selectedSeats.join(', ')}</span>
                          </div>
                          
                          <div className="flex justify-between pt-4 border-t border-cinema-muted/10">
                            <span className="font-semibold">Total Amount</span>
                            <span className="font-semibold">${(selectedSeats.length * 12).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                        <button 
                          onClick={() => setStep('seats')}
                          className="px-6 py-3 bg-cinema-card hover:bg-cinema-card-hover text-cinema-primary rounded-md font-medium transition-colors"
                        >
                          Go Back
                        </button>
                        
                        <button 
                          onClick={handleConfirmBooking}
                          className="px-6 py-3 bg-cinema-accent text-cinema-primary rounded-md font-medium hover:bg-cinema-accent/90 transition-colors"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-cinema-card p-8 rounded-lg text-center">
                  <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
                  <p className="text-cinema-muted mb-6">This movie is not yet available for booking.</p>
                  <p className="text-sm">Expected release date: {new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
