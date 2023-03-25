export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      advertisement: {
        Row: {
          id: number;
          image_url: string | null;
          link_to: string | null;
          title: string | null;
        };
        Insert: {
          id?: number;
          image_url?: string | null;
          link_to?: string | null;
          title?: string | null;
        };
        Update: {
          id?: number;
          image_url?: string | null;
          link_to?: string | null;
          title?: string | null;
        };
      };
      appointment: {
        Row: {
          accept_user_id: string[] | null;
          description: string | null;
          end_time: string | null;
          id: number;
          images: string[] | null;
          location: string | null;
          owner_id: string | null;
          pending_user_id: string[] | null;
          reject_user_id: string[] | null;
          start_time: string | null;
          tags: number[] | null;
          title: string | null;
        };
        Insert: {
          accept_user_id?: string[] | null;
          description?: string | null;
          end_time?: string | null;
          id?: number;
          images?: string[] | null;
          location?: string | null;
          owner_id?: string | null;
          pending_user_id?: string[] | null;
          reject_user_id?: string[] | null;
          start_time?: string | null;
          tags?: number[] | null;
          title?: string | null;
        };
        Update: {
          accept_user_id?: string[] | null;
          description?: string | null;
          end_time?: string | null;
          id?: number;
          images?: string[] | null;
          location?: string | null;
          owner_id?: string | null;
          pending_user_id?: string[] | null;
          reject_user_id?: string[] | null;
          start_time?: string | null;
          tags?: number[] | null;
          title?: string | null;
        };
      };
      post: {
        Row: {
          description: string | null;
          end_time: string;
          id: number;
          images: string[];
          location: string | null;
          owner_id: string;
          start_time: string;
          tags: number[];
          title: string;
          participants: string[];
        };
        Insert: {
          description?: string | null;
          end_time: string;
          id?: number;
          images?: string[];
          location?: string | null;
          owner_id: string;
          start_time: string;
          tags: number[];
          title: string;
          participants: string[];
        };
        Update: {
          description?: string | null;
          end_time?: string;
          id?: number;
          images?: string[];
          location?: string | null;
          owner_id?: string;
          start_time?: string;
          tags?: number[];
          title?: string;
          participants?: string[];
        };
      };
      tag: {
        Row: {
          id: number;
          name: string | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
        };
      };
      user: {
        Row: {
          birthdate: string | null;
          description: string | null;
          email: string | null;
          id: string;
          image: string | null;
          is_admin: boolean;
          is_enabled: boolean | null;
          password: string | null;
          rating_score: number | null;
          sex: string | null;
          username: string | null;
        };
        Insert: {
          birthdate?: string | null;
          description?: string | null;
          email?: string | null;
          id: string;
          image?: string | null;
          is_admin?: boolean;
          is_enabled?: boolean | null;
          password?: string | null;
          rating_score?: number | null;
          sex?: string | null;
          username?: string | null;
        };
        Update: {
          birthdate?: string | null;
          description?: string | null;
          email?: string | null;
          id?: string;
          image?: string | null;
          is_admin?: boolean;
          is_enabled?: boolean | null;
          password?: string | null;
          rating_score?: number | null;
          sex?: string | null;
          username?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_appointment: {
        Args: {
          postid: number;
          title: string;
          location: string;
          description: string;
          tags: number[];
          start_time: string;
          end_time: string;
          pending_user_id: string[];
          images: string[];
          owner_id: string;
        };
        Returns: undefined;
      };
      create_post: {
        Args: {
          title: string;
          location: string;
          description: string;
          tags: number[];
          start_time: string;
          end_time: string;
          images: string[];
          owner_id: string;
        };
        Returns: undefined;
      };
      create_user: {
        Args: {
          id: string;
          username: string;
          password: string;
          email: string;
          birthdate: string;
          sex: string;
        };
        Returns: undefined;
      };
      delete_post_by_post_id: {
        Args: {
          id: number;
        };
        Returns: undefined;
      };
      get_is_email_exist: {
        Args: {
          email: string;
        };
        Returns: boolean;
      };
      get_post_by_post_id: {
        Args: {
          id: number;
        };
        Returns: {
          id: number;
          title: string;
          description: string;
          owner_id: string;
          owner_name: string;
          owner_profile: string;
          location: string;
          start_time: string;
          end_time: string;
          tags: number[];
          tag_names: string[];
          images: string[];
        };
      };
      get_posts: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: number;
          title: string;
          description: string;
          owner_id: string;
          owner_name: string;
          owner_profile: string;
          location: string;
          start_time: string;
          end_time: string;
          tags: number[];
          tag_names: string[];
          images: string[];
        };
      };
      get_posts_with_participants: {
        Args: {
          id: number;
        };
        Returns: {
          id: number;
          title: string;
          description: string;
          owner_id: string;
          owner_name: string;
          owner_profile: string;
          location: string;
          start_time: string;
          end_time: string;
          tags: {
            id: number;
            name: string;
          }[];
          images: string[];
          participants: {
            id: string;
            username: string;
            sex: string;
            is_verified: boolean;
            birthdate: string;
            description: string;
            image: string | null;
          }[];
        };
      };
      get_posts_by_user_id: {
        Args: {
          id: string;
        };
        Returns: {
          id: number;
          title: string;
          description: string;
          owner_id: string;
          owner_name: string;
          owner_profile: string;
          location: string;
          start_time: string;
          end_time: string;
          tags: number[];
          tag_names: string[];
          images: string[];
        };
      };
      get_tags: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: number;
          name: string;
        }[];
      };
      get_user_by_user_id: {
        Args: {
          id: string;
        };
        Returns: {
          id: string;
          username: string;
          email: string;
          birthdate: string;
          sex: string;
          description: string;
          is_admin: boolean;
          is_enabled: boolean;
          image: string;
          rating_score: number;
          is_verified: boolean;
        };
      };
      update_post_by_post_id: {
        Args: {
          id: number;
          title: string;
          location: string;
          tags: number[];
          start_time: string;
          end_time: string;
          description: string;
          images: string[];
        };
        Returns: undefined;
      };
      update_user_by_user_id: {
        Args: {
          id: string;
          username: string;
          sex: string;
          description: string;
          image: string | null;
        };
        Returns: undefined;
      };
      update_accept_appointment_by_appointment_id: {
        Args: {
          id: number;
          user_id: string;
        };
        Returns: undefined;
      };
      update_reject_appointment_by_appointment_id: {
        Args: {
          id: number;
          user_id: string;
        };
        Returns: undefined;
      };
      get_appointments: {
        Returns: {
          id: string;
          start_time: string;
          end_time: string;
          owner_id: string;
          location: string;
          title: string;
          description: string;
          tags: number[];
          images: string[];
          pending_user_id: string[];
          accept_user_id: string[];
          reject_user_id: string[];
          username: string;
          image: string;
          participant_number: number;
        };
      };
      get_appointments_by_user_id: {
        Args: {
          id: string;
        };
        Returns: {
          id: string;
          start_time: string;
          end_time: string;
          owner_id: string;
          location: string;
          title: string;
          description: string;
          tags: number[];
          images: string[];
          pending_user_id: string[];
          accept_user_id: string[];
          reject_user_id: string[];
          username: string;
          image: string;
          participant_number: number;
        };
      };
      get_post_with_participants_by_post_id: {
        Args: {
          id: number;
        };
        Returns: {
          id: number;
          title: string;
          description: string;
          owner_id: string;
          owner_name: string;
          owner_profile: string;
          location: string;
          start_time: string;
          end_time: string;
          tags: {
            id: number;
            name: string;
          }[];
          images: string[];
          participants: {
            id: string;
            username: string;
            sex: string;
            is_verified: boolean;
            birthdate: string;
            description: string;
            image: string | null;
          }[];
        };
      };
      get_appointments_by_user_id_which_pending: {
        Args: {
          id: string;
        };
        Return: {
          id: string;
          start_time: string;
          end_time: string;
          owner_id: string;
          location: string;
          title: string;
          description: string;
          tags: string[];
          images: string[];
          pending_user_names: string[];
          accept_user_names: string[];
          reject_user_names: string[];
          username: string;
          image: string;
          participant_number: number;
        };
      };
      get_appointments_by_appointment_id: {
        Args: {
          id: number;
        };
        Returns: {
          id: string;
          start_time: string;
          end_time: string;
          owner_id: string;
          location: string;
          title: string;
          description: string;
          tags: string[];
          images: string[];
          pending_user_names: string[];
          accept_user_names: string[];
          reject_user_names: string[];
          username: string;
          image: string;
          participant_number: number;
        };
      };
      update_user_national_id_by_user_id: {
        Args: {
          id: string;
          national_id: string;
        };
        Returns: {
          is_exist_national_id: boolean;
        };
      };
      add_participant_id_to_post_id: {
        Args: {
          user_id: string;
          post_id: number;
        };
        Returns: undefined;
      };
      remove_participant_id_from_post_id: {
        Args: {
          user_id: string;
          post_id: number;
        };
        Returns: undefined;
      };
      search_posts_by_conditions: {
        Args: {
          tag_ids: number[];
          host_names: string[];
          post_names: string[];
        };
        Returns: {
          id: number;
          title: string;
          description: string;
          owner_id: string;
          owner_name: string;
          owner_profile: string;
          location: string;
          start_time: string;
          end_time: string;
          tags: {
            id: number;
            name: string;
          }[];
          images: string[];
          participants: {
            id: string;
            username: string;
            sex: string;
            is_verified: boolean;
            birthdate: string;
            description: string;
            image: string | null;
          }[];
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
