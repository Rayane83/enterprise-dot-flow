-- Insert sample parametrage data for testing
INSERT INTO public.parametrage (
  enterprise_id, 
  active_version, 
  effective_from, 
  effective_to, 
  open_datetime, 
  close_datetime, 
  salary_max_employee, 
  bonus_max_employee, 
  salary_max_boss, 
  bonus_max_boss, 
  tax_brackets, 
  wealth_tax_brackets
) VALUES (
  'default',
  'v1',
  '2025-09-15T00:00:00+02:00'::timestamptz,
  '2025-09-21T23:59:59+02:00'::timestamptz,
  '2025-09-15T00:00:00+02:00'::timestamptz,
  '2025-09-21T23:59:59+02:00'::timestamptz,
  25000,
  5000,
  35000,
  8000,
  '[
    {"min_inclusive": 0, "max_inclusive": 9999, "taux_imposition_percent": 7, "salaire_max_employe": 10000, "salaire_max_patron": 12000, "prime_max_employe": 2000, "prime_max_patron": 3000},
    {"min_inclusive": 10000, "max_inclusive": 29999, "taux_imposition_percent": 9, "salaire_max_employe": 12000, "salaire_max_patron": 14000, "prime_max_employe": 2500, "prime_max_patron": 3500},
    {"min_inclusive": 30000, "max_inclusive": 49999, "taux_imposition_percent": 16, "salaire_max_employe": 14000, "salaire_max_patron": 16000, "prime_max_employe": 3000, "prime_max_patron": 4000},
    {"min_inclusive": 50000, "max_inclusive": 99999, "taux_imposition_percent": 21, "salaire_max_employe": 16000, "salaire_max_patron": 18000, "prime_max_employe": 3500, "prime_max_patron": 4500},
    {"min_inclusive": 100000, "max_inclusive": 249999, "taux_imposition_percent": 23, "salaire_max_employe": 18000, "salaire_max_patron": 20000, "prime_max_employe": 4000, "prime_max_patron": 5000}
  ]'::jsonb,
  '[
    {"min_inclusive": 1500000, "max_inclusive": 2499999, "taux_percent": 2},
    {"min_inclusive": 2500000, "max_inclusive": 3500000, "taux_percent": 3},
    {"min_inclusive": 3500000, "max_inclusive": 5000000, "taux_percent": 4},
    {"min_inclusive": 5000000, "max_inclusive": 99000000, "taux_percent": 5}
  ]'::jsonb
) ON CONFLICT (enterprise_id, active_version) DO NOTHING;