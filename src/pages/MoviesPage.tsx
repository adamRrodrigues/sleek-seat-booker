import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMovies } from "@/hooks/useMovies";
import { Movie } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import MovieCard from "@/components/MovieCard";
import MovieGrid from "@/components/MovieGrid";

const MoviesPage = () => {
  // Fetch all movies initially, sorting will happen on the client
  const { data: movies, isLoading, error } = useMovies();
  const [moviesSearch, setMoviesSearch] = useState("");

  // Memoize the sorted list to prevent re-sorting on every render
  const sortedMovies = useMemo(() => {
    if (!movies) return [];
    return [
      ...movies.filter((item) =>
        item.title.toLowerCase().includes(moviesSearch)
      ),
    ].sort((a, b) => {
      // Prioritize 'now-showing'
      if (a.status === "now-showing" && b.status === "upcoming") return -1;
      if (a.status === "upcoming" && b.status === "now-showing") return 1;

      // If statuses are the same, sort alphabetically by title
      return a.title.localeCompare(b.title);
    });
  }, [movies, moviesSearch]); // Re-sort only when the movies data changes

  return (
    <div className="flex flex-col min-h-screen bg-cinema-background text-cinema-primary">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="px-6">
          <input
            placeholder="Search Movies"
            onChange={(e) => setMoviesSearch(e.target.value)}
            className="w-full h-[2em] px-2 border-2 border-cinema-muted  rounded-md"
          />
        </div>
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-cinema-accent border-t-transparent rounded-full"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500">
            <p>Failed to load movies. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{(error as Error)?.message}</p>
          </div>
        )}

        {!isLoading && !error && sortedMovies.length === 0 && (
          <div className="text-center py-20 text-cinema-muted">
            <p>No movies found.</p>
          </div>
        )}

        {!isLoading && !error && sortedMovies.length > 0 && (
          <div className="container mx-auto px-6">
            <MovieGrid title="All Movies" movies={sortedMovies || []} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MoviesPage;
