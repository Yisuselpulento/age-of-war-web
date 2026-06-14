# Age of War — Web (Game Dev)

## Stack
- **Runtime:** HTML5 Canvas 2D + JavaScript vanilla (ES6+)
- **Sin dependencias externas**
- **Assets:** PNG sprites por edad/tipo/animación en `assets/`

## Estructura
```
age-of-war-web/
├── index.html          # HTML + HUD
├── style.css           # Estilos del HUD
├── game.js             # Lógica completa del juego (~1024 líneas)
├── assets/
│   ├── manifest.json   # Mapa de frames por edad/tipo/animación
│   ├── bg/             # wallpaper.png + background.png (fallback)
│   ├── bases/          # Sprites de bases por edad
│   └── units/          # Sprites: {age}/{type}/{anim}/{n}.png
└── AGENTS.md
```

## Mecánicas
- **5 edades:** Cave → Medival → Knight → Miltary → Future
- **3 tipos de unidad:** melee, range, tank
- **Mejoras separadas por stat:** ⚔Daño, ❤Vida, ⚡Vel. ataque (5 niveles cada uno)
- **Velocidad de ataque** derivada de los sprites: `frames_attack / 14fps` (~0.57s base)
- **Aldeanos:** generan oro/s, bono oro/muerte por nivel, upgradables
- **Torres defensivas:** 4 slots, 4 niveles, se pueden vender al 50%
- **Economía:** oro pasivo + aldeanos + kills
- **Ataque especial:** consume 300 XP, daño a todas unidades enemigas
- **IA:** 3 dificultades (easy/medium/hard), mejoras aleatorias por stat

## Arquitectura (game.js)
- `Unit`, `Projectile`, `FloatText` — clases de entidades
- `G` — estado global (player, enemy, units[], projectiles[], floats[])
- `STATS[age][type]` — tabla de stats base (sin `cd`, se deriva de sprites)
- `getBaseCD(age, type)` — cooldown desde `frames_attack / 14`
- `upgradeCost(age, type, stat, lvl)` — costo por stat individual
- Update loop: `update(dt)` → `runAI(dt)` → `stepSide()` → `render()` → `syncUI()`

## UPGRADES (nuevo sistema)
```javascript
// Antes (1 upgrade por tipo):
upg: { melee: 0, range: 0, tank: 0 }

// Ahora (3 stats por tipo):
upg: {
  melee: { dmg: 0, hp: 0, spd: 0 },
  range: { dmg: 0, hp: 0, spd: 0 },
  tank:  { dmg: 0, hp: 0, spd: 0 }
}
```

## Convenciones
- `"use strict"` al inicio
- Constantes UPPER_SNAKE_CASE
- Funciones camelCase
- Clases PascalCase
- Sin dependencias externas
- Stats en tablas planas, no objetos anidados
- Side effects mutan `G` directamente
- UI se sincroniza desde game loop (`syncUI()`)

## REGLAS PARA NUEVAS FEATURES
1. Stats primero — tabla `STATS`, no hardcodees
2. Balance en constantes arriba del archivo
3. IA en `runAI()` usando `DIFF[difficulty]`
4. No romper independencia update/render
5. Nuevos sprites → registrar en `manifest.json` + subir `ASSET_V`
6. Respetar `FACE_RIGHT` para flip de sprites

## Keyboard shortcuts
| Tecla | Acción |
|-------|--------|
| 1/2/3 | Spawn melee/range/tank |
| E | Evolucionar edad |
| Space | Ataque especial |
| Q/A/Z | Melee: dmg/hp/spd |
| W/S/X | Range: dmg/hp/spd |
| R/F/C | Tank: dmg/hp/spd |
| V | Comprar aldeano |
| B | Mejorar aldeanos |

## Comandos
```bash
npx serve . --cors -p 3000
```
