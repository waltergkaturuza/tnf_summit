/**
 * Generate human-friendly track IDs like SARSYC-260314-IZID01
 * Format: PREFIX-DDMMYY-XXXXXX (6 random alphanumeric)
 */

const ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0,O,1,I to avoid confusion

function randomSegment(length: number): string {
  let s = "";
  for (let i = 0; i < length; i++) {
    s += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return s;
}

function ddmmyy(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return day + month + year;
}

export function generateRegistrationTrackId(): string {
  return `TNF-REG-${ddmmyy()}-${randomSegment(6)}`;
}

export function generateAbstractTrackId(): string {
  return `TNF-ABS-${ddmmyy()}-${randomSegment(6)}`;
}

export function generateDonationTrackId(): string {
  return `TNF-DON-${ddmmyy()}-${randomSegment(6)}`;
}

export function generateInnovationTrackId(): string {
  return `TNF-INN-${ddmmyy()}-${randomSegment(6)}`;
}

export function isInnovationTrack(id: string): boolean {
  return id.trim().startsWith("TNF-INN-");
}
