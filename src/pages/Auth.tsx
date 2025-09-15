import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { MessageSquare, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const { isAuthenticated, loading, session } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Add manual disconnect option
  const handleDisconnect = async () => {
    console.log('🔌 Déconnexion manuelle demandée...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Erreur déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    } else {
      console.log('✅ Déconnexion réussie');
      toast.success('Déconnecté avec succès');
      window.location.reload(); // Force reload to clear state
    }
  };

  useEffect(() => {
    // Simplify auth callback - just redirect on successful auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change on /auth page:', event, !!session);
      if (event === 'SIGNED_IN' && session) {
        console.log('📍 Redirection vers la page d\'accueil après connexion...');
        // Small delay to ensure user is created
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithDiscord = async () => {
    try {
      setIsSigningIn(true);
      
      console.log('🔐 Début de la connexion Discord...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          scopes: 'identify guilds'
        }
      });

      console.log('📋 Réponse OAuth Discord:', { data, error });

      if (error) {
        console.error('❌ Erreur OAuth Discord:', error);
        toast.error('Erreur de connexion Discord: ' + error.message);
      } else {
        console.log('✅ Redirection Discord réussie');
      }
    } catch (error: any) {
      console.error('💥 Erreur générale:', error);
      toast.error('Erreur: ' + error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement...</span>
          {/* Emergency disconnect button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDisconnect}
            className="mt-4 text-xs"
          >
            Forcer la déconnexion
          </Button>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show disconnect option if there's a session but no app user
  const showDisconnectOption = session && !isAuthenticated;

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
            
            {showDisconnectOption && (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 border-red-300 text-red-600 hover:bg-red-50"
                size="sm"
              >
                <span>Problème de connexion ? Cliquez ici</span>
              </Button>
            )}
            
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