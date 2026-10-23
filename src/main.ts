import { map, tileLayer, control } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

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

  const resizeObserver = new ResizeObserver(() => leafletMap.invalidateSize());
  resizeObserver.observe(container);
}
