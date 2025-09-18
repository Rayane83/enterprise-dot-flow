import { useState, useEffect } from 'react';
import { DiscordSettings } from '@/types/dot';
import { toast } from 'sonner';

const STORAGE_KEY = 'local-discord-settings';

// Mock Discord settings data
const defaultSettings: DiscordSettings = {
  id: '1',
  enterprise_id: 'default',
  main_guild_id: '123456789012345678',
  main_guild_staff_role_id: '234567890123456789',
  main_guild_patron_role_id: '345678901234567890',
  main_guild_co_patron_role_id: '456789012345678901',
  main_guild_enterprise_role_id: '567890123456789012',
  dot_guild_id: '678901234567890123',
  dot_guild_staff_role_id: '789012345678901234',
  dot_guild_dot_role_id: '890123456789012345',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function useDiscordSettings(enterpriseId?: string) {
  const [settings, setSettings] = useState<DiscordSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!enterpriseId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setSettings(data);
      } else {
        // Initialize with default data
        setSettings(defaultSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
      }
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
      const updated = settings 
        ? { ...settings, ...updates, updated_at: new Date().toISOString() }
        : { ...defaultSettings, ...updates, enterprise_id: enterpriseId, updated_at: new Date().toISOString() };
      
      setSettings(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast.success('Paramètres Discord sauvegardés');
      
      return updated;
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