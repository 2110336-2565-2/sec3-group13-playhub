export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      advertisement: {
        Row: {
          end_date: string | null;
          id: number;
          image_url: string | null;
          title: string | null;
        };
        Insert: {
          end_date?: string | null;
          id?: number;
          image_url?: string | null;
          title?: string | null;
        };
        Update: {
          end_date?: string | null;
          id?: number;
          image_url?: string | null;
          title?: string | null;
        };
      };
      appointment: {
        Row: {
          accept_user_id: string[];
          description: string | null;
          end_time: string | null;
          id: number;
          images: string[] | null;
          is_end: boolean | null;
          location: string | null;
          owner_id: string | null;
          pending_user_id: string[] | null;
          reject_user_id: string[];
          start_time: string | null;
          tags: number[] | null;
          title: string | null;
        };
        Insert: {
          accept_user_id?: string[];
          description?: string | null;
          end_time?: string | null;
          id?: number;
          images?: string[] | null;
          is_end?: boolean | null;
          location?: string | null;
          owner_id?: string | null;
          pending_user_id?: string[] | null;
          reject_user_id?: string[];
          start_time?: string | null;
          tags?: number[] | null;
          title?: string | null;
        };
        Update: {
          accept_user_id?: string[];
          description?: string | null;
          end_time?: string | null;
          id?: number;
          images?: string[] | null;
          is_end?: boolean | null;
          location?: string | null;
          owner_id?: string | null;
          pending_user_id?: string[] | null;
          reject_user_id?: string[];
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
          participants: string[];
          start_time: string;
          tags: number[];
          title: string;
        };
        Insert: {
          description?: string | null;
          end_time?: string;
          id?: number;
          images?: string[];
          location?: string | null;
          owner_id: string;
          participants?: string[];
          start_time?: string;
          tags?: number[];
          title?: string;
        };
        Update: {
          description?: string | null;
          end_time?: string;
          id?: number;
          images?: string[];
          location?: string | null;
          owner_id?: string;
          participants?: string[];
          start_time?: string;
          tags?: number[];
          title?: string;
        };
      };
      review: {
        Row: {
          appointment_id: number;
          description: string;
          id: number;
          is_anonymous: boolean | null;
          reviewer_id: string;
          score: number;
        };
        Insert: {
          appointment_id: number;
          description?: string;
          id?: number;
          is_anonymous?: boolean | null;
          reviewer_id: string;
          score: number;
        };
        Update: {
          appointment_id?: number;
          description?: string;
          id?: number;
          is_anonymous?: boolean | null;
          reviewer_id?: string;
          score?: number;
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
          national_id: string | null;
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
          national_id?: string | null;
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
          national_id?: string | null;
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
      add_participant_id_to_post_id: {
        Args: {
          user_id: string;
          post_id: number;
        };
        Returns: undefined;
      };
      create_advertisement: {
        Args: {
          title: string;
          end_date: string;
          image_url: string;
        };
        Returns: undefined;
      };
      create_appointment: {
        Args: {
          postid: number;
          title: string;
          location: string;
          description: string;
          tags: number[];
          start_time: string;
          end_time: string;
          images: string[];
          pending_user_id: string[];
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
      create_review: {
        Args: {
          description: string;
          score: number;
          appointment_id: number;
          reviewer_id: string;
          is_anonymous: boolean;
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
      end_appointment: {
        Args: {
          end_id: number;
        };
        Returns: undefined;
      };
      get_advertisement: {
        Args: Record<PropertyKey, never>;
        Returns: {
          image_url: string;
        };
      };
      get_appointment_by_appointment_id: {
        Args: {
          id: number;
        };
        Returns: {
          id: number;
          start_time: string;
          end_time: string;
          owner_id: string;
          location: string;
          title: string;
          description: string;
          images: string[];
          username: string;
          image: string;
          participant_number: number;
          tags: string[];
          pending_user: Json[];
          accept_user: Json[];
          reject_user: Json[];
        };
      };
      get_appointment_to_rate: {
        Args: {
          id: string;
        };
        Returns: {
          id: number;
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
          id: number;
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
      get_appointments_by_user_id_which_pending: {
        Args: {
          id: string;
        };
        Returns: {
          id: number;
          start_time: string;
          end_time: string;
          owner_id: string;
          location: string;
          title: string;
          description: string;
          images: string[];
          username: string;
          image: string;
          participant_number: number;
          tags: string[];
          pending_user_names: string[];
          accept_user_names: string[];
          reject_user_names: string[];
        };
      };
      get_is_email_exist: {
        Args: {
          email: string;
        };
        Returns: boolean;
      };
      get_is_user_reviewed_appointment: {
        Args: {
          user_id: string;
          appointment_id: number;
        };
        Returns: boolean;
      };
      get_owner_email_by_appointment_id: {
        Args: {
          id: number;
        };
        Returns: string;
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
          images: string[];
          tags: {
            id: number;
            name: string;
          }[];
          participants: Json[];
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
      get_posts_with_participants: {
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
          images: string[];
          tags: Json[];
          participants: Json[];
        };
      };
      get_review_by_reviewer_and_appointment_id: {
        Args: {
          reviewer_id: string;
          appointment_id: number;
        };
        Returns: {
          id: number;
          description: string;
          score: number;
          is_anonymous: boolean;
        };
      };
      get_reviews_by_reviewee_id: {
        Args: {
          id: string;
        };
        Returns: {
          id: number;
          reviewer_name: string;
          description: string;
          score: number;
          appointment_title: string;
          is_anonymous: boolean;
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
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"];
        };
        Returns: unknown;
      };
      http_delete:
        | {
            Args: {
              uri: string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              uri: string;
              content: string;
              content_type: string;
            };
            Returns: unknown;
          };
      http_get:
        | {
            Args: {
              uri: string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              uri: string;
              data: Json;
            };
            Returns: unknown;
          };
      http_head: {
        Args: {
          uri: string;
        };
        Returns: unknown;
      };
      http_header: {
        Args: {
          field: string;
          value: string;
        };
        Returns: Database["public"]["CompositeTypes"]["http_header"];
      };
      http_list_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: {
          curlopt: string;
          value: string;
        }[];
      };
      http_patch: {
        Args: {
          uri: string;
          content: string;
          content_type: string;
        };
        Returns: unknown;
      };
      http_post:
        | {
            Args: {
              uri: string;
              content: string;
              content_type: string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              uri: string;
              data: Json;
            };
            Returns: unknown;
          };
      http_put: {
        Args: {
          uri: string;
          content: string;
          content_type: string;
        };
        Returns: unknown;
      };
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      http_set_curlopt: {
        Args: {
          curlopt: string;
          value: string;
        };
        Returns: boolean;
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
          images: string[];
          tags: {
            id: number;
            name: string;
          }[];
          participants: Json[];
        };
      };
      send_email_message: {
        Args: {
          message: Json;
        };
        Returns: Json;
      };
      send_email_sendinblue: {
        Args: {
          message: Json;
        };
        Returns: Json;
      };
      update_accept_appointment_by_appointment_id: {
        Args: {
          id: number;
          user_id: string;
        };
        Returns: undefined;
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
      update_reject_appointment_by_appointment_id: {
        Args: {
          id: number;
          user_id: string;
        };
        Returns: undefined;
      };
      update_review: {
        Args: {
          id: number;
          description: string;
          score: number;
          is_anonymous: boolean;
        };
        Returns: undefined;
      };
      update_user_by_user_id: {
        Args: {
          id: string;
          username: string;
          sex: string;
          description: string;
          image: string;
        };
        Returns: undefined;
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
      urlencode:
        | {
            Args: {
              string: string;
            };
            Returns: string;
          }
        | {
            Args: {
              string: string;
            };
            Returns: string;
          }
        | {
            Args: {
              data: Json;
            };
            Returns: string;
          };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      http_header: {
        field: string;
        value: string;
      };
      http_request: {
        method: unknown;
        uri: string;
        headers: unknown;
        content_type: string;
        content: string;
      };
      http_response: {
        status: number;
        content_type: string;
        headers: unknown;
        content: string;
      };
      participant_type: {
        id: string;
        username: string;
        is_verified: boolean;
        birthdate: string;
        description: string;
        image: string;
        sex: string;
      };
      participants_type: {
        id: string;
        username: string;
        is_verified: boolean;
        birthdate: string;
        description: string;
        image: string;
      };
      tags_type: {
        id: number;
        name: string;
      };
    };
  };
}
