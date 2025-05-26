const prefetchedUrls = new Set<string>();

export const prefetchManager = {
  has: (url: string) => prefetchedUrls.has(url),
  add: (url: string) => prefetchedUrls.add(url),
};
