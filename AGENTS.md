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

- Vorhandene Build-, Typprüfungs-, Lint- und relevante Testbefehle aus package.json nutzen, sobald eingerichtet.
- Relevante Tests für Routing-Validierung, Fehlerverhalten und Auswahlzustände ergänzen.
- Reine Dokumentationsänderungen benötigen keine neuen Tests.
- Durchgeführte Prüfungen und offene Einschränkungen im Pull Request nennen.
- Keine erfolgreichen Tests oder Deployments behaupten, die nicht ausgeführt wurden.
