import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth-local";
import { useActionLogs } from "@/hooks/use-action-logs-local";
import { formatDateTime } from "@/lib/formatters";
import { Search, RefreshCw, Loader2, Shield, AlertTriangle } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Logs() {
  const { appUser, loading: authLoading } = useAuth();
  const { logs, loading, searchLogs, refetch } = useActionLogs();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchLogs(searchQuery);
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'USER_LOGIN':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'UPDATE_PARAMETRAGE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'UPDATE_DISCORD_SETTINGS':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'CREATE_VERSION':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (!appUser?.is_superadmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={appUser} />
      
      <main className="container mx-auto px-6 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary">Logs d'Actions</h2>
              <p className="text-muted-foreground">Suivi de toutes les actions des utilisateurs</p>
            </div>
          </div>
          
          <Button onClick={() => refetch()} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Alerte Superadmin */}
        <Card className="mb-6 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-sm">
                <strong className="text-red-700 dark:text-red-300">Zone Superadmin</strong>
                <span className="text-red-600 dark:text-red-400 ml-2">
                  Cette page contient des informations sensibles accessibles uniquement aux superadministrateurs.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recherche */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Rechercher dans les logs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par type d'action ou description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading}>
                Rechercher
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Table des logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historique des actions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Chargement des logs...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun log trouvé
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Type d'action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Table cible</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {formatDateTime(log.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{log.user?.username || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.user?.discord_id}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {log.user?.role}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionTypeColor(log.action_type)}>
                            {log.action_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate" title={log.action_description}>
                            {log.action_description}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.enterprise_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {log.target_table || 'N/A'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}