import { useState, useEffect } from 'react';
import { ActionLog } from '@/types/dot';

const STORAGE_KEY = 'local-action-logs';

// Mock action logs data
const defaultLogs: ActionLog[] = [
  {
    id: '1',
    user_id: '1',
    enterprise_id: 'default',
    action_type: 'UPDATE_PARAMETRAGE',
    action_description: 'Mise à jour des paramètres de taxation',
    target_table: 'parametrage',
    target_id: '1',
    old_data: { salary_max_employee: 100000 },
    new_data: { salary_max_employee: 150000 },
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '2',
    user_id: '2',
    enterprise_id: 'default',
    action_type: 'UPDATE_DISCORD_SETTINGS',
    action_description: 'Modification des paramètres Discord',
    target_table: 'discord_settings',
    target_id: '1',
    old_data: { main_guild_id: '123456789012345677' },
    new_data: { main_guild_id: '123456789012345678' },
    ip_address: '192.168.1.2',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: '3',
    user_id: '1',
    enterprise_id: 'default',
    action_type: 'CREATE_VERSION',
    action_description: 'Création d\'une nouvelle version v2.0',
    target_table: 'parametrage',
    target_id: '2',
    old_data: null,
    new_data: { active_version: 'v2.0' },
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    created_at: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
  },
  {
    id: '4',
    user_id: '3',
    enterprise_id: 'default',
    action_type: 'LOGIN',
    action_description: 'Connexion utilisateur',
    target_table: 'users',
    target_id: '3',
    old_data: null,
    new_data: { last_login: new Date().toISOString() },
    ip_address: '192.168.1.3',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    created_at: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
  }
];

export function useActionLogs() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (limit = 100, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const stored = localStorage.getItem(STORAGE_KEY);
      let allLogs = stored ? JSON.parse(stored) : defaultLogs;
      
      // If no stored logs, initialize with default
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLogs));
        allLogs = defaultLogs;
      }
      
      // Apply pagination
      const paginatedLogs = allLogs
        .sort((a: ActionLog, b: ActionLog) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(offset, offset + limit);
      
      setLogs(paginatedLogs);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching action logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchLogs = async (query: string) => {
    if (!query.trim()) {
      await fetchLogs();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const stored = localStorage.getItem(STORAGE_KEY);
      const allLogs = stored ? JSON.parse(stored) : defaultLogs;
      
      const filteredLogs = allLogs.filter((log: ActionLog) =>
        log.action_type.toLowerCase().includes(query.toLowerCase()) ||
        log.action_description.toLowerCase().includes(query.toLowerCase())
      ).sort((a: ActionLog, b: ActionLog) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setLogs(filteredLogs);
    } catch (err: any) {
      setError(err.message);
      console.error('Error searching action logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new log
  const addLog = (newLog: Omit<ActionLog, 'id' | 'created_at'>) => {
    const log: ActionLog = {
      ...newLog,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const currentLogs = stored ? JSON.parse(stored) : defaultLogs;
    const updatedLogs = [log, ...currentLogs];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    setLogs(prev => [log, ...prev]);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    searchLogs,
    addLog,
    refetch: fetchLogs
  };
}