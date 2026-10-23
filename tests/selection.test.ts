import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptySelection, selectPoint, selectionHelp } from '../src/selection.ts';

test('initial selection asks for start, then destination', () => {
  const initial = emptySelection();
  assert.equal(initial.active, 'start');
  assert.match(selectionHelp(initial), /Wähle Start/);
  const start = selectPoint(initial, { lat: 48, lng: 7 });
  assert.deepEqual(start.start, { lat: 48, lng: 7 });
  assert.equal(start.destination, null);
  assert.equal(start.active, 'destination');
  assert.equal(initial.start, null);
  assert.match(selectionHelp(start), /Wähle Ziel/);
});

test('explicit destination selection works before start', () => {
  const state = selectPoint({ ...emptySelection(), active: 'destination' }, { lat: 49, lng: 8 });
  assert.equal(state.start, null);
  assert.deepEqual(state.destination, { lat: 49, lng: 8 });
});

test('either selected point can be replaced without losing the other', () => {
  let state = selectPoint(emptySelection(), { lat: 48, lng: 7 });
  state = selectPoint(state, { lat: 49, lng: 8 });
  assert.match(selectionHelp(state), /Start und Ziel sind ausgewählt/);
  state = selectPoint({ ...state, active: 'start' }, { lat: 50, lng: 9 });
  assert.deepEqual(state.start, { lat: 50, lng: 9 });
  assert.deepEqual(state.destination, { lat: 49, lng: 8 });
  state = selectPoint({ ...state, active: 'destination' }, { lat: 51, lng: 10 });
  assert.deepEqual(state.destination, { lat: 51, lng: 10 });
  assert.deepEqual(emptySelection(), { active: 'start', start: null, destination: null });
});
