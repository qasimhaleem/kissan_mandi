export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
export const SERVER_BASE = API_BASE.replace(/\/api\/?$/, '');

export interface HealthResponse {
  success: boolean;
  status: 'healthy' | 'degraded';
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  database: {
    state: string;
    connected: boolean;
    host: string | null;
    database: string | null;
    latencyMs: number | null;
  };
  storage: {
    provider: string;
    configured: boolean;
  };
}

/**
 * Fetch health status of the backend API and database
 */
export async function checkApiHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`, {
    cache: 'no-store',
  });
  if (!res.ok && res.status !== 503) {
    throw new Error(`API returned status ${res.status}`);
  }
  return res.json();
}

/**
 * Resolves an image URL whether it's an external Cloudinary link or a local /uploads path
 */
export function resolveImageUrl(src?: string): string {
  if (!src) {
    return 'https://placehold.co/600x400/8FD19E/2B2B2B?text=Produce';
  }
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  return `${SERVER_BASE}${src.startsWith('/') ? '' : '/'}${src}`;
}
