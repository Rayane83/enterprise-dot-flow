import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxBracketsTable } from "@/components/parametrage/tax-brackets-table";
import { WealthTaxTable } from "@/components/parametrage/wealth-tax-table";
import { formatCurrency, formatDateTime, formatDateTimeInput } from "@/lib/formatters";
import { AlertCircle, Copy, Save, Loader2, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useParametrage } from "@/hooks/use-parametrage";
import { useDiscordSettings } from "@/hooks/use-discord-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Parametrage() {
  const { appUser, loading: authLoading, canEdit } = useAuth();
  
  console.log('📊 Parametrage - Auth state:', { 
    appUser: !!appUser, 
    enterprise_id: appUser?.enterprise_id,
    authLoading,
    canEdit 
  });
  
  const { parametrage, loading: parametrageLoading, updateParametrage, createVersion } = useParametrage(appUser?.enterprise_id);
  const { settings: discordSettings, loading: discordLoading, updateSettings: updateDiscordSettings } = useDiscordSettings(appUser?.enterprise_id);

  const [localParametrage, setLocalParametrage] = useState(parametrage);
  const [localDiscordSettings, setLocalDiscordSettings] = useState(discordSettings);
  
  // Update local state when parametrage changes
  useEffect(() => {
    if (parametrage) {
      setLocalParametrage(parametrage);
    }
  }, [parametrage]);

  // Update local Discord settings when they change
  useEffect(() => {
    if (discordSettings) {
      setLocalDiscordSettings(discordSettings);
    } else if (!discordLoading && appUser?.enterprise_id) {
      // Initialize empty settings if none exist
      setLocalDiscordSettings({
        id: '',
        enterprise_id: appUser.enterprise_id,
        main_guild_id: '',
        main_guild_staff_role_id: '',
        main_guild_patron_role_id: '',
        main_guild_co_patron_role_id: '',
        main_guild_enterprise_role_id: '',
        dot_guild_id: '',
        dot_guild_staff_role_id: '',
        dot_guild_dot_role_id: '',
        created_at: '',
        updated_at: ''
      });
    }
  }, [discordSettings, discordLoading, appUser?.enterprise_id]);

  const handleInputChange = (field: string, value: string | number) => {
    if (!canEdit || !localParametrage) return;
    
    setLocalParametrage(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  const handleDiscordInputChange = (field: string, value: string) => {
    if (!canEdit || !localDiscordSettings) return;
    
    setLocalDiscordSettings(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  const handleSave = async () => {
    if (!canEdit || !localParametrage) return;
    
    await updateParametrage({
      open_datetime: localParametrage.open_datetime,
      close_datetime: localParametrage.close_datetime,
      salary_max_employee: localParametrage.salary_max_employee,
      bonus_max_employee: localParametrage.bonus_max_employee,
      salary_max_boss: localParametrage.salary_max_boss,
      bonus_max_boss: localParametrage.bonus_max_boss,
      tax_brackets: localParametrage.tax_brackets,
      wealth_tax_brackets: localParametrage.wealth_tax_brackets
    });
  };

  const handleSaveDiscordSettings = async () => {
    if (!canEdit || !localDiscordSettings) return;
    
    await updateDiscordSettings({
      main_guild_id: localDiscordSettings.main_guild_id,
      main_guild_staff_role_id: localDiscordSettings.main_guild_staff_role_id,
      main_guild_patron_role_id: localDiscordSettings.main_guild_patron_role_id,
      main_guild_co_patron_role_id: localDiscordSettings.main_guild_co_patron_role_id,
      main_guild_enterprise_role_id: localDiscordSettings.main_guild_enterprise_role_id,
      dot_guild_id: localDiscordSettings.dot_guild_id,
      dot_guild_staff_role_id: localDiscordSettings.dot_guild_staff_role_id,
      dot_guild_dot_role_id: localDiscordSettings.dot_guild_dot_role_id
    });
  };

  const handleDuplicate = async () => {
    if (!canEdit || !localParametrage) return;
    
    const newVersion = `v${parseInt(localParametrage.active_version.replace('v', '')) + 1}`;
    await createVersion(newVersion);
  };

  console.log('📊 Chargements:', { 
    authLoading, 
    parametrageLoading, 
    discordLoading,
    hasAppUser: !!appUser,
    hasParametrage: !!parametrage 
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement de l'authentification...</span>
        </div>
      </div>
    );
  }

  if (!appUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Accès non autorisé</h2>
          <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (parametrageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des paramètres...</span>
        </div>
      </div>
    );
  }

  if (!localParametrage) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={appUser} />
        <main className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Aucun paramétrage trouvé</h2>
            <p className="text-muted-foreground">Aucun paramétrage n'a été configuré pour votre entreprise.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={appUser} />
      
      <main className="container mx-auto px-6 py-8">
        {/* En-tête de la page */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-primary">Paramétrage</h2>
            <StatusBadge variant="version" value={`Version ${localParametrage.active_version}`} />
          </div>
          
          <div className="flex space-x-3">
            {canEdit && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleDuplicate}
                  className="flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Dupliquer en nouvelle version</span>
                </Button>
                <Button 
                  onClick={handleSave}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Alerte si pas éditable */}
        {!canEdit && (
          <div className="mb-6 p-4 bg-accent-subtle border border-accent/30 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-accent" />
            <div className="text-sm">
              <strong>Lecture seule</strong> - Seuls les SUPERSTAFF peuvent modifier ces paramètres.
            </div>
          </div>
        )}

        <div className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Paramètres Généraux</TabsTrigger>
              <TabsTrigger value="discord">Configuration Discord</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-8">
              {/* Période d'effet */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Période d'effet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Du {formatDateTime(localParametrage.effective_from || localParametrage.open_datetime)} au {formatDateTime(localParametrage.effective_to || localParametrage.close_datetime)}
                  </div>
                </CardContent>
              </Card>

              {/* Paramètres temporels */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">
                    Paramètres temporels
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="open_datetime">Date et heure d'ouverture comptable</Label>
                    <Input
                      id="open_datetime"
                      type="datetime-local"
                      value={formatDateTimeInput(localParametrage.open_datetime)}
                      onChange={(e) => handleInputChange('open_datetime', e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="close_datetime">Date et heure de fermeture comptable</Label>
                    <Input
                      id="close_datetime"
                      type="datetime-local"
                      value={formatDateTimeInput(localParametrage.close_datetime)}
                      onChange={(e) => handleInputChange('close_datetime', e.target.value)}
                      disabled={!canEdit}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Plafonds salariaux */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">
                    Plafonds salariaux
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salary_max_employee">Salaire Maximum employé</Label>
                    <div className="relative">
                      <Input
                        id="salary_max_employee"
                        type="number"
                        value={localParametrage.salary_max_employee}
                        onChange={(e) => handleInputChange('salary_max_employee', parseInt(e.target.value))}
                        disabled={!canEdit}
                        className="pr-12"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Actuel: {formatCurrency(localParametrage.salary_max_employee)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bonus_max_employee">Prime Maximum employé</Label>
                    <div className="relative">
                      <Input
                        id="bonus_max_employee"
                        type="number"
                        value={localParametrage.bonus_max_employee}
                        onChange={(e) => handleInputChange('bonus_max_employee', parseInt(e.target.value))}
                        disabled={!canEdit}
                        className="pr-12"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Actuel: {formatCurrency(localParametrage.bonus_max_employee)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary_max_boss">Salaire Maximum patron</Label>
                    <div className="relative">
                      <Input
                        id="salary_max_boss"
                        type="number"
                        value={localParametrage.salary_max_boss}
                        onChange={(e) => handleInputChange('salary_max_boss', parseInt(e.target.value))}
                        disabled={!canEdit}
                        className="pr-12"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Actuel: {formatCurrency(localParametrage.salary_max_boss)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bonus_max_boss">Prime Maximum patron</Label>
                    <div className="relative">
                      <Input
                        id="bonus_max_boss"
                        type="number"
                        value={localParametrage.bonus_max_boss}
                        onChange={(e) => handleInputChange('bonus_max_boss', parseInt(e.target.value))}
                        disabled={!canEdit}
                        className="pr-12"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Actuel: {formatCurrency(localParametrage.bonus_max_boss)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formules calculées */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">
                    Indicateurs calculés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-accent-subtle rounded-lg">
                    <div className="font-medium text-foreground">Bénéfice de l'entreprise</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Bénéfice = CA Brut − Dépense Déductibles
                    </div>
                  </div>
                  
                  <div className="p-4 bg-accent-subtle rounded-lg">
                    <div className="font-medium text-foreground">Taux d'imposition</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      D'après la tranche CA (voir barème ci-dessous)
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Barèmes d'imposition */}
              <TaxBracketsTable 
                brackets={localParametrage.tax_brackets} 
                isEditable={canEdit}
              />

              {/* Impôt sur la richesse */}
              <WealthTaxTable 
                brackets={localParametrage.wealth_tax_brackets} 
                isEditable={canEdit}
              />
            </TabsContent>
            
            <TabsContent value="discord" className="space-y-8">
              {/* Configuration Discord */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <CardTitle className="text-lg">Configuration Discord</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {localDiscordSettings && (
                    <>
                      {/* Guild Principale */}
                      <div className="space-y-4">
                        <h3 className="text-md font-semibold text-primary">Guild Principale</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="main_guild_id">ID Guild Principale</Label>
                            <Input
                              id="main_guild_id"
                              value={localDiscordSettings.main_guild_id || ''}
                              onChange={(e) => handleDiscordInputChange('main_guild_id', e.target.value)}
                              disabled={!canEdit}
                              placeholder="123456789012345678"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="main_guild_staff_role_id">ID Rôle Staff</Label>
                            <Input
                              id="main_guild_staff_role_id"
                              value={localDiscordSettings.main_guild_staff_role_id || ''}
                              onChange={(e) => handleDiscordInputChange('main_guild_staff_role_id', e.target.value)}
                              disabled={!canEdit}
                              placeholder="123456789012345678"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="main_guild_patron_role_id">ID Rôle Patron</Label>
                            <Input
                              id="main_guild_patron_role_id"
                              value={localDiscordSettings.main_guild_patron_role_id || ''}
                              onChange={(e) => handleDiscordInputChange('main_guild_patron_role_id', e.target.value)}
                              disabled={!canEdit}
                              placeholder="123456789012345678"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="main_guild_co_patron_role_id">ID Rôle Co-Patron</Label>
                            <Input
                              id="main_guild_co_patron_role_id"
                              value={localDiscordSettings.main_guild_co_patron_role_id || ''}
                              onChange={(e) => handleDiscordInputChange('main_guild_co_patron_role_id', e.target.value)}
                              disabled={!canEdit}
                              placeholder="123456789012345678"
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="main_guild_enterprise_role_id">ID Rôle Entreprise</Label>
                            <Input
                              id="main_guild_enterprise_role_id"
                              value={localDiscordSettings.main_guild_enterprise_role_id || ''}
                              onChange={(e) => handleDiscordInputChange('main_guild_enterprise_role_id', e.target.value)}
                              disabled={!canEdit}
                              placeholder="123456789012345678"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Guild DOT */}
                      <div className="space-y-4">
                        <h3 className="text-md font-semibold text-primary">Guild DOT</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dot_guild_id">ID Guild DOT</Label>
                            <Input
                              id="dot_guild_id"
                              value={localDiscordSettings.dot_guild_id || ''}
                              onChange={(e) => handleDiscordInputChange('dot_guild_id', e.target.value)}
                              disabled={!canEdit}
                              placeholder="123456789012345678"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="dot_guild_staff_role_id">ID Rôle Staff DOT</Label>
                            <Input
                              id="dot_guild_staff_role_id"
                              value={localDiscordSettings.dot_guild_staff_role_id || ''}
                              onChange={(e) => handleDiscordInputChange('dot_guild_staff_role_id', e.target.value)}
                              disabled={!canEdit}
                              placeholder="123456789012345678"
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="dot_guild_dot_role_id">ID Rôle DOT</Label>
                            <Input
                              id="dot_guild_dot_role_id"
                              value={localDiscordSettings.dot_guild_dot_role_id || ''}
                              onChange={(e) => handleDiscordInputChange('dot_guild_dot_role_id', e.target.value)}
                              disabled={!canEdit}
                              placeholder="123456789012345678"
                            />
                          </div>
                        </div>
                      </div>

                      {canEdit && (
                        <div className="pt-4">
                          <Button onClick={handleSaveDiscordSettings} className="flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>Sauvegarder Configuration Discord</span>
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}