/**
 * Strips everything that isn't a digit, comma or dot from raw keystrokes,
 * and collapses to a single decimal separator so the field never accepts letters.
 */
export function sanitizeNumericInput(raw: string): string {
  const onlyValidChars = raw.replace(/[^0-9.,]/g, '');
  const firstSeparatorIndex = onlyValidChars.search(/[.,]/);
  if (firstSeparatorIndex === -1) return onlyValidChars;

  const integerPart = onlyValidChars.slice(0, firstSeparatorIndex);
  const fractionalPart = onlyValidChars.slice(firstSeparatorIndex + 1).replace(/[.,]/g, '');
  const separator = onlyValidChars[firstSeparatorIndex];
  return `${integerPart}${separator}${fractionalPart}`;
}

/** Converts a comma-or-dot decimal string (as typed by the user) into a JS number. */
export function parseLocaleNumber(raw: string): number {
  if (!raw) return 0;
  const normalized = raw.replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
