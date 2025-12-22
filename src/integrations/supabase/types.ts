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
      ai_insights: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          action_items: string[] | null
          affected_projects: string[] | null
          description: string
          generated_at: string
          id: string
          insight_type: string
          severity: string | null
          status: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_items?: string[] | null
          affected_projects?: string[] | null
          description: string
          generated_at?: string
          id?: string
          insight_type: string
          severity?: string | null
          status?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          action_items?: string[] | null
          affected_projects?: string[] | null
          description?: string
          generated_at?: string
          id?: string
          insight_type?: string
          severity?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      ai_predictions: {
        Row: {
          confidence_score: number | null
          expires_at: string | null
          generated_at: string
          id: string
          metadata: Json | null
          model_version: string | null
          prediction_data: Json
          prediction_type: string
          project_id: string
        }
        Insert: {
          confidence_score?: number | null
          expires_at?: string | null
          generated_at?: string
          id?: string
          metadata?: Json | null
          model_version?: string | null
          prediction_data: Json
          prediction_type: string
          project_id: string
        }
        Update: {
          confidence_score?: number | null
          expires_at?: string | null
          generated_at?: string
          id?: string
          metadata?: Json | null
          model_version?: string | null
          prediction_data?: Json
          prediction_type?: string
          project_id?: string
        }
        Relationships: []
      }
      department_evaluation_criteria: {
        Row: {
          created_at: string
          criteria_description: string | null
          criteria_name: string
          department_id: string | null
          id: string
          is_required: boolean | null
          stage: Database["public"]["Enums"]["evaluation_stage"]
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          criteria_description?: string | null
          criteria_name: string
          department_id?: string | null
          id?: string
          is_required?: boolean | null
          stage: Database["public"]["Enums"]["evaluation_stage"]
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          criteria_description?: string | null
          criteria_name?: string
          department_id?: string | null
          id?: string
          is_required?: boolean | null
          stage?: Database["public"]["Enums"]["evaluation_stage"]
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "department_evaluation_criteria_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          description: string | null
          head_email: string | null
          head_name: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          head_email?: string | null
          head_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          head_email?: string | null
          head_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      idea_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          idea_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          idea_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          idea_id?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      idea_comments: {
        Row: {
          author_email: string | null
          author_name: string
          content: string
          created_at: string
          id: string
          idea_id: string
          is_internal: boolean | null
          parent_comment_id: string | null
          updated_at: string
        }
        Insert: {
          author_email?: string | null
          author_name: string
          content: string
          created_at?: string
          id?: string
          idea_id: string
          is_internal?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string
        }
        Update: {
          author_email?: string | null
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          idea_id?: string
          is_internal?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "idea_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_reviews: {
        Row: {
          alignment_score: number | null
          comments: string | null
          created_at: string
          feasibility_score: number | null
          id: string
          idea_id: string
          impact_score: number | null
          novelty_score: number | null
          overall_score: number | null
          recommendation: string | null
          review_date: string
          reviewer_email: string | null
          reviewer_name: string
          stage: Database["public"]["Enums"]["evaluation_stage"]
          updated_at: string
        }
        Insert: {
          alignment_score?: number | null
          comments?: string | null
          created_at?: string
          feasibility_score?: number | null
          id?: string
          idea_id: string
          impact_score?: number | null
          novelty_score?: number | null
          overall_score?: number | null
          recommendation?: string | null
          review_date?: string
          reviewer_email?: string | null
          reviewer_name: string
          stage: Database["public"]["Enums"]["evaluation_stage"]
          updated_at?: string
        }
        Update: {
          alignment_score?: number | null
          comments?: string | null
          created_at?: string
          feasibility_score?: number | null
          id?: string
          idea_id?: string
          impact_score?: number | null
          novelty_score?: number | null
          overall_score?: number | null
          recommendation?: string | null
          review_date?: string
          reviewer_email?: string | null
          reviewer_name?: string
          stage?: Database["public"]["Enums"]["evaluation_stage"]
          updated_at?: string
        }
        Relationships: []
      }
      idea_stage_history: {
        Row: {
          change_reason: string | null
          changed_by: string
          created_at: string
          from_stage: Database["public"]["Enums"]["evaluation_stage"] | null
          from_status: Database["public"]["Enums"]["stage_status"] | null
          id: string
          idea_id: string
          to_stage: Database["public"]["Enums"]["evaluation_stage"]
          to_status: Database["public"]["Enums"]["stage_status"]
        }
        Insert: {
          change_reason?: string | null
          changed_by: string
          created_at?: string
          from_stage?: Database["public"]["Enums"]["evaluation_stage"] | null
          from_status?: Database["public"]["Enums"]["stage_status"] | null
          id?: string
          idea_id: string
          to_stage: Database["public"]["Enums"]["evaluation_stage"]
          to_status: Database["public"]["Enums"]["stage_status"]
        }
        Update: {
          change_reason?: string | null
          changed_by?: string
          created_at?: string
          from_stage?: Database["public"]["Enums"]["evaluation_stage"] | null
          from_status?: Database["public"]["Enums"]["stage_status"] | null
          id?: string
          idea_id?: string
          to_stage?: Database["public"]["Enums"]["evaluation_stage"]
          to_status?: Database["public"]["Enums"]["stage_status"]
        }
        Relationships: []
      }
      ideas: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          evaluation_stage:
            | Database["public"]["Enums"]["evaluation_stage"]
            | null
          expected_benefits: string | null
          id: string
          l1_completed_at: string | null
          l2_alignment_score: number | null
          l2_comments: string | null
          l2_completed_at: string | null
          l2_feasibility_score: number | null
          l2_impact_score: number | null
          l2_novelty_score: number | null
          l2_overall_score: number | null
          l2_screened_by: string | null
          l2_screening_date: string | null
          l3_assessed_by: string | null
          l3_assessment_date: string | null
          l3_comments: string | null
          l3_completed_at: string | null
          l3_dependencies: string | null
          l3_feasibility_score: number | null
          l3_resource_requirements: string | null
          l3_risk_assessment: string | null
          l3_technical_feasibility: string | null
          l3_timeline_estimate: string | null
          l4_approval_date: string | null
          l4_approved_by: string | null
          l4_comments: string | null
          l4_competitive_advantage: string | null
          l4_completed_at: string | null
          l4_estimated_benefits: number | null
          l4_estimated_cost: number | null
          l4_market_potential: string | null
          l4_npv: number | null
          l4_payback_period_months: number | null
          l4_roi_percentage: number | null
          l4_strategic_fit_score: number | null
          l5_actual_completion_date: string | null
          l5_comments: string | null
          l5_completed_at: string | null
          l5_implementation_status: string | null
          l5_lessons_learned: string | null
          l5_milestones: Json | null
          l5_progress_percentage: number | null
          l5_project_lead: string | null
          l5_start_date: string | null
          l5_target_completion_date: string | null
          l5_team_members: string[] | null
          priority: string
          problem_statement: string | null
          project_id: string | null
          proposed_solution: string | null
          remarks: string | null
          stage_status: Database["public"]["Enums"]["stage_status"] | null
          status: string
          submission_date: string | null
          submitter_email: string | null
          submitter_employee_id: string | null
          submitter_name: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          evaluation_stage?:
            | Database["public"]["Enums"]["evaluation_stage"]
            | null
          expected_benefits?: string | null
          id?: string
          l1_completed_at?: string | null
          l2_alignment_score?: number | null
          l2_comments?: string | null
          l2_completed_at?: string | null
          l2_feasibility_score?: number | null
          l2_impact_score?: number | null
          l2_novelty_score?: number | null
          l2_overall_score?: number | null
          l2_screened_by?: string | null
          l2_screening_date?: string | null
          l3_assessed_by?: string | null
          l3_assessment_date?: string | null
          l3_comments?: string | null
          l3_completed_at?: string | null
          l3_dependencies?: string | null
          l3_feasibility_score?: number | null
          l3_resource_requirements?: string | null
          l3_risk_assessment?: string | null
          l3_technical_feasibility?: string | null
          l3_timeline_estimate?: string | null
          l4_approval_date?: string | null
          l4_approved_by?: string | null
          l4_comments?: string | null
          l4_competitive_advantage?: string | null
          l4_completed_at?: string | null
          l4_estimated_benefits?: number | null
          l4_estimated_cost?: number | null
          l4_market_potential?: string | null
          l4_npv?: number | null
          l4_payback_period_months?: number | null
          l4_roi_percentage?: number | null
          l4_strategic_fit_score?: number | null
          l5_actual_completion_date?: string | null
          l5_comments?: string | null
          l5_completed_at?: string | null
          l5_implementation_status?: string | null
          l5_lessons_learned?: string | null
          l5_milestones?: Json | null
          l5_progress_percentage?: number | null
          l5_project_lead?: string | null
          l5_start_date?: string | null
          l5_target_completion_date?: string | null
          l5_team_members?: string[] | null
          priority: string
          problem_statement?: string | null
          project_id?: string | null
          proposed_solution?: string | null
          remarks?: string | null
          stage_status?: Database["public"]["Enums"]["stage_status"] | null
          status?: string
          submission_date?: string | null
          submitter_email?: string | null
          submitter_employee_id?: string | null
          submitter_name?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          evaluation_stage?:
            | Database["public"]["Enums"]["evaluation_stage"]
            | null
          expected_benefits?: string | null
          id?: string
          l1_completed_at?: string | null
          l2_alignment_score?: number | null
          l2_comments?: string | null
          l2_completed_at?: string | null
          l2_feasibility_score?: number | null
          l2_impact_score?: number | null
          l2_novelty_score?: number | null
          l2_overall_score?: number | null
          l2_screened_by?: string | null
          l2_screening_date?: string | null
          l3_assessed_by?: string | null
          l3_assessment_date?: string | null
          l3_comments?: string | null
          l3_completed_at?: string | null
          l3_dependencies?: string | null
          l3_feasibility_score?: number | null
          l3_resource_requirements?: string | null
          l3_risk_assessment?: string | null
          l3_technical_feasibility?: string | null
          l3_timeline_estimate?: string | null
          l4_approval_date?: string | null
          l4_approved_by?: string | null
          l4_comments?: string | null
          l4_competitive_advantage?: string | null
          l4_completed_at?: string | null
          l4_estimated_benefits?: number | null
          l4_estimated_cost?: number | null
          l4_market_potential?: string | null
          l4_npv?: number | null
          l4_payback_period_months?: number | null
          l4_roi_percentage?: number | null
          l4_strategic_fit_score?: number | null
          l5_actual_completion_date?: string | null
          l5_comments?: string | null
          l5_completed_at?: string | null
          l5_implementation_status?: string | null
          l5_lessons_learned?: string | null
          l5_milestones?: Json | null
          l5_progress_percentage?: number | null
          l5_project_lead?: string | null
          l5_start_date?: string | null
          l5_target_completion_date?: string | null
          l5_team_members?: string[] | null
          priority?: string
          problem_statement?: string | null
          project_id?: string | null
          proposed_solution?: string | null
          remarks?: string | null
          stage_status?: Database["public"]["Enums"]["stage_status"] | null
          status?: string
          submission_date?: string | null
          submitter_email?: string | null
          submitter_employee_id?: string | null
          submitter_name?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          approval_required: boolean | null
          approved_by: string | null
          approved_date: string | null
          baseline_target_date: string | null
          completed_date: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          id: string
          is_critical_path: boolean | null
          name: string
          order_index: number
          project_id: string
          status: string
          target_date: string
          updated_at: string
        }
        Insert: {
          approval_required?: boolean | null
          approved_by?: string | null
          approved_date?: string | null
          baseline_target_date?: string | null
          completed_date?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          id?: string
          is_critical_path?: boolean | null
          name: string
          order_index?: number
          project_id: string
          status?: string
          target_date: string
          updated_at?: string
        }
        Update: {
          approval_required?: boolean | null
          approved_by?: string | null
          approved_date?: string | null
          baseline_target_date?: string | null
          completed_date?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          id?: string
          is_critical_path?: boolean | null
          name?: string
          order_index?: number
          project_id?: string
          status?: string
          target_date?: string
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
      project_metrics_history: {
        Row: {
          budget_variance: number | null
          completed_milestones: number | null
          critical_risks: number | null
          delay_percentage: number | null
          id: string
          open_risks: number | null
          performance_rating: string | null
          project_id: string
          rag_status: string | null
          resource_utilization: number | null
          snapshot_date: string
          total_milestones: number | null
        }
        Insert: {
          budget_variance?: number | null
          completed_milestones?: number | null
          critical_risks?: number | null
          delay_percentage?: number | null
          id?: string
          open_risks?: number | null
          performance_rating?: string | null
          project_id: string
          rag_status?: string | null
          resource_utilization?: number | null
          snapshot_date?: string
          total_milestones?: number | null
        }
        Update: {
          budget_variance?: number | null
          completed_milestones?: number | null
          critical_risks?: number | null
          delay_percentage?: number | null
          id?: string
          open_risks?: number | null
          performance_rating?: string | null
          project_id?: string
          rag_status?: string | null
          resource_utilization?: number | null
          snapshot_date?: string
          total_milestones?: number | null
        }
        Relationships: []
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
      subtasks: {
        Row: {
          completion_date: string | null
          created_at: string
          id: string
          order_index: number
          owner: string[] | null
          parent_task_id: string
          progress_comments: string | null
          status: string
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          id?: string
          order_index?: number
          owner?: string[] | null
          parent_task_id: string
          progress_comments?: string | null
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          id?: string
          order_index?: number
          owner?: string[] | null
          parent_task_id?: string
          progress_comments?: string | null
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          action_item: string
          category: string | null
          created_at: string
          dependencies: string[] | null
          id: string
          owner: string[]
          priority_score: number | null
          progress_comments: string | null
          project_id: string | null
          reported_date: string
          sentiment: string | null
          serial_no: number
          status: string
          target_date: string
          updated_at: string
        }
        Insert: {
          action_item: string
          category?: string | null
          created_at?: string
          dependencies?: string[] | null
          id: string
          owner?: string[]
          priority_score?: number | null
          progress_comments?: string | null
          project_id?: string | null
          reported_date: string
          sentiment?: string | null
          serial_no: number
          status: string
          target_date: string
          updated_at?: string
        }
        Update: {
          action_item?: string
          category?: string | null
          created_at?: string
          dependencies?: string[] | null
          id?: string
          owner?: string[]
          priority_score?: number | null
          progress_comments?: string | null
          project_id?: string | null
          reported_date?: string
          sentiment?: string | null
          serial_no?: number
          status?: string
          target_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_contracts: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          contract_number: string | null
          contract_type: Database["public"]["Enums"]["vendor_contract_type"]
          created_at: string
          description: string | null
          document_url: string | null
          end_date: string | null
          id: string
          notes: string | null
          project_id: string | null
          signed_date: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["vendor_contract_status"]
          title: string
          updated_at: string
          value: number | null
          vendor_id: string
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          contract_number?: string | null
          contract_type: Database["public"]["Enums"]["vendor_contract_type"]
          created_at?: string
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          signed_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["vendor_contract_status"]
          title: string
          updated_at?: string
          value?: number | null
          vendor_id: string
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          contract_number?: string | null
          contract_type?: Database["public"]["Enums"]["vendor_contract_type"]
          created_at?: string
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          signed_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["vendor_contract_status"]
          title?: string
          updated_at?: string
          value?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_contracts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_deliverables: {
        Row: {
          contract_id: string | null
          created_at: string
          deliverable_name: string
          description: string | null
          document_url: string | null
          due_date: string | null
          id: string
          project_id: string | null
          quality_rating:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          review_notes: string | null
          reviewed_by: string | null
          status: string
          submission_date: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          contract_id?: string | null
          created_at?: string
          deliverable_name: string
          description?: string | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          quality_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
          submission_date?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          contract_id?: string | null
          created_at?: string
          deliverable_name?: string
          description?: string | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          quality_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
          submission_date?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_deliverables_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "vendor_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_deliverables_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_performance_reviews: {
        Row: {
          areas_for_improvement: string | null
          communication_rating:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          cost_effectiveness_rating:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          created_at: string
          id: string
          overall_rating: Database["public"]["Enums"]["vendor_performance_rating"]
          project_id: string | null
          quality_rating:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          recommendations: string | null
          review_date: string
          review_period_end: string
          review_period_start: string
          reviewed_by: string
          strengths: string | null
          timeliness_rating:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          areas_for_improvement?: string | null
          communication_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          cost_effectiveness_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          created_at?: string
          id?: string
          overall_rating: Database["public"]["Enums"]["vendor_performance_rating"]
          project_id?: string | null
          quality_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          recommendations?: string | null
          review_date?: string
          review_period_end: string
          review_period_start: string
          reviewed_by: string
          strengths?: string | null
          timeliness_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          areas_for_improvement?: string | null
          communication_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          cost_effectiveness_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          created_at?: string
          id?: string
          overall_rating?: Database["public"]["Enums"]["vendor_performance_rating"]
          project_id?: string | null
          quality_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          recommendations?: string | null
          review_date?: string
          review_period_end?: string
          review_period_start?: string
          reviewed_by?: string
          strengths?: string | null
          timeliness_rating?:
            | Database["public"]["Enums"]["vendor_performance_rating"]
            | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_performance_reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          website?: string | null
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
      evaluation_stage: "L1" | "L2" | "L3" | "L4" | "L5"
      stage_status:
        | "pending"
        | "in_progress"
        | "approved"
        | "rejected"
        | "on_hold"
      vendor_contract_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "active"
        | "expired"
        | "terminated"
      vendor_contract_type: "NDA" | "MSA" | "SOW" | "SLA" | "Other"
      vendor_performance_rating:
        | "excellent"
        | "good"
        | "satisfactory"
        | "needs_improvement"
        | "poor"
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
      evaluation_stage: ["L1", "L2", "L3", "L4", "L5"],
      stage_status: [
        "pending",
        "in_progress",
        "approved",
        "rejected",
        "on_hold",
      ],
      vendor_contract_status: [
        "draft",
        "pending_approval",
        "approved",
        "active",
        "expired",
        "terminated",
      ],
      vendor_contract_type: ["NDA", "MSA", "SOW", "SLA", "Other"],
      vendor_performance_rating: [
        "excellent",
        "good",
        "satisfactory",
        "needs_improvement",
        "poor",
      ],
    },
  },
} as const
