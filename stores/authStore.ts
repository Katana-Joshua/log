import { create } from 'zustand';
import { AuthState, User } from '@/types';
import supabase from '@/lib/supabase';

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateUser: (userData: Partial<User>) => Promise<{ error: Error | null }>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  checkSession: async () => {
    try {
      set({ isLoading: true });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        set({
          user,
          session: session.access_token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user?.id)
          .single();

        if (userError) throw userError;

        set({
          user,
          session: data.session.access_token,
          isAuthenticated: true,
          isLoading: false,
        });
      }

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  },

  signUp: async (email, password, userData) => {
    try {
      set({ isLoading: true });
      
      // Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create the user profile in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

        if (profileError) throw profileError;

        // Don't set the user as authenticated yet, as they may need email verification
        set({ isLoading: false });
      }

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      console.error('Sign up error:', error);
      return { error: error as Error };
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ isLoading: false });
    }
  },

  resetPassword: async (email) => {
    try {
      set({ isLoading: true });
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      set({ isLoading: false });
      return { error };
    } catch (error) {
      set({ isLoading: false });
      console.error('Reset password error:', error);
      return { error: error as Error };
    }
  },

  updateUser: async (userData) => {
    try {
      const currentUser = get().user;
      if (!currentUser || !currentUser.id) {
        throw new Error('No authenticated user found');
      }

      set({ isLoading: true });
      
      const { error } = await supabase
        .from('users')
        .update({
          ...userData,
          updatedAt: new Date(),
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      const { data: updatedUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (fetchError) throw fetchError;

      set({
        user: updatedUser,
        isLoading: false,
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      console.error('Update user error:', error);
      return { error: error as Error };
    }
  },
}));