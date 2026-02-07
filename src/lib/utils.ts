/**
 * Calculate reading time from content text.
 * Words / 200 WPM, rounded up, minimum 1 minute.
 */
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(Math.ceil(words / 200), 1);
}
