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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      gift_categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      gift_order_items: {
        Row: {
          amount_cents: number
          category: string | null
          gift_id: string
          id: string
          name: string
          order_id: string
          quantity: number
        }
        Insert: {
          amount_cents: number
          category?: string | null
          gift_id: string
          id?: string
          name: string
          order_id: string
          quantity: number
        }
        Update: {
          amount_cents?: number
          category?: string | null
          gift_id?: string
          id?: string
          name?: string
          order_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "gift_order_items_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "gift_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_orders: {
        Row: {
          amount_cents: number
          anonymous: boolean
          created_at: string
          email: string
          expires_at: string
          guest_name: string
          id: string
          lookup_token: string
          message: string | null
          method: string
          paid_at: string | null
          provider: string
          provider_reference: string | null
          status: string
        }
        Insert: {
          amount_cents: number
          anonymous?: boolean
          created_at?: string
          email: string
          expires_at?: string
          guest_name: string
          id?: string
          lookup_token?: string
          message?: string | null
          method: string
          paid_at?: string | null
          provider?: string
          provider_reference?: string | null
          status?: string
        }
        Update: {
          amount_cents?: number
          anonymous?: boolean
          created_at?: string
          email?: string
          expires_at?: string
          guest_name?: string
          id?: string
          lookup_token?: string
          message?: string | null
          method?: string
          paid_at?: string | null
          provider?: string
          provider_reference?: string | null
          status?: string
        }
        Relationships: []
      }
      gifts: {
        Row: {
          available: boolean
          category_id: string | null
          created_at: string
          description: string
          enabled: boolean
          funded_cents: number
          id: string
          image_path: string | null
          name: string
          price_cents: number
          purchased_quantity: number
          quantity: number
          sort_order: number
          target_cents: number | null
        }
        Insert: {
          available?: boolean
          category_id?: string | null
          created_at?: string
          description?: string
          enabled?: boolean
          funded_cents?: number
          id?: string
          image_path?: string | null
          name: string
          price_cents: number
          purchased_quantity?: number
          quantity?: number
          sort_order?: number
          target_cents?: number | null
        }
        Update: {
          available?: boolean
          category_id?: string | null
          created_at?: string
          description?: string
          enabled?: boolean
          funded_cents?: number
          id?: string
          image_path?: string | null
          name?: string
          price_cents?: number
          purchased_quantity?: number
          quantity?: number
          sort_order?: number
          target_cents?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gifts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gift_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhook_events: {
        Row: {
          created_at: string
          event_id: string
          id: string
          order_id: string
          provider: string
          status: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          order_id: string
          provider: string
          status: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          order_id?: string
          provider?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_webhook_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "gift_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          attending: boolean
          created_at: string
          dietary: string | null
          email: string
          id: string
          message: string | null
          name: string
          party_size: number
        }
        Insert: {
          attending: boolean
          created_at?: string
          dietary?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          party_size?: number
        }
        Update: {
          attending?: boolean
          created_at?: string
          dietary?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          party_size?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_gift_payment: {
        Args: {
          p_amount: number
          p_event_id: string
          p_provider: string
          p_reference: string
          p_status: string
        }
        Returns: boolean
      }
      reserve_gifts: {
        Args: {
          p_anonymous: boolean
          p_email: string
          p_guest_name: string
          p_items: Json
          p_message: string
          p_method: string
        }
        Returns: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
