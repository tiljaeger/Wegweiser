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

Die Projektplanung und Arbeitsregeln sind vorbereitet. Anwendung, Build, Tests, GitHub Actions und Cloudflare-Deployment werden in den nächsten Issues eingerichtet. Es existieren noch keine ausführbaren npm-Befehle.

## Arbeitsablauf

1. Ein Issue mit Akzeptanzkriterien auswählen.
2. Einen Branch für dieses Issue anlegen.
3. Änderung mit Codex umsetzen und passende Prüfungen ausführen.
4. Einen Pull Request mit Beschreibung und Prüfergebnissen erstellen; das Issue mit `Closes #…` verknüpfen.
5. Vorschau und Akzeptanzkriterien prüfen, dann mergen.

Die ersten fünf Arbeitspakete stehen in [docs/issues.md](docs/issues.md). Regeln für Codex stehen in [AGENTS.md](AGENTS.md).

## Veröffentlichung

Ziel ist ein einzelnes Cloudflare-Workers-Projekt. GitHub Actions soll zunächst Änderungen prüfen. Vorschau und Produktion werden getrennt konfiguriert. Zugangsdaten werden ausschließlich als Secrets hinterlegt; sie gehören nicht ins Repository.
