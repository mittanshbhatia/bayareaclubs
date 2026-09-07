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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
  public: {
    Tables: {
      account_onboarding: {
        Row: {
          activated_at: string | null
          activation_method: Database["public"]["Enums"]["account_activation_method"]
          created_at: string
          grade_band: Database["public"]["Enums"]["grade_band"] | null
          guardian_authorized_at: string | null
          guardian_user_id: string | null
          id: string
          requested_school_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["account_onboarding_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          activation_method: Database["public"]["Enums"]["account_activation_method"]
          created_at?: string
          grade_band?: Database["public"]["Enums"]["grade_band"] | null
          guardian_authorized_at?: string | null
          guardian_user_id?: string | null
          id?: string
          requested_school_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status: Database["public"]["Enums"]["account_onboarding_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          activation_method?: Database["public"]["Enums"]["account_activation_method"]
          created_at?: string
          grade_band?: Database["public"]["Enums"]["grade_band"] | null
          guardian_authorized_at?: string | null
          guardian_user_id?: string | null
          id?: string
          requested_school_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["account_onboarding_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_onboarding_guardian_user_id_fkey"
            columns: ["guardian_user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "account_onboarding_guardian_user_id_fkey"
            columns: ["guardian_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_onboarding_requested_school_id_fkey"
            columns: ["requested_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_onboarding_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "account_onboarding_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_onboarding_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "account_onboarding_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      account_onboarding_internal_notes: {
        Row: {
          author_id: string
          created_at: string
          id: string
          note: string
          onboarding_user_id: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          note: string
          onboarding_user_id: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          note?: string
          onboarding_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_onboarding_internal_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "account_onboarding_internal_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_onboarding_internal_notes_onboarding_user_id_fkey"
            columns: ["onboarding_user_id"]
            isOneToOne: false
            referencedRelation: "account_onboarding"
            referencedColumns: ["user_id"]
          },
        ]
      }
      analytics_daily_club: {
        Row: {
          active_members: number
          activities: number
          attendance_present: number
          attendance_recorded: number
          attendance_sessions: number
          calculated_at: string
          club_id: string
          events: number
          meetings: number
          metric_date: string
          new_members: number
          renewals_completed: number
          renewals_due: number
          resource_subscriptions: number
          rsvps: number
        }
        Insert: {
          active_members?: number
          activities?: number
          attendance_present?: number
          attendance_recorded?: number
          attendance_sessions?: number
          calculated_at?: string
          club_id: string
          events?: number
          meetings?: number
          metric_date: string
          new_members?: number
          renewals_completed?: number
          renewals_due?: number
          resource_subscriptions?: number
          rsvps?: number
        }
        Update: {
          active_members?: number
          activities?: number
          attendance_present?: number
          attendance_recorded?: number
          attendance_sessions?: number
          calculated_at?: string
          club_id?: string
          events?: number
          meetings?: number
          metric_date?: string
          new_members?: number
          renewals_completed?: number
          renewals_due?: number
          resource_subscriptions?: number
          rsvps?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_daily_club_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_daily_club_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_daily_platform: {
        Row: {
          active_clubs: number
          active_members: number
          active_schools: number
          attendance_present: number
          attendance_recorded: number
          attendance_sessions: number
          calculated_at: string
          events: number
          ideas_approved: number
          ideas_submitted: number
          metric_date: string
          new_clubs: number
          new_members: number
          renewals_completed: number
          renewals_due: number
          resource_subscriptions: number
        }
        Insert: {
          active_clubs?: number
          active_members?: number
          active_schools?: number
          attendance_present?: number
          attendance_recorded?: number
          attendance_sessions?: number
          calculated_at?: string
          events?: number
          ideas_approved?: number
          ideas_submitted?: number
          metric_date: string
          new_clubs?: number
          new_members?: number
          renewals_completed?: number
          renewals_due?: number
          resource_subscriptions?: number
        }
        Update: {
          active_clubs?: number
          active_members?: number
          active_schools?: number
          attendance_present?: number
          attendance_recorded?: number
          attendance_sessions?: number
          calculated_at?: string
          events?: number
          ideas_approved?: number
          ideas_submitted?: number
          metric_date?: string
          new_clubs?: number
          new_members?: number
          renewals_completed?: number
          renewals_due?: number
          resource_subscriptions?: number
        }
        Relationships: []
      }
      analytics_daily_school: {
        Row: {
          active_clubs: number
          active_members: number
          attendance_present: number
          attendance_recorded: number
          attendance_sessions: number
          calculated_at: string
          events: number
          ideas_approved: number
          ideas_submitted: number
          metric_date: string
          new_clubs: number
          new_members: number
          renewals_completed: number
          renewals_due: number
          resource_subscriptions: number
          school_id: string
        }
        Insert: {
          active_clubs?: number
          active_members?: number
          attendance_present?: number
          attendance_recorded?: number
          attendance_sessions?: number
          calculated_at?: string
          events?: number
          ideas_approved?: number
          ideas_submitted?: number
          metric_date: string
          new_clubs?: number
          new_members?: number
          renewals_completed?: number
          renewals_due?: number
          resource_subscriptions?: number
          school_id: string
        }
        Update: {
          active_clubs?: number
          active_members?: number
          attendance_present?: number
          attendance_recorded?: number
          attendance_sessions?: number
          calculated_at?: string
          events?: number
          ideas_approved?: number
          ideas_submitted?: number
          metric_date?: string
          new_clubs?: number
          new_members?: number
          renewals_completed?: number
          renewals_due?: number
          resource_subscriptions?: number
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_daily_school_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_check_in_tokens: {
        Row: {
          consumed_at: string | null
          consumed_by: string | null
          created_at: string
          created_by: string
          expires_at: string
          id: string
          session_id: string
          token_hash: string
        }
        Insert: {
          consumed_at?: string | null
          consumed_by?: string | null
          created_at?: string
          created_by: string
          expires_at: string
          id?: string
          session_id: string
          token_hash: string
        }
        Update: {
          consumed_at?: string | null
          consumed_by?: string | null
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          session_id?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_check_in_tokens_consumed_by_fkey"
            columns: ["consumed_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "attendance_check_in_tokens_consumed_by_fkey"
            columns: ["consumed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_check_in_tokens_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "attendance_check_in_tokens_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_check_in_tokens_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          corrected_at: string | null
          correction_note: string | null
          created_at: string
          id: string
          membership_id: string
          note: string | null
          previous_status:
            | Database["public"]["Enums"]["attendance_status"]
            | null
          recorded_at: string
          recorded_by: string
          session_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
        }
        Insert: {
          corrected_at?: string | null
          correction_note?: string | null
          created_at?: string
          id?: string
          membership_id: string
          note?: string | null
          previous_status?:
            | Database["public"]["Enums"]["attendance_status"]
            | null
          recorded_at?: string
          recorded_by: string
          session_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Update: {
          corrected_at?: string | null
          correction_note?: string | null
          created_at?: string
          id?: string
          membership_id?: string
          note?: string | null
          previous_status?:
            | Database["public"]["Enums"]["attendance_status"]
            | null
          recorded_at?: string
          recorded_by?: string
          session_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "club_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "attendance_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          check_in_enabled: boolean
          club_id: string
          created_at: string
          created_by: string
          ends_at: string | null
          event_id: string | null
          id: string
          location_name: string | null
          starts_at: string
          timezone: string
          title: string
          updated_at: string
        }
        Insert: {
          check_in_enabled?: boolean
          club_id: string
          created_at?: string
          created_by: string
          ends_at?: string | null
          event_id?: string | null
          id?: string
          location_name?: string | null
          starts_at: string
          timezone?: string
          title?: string
          updated_at?: string
        }
        Update: {
          check_in_enabled?: boolean
          club_id?: string
          created_at?: string
          created_by?: string
          ends_at?: string | null
          event_id?: string | null
          id?: string
          location_name?: string | null
          starts_at?: string
          timezone?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_sessions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "attendance_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          club_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          metadata: Json
          school_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          club_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
          metadata?: Json
          school_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          club_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
          metadata?: Json
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      charter_section_definitions: {
        Row: {
          created_at: string
          description: string
          field_column: string
          is_active: boolean
          key: string
          label: string
          min_length: number
          required: boolean
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string
          field_column: string
          is_active?: boolean
          key: string
          label: string
          min_length?: number
          required?: boolean
          sort_order: number
        }
        Update: {
          created_at?: string
          description?: string
          field_column?: string
          is_active?: boolean
          key?: string
          label?: string
          min_length?: number
          required?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      club_activities: {
        Row: {
          activity_date: string
          category: string
          club_id: string
          created_at: string
          created_by: string
          description: string
          id: string
          outcomes: string
          related_event_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          activity_date: string
          category: string
          club_id: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          outcomes?: string
          related_event_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          activity_date?: string
          category?: string
          club_id?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          outcomes?: string
          related_event_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_activities_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_activities_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_activities_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_activities_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
        ]
      }
      club_activity_media: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          media_asset_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          media_asset_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          media_asset_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_activity_media_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "club_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_activity_media_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_activity_media_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      club_activity_participants: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          membership_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          membership_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          membership_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_activity_participants_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "club_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_activity_participants_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "club_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      club_charter_reviews: {
        Row: {
          applicant_feedback: string | null
          charter_id: string
          created_at: string
          decision: Database["public"]["Enums"]["review_decision"]
          id: string
          internal_notes: string | null
          reviewed_at: string
          reviewer_id: string
        }
        Insert: {
          applicant_feedback?: string | null
          charter_id: string
          created_at?: string
          decision: Database["public"]["Enums"]["review_decision"]
          id?: string
          internal_notes?: string | null
          reviewed_at?: string
          reviewer_id: string
        }
        Update: {
          applicant_feedback?: string | null
          charter_id?: string
          created_at?: string
          decision?: Database["public"]["Enums"]["review_decision"]
          id?: string
          internal_notes?: string | null
          reviewed_at?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_charter_reviews_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "club_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_charter_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_charter_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_charter_versions: {
        Row: {
          charter_id: string
          created_at: string
          created_by: string | null
          id: string
          snapshot: Json
          status_at_freeze: Database["public"]["Enums"]["charter_status"]
          version_number: number
        }
        Insert: {
          charter_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          snapshot: Json
          status_at_freeze: Database["public"]["Enums"]["charter_status"]
          version_number: number
        }
        Update: {
          charter_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          snapshot?: Json
          status_at_freeze?: Database["public"]["Enums"]["charter_status"]
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_charter_versions_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "club_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_charter_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_charter_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_charters: {
        Row: {
          advisor_information: string
          amendment_process: string
          approved_at: string | null
          club_id: string
          conduct_expectations: string
          created_at: string
          created_by: string
          draft_step: number
          elections: string
          expires_at: string | null
          financial_policy: string
          id: string
          meeting_cadence: string
          membership_requirements: string
          mission: string
          officer_responsibilities: string
          officer_structure: string
          planned_activities: string
          purpose: string
          school_year: string
          status: Database["public"]["Enums"]["charter_status"]
          submitted_at: string | null
          supersedes_id: string | null
          updated_at: string
          version_number: number
        }
        Insert: {
          advisor_information?: string
          amendment_process?: string
          approved_at?: string | null
          club_id: string
          conduct_expectations?: string
          created_at?: string
          created_by: string
          draft_step?: number
          elections?: string
          expires_at?: string | null
          financial_policy?: string
          id?: string
          meeting_cadence?: string
          membership_requirements?: string
          mission?: string
          officer_responsibilities?: string
          officer_structure?: string
          planned_activities?: string
          purpose?: string
          school_year: string
          status?: Database["public"]["Enums"]["charter_status"]
          submitted_at?: string | null
          supersedes_id?: string | null
          updated_at?: string
          version_number?: number
        }
        Update: {
          advisor_information?: string
          amendment_process?: string
          approved_at?: string | null
          club_id?: string
          conduct_expectations?: string
          created_at?: string
          created_by?: string
          draft_step?: number
          elections?: string
          expires_at?: string | null
          financial_policy?: string
          id?: string
          meeting_cadence?: string
          membership_requirements?: string
          mission?: string
          officer_responsibilities?: string
          officer_structure?: string
          planned_activities?: string
          purpose?: string
          school_year?: string
          status?: Database["public"]["Enums"]["charter_status"]
          submitted_at?: string | null
          supersedes_id?: string | null
          updated_at?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_charters_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_charters_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_charters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_charters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_charters_supersedes_id_fkey"
            columns: ["supersedes_id"]
            isOneToOne: false
            referencedRelation: "club_charters"
            referencedColumns: ["id"]
          },
        ]
      }
      club_highlights: {
        Row: {
          body: string
          club_id: string
          cover_asset_id: string | null
          created_at: string
          created_by: string
          id: string
          occurred_on: string
          published_at: string | null
          related_activity_id: string | null
          related_event_id: string | null
          source_type: Database["public"]["Enums"]["highlight_source_type"]
          status: Database["public"]["Enums"]["publication_status"]
          summary: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_level"]
        }
        Insert: {
          body: string
          club_id: string
          cover_asset_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          occurred_on?: string
          published_at?: string | null
          related_activity_id?: string | null
          related_event_id?: string | null
          source_type?: Database["public"]["Enums"]["highlight_source_type"]
          status?: Database["public"]["Enums"]["publication_status"]
          summary: string
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Update: {
          body?: string
          club_id?: string
          cover_asset_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          occurred_on?: string
          published_at?: string | null
          related_activity_id?: string | null
          related_event_id?: string | null
          source_type?: Database["public"]["Enums"]["highlight_source_type"]
          status?: Database["public"]["Enums"]["publication_status"]
          summary?: string
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Relationships: [
          {
            foreignKeyName: "club_highlights_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_cover_asset_id_fkey"
            columns: ["cover_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_cover_asset_id_fkey"
            columns: ["cover_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_highlights_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_related_activity_id_fkey"
            columns: ["related_activity_id"]
            isOneToOne: false
            referencedRelation: "club_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
        ]
      }
      club_idea_links: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_idea_links_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      club_idea_proposed_officers: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          proposed_name: string | null
          proposed_role: Database["public"]["Enums"]["club_role"]
          proposed_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          proposed_name?: string | null
          proposed_role: Database["public"]["Enums"]["club_role"]
          proposed_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          proposed_name?: string | null
          proposed_role?: Database["public"]["Enums"]["club_role"]
          proposed_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_idea_proposed_officers_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_idea_proposed_officers_proposed_user_id_fkey"
            columns: ["proposed_user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_idea_proposed_officers_proposed_user_id_fkey"
            columns: ["proposed_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_idea_reviews: {
        Row: {
          applicant_feedback: string | null
          assigned_at: string
          assigned_by: string | null
          created_at: string
          decision: Database["public"]["Enums"]["review_decision"] | null
          id: string
          idea_id: string
          internal_notes: string | null
          reviewed_at: string | null
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          applicant_feedback?: string | null
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          decision?: Database["public"]["Enums"]["review_decision"] | null
          id?: string
          idea_id: string
          internal_notes?: string | null
          reviewed_at?: string | null
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          applicant_feedback?: string | null
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          decision?: Database["public"]["Enums"]["review_decision"] | null
          id?: string
          idea_id?: string
          internal_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_idea_reviews_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_idea_reviews_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_idea_reviews_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_idea_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_idea_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_idea_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["club_idea_status"] | null
          id: string
          idea_id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["club_idea_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["club_idea_status"] | null
          id?: string
          idea_id: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["club_idea_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["club_idea_status"] | null
          id?: string
          idea_id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["club_idea_status"]
        }
        Relationships: [
          {
            foreignKeyName: "club_idea_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_idea_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_idea_status_history_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      club_idea_versions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          idea_id: string
          snapshot: Json
          status_at_freeze: Database["public"]["Enums"]["club_idea_status"]
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          idea_id: string
          snapshot: Json
          status_at_freeze: Database["public"]["Enums"]["club_idea_status"]
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          idea_id?: string
          snapshot?: Json
          status_at_freeze?: Database["public"]["Enums"]["club_idea_status"]
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_idea_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_idea_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_idea_versions_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      club_ideas: {
        Row: {
          application_kind: string
          category: string
          converted_at: string | null
          created_at: string
          decided_at: string | null
          description: string
          draft_step: number
          expected_activities: string[]
          expected_membership: number | null
          grade_max: number | null
          grade_min: number | null
          id: string
          mission: string
          problem_opportunity: string
          proposed_advisor_id: string | null
          proposed_meeting_cadence: string
          school_id: string
          status: Database["public"]["Enums"]["club_idea_status"]
          submitted_at: string | null
          submitter_id: string
          title: string
          updated_at: string
          withdrawn_at: string | null
        }
        Insert: {
          application_kind?: string
          category?: string
          converted_at?: string | null
          created_at?: string
          decided_at?: string | null
          description?: string
          draft_step?: number
          expected_activities?: string[]
          expected_membership?: number | null
          grade_max?: number | null
          grade_min?: number | null
          id?: string
          mission?: string
          problem_opportunity?: string
          proposed_advisor_id?: string | null
          proposed_meeting_cadence?: string
          school_id: string
          status?: Database["public"]["Enums"]["club_idea_status"]
          submitted_at?: string | null
          submitter_id: string
          title?: string
          updated_at?: string
          withdrawn_at?: string | null
        }
        Update: {
          application_kind?: string
          category?: string
          converted_at?: string | null
          created_at?: string
          decided_at?: string | null
          description?: string
          draft_step?: number
          expected_activities?: string[]
          expected_membership?: number | null
          grade_max?: number | null
          grade_min?: number | null
          id?: string
          mission?: string
          problem_opportunity?: string
          proposed_advisor_id?: string | null
          proposed_meeting_cadence?: string
          school_id?: string
          status?: Database["public"]["Enums"]["club_idea_status"]
          submitted_at?: string | null
          submitter_id?: string
          title?: string
          updated_at?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_ideas_proposed_advisor_id_fkey"
            columns: ["proposed_advisor_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_ideas_proposed_advisor_id_fkey"
            columns: ["proposed_advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_ideas_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_ideas_submitter_id_fkey"
            columns: ["submitter_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_ideas_submitter_id_fkey"
            columns: ["submitter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_learning_collection_items: {
        Row: {
          collection_id: string
          course_id: string
          created_at: string
          id: string
          note: string | null
          position: number
        }
        Insert: {
          collection_id: string
          course_id: string
          created_at?: string
          id?: string
          note?: string | null
          position: number
        }
        Update: {
          collection_id?: string
          course_id?: string
          created_at?: string
          id?: string
          note?: string | null
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_learning_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "club_learning_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_learning_collection_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_learning_collection_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_learning_collection_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      club_learning_collections: {
        Row: {
          club_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_archived: boolean
          title: string
          updated_at: string
        }
        Insert: {
          club_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_archived?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          club_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_archived?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_learning_collections_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_learning_collections_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_learning_collections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_learning_collections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_memberships: {
        Row: {
          club_id: string
          created_at: string
          exited_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["club_role"]
          school_year: string
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          exited_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["club_role"]
          school_year: string
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          exited_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["club_role"]
          school_year?: string
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_officer_terms: {
        Row: {
          appointed_by: string | null
          club_id: string
          created_at: string
          ended_reason: string | null
          ends_on: string | null
          id: string
          membership_id: string
          role: Database["public"]["Enums"]["club_role"]
          school_year: string
          starts_on: string
        }
        Insert: {
          appointed_by?: string | null
          club_id: string
          created_at?: string
          ended_reason?: string | null
          ends_on?: string | null
          id?: string
          membership_id: string
          role: Database["public"]["Enums"]["club_role"]
          school_year: string
          starts_on: string
        }
        Update: {
          appointed_by?: string | null
          club_id?: string
          created_at?: string
          ended_reason?: string | null
          ends_on?: string | null
          id?: string
          membership_id?: string
          role?: Database["public"]["Enums"]["club_role"]
          school_year?: string
          starts_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_officer_terms_appointed_by_fkey"
            columns: ["appointed_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_officer_terms_appointed_by_fkey"
            columns: ["appointed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_officer_terms_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_officer_terms_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_officer_terms_membership_id_club_id_fkey"
            columns: ["membership_id", "club_id"]
            isOneToOne: false
            referencedRelation: "club_memberships"
            referencedColumns: ["id", "club_id"]
          },
        ]
      }
      club_renewal_reviews: {
        Row: {
          applicant_feedback: string | null
          created_at: string
          decision: Database["public"]["Enums"]["review_decision"]
          id: string
          internal_notes: string | null
          renewal_id: string
          reviewed_at: string
          reviewer_id: string
        }
        Insert: {
          applicant_feedback?: string | null
          created_at?: string
          decision: Database["public"]["Enums"]["review_decision"]
          id?: string
          internal_notes?: string | null
          renewal_id: string
          reviewed_at?: string
          reviewer_id: string
        }
        Update: {
          applicant_feedback?: string | null
          created_at?: string
          decision?: Database["public"]["Enums"]["review_decision"]
          id?: string
          internal_notes?: string | null
          renewal_id?: string
          reviewed_at?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_renewal_reviews_renewal_id_fkey"
            columns: ["renewal_id"]
            isOneToOne: false
            referencedRelation: "club_renewals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_renewal_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_renewal_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_renewals: {
        Row: {
          activity_summary: string
          advisor_confirmed_at: string | null
          advisor_confirmed_by: string | null
          approved_at: string | null
          charter_id: string
          club_id: string
          created_at: string
          current_officers_snapshot: Json
          derived_at: string | null
          derived_snapshot: Json
          highlights_summary: string
          id: string
          membership_summary: Json
          next_year_plan: string
          school_year: string
          status: Database["public"]["Enums"]["renewal_status"]
          submitted_at: string | null
          submitted_by: string
          updated_at: string
        }
        Insert: {
          activity_summary?: string
          advisor_confirmed_at?: string | null
          advisor_confirmed_by?: string | null
          approved_at?: string | null
          charter_id: string
          club_id: string
          created_at?: string
          current_officers_snapshot?: Json
          derived_at?: string | null
          derived_snapshot?: Json
          highlights_summary?: string
          id?: string
          membership_summary?: Json
          next_year_plan?: string
          school_year: string
          status?: Database["public"]["Enums"]["renewal_status"]
          submitted_at?: string | null
          submitted_by: string
          updated_at?: string
        }
        Update: {
          activity_summary?: string
          advisor_confirmed_at?: string | null
          advisor_confirmed_by?: string | null
          approved_at?: string | null
          charter_id?: string
          club_id?: string
          created_at?: string
          current_officers_snapshot?: Json
          derived_at?: string | null
          derived_snapshot?: Json
          highlights_summary?: string
          id?: string
          membership_summary?: Json
          next_year_plan?: string
          school_year?: string
          status?: Database["public"]["Enums"]["renewal_status"]
          submitted_at?: string | null
          submitted_by?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_renewals_advisor_confirmed_by_fkey"
            columns: ["advisor_confirmed_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_renewals_advisor_confirmed_by_fkey"
            columns: ["advisor_confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_renewals_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "club_charters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_renewals_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_renewals_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_renewals_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_renewals_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      club_resource_recommendations: {
        Row: {
          club_id: string
          course_id: string
          created_at: string
          id: string
          note: string | null
          recommended_by: string
        }
        Insert: {
          club_id: string
          course_id: string
          created_at?: string
          id?: string
          note?: string | null
          recommended_by: string
        }
        Update: {
          club_id?: string
          course_id?: string
          created_at?: string
          id?: string
          note?: string | null
          recommended_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_resource_recommendations_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_resource_recommendations_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_resource_recommendations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_resource_recommendations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_resource_recommendations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_resource_recommendations_recommended_by_fkey"
            columns: ["recommended_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_resource_recommendations_recommended_by_fkey"
            columns: ["recommended_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          approved_at: string
          approved_by: string
          category: string
          created_at: string
          description: string
          founded_on: string | null
          grade_max: number | null
          grade_min: number | null
          id: string
          logo_asset_id: string | null
          meeting_cadence: string
          mission: string
          name: string
          originating_idea_id: string | null
          public_summary: string
          school_id: string
          slug: string
          status: Database["public"]["Enums"]["club_status"]
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_level"]
        }
        Insert: {
          approved_at?: string
          approved_by: string
          category: string
          created_at?: string
          description: string
          founded_on?: string | null
          grade_max?: number | null
          grade_min?: number | null
          id?: string
          logo_asset_id?: string | null
          meeting_cadence?: string
          mission: string
          name: string
          originating_idea_id?: string | null
          public_summary?: string
          school_id: string
          slug: string
          status?: Database["public"]["Enums"]["club_status"]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Update: {
          approved_at?: string
          approved_by?: string
          category?: string
          created_at?: string
          description?: string
          founded_on?: string | null
          grade_max?: number | null
          grade_min?: number | null
          id?: string
          logo_asset_id?: string | null
          meeting_cadence?: string
          mission?: string
          name?: string
          originating_idea_id?: string | null
          public_summary?: string
          school_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["club_status"]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Relationships: [
          {
            foreignKeyName: "clubs_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "clubs_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_logo_asset_id_fkey"
            columns: ["logo_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_logo_asset_id_fkey"
            columns: ["logo_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_originating_idea_id_fkey"
            columns: ["originating_idea_id"]
            isOneToOne: true
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_jobs: {
        Row: {
          attempt_count: number
          campaign_id: string | null
          club_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          idempotency_key: string
          job_type: Database["public"]["Enums"]["communication_job_type"]
          last_error: string | null
          locked_at: string | null
          locked_by: string | null
          max_attempts: number
          payload: Json
          run_after: string
          school_id: string | null
          status: Database["public"]["Enums"]["communication_job_status"]
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          campaign_id?: string | null
          club_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          idempotency_key: string
          job_type: Database["public"]["Enums"]["communication_job_type"]
          last_error?: string | null
          locked_at?: string | null
          locked_by?: string | null
          max_attempts?: number
          payload?: Json
          run_after?: string
          school_id?: string | null
          status?: Database["public"]["Enums"]["communication_job_status"]
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          campaign_id?: string | null
          club_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string
          job_type?: Database["public"]["Enums"]["communication_job_type"]
          last_error?: string | null
          locked_at?: string | null
          locked_by?: string | null
          max_attempts?: number
          payload?: Json
          run_after?: string
          school_id?: string | null
          status?: Database["public"]["Enums"]["communication_job_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_jobs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_jobs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_jobs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_jobs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          progress_percent: number
          resource_id: string
          started_at: string | null
          subscription_id: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          progress_percent?: number
          resource_id: string
          started_at?: string | null
          subscription_id: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          progress_percent?: number
          resource_id?: string
          started_at?: string | null
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "published_stem_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "stem_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      course_subscriptions: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscribed_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscribed_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscribed_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "course_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_home_content: {
        Row: {
          body: string
          club_id: string | null
          context_type: Database["public"]["Enums"]["dashboard_context_type"]
          created_at: string
          created_by: string
          display_order: number
          id: string
          module_type: Database["public"]["Enums"]["dashboard_home_module_type"]
          payload: Json
          published_at: string | null
          school_id: string | null
          status: Database["public"]["Enums"]["publication_status"]
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string
          club_id?: string | null
          context_type: Database["public"]["Enums"]["dashboard_context_type"]
          created_at?: string
          created_by: string
          display_order?: number
          id?: string
          module_type: Database["public"]["Enums"]["dashboard_home_module_type"]
          payload?: Json
          published_at?: string | null
          school_id?: string | null
          status?: Database["public"]["Enums"]["publication_status"]
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string
          club_id?: string | null
          context_type?: Database["public"]["Enums"]["dashboard_context_type"]
          created_at?: string
          created_by?: string
          display_order?: number
          id?: string
          module_type?: Database["public"]["Enums"]["dashboard_home_module_type"]
          payload?: Json
          published_at?: string | null
          school_id?: string | null
          status?: Database["public"]["Enums"]["publication_status"]
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_home_content_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_home_content_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_home_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "dashboard_home_content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_home_content_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_home_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "dashboard_home_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_home_content_revisions: {
        Row: {
          action: string
          actor_id: string | null
          body: string | null
          club_id: string | null
          content_id: string | null
          content_uuid: string
          context_type: Database["public"]["Enums"]["dashboard_context_type"]
          created_at: string
          id: string
          module_type: Database["public"]["Enums"]["dashboard_home_module_type"]
          payload: Json
          school_id: string | null
          status: Database["public"]["Enums"]["publication_status"]
          title: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          body?: string | null
          club_id?: string | null
          content_id?: string | null
          content_uuid: string
          context_type: Database["public"]["Enums"]["dashboard_context_type"]
          created_at?: string
          id?: string
          module_type: Database["public"]["Enums"]["dashboard_home_module_type"]
          payload?: Json
          school_id?: string | null
          status: Database["public"]["Enums"]["publication_status"]
          title?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          body?: string | null
          club_id?: string | null
          content_id?: string | null
          content_uuid?: string
          context_type?: Database["public"]["Enums"]["dashboard_context_type"]
          created_at?: string
          id?: string
          module_type?: Database["public"]["Enums"]["dashboard_home_module_type"]
          payload?: Json
          school_id?: string | null
          status?: Database["public"]["Enums"]["publication_status"]
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_home_content_revisions_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "dashboard_home_content_revisions_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_home_content_revisions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "dashboard_home_content"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_module_configs: {
        Row: {
          club_id: string | null
          created_at: string
          display_order: number | null
          enabled: boolean
          id: string
          module_id: string
          school_id: string | null
          scope_type: Database["public"]["Enums"]["dashboard_config_scope"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          display_order?: number | null
          enabled?: boolean
          id?: string
          module_id: string
          school_id?: string | null
          scope_type: Database["public"]["Enums"]["dashboard_config_scope"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string
          display_order?: number | null
          enabled?: boolean
          id?: string
          module_id?: string
          school_id?: string | null
          scope_type?: Database["public"]["Enums"]["dashboard_config_scope"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_module_configs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_module_configs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_module_configs_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "dashboard_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_module_configs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_module_configs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "dashboard_module_configs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_modules: {
        Row: {
          context_types: Database["public"]["Enums"]["dashboard_context_type"][]
          created_at: string
          default_enabled: boolean
          description: string
          display_order: number
          feature_flag: string | null
          icon: string
          id: string
          label: string
          mandatory: boolean
          mobile_visibility: Database["public"]["Enums"]["dashboard_mobile_visibility"]
          required_permissions: string[]
          route: string
          section: string
          slug: string
          status: Database["public"]["Enums"]["dashboard_module_status"]
          updated_at: string
        }
        Insert: {
          context_types: Database["public"]["Enums"]["dashboard_context_type"][]
          created_at?: string
          default_enabled?: boolean
          description: string
          display_order: number
          feature_flag?: string | null
          icon: string
          id: string
          label: string
          mandatory?: boolean
          mobile_visibility?: Database["public"]["Enums"]["dashboard_mobile_visibility"]
          required_permissions?: string[]
          route: string
          section: string
          slug: string
          status?: Database["public"]["Enums"]["dashboard_module_status"]
          updated_at?: string
        }
        Update: {
          context_types?: Database["public"]["Enums"]["dashboard_context_type"][]
          created_at?: string
          default_enabled?: boolean
          description?: string
          display_order?: number
          feature_flag?: string | null
          icon?: string
          id?: string
          label?: string
          mandatory?: boolean
          mobile_visibility?: Database["public"]["Enums"]["dashboard_mobile_visibility"]
          required_permissions?: string[]
          route?: string
          section?: string
          slug?: string
          status?: Database["public"]["Enums"]["dashboard_module_status"]
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_user_preferences: {
        Row: {
          created_at: string
          hidden_module_ids: string[]
          last_club_id: string | null
          last_context_type: Database["public"]["Enums"]["dashboard_context_type"]
          last_school_id: string | null
          module_order: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hidden_module_ids?: string[]
          last_club_id?: string | null
          last_context_type?: Database["public"]["Enums"]["dashboard_context_type"]
          last_school_id?: string | null
          module_order?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hidden_module_ids?: string[]
          last_club_id?: string | null
          last_context_type?: Database["public"]["Enums"]["dashboard_context_type"]
          last_school_id?: string | null
          module_order?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_user_preferences_last_club_id_fkey"
            columns: ["last_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_user_preferences_last_club_id_fkey"
            columns: ["last_club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_user_preferences_last_school_id_fkey"
            columns: ["last_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "dashboard_user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          audience_filter: Json
          audience_type: Database["public"]["Enums"]["email_audience_type"]
          campaign_kind: Database["public"]["Enums"]["email_campaign_kind"]
          club_id: string | null
          completed_at: string | null
          content_json: Json
          created_at: string
          created_by: string
          cta_label: string | null
          cta_url: string | null
          id: string
          idempotency_key: string | null
          last_error: string | null
          message_body: string
          name: string
          preference_category: Database["public"]["Enums"]["email_preference_category"]
          preview_text: string | null
          provider_message_id: string | null
          recipient_count: number
          scheduled_for: string | null
          school_id: string
          sent_at: string | null
          started_sending_at: string | null
          status: Database["public"]["Enums"]["email_campaign_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          audience_filter?: Json
          audience_type?: Database["public"]["Enums"]["email_audience_type"]
          campaign_kind?: Database["public"]["Enums"]["email_campaign_kind"]
          club_id?: string | null
          completed_at?: string | null
          content_json?: Json
          created_at?: string
          created_by: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          message_body?: string
          name: string
          preference_category?: Database["public"]["Enums"]["email_preference_category"]
          preview_text?: string | null
          provider_message_id?: string | null
          recipient_count?: number
          scheduled_for?: string | null
          school_id: string
          sent_at?: string | null
          started_sending_at?: string | null
          status?: Database["public"]["Enums"]["email_campaign_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          audience_filter?: Json
          audience_type?: Database["public"]["Enums"]["email_audience_type"]
          campaign_kind?: Database["public"]["Enums"]["email_campaign_kind"]
          club_id?: string | null
          completed_at?: string | null
          content_json?: Json
          created_at?: string
          created_by?: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          message_body?: string
          name?: string
          preference_category?: Database["public"]["Enums"]["email_preference_category"]
          preview_text?: string | null
          provider_message_id?: string | null
          recipient_count?: number
          scheduled_for?: string | null
          school_id?: string
          sent_at?: string | null
          started_sending_at?: string | null
          status?: Database["public"]["Enums"]["email_campaign_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      email_events: {
        Row: {
          created_at: string
          event_type: Database["public"]["Enums"]["email_event_type"]
          id: string
          metadata: Json
          occurred_at: string
          provider_event_id: string | null
          recipient_id: string
        }
        Insert: {
          created_at?: string
          event_type: Database["public"]["Enums"]["email_event_type"]
          id?: string
          metadata?: Json
          occurred_at: string
          provider_event_id?: string | null
          recipient_id: string
        }
        Update: {
          created_at?: string
          event_type?: Database["public"]["Enums"]["email_event_type"]
          id?: string
          metadata?: Json
          occurred_at?: string
          provider_event_id?: string | null
          recipient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_events_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "email_recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      email_recipients: {
        Row: {
          attempt_count: number
          campaign_id: string
          created_at: string
          delivered_at: string | null
          failed_at: string | null
          id: string
          idempotency_key: string | null
          last_error: string | null
          max_attempts: number
          next_attempt_at: string
          permanent_failure: boolean
          provider_message_id: string | null
          recipient_user_id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["email_recipient_status"]
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          campaign_id: string
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          max_attempts?: number
          next_attempt_at?: string
          permanent_failure?: boolean
          provider_message_id?: string | null
          recipient_user_id: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_recipient_status"]
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          campaign_id?: string
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          max_attempts?: number
          next_attempt_at?: string
          permanent_failure?: boolean
          provider_message_id?: string | null
          recipient_user_id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_recipient_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_recipients_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "email_recipients_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logistics: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          details: string
          due_at: string | null
          event_id: string
          id: string
          logistics_type: Database["public"]["Enums"]["logistics_type"]
          notes: string
          owner_id: string | null
          status: Database["public"]["Enums"]["logistics_item_status"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          details: string
          due_at?: string | null
          event_id: string
          id?: string
          logistics_type: Database["public"]["Enums"]["logistics_type"]
          notes?: string
          owner_id?: string | null
          status?: Database["public"]["Enums"]["logistics_item_status"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          details?: string
          due_at?: string | null
          event_id?: string
          id?: string
          logistics_type?: Database["public"]["Enums"]["logistics_type"]
          notes?: string
          owner_id?: string | null
          status?: Database["public"]["Enums"]["logistics_item_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_logistics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_logistics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_logistics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_logistics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_logistics_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_logistics_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_media: {
        Row: {
          created_at: string
          created_by: string
          event_id: string
          id: string
          media_asset_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          event_id: string
          id?: string
          media_asset_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          event_id?: string
          id?: string
          media_asset_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_media_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_media_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_media_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_media_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          overridden_at: string | null
          overridden_by: string | null
          override_note: string | null
          previous_status: Database["public"]["Enums"]["rsvp_status"] | null
          responded_at: string
          status: Database["public"]["Enums"]["rsvp_status"]
          updated_at: string
          user_id: string
          waitlisted_at: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          overridden_at?: string | null
          overridden_by?: string | null
          override_note?: string | null
          previous_status?: Database["public"]["Enums"]["rsvp_status"] | null
          responded_at?: string
          status: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
          user_id: string
          waitlisted_at?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          overridden_at?: string | null
          overridden_by?: string | null
          override_note?: string | null
          previous_status?: Database["public"]["Enums"]["rsvp_status"] | null
          responded_at?: string
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
          user_id?: string
          waitlisted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_overridden_by_fkey"
            columns: ["overridden_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_rsvps_overridden_by_fkey"
            columns: ["overridden_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_at: string | null
          event_id: string
          id: string
          status: Database["public"]["Enums"]["event_task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_at?: string | null
          event_id: string
          id?: string
          status?: Database["public"]["Enums"]["event_task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_at?: string | null
          event_id?: string
          id?: string
          status?: Database["public"]["Enums"]["event_task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "event_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          approval_required: boolean
          approved_at: string | null
          approved_by: string | null
          audience_notes: string
          builder_step: number
          capacity: number | null
          club_id: string
          created_at: string
          description: string
          ends_at: string
          event_type: Database["public"]["Enums"]["event_type"]
          format: Database["public"]["Enums"]["event_format"]
          id: string
          location_name: string | null
          maybe_rsvp_enabled: boolean
          online_url: string | null
          organizer_id: string
          permissions_notes: string
          rsvp_deadline: string | null
          school_id: string
          starts_at: string
          status: Database["public"]["Enums"]["event_status"]
          timezone: string
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_level"]
          waitlist_enabled: boolean
        }
        Insert: {
          approval_required?: boolean
          approved_at?: string | null
          approved_by?: string | null
          audience_notes?: string
          builder_step?: number
          capacity?: number | null
          club_id: string
          created_at?: string
          description: string
          ends_at: string
          event_type: Database["public"]["Enums"]["event_type"]
          format?: Database["public"]["Enums"]["event_format"]
          id?: string
          location_name?: string | null
          maybe_rsvp_enabled?: boolean
          online_url?: string | null
          organizer_id: string
          permissions_notes?: string
          rsvp_deadline?: string | null
          school_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["event_status"]
          timezone?: string
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
          waitlist_enabled?: boolean
        }
        Update: {
          approval_required?: boolean
          approved_at?: string | null
          approved_by?: string | null
          audience_notes?: string
          builder_step?: number
          capacity?: number | null
          club_id?: string
          created_at?: string
          description?: string
          ends_at?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          format?: Database["public"]["Enums"]["event_format"]
          id?: string
          location_name?: string | null
          maybe_rsvp_enabled?: boolean
          online_url?: string | null
          organizer_id?: string
          permissions_notes?: string
          rsvp_deadline?: string | null
          school_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["event_status"]
          timezone?: string
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
          waitlist_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "events_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "events_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_school_participants: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          logo_alt: string
          logo_bucket: string
          logo_path: string
          logo_source_url: string
          logo_use_authorized_at: string
          participation_confirmed_at: string
          school_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          logo_alt: string
          logo_bucket?: string
          logo_path: string
          logo_source_url: string
          logo_use_authorized_at: string
          participation_confirmed_at: string
          school_id: string
          sort_order: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          logo_alt?: string
          logo_bucket?: string
          logo_path?: string
          logo_source_url?: string
          logo_use_authorized_at?: string
          participation_confirmed_at?: string
          school_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homepage_school_participants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_attempts: {
        Row: {
          course_id: string
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          response: Json
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          response: Json
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          response?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "learning_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "learning_questions_student"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "learning_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_lessons: {
        Row: {
          body_plain: string
          course_id: string
          created_at: string
          created_by: string
          estimated_minutes: number | null
          id: string
          media_asset_id: string | null
          module_id: string
          namespace: string
          position: number
          slug: string
          status: Database["public"]["Enums"]["publication_status"]
          title: string
          updated_at: string
        }
        Insert: {
          body_plain: string
          course_id: string
          created_at?: string
          created_by: string
          estimated_minutes?: number | null
          id?: string
          media_asset_id?: string | null
          module_id: string
          namespace: string
          position: number
          slug: string
          status?: Database["public"]["Enums"]["publication_status"]
          title: string
          updated_at?: string
        }
        Update: {
          body_plain?: string
          course_id?: string
          created_at?: string
          created_by?: string
          estimated_minutes?: number | null
          id?: string
          media_asset_id?: string | null
          module_id?: string
          namespace?: string
          position?: number
          slug?: string
          status?: Database["public"]["Enums"]["publication_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "learning_lessons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "published_stem_course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "stem_course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_question_versions: {
        Row: {
          answer_key: Json
          choices: Json
          created_at: string
          created_by: string | null
          explanation: string | null
          id: string
          prompt: string
          question_id: string
          question_type: string
          source_basis: string
          status: Database["public"]["Enums"]["publication_status"]
          version: number
        }
        Insert: {
          answer_key: Json
          choices: Json
          created_at?: string
          created_by?: string | null
          explanation?: string | null
          id?: string
          prompt: string
          question_id: string
          question_type: string
          source_basis: string
          status: Database["public"]["Enums"]["publication_status"]
          version: number
        }
        Update: {
          answer_key?: Json
          choices?: Json
          created_at?: string
          created_by?: string | null
          explanation?: string | null
          id?: string
          prompt?: string
          question_id?: string
          question_type?: string
          source_basis?: string
          status?: Database["public"]["Enums"]["publication_status"]
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_question_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "learning_question_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_question_versions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "learning_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_question_versions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "learning_questions_student"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_questions: {
        Row: {
          answer_key: Json
          choices: Json
          course_id: string
          created_at: string
          created_by: string
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          explanation: string | null
          id: string
          lesson_id: string | null
          module_id: string | null
          namespace: string
          objective_codes: string[]
          prompt: string
          question_type: string
          slug: string
          source_basis: string
          status: Database["public"]["Enums"]["publication_status"]
          updated_at: string
          version: number
        }
        Insert: {
          answer_key: Json
          choices?: Json
          course_id: string
          created_at?: string
          created_by: string
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          explanation?: string | null
          id?: string
          lesson_id?: string | null
          module_id?: string | null
          namespace: string
          objective_codes?: string[]
          prompt: string
          question_type: string
          slug: string
          source_basis?: string
          status?: Database["public"]["Enums"]["publication_status"]
          updated_at?: string
          version?: number
        }
        Update: {
          answer_key?: Json
          choices?: Json
          course_id?: string
          created_at?: string
          created_by?: string
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          explanation?: string | null
          id?: string
          lesson_id?: string | null
          module_id?: string | null
          namespace?: string
          objective_codes?: string[]
          prompt?: string
          question_type?: string
          slug?: string
          source_basis?: string
          status?: Database["public"]["Enums"]["publication_status"]
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "learning_questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "published_stem_course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "stem_course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_review_events: {
        Row: {
          actor_id: string
          course_id: string
          created_at: string
          from_status: Database["public"]["Enums"]["publication_status"]
          id: string
          notes: string | null
          to_status: Database["public"]["Enums"]["publication_status"]
        }
        Insert: {
          actor_id: string
          course_id: string
          created_at?: string
          from_status: Database["public"]["Enums"]["publication_status"]
          id?: string
          notes?: string | null
          to_status: Database["public"]["Enums"]["publication_status"]
        }
        Update: {
          actor_id?: string
          course_id?: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["publication_status"]
          id?: string
          notes?: string | null
          to_status?: Database["public"]["Enums"]["publication_status"]
        }
        Relationships: [
          {
            foreignKeyName: "learning_review_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "learning_review_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_review_events_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_review_events_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_review_events_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          approved_for_public_at: string | null
          approved_for_public_by: string | null
          club_id: string | null
          consent_required: boolean
          consent_state: Database["public"]["Enums"]["media_consent_state"]
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          deletion_reason: string | null
          description: string | null
          duration_seconds: number | null
          height: number | null
          id: string
          idea_id: string | null
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          related_event_id: string | null
          school_id: string
          size_bytes: number
          storage_bucket: string
          storage_path: string
          title: string
          updated_at: string
          upload_session_id: string | null
          uploader_id: string
          visibility: Database["public"]["Enums"]["visibility_level"]
          width: number | null
        }
        Insert: {
          approved_for_public_at?: string | null
          approved_for_public_by?: string | null
          club_id?: string | null
          consent_required?: boolean
          consent_state?: Database["public"]["Enums"]["media_consent_state"]
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          description?: string | null
          duration_seconds?: number | null
          height?: number | null
          id?: string
          idea_id?: string | null
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          related_event_id?: string | null
          school_id: string
          size_bytes: number
          storage_bucket: string
          storage_path: string
          title: string
          updated_at?: string
          upload_session_id?: string | null
          uploader_id: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
          width?: number | null
        }
        Update: {
          approved_for_public_at?: string | null
          approved_for_public_by?: string | null
          club_id?: string | null
          consent_required?: boolean
          consent_state?: Database["public"]["Enums"]["media_consent_state"]
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          description?: string | null
          duration_seconds?: number | null
          height?: number | null
          id?: string
          idea_id?: string | null
          media_type?: Database["public"]["Enums"]["media_type"]
          mime_type?: string
          related_event_id?: string | null
          school_id?: string
          size_bytes?: number
          storage_bucket?: string
          storage_path?: string
          title?: string
          updated_at?: string
          upload_session_id?: string | null
          uploader_id?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_approved_for_public_by_fkey"
            columns: ["approved_for_public_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "media_assets_approved_for_public_by_fkey"
            columns: ["approved_for_public_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "media_assets_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_upload_session_id_fkey"
            columns: ["upload_session_id"]
            isOneToOne: false
            referencedRelation: "media_upload_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "media_assets_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_consents: {
        Row: {
          club_id: string | null
          created_at: string
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          media_asset_id: string | null
          relationship_to_subject: string | null
          revoked_at: string | null
          scope: string
          status: Database["public"]["Enums"]["consent_status"]
          subject_user_id: string
          updated_at: string
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          media_asset_id?: string | null
          relationship_to_subject?: string | null
          revoked_at?: string | null
          scope: string
          status?: Database["public"]["Enums"]["consent_status"]
          subject_user_id: string
          updated_at?: string
        }
        Update: {
          club_id?: string | null
          created_at?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          media_asset_id?: string | null
          relationship_to_subject?: string | null
          revoked_at?: string | null
          scope?: string
          status?: Database["public"]["Enums"]["consent_status"]
          subject_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_consents_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_consents_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_consents_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "media_consents_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_consents_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_consents_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_consents_subject_user_id_fkey"
            columns: ["subject_user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "media_consents_subject_user_id_fkey"
            columns: ["subject_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_upload_sessions: {
        Row: {
          aborted_at: string | null
          club_id: string | null
          consent_required: boolean
          created_at: string
          declared_mime_type: string
          declared_size_bytes: number
          description: string | null
          detected_mime_type: string | null
          error_message: string | null
          expires_at: string
          finalized_at: string | null
          id: string
          idea_id: string | null
          media_asset_id: string | null
          media_type: Database["public"]["Enums"]["media_type"]
          related_event_id: string | null
          school_id: string
          status: Database["public"]["Enums"]["media_upload_status"]
          storage_bucket: string
          storage_path: string
          title: string
          updated_at: string
          uploaded_at: string | null
          uploader_id: string
          visibility: Database["public"]["Enums"]["visibility_level"]
        }
        Insert: {
          aborted_at?: string | null
          club_id?: string | null
          consent_required?: boolean
          created_at?: string
          declared_mime_type: string
          declared_size_bytes: number
          description?: string | null
          detected_mime_type?: string | null
          error_message?: string | null
          expires_at?: string
          finalized_at?: string | null
          id?: string
          idea_id?: string | null
          media_asset_id?: string | null
          media_type: Database["public"]["Enums"]["media_type"]
          related_event_id?: string | null
          school_id: string
          status?: Database["public"]["Enums"]["media_upload_status"]
          storage_bucket: string
          storage_path: string
          title: string
          updated_at?: string
          uploaded_at?: string | null
          uploader_id: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Update: {
          aborted_at?: string | null
          club_id?: string | null
          consent_required?: boolean
          created_at?: string
          declared_mime_type?: string
          declared_size_bytes?: number
          description?: string | null
          detected_mime_type?: string | null
          error_message?: string | null
          expires_at?: string
          finalized_at?: string | null
          id?: string
          idea_id?: string | null
          media_asset_id?: string | null
          media_type?: Database["public"]["Enums"]["media_type"]
          related_event_id?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["media_upload_status"]
          storage_bucket?: string
          storage_path?: string
          title?: string
          updated_at?: string
          uploaded_at?: string | null
          uploader_id?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Relationships: [
          {
            foreignKeyName: "media_upload_sessions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_upload_sessions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_upload_sessions_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_upload_sessions_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_upload_sessions_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_upload_sessions_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_upload_sessions_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_upload_sessions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_upload_sessions_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "media_upload_sessions_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_blocks: {
        Row: {
          block_type: Database["public"]["Enums"]["newsletter_block_type"]
          content: Json
          created_at: string
          id: string
          newsletter_id: string
          position: number
          updated_at: string
        }
        Insert: {
          block_type: Database["public"]["Enums"]["newsletter_block_type"]
          content?: Json
          created_at?: string
          id?: string
          newsletter_id: string
          position: number
          updated_at?: string
        }
        Update: {
          block_type?: Database["public"]["Enums"]["newsletter_block_type"]
          content?: Json
          created_at?: string
          id?: string
          newsletter_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_blocks_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_blocks_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "published_newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_sections: {
        Row: {
          body: string
          created_at: string
          heading: string
          id: string
          media_asset_id: string | null
          newsletter_id: string
          position: number
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          heading: string
          id?: string
          media_asset_id?: string | null
          newsletter_id: string
          position: number
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          heading?: string
          id?: string
          media_asset_id?: string | null
          newsletter_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sections_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sections_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sections_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sections_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "published_newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletters: {
        Row: {
          archived_at: string | null
          club_id: string | null
          created_at: string
          created_by: string
          email_campaign_id: string | null
          id: string
          issue_label: string | null
          period_end: string | null
          period_start: string | null
          preview_text: string | null
          published_at: string | null
          scheduled_for: string | null
          school_id: string
          selected_facts: Json
          status: Database["public"]["Enums"]["publication_status"]
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_level"]
        }
        Insert: {
          archived_at?: string | null
          club_id?: string | null
          created_at?: string
          created_by: string
          email_campaign_id?: string | null
          id?: string
          issue_label?: string | null
          period_end?: string | null
          period_start?: string | null
          preview_text?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          school_id: string
          selected_facts?: Json
          status?: Database["public"]["Enums"]["publication_status"]
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Update: {
          archived_at?: string | null
          club_id?: string | null
          created_at?: string
          created_by?: string
          email_campaign_id?: string | null
          id?: string
          issue_label?: string | null
          period_end?: string | null
          period_start?: string | null
          preview_text?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          school_id?: string
          selected_facts?: Json
          status?: Database["public"]["Enums"]["publication_status"]
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_level"]
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletters_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "newsletters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletters_email_campaign_id_fkey"
            columns: ["email_campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string
          club_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          notification_type: string
          payload: Json
          read_at: string | null
          school_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body: string
          club_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          notification_type: string
          payload?: Json
          read_at?: string | null
          school_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string
          club_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          notification_type?: string
          payload?: Json
          read_at?: string | null
          school_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_role_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          revoked_at: string | null
          role: Database["public"]["Enums"]["platform_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          revoked_at?: string | null
          role: Database["public"]["Enums"]["platform_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          revoked_at?: string | null
          role?: Database["public"]["Enums"]["platform_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_role_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "platform_role_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "platform_role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_band: Database["public"]["Enums"]["age_band"]
          avatar_asset_id: string | null
          created_at: string
          display_format: Database["public"]["Enums"]["profile_display_format"]
          display_name: string
          first_name: string | null
          grade_band: Database["public"]["Enums"]["grade_band"] | null
          id: string
          last_initial: string | null
          onboarding_completed_at: string | null
          primary_school_id: string | null
          show_avatar_to_club_members: boolean
          show_school_to_club_members: boolean
          updated_at: string
        }
        Insert: {
          age_band: Database["public"]["Enums"]["age_band"]
          avatar_asset_id?: string | null
          created_at?: string
          display_format?: Database["public"]["Enums"]["profile_display_format"]
          display_name: string
          first_name?: string | null
          grade_band?: Database["public"]["Enums"]["grade_band"] | null
          id: string
          last_initial?: string | null
          onboarding_completed_at?: string | null
          primary_school_id?: string | null
          show_avatar_to_club_members?: boolean
          show_school_to_club_members?: boolean
          updated_at?: string
        }
        Update: {
          age_band?: Database["public"]["Enums"]["age_band"]
          avatar_asset_id?: string | null
          created_at?: string
          display_format?: Database["public"]["Enums"]["profile_display_format"]
          display_name?: string
          first_name?: string | null
          grade_band?: Database["public"]["Enums"]["grade_band"] | null
          id?: string
          last_initial?: string | null
          onboarding_completed_at?: string | null
          primary_school_id?: string | null
          show_avatar_to_club_members?: boolean
          show_school_to_club_members?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_avatar_asset_id_fkey"
            columns: ["avatar_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_avatar_asset_id_fkey"
            columns: ["avatar_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      renewal_reminders: {
        Row: {
          club_id: string
          created_at: string
          due_on: string
          id: string
          reminder_kind: string
          scheduled_for: string
          school_year: string
          sent_at: string | null
        }
        Insert: {
          club_id: string
          created_at?: string
          due_on: string
          id?: string
          reminder_kind: string
          scheduled_for: string
          school_year: string
          sent_at?: string | null
        }
        Update: {
          club_id?: string
          created_at?: string
          due_on?: string
          id?: string
          reminder_kind?: string
          scheduled_for?: string
          school_year?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "renewal_reminders_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renewal_reminders_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      school_course_features: {
        Row: {
          course_id: string
          created_at: string
          created_by: string
          id: string
          is_enabled: boolean
          school_id: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by: string
          id?: string
          is_enabled?: boolean
          school_id: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string
          id?: string
          is_enabled?: boolean
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_course_features_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_course_features_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_course_features_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_course_features_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "school_course_features_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_course_features_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          city: string
          created_at: string
          email_domain: string | null
          id: string
          is_active: boolean
          level: Database["public"]["Enums"]["school_level"]
          name: string
          slug: string
          state_code: string
          timezone: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          city: string
          created_at?: string
          email_domain?: string | null
          id?: string
          is_active?: boolean
          level: Database["public"]["Enums"]["school_level"]
          name: string
          slug: string
          state_code?: string
          timezone?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          email_domain?: string | null
          id?: string
          is_active?: boolean
          level?: Database["public"]["Enums"]["school_level"]
          name?: string
          slug?: string
          state_code?: string
          timezone?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      stem_course_metrics: {
        Row: {
          course_completion_count: number
          course_id: string
          resource_completion_count: number
          start_count: number
          subscription_count: number
          updated_at: string
        }
        Insert: {
          course_completion_count?: number
          course_id: string
          resource_completion_count?: number
          start_count?: number
          subscription_count?: number
          updated_at?: string
        }
        Update: {
          course_completion_count?: number
          course_id?: string
          resource_completion_count?: number
          start_count?: number
          subscription_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stem_course_metrics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_course_metrics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_course_metrics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      stem_course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          is_published: boolean
          position: number
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean
          position: number
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean
          position?: number
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stem_course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      stem_courses: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          archived_at: string | null
          course_kind: string
          course_namespace: string | null
          created_at: string
          created_by: string
          description: string
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          discipline: Database["public"]["Enums"]["stem_discipline"]
          estimated_minutes: number | null
          format: Database["public"]["Enums"]["course_format"]
          framework_code: string | null
          framework_year: number | null
          grade_bands: Database["public"]["Enums"]["age_band"][]
          id: string
          is_featured: boolean
          is_free: boolean
          is_published: boolean
          last_verified_at: string | null
          license_name: string
          license_url: string | null
          provider_name: string
          published_at: string | null
          slug: string
          source_basis: string
          source_url: string
          status: Database["public"]["Enums"]["publication_status"]
          thumbnail_asset_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          course_kind?: string
          course_namespace?: string | null
          created_at?: string
          created_by: string
          description: string
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          discipline: Database["public"]["Enums"]["stem_discipline"]
          estimated_minutes?: number | null
          format?: Database["public"]["Enums"]["course_format"]
          framework_code?: string | null
          framework_year?: number | null
          grade_bands: Database["public"]["Enums"]["age_band"][]
          id?: string
          is_featured?: boolean
          is_free?: boolean
          is_published?: boolean
          last_verified_at?: string | null
          license_name: string
          license_url?: string | null
          provider_name: string
          published_at?: string | null
          slug: string
          source_basis?: string
          source_url: string
          status?: Database["public"]["Enums"]["publication_status"]
          thumbnail_asset_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          course_kind?: string
          course_namespace?: string | null
          created_at?: string
          created_by?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          discipline?: Database["public"]["Enums"]["stem_discipline"]
          estimated_minutes?: number | null
          format?: Database["public"]["Enums"]["course_format"]
          framework_code?: string | null
          framework_year?: number | null
          grade_bands?: Database["public"]["Enums"]["age_band"][]
          id?: string
          is_featured?: boolean
          is_free?: boolean
          is_published?: boolean
          last_verified_at?: string | null
          license_name?: string
          license_url?: string | null
          provider_name?: string
          published_at?: string | null
          slug?: string
          source_basis?: string
          source_url?: string
          status?: Database["public"]["Enums"]["publication_status"]
          thumbnail_asset_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stem_courses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "stem_courses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "stem_courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_courses_thumbnail_asset_id_fkey"
            columns: ["thumbnail_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_courses_thumbnail_asset_id_fkey"
            columns: ["thumbnail_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      stem_resources: {
        Row: {
          created_at: string
          description: string | null
          estimated_minutes: number | null
          external_url: string | null
          id: string
          is_published: boolean
          media_asset_id: string | null
          module_id: string
          position: number
          resource_type: Database["public"]["Enums"]["resource_type"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          external_url?: string | null
          id?: string
          is_published?: boolean
          media_asset_id?: string | null
          module_id: string
          position: number
          resource_type: Database["public"]["Enums"]["resource_type"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          external_url?: string | null
          id?: string
          is_published?: boolean
          media_asset_id?: string | null
          module_id?: string
          position?: number
          resource_type?: Database["public"]["Enums"]["resource_type"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stem_resources_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_resources_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_resources_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "published_stem_course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_resources_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "stem_course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_email_preferences: {
        Row: {
          category: Database["public"]["Enums"]["email_preference_category"]
          created_at: string
          id: string
          opted_in: boolean
          unsubscribed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["email_preference_category"]
          created_at?: string
          id?: string
          opted_in?: boolean
          unsubscribed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["email_preference_category"]
          created_at?: string
          id?: string
          opted_in?: boolean
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_email_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_email_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_guardian_relationships: {
        Row: {
          created_at: string
          guardian_user_id: string
          id: string
          relationship: string
          revoked_at: string | null
          student_user_id: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          guardian_user_id: string
          id?: string
          relationship: string
          revoked_at?: string | null
          student_user_id: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          guardian_user_id?: string
          id?: string
          relationship?: string
          revoked_at?: string | null
          student_user_id?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_guardian_relationships_guardian_user_id_fkey"
            columns: ["guardian_user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_guardian_relationships_guardian_user_id_fkey"
            columns: ["guardian_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_guardian_relationships_student_user_id_fkey"
            columns: ["student_user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_guardian_relationships_student_user_id_fkey"
            columns: ["student_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_guardian_relationships_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_guardian_relationships_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_preferences: {
        Row: {
          category: Database["public"]["Enums"]["in_app_notification_category"]
          created_at: string
          id: string
          in_app_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["in_app_notification_category"]
          created_at?: string
          id?: string
          in_app_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["in_app_notification_category"]
          created_at?: string
          id?: string
          in_app_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_school_memberships: {
        Row: {
          created_at: string
          exited_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["school_role"]
          school_id: string
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exited_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role: Database["public"]["Enums"]["school_role"]
          school_id: string
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exited_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["school_role"]
          school_id?: string
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_school_memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_school_memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_school_memberships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_school_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "club_member_directory"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_school_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      club_charter_applicant_feedback: {
        Row: {
          applicant_feedback: string | null
          charter_id: string | null
          decision: Database["public"]["Enums"]["review_decision"] | null
          id: string | null
          reviewed_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_charter_reviews_charter_id_fkey"
            columns: ["charter_id"]
            isOneToOne: false
            referencedRelation: "club_charters"
            referencedColumns: ["id"]
          },
        ]
      }
      club_idea_applicant_feedback: {
        Row: {
          applicant_feedback: string | null
          assigned_at: string | null
          decision: Database["public"]["Enums"]["review_decision"] | null
          id: string | null
          idea_id: string | null
          reviewed_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_idea_reviews_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "club_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      club_member_directory: {
        Row: {
          avatar_asset_id: string | null
          club_id: string | null
          display_name: string | null
          school_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_renewal_applicant_feedback: {
        Row: {
          applicant_feedback: string | null
          decision: Database["public"]["Enums"]["review_decision"] | null
          id: string | null
          renewal_id: string | null
          reviewed_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_renewal_reviews_renewal_id_fkey"
            columns: ["renewal_id"]
            isOneToOne: false
            referencedRelation: "club_renewals"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_attempt_aggregates: {
        Row: {
          attempt_count: number | null
          correct_count: number | null
          course_id: string | null
          participant_count: number | null
          question_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "learning_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "learning_questions_student"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_questions_student: {
        Row: {
          choices: Json | null
          course_id: string | null
          difficulty: Database["public"]["Enums"]["course_difficulty"] | null
          id: string | null
          lesson_id: string | null
          module_id: string | null
          namespace: string | null
          objective_codes: string[] | null
          prompt: string | null
          question_type: string | null
          slug: string | null
          source_basis: string | null
          status: Database["public"]["Enums"]["publication_status"] | null
          version: number | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "published_stem_course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "stem_course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      published_ap_courses: {
        Row: {
          course_namespace: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["course_difficulty"] | null
          discipline: Database["public"]["Enums"]["stem_discipline"] | null
          estimated_minutes: number | null
          format: Database["public"]["Enums"]["course_format"] | null
          framework_code: string | null
          framework_year: number | null
          grade_bands: Database["public"]["Enums"]["age_band"][] | null
          id: string | null
          published_at: string | null
          slug: string | null
          source_basis: string | null
          thumbnail_asset_id: string | null
          title: string | null
        }
        Insert: {
          course_namespace?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"] | null
          discipline?: Database["public"]["Enums"]["stem_discipline"] | null
          estimated_minutes?: number | null
          format?: Database["public"]["Enums"]["course_format"] | null
          framework_code?: string | null
          framework_year?: number | null
          grade_bands?: Database["public"]["Enums"]["age_band"][] | null
          id?: string | null
          published_at?: string | null
          slug?: string | null
          source_basis?: string | null
          thumbnail_asset_id?: string | null
          title?: string | null
        }
        Update: {
          course_namespace?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"] | null
          discipline?: Database["public"]["Enums"]["stem_discipline"] | null
          estimated_minutes?: number | null
          format?: Database["public"]["Enums"]["course_format"] | null
          framework_code?: string | null
          framework_year?: number | null
          grade_bands?: Database["public"]["Enums"]["age_band"][] | null
          id?: string | null
          published_at?: string | null
          slug?: string | null
          source_basis?: string | null
          thumbnail_asset_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stem_courses_thumbnail_asset_id_fkey"
            columns: ["thumbnail_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_courses_thumbnail_asset_id_fkey"
            columns: ["thumbnail_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      published_club_highlights: {
        Row: {
          body: string | null
          club_id: string | null
          cover_asset_id: string | null
          id: string | null
          occurred_on: string | null
          published_at: string | null
          related_activity_id: string | null
          related_event_id: string | null
          source_type:
            | Database["public"]["Enums"]["highlight_source_type"]
            | null
          summary: string | null
          title: string | null
        }
        Insert: {
          body?: string | null
          club_id?: string | null
          cover_asset_id?: string | null
          id?: string | null
          occurred_on?: string | null
          published_at?: string | null
          related_activity_id?: string | null
          related_event_id?: string | null
          source_type?:
            | Database["public"]["Enums"]["highlight_source_type"]
            | null
          summary?: string | null
          title?: string | null
        }
        Update: {
          body?: string | null
          club_id?: string | null
          cover_asset_id?: string | null
          id?: string | null
          occurred_on?: string | null
          published_at?: string | null
          related_activity_id?: string | null
          related_event_id?: string | null
          source_type?:
            | Database["public"]["Enums"]["highlight_source_type"]
            | null
          summary?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_highlights_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_cover_asset_id_fkey"
            columns: ["cover_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_cover_asset_id_fkey"
            columns: ["cover_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_related_activity_id_fkey"
            columns: ["related_activity_id"]
            isOneToOne: false
            referencedRelation: "club_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_highlights_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "published_events"
            referencedColumns: ["id"]
          },
        ]
      }
      published_clubs: {
        Row: {
          category: string | null
          description: string | null
          founded_on: string | null
          grade_max: number | null
          grade_min: number | null
          id: string | null
          logo_asset_id: string | null
          mission: string | null
          name: string | null
          school_id: string | null
          slug: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          founded_on?: string | null
          grade_max?: number | null
          grade_min?: number | null
          id?: string | null
          logo_asset_id?: string | null
          mission?: string | null
          name?: string | null
          school_id?: string | null
          slug?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          founded_on?: string | null
          grade_max?: number | null
          grade_min?: number | null
          id?: string | null
          logo_asset_id?: string | null
          mission?: string | null
          name?: string | null
          school_id?: string | null
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clubs_logo_asset_id_fkey"
            columns: ["logo_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_logo_asset_id_fkey"
            columns: ["logo_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      published_events: {
        Row: {
          capacity: number | null
          club_id: string | null
          description: string | null
          ends_at: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          format: Database["public"]["Enums"]["event_format"] | null
          id: string | null
          location_name: string | null
          online_url: string | null
          rsvp_deadline: string | null
          school_id: string | null
          starts_at: string | null
          timezone: string | null
          title: string | null
          waitlist_enabled: boolean | null
        }
        Insert: {
          capacity?: number | null
          club_id?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          format?: Database["public"]["Enums"]["event_format"] | null
          id?: string | null
          location_name?: string | null
          online_url?: string | null
          rsvp_deadline?: string | null
          school_id?: string | null
          starts_at?: string | null
          timezone?: string | null
          title?: string | null
          waitlist_enabled?: boolean | null
        }
        Update: {
          capacity?: number | null
          club_id?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          format?: Database["public"]["Enums"]["event_format"] | null
          id?: string | null
          location_name?: string | null
          online_url?: string | null
          rsvp_deadline?: string | null
          school_id?: string | null
          starts_at?: string | null
          timezone?: string | null
          title?: string | null
          waitlist_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      published_media_assets: {
        Row: {
          club_id: string | null
          created_at: string | null
          description: string | null
          id: string | null
          media_type: Database["public"]["Enums"]["media_type"] | null
          mime_type: string | null
          size_bytes: number | null
          title: string | null
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          mime_type?: string | null
          size_bytes?: number | null
          title?: string | null
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          mime_type?: string | null
          size_bytes?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      published_newsletter_blocks: {
        Row: {
          block_type:
            | Database["public"]["Enums"]["newsletter_block_type"]
            | null
          content: Json | null
          id: string | null
          newsletter_id: string | null
          position: number | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_blocks_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_blocks_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "published_newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
      published_newsletter_sections: {
        Row: {
          body: string | null
          heading: string | null
          id: string | null
          media_asset_id: string | null
          newsletter_id: string | null
          position: number | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sections_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sections_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sections_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sections_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "published_newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
      published_newsletters: {
        Row: {
          club_id: string | null
          club_name: string | null
          club_slug: string | null
          id: string | null
          issue_label: string | null
          period_end: string | null
          period_start: string | null
          preview_text: string | null
          published_at: string | null
          school_id: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletters_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "published_clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      published_stem_course_modules: {
        Row: {
          course_id: string | null
          description: string | null
          estimated_minutes: number | null
          id: string | null
          position: number | null
          slug: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stem_course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_ap_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "published_stem_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "stem_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      published_stem_courses: {
        Row: {
          description: string | null
          difficulty: Database["public"]["Enums"]["course_difficulty"] | null
          discipline: Database["public"]["Enums"]["stem_discipline"] | null
          estimated_minutes: number | null
          format: Database["public"]["Enums"]["course_format"] | null
          grade_bands: Database["public"]["Enums"]["age_band"][] | null
          id: string | null
          is_free: boolean | null
          last_verified_at: string | null
          license_name: string | null
          license_url: string | null
          provider_name: string | null
          published_at: string | null
          slug: string | null
          source_url: string | null
          thumbnail_asset_id: string | null
          title: string | null
        }
        Insert: {
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"] | null
          discipline?: Database["public"]["Enums"]["stem_discipline"] | null
          estimated_minutes?: number | null
          format?: Database["public"]["Enums"]["course_format"] | null
          grade_bands?: Database["public"]["Enums"]["age_band"][] | null
          id?: string | null
          is_free?: boolean | null
          last_verified_at?: string | null
          license_name?: string | null
          license_url?: string | null
          provider_name?: string | null
          published_at?: string | null
          slug?: string | null
          source_url?: string | null
          thumbnail_asset_id?: string | null
          title?: string | null
        }
        Update: {
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"] | null
          discipline?: Database["public"]["Enums"]["stem_discipline"] | null
          estimated_minutes?: number | null
          format?: Database["public"]["Enums"]["course_format"] | null
          grade_bands?: Database["public"]["Enums"]["age_band"][] | null
          id?: string | null
          is_free?: boolean | null
          last_verified_at?: string | null
          license_name?: string | null
          license_url?: string | null
          provider_name?: string | null
          published_at?: string | null
          slug?: string | null
          source_url?: string | null
          thumbnail_asset_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stem_courses_thumbnail_asset_id_fkey"
            columns: ["thumbnail_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_courses_thumbnail_asset_id_fkey"
            columns: ["thumbnail_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      published_stem_resources: {
        Row: {
          description: string | null
          estimated_minutes: number | null
          external_url: string | null
          id: string | null
          media_asset_id: string | null
          module_id: string | null
          position: number | null
          resource_type: Database["public"]["Enums"]["resource_type"] | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stem_resources_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_resources_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "published_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_resources_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "published_stem_course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stem_resources_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "stem_course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      abort_media_upload_session: {
        Args: { target_session_id: string }
        Returns: string
      }
      activate_managed_account: {
        Args: { target_user_id: string }
        Returns: Database["public"]["Enums"]["account_onboarding_status"]
      }
      admin_override_event_rsvp: {
        Args: {
          desired_status: Database["public"]["Enums"]["rsvp_status"]
          override_note: string
          target_rsvp_id: string
        }
        Returns: string
      }
      assign_platform_role: {
        Args: {
          target_role: Database["public"]["Enums"]["platform_role"]
          target_user_id: string
        }
        Returns: string
      }
      can_access_school_dashboard: {
        Args: { target_school_id: string; user_id?: string }
        Returns: boolean
      }
      can_edit_idea: {
        Args: { target_idea_id: string; user_id?: string }
        Returns: boolean
      }
      can_manage_campaign: {
        Args: { target_campaign_id: string; user_id?: string }
        Returns: boolean
      }
      can_manage_club: {
        Args: { target_club_id: string; user_id?: string }
        Returns: boolean
      }
      can_manage_school: {
        Args: { target_school_id: string; user_id?: string }
        Returns: boolean
      }
      can_review_school: {
        Args: { target_school_id: string; user_id?: string }
        Returns: boolean
      }
      can_view_club: {
        Args: { target_club_id: string; user_id?: string }
        Returns: boolean
      }
      can_view_event: {
        Args: { target_event_id: string; user_id?: string }
        Returns: boolean
      }
      can_view_idea: {
        Args: { target_idea_id: string; user_id?: string }
        Returns: boolean
      }
      can_view_learning_aggregates: {
        Args: { target_course_id: string }
        Returns: boolean
      }
      can_view_media_asset: {
        Args: { target_asset_id: string; user_id?: string }
        Returns: boolean
      }
      can_view_profile: {
        Args: { target_profile_id: string; user_id?: string }
        Returns: boolean
      }
      claim_communication_jobs: {
        Args: { batch_size?: number; worker_id: string }
        Returns: {
          attempt_count: number
          campaign_id: string | null
          club_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          idempotency_key: string
          job_type: Database["public"]["Enums"]["communication_job_type"]
          last_error: string | null
          locked_at: string | null
          locked_by: string | null
          max_attempts: number
          payload: Json
          run_after: string
          school_id: string | null
          status: Database["public"]["Enums"]["communication_job_status"]
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "communication_jobs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      claim_pending_email_recipients: {
        Args: { batch_size?: number; target_campaign_id: string }
        Returns: {
          attempt_count: number
          campaign_id: string
          created_at: string
          delivered_at: string | null
          failed_at: string | null
          id: string
          idempotency_key: string | null
          last_error: string | null
          max_attempts: number
          next_attempt_at: string
          permanent_failure: boolean
          provider_message_id: string | null
          recipient_user_id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["email_recipient_status"]
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "email_recipients"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      claim_student_school_membership: {
        Args: { target_school_id: string }
        Returns: string
      }
      club_month_facts: {
        Args: { range_end: string; range_start: string; target_club_id: string }
        Returns: Json
      }
      complete_communication_job: {
        Args: {
          error_message?: string
          succeeded: boolean
          target_job_id: string
        }
        Returns: undefined
      }
      complete_oauth_profile: {
        Args: {
          first_name: string
          last_initial: string
          school_id?: string
          selected_age_band: Database["public"]["Enums"]["age_band"]
          selected_grade_band?: Database["public"]["Enums"]["grade_band"]
        }
        Returns: Database["public"]["Enums"]["account_onboarding_status"]
      }
      complete_verified_onboarding: {
        Args: never
        Returns: Database["public"]["Enums"]["account_onboarding_status"]
      }
      convert_approved_idea_to_club: {
        Args: {
          confirm_name: string
          confirm_slug: string
          target_idea_id: string
        }
        Returns: string
      }
      count_active_platform_admins: { Args: never; Returns: number }
      count_email_audience: {
        Args: {
          audience: Database["public"]["Enums"]["email_audience_type"]
          category?: Database["public"]["Enums"]["email_preference_category"]
          filter?: Json
          target_club_id: string
        }
        Returns: number
      }
      count_event_going: { Args: { target_event_id: string }; Returns: number }
      create_club_idea_draft: {
        Args: { target_application_kind?: string; target_school_id: string }
        Returns: string
      }
      emit_in_app_notification: {
        Args: {
          p_action_url?: string
          p_body: string
          p_club_id?: string
          p_entity_id?: string
          p_entity_type?: string
          p_payload?: Json
          p_school_id?: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      emit_in_app_notifications_to_club_members: {
        Args: {
          p_action_url?: string
          p_body: string
          p_club_id: string
          p_entity_id?: string
          p_entity_type?: string
          p_exclude_user_id?: string
          p_payload?: Json
          p_roles?: Database["public"]["Enums"]["club_role"][]
          p_title: string
          p_type: string
        }
        Returns: number
      }
      enqueue_communication_job: {
        Args: {
          p_campaign_id?: string
          p_idempotency_key: string
          p_job_type: Database["public"]["Enums"]["communication_job_type"]
          p_payload?: Json
          p_run_after?: string
        }
        Returns: string
      }
      enqueue_renewal_reminders: { Args: { as_of?: string }; Returns: number }
      ensure_stem_course_metrics: {
        Args: { target_course_id: string }
        Returns: undefined
      }
      has_club_role: {
        Args: {
          allowed_roles: Database["public"]["Enums"]["club_role"][]
          target_club_id: string
          user_id?: string
        }
        Returns: boolean
      }
      has_school_role: {
        Args: {
          allowed_roles: Database["public"]["Enums"]["school_role"][]
          target_school_id: string
          user_id?: string
        }
        Returns: boolean
      }
      internal_emit_in_app_notification: {
        Args: {
          p_action_url?: string
          p_body: string
          p_club_id?: string
          p_entity_id?: string
          p_entity_type?: string
          p_payload?: Json
          p_school_id?: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      is_club_member: {
        Args: { target_club_id: string; user_id?: string }
        Returns: boolean
      }
      is_committee_reviewer: { Args: { user_id?: string }; Returns: boolean }
      is_guardian_of: {
        Args: { target_student_id: string; user_id?: string }
        Returns: boolean
      }
      is_platform_admin: { Args: { user_id?: string }; Returns: boolean }
      is_published_ap_course: {
        Args: { target_course_id: string }
        Returns: boolean
      }
      is_school_member: {
        Args: { target_school_id: string; user_id?: string }
        Returns: boolean
      }
      is_valid_school_year: { Args: { value: string }; Returns: boolean }
      issue_attendance_check_in_token: {
        Args: { target_session_id: string; ttl_seconds?: number }
        Returns: string
      }
      list_club_invite_candidates: {
        Args: { target_club_id: string }
        Returns: {
          display_name: string
          user_id: string
        }[]
      }
      mark_all_notifications_read: { Args: never; Returns: number }
      may_inspect_user: { Args: { target_user_id: string }; Returns: boolean }
      notification_category_for_type: {
        Args: { p_type: string }
        Returns: Database["public"]["Enums"]["in_app_notification_category"]
      }
      officer_enqueue_campaign_send: {
        Args: { send_immediately?: boolean; target_campaign_id: string }
        Returns: string
      }
      preference_category_for_campaign_kind: {
        Args: { kind: Database["public"]["Enums"]["email_campaign_kind"] }
        Returns: Database["public"]["Enums"]["email_preference_category"]
      }
      process_due_renewal_reminders: {
        Args: { as_of?: string }
        Returns: number
      }
      promote_event_waitlist: {
        Args: { target_event_id: string }
        Returns: number
      }
      record_guardian_authorization: {
        Args: { target_user_id: string }
        Returns: Database["public"]["Enums"]["account_onboarding_status"]
      }
      record_learning_attempt: {
        Args: { response: Json; target_question_id: string }
        Returns: {
          attempt_id: string
          explanation: string
          is_correct: boolean
        }[]
      }
      redeem_attendance_check_in: {
        Args: { raw_token: string }
        Returns: string
      }
      refresh_analytics_for_date: {
        Args: { target_date?: string }
        Returns: Json
      }
      refresh_event_club_analytics: {
        Args: { target_event_id: string }
        Returns: undefined
      }
      refresh_media_consent_state: {
        Args: { target_asset_id: string }
        Returns: Database["public"]["Enums"]["media_consent_state"]
      }
      resolve_email_audience_user_ids: {
        Args: {
          audience: Database["public"]["Enums"]["email_audience_type"]
          filter?: Json
          target_club_id: string
        }
        Returns: {
          user_id: string
        }[]
      }
      restrict_under_13_self_signup: { Args: { event: Json }; Returns: Json }
      revoke_platform_role: {
        Args: { target_assignment_id: string }
        Returns: string
      }
      search_command_palette: {
        Args: { p_limit?: number; p_query?: string }
        Returns: {
          description: string
          href: string
          icon: string
          label: string
          rank: number
          result_group: string
          result_id: string
        }[]
      }
      soft_delete_media_asset: {
        Args: { reason: string; target_asset_id: string }
        Returns: string
      }
      upsert_event_rsvp: {
        Args: {
          desired_status: Database["public"]["Enums"]["rsvp_status"]
          target_event_id: string
        }
        Returns: string
      }
      user_allows_email_category: {
        Args: {
          target_category: Database["public"]["Enums"]["email_preference_category"]
          target_user_id: string
        }
        Returns: boolean
      }
      user_allows_in_app_notification: {
        Args: { p_type: string; target_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      account_activation_method:
        | "self_service"
        | "guardian_authorized"
        | "school_managed"
      account_onboarding_status:
        | "pending_email"
        | "pending_guardian"
        | "pending_school"
        | "active"
        | "suspended"
        | "rejected"
      age_band: "under_13" | "age_13_17" | "adult"
      attendance_status: "present" | "late" | "excused" | "absent"
      charter_status:
        | "draft"
        | "submitted"
        | "changes_requested"
        | "approved"
        | "expired"
        | "superseded"
      club_idea_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "changes_requested"
        | "resubmitted"
        | "approved"
        | "rejected"
        | "withdrawn"
        | "converted_to_club"
      club_role:
        | "club_admin"
        | "president"
        | "vice_president"
        | "secretary"
        | "treasurer"
        | "officer"
        | "advisor"
        | "member"
      club_status: "active" | "inactive" | "archived"
      communication_job_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      communication_job_type:
        | "prepare_campaign_recipients"
        | "send_campaign_batch"
        | "send_test_email"
      consent_status: "pending" | "granted" | "denied" | "revoked" | "expired"
      course_difficulty: "beginner" | "intermediate" | "advanced"
      course_format:
        | "self_paced"
        | "video"
        | "interactive"
        | "reading"
        | "project"
        | "mixed"
      dashboard_config_scope: "global" | "school" | "club" | "user"
      dashboard_context_type: "personal" | "club" | "school" | "platform"
      dashboard_home_module_type:
        | "announcement"
        | "featured_courses"
        | "featured_resources"
        | "featured_events"
        | "deadline"
        | "school_message"
      dashboard_mobile_visibility: "always" | "overflow" | "hidden"
      dashboard_module_status: "active" | "deprecated"
      email_audience_type:
        | "all_members"
        | "officers"
        | "membership_segment"
        | "event_attendees"
        | "event_registrants"
      email_campaign_kind:
        | "invitation"
        | "approval"
        | "event_update"
        | "charter_status"
        | "renewal_reminder"
        | "announcement"
        | "newsletter"
        | "event_promotion"
        | "highlight_digest"
      email_campaign_status:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "failed"
        | "cancelled"
      email_event_type:
        | "sent"
        | "delivered"
        | "delivery_delayed"
        | "bounced"
        | "complained"
        | "opened"
        | "clicked"
        | "failed"
      email_preference_category:
        | "transactional"
        | "announcement"
        | "newsletter"
        | "event_promotion"
        | "highlight_digest"
      email_recipient_status:
        | "pending"
        | "sent"
        | "delivered"
        | "bounced"
        | "complained"
        | "failed"
        | "unsubscribed"
        | "cancelled"
      event_format: "in_person" | "online" | "hybrid"
      event_status:
        | "draft"
        | "pending_approval"
        | "published"
        | "cancelled"
        | "completed"
      event_task_status:
        | "open"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "blocked"
      event_type:
        | "club_meeting"
        | "workshop"
        | "speaker"
        | "competition"
        | "hackathon"
        | "community_service"
        | "fundraiser"
        | "field_trip"
        | "social"
        | "showcase"
        | "tournament"
        | "conference"
        | "other"
      grade_band:
        | "k_2"
        | "grade_3_5"
        | "grade_6_8"
        | "grade_9_12"
        | "college"
        | "adult"
        | "other"
      highlight_source_type:
        | "activity"
        | "event"
        | "media"
        | "achievement"
        | "competition"
        | "community_service"
        | "project"
        | "other"
      in_app_notification_category:
        | "club_ideas"
        | "membership"
        | "events"
        | "governance"
        | "communications"
        | "resources"
      logistics_item_status:
        | "not_started"
        | "in_progress"
        | "blocked"
        | "complete"
      logistics_type:
        | "venue"
        | "equipment"
        | "food"
        | "transportation"
        | "volunteers"
        | "accessibility"
        | "permissions"
        | "budget_notes"
        | "setup"
        | "cleanup"
        | "other"
      media_consent_state: "not_required" | "pending" | "granted" | "restricted"
      media_type: "image" | "video" | "document" | "audio" | "other"
      media_upload_status:
        | "pending"
        | "uploaded"
        | "finalized"
        | "aborted"
        | "expired"
      membership_status:
        | "invited"
        | "active"
        | "declined"
        | "suspended"
        | "exited"
      newsletter_block_type:
        | "hero"
        | "text"
        | "highlight"
        | "event_recap"
        | "upcoming_event"
        | "image"
        | "gallery"
        | "stats"
        | "course_recommendation"
        | "cta"
        | "divider"
      platform_role: "platform_admin" | "committee_reviewer"
      profile_display_format:
        | "first_name_last_initial"
        | "first_name_only"
        | "custom"
      publication_status:
        | "draft"
        | "review"
        | "scheduled"
        | "published"
        | "archived"
        | "approved"
      renewal_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "changes_requested"
        | "approved"
        | "rejected"
        | "withdrawn"
      resource_type:
        | "article"
        | "video"
        | "document"
        | "exercise"
        | "external_link"
        | "project"
        | "dataset"
      review_decision: "changes_requested" | "approved" | "rejected"
      rsvp_status: "going" | "maybe" | "not_going" | "waitlisted" | "cancelled"
      school_level: "elementary" | "middle" | "high" | "college" | "other"
      school_role: "school_admin" | "school_advisor" | "student" | "staff"
      stem_discipline:
        | "computer_science"
        | "ai_ml"
        | "mathematics"
        | "physics"
        | "chemistry"
        | "biology"
        | "engineering"
        | "robotics"
        | "astronomy"
        | "earth_science"
        | "cybersecurity"
        | "data_science"
        | "other"
        | "competitive_programming"
      subscription_status: "active" | "completed" | "paused" | "cancelled"
      visibility_level: "public" | "school" | "club" | "private"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_activation_method: [
        "self_service",
        "guardian_authorized",
        "school_managed",
      ],
      account_onboarding_status: [
        "pending_email",
        "pending_guardian",
        "pending_school",
        "active",
        "suspended",
        "rejected",
      ],
      age_band: ["under_13", "age_13_17", "adult"],
      attendance_status: ["present", "late", "excused", "absent"],
      charter_status: [
        "draft",
        "submitted",
        "changes_requested",
        "approved",
        "expired",
        "superseded",
      ],
      club_idea_status: [
        "draft",
        "submitted",
        "under_review",
        "changes_requested",
        "resubmitted",
        "approved",
        "rejected",
        "withdrawn",
        "converted_to_club",
      ],
      club_role: [
        "club_admin",
        "president",
        "vice_president",
        "secretary",
        "treasurer",
        "officer",
        "advisor",
        "member",
      ],
      club_status: ["active", "inactive", "archived"],
      communication_job_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      communication_job_type: [
        "prepare_campaign_recipients",
        "send_campaign_batch",
        "send_test_email",
      ],
      consent_status: ["pending", "granted", "denied", "revoked", "expired"],
      course_difficulty: ["beginner", "intermediate", "advanced"],
      course_format: [
        "self_paced",
        "video",
        "interactive",
        "reading",
        "project",
        "mixed",
      ],
      dashboard_config_scope: ["global", "school", "club", "user"],
      dashboard_context_type: ["personal", "club", "school", "platform"],
      dashboard_home_module_type: [
        "announcement",
        "featured_courses",
        "featured_resources",
        "featured_events",
        "deadline",
        "school_message",
      ],
      dashboard_mobile_visibility: ["always", "overflow", "hidden"],
      dashboard_module_status: ["active", "deprecated"],
      email_audience_type: [
        "all_members",
        "officers",
        "membership_segment",
        "event_attendees",
        "event_registrants",
      ],
      email_campaign_kind: [
        "invitation",
        "approval",
        "event_update",
        "charter_status",
        "renewal_reminder",
        "announcement",
        "newsletter",
        "event_promotion",
        "highlight_digest",
      ],
      email_campaign_status: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "failed",
        "cancelled",
      ],
      email_event_type: [
        "sent",
        "delivered",
        "delivery_delayed",
        "bounced",
        "complained",
        "opened",
        "clicked",
        "failed",
      ],
      email_preference_category: [
        "transactional",
        "announcement",
        "newsletter",
        "event_promotion",
        "highlight_digest",
      ],
      email_recipient_status: [
        "pending",
        "sent",
        "delivered",
        "bounced",
        "complained",
        "failed",
        "unsubscribed",
        "cancelled",
      ],
      event_format: ["in_person", "online", "hybrid"],
      event_status: [
        "draft",
        "pending_approval",
        "published",
        "cancelled",
        "completed",
      ],
      event_task_status: [
        "open",
        "in_progress",
        "completed",
        "cancelled",
        "blocked",
      ],
      event_type: [
        "club_meeting",
        "workshop",
        "speaker",
        "competition",
        "hackathon",
        "community_service",
        "fundraiser",
        "field_trip",
        "social",
        "showcase",
        "tournament",
        "conference",
        "other",
      ],
      grade_band: [
        "k_2",
        "grade_3_5",
        "grade_6_8",
        "grade_9_12",
        "college",
        "adult",
        "other",
      ],
      highlight_source_type: [
        "activity",
        "event",
        "media",
        "achievement",
        "competition",
        "community_service",
        "project",
        "other",
      ],
      in_app_notification_category: [
        "club_ideas",
        "membership",
        "events",
        "governance",
        "communications",
        "resources",
      ],
      logistics_item_status: [
        "not_started",
        "in_progress",
        "blocked",
        "complete",
      ],
      logistics_type: [
        "venue",
        "equipment",
        "food",
        "transportation",
        "volunteers",
        "accessibility",
        "permissions",
        "budget_notes",
        "setup",
        "cleanup",
        "other",
      ],
      media_consent_state: ["not_required", "pending", "granted", "restricted"],
      media_type: ["image", "video", "document", "audio", "other"],
      media_upload_status: [
        "pending",
        "uploaded",
        "finalized",
        "aborted",
        "expired",
      ],
      membership_status: [
        "invited",
        "active",
        "declined",
        "suspended",
        "exited",
      ],
      newsletter_block_type: [
        "hero",
        "text",
        "highlight",
        "event_recap",
        "upcoming_event",
        "image",
        "gallery",
        "stats",
        "course_recommendation",
        "cta",
        "divider",
      ],
      platform_role: ["platform_admin", "committee_reviewer"],
      profile_display_format: [
        "first_name_last_initial",
        "first_name_only",
        "custom",
      ],
      publication_status: [
        "draft",
        "review",
        "scheduled",
        "published",
        "archived",
        "approved",
      ],
      renewal_status: [
        "draft",
        "submitted",
        "under_review",
        "changes_requested",
        "approved",
        "rejected",
        "withdrawn",
      ],
      resource_type: [
        "article",
        "video",
        "document",
        "exercise",
        "external_link",
        "project",
        "dataset",
      ],
      review_decision: ["changes_requested", "approved", "rejected"],
      rsvp_status: ["going", "maybe", "not_going", "waitlisted", "cancelled"],
      school_level: ["elementary", "middle", "high", "college", "other"],
      school_role: ["school_admin", "school_advisor", "student", "staff"],
      stem_discipline: [
        "computer_science",
        "ai_ml",
        "mathematics",
        "physics",
        "chemistry",
        "biology",
        "engineering",
        "robotics",
        "astronomy",
        "earth_science",
        "cybersecurity",
        "data_science",
        "other",
        "competitive_programming",
      ],
      subscription_status: ["active", "completed", "paused", "cancelled"],
      visibility_level: ["public", "school", "club", "private"],
    },
  },
} as const
