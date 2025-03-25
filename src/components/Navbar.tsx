
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Film } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="glassmorphism sticky top-0 z-50 px-6 py-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Film size={24} className="text-cinema-primary" />
          <span className="text-xl font-semibold text-cinema-primary">CineVerse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-cinema-primary hover:text-cinema-accent transition-colors">Home</Link>
          <Link to="/movies" className="text-cinema-primary hover:text-cinema-accent transition-colors">Movies</Link>
          <Link to="/theatres" className="text-cinema-primary hover:text-cinema-accent transition-colors">Theatres</Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-cinema-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glassmorphism py-4 animate-fade-in">
          <div className="container mx-auto flex flex-col space-y-4 px-6">
            <Link 
              to="/" 
              className="text-cinema-primary hover:text-cinema-accent transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className="text-cinema-primary hover:text-cinema-accent transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              to="/theatres" 
              className="text-cinema-primary hover:text-cinema-accent transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Theatres
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
