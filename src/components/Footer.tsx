
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 px-6 bg-cinema-card border-t border-cinema-muted/10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-cinema-primary/80 text-sm">
              &copy; {new Date().getFullYear()} CineVerse. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center text-cinema-primary/80 text-sm">
            <span>Made with</span>
            <Heart size={14} className="mx-1 text-cinema-accent" />
            <span>by CineVerse</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
