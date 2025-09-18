import { useState, useEffect } from 'react';
import { Parametrage, TaxBracket, WealthTaxBracket } from '@/types/dot';
import { toast } from 'sonner';

const STORAGE_KEY = 'local-parametrage';

// Mock parametrage data
const defaultParametrage: Parametrage = {
  id: '1',
  enterprise_id: 'default',
  active_version: 'v1.0',
  effective_from: '2024-01-01T00:00:00Z',
  effective_to: '2024-12-31T23:59:59Z',
  open_datetime: '2024-01-01T09:00:00Z',
  close_datetime: '2024-12-31T18:00:00Z',
  salary_max_employee: 150000,
  bonus_max_employee: 75000,
  salary_max_boss: 300000,
  bonus_max_boss: 150000,
  tax_brackets: [
    {
      min_inclusive: 0,
      max_inclusive: 50000,
      taux_imposition_percent: 15,
      salaire_max_employe: 50000,
      salaire_max_patron: 100000,
      prime_max_employe: 10000,
      prime_max_patron: 20000
    },
    {
      min_inclusive: 50001,
      max_inclusive: 100000,
      taux_imposition_percent: 25,
      salaire_max_employe: 75000,
      salaire_max_patron: 150000,
      prime_max_employe: 15000,
      prime_max_patron: 30000
    },
    {
      min_inclusive: 100001,
      max_inclusive: 200000,
      taux_imposition_percent: 35,
      salaire_max_employe: 100000,
      salaire_max_patron: 200000,
      prime_max_employe: 25000,
      prime_max_patron: 50000
    }
  ],
  wealth_tax_brackets: [
    {
      min_inclusive: 0,
      max_inclusive: 1000000,
      taux_percent: 1
    },
    {
      min_inclusive: 1000001,
      max_inclusive: 5000000,
      taux_percent: 2
    },
    {
      min_inclusive: 5000001,
      max_inclusive: 999999999,
      taux_percent: 3
    }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function useParametrage(enterpriseId?: string) {
  const [parametrage, setParametrage] = useState<Parametrage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParametrage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setParametrage(data);
      } else {
        // Initialize with default data
        setParametrage(defaultParametrage);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultParametrage));
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching parametrage:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateParametrage = async (updates: Partial<Parametrage>) => {
    if (!parametrage) return;
    
    try {
      const updated = { ...parametrage, ...updates, updated_at: new Date().toISOString() };
      setParametrage(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast.success("Paramètres sauvegardés avec succès");
      return updated;
    } catch (err: any) {
      toast.error("Erreur lors de la sauvegarde: " + err.message);
      throw err;
    }
  };

  const createVersion = async (newVersion: string) => {
    if (!parametrage) return;
    
    try {
      const newParametrage = {
        ...parametrage,
        id: Date.now().toString(),
        active_version: newVersion,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setParametrage(newParametrage);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newParametrage));
      toast.success(`Nouvelle version créée : ${newVersion}`);
      return newParametrage;
    } catch (err: any) {
      toast.error("Erreur lors de la création de version: " + err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchParametrage();
  }, [enterpriseId]);

  return {
    parametrage,
    loading,
    error,
    updateParametrage,
    createVersion,
    refetch: fetchParametrage
  };
}