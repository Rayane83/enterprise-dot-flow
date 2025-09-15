import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { MessageSquare, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const { isAuthenticated, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // Handle OAuth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        toast.error('Erreur de connexion: ' + error.message);
        return;
      }

      if (data.session?.user) {
        // Check if user exists in our database, if not create them
        const discordUser = data.session.user.user_metadata;
        
        if (discordUser) {
          const { error: upsertError } = await supabase
            .from('users')
            .upsert({
              discord_id: discordUser.provider_id || data.session.user.id,
              username: discordUser.name || discordUser.full_name || 'Utilisateur Discord',
              role: 'STAFF',
              enterprise_id: 'default' // Default enterprise, will be updated based on Discord roles
            }, {
              onConflict: 'discord_id'
            });

          if (upsertError) {
            console.error('Error creating/updating user:', upsertError);
          } else {
            // Log the connection
            await supabase.rpc('log_action', {
              p_action_type: 'USER_LOGIN',
              p_action_description: `Connexion Discord: ${discordUser.name || 'Utilisateur'}`,
              p_target_table: 'users',
              p_target_id: data.session.user.id
            });
          }
        }
      }
    };

    handleAuthCallback();
  }, []);

  const signInWithDiscord = async () => {
    try {
      setIsSigningIn(true);
      
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: redirectUrl,
          scopes: 'identify guilds'
        }
      });

      if (error) {
        toast.error('Erreur de connexion Discord: ' + error.message);
      }
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">Panel DOT</h2>
            <p className="text-muted-foreground mt-2">
              Connectez-vous avec Discord pour accéder au panel
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Connexion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={signInWithDiscord}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center space-x-2 bg-[#5865F2] hover:bg-[#4752C4] text-white"
              size="lg"
            >
              {isSigningIn ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MessageSquare className="h-5 w-5" />
              )}
              <span>
                {isSigningIn ? 'Connexion...' : 'Se connecter avec Discord'}
              </span>
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Votre rôle sera automatiquement détecté</p>
              <p>selon vos permissions Discord</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 Panel DOT - Système de gestion multi-entreprise</p>
        </div>
      </div>
    </div>
  );
}