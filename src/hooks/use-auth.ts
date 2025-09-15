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
        
        // Handle sign out or invalid sessions
        if (event === 'SIGNED_OUT' || !session) {
          console.log('🚫 Session supprimée ou invalide');
          setSession(null);
          setUser(null);
          setAppUser(null);
          setLoading(false);
          return;
        }

        // Handle errors in session (like future timestamp)
        try {
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
            
            try {
              // First try to find user by auth.uid()
              let { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              // If not found by ID, try by discord_id for backward compatibility
              if (error && error.code === 'PGRST116') {
                ({ data: userData, error } = await supabase
                  .from('users')
                  .select('*')
                  .eq('discord_id', discordId)
                  .single());
              }
              
              console.log('📊 Résultat requête utilisateur:', { userData, error: error?.message });
              
              if (error && error.code === 'PGRST116') {
                console.log('❌ Utilisateur non trouvé, création automatique...');
                
                // Create user automatically
                const newUser = {
                  id: session.user.id, // Use Supabase auth user ID
                  discord_id: discordId,
                  username: session.user.user_metadata?.full_name || 
                           session.user.user_metadata?.name || 
                           session.user.user_metadata?.username ||
                           session.user.email?.split('@')[0] ||
                           `User-${discordId.slice(-4)}`,
                  role: 'STAFF' as const,
                  enterprise_id: 'default',
                  is_superadmin: discordId === '462716512252329996'
                };
                
                console.log('🏗️ Création utilisateur:', newUser);
                
                const { data: createdUser, error: createError } = await supabase
                  .from('users')
                  .insert(newUser)
                  .select()
                  .single();
                
                if (createError) {
                  console.error('💥 Erreur création utilisateur:', createError);
                  setAppUser(null);
                } else {
                  console.log('✅ Utilisateur créé avec succès:', createdUser);
                  setAppUser(createdUser);
                }
              } else if (error) {
                console.error('💥 Erreur requête utilisateur:', error);
                // Force sign out on DB error
                await supabase.auth.signOut();
                setAppUser(null);
              } else {
                console.log('✅ Utilisateur trouvé:', userData);
                setAppUser(userData);
              }
            } catch (err) {
              console.error('🚨 Erreur générale:', err);
              // Force sign out on general error
              await supabase.auth.signOut();
              setAppUser(null);
            }
          }
        } catch (error) {
          console.error('🚨 Erreur session invalide:', error);
          // Force sign out on session error
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setAppUser(null);
        }
        
        console.log('✅ Fin du chargement auth');
        setLoading(false);
      }
    );

    // Check for existing session with error handling
    console.log('🔍 Vérification session existante...');
    const sessionTimeout = setTimeout(() => {
      console.log('⏰ Timeout session: Arrêt du chargement');
      setLoading(false);
    }, 3000);

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      clearTimeout(sessionTimeout);
      console.log('📊 Session existante:', { hasSession: !!session, error: error?.message });
      
      if (error) {
        console.error('💥 Erreur session:', error);
        // Force clean state on session error
        supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setAppUser(null);
        setLoading(false);
        return;
      }
      
      if (!session) {
        console.log('🚫 Pas de session existante, arrêt du chargement');
        setSession(null);
        setUser(null);
        setAppUser(null);
        setLoading(false);
      }
      // Si il y a une session valide, elle sera traitée par onAuthStateChange
    }).catch(err => {
      clearTimeout(sessionTimeout);
      console.error('💥 Erreur getSession:', err);
      // Force clean state on catch
      supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setAppUser(null);
      setLoading(false);
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