# Arbeitsregeln für Wegweiser

## Ziel und Umfang

- README.md und das aktuelle Issue vor Änderungen lesen.
- Die erste Version plant Autorouten zwischen zwei Kartenpunkten.
- Änderungen auf das jeweilige Issue begrenzen; bestehende Konventionen beachten.
- TypeScript, Vite, Leaflet und Cloudflare Workers mit Static Assets sind die geplante Basis.
- Neue Abhängigkeiten nur mit konkretem Nutzen ergänzen.

## Umsetzung

- Deutsche Oberflächentexte und verständliche Lade- und Fehlerzustände verwenden.
- Smartphone, Desktop und Tastaturbedienung berücksichtigen.
- Quellenhinweise und Nutzungsbedingungen der Karten- und Routinganbieter beachten.
- Koordinaten am API-Eingang validieren; ausgehende Routing-Anfragen mit Timeout versehen.
- Keine beliebigen vom Nutzer angegebenen Ziel-URLs vom Worker abrufen.
- API-Schlüssel ausschließlich in Worker-Secrets speichern.
- Keine Zugangsdaten oder vollständigen Routenkoordinaten in Logs schreiben.
- Routen nicht dauerhaft speichern, solange dies kein ausdrücklicher Projektumfang ist.

## Prüfung und Abschluss

- Node.js 24 verwenden; Abhängigkeiten mit `npm ci` installieren.
- Vor Abschluss `npm run typecheck`, `npm run lint` und `npm run build:worker` ausführen. Der Worker-Dry-Run enthält den Frontend-Build und veröffentlicht nichts.
- `npm run dev` startet das Frontend, `npm run dev:worker` die lokale Worker-Umgebung.
- `npm run deploy` veröffentlicht auf Cloudflare; für reine Build-Prüfungen den Dry-Run verwenden.
- Relevante Tests für Routing-Validierung, Fehlerverhalten und Auswahlzustände ergänzen.
- Reine Dokumentationsänderungen benötigen keine neuen Tests.
- Durchgeführte Prüfungen und offene Einschränkungen im Pull Request nennen.
- Keine erfolgreichen Tests oder Deployments behaupten, die nicht ausgeführt wurden.
