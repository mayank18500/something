import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: number; // Changed from string to number for bigint
          email: string;
          full_name: string;
          subscription_tier: 'free' | 'premium';
          notes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number; // Changed from string to number for bigint (made optional for auto-generation)
          email: string;
          full_name: string;
          subscription_tier?: 'free' | 'premium';
          notes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number; // Changed from string to number for bigint
          email?: string;
          full_name?: string;
          subscription_tier?: 'free' | 'premium';
          notes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: number; // Changed from string to number for bigint
          user_id: string;
          title: string;
          content: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number; // Changed from string to number for bigint (made optional for auto-generation)
          user_id: string;
          title: string;
          content: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number; // Changed from string to number for bigint
          user_id?: string;
          title?: string;
          content?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};