import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { User as AppUser } from '@/types/dot';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch app user data
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('discord_id', session.user.user_metadata?.discord_id)
            .single();
          
          setAppUser(userData);
        } else {
          setAppUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    appUser,
    loading,
    isAuthenticated: !!session,
    isSuperAdmin: appUser?.is_superadmin || false,
    canEdit: appUser?.role === 'SUPERSTAFF' || appUser?.is_superadmin
  };
}