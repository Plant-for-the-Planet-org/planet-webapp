export function getLocalizedPath(path: string, locale = 'en'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `/${locale}${normalizedPath}`;
}
