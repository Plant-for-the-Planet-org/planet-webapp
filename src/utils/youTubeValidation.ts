export const isYouTubeDomain = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
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

export const validateYouTubeUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return true;

  const trimmedUrl = url.trim();

  // Reject URLs containing spaces (indicates invalid URL or trailing garbage)
  if (trimmedUrl.includes(' ')) return false;

  try {
    let urlObj: URL;

    if (!trimmedUrl.match(/^https?:\/\//)) {
      urlObj = new URL(`https://${trimmedUrl}`);
    } else {
      urlObj = new URL(trimmedUrl);
    }

    // Use the shared domain checking logic
    if (!isYouTubeDomain(urlObj.href)) {
      return false;
    }

    const hostname = urlObj.hostname.toLowerCase();

    // For youtu.be (short URLs)
    if (hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
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
    }

    return false;
  } catch (error) {
    return false;
  }
};
