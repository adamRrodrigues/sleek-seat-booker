export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      movie_cast: {
        Row: {
          avatar_url: string | null
          character: string
          created_at: string
          id: string
          movie_id: string
          name: string
        }
        Insert: {
          avatar_url?: string | null
          character: string
          created_at?: string
          id?: string
          movie_id: string
          name: string
        }
        Update: {
          avatar_url?: string | null
          character?: string
          created_at?: string
          id?: string
          movie_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_cast_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_directors: {
        Row: {
          created_at: string
          id: string
          movie_id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          movie_id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          movie_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_directors_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_genres: {
        Row: {
          genre: string
          id: string
          movie_id: string
        }
        Insert: {
          genre: string
          id?: string
          movie_id: string
        }
        Update: {
          genre?: string
          id?: string
          movie_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_genres_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          backdrop_url: string | null
          created_at: string
          duration: string | null
          id: string
          poster_url: string | null
          rating: number | null
          release_year: number | null
          synopsis: string | null
          tagline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          backdrop_url?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          poster_url?: string | null
          rating?: number | null
          release_year?: number | null
          synopsis?: string | null
          tagline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          backdrop_url?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          poster_url?: string | null
          rating?: number | null
          release_year?: number | null
          synopsis?: string | null
          tagline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          id: string
          movie_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          movie_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          movie_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      showtime_seats: {
        Row: {
          created_at: string | null
          id: string
          seat_id: string
          showtime_id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          seat_id: string
          showtime_id: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          seat_id?: string
          showtime_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "showtime_seats_showtime_id_fkey"
            columns: ["showtime_id"]
            isOneToOne: false
            referencedRelation: "showtimes"
            referencedColumns: ["id"]
          },
        ]
      }
      showtimes: {
        Row: {
          available_seats: number
          created_at: string
          end_time: string
          id: string
          movie_id: string
          price: number
          screen_number: number
          start_time: string
          theater_id: string
          updated_at: string
        }
        Insert: {
          available_seats: number
          created_at?: string
          end_time: string
          id?: string
          movie_id: string
          price: number
          screen_number: number
          start_time: string
          theater_id: string
          updated_at?: string
        }
        Update: {
          available_seats?: number
          created_at?: string
          end_time?: string
          id?: string
          movie_id?: string
          price?: number
          screen_number?: number
          start_time?: string
          theater_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "showtimes_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showtimes_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      theater_amenities: {
        Row: {
          amenity: string
          id: string
          theater_id: string
        }
        Insert: {
          amenity: string
          id?: string
          theater_id: string
        }
        Update: {
          amenity?: string
          id?: string
          theater_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theater_amenities_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      theaters: {
        Row: {
          address: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          phone: string | null
          rating: number | null
          screens: number
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          rating?: number | null
          screens: number
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          rating?: number | null
          screens?: number
          updated_at?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          booking_reference: string
          id: string
          movie_id: string | null
          price: number
          purchase_date: string
          seat_number: string
          showtime_id: string
          status: string
          user_id: string
        }
        Insert: {
          booking_reference: string
          id?: string
          movie_id?: string | null
          price: number
          purchase_date?: string
          seat_number: string
          showtime_id: string
          status?: string
          user_id: string
        }
        Update: {
          booking_reference?: string
          id?: string
          movie_id?: string | null
          price?: number
          purchase_date?: string
          seat_number?: string
          showtime_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_showtime_id_fkey"
            columns: ["showtime_id"]
            isOneToOne: false
            referencedRelation: "showtimes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_multiple_seats: {
        Args: {
          p_showtime_id: string
          p_seat_ids: string[]
          p_user_id: string
        }
        Returns: {
          success: boolean
          message: string
          booking_reference: string
        }[]
      }
      book_seat: {
        Args: {
          p_showtime_id: string
          p_seat_id: string
          p_user_id: string
        }
        Returns: {
          success: boolean
          message: string
          booking_reference: string
        }[]
      }
      create_seats_for_showtime: {
        Args: {
          p_showtime_id: string
        }
        Returns: undefined
      }
      decrement: {
        Args: {
          row_id: string
          num_seats: number
        }
        Returns: number
      }
      get_auth_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_available_seats: {
        Args: {
          p_showtime_id: string
        }
        Returns: {
          seat_id: string
          status: string
          row_letter: string
          seat_number: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
