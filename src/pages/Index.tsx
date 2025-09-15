import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Building2, Settings, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Panel DOT Multi-entreprise
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Système de gestion comptable pour la gestion des paramètres financiers 
            et des barèmes d'imposition par entreprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-200 border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Paramétrage</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Configuration des paramètres financiers, barèmes d'imposition et plafonds salariaux.
              </p>
              <Button 
                onClick={() => navigate('/parametrage')}
                className="w-full"
              >
                Accéder au paramétrage
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-muted">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl text-muted-foreground">Fiches Hebdomadaires</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Gestion des fiches hebdomadaires des patrons (à venir).
              </p>
              <Button variant="outline" disabled className="w-full">
                Prochainement
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-muted">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl text-muted-foreground">Multi-entreprise</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Gestion centralisée de plusieurs entreprises (à venir).
              </p>
              <Button variant="outline" disabled className="w-full">
                Prochainement
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-subtle rounded-full">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm font-medium">Système actif - Europe/Paris - Devise USD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
