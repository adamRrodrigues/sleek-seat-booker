export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string | null;
          id: number;
          number_of_tickets: number;
          showtime_id: number | null;
          total_amount: number | null;
          user_id: string | null;
        };
        Insert: {
          booking_date?: string | null;
          id?: number;
          number_of_tickets: number;
          showtime_id?: number | null;
          total_amount?: number | null;
          user_id?: string | null;
        };
        Update: {
          booking_date?: string | null;
          id?: number;
          number_of_tickets?: number;
          showtime_id?: number | null;
          total_amount?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_showtime_id_fkey";
            columns: ["showtime_id"];
            isOneToOne: false;
            referencedRelation: "showtimes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      movies: {
        Row: {
          actors: string[];
          created_at: string;
          description: string;
          director: string;
          duration: string;
          genre: string[];
          id: string;
          movie_trailer: string | null;
          poster: string;
          release_date: string;
          status: string;
          title: string;
        };
        Insert: {
          actors: string[];
          created_at?: string;
          description: string;
          director: string;
          duration: string;
          genre: string[];
          id?: string;
          movie_trailer?: string | null;
          poster: string;
          release_date: string;
          status: string;
          title: string;
        };
        Update: {
          actors?: string[];
          created_at?: string;
          description?: string;
          director?: string;
          duration?: string;
          genre?: string[];
          id?: string;
          movie_trailer?: string | null;
          poster?: string;
          release_date?: string;
          status?: string;
          title?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      screens: {
        Row: {
          id: number;
          screen_number: number;
          theatre_id: number | null;
          total_seats: number;
        };
        Insert: {
          id?: number;
          screen_number: number;
          theatre_id?: number | null;
          total_seats: number;
        };
        Update: {
          id?: number;
          screen_number?: number;
          theatre_id?: number | null;
          total_seats?: number;
        };
        Relationships: [
          {
            foreignKeyName: "screens_theatre_id_fkey";
            columns: ["theatre_id"];
            isOneToOne: false;
            referencedRelation: "theatre";
            referencedColumns: ["id"];
          }
        ];
      };
      seat_reservations: {
        Row: {
          booking_id: number | null;
          id: number;
          seat_id: number | null;
          showtime_id: number | null;
        };
        Insert: {
          booking_id?: number | null;
          id?: number;
          seat_id?: number | null;
          showtime_id?: number | null;
        };
        Update: {
          booking_id?: number | null;
          id?: number;
          seat_id?: number | null;
          showtime_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "seat_reservations_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "seat_reservations_seat_id_fkey";
            columns: ["seat_id"];
            isOneToOne: false;
            referencedRelation: "seats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "seat_reservations_showtime_id_fkey";
            columns: ["showtime_id"];
            isOneToOne: false;
            referencedRelation: "showtimes";
            referencedColumns: ["id"];
          }
        ];
      };
      seats: {
        Row: {
          id: number;
          row_letter: string;
          screen_id: number | null;
          seat_number: number;
        };
        Insert: {
          id?: number;
          row_letter: string;
          screen_id?: number | null;
          seat_number: number;
        };
        Update: {
          id?: number;
          row_letter?: string;
          screen_id?: number | null;
          seat_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "seats_screen_id_fkey";
            columns: ["screen_id"];
            isOneToOne: false;
            referencedRelation: "screens";
            referencedColumns: ["id"];
          }
        ];
      };
      showtimes: {
        Row: {
          cinema_id: number | null;
          id: number;
          movie_id: string | null;
          price: number;
          screen_number: number | null;
          showtime: string;
        };
        Insert: {
          cinema_id?: number | null;
          id?: number;
          movie_id?: string | null;
          price: number;
          screen_number?: number | null;
          showtime: string;
        };
        Update: {
          cinema_id?: number | null;
          id?: number;
          movie_id?: string | null;
          price?: number;
          screen_number?: number | null;
          showtime?: string;
        };
        Relationships: [
          {
            foreignKeyName: "showtimes_cinema_id_fkey";
            columns: ["cinema_id"];
            isOneToOne: false;
            referencedRelation: "theatre";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "showtimes_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      theatre: {
        Row: {
          address: string | null;
          city: string | null;
          id: number;
          name: string;
          state: string | null;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          id?: number;
          name: string;
          state?: string | null;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          id?: number;
          name?: string;
          state?: string | null;
          zip_code?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      book_multiple_seats: {
        Args: {
          p_showtime_id: string;
          p_seat_ids: string[];
          p_user_id: string;
        };
        Returns: {
          success: boolean;
          message: string;
          booking_reference: string;
        }[];
      };
      book_seat: {
        Args: {
          p_showtime_id: string;
          p_seat_id: string;
          p_user_id: string;
        };
        Returns: {
          success: boolean;
          message: string;
          booking_reference: string;
        }[];
      };
      create_seats_for_showtime: {
        Args: {
          p_showtime_id: string;
        };
        Returns: undefined;
      };
      decrement: {
        Args: {
          row_id: string;
          num_seats: number;
        };
        Returns: number;
      };
      get_auth_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_available_seats: {
        Args: {
          p_showtime_id: string;
        };
        Returns: {
          seat_id: string;
          status: string;
          row_letter: string;
          seat_number: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
