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
          title: string;
          location: string;
          description: string;
          tags: number[];
          start_time: string;
          end_time: string;
          pending_user_id: string[];
          accept_user_id: string[];
          reject_user_id: string[];
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
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
