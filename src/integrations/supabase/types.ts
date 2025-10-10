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
      document_templates: {
        Row: {
          category: string
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          estimated_days: number | null
          id: string
          is_critical_milestone: boolean | null
          name: string
          phase_name: string
          template_content: string | null
          typical_owner: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          estimated_days?: number | null
          id?: string
          is_critical_milestone?: boolean | null
          name: string
          phase_name: string
          template_content?: string | null
          typical_owner?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          estimated_days?: number | null
          id?: string
          is_critical_milestone?: boolean | null
          name?: string
          phase_name?: string
          template_content?: string | null
          typical_owner?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          approval_status: string | null
          approved_by: string | null
          approved_date: string | null
          content: string | null
          created_at: string
          document_category: string | null
          document_template_id: string | null
          editor_state: Json | null
          id: string
          is_critical_milestone: boolean | null
          name: string
          phase: string
          phase_id: string | null
          project_id: string
          status: string
          type: string
          updated_at: string
          upload_date: string
          url: string | null
          version: string
        }
        Insert: {
          approval_status?: string | null
          approved_by?: string | null
          approved_date?: string | null
          content?: string | null
          created_at?: string
          document_category?: string | null
          document_template_id?: string | null
          editor_state?: Json | null
          id?: string
          is_critical_milestone?: boolean | null
          name: string
          phase: string
          phase_id?: string | null
          project_id: string
          status?: string
          type: string
          updated_at?: string
          upload_date?: string
          url?: string | null
          version?: string
        }
        Update: {
          approval_status?: string | null
          approved_by?: string | null
          approved_date?: string | null
          content?: string | null
          created_at?: string
          document_category?: string | null
          document_template_id?: string | null
          editor_state?: Json | null
          id?: string
          is_critical_milestone?: boolean | null
          name?: string
          phase?: string
          phase_id?: string | null
          project_id?: string
          status?: string
          type?: string
          updated_at?: string
          upload_date?: string
          url?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_document_template_id_fkey"
            columns: ["document_template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          priority: string
          project_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          priority: string
          project_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_blueprints: {
        Row: {
          assumptions: string[]
          constraints: string[]
          created_at: string
          id: string
          project_id: string
          purpose: string
          success_metrics: string[]
          updated_at: string
          validation_criteria: string[]
        }
        Insert: {
          assumptions?: string[]
          constraints?: string[]
          created_at?: string
          id?: string
          project_id: string
          purpose: string
          success_metrics?: string[]
          updated_at?: string
          validation_criteria?: string[]
        }
        Update: {
          assumptions?: string[]
          constraints?: string[]
          created_at?: string
          id?: string
          project_id?: string
          purpose?: string
          success_metrics?: string[]
          updated_at?: string
          validation_criteria?: string[]
        }
        Relationships: []
      }
      project_document_checklist: {
        Row: {
          assigned_to: string | null
          completed_date: string | null
          completion_status: string | null
          created_at: string | null
          document_id: string | null
          document_template_id: string | null
          due_date: string | null
          id: string
          is_required: boolean | null
          notes: string | null
          phase_id: string | null
          project_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_date?: string | null
          completion_status?: string | null
          created_at?: string | null
          document_id?: string | null
          document_template_id?: string | null
          due_date?: string | null
          id?: string
          is_required?: boolean | null
          notes?: string | null
          phase_id?: string | null
          project_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_date?: string | null
          completion_status?: string | null
          created_at?: string | null
          document_id?: string | null
          document_template_id?: string | null
          due_date?: string | null
          id?: string
          is_required?: boolean | null
          notes?: string | null
          phase_id?: string | null
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_document_checklist_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_document_checklist_document_template_id_fkey"
            columns: ["document_template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_document_checklist_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          created_at: string | null
          end_date: string | null
          gate_approval_date: string | null
          gate_approved: boolean | null
          gate_approved_by: string | null
          id: string
          phase_name: string
          phase_number: number
          project_id: string
          start_date: string | null
          status: string | null
          target_end_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          gate_approval_date?: string | null
          gate_approved?: boolean | null
          gate_approved_by?: string | null
          id?: string
          phase_name: string
          phase_number: number
          project_id: string
          start_date?: string | null
          status?: string | null
          target_end_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          gate_approval_date?: string | null
          gate_approved?: boolean | null
          gate_approved_by?: string | null
          id?: string
          phase_name?: string
          phase_number?: number
          project_id?: string
          start_date?: string | null
          status?: string | null
          target_end_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
