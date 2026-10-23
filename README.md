# Wegweiser

Wegweiser hilft Autofahrern, eine Route zwischen zwei Punkten auf einer OpenStreetMap-Karte zu planen. Die Anwendung läuft im Browser und soll auf Cloudflare Workers veröffentlicht werden.

## Erste Version

- Eine verschiebbare und zoombare Karte mit sichtbarem OpenStreetMap-Quellenhinweis anzeigen.
- Start und Ziel durch Anklicken der Karte auswählen und mit unterschiedlichen Markern kennzeichnen.
- Eine Autoroute berechnen und auf der Karte anzeigen.
- Entfernung in Kilometern und geschätzte Fahrtdauer anzeigen.
- Auswahl und Route zurücksetzen können.
- Ladezustände, nicht erreichbare Dienste und nicht berechenbare Routen verständlich anzeigen.
- Auf Smartphone und Desktop bedienbar sein; Bedienelemente sind auf Deutsch.

Die erste Version dient der Routenplanung. GPS-Navigation, Abbiegehinweise, Verkehrsdaten, Adresssuche, Benutzerkonten und gespeicherte Routen sind spätere Erweiterungen. Fahrtdauern berücksichtigen zunächst keinen aktuellen Verkehr.

## Geplante Technik

- TypeScript und Vite für die Web-App.
- Leaflet zur Darstellung der Karte; OpenStreetMap als Kartendatenquelle.
- Cloudflare Workers mit Static Assets für Frontend und einen API-Endpunkt zur Routenberechnung.
- Ein Routingdienst mit Autoprofil; der Anbieter ist vor Umsetzung der Routing-Anbindung auszuwählen.
- Für die erste Version keine Datenbank und keine Benutzerkonten.

OpenStreetMap liefert Kartendaten, keine eigene Routing-API. Kartenkacheln und Routing benötigen passende Anbieter. Vor deren Einbindung sind Nutzungsbedingungen, Attribution, Limits und mögliche Kosten zu prüfen. Öffentliche Demo-Dienste sind keine zugesicherte Produktionsinfrastruktur. API-Schlüssel gehören in Worker-Secrets.

## Entwicklungsstand

Die Anwendung zeigt eine verschiebbare und zoombare OpenStreetMap-Karte mit Leaflet. Ein Cloudflare Worker liefert die gebauten Dateien aus. Start-/Zielauswahl und Routing folgen in den nächsten Issues.

## Einrichtung und lokale Entwicklung

Voraussetzung: Node.js 24 LTS mit npm (siehe `.nvmrc`).

```sh
npm ci
npm run dev
```

Vite startet den Frontend-Entwicklungsserver auf `http://127.0.0.1:5173` mit automatischer Aktualisierung bei Änderungen.

Für die lokale Prüfung einschließlich Cloudflare Worker:

```sh
npm run dev:worker
```

Wrangler baut das Frontend automatisch und liefert die Dateien auf `http://127.0.0.1:8787` aus. Änderungen unter `src/` lösen einen Neubau aus; nach Änderungen an `index.html` den Worker-Entwicklungsserver neu starten. Beide Entwicklungsserver mit Strg+C beenden.

## Build und Prüfungen

```sh
npm run typecheck
npm run lint
npm run build
npm run build:worker
```

- `typecheck` prüft Frontend und Worker mit getrennten TypeScript-Umgebungen.
- `lint` prüft JavaScript und TypeScript mit ESLint.
- `build` erstellt das Frontend unter `dist/`.
- `build:worker` baut das Frontend erneut und bündelt den Worker unter `.wrangler/build/`, ohne etwas zu veröffentlichen. Dafür sind keine Cloudflare-Zugangsdaten erforderlich.

GitHub Actions führt bei Pull Requests und Änderungen auf `main` die Installation, Typprüfung, Linting und `build:worker` aus. Letzteres enthält den Produktionsbuild. Die CI veröffentlicht nichts und benötigt keine Secrets.

## Projektaufbau

- `index.html`, `src/`: Frontend und Styles.
- `worker/index.ts`: Weiterleitung an Cloudflare Static Assets.
- `wrangler.jsonc`: Worker-Konfiguration und automatischer Frontend-Build.
- `.github/workflows/ci.yml`: automatische Prüfungen.
- `package-lock.json`: festgeschriebene Abhängigkeiten; Installation mit `npm ci`.

## Arbeitsablauf

1. Ein Issue mit Akzeptanzkriterien auswählen.
2. Einen Branch für dieses Issue anlegen.
3. Änderung mit Codex umsetzen und passende Prüfungen ausführen.
4. Einen Pull Request mit Beschreibung und Prüfergebnissen erstellen; das Issue mit `Closes #…` verknüpfen.
5. Vorschau und Akzeptanzkriterien prüfen, dann mergen.

Die ersten fünf Arbeitspakete stehen in [docs/issues.md](docs/issues.md). Regeln für Codex stehen in [AGENTS.md](AGENTS.md).

## Veröffentlichung

Ziel ist ein einzelnes Cloudflare-Workers-Projekt. Ein manueller Deploy ist vorbereitet:

```sh
npm run deploy
```

Dieser Befehl baut das Frontend und veröffentlicht den Worker `wegweiser` samt statischen Dateien. Er benötigt eine autorisierte Cloudflare-Umgebung, beispielsweise mit `CLOUDFLARE_API_TOKEN` und `CLOUDFLARE_ACCOUNT_ID`. Zugangsdaten werden ausschließlich als Secrets hinterlegt; sie gehören nicht ins Repository. `.env*` und `.dev.vars*` sind von Git ausgeschlossen (ausgenommen eine wertfreie `.env.example`). Frontend-Variablen mit `VITE_` sind öffentlich und dürfen keine Secrets enthalten.

Vorschau, automatische Veröffentlichung und Branchschutz folgen in Issue #5. Es ist bisher kein Cloudflare-Deployment für dieses Projekt eingerichtet.

## Karte und Kachelanbieter

Die Karte verwendet Leaflet und die Standard-Rasterkacheln von OpenStreetMap über `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, maximal Zoomstufe 19. Die Startansicht zeigt Deutschland. Die Karte unterstützt Maus, Touch und Tastatur und passt sich Größenänderungen an.

Für den zunächst kleinen Projektbetrieb ist der öffentliche OSM-Kacheldienst vorgesehen. Es gelten die [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) und die [Copyright- und Lizenzhinweise](https://www.openstreetmap.org/copyright). Die Attribution bleibt sowohl im Kartenbereich als auch unterhalb der Karte sichtbar.

- Kacheln werden direkt im Browser angefordert; der normale HTTP-Referer darf nicht unterdrückt werden.
- Browser-Caching gemäß Server-Headern beibehalten; keine Cache-Umgehung, Massendownloads, Vorabdownloads oder Offline-Pakete einbauen.
- Der öffentliche Dienst hat begrenzte Kapazität und keine Verfügbarkeitsgarantie; vor größerem Nutzungsaufkommen einen geeigneten kommerziellen Anbieter oder eigene Infrastruktur wählen.
- Beim Laden übermittelt der Browser technisch erforderliche Verbindungsdaten an OpenStreetMap; siehe [OSMF-Datenschutzrichtlinie](https://osmfoundation.org/wiki/Privacy_Policy).

Für die Kartenanzeige ist kein API-Schlüssel erforderlich. Die Kachelanbindung berechnet keine Routen.
