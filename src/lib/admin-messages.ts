/**
 * Maps raw/network/API errors to clearer admin-facing copy.
 * Preserves useful server messages; softens technical noise.
 */
export function getFriendlyError(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message?.trim()) {
    return fallback;
  }

  const message = error.message.trim();

  if (
    message === 'Failed to fetch' ||
    message.includes('NetworkError') ||
    message.includes('Load failed')
  ) {
    return 'Unable to connect. Check your internet connection and try again.';
  }

  if (message.includes('HTTP error! status: 401') || message.includes('Unauthorized')) {
    return 'Your session may have expired. Refresh the page and sign in again.';
  }

  if (message.includes('HTTP error! status: 403') || message.includes('Forbidden')) {
    return 'You do not have permission to perform this action.';
  }

  if (message.includes('HTTP error! status: 404') || /not found/i.test(message)) {
    return message.length < 120 ? message : 'The requested item could not be found.';
  }

  if (message.includes('HTTP error! status: 5') || /internal server/i.test(message)) {
    return 'Something went wrong on the server. Please try again in a moment.';
  }

  // Drop noisy prefixes like "Failed to fetch dashboard stats: "
  const cleaned = message
    .replace(/^Failed to fetch[^:]*:\s*/i, '')
    .replace(/^HTTP error!\s*status:\s*\d+\s*/i, '')
    .trim();

  return cleaned || fallback;
}
