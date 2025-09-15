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
import { AlertCircle, Copy, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useParametrage } from "@/hooks/use-parametrage";

export default function Parametrage() {
  const { appUser, loading: authLoading, canEdit } = useAuth();
  const { parametrage, loading: parametrageLoading, updateParametrage, createVersion } = useParametrage(appUser?.enterprise_id);
  const [localParametrage, setLocalParametrage] = useState(parametrage);
  
  // Update local state when parametrage changes
  useEffect(() => {
    if (parametrage) {
      setLocalParametrage(parametrage);
    }
  }, [parametrage]);

  const handleInputChange = (field: string, value: string | number) => {
    if (!canEdit || !localParametrage) return;
    
    setLocalParametrage(prev => prev ? ({
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

  const handleDuplicate = async () => {
    if (!canEdit || !localParametrage) return;
    
    const newVersion = `v${parseInt(localParametrage.active_version.replace('v', '')) + 1}`;
    await createVersion(newVersion);
  };

  if (authLoading || parametrageLoading) {
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Accès non autorisé</h2>
          <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
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
          
          {canEdit && (
            <div className="flex space-x-3">
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
            </div>
          )}
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

        {/* Période d'effet */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Période d'effet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Du {formatDateTime(localParametrage.effective_from || localParametrage.open_datetime)} au {formatDateTime(localParametrage.effective_to || localParametrage.close_datetime)}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
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
        </div>
      </main>
    </div>
  );
}