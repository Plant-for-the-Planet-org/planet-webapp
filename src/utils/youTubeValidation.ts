/**
 * Checks if a given URL belongs to YouTube or its related domains (youtu.be, youtube-nocookie.com).
 * This function is case-insensitive and handles URLs with or without protocols.
 * @param url - The URL to check.
 * @returns True if the URL belongs to YouTube or its related domains, false otherwise.
 */
export const isYouTubeDomain = (url: string): boolean => {
  try {
    let fullUrl = url;
    if (!url.match(/^https?:\/\//)) {
      fullUrl = `https://${url}`;
    }

    const { hostname } = new URL(fullUrl);
    const lowerHostname = hostname.toLowerCase();

    const isMainYTHost =
      lowerHostname === 'youtube.com' ||
      (lowerHostname.endsWith('.youtube.com') &&
        lowerHostname.length > '.youtube.com'.length);

    const isYTNoCookieHost =
      lowerHostname === 'youtube-nocookie.com' ||
      (lowerHostname.endsWith('.youtube-nocookie.com') &&
        lowerHostname.length > '.youtube-nocookie.com'.length);

    const isYTShortLinkHost =
      lowerHostname === 'youtu.be' ||
      (lowerHostname.endsWith('.youtu.be') &&
        lowerHostname.length > '.youtu.be'.length);

    return isMainYTHost || isYTNoCookieHost || isYTShortLinkHost;
  } catch (e) {
    return false;
  }
};

/**
 * Validates a YouTube URL.
 * Rejects URLs with spaces, ensures the domain is YouTube or its related domains,
 * and checks for valid YouTube video ID patterns.
 * @param url - The URL to validate.
 * @returns True if the URL is a valid YouTube URL, false otherwise.
 */
export const validateYouTubeUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return true;

  const trimmedUrl = url.trim();

  // Reject URLs containing spaces (indicates invalid URL or trailing garbage)
  if (trimmedUrl.includes(' ')) return false;

  if (!isYouTubeDomain(trimmedUrl)) {
    return false;
  }

  try {
    let urlObj: URL;

    if (!trimmedUrl.match(/^https?:\/\//)) {
      urlObj = new URL(`https://${trimmedUrl}`);
    } else {
      urlObj = new URL(trimmedUrl);
    }

    const hostname = urlObj.hostname.toLowerCase();

    // For youtu.be (short URLs)
    if (hostname === 'youtu.be') {
      const videoId = urlObj.pathname.replace(/^\/+|\/+$/g, '');
      if (!videoId) return false;
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
    }

    // For youtube.com domains
    const path = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    // Check for valid YouTube video patterns
    if (path === '/watch') {
      const videoId = searchParams.get('v');
      if (!videoId) return false;
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
    } else if (path.startsWith('/embed/')) {
      const videoId = path.split('/embed/')[1]?.split('?')[0];
      if (!videoId) return false;
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
    } else if (path.startsWith('/v/')) {
      const videoId = path.split('/v/')[1]?.split('?')[0];
      if (!videoId) return false;
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
    } else if (path.startsWith('/shorts/')) {
      const videoId = path
        .split('/shorts/')[1]
        ?.split('?')[0]
        ?.replace(/\/+$/, '');
      if (!videoId) return false;
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
    }

    return false;
  } catch (error) {
    return false;
  }
};
