export const API_BASE = '/api';
const MEDIA_ORIGIN = import.meta.env.VITE_MEDIA_ORIGIN || window.location.origin;

export function mediaUrl(path) {
    if (!path) return '';
    return path.startsWith('http') ? path : `${MEDIA_ORIGIN}${path}`;
}

export async function readResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : { message: `Server returned ${response.status} ${response.statusText}` };
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
}
