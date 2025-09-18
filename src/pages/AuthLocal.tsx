import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth-local';
import { toast } from 'sonner';
import { User, LogIn } from 'lucide-react';

export default function AuthLocal() {
  const { isAuthenticated, login, mockUsers } = useAuth();
  const [username, setUsername] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username)) {
      toast.success(`Connexion réussie en tant que ${username}`);
    } else {
      toast.error('Utilisateur non trouvé');
    }
  };

  const quickLogin = (user: string) => {
    setUsername(user);
    if (login(user)) {
      toast.success(`Connexion réussie en tant que ${user}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6" />
            Connexion Locale
          </CardTitle>
          <CardDescription>
            Choisissez un utilisateur pour vous connecter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez un nom d'utilisateur"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Connexion rapide :</Label>
            <div className="grid gap-2">
              {mockUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin(user.username)}
                  className="justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">{user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.role}
                    {user.is_superadmin && ' (SUPER)'}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Version locale - Pas de backend requis
          </div>
        </CardContent>
      </Card>
    </div>
  );
}