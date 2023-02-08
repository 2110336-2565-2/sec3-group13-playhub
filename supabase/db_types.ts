export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Admin: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          name: string | null
          password: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
          password?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
          password?: string | null
          username?: string | null
        }
      }
      Advertisement: {
        Row: {
          created_at: string | null
          id: number
          image_url: string | null
          link_to: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          link_to?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          link_to?: string | null
          name?: string | null
        }
      }
      Appointment: {
        Row: {
          appointment_owner: number | null
          appointment_rating: number | null
          created_at: string | null
          end_time: string | null
          id: number
          location: string | null
          start_time: string | null
          status: string | null
          topic: string | null
        }
        Insert: {
          appointment_owner?: number | null
          appointment_rating?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: number
          location?: string | null
          start_time?: string | null
          status?: string | null
          topic?: string | null
        }
        Update: {
          appointment_owner?: number | null
          appointment_rating?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: number
          location?: string | null
          start_time?: string | null
          status?: string | null
          topic?: string | null
        }
      }
      AppointmentParticipant: {
        Row: {
          appointment_id: number | null
          created_at: string | null
          id: number
          participant_id: number | null
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string | null
          id?: number
          participant_id?: number | null
        }
        Update: {
          appointment_id?: number | null
          created_at?: string | null
          id?: number
          participant_id?: number | null
        }
      }
      locationImage: {
        Row: {
          created_at: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          id?: number
        }
      }
      Post: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: number
          location: string | null
          post_description: string | null
          post_name: string
          post_owner_id: number
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: number
          location?: string | null
          post_description?: string | null
          post_name: string
          post_owner_id: number
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: number
          location?: string | null
          post_description?: string | null
          post_name?: string
          post_owner_id?: number
          start_time?: string | null
        }
      }
      PostGameTag: {
        Row: {
          created_at: string | null
          id: number
          post_id: number | null
          tag_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          post_id?: number | null
          tag_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          post_id?: number | null
          tag_id?: number | null
        }
      }
      Tag: {
        Row: {
          created_at: string
          id: number
          name: string 
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
      }
      User: {
        Row: {
          birthdate: string
          created_at: string | null
          description: string
          email: string
          image: string
          is_enabled: boolean | null
          name: string
          password: string | null
          rating_score: number | null
          sex: string
          user_id: string
          username: string
          verified_email: boolean | null
        }
        Insert: {
          birthdate?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          image?: string | null
          is_enabled?: boolean | null
          name?: string | null
          password?: string | null
          rating_score?: number | null
          sex?: string | null
          user_id: string
          username?: string | null
          verified_email?: boolean | null
        }
        Update: {
          birthdate?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          image?: string | null
          is_enabled?: boolean | null
          name?: string | null
          password?: string | null
          rating_score?: number | null
          sex?: string | null
          user_id?: string
          username?: string | null
          verified_email?: boolean | null
        }
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
  }
}
