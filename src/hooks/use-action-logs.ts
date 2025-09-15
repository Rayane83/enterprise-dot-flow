import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionLog } from '@/types/dot';

export function useActionLogs() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (limit = 100, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('action_logs')
        .select(`
          *,
          users!inner(username, discord_id, role)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      const formattedLogs = data.map((log: any) => ({
        ...log,
        user: log.users
      }));
      
      setLogs(formattedLogs);
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
      
      const { data, error } = await supabase
        .from('action_logs')
        .select(`
          *,
          users!inner(username, discord_id, role)
        `)
        .or(`action_type.ilike.%${query}%,action_description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      const formattedLogs = data.map((log: any) => ({
        ...log,
        user: log.users
      }));
      
      setLogs(formattedLogs);
    } catch (err: any) {
      setError(err.message);
      console.error('Error searching action logs:', err);
    } finally {
      setLoading(false);
    }
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
    refetch: fetchLogs
  };
}