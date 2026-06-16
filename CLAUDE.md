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
Cada unidad tiene: `id, name, icon, spriteId, race, combatStyle (melee|range — NO existe
"tank": lo tanque lo dan las stats base + escalado individual de cada unidad),
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
`computeStats(uid, age, uupg)` y `trySpawn(side, type, spriteId, uid)` reciben el `uid`.
**Al pedir nuevas unidades: definir siempre `stats` (era0) + `growth` balanceados.**

### Mejoras POR UNIDAD (sistema actual)
- `G[side].upg = { [uid]: {dmg, hp/range, spd} }` — cada unidad sube sus mejoras de forma
  independiente (global, no por edad). `getUpg(side, uid)` las crea lazy.
- Stats de mejora por unidad: range → `[dmg, range, spd]`; el resto → `[dmg, hp, spd]`
  (`unitUpgStats(uid)`). Máx `MAX_UPG`=5 por stat.
- **Nivel** `unitLevel(uupg, uid)` = 1 + el mínimo de las 3 mejoras. Subir las 3 a L1 → Nv2,
  etc. Máx `MAX_UNIT_LEVEL`=6. El bonus de nivel (`LEVEL_BONUS` +5%/nivel) afecta **solo
  vida y daño** (no spd ni rango).
- `upgradeCost(uid, stat, lvl)` = costo base era0 de la unidad × `UPG_COST_MULT[stat]` × (lvl+1).
- `tryUpgrade(side, uid, stat)` / `playerUpgrade(uid, stat)`. Panel: una fila por unidad del mazo.
- ELIMINADO del sistema viejo: upgrades por tipo `[age][type]`, especiales (SPECIAL/Nv6-Nv7),
  armadura del tank, resistencias. El cd de spawn sigue siendo por tipo (`cd[type]`).

Stats base era0 → era4 (con DMG_MULT 1.5 ya aplicado en dmg efectivo, Nv1 sin mejoras):
| Unidad | combatStyle | cost e0→e4 | hp e0→e4 | dmg e0→e4 | spd | cd |
|---|---|---|---|---|---|---|
| Larva (18) | melee | 30→251 | 80→750 | 15→132 | 38 | 0.60 | barata/frágil, enjambre |
| Zerling (16) | melee | 40→350 | 95→954 | 23→227 | 60 | 0.50 | rápida, poca vida |
| Insecto (19) | melee | 120→1125 | 260→2853 | 39→374 | 42 | 0.62 | acorazado, bruiser |
| Ultralisk (17) | melee | 150→1439 | 500→5249 | 51→512 | 30 | 0.75 | coloso lento, mucha vida |

### Razas — `RACES` / `RACE_NAMES`
`["humans","aliens","monsters","deaths","demons","magics"]`. Por ahora solo **humans**
(roster completo, 5 eras × 3 unidades melee/range) y **monsters** (zerling, ultralisk, larva,
insecto) tienen
> Nota: `spriteId` "tank" sigue existiendo como **sprite** (unidades anchas: Forzudo, Paladín,
> Blindado, Tanque, Mecha) y se usa para orientación (`FACE_RIGHT`) y espaciado (`half`). NO es
> un combatStyle. `UNIT_TYPES`/`TYPE_I`/`cd.tank` siguen con la clave "tank" solo como bucket de
> la serialización online (no tocar hasta retomar online).
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
- Stats centralizados en `computeStats(uid, age, uupg)` (usado por Unit, cards e IA).
- Mejoras y nivel: ver sección "Mejoras POR UNIDAD" arriba.
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
- Sprites de unidades en `assets/units/<age>/<spriteId>/<anim>/<i>.png`. Monsters: zerling, ultralisk, larva, insect.
- **Animaciones** (`ANIMS`): `idle, walk, attack, die, spawn`. `spawn` = nacimiento (la unidad
  emerge en su sitio sin moverse ni atacar; `Unit.spawning` se apaga al llegar al último frame).
  Conteos por unidad/era en `assets/manifest.json`. `ANIM_I` mapea anim→índice para el online (spawn=4).
- **Sprite sheets NUEVOS (irregulares):** las hojas mejoradas no usan grid uniforme. Extractor
  plantilla: `../age-of-war-src/extract_zerling.py` — detecta filas y frames por proyección de alfa,
  separa frames pegados (cajas anchas), recorta tight y alinea al suelo (bottom-center) en un lienzo
  uniforme. Correr con `--montage` para QA visual antes de desplegar. Orden de filas del zerling:
  idle(4), walk(9), attack(9), die(7), spawn(9). Tras regenerar sprites: subir `ASSET_V` y `manifest`.
- **Sonidos por unidad:** cada unidad define rutas en `UNIT_CATALOG[uid].sounds = {spawn, attack, die}`.
  `playUnitSound(uid, kind)` clona un Audio base por ruta (permite solape), respeta mute/volumen y
  throttlea 80ms. Estructura ordenada: `assets/audio/units/<spriteId>/<spawn|attack|die>.mp3`.
  Zerling tiene `spawn.mp3`. `ultralisk` sigue con sprite viejo (sin idle/die buenos → usa walk/idle como fallback).
- **Bases por raza**: `assets/bases/<age>/<archivo>.png`. Humanos = `base.png`; cada raza con base
  propia se mapea en `RACE_BASE` (monsters → `base_monsters.png`). `baseKey(age,race)` resuelve la
  ruta (fallback a humana). `sideRace(side)`: player = raza activa, enemy = humanos (IA) por ahora.
  La base evoluciona por era (un sprite por edad). Script: `extract_base_monster.py` (col0 aislada
  de `base_monster.png`, escala uniforme → la mayor a 250px como las humanas).

## Infección del terreno (wallpaper por raza)
- Cada raza tiene su wallpaper (`WALLPAPER_MAP`: humans/monsters). El terreno se "infecta"
  desde cada base hacia el centro según avanzan las unidades.
- `infectProg = {player, enemy}` (0..1): persigue LENTO (`INFECT_SPEED`) al frente de unidades
  (`calcInfection`) y **nunca retrocede** (terreno infectado permanente). `updateInfection(dt)`
  se llama en `update`; `resetInfection()` en `resetGame`.
- Render: `drawInfection()` usa un canvas offscreen (`_infCv`) — dibuja el wallpaper de raza,
  lo recorta con `destination-in` por un path de **borde irregular animado** (`infectNoise`,
  suma de senos) + degradado en el filo (`INFECT_FADE`/`INFECT_AMP`). Da un borde orgánico, no recto.

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
