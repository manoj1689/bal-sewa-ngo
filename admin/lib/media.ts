const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

function getBackendOrigin() {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return 'http://localhost:8000';
  }
}

export function getMediaUrl(url?: string | null) {
  if (!url) return '';

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;

  return `${getBackendOrigin()}${normalizedPath}`;
}
