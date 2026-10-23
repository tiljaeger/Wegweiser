export type Point = { lat: number; lng: number };
export type Endpoint = 'start' | 'destination';
export type Selection = {
  active: Endpoint;
  start: Point | null;
  destination: Point | null;
};

export function emptySelection(): Selection {
  return { active: 'start', start: null, destination: null };
}

export function selectPoint(state: Selection, point: Point): Selection {
  return {
    ...state,
    [state.active]: { lat: point.lat, lng: point.lng },
    active: state.active === 'start' && !state.destination ? 'destination' : state.active,
  };
}

export function selectionHelp(state: Selection): string {
  const next = state.active === 'start' ? 'Start' : 'Ziel';
  const prefix = state.start && state.destination ? 'Start und Ziel sind ausgewählt. ' : '';
  return `${prefix}Wähle ${next} durch einen Kartenklick oder über „Kartenmitte übernehmen“.`;
}
