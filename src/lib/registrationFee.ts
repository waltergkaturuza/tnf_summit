/**
 * Single source of truth for delegate registration fees (USD).
 * Must stay aligned with the registration form and iVeri payment start API.
 */

export const REGISTRATION_FEES_USD: Record<string, { early: number; standard: number }> = {
  "Government / Public Sector": { early: 400, standard: 550 },
  "Private Sector / Corporates": { early: 700, standard: 950 },
  "International Organisations / DFIs": { early: 400, standard: 550 },
  "Youth Delegates (Under 35)": { early: 150, standard: 200 },
  "African Civil Society / MSMEs": { early: 200, standard: 300 },
  "Virtual / Hybrid Attendance": { early: 100, standard: 150 },
};

export function getRegistrationFeeUsd(category: string, isEarlyBird: boolean): number | null {
  const row = REGISTRATION_FEES_USD[category];
  if (!row) return null;
  return isEarlyBird ? row.early : row.standard;
}
