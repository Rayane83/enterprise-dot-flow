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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      action_logs: {
        Row: {
          action_description: string
          action_type: string
          created_at: string
          enterprise_id: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_description: string
          action_type: string
          created_at?: string
          enterprise_id: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_description?: string
          action_type?: string
          created_at?: string
          enterprise_id?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_settings: {
        Row: {
          created_at: string
          dot_guild_dot_role_id: string | null
          dot_guild_id: string | null
          dot_guild_staff_role_id: string | null
          enterprise_id: string
          id: string
          main_guild_co_patron_role_id: string | null
          main_guild_enterprise_role_id: string | null
          main_guild_id: string | null
          main_guild_patron_role_id: string | null
          main_guild_staff_role_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dot_guild_dot_role_id?: string | null
          dot_guild_id?: string | null
          dot_guild_staff_role_id?: string | null
          enterprise_id: string
          id?: string
          main_guild_co_patron_role_id?: string | null
          main_guild_enterprise_role_id?: string | null
          main_guild_id?: string | null
          main_guild_patron_role_id?: string | null
          main_guild_staff_role_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dot_guild_dot_role_id?: string | null
          dot_guild_id?: string | null
          dot_guild_staff_role_id?: string | null
          enterprise_id?: string
          id?: string
          main_guild_co_patron_role_id?: string | null
          main_guild_enterprise_role_id?: string | null
          main_guild_id?: string | null
          main_guild_patron_role_id?: string | null
          main_guild_staff_role_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      parametrage: {
        Row: {
          active_version: string
          bonus_max_boss: number
          bonus_max_employee: number
          close_datetime: string
          created_at: string
          effective_from: string | null
          effective_to: string | null
          enterprise_id: string
          id: string
          open_datetime: string
          salary_max_boss: number
          salary_max_employee: number
          tax_brackets: Json
          updated_at: string
          wealth_tax_brackets: Json
        }
        Insert: {
          active_version?: string
          bonus_max_boss?: number
          bonus_max_employee?: number
          close_datetime: string
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          enterprise_id: string
          id?: string
          open_datetime: string
          salary_max_boss?: number
          salary_max_employee?: number
          tax_brackets?: Json
          updated_at?: string
          wealth_tax_brackets?: Json
        }
        Update: {
          active_version?: string
          bonus_max_boss?: number
          bonus_max_employee?: number
          close_datetime?: string
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          enterprise_id?: string
          id?: string
          open_datetime?: string
          salary_max_boss?: number
          salary_max_employee?: number
          tax_brackets?: Json
          updated_at?: string
          wealth_tax_brackets?: Json
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          discord_id: string
          enterprise_id: string
          id: string
          is_superadmin: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          discord_id: string
          enterprise_id: string
          id?: string
          is_superadmin?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          discord_id?: string
          enterprise_id?: string
          id?: string
          is_superadmin?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          discord_id: string
          enterprise_id: string
          is_superadmin: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
          username: string
        }[]
      }
      log_action: {
        Args: {
          p_action_description: string
          p_action_type: string
          p_new_data?: Json
          p_old_data?: Json
          p_target_id?: string
          p_target_table?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "PATRON" | "CO-PATRON" | "STAFF" | "DOT" | "SUPERSTAFF"
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
      user_role: ["PATRON", "CO-PATRON", "STAFF", "DOT", "SUPERSTAFF"],
    },
  },
} as const
