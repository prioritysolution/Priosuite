/**
 * Local-date helpers — avoid UTC shifting the calendar day
 * (common in IST and other UTC+ timezones).
 */

/** Build a Date at local noon for Y/M/D (month is 1-based). */
export const localNoon = (year, month1Based, day) => {
  const d = new Date(
    Number(year),
    Number(month1Based) - 1,
    Number(day),
    12,
    0,
    0,
    0,
  );
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Force any Date to local noon using the user's local calendar day.
 * Do not use UTC getters — that causes 21 → 20 in IST when sending to API.
 */
export const normalizeLocalNoon = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;
  return localNoon(value.getFullYear(), value.getMonth() + 1, value.getDate());
};

/**
 * Parse flexible date inputs into a local-noon Date.
 * Handles Date, timestamp, dd-MM-yyyy, yyyy-MM-dd, and ISO strings.
 */
export const parseLocalDate = (value) => {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    return normalizeLocalNoon(value);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (Number.isInteger(value) && value >= 1000 && value <= 9999) {
      return localNoon(value, 1, 1);
    }
    return normalizeLocalNoon(new Date(value));
  }

  const raw = String(value).trim();
  if (!raw) return null;

  // Year-only cookie (e.g. 2026)
  if (/^\d{4}$/.test(raw)) {
    return localNoon(raw, 1, 1);
  }

  // Date-only yyyy-MM-dd (NO time) — parse as local calendar day, never UTC
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split("-");
    return localNoon(y, m, d);
  }

  // Full ISO datetime — use local calendar day of the instant (not the UTC date prefix)
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    return normalizeLocalNoon(new Date(raw));
  }

  // dd-MM-yyyy or dd/MM/yyyy
  const dmy = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    return localNoon(dmy[3], dmy[2], dmy[1]);
  }

  const fallback = new Date(raw);
  return normalizeLocalNoon(fallback);
};

/**
 * Format a date for API payloads as yyyy-MM-dd using LOCAL calendar parts.
 * Never use date.toISOString().slice(0, 10) — that shifts a day in IST.
 */
export const formatDateForApi = (value) => {
  const d = parseLocalDate(value);
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Format for UI display as dd-MM-yyyy (local). */
export const formatDateForDisplay = (value) => {
  const d = parseLocalDate(value);
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${day}-${m}-${y}`;
};
