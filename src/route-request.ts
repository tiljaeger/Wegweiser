import type { Point } from './selection';
export type RouteResult = { distance: number; duration: number; coordinates: [number, number][] };
export type RouteState = { loading: boolean; result: RouteResult | null; error: string | null };

export function createRouteRequest(publish: (state: RouteState) => void, fetcher: typeof fetch = fetch) {
  let generation = 0;
  let controller: AbortController | null = null;
  function clear() {
    generation++;
    controller?.abort();
    controller = null;
    publish({ loading: false, result: null, error: null });
  }
  async function calculate(start: Point, destination: Point) {
    clear();
    const current = generation;
    controller = new AbortController();
    publish({ loading: true, result: null, error: null });
    try {
      const response = await fetcher('/api/route', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ start, destination }), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
      const data = await response.json();
      if (current !== generation) return;
      if (!response.ok) throw new Error(data.error || 'Die Route konnte nicht berechnet werden.');
      publish({ loading: false, result: data as RouteResult, error: null });
    } catch (cause) {
      if (current !== generation) return;
      publish({ loading: false, result: null, error: cause instanceof Error && cause.name === 'Error' ? cause.message : 'Die Routenberechnung ist fehlgeschlagen oder hat zu lange gedauert. Bitte erneut versuchen.' });
    }
  }
  return { clear, calculate };
}
