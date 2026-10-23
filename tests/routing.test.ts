import { test } from 'node:test';
import assert from 'node:assert/strict';
import { route } from '../worker/routing.ts';
import { createRouteRequest } from '../src/route-request.ts';

const start = { lat: 48, lng: 7 };
const destination = { lat: 49, lng: 8 };
function request(body: unknown) {
  return new Request('https://example.org/api/route', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
const result = { distance: 12000, duration: 1200, geometry: { type: 'LineString', coordinates: [[7, 48], [8, 49]] } };

test('rejects invalid coordinates without calling provider', async () => {
  for (const body of [null, {}, { start: { lat: 91, lng: 7 }, destination }, { start, destination: { lat: 49, lng: '8' } }, { start: { lat: null, lng: 7 }, destination }]) {
    assert.equal((await route(request(body), async () => { throw new Error('Must not fetch'); })).status, 400);
  }
  const oversized = new Request('https://example.org/api/route', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ' '.repeat(1025) });
  assert.equal((await route(oversized)).status, 413);
});

test('uses fixed driving endpoint with timeout and returns normalized result', async () => {
  const response = await route(request({ start, destination }), async (url, options) => {
    assert.match(String(url), /^https:\/\/router.project-osrm.org\/route\/v1\/driving\/7,48;8,49\?/);
    assert.ok(options?.signal);
    assert.equal(options?.redirect, 'error');
    return Response.json({ code: 'Ok', routes: [result] });
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { distance: 12000, duration: 1200, coordinates: [[7, 48], [8, 49]] });
});

test('handles unavailable providers, missing routes and malformed responses', async () => {
  for (const [payload, expected] of [[{ code: 'NoRoute' }, 404], [{ code: 'NoSegment' }, 404], [{ code: 'Ok', routes: [] }, 502], [{ code: 'Ok', routes: [{ ...result, duration: -1 }] }, 502]] as const) {
    assert.equal((await route(request({ start, destination }), async () => Response.json(payload))).status, expected);
  }
  assert.equal((await route(request({ start, destination }), async () => new Response('', { status: 429 }))).status, 502);
  for (const cause of [new Error('Offline'), new DOMException('Timeout', 'TimeoutError')]) {
    assert.equal((await route(request({ start, destination }), async () => { throw cause; })).status, 502);
  }
});

test('discarding or replacing a request ignores late success and late errors', async () => {
  const pending: ((response: Response) => void)[] = [];
  const states: unknown[] = [];
  const client = createRouteRequest(state => states.push(state), () => new Promise(resolve => pending.push(resolve)));
  const first = client.calculate(start, destination);
  client.clear();
  const reset = states.at(-1);
  pending[0](Response.json({ distance: 1 }));
  await first;
  assert.equal(states.at(-1), reset);
  const old = client.calculate(start, destination);
  const latest = client.calculate(destination, start);
  const expected = { distance: 12000, duration: 1200, coordinates: [[7, 48], [8, 49]] };
  pending[2](Response.json(expected));
  await latest;
  pending[1](Response.json({ error: 'Old failure' }, { status: 502 }));
  await old;
  assert.deepEqual(states.at(-1), { loading: false, result: expected, error: null });
});
