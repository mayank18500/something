import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.https://dslghzfywbnbfkfjipyl.supabase.co;
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbGdoemZ5d2JuYmZrZmppcHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTM2ODcsImV4cCI6MjA3MTcyOTY4N30.lorM-Zo30XbsvsUTKHD0rm8mv-k-IYIXLlM2nab8IO8;

// Create a placeholder client if environment variables are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key');
};

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