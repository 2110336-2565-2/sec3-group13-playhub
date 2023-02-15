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
      get_posts_by_user_id: {
        Args: {
          target_id: string
        }
        Returns: {
          post_id: number
          user_id: string
          username: string
          title: string
          description: string
          profile_image: string
          start_time: string
          end_time: string
          location: string
        }
      },
      get_user_data_by_id: {
        Args: {
          target_id: string
        }
        Returns: {
          user_id: string
          username: string
          sex: string
          birthdate: string
          description: string
          image: string | null
          email: string
          is_admin: boolean
        }
      },
      delete_post_by_id: {
        Args: {
          target_id: number
        }
      },
      get_all_post_tag: {
        Returns: {
          name: string
          post_id: number
        }
      },
      get_all_possible_tags: {
        Returns: {
          name: string
          id: number
        }
      },
      add_user: {
        Args: {
          user_id: string,
          username: string,
          password: string,
          email: string,
          birthdate: string,
          sex: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
