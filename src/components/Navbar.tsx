import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Film, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  return (
    <nav className="glassmorphism sticky top-0 z-50 px-6 py-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Film size={24} className="text-cinema-primary" />
          <span className="text-xl font-semibold text-cinema-primary">
            CineVerse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-cinema-primary hover:text-cinema-accent transition-colors"
          >
            Home
          </Link>
          <Link
            to="/movies"
            className="text-cinema-primary hover:text-cinema-accent transition-colors"
          >
            Movies
          </Link>
          <Link
            to="/theatres"
            className="text-cinema-primary hover:text-cinema-accent transition-colors"
          >
            Theatres
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-cinema-primary flex items-center">
                <User size={16} className="mr-1" />
                {user.user_metadata.username}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center text-cinema-primary hover:text-cinema-accent transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center text-cinema-primary hover:text-cinema-accent transition-colors"
            >
              <LogIn size={16} className="mr-1" />
              Sign In
            </Link>
          )}
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

            {user ? (
              <>
                <div className="text-cinema-primary py-2 flex items-center">
                  <User size={16} className="mr-2" />
                  {user.email?.split("@")[0]}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-cinema-primary hover:text-cinema-accent transition-colors py-2"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center text-cinema-primary hover:text-cinema-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={16} className="mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
