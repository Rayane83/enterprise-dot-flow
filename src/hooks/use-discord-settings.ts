import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DiscordSettings } from '@/types/dot';
import { toast } from 'sonner';

export function useDiscordSettings(enterpriseId?: string) {
  const [settings, setSettings] = useState<DiscordSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!enterpriseId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('discord_settings')
        .select('*')
        .eq('enterprise_id', enterpriseId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setSettings(data || null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching Discord settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<DiscordSettings>) => {
    if (!enterpriseId) return;
    
    try {
      let data;
      
      if (settings) {
        // Update existing settings
        const { data: updatedData, error } = await supabase
          .from('discord_settings')
          .update(updates)
          .eq('id', settings.id)
          .select()
          .single();
        
        if (error) throw error;
        data = updatedData;
      } else {
        // Create new settings
        const { data: newData, error } = await supabase
          .from('discord_settings')
          .insert({
            enterprise_id: enterpriseId,
            ...updates
          })
          .select()
          .single();
        
        if (error) throw error;
        data = newData;
      }
      
      setSettings(data);
      toast.success('Paramètres Discord sauvegardés');
      
      // Log the action
      await supabase.rpc('log_action', {
        p_action_type: 'UPDATE_DISCORD_SETTINGS',
        p_action_description: 'Mise à jour des paramètres Discord',
        p_target_table: 'discord_settings',
        p_target_id: data.id,
        p_new_data: updates
      });
      
      return data;
    } catch (err: any) {
      toast.error('Erreur lors de la sauvegarde: ' + err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [enterpriseId]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
}