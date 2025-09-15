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
    console.log('🔧 Initialisation useAuth hook');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 Session utilisateur trouvée, recherche en BDD...');
          console.log('📋 User metadata:', session.user.user_metadata);
          
          // Try multiple possible discord ID fields
          const discordId = session.user.user_metadata?.provider_id || 
                           session.user.user_metadata?.discord_id ||
                           session.user.id;
          
          console.log('🔍 Recherche utilisateur avec discord_id:', discordId);
          
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('discord_id', discordId)
            .single();
          
          console.log('📊 Résultat requête utilisateur:', { userData, error: error?.message });
          
          if (error && error.code === 'PGRST116') {
            console.log('❌ Utilisateur non trouvé en BDD');
            setAppUser(null);
          } else if (error) {
            console.error('💥 Erreur requête utilisateur:', error);
            setAppUser(null);
          } else {
            console.log('✅ Utilisateur trouvé:', userData);
            setAppUser(userData);
          }
        } else {
          console.log('🚫 Pas de session utilisateur');
          setAppUser(null);
        }
        
        console.log('✅ Fin du chargement auth');
        setLoading(false);
      }
    );

    // Check for existing session
    console.log('🔍 Vérification session existante...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('📊 Session existante:', { hasSession: !!session, error: error?.message });
      
      if (!session) {
        console.log('🚫 Pas de session existante, arrêt du chargement');
        setSession(null);
        setUser(null);
        setAppUser(null);
        setLoading(false);
      }
      // Si il y a une session, elle sera traitée par onAuthStateChange
    });

    return () => {
      console.log('🧹 Nettoyage subscription auth');
      subscription.unsubscribe();
    };
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