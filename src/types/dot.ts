export type UserRole = 'PATRON' | 'CO-PATRON' | 'STAFF' | 'DOT' | 'SUPERSTAFF';

export interface TaxBracket {
  min_inclusive: number;
  max_inclusive: number;
  taux_imposition_percent: number;
  salaire_max_employe: number;
  salaire_max_patron: number;
  prime_max_employe: number;
  prime_max_patron: number;
}

export interface WealthTaxBracket {
  min_inclusive: number;
  max_inclusive: number;
  taux_percent: number;
}

export interface Parametrage {
  id: string;
  enterprise_id: string;
  active_version: string;
  effective_from?: string;
  effective_to?: string;
  open_datetime: string;
  close_datetime: string;
  salary_max_employee: number;
  bonus_max_employee: number;
  salary_max_boss: number;
  bonus_max_boss: number;
  tax_brackets: TaxBracket[];
  wealth_tax_brackets: WealthTaxBracket[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  discord_id: string;
  username: string;
  role: UserRole;
  enterprise_id: string;
  is_superadmin: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscordSettings {
  id: string;
  enterprise_id: string;
  main_guild_id?: string;
  main_guild_staff_role_id?: string;
  main_guild_patron_role_id?: string;
  main_guild_co_patron_role_id?: string;
  main_guild_enterprise_role_id?: string;
  dot_guild_id?: string;
  dot_guild_staff_role_id?: string;
  dot_guild_dot_role_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionLog {
  id: string;
  user_id: string;
  enterprise_id: string;
  action_type: string;
  action_description: string;
  target_table?: string;
  target_id?: string;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}