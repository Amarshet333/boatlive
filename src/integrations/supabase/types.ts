export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      boats: {
        Row: {
          approved: boolean
          capacity: number
          created_at: string
          description: string | null
          duration: string
          features: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          name: string
          price: number
          rating: number | null
          reviews_count: number | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          approved?: boolean
          capacity: number
          created_at?: string
          description?: string | null
          duration: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name: string
          price: number
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          approved?: boolean
          capacity?: number
          created_at?: string
          description?: string | null
          duration?: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name?: string
          price?: number
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boats_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          boat_id: string | null
          booking_date: string | null
          booking_time: string | null
          booking_type: string
          check_in: string | null
          check_out: string | null
          created_at: string
          guests: number
          id: string
          payment_id: string | null
          payment_status: string
          resort_id: string | null
          room_type: string | null
          service_fee: number
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          boat_id?: string | null
          booking_date?: string | null
          booking_time?: string | null
          booking_type: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          guests?: number
          id?: string
          payment_id?: string | null
          payment_status?: string
          resort_id?: string | null
          room_type?: string | null
          service_fee?: number
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          boat_id?: string | null
          booking_date?: string | null
          booking_time?: string | null
          booking_type?: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          guests?: number
          id?: string
          payment_id?: string | null
          payment_status?: string
          resort_id?: string | null
          room_type?: string | null
          service_fee?: number
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_boat_id_fkey"
            columns: ["boat_id"]
            isOneToOne: false
            referencedRelation: "boats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          boat_id: string | null
          created_at: string
          id: string
          resort_id: string | null
          user_id: string
        }
        Insert: {
          boat_id?: string | null
          created_at?: string
          id?: string
          resort_id?: string | null
          user_id: string
        }
        Update: {
          boat_id?: string | null
          created_at?: string
          id?: string
          resort_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_boat_id_fkey"
            columns: ["boat_id"]
            isOneToOne: false
            referencedRelation: "boats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resorts: {
        Row: {
          approved: boolean
          created_at: string
          description: string | null
          facilities: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          name: string
          price_per_night: number
          rating: number | null
          reviews_count: number | null
          room_types: string[] | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          approved?: boolean
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name: string
          price_per_night: number
          rating?: number | null
          reviews_count?: number | null
          room_types?: string[] | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          approved?: boolean
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name?: string
          price_per_night?: number
          rating?: number | null
          reviews_count?: number | null
          room_types?: string[] | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resorts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          boat_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number
          resort_id: string | null
          user_id: string
        }
        Insert: {
          boat_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          resort_id?: string | null
          user_id: string
        }
        Update: {
          boat_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          resort_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_boat_id_fkey"
            columns: ["boat_id"]
            isOneToOne: false
            referencedRelation: "boats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "resorts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          approved: boolean
          business_name: string
          created_at: string
          email: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          business_name: string
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          business_name?: string
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "vendor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "vendor", "user"],
    },
  },
} as const
