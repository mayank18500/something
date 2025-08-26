import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  profile: Profile | null;
  // PayPal functions
  createPayPalSubscription: () => Promise<string>;
  handlePayPalApproval: (subscriptionID: string) => Promise<void>;
  cancelPayPalSubscription: () => Promise<void>;
}

interface Profile {
  id: number;
  user_id: string;
  email: string;
  full_name: string;
  subscription_tier: 'free' | 'premium';
  notes_count: number;
  created_at: string;
  updated_at: string;
  // PayPal-related fields
  paypal_subscription_id?: string;
  paypal_plan_id?: string;
  subscription_status?: 'active' | 'cancelled' | 'expired' | 'pending';
  subscription_end_date?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      // If profile doesn't exist, create it
      if (user?.email && user?.user_metadata?.full_name) {
        await createProfile(user.id, user.email, user.user_metadata.full_name);
      }
    }
  };

  const createProfile = async (userId: string, email: string, fullName: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: email,
          full_name: fullName,
          subscription_tier: 'free',
          notes_count: 0,
          subscription_status: 'active', // Default status for free tier
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile with user_id reference
        await createProfile(data.user.id, data.user.email!, fullName);
      }

      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  // PayPal Integration Functions
  const createPayPalSubscription = async (): Promise<string> => {
    try {
      if (!session) {
        throw new Error('No active session');
      }

      // This would call your backend API to create a PayPal subscription
      const response = await fetch('/api/create-paypal-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create PayPal subscription');
      }

      const data = await response.json();
      return data.approvalUrl; // URL to redirect user to PayPal
    } catch (error: any) {
      console.error('Error creating PayPal subscription:', error);
      toast.error(error.message || 'Failed to create subscription');
      throw error;
    }
  };

  const handlePayPalApproval = async (subscriptionID: string): Promise<void> => {
    try {
      if (!session) {
        throw new Error('No active session');
      }

      // This would call your backend API to complete the subscription
      const response = await fetch('/api/complete-paypal-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ subscriptionID })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete PayPal subscription');
      }

      // Refresh profile to get updated subscription status
      if (user) {
        await loadProfile(user.id);
      }
      
      toast.success('Premium subscription activated successfully!');
    } catch (error: any) {
      console.error('Error completing PayPal subscription:', error);
      toast.error(error.message || 'Failed to complete subscription');
      throw error;
    }
  };

  const cancelPayPalSubscription = async (): Promise<void> => {
    try {
      if (!session) {
        throw new Error('No active session');
      }

      if (!profile?.paypal_subscription_id) {
        throw new Error('No active subscription found');
      }

      const response = await fetch('/api/cancel-paypal-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          subscriptionId: profile.paypal_subscription_id 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }

      // Update profile to reflect cancelled subscription
      if (user) {
        await loadProfile(user.id);
      }
      
      toast.success('Subscription cancelled successfully');
    } catch (error: any) {
      console.error('Error cancelling PayPal subscription:', error);
      toast.error(error.message || 'Failed to cancel subscription');
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    profile,
    createPayPalSubscription,
    handlePayPalApproval,
    cancelPayPalSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}