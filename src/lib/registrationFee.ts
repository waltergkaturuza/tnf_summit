/**
 * Single source of truth for delegate registration fees (USD).
 * Must stay aligned with the registration form and iVeri payment start API.
 */

/** Flat delegate fee (all categories, in-person or virtual). */
export const FLAT_REGISTRATION_FEE_USD = 1500;

export const REGISTRATION_FEES_USD: Record<string, { early: number; standard: number }> = {
  "Government / Public Sector": { early: FLAT_REGISTRATION_FEE_USD, standard: FLAT_REGISTRATION_FEE_USD },
  "Private Sector / Corporates": { early: FLAT_REGISTRATION_FEE_USD, standard: FLAT_REGISTRATION_FEE_USD },
  "International Organisations / DFIs": { early: FLAT_REGISTRATION_FEE_USD, standard: FLAT_REGISTRATION_FEE_USD },
  "Youth Delegates (Under 35)": { early: FLAT_REGISTRATION_FEE_USD, standard: FLAT_REGISTRATION_FEE_USD },
  "African Civil Society / MSMEs": { early: FLAT_REGISTRATION_FEE_USD, standard: FLAT_REGISTRATION_FEE_USD },
  "Virtual / Hybrid Attendance": { early: FLAT_REGISTRATION_FEE_USD, standard: FLAT_REGISTRATION_FEE_USD },
};

export function getRegistrationFeeUsd(category: string, _isEarlyBird: boolean): number | null {
  const row = REGISTRATION_FEES_USD[category];
  if (!row) return null;
  return FLAT_REGISTRATION_FEE_USD;
}
