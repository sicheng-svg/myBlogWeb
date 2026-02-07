export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          content: string;
          cover_image: string | null;
          category_id: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string;
          content?: string;
          cover_image?: string | null;
          category_id?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          summary?: string;
          content?: string;
          cover_image?: string | null;
          category_id?: string | null;
          published?: boolean;
          published_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      site_settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type TagInsert = Database['public']['Tables']['tags']['Insert'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
