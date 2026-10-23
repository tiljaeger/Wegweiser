type Point = { lat: number; lng: number };
const headers = { 'Cache-Control': 'no-store' };
function error(message: string, status: number) {
  return Response.json({ error: message }, { status, headers });
}
function point(value: unknown): value is Point {
  if (!value || typeof value !== 'object') return false;
  const p = value as Point;
  return Number.isFinite(p.lat) && Math.abs(p.lat) <= 90 && Number.isFinite(p.lng) && Math.abs(p.lng) <= 180;
}

export async function route(request: Request, fetcher: typeof fetch = fetch): Promise<Response> {
  if (request.method !== 'POST') return new Response('Methode nicht erlaubt.', { status: 405, headers: { ...headers, Allow: 'POST' } });
  if (!request.headers.get('content-type')?.includes('application/json')) return error('Bitte JSON mit Start und Ziel senden.', 415);
  // Coordinates need only a tiny payload. Bound the streamed body before parsing.
  const reader = request.body?.getReader();
  if (!reader) return error('Start und Ziel fehlen.', 400);
  let body = '';
  let bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 1024) { await reader.cancel(); return error('Die Eingabe ist zu groß.', 413); }
      body += decoder.decode(chunk.value, { stream: true });
    }
    body += decoder.decode();
  } catch { return error('Die Eingabe konnte nicht gelesen werden.', 400); }
  let input: { start?: unknown; destination?: unknown };
  try { input = JSON.parse(body); } catch { return error('Die Eingabe ist kein gültiges JSON.', 400); }
  if (!input || !point(input.start) || !point(input.destination)) return error('Start und Ziel müssen gültige Koordinaten enthalten.', 400);
  const { start, destination } = input;
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=false&steps=false`;
  try {
    const response = await fetcher(url, { signal: AbortSignal.timeout(10000), redirect: 'error', headers: { 'User-Agent': 'Wegweiser/0.1 (https://github.com/tiljaeger/Wegweiser)' } });
    if (!response.ok) return error('Der Routingdienst ist momentan nicht verfügbar. Bitte später erneut versuchen.', 502);
    const data = await response.json() as { code?: string; routes?: { distance: number; duration: number; geometry: { type: string; coordinates: number[][] } }[] };
    if (data.code === 'NoRoute' || data.code === 'NoSegment') return error('Für diese Punkte wurde keine Autoroute gefunden. Bitte wähle Punkte in Straßennähe.', 404);
    const result = data.routes?.[0];
    if (data.code !== 'Ok' || !result || !Number.isFinite(result.distance) || result.distance < 0 || !Number.isFinite(result.duration) || result.duration < 0 || result.geometry?.type !== 'LineString' || !Array.isArray(result.geometry.coordinates) || result.geometry.coordinates.length < 2 || !result.geometry.coordinates.every(c => Array.isArray(c) && c.length >= 2 && point({ lat: c[1], lng: c[0] }))) {
      return error('Der Routingdienst hat keine gültige Route geliefert.', 502);
    }
    return Response.json({ distance: result.distance, duration: result.duration, coordinates: result.geometry.coordinates }, { headers });
  } catch (cause) {
    return error(cause instanceof Error && (cause.name === 'TimeoutError' || cause.name === 'AbortError') ? 'Die Routenberechnung hat zu lange gedauert. Bitte erneut versuchen.' : 'Der Routingdienst ist momentan nicht erreichbar. Bitte später erneut versuchen.', 502);
  }
}
