import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Parametrage, TaxBracket, WealthTaxBracket } from '@/types/dot';
import { toast } from 'sonner';

export function useParametrage(enterpriseId?: string) {
  const [parametrage, setParametrage] = useState<Parametrage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParametrage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('parametrage')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (enterpriseId) {
        query = query.eq('enterprise_id', enterpriseId);
      }
      
      const { data, error } = await query.limit(1).single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          setParametrage(null);
        } else {
          throw error;
        }
      } else {
        // Convert JSON fields to proper types
        const parametrage: Parametrage = {
          ...data,
          tax_brackets: Array.isArray(data.tax_brackets) ? data.tax_brackets as unknown as TaxBracket[] : [],
          wealth_tax_brackets: Array.isArray(data.wealth_tax_brackets) ? data.wealth_tax_brackets as unknown as WealthTaxBracket[] : []
        };
        setParametrage(parametrage);
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
      const { data, error } = await supabase
        .from('parametrage')
        .update({
          ...updates,
          tax_brackets: updates.tax_brackets as any,
          wealth_tax_brackets: updates.wealth_tax_brackets as any
        })
        .eq('id', parametrage.id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedParametrage: Parametrage = {
        ...data,
        tax_brackets: Array.isArray(data.tax_brackets) ? data.tax_brackets as unknown as TaxBracket[] : [],
        wealth_tax_brackets: Array.isArray(data.wealth_tax_brackets) ? data.wealth_tax_brackets as unknown as WealthTaxBracket[] : []
      };
      setParametrage(updatedParametrage);
      toast.success("Paramètres sauvegardés avec succès");
      return updatedParametrage;
    } catch (err: any) {
      toast.error("Erreur lors de la sauvegarde: " + err.message);
      throw err;
    }
  };

  const createVersion = async (newVersion: string) => {
    if (!parametrage) return;
    
    try {
      const { data, error } = await supabase
        .from('parametrage')
        .insert({
          enterprise_id: parametrage.enterprise_id,
          active_version: newVersion,
          effective_from: parametrage.effective_from,
          effective_to: parametrage.effective_to,
          open_datetime: parametrage.open_datetime,
          close_datetime: parametrage.close_datetime,
          salary_max_employee: parametrage.salary_max_employee,
          bonus_max_employee: parametrage.bonus_max_employee,
          salary_max_boss: parametrage.salary_max_boss,
          bonus_max_boss: parametrage.bonus_max_boss,
          tax_brackets: parametrage.tax_brackets as any,
          wealth_tax_brackets: parametrage.wealth_tax_brackets as any
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newParametrage: Parametrage = {
        ...data,
        tax_brackets: Array.isArray(data.tax_brackets) ? data.tax_brackets as unknown as TaxBracket[] : [],
        wealth_tax_brackets: Array.isArray(data.wealth_tax_brackets) ? data.wealth_tax_brackets as unknown as WealthTaxBracket[] : []
      };
      setParametrage(newParametrage);
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