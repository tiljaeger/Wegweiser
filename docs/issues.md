# Erste Arbeitspakete

Diese Entwürfe werden nach Erstellung des GitHub-Repositories als einzelne Issues übernommen. Die Nummerierung hier bezeichnet die Reihenfolge, keine GitHub-Issue-Nummern.

## 1. Technisches Grundgerüst und automatische Prüfungen einrichten

Ziel: Eine lokal startbare TypeScript-App mit Vite und Cloudflare Workers schaffen.

Akzeptanzkriterien:
- `npm ci`, lokaler Entwicklungsstart, Produktionsbuild, Typprüfung und Linting sind eingerichtet und in der README dokumentiert.
- Abhängigkeiten sind über eine Lockdatei festgeschrieben.
- Wrangler liefert die statischen Assets aus; ein Deployment-Dry-Run funktioniert.
- GitHub Actions prüft Pull Requests mit Installation, Typprüfung, Linting und Build.
- Generierte Dateien und Secrets sind von Git ausgeschlossen.

## 2. OpenStreetMap-Karte anzeigen

Abhängigkeit: Arbeitspaket 1.

Akzeptanzkriterien:
- Leaflet zeigt eine verschiebbare und zoombare Karte auf Smartphone und Desktop.
- Ein geeigneter Kachelanbieter ist gewählt und dessen Nutzungsbedingungen sind dokumentiert.
- OpenStreetMap- und gegebenenfalls Anbieter-Attribution bleiben sichtbar.
- Die Kartenansicht passt sich der verfügbaren Bildschirmgröße an.

## 3. Start und Ziel auswählen und zurücksetzen

Abhängigkeit: Arbeitspaket 2.

Akzeptanzkriterien:
- Der Nutzer kann explizit auswählen, ob ein Kartenklick den Start oder das Ziel setzt.
- Start und Ziel erhalten eindeutig unterscheidbare Marker und Textbeschriftungen.
- Eine verständliche Anleitung zeigt den nächsten Schritt an.
- Zurücksetzen entfernt beide Punkte und eine vorhandene Route samt Ergebnis.
- Die Auswahl kann geändert werden; dabei wird eine alte Route ungültig.
- Auswahlzustände sind getestet; Bedienelemente sind per Tastatur erreichbar und beschriftet.

## 4. Autoroute berechnen und Ergebnis anzeigen

Abhängigkeit: Arbeitspaket 3.

Akzeptanzkriterien:
- Ein Routinganbieter mit Autoprofil ist gewählt; Limits, Kosten und Bedingungen sind dokumentiert.
- Ein Worker-Endpunkt validiert Start- und Zielkoordinaten und fragt den fest konfigurierten Anbieter mit Timeout ab.
- Eventuell erforderliche API-Schlüssel liegen ausschließlich in Worker-Secrets.
- Eine Route wird als Linie angezeigt; die Kartenansicht umfasst die Route.
- Entfernung und geschätzte Fahrtdauer werden lesbar angezeigt.
- Ladezustand, fehlende Route, ungültige Eingaben und Anbieterausfälle werden verständlich behandelt.
- Veraltete Antworten überschreiben nach Änderung oder Zurücksetzen der Punkte keinen neuen Zustand.
- Tests prüfen Eingabevalidierung, Anbieterfehler und veraltete Antworten ohne echte API-Aufrufe.

## 5. Cloudflare-Vorschau und Produktionsablauf einrichten

Abhängigkeit: Arbeitspakete 1 bis 4.

Akzeptanzkriterien:
- Eine Vorschau kann getrennt von der Produktion veröffentlicht werden.
- Secrets und Umgebungsvariablen sind dokumentiert, ohne Werte offenzulegen.
- GitHub-Prüfungen sind erfolgreich; der Ablauf für Merge und Produktionsdeployment ist dokumentiert.
- Karte, Punktauswahl, Autoroute und Zurücksetzen sind in der Vorschau manuell geprüft.
- Ein Rückweg zur vorherigen Version ist dokumentiert.
- Erforderliche manuelle Einstellungen wie Branchschutz sind in der README festgehalten.
