/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns The slugified text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
