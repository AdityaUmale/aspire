export function decodeHtmlAttribute(value: string) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function extractIframeSource(value: string) {
  const iframeMatch = value.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  return iframeMatch?.[1] ? decodeHtmlAttribute(iframeMatch[1]) : '';
}

function extractFirstUrl(value: string) {
  const urlMatch = value.match(/https?:\/\/[^\s"'<>]+/i);
  return urlMatch?.[0] ? decodeHtmlAttribute(urlMatch[0]) : '';
}

function getFacebookCandidate(rawValue: string) {
  const trimmed = rawValue.trim();
  if (!trimmed) return '';

  let candidate = extractIframeSource(trimmed) || trimmed;

  if (!/^https?:\/\//i.test(candidate)) {
    const embeddedUrl = extractFirstUrl(candidate);
    if (embeddedUrl) {
      candidate = embeddedUrl;
    }
  }

  return decodeHtmlAttribute(candidate.trim());
}

export function getFacebookPluginDetails(rawValue: string) {
  const candidate = getFacebookCandidate(rawValue);
  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);

    if (
      !url.hostname.endsWith('facebook.com') ||
      (url.pathname !== '/plugins/video.php' && url.pathname !== '/plugins/post.php')
    ) {
      return null;
    }

    const href = url.searchParams.get('href');
    const targetUrl = href ? normalizeFacebookInput(href) : candidate;

    return {
      embedKind: url.pathname === '/plugins/post.php' ? 'facebook-post' : 'facebook-video',
      embedUrl: url.toString(),
      targetUrl,
    };
  } catch {
    return null;
  }
}

export function normalizeFacebookInput(rawValue: string) {
  const candidate = getFacebookCandidate(rawValue);
  if (!candidate) return '';

  try {
    const url = new URL(candidate);

    if (!url.hostname.endsWith('facebook.com')) {
      return candidate;
    }

    if (url.pathname === '/plugins/video.php' || url.pathname === '/plugins/post.php') {
      return url.toString();
    }

    const reelMatch = url.pathname.match(/^\/reel\/(\d+)\/?/i);
    if (reelMatch) {
      return `https://www.facebook.com/reel/${reelMatch[1]}/`;
    }

    if (url.pathname === '/watch' && url.searchParams.get('v')) {
      return `https://www.facebook.com/watch/?v=${url.searchParams.get('v')}`;
    }

    if (/^\/[^/]+\/videos\//i.test(url.pathname)) {
      return `${url.origin}${url.pathname}`;
    }

    return url.toString();
  } catch {
    return rawValue.trim();
  }
}
