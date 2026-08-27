# LÜBECK · OUR WAY — prototype v0.1

Erster strukturierter Prototyp der größeren Lübeck-App.

## Enthalten
- Explore mit schlanken Filtern: Art, Architecture, History, Literature, Water, Green
- separater Photo-Spots-Filter
- 4 Walks: First Time Lübeck, Lübeck by the Water, Hidden Lübeck, Art & Architecture
- Eat & Drink mit WE'D GO / TO TRY und Filtern
- gemeinsame Leaflet/OpenStreetMap-Karte
- Directions und Check current info statt dauerhaft gepflegter Öffnungszeiten
- PWA / Standalone-Mode
- UI/Microcopy Englisch, Erklärtexte Deutsch

## Datenstruktur
- `data/places.js`
- `data/gastro.js`
- `data/walks.js`

Damit können Inhalte später ergänzt werden, ohne die App-Logik neu zu schreiben.

## Lokal testen
VS Code → Ordner öffnen → `index.html` → Live Server.

## GitHub Pages
Am besten als neues Repo, z. B. `luebeck-our-way`, veröffentlichen.
Die bestehende `luebeck-photowalk`-App bleibt dadurch als funktionierende Referenz erhalten.

## Noch bewusst offen
- Events / events.json
- vollständige redaktionelle Langtexte aller Orte
- endgültige Gastro-Kuration nach weiteren Tests
- ggf. spätere vollständige englische Sprachversion


## v0.2 – first real-world feedback
- Home counter: `eat & drink spots`
- REMO: very good local coffee emphasized
- Altstadtrösterei: cake added
- Cycle Roasters: moved to TO TRY
- Blaupause: good coffee, cake and porcelain cups added
- Fräulein Brömse: moved to TO TRY
- Bootshaus Marli: moved to WE'D GO
- Heiligen-Geist-Hospital, Schulgarten, Aegidienviertel, Schiffergesellschaft → WORTH A LOOK
- Hüxstraße & Fleischhauerstraße → DON'T MISS
- black primary buttons changed to turquoise
- new Lübeck skyline/water brand mark instead of the plain `L`
