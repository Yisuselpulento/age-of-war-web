# Age of War — Web · Guía del proyecto (CLAUDE.md)

Clon de *Age of War* en HTML5 Canvas + WebSocket. Este archivo es la fuente de verdad
de cómo funciona el juego **ahora** (tras el rediseño a sistema de mazos). Mantenerlo
actualizado en cada cambio relevante.

## Stack y arranque
- `server.js` — servidor Node: HTTP estático + WebSocket (relay de salas online). Puerto 3000.
- `game.js` — todo el juego (catálogo, motor de combate, IA, render, UI, deck builder).
- `index.html` / `style.css` — UI. Cache-busting: `?v=N` en `<link>` y `<script>` (subir N en cada cambio).
- `ASSET_V` en game.js versiona las imágenes (`assets/...`).
- Arranque local: `node server.js` → http://localhost:3000. El usuario juega y refresca con F5.

## Sistema de juego ACTUAL (rediseño "mazos")
La dinámica cambió: las unidades ya **no** son 3 tipos genéricos por edad. Ahora cada
unidad es una entidad individual.

### Unidades individuales — `UNIT_CATALOG` (game.js, arriba del todo)
Cada unidad tiene: `id, name, icon, spriteId, race, combatStyle (melee|ranged|tank),
movementType (ground|aerial), homeEra, desc, tags, counters, strongVs, weakVs, inmun,
cost, upgs[], availableEras[], specialAbility`.
- `UNIT_IDS` lista los ids; `UnitDB` es el "DB" de consulta (getByRace, getByRaceAndEra,
  getAvailableIdsByRace, getUnitForStyle, etc.).
- Una unidad solo puede asignarse al **mazo de su raza** y a las **eras de `availableEras`**.

### Escalado INDIVIDUAL de unidades
Cada unidad puede tener su propio bloque `stats` (valores base en era 0) + `growth`
(multiplicador por edad). `unitBase(uid, age, type)` resuelve los stats:
- Con `stats` propio → individual: `valor = round(base × growth^edad)` para cost/hp/dmg/g/xp;
  `spd`, `range` y `cd` (cadencia de ataque) son constantes del bloque.
- Sin `stats` → cae a `STATS[age][combatStyle]` (comportamiento de los humanos).
`computeStats(age, type, upg, special, uid)` y `trySpawn(side, type, spriteId, uid)` reciben
el `uid` para aplicar el escalado individual + las mejoras/nivel/especial por tipo encima.
**Al pedir nuevas unidades: definir siempre `stats` (era0) + `growth` balanceados.**
Las mejoras (dmg/hp/spd/armor), nivel y especial siguen siendo POR TIPO (melee/range/tank),
compartidos entre unidades del mismo tipo en el mazo.

Stats base era0 → era4 (con DMG_MULT 1.5 ya aplicado en dmg efectivo, Nv1 sin mejoras):
| Unidad | combatStyle | cost e0→e4 | hp e0→e4 | dmg e0→e4 | spd | cd |
|---|---|---|---|---|---|---|
| Larva (18) | melee | 30→251 | 80→750 | 15→132 | 38 | 0.60 | barata/frágil, enjambre |
| Zerling (16) | melee | 40→350 | 95→954 | 23→227 | 60 | 0.50 | rápida, poca vida |
| Insecto (19) | melee | 120→1125 | 260→2853 | 39→374 | 42 | 0.62 | acorazado, bruiser |
| Ultralisk (17) | melee | 150→1439 | 500→5249 | 51→512 | 30 | 0.75 | coloso lento, mucha vida |

### Razas — `RACES` / `RACE_NAMES`
`["humans","aliens","monsters","deaths","demons","magics"]`. Por ahora solo **humans**
(roster completo, 5 eras × melee/ranged/tank) y **monsters** (zerling, ultralisk) tienen
unidades. El resto están vacías = bloqueadas.

### Propiedad de razas (colección del jugador)
- `ownedRaces()` → razas con ≥1 unidad en catálogo **o** desbloqueadas en
  `localStorage["aow_owned_races"]` (array JSON, default `[]`).
- `isRaceOwned(race)`, y el selector del menú (`populateRaceSelect`) y el editor de mazo
  solo permiten razas poseídas (las bloqueadas salen con 🔒 y `disabled`).

### Mazos (deck builder)
- Persistencia: `localStorage["aow_deck"]` = `{ race: { eraIdx: [unitId,...] } }`.
  Raza activa preseleccionada: `localStorage["aow_active_race"]`.
- `defaultDeck()` rellena humans + monsters con todas sus unidades por era.
- `loadDeck()` valida estructura; `saveDeck()` persiste + guarda raza activa.
- Editor: tabs de raza (solo poseídas) → tabs de era → pool de disponibles + slots
  (máx `DECK_MAX = 6` por era). `addToDeck`/`removeFromDeck` validan raza y era.
- `loadActiveRace()` siempre devuelve una raza **poseída** (fallback a la primera).

### Gate para jugar
- `deckReady(race, deck)` → true si la raza está poseída y tiene ≥1 unidad en cada era
  donde la raza tenga unidades disponibles.
- `ensurePlayable()` → si el mazo activo no está listo, avisa y abre el editor. Se llama
  antes de **VS IA** y **VS Online** (la Zona de Test NO lo exige).
- Al entrar a combate se muestran las unidades del mazo de la raza activa y ambos
  jugadores empiezan en la **primera era** (`resetGame` → age 0). `buildShop` lee
  `currentDeck[playerRace][age]`.

## Motor de combate (SIN cambios por ahora)
- Coordenadas WORLD (1280×540, GROUND_Y=405, PLAYER_BASE_X=90, ENEMY_BASE_X=1190) + cámara.
- Loop de timestep fijo `FIXED_DT=1/60` con acumulador.
- Stats centralizados en `computeStats(age, type, upg, special)` (usado por Unit, cards e IA).
- Upgrades por tipo: melee[dmg,hp,spd] · range[dmg,range,spd] · tank[dmg,hp,spd,armor].
- Niveles de unidad `unitLevel()` = 1 + min(stats de nivel) + (special?1:0); máx Nv7.
  Bonus por nivel +5%/nivel (LEVEL_BONUS), excepto el stat `range`. Range tiene HP extra
  por nivel (escalado propio). Specials se desbloquean en Nv6.
- **Online host-authoritative**: el host simula y difunde estado completo ~30 Hz; el guest
  solo renderiza (espejado) y envía comandos. Evita desync.

## Modos
- **VS IA** (`startGame`, mode "ai"): IA por dificultad (easy/medium/hard/extreme) en
  tabla `DIFF`. Botón x2 velocidad, pausa, debug.
- **VS Online** (`startOnlineGame`, mode "online"): salas por código vía `server.js`.
- **Zona de Test** (`startTestGame`, mode "test"): controlas ambos bandos, panel enemigo
  arriba, +5000 oro a ambos, borrar unidades al click. No usa el gate de mazo.

## Assets / extracción de sprites
- `../age-of-war-src/extract_towers.py` extrae torres (frame 1 = reposo, no disparo).
  Edad future: turret_2/3 solo tienen 3 frames y siempre tienen glow de energía.
- Sprites de unidades en `assets/units/<age>/<spriteId>/`. Monsters: zerling, ultralisk.

## Git — flujo de 2 ramas
- `stable` (y `main`): el **juego que funciona**. Solo ediciones sutiles que lo mantengan jugable.
- `develop`: el **cambio drástico** (sistema de mazos). Aquí va el rediseño.
- Trabajar el rediseño en `develop`; portar a `stable` solo arreglos puntuales seguros.

## Verificación
- Sintaxis: `node --check game.js`.
- Funcional: Playwright MCP contra localhost:3000 (sims headless llamando `update(1/60)`
  en bucle; tests online con 2 pestañas). Screenshots remotos no accesibles en disco local.
- Subir `?v=N` en index.html tras cada cambio de game.js/style.css.

## Reglas del usuario
- Respuestas cortas, en español. No commitear salvo que lo pida explícitamente.
- No reescribir archivos completos (usar Edit con diff). Validar antes de decir "listo".
