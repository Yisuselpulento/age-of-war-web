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
- **Combate (motor, `stepSide`):** todos apuntan al enemigo del FRENTE (`enemyList[0]`); los
  aliados se traspasan (no se bloquean) → el enjambre se apila contra el frente y ataca a la vez.
  El **alcance melee es relativo al BORDE** del objetivo: `reach = u.range + frontEnemy.half`
  (los `range` no suman half). Sin esto, un melee de rango corto NO podía tocar unidades anchas
  (sprite "tank", `half=46` → hueco de colisión ~74) y el tanque quedaba imbatible para enjambres.
  Al balancear un tanque vs enjambre: un tanque single-target SIEMPRE pierde a oro igual contra un
  enjambre (no tiene AoE); su valor es de frontline/esponja de vida, no de combate puro 1-tipo.

### Escalado INDIVIDUAL de unidades
Cada unidad puede tener su propio bloque `stats` (valores base en era 0) + `growth`
(multiplicador por edad). `unitBase(uid, age, type)` resuelve los stats:
- Con `stats` propio → individual: `valor = round(base × growth^edad)` para cost/hp/dmg/g/xp;
  `spd`, `range` y `cd` (cadencia de ataque) son constantes del bloque.
- Sin `stats` → cae a `STATS[age][combatStyle]` (comportamiento de los humanos).
`computeStats(uid, age, side)` (recibe el BANDO para aplicar su tech) y
`trySpawn(side, type, spriteId, uid)` reciben el `uid`.
**Al pedir nuevas unidades: definir siempre `stats` (era0) balanceados.** (`growth` ya no se usa.)

### Mejoras: DOS sistemas que COEXISTEN — raza (`RACE_TECH`) + unidad (`UNIT_UPG`)
Ambos bonos se **hornean** al nacer (no afectan a las ya vivas) y se SUMAN en `computeStats`
vía `bon(stat) = techBonus(...) + unitUpgBonus(...)`. El jugador decide entre invertir en
el árbol de raza (afecta categorías enteras) o en mejoras propias de una unidad.

### Responsive / móvil
- **Escritorio:** layout normal. **Móvil vertical (`@media max-width:767px`):** HUD en columna, cards con scroll-x.
- **Móvil HORIZONTAL (landscape):** `@media (orientation: landscape) and (max-height: 500px)` — un teléfono
  acostado es ancho (>767px) pero bajo (~390px), así que la query de ancho NO aplica; esta sí. HUD en
  fila compacta (cards primero vía `order`, luego torres/economía/mejoras), con scroll-x si no cabe.
  Todo (cards, torres, aldeano, mejoras unidad+raza, evolucionar, dificultad, config) es tocable —
  verificado con `test-mobile.mjs` (hit-test `elementFromPoint` + tap real a 844×390).

**A) Árbol de raza (`RACE_TECH`)** — techs por era, bono % a categorías de unidades.
- `RACE_TECH[race] = [ {id,name,era,stat,per,maxLvl,baseCost, style?|move?} ]`. `_T(...)` declara cada uno.
  `stat` ∈ dmg/hp/atkspd(↓cd)/range/movespd. `scopeLabel` = melee|range|aerial|ground|all.
- Estado por bando: `G[side].tech = { [techId]: lvl }`. `availableTechs(race, age)` = era ≤ edad actual.
- `techBonus(side, uid, stat)` suma `per*lvl` de los techs que casan (`techMatches`) → usado en `computeStats`.
- `tryTech(side, techId)` / `playerTech(techId)`; `techCost(t, lvl) = baseCost*(1+lvl*0.8)`.
- UI: panel **`#research-section` a la DERECHA del HUD** (`renderResearch`), no bajo las cards.
  Muestra los techs desbloqueados + cuántos quedan en la siguiente era. La IA investiga en `runAI`.
- Serialización online: `G[side].tech` va en el snapshot (`u:` del sideSnap). cmd guest `tech`.

**B) Mejoras propias por unidad (`UNIT_UPG`)** — cada unidad mejora SUS stats, solo a ella.
- `UNIT_UPG[uid] = [ {key,stat,label,era,maxLvl,baseCost,per} ]`. Se **autogenera** en `buildUnitUpg()`
  desde `upgStats` de la unidad (mapeo `spd→atkspd`), escalonando las eras a partir de `homeEra+1`
  hasta era 4 (ej. zerling: dmg en era II, atkspd en era V). `per` un poco mayor que el de raza
  (`UNIT_UPG_PER`). maxLvl por rareza (legendaria: +1 en su stat primaria). baseCost ≈ coste*0.55.
- Estado: `G[side].uupg = { [uid]: { [upgKey]: lvl } }`. `unitUpgBonus(side,uid,stat)`,
  `availableUnitUpgs(uid,age)`, `unitUpgCost(up,lvl)=baseCost*(1+lvl*0.85)`, `tryUnitUpg`/`playerUnitUpg`.
- **Nivel de unidad = `unitLevel(side,uid)` = 1 + suma de niveles de SUS mejoras** (no las de raza).
  `unitMaxLevel(uid)` = tope. Se muestra en la card (`.lvl`) y en tooltips.
- UI: en el MISMO `#research-section`, sección "⚡ Mejoras de unidad" agrupada por card del mazo
  actual (`shopCards`), bajo el árbol de raza. La IA invierte en `runAI` (econ≥0.6).
- Online: `G[side].uupg` va en el snapshot (`uu:` del sideSnap). cmd guest `uupg` (`{uid,upKey}`).
- Cámara/zoom: nivel base (`zoomLevel=1`, `ZOOM_MIN=1`) ajusta el **ancho completo** del mundo
  (`camScale=BW/WORLD_W`) → ambas bases visibles desde el inicio en cualquier resolución. El exceso
  vertical (16:9) se ancla con el suelo abajo y el cielo se rellena estirando la fila superior del
  wallpaper (`drawBackground`) — nunca negro. Rueda = zoom anclado al cursor (ambos ejes); arrastre
  con mouse/touch desplaza **X e Y** (`camPointerMove`). `clampCam` ancla suelo si `viewH>=WORLD_H`.

Stats base era0 → era4 (con DMG_MULT 1.5 ya aplicado en dmg efectivo, Nv1 sin mejoras):
| Unidad | combatStyle | cost e0→e4 | hp e0→e4 | dmg e0→e4 | spd | cd |
|---|---|---|---|---|---|---|
| Larva (18) | melee | 30→251 | 80→750 | 15→132 | 38 | 0.60 | barata/frágil, enjambre |
| Zerling (16) | melee | 40→350 | 95→954 | 23→227 | 60 | 0.50 | rápida, poca vida |
| Insecto (19) | melee | 120→1125 | 260→2853 | 39→374 | 42 | 0.62 | acorazado, bruiser |
| Ultralisk (17) | melee | 150→1439 | 500→5249 | 51→512 | 30 | 0.75 | coloso lento, mucha vida |

### Razas — `RACES` / `RACE_NAMES`
`["humans","aliens","monsters","deaths","demons","magics"]`. **Las 6 razas tienen unidades.**
- **humans** (ids 1-15): roster con sprites, 5 eras × melee/range/tank.
- **monsters** (16-24): con sprites (zerling, ultralisk, larva, insecto, valkir, wormmint, xerath, kurkor, hydralisk).
- **aliens** (25-34, estilo Protoss), **deaths** (35-44, no-muertos), **demons** (45-54, agresivos),
  **magics** (55-64, defensivos): 10 unidades c/u, **SIN sprite sheet** → se dibujan con render
  procedural animado (`Unit.drawProc()` + `PROC_THEME[race]`). Cada def tiene `psize` (escala del placeholder).
> Nota: `spriteId` "tank" sigue existiendo como **sprite** (unidades anchas: Forzudo, Paladín,
> Blindado, Tanque, Mecha) y se usa para orientación (`FACE_RIGHT`) y espaciado (`half`). NO es
> un combatStyle. `UNIT_TYPES`/`TYPE_I`/`cd.tank` siguen con la clave "tank" solo como bucket de
> la serialización online (no tocar hasta retomar online).

### Habilidades (`specialAbility` + motor en `updateAbilities`/`killUnit`/`dealAttack`)
Tipos implementados (cada uno con su rama):
- `transform` `{after, into:[ids]}` — larva muta tras N s (la unidad desaparece, nace la nueva).
- `mindControl` `{cd}` — Wormmint controla un enemigo (soporte: se queda fijo tras el 1er uso).
- `summon` `{cd, into, count}` — invoca minions detrás del caster (deaths: esqueletos).
- `reanimate` `{into, count}` — pasiva on-death (en `killUnit`): al morir levanta minions.
- `heal` `{cd, amount, range}` — cura al aliado más herido en rango.
- `bolt` `{cd, dmg, range}` — hostigamiento: daño directo a un enemigo en rango (magics/aliens).
- `frenzy` `{cd, dur, dmgMul, spdMul}` — buff temporal de dmg/spd sobre sí mismo (demons). Usa `baseDmg/baseSpd/buffT`.
- `lifesteal` `{frac}` — pasiva en `dealAttack`: el atacante se cura una fracción del daño (demons).

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

## Torres (sistema de cards por `tid` — TOWER_CATALOG)
Las torres son cards coleccionables (como las unidades), identificadas por `tid`:
- **Existentes (humanas) tid 201-215**: `tid = 200 + age*3 + tier`. Reutilizan sprites/proyectiles
  por era/tier (`spriteAge`, `tier`). Rareza por tier: Ligera=poco común, Pesada=rara, Asedio=épica.
  Desbloqueadas de arranque (piso de la colección) — cualquier raza puede construirlas.
- **Nuevas tid 301+**: procedurales (`proc:true`, `drawProcTower`), temáticas por raza
  (`PROC_THEME`), con su era/rareza/stats propios. Incl. legendarias (Aguja Apocalíptica, Faro Celestial).
- Cada torre colocada es `{tid, cd, angle, fireAnim, animFrame, animTimer}`. `towerUpg = {dmg:{[tid]:lvl}, spd:{...}}`.
- Funciones: `towerStats(tid,ud,us)`, `towerBuyCost(tid)`, `towerUpgCost(tid,kind,lvl)`, `towerSellValue(tid,ud,us)`,
  `getTowerUpg(side,tid,kind)`, `ownedTowersForEra(age)` (las que el jugador posee y puede construir en esa era).
- La tienda de torres en partida (`buildShop` → tower-section) muestra las torres **poseídas** disponibles
  en la era actual; se reconstruye al cambiar de era. La IA (humanos) usa `towerTidFor(age,tier)`.
- En sobres: las torres salen **mezcladas en el sobre de cada raza** (`raceCardPool` = unidades + torres de la raza).
  En la colección/reveal se distinguen por `isTowerId(id)` (tid ≥ 200) y helpers `cardName/cardThumb/cardRarity`.

## Bases por raza
- humans/monsters usan sprites (`RACE_BASE`). aliens/deaths/demons/magics → **base procedural**
  (`PROC_BASE_RACES` + `drawProcBase`), temática por raza y que se elabora con la era (más detalle/altura).

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
  - **Raza de la IA elegible** en el menú (`#ai-race-select` → `aiRace`, persiste en `aow_ai_race`).
    `resetGame` crea `G.enemy = freshSide(200, aiRace)`. La IA funciona con cualquier raza:
    `aiStyleAvailable(race,style,age)` (por raza, no global) y `aiPickUnit(race,age,style)`
    (elige unidad de combate, evita support/dmg 0 y los transform/filler como la larva).
    Investiga su árbol tech y construye torres humanas (`towerTidFor`) según `DIFF`. Online fuerza enemy=humanos.
  - **Identidad de razas:** monsters = ENJAMBRE (unidades baratas y débiles por unidad, p.ej. Zerling
    coste 38, gana por cantidad/escala, no por dmg). Al balancear monsters: bajar coste, no subir dmg.
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
