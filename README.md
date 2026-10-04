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

## v0.3 – Walk navigation fix
- Details opened from inside a Walk return to the same Walk.
- The previous scroll position in the Walk is restored.
- Explore and Eat & Drink keep their normal Back behavior.

## v0.4 – Show Walk map fix
- Fixes a race condition when opening the map from a Walk.
- The chosen Walk is stored before the map opens.
- After Leaflet is initialized, the route is drawn reliably.
- The map automatically fits/zooms to the selected Walk.
- Changing the Walk in the dropdown redraws the route reliably.
- Route line made slightly stronger for visibility beneath markers.

## v0.5 – real Walk map mode
- Selecting a Walk now hides ALL normal Explore/Gastro pins.
- Only numbered Walk stops remain visible.
- Main Walk route is a strong turquoise line.
- Scenic Return routes are coral dashed lines.
- Selecting All / Explore / Eat & Drink / Photo spots exits Walk mode.
- Selecting `No walk route` restores the normal city map.

## v0.6 – Walk numbering cleanup
- Main Walk markers are explicitly the Walk steps: 1, 2, 3 ...
- Scenic Return markers restart as R1, R2, R3 ... in coral.
- The textual Scenic Return list uses the same R1/R2/... labels.
- Duplicate return markers at the outbound finish are suppressed.
- If a Walk returns to its original start (e.g. MUK), the return line reaches the start but does not cover marker 1 with a second marker.

## v0.10 – automatic Event Radar refresh
- `events.json` is refreshed automatically whenever the app returns to the foreground.
- Covers iOS/PWA `visibilitychange`, `pageshow`, and `focus` behavior with throttling.
- The event UI re-renders in place; no manual Safari reload or deleting/re-adding the Home Screen app is needed.
- Date-based expiry is recalculated on every foreground refresh, so yesterday's events disappear automatically.
- If the network refresh fails, the last successfully loaded Event Radar stays visible.

## v0.11 – Walk display fixes
- Fixes a CSS collision that accidentally hid Walk 03 `Hidden Lübeck`.
- The event stale-warning now uses a scoped selector instead of globally hiding every `.hidden` element.
- Restores the circular styling for numbered Walk markers on the map.
- Includes the v0.10 automatic Event Radar foreground refresh.

## v0.12 – Hidden Lübeck deepened
- Removes the generic `Gänge & Höfe` stop from the Hidden Lübeck walk.
- Integrates five selected Gänge/Höfe individually: Dunkelgrüner Gang, Füchtingshof, Glandorps Hof & Gang, Von-Höveln-Gang and Kalandsgang (Hartengrube).
- Reorders the walk for a coherent walking line through the city.
- Adds short historical/spatial explanations plus photo prompts to each of the five stops.
- Hidden Lübeck timing adjusted to 2½–3 hours.

## v0.13 – Hidden Lübeck route order
- Reorders Hidden Lübeck for the practical start at MUK / Media Docks.
- Stop 1 is now Dunkelgrüner Gang; Stop 2 is Heiligen-Geist-Hospital.
- Keeps the rest of the route as a coherent north/east/south loop back toward Obertrave.
- Corrects the Glandorps Hof map pin and renames the stop from `Glandorps Hof & Gang` to `Glandorps Hof`.

## v0.14 – Hidden Lübeck field test + Walk maps
- Hidden Lübeck: Hansemuseum/Burgkloster inserted between Dunkelgrüner Gang and Heiligen-Geist.
- Adds terrace-over-Trave / harbor view and Burgkloster photo prompt.
- Good Times upgraded from TO TRY to WE'D GO after real-world test.
- Every Walk detail gets an embedded numbered Leaflet route overview.
- Bottom `Open Map` launches a Google Maps walking route using the same mobile-safe key-point logic as the Antibes app.
- `App map` remains available for the full in-app route.
