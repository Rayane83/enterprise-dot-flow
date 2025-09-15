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