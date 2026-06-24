/** Youth Innovation Challenge fee: USD 200 base + USD 20 per excursion selected. */

export const INNOVATION_BASE_FEE_USD = 200;
export const INNOVATION_EXCURSION_FEE_USD = 20;

export const INNOVATION_EXCURSION_OPTIONS = [
  "Victoria Falls Rainforest Walk (UNESCO)",
  "Zambezi River Morning Boat Cruise",
  "Morning Game Drive, Zambezi National Park",
] as const;

export type InnovationExcursion = (typeof INNOVATION_EXCURSION_OPTIONS)[number];

export function normalizeInnovationExcursions(raw: string[]): InnovationExcursion[] {
  const allowed = new Set<string>(INNOVATION_EXCURSION_OPTIONS);
  return raw.filter((x): x is InnovationExcursion => allowed.has(x));
}

export function calculateInnovationFeeUsd(excursions: string[]): {
  baseFeeUsd: number;
  excursionFeeUsd: number;
  totalUsd: number;
  excursionCount: number;
} {
  const normalized = normalizeInnovationExcursions(excursions);
  const excursionCount = normalized.length;
  const baseFeeUsd = INNOVATION_BASE_FEE_USD;
  const excursionFeeUsd = excursionCount * INNOVATION_EXCURSION_FEE_USD;
  return {
    baseFeeUsd,
    excursionFeeUsd,
    totalUsd: baseFeeUsd + excursionFeeUsd,
    excursionCount,
  };
}
