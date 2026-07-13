export const MAX_TAG_LENGTH = 24;

export function normalizeTag(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

export function normalizeTags(inputs: readonly string[]): string[] {
  return [...new Set(inputs.map(normalizeTag).filter(Boolean))];
}

export function isTagAllowed(tag: string): boolean {
  return tag.length <= MAX_TAG_LENGTH;
}
