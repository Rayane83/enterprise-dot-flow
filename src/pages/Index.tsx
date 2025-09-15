import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { Settings, BarChart3, Users, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Index() {
  const { appUser, loading } = useAuth();

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
            
            toast.success(`Bienvenue ${discordUser.name || 'Utilisateur'} !`);
          }
        }
      }
    };

    handleAuthCallback();
  }, []);

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

  if (!appUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={appUser} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-primary">
              Bienvenue, {appUser.username}
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <Badge className="text-sm px-3 py-1">
                {appUser.role}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Entreprise: {appUser.enterprise_id}
              </Badge>
              {appUser.is_superadmin && (
                <Badge className="bg-red-600 text-white text-sm px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  SUPERADMIN
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Panel de gestion multi-entreprise DOT. Accédez aux paramètres comptables, 
              gérez les barèmes d'imposition et suivez l'activité de votre entreprise.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Paramétrage</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configurez les paramètres comptables, les barèmes d'imposition et les plafonds salariaux.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = '/parametrage'}
                >
                  Accéder au paramétrage
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Rapports</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Consultez les rapports financiers et les statistiques de votre entreprise.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Bientôt disponible
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Gestion Utilisateurs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Gérez les utilisateurs, les rôles et les permissions de votre entreprise.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Bientôt disponible
                </Button>
              </CardContent>
            </Card>

            {/* SuperAdmin Only Card */}
            {appUser.is_superadmin && (
              <Card className="hover:shadow-lg transition-shadow border-red-200 dark:border-red-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-lg text-red-700 dark:text-red-300">
                      Logs d'Actions
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Consultez tous les logs d'actions et l'activité des utilisateurs sur le système.
                  </p>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => window.location.href = '/logs'}
                  >
                    Voir les logs
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Statut Connexion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Connecté via Discord</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {appUser.role === 'SUPERSTAFF' || appUser.is_superadmin ? 'Modification autorisée' : 'Lecture seule'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Entreprise Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium font-mono">
                  {appUser.enterprise_id}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}