export const API_BASE = '/api';

export function mediaUrl(path) {
    if (!path) return '';
    return path.startsWith('http') ? path : `${window.location.origin}${path}`;
}

export async function readResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : { message: `Server returned ${response.status} ${response.statusText}` };
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
}
