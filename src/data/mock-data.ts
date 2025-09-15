import { Parametrage, User } from "@/types/dot";

export const mockUser: User = {
  id: "1",
  discord_id: "462716512252329996",
  username: "SuperAdmin",  
  role: "SUPERSTAFF",
  enterprise_id: "123456789012345678",
  is_superadmin: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z"
};

export const mockParametrage: Parametrage = {
  id: "1",
  enterprise_id: "123456789012345678",
  active_version: "v1",
  effective_from: "2025-09-15T00:00:00+02:00",
  effective_to: "2025-09-21T23:59:59+02:00",
  open_datetime: "2025-09-15T00:00:00+02:00",
  close_datetime: "2025-09-21T23:59:59+02:00",
  salary_max_employee: 25000,
  bonus_max_employee: 5000,
  salary_max_boss: 35000,
  bonus_max_boss: 8000,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
  tax_brackets: [
    { min_inclusive: 0, max_inclusive: 9999, taux_imposition_percent: 7, salaire_max_employe: 10000, salaire_max_patron: 12000, prime_max_employe: 2000, prime_max_patron: 3000 },
    { min_inclusive: 10000, max_inclusive: 29999, taux_imposition_percent: 9, salaire_max_employe: 12000, salaire_max_patron: 14000, prime_max_employe: 2500, prime_max_patron: 3500 },
    { min_inclusive: 30000, max_inclusive: 49999, taux_imposition_percent: 16, salaire_max_employe: 14000, salaire_max_patron: 16000, prime_max_employe: 3000, prime_max_patron: 4000 },
    { min_inclusive: 50000, max_inclusive: 99999, taux_imposition_percent: 21, salaire_max_employe: 16000, salaire_max_patron: 18000, prime_max_employe: 3500, prime_max_patron: 4500 },
    { min_inclusive: 100000, max_inclusive: 249999, taux_imposition_percent: 23, salaire_max_employe: 18000, salaire_max_patron: 20000, prime_max_employe: 4000, prime_max_patron: 5000 },
    { min_inclusive: 250000, max_inclusive: 449999, taux_imposition_percent: 26, salaire_max_employe: 20000, salaire_max_patron: 22000, prime_max_employe: 4500, prime_max_patron: 5500 },
    { min_inclusive: 450000, max_inclusive: 599999, taux_imposition_percent: 29, salaire_max_employe: 22000, salaire_max_patron: 24000, prime_max_employe: 5000, prime_max_patron: 6000 },
    { min_inclusive: 600000, max_inclusive: 899999, taux_imposition_percent: 32, salaire_max_employe: 24000, salaire_max_patron: 26000, prime_max_employe: 5500, prime_max_patron: 6500 },
    { min_inclusive: 900000, max_inclusive: 1499999, taux_imposition_percent: 36, salaire_max_employe: 26000, salaire_max_patron: 28000, prime_max_employe: 6000, prime_max_patron: 7000 },
    { min_inclusive: 1500000, max_inclusive: 1799999, taux_imposition_percent: 38, salaire_max_employe: 27000, salaire_max_patron: 30000, prime_max_employe: 6500, prime_max_patron: 7500 },
    { min_inclusive: 1800000, max_inclusive: 2499999, taux_imposition_percent: 44, salaire_max_employe: 30000, salaire_max_patron: 32000, prime_max_employe: 7000, prime_max_patron: 8000 },
    { min_inclusive: 2500000, max_inclusive: 4999999, taux_imposition_percent: 47, salaire_max_employe: 32000, salaire_max_patron: 34000, prime_max_employe: 7500, prime_max_patron: 8500 },
    { min_inclusive: 5000000, max_inclusive: 99000000, taux_imposition_percent: 49, salaire_max_employe: 34000, salaire_max_patron: 36000, prime_max_employe: 8000, prime_max_patron: 9000 }
  ],
  wealth_tax_brackets: [
    { min_inclusive: 1500000, max_inclusive: 2499999, taux_percent: 2 },
    { min_inclusive: 2500000, max_inclusive: 3500000, taux_percent: 3 },
    { min_inclusive: 3500000, max_inclusive: 5000000, taux_percent: 4 },
    { min_inclusive: 5000000, max_inclusive: 99000000, taux_percent: 5 }
  ]
};