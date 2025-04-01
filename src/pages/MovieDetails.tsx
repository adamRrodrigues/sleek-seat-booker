import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Calendar, Film, User } from "lucide-react";
import { Showtime, Theatre } from "../types";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShowtimeSelector from "../components/ShowtimeSelector";
import SeatMap from "../components/SeatMap";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useMovie } from "@/hooks/useMovies";
import { Database } from "../integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useBookTickets } from "@/hooks/useBookTickets";
import GooglePayButton from "@google-pay/button-react";

// Define the type for Seat from the SeatMap component

type Seat = {
  id: string;
  row: string;
  number: number;
  status: "available" | "occupied"; // Assuming 'available' or 'occupied' for now
};

const getYouTubeEmbedUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  let videoId = null;
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.substring(1);
    } else if (parsedUrl.hostname.includes("youtube.com")) {
      videoId = parsedUrl.searchParams.get("v");
    }
  } catch (e) {
    console.error("Error parsing trailer URL:", e);
    return null; // Invalid URL format
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`; // Added some common parameters
  }
  return null; // Not a recognizable YouTube URL
};
const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const {
    mutate: bookTickets,
    isError: bookingIsError,
    error: bookingError,
  } = useBookTickets();

  const { data: movie, isLoading, error } = useMovie(id);
  const [selectedShowtime, setSelectedShowtime] = useState<
    Database["public"]["Tables"]["showtimes"]["Row"] | null
  >(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<"showtime" | "seats" | "summary">(
    "showtime"
  );
  const [theatre, setTheatre] = useState<
    Database["public"]["Tables"]["theatre"]["Row"] | null
  >(null);

  const trailerEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl(movie?.trailer),
    [movie?.trailer]
  );

  useEffect(() => {
    if (error) {
      toast.error("Failed to load movie details");
      navigate("/not-found");
    }
  }, [error, navigate]);

  const handleShowtimeSelect = async (
    showtime: Database["public"]["Tables"]["showtimes"]["Row"]
  ) => {
    // Check if user is logged in before allowing seat selection
    if (!user) {
      toast.error("Please sign in to book tickets");
      navigate("/auth");
      return;
    }

    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    setStep("seats");

    // Fetch theatre details based on showtime.cinema_id
    const { data: theatreData, error: theatreError } = await supabase
      .from("theatre")
      .select("*")
      .eq("id", showtime.cinema_id)
      .single();

    if (theatreError) {
      toast.error("Failed to load theatre details");
      console.error("Error fetching theatre:", theatreError);
      return;
    }

    setTheatre(theatreData || null);
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats((prev) => {
      // If seat is already selected, remove it
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
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

    setStep("summary");
  };

  const handleConfirmBooking = () => {
    // Session check is good, but the hook handles its own internal check too
    if (!user || !selectedShowtime) {
      toast.error("User not logged in or showtime not selected.");
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    bookTickets(
      {
        showtimeId: selectedShowtime.id,
        selectedSeatIds: selectedSeats,
      },
      {
        // Optional callbacks specific to this invocation
        onSuccess: (data) => {
          // Additional success logic specific to this component if needed
          console.log("Booking confirmed in component:", data);
          // Reset UI state (already handled in the hook's onSuccess, but can be done here too)
          setSelectedShowtime(null);
          setSelectedSeats([]);
          setStep("showtime");
          setTheatre(null);
        },
        onError: (error) => {
          // Additional error handling specific to this component if needed
          console.error("Booking failed in component:", error);
        },
      }
    );
    navigate("/profile");
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cinema-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Movie not found</h2>
          <p className="mb-4">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-cinema-accent text-cinema-primary rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Movie details header */}
        <div className="relative h-[50vh] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover animate-fade-in animate-fill-both" // Keep poster styling
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <div className="container mx-auto">
              <div className="max-w-3xl animate-slide-up animate-fill-both">
                <div className="flex space-x-2 mb-2">
                  {movie.genre.map((genre, index) => (
                    <span
                      key={index}
                      className="text-xs md:text-sm px-2 py-1 bg-white/10 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{movie.duration}</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>
                      {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
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
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-3 py-2 bg-cinema-card rounded-md"
                  >
                    <User size={16} className="text-cinema-muted" />
                    <span>{actor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - Booking section */}
            <div className="lg:col-span-2 animate-fade-in animate-fill-both animate-delay-100">
              {movie.status === "now-showing" ? (
                <>
                  {step === "showtime" && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Book Tickets
                      </h2>
                      <ShowtimeSelector
                        movieId={movie.id} // Pass the movieId to the ShowtimeSelector
                        onSelect={handleShowtimeSelect}
                      />
                    </div>
                  )}

                  {step === "seats" && selectedShowtime && theatre && (
                    <div className="animate-fade-in animate-fill-both">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Select Seats</h2>
                        <button
                          onClick={() => setStep("showtime")}
                          className="text-cinema-accent hover:underline"
                        >
                          Change Showtime
                        </button>
                      </div>

                      <div className="bg-cinema-card p-4 rounded-md mb-4">
                        <p className="font-medium">{theatre?.name}</p>
                        <p className="text-sm text-cinema-muted">
                          {selectedShowtime &&
                            new Date(
                              selectedShowtime.showtime
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                          • {selectedShowtime?.showtime}
                        </p>
                      </div>

                      <SeatMap
                        screenId={selectedShowtime.screen_number}
                        showtimeId={selectedShowtime.id} // Pass showtimeId
                        selectedSeats={selectedSeats}
                        onSeatSelect={handleSeatSelect}
                      />

                      <div className="mt-8 flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Selected Seats: {selectedSeats.length}
                          </p>
                        </div>

                        <button
                          onClick={handleBooking}
                          disabled={selectedSeats.length === 0}
                          className={`px-6 py-3 rounded-md font-medium ${
                            selectedSeats.length > 0
                              ? "bg-cinema-accent text-cinema-primary hover:bg-cinema-accent/90"
                              : "bg-cinema-muted/30 text-cinema-muted cursor-not-allowed"
                          } transition-colors`}
                        >
                          Continue to Booking
                        </button>
                      </div>
                    </div>
                  )}

                  {step === "summary" && selectedShowtime && theatre && (
                    <div className="animate-fade-in animate-fill-both">
                      <h2 className="text-2xl font-semibold mb-6">
                        Booking Summary
                      </h2>

                      <div className="bg-cinema-card p-6 rounded-lg mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-cinema-muted/10">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {movie.title}
                            </h3>
                            <p className="text-cinema-muted">
                              {movie.duration}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="text-xs px-2 py-1 bg-cinema-accent/20 text-cinema-accent rounded-full">
                              {movie.status === "now-showing"
                                ? "Now Showing"
                                : "Coming Soon"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-cinema-muted">Theatre</span>
                            <span className="font-medium">{theatre?.name}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-cinema-muted">
                              Date & Time
                            </span>
                            <span className="font-medium">
                              {selectedShowtime &&
                                new Date(
                                  selectedShowtime.showtime
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                              •{" "}
                              {new Date(
                                selectedShowtime.showtime
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-cinema-muted">Seats</span>
                            <span className="font-medium">
                              {selectedSeats.join(", ")}
                            </span>
                          </div>

                          <div className="flex justify-between pt-4 border-t border-cinema-muted/10">
                            <span className="font-semibold">Total Amount</span>
                            <span className="font-semibold">
                              ₹
                              {(
                                selectedSeats.length * selectedShowtime.price
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                        <button
                          onClick={() => setStep("seats")}
                          className="px-6 py-3 bg-cinema-card hover:bg-cinema-card-hover text-cinema-primary rounded-md font-medium transition-colors"
                        >
                          Go Back
                        </button>
                        <GooglePayButton
                          environment="TEST"
                          buttonSizeMode="fill"
                          paymentRequest={{
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            allowedPaymentMethods: [
                              {
                                type: "CARD",
                                parameters: {
                                  allowedAuthMethods: [
                                    "PAN_ONLY",
                                    "CRYPTOGRAM_3DS",
                                  ],
                                  allowedCardNetworks: ["MASTERCARD", "VISA"],
                                },
                                tokenizationSpecification: {
                                  type: "PAYMENT_GATEWAY",
                                  parameters: {
                                    gateway: "example",
                                    gatewayMerchantId:
                                      "exampleGatewayMerchantId",
                                  },
                                },
                              },
                            ],
                            merchantInfo: {
                              merchantId: "BCR2DN4T27N7TWJ4",
                              merchantName: "Demo Only",
                            },
                            transactionInfo: {
                              totalPriceStatus: "FINAL",
                              totalPriceLabel: "Total",
                              totalPrice: "0",
                              // totalPrice: 0,
                              currencyCode: "INR",
                              countryCode: "IN",
                            },
                          }}
                          onLoadPaymentData={(paymentRequest) => {
                            console.log("load payment data", paymentRequest);
                            handleConfirmBooking;
                          }}
                        />
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
                  <p className="text-cinema-muted mb-6">
                    This movie is not yet available for booking.
                  </p>
                  <p className="text-sm">
                    Expected release date:{" "}
                    {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
          {step == "showtime" && (
            <>
              <h2 className="text-xl font-semibold mb-4 mt-6 lg:mt-0">
                Trailer
              </h2>
              {trailerEmbedUrl ? (
                <iframe
                  src={trailerEmbedUrl}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-[20em] md:h-[30em] lg:h-[40em]" // Ensure iframe fills the container
                ></iframe>
              ) : (
                <p className="text-sm">
                  Sorry.This movie does not have a trailer yet
                </p>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
