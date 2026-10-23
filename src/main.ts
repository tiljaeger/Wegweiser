import { map, tileLayer, control, marker, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import { emptySelection, selectPoint, selectionHelp } from './selection';
import type { Endpoint, Point } from './selection';
import type { Marker } from 'leaflet';

const status = document.querySelector<HTMLParagraphElement>('#app-status');
const container = document.querySelector<HTMLDivElement>('#map');

if (container && status) {
  const leafletMap = map(container, { zoomControl: false }).setView([51.1657, 10.4515], 6);
  control.zoom({ zoomInTitle: 'Vergrößern', zoomOutTitle: 'Verkleinern' }).addTo(leafletMap);

  const tiles = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>',
  });

  let tileFailed = false;
  tiles.on('loading', () => {
    tileFailed = false;
    status.textContent = 'Die Karte wird geladen.';
  });
  tiles.on('tileerror', () => {
    tileFailed = true;
    status.textContent = 'Einige Kartenbereiche konnten nicht geladen werden. Bitte prüfe deine Internetverbindung oder versuche es später erneut.';
  });
  tiles.on('load', () => {
    if (!tileFailed) status.textContent = 'Karte geladen. Du kannst die Karte verschieben und zoomen.';
  });
  tiles.addTo(leafletMap);

  let selection = emptySelection();
  const markers: Partial<Record<Endpoint, Marker>> = {};
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="endpoint"]');
  const help = document.querySelector<HTMLParagraphElement>('#selection-help')!;

  function renderSelection() {
    for (const endpoint of ['start', 'destination'] as const) {
      const point = selection[endpoint];
      const label = endpoint === 'start' ? 'Start' : 'Ziel';
      markers[endpoint]?.remove();
      delete markers[endpoint];
      document.querySelector(`#${endpoint}-value`)!.textContent = point
        ? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`
        : 'Noch nicht ausgewählt';
      if (point) {
        markers[endpoint] = marker([point.lat, point.lng], {
          title: label,
          alt: label,
          icon: divIcon({
            className: `endpoint-marker endpoint-${endpoint}`,
            html: `<span>${label === 'Start' ? 'S' : 'Z'}</span>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          }),
        }).bindTooltip(label, { permanent: true, direction: 'top', offset: [0, -18] }).addTo(leafletMap);
      }
    }
    for (const radio of radios) radio.checked = radio.value === selection.active;
    help.textContent = selectionHelp(selection);
  }

  function setPoint(point: Point) {
    selection = selectPoint(selection, point);
    renderSelection();
  }

  for (const radio of radios) {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        selection = { ...selection, active: radio.value as Endpoint };
        renderSelection();
      }
    });
  }
  leafletMap.on('click', (event) => setPoint(event.latlng));
  document.querySelector('#use-center')!.addEventListener('click', () => setPoint(leafletMap.getCenter()));
  document.querySelector('#reset-selection')!.addEventListener('click', () => {
    selection = emptySelection();
    renderSelection();
  });
  renderSelection();

  const resizeObserver = new ResizeObserver(() => leafletMap.invalidateSize());
  resizeObserver.observe(container);
}
