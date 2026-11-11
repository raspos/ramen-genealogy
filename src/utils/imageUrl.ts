/**
 * Helper to resolve image paths against the current Vite base URL
 * (handles GitHub Pages subpath deployment like /ramen-genealogy/)
 * Guarantees idempotency so calling it multiple times never duplicates the base prefix.
 */
export function getAssetUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const base =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL
      ? import.meta.env.BASE_URL
      : '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  // Normalize path to leading slash
  const normPath = path.startsWith('/') ? path : `/${path}`;

  // If already starts with base, return as-is!
  if (normPath.startsWith(cleanBase)) {
    return normPath;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
