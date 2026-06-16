"use strict";
/* ============================================================
   Age of War — versión web (HTML5 Canvas)
   ============================================================ */

// Nota: índices 1 y 2 intercambiados (la 2ª edad usa sprites de caballero y la 3ª
// los medievales), manteniendo la progresión de stats por índice.
const AGES = ["cave", "knight", "medival", "miltary", "future"];
const AGE_NAMES = ["Era I", "Era II", "Era III", "Era IV", "Era V"];
const UNIT_TYPES = ["melee", "range", "tank"];
const UNIT_NAMES = {
  1:"Troglodita",2:"Cazador",3:"Forzudo",
  4:"Caballero",5:"Arquero",6:"Paladín",
  7:"Espadachín",8:"Ballestero",9:"Blindado",
  10:"Soldado",11:"Francotirador",12:"Tanque",
  13:"Comando",14:"Centinela",15:"Mecha",
  16:"Zerling",17:"Ultralisk",
};
const UNIT_IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];

const UNIT_CATALOG = {
  // ── Era 0 (Cave) ──────────────────────────────────────
  1: { id:1, name:"Troglodita", icon:"⚔️",  spriteId:"melee",  race:"humans",   combatStyle:"melee",  movementType:"ground", homeEra:0,
    desc:"Versátil luchador cuerpo a cuerpo. Efectivo contra arqueros.",
    tags:["melee","ground"], counters:'Fuerte vs <b>Ranged</b> · Débil vs <b>Aéreo</b>',
    strongVs:["ranged"], weakVs:["aerial"], inmun:[], cost:50, upgs:["dmg","hp","spd"],
    availableEras:[0], specialAbility:null },
  2: { id:2, name:"Cazador", icon:"🏹",  spriteId:"range",  race:"humans",   combatStyle:"range", movementType:"ground", homeEra:0,
    desc:"Ataca desde lejos. Ideal contra unidades aéreas.",
    tags:["ranged","ground"], counters:'Fuerte vs <b>Aéreo</b> · Débil vs <b>Melee</b>',
    strongVs:["aerial"], weakVs:["melee"], inmun:[], cost:85, upgs:["dmg","range","spd"],
    availableEras:[0], specialAbility:null },
  3: { id:3, name:"Forzudo", icon:"🛡️", spriteId:"tank",   race:"humans",   combatStyle:"tank",   movementType:"ground", homeEra:0,
    desc:"Alta resistencia y blindaje. Absorbe y retiene al enemigo.",
    tags:["tank","ground"], counters:'Resiste <b>Ranged</b> · Débil vs <b>Melee</b>',
    strongVs:["ranged"], weakVs:["melee"], inmun:[], cost:200, upgs:["dmg","hp","spd","armor"],
    availableEras:[0], specialAbility:null },

  // ── Era 1 (Knight) ─────────────────────────────────────
  4: { id:4, name:"Caballero", icon:"⚔️", spriteId:"melee", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:1,
    desc:"Guerrero montado con armadura de placas. Potencia en la carga.",
    tags:["melee","ground"], counters:'Fuerte vs <b>Ranged</b> · Débil vs <b>Aéreo</b>',
    strongVs:["ranged"], weakVs:["aerial"], inmun:[], cost:110, upgs:["dmg","hp","spd"],
    availableEras:[1], specialAbility:null },
  5: { id:5, name:"Arquero", icon:"🏹", spriteId:"range", race:"humans", combatStyle:"range", movementType:"ground", homeEra:1,
    desc:"Arquero entrenado con arco compuesto. Alcance superior.",
    tags:["ranged","ground"], counters:'Fuerte vs <b>Aéreo</b> · Débil vs <b>Melee</b>',
    strongVs:["aerial"], weakVs:["melee"], inmun:[], cost:170, upgs:["dmg","range","spd"],
    availableEras:[1], specialAbility:null },
  6: { id:6, name:"Paladín", icon:"🛡️", spriteId:"tank", race:"humans", combatStyle:"tank", movementType:"ground", homeEra:1,
    desc:"Campeón sagrado con escudo y fe inquebrantable.",
    tags:["tank","ground"], counters:'Resiste <b>Ranged</b> · Débil vs <b>Melee</b>',
    strongVs:["ranged"], weakVs:["melee"], inmun:[], cost:400, upgs:["dmg","hp","spd","armor"],
    availableEras:[1], specialAbility:null },

  // ── Era 2 (Medival) ────────────────────────────────────
  7:  { id:7,  name:"Espadachín", icon:"⚔️", spriteId:"melee", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:2,
    desc:"Experto en esgrima con espada larga. Golpes precisos y letales.",
    tags:["melee","ground"], counters:'Fuerte vs <b>Ranged</b> · Débil vs <b>Aéreo</b>',
    strongVs:["ranged"], weakVs:["aerial"], inmun:[], cost:220, upgs:["dmg","hp","spd"],
    availableEras:[2], specialAbility:null },
  8:  { id:8,  name:"Ballestero", icon:"🏹", spriteId:"range", race:"humans", combatStyle:"range", movementType:"ground", homeEra:2,
    desc:"Ballesta de repetición. Perfora blindajes con facilidad.",
    tags:["ranged","ground"], counters:'Fuerte vs <b>Aéreo</b> · Débil vs <b>Melee</b>',
    strongVs:["aerial"], weakVs:["melee"], inmun:[], cost:320, upgs:["dmg","range","spd"],
    availableEras:[2], specialAbility:null },
  9:  { id:9,  name:"Blindado", icon:"🛡️", spriteId:"tank", race:"humans", combatStyle:"tank", movementType:"ground", homeEra:2,
    desc:"Armadura de placas completa. Muro impenetrable.",
    tags:["tank","ground"], counters:'Resiste <b>Ranged</b> · Débil vs <b>Melee</b>',
    strongVs:["ranged"], weakVs:["melee"], inmun:[], cost:700, upgs:["dmg","hp","spd","armor"],
    availableEras:[2], specialAbility:null },

  // ── Era 3 (Miltary) ────────────────────────────────────
  10: { id:10, name:"Soldado", icon:"⚔️", spriteId:"melee", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:3,
    desc:"Infantería moderna con fusil de asalto y granadas.",
    tags:["melee","ground"], counters:'Fuerte vs <b>Ranged</b> · Débil vs <b>Aéreo</b>',
    strongVs:["ranged"], weakVs:["aerial"], inmun:[], cost:420, upgs:["dmg","hp","spd"],
    availableEras:[3], specialAbility:null },
  11: { id:11, name:"Francotirador", icon:"🎯", spriteId:"range", race:"humans", combatStyle:"range", movementType:"ground", homeEra:3,
    desc:"Rifle de precisión de largo alcance. Elimina objetivos clave.",
    tags:["ranged","ground"], counters:'Fuerte vs <b>Aéreo</b> · Débil vs <b>Melee</b>',
    strongVs:["aerial"], weakVs:["melee"], inmun:[], cost:600, upgs:["dmg","range","spd"],
    availableEras:[3], specialAbility:null },
  12: { id:12, name:"Tanque", icon:"🛡️", spriteId:"tank", race:"humans", combatStyle:"tank", movementType:"ground", homeEra:3,
    desc:"Blindaje pesado con cañón rotatorio. Máquina de guerra.",
    tags:["tank","ground"], counters:'Resiste <b>Ranged</b> · Débil vs <b>Melee</b>',
    strongVs:["ranged"], weakVs:["melee"], inmun:[], cost:1300, upgs:["dmg","hp","spd","armor"],
    availableEras:[3], specialAbility:null },

  // ── Era 4 (Future) ─────────────────────────────────────
  13: { id:13, name:"Comando", icon:"⚔️", spriteId:"melee", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:4,
    desc:"Operaciones especiales con exoesqueleto potenciado.",
    tags:["melee","ground"], counters:'Fuerte vs <b>Ranged</b> · Débil vs <b>Aéreo</b>',
    strongVs:["ranged"], weakVs:["aerial"], inmun:[], cost:800, upgs:["dmg","hp","spd"],
    availableEras:[4], specialAbility:null },
  14: { id:14, name:"Centinela", icon:"🎯", spriteId:"range", race:"humans", combatStyle:"range", movementType:"ground", homeEra:4,
    desc:"Torreta automatizada con sistema de puntería láser.",
    tags:["ranged","ground"], counters:'Fuerte vs <b>Aéreo</b> · Débil vs <b>Melee</b>',
    strongVs:["aerial"], weakVs:["melee"], inmun:[], cost:1150, upgs:["dmg","range","spd"],
    availableEras:[4], specialAbility:null },
  15: { id:15, name:"Mecha", icon:"🛡️", spriteId:"tank", race:"humans", combatStyle:"tank", movementType:"ground", homeEra:4,
    desc:"Robot de combate gigante con blindaje de aleación.",
    tags:["tank","ground"], counters:'Resiste <b>Ranged</b> · Débil vs <b>Melee</b>',
    strongVs:["ranged"], weakVs:["melee"], inmun:[], cost:2400, upgs:["dmg","hp","spd","armor"],
    availableEras:[4], specialAbility:null },

  // ── Monsters ──────────────────────────────────────────
   16: { id:16, name:"Zerling", icon:"👾", spriteId:"zerling", race:"monsters", combatStyle:"melee", movementType:"ground", homeEra:0,
     desc:"Criatura rápida que ataca en enjambre. Devastadora en grupo.",
     tags:["melee","ground"], counters:'Poca vida · Débil vs <b>Ranged</b> y <b>Aéreo</b>',
     strongVs:[], weakVs:["ranged","aerial"], inmun:[], cost:40, upgs:["dmg","hp","spd"],
     availableEras:[0,1,2,3,4], specialAbility:null },
   17: { id:17, name:"Ultralisk", icon:"🦂", spriteId:"ultralisk", race:"monsters", combatStyle:"melee", movementType:"ground", homeEra:0,
     desc:"Coloso blindado que arrasa líneas enemigas. Resistente y letal.",
     tags:["melee","ground"], counters:'Alta vida · Débil vs <b>Ranged</b>',
     strongVs:["aerial"], weakVs:["ranged"], inmun:[], cost:150, upgs:["dmg","hp","spd","armor"],
     availableEras:[0,1,2,3,4], specialAbility:null },
};

// Razas disponibles (cada unidad pertenece a una raza)
const RACES = ["humans", "aliens", "monsters", "deaths", "demons", "magics"];
const RACE_NAMES = {
  humans: "Humanos", aliens: "Alienígenas", monsters: "Monstruos",
  deaths: "Muertes", demons: "Demonios", magics: "Mágicos",
};

// Simulación de base de datos de unidades
const UnitDB = {
  getAll() { return UNIT_IDS.map(id => UNIT_CATALOG[id]); },
  getById(id) { return UNIT_CATALOG[id] || null; },
  getByEra(eraIdx) { return UNIT_IDS.filter(id => UNIT_CATALOG[id].availableEras.includes(eraIdx)).map(id => UNIT_CATALOG[id]); },
  getByTag(tag) { return UNIT_IDS.filter(id => UNIT_CATALOG[id].tags.includes(tag)).map(id => UNIT_CATALOG[id]); },
  getByRace(race) { return UNIT_IDS.filter(id => UNIT_CATALOG[id].race === race).map(id => UNIT_CATALOG[id]); },
  getByRaceAndEra(race, eraIdx) {
    return UNIT_IDS.filter(id => UNIT_CATALOG[id].race === race && UNIT_CATALOG[id].availableEras.includes(eraIdx)).map(id => UNIT_CATALOG[id]);
  },
  isAvailableInEra(id, eraIdx) {
    const u = UNIT_CATALOG[id];
    return u ? u.availableEras.includes(eraIdx) : false;
  },
  getAvailableIds(eraIdx) {
    return UNIT_IDS.filter(id => UNIT_CATALOG[id].availableEras.includes(eraIdx));
  },
  getAvailableIdsByRace(race, eraIdx) {
    return UNIT_IDS.filter(id => UNIT_CATALOG[id].race === race && UNIT_CATALOG[id].availableEras.includes(eraIdx));
  },
  // Para el motor de juego: ver si un combatStyle está disponible en una era
  isStyleAvailable(style, eraIdx) {
    return UNIT_IDS.some(id => UNIT_CATALOG[id].combatStyle === style && UNIT_CATALOG[id].availableEras.includes(eraIdx));
  },
  // Buscar la unidad específica para una raza+era+combatStyle
  getUnitForStyle(race, era, style) {
    for (const id of UNIT_IDS) {
      const u = UNIT_CATALOG[id];
      if (u.race === race && u.availableEras.includes(era) && u.combatStyle === style) return u;
    }
    return null;
  },
};
const ANIMS = ["walk", "attack", "die", "idle"];

// Orientación nativa de cada sprite (true = mira a la derecha)
const FACE_RIGHT = {
  cave:    { melee: true,  range: true,  tank: true  },
  medival: { melee: true,  range: true,  tank: true  },
  knight:  { melee: true,  range: true,  tank: true  },
  miltary: { melee: true,  range: true,  tank: false },
  future:  { melee: true,  range: true,  tank: true  },
};

// Estadísticas por edad y tipo de unidad (cd se deriva de sprites)
const STATS = [
  { // 0 cave
    melee: { cost: 50,  hp: 120,  dmg: 18,  spd: 45, range: 60,  g: 30,  xp: 25 },
    range: { cost: 85,  hp: 70,   dmg: 14,  spd: 40, range: 240, g: 45,  xp: 35 },
    tank:  { cost: 200, hp: 400,  dmg: 30,  spd: 30, range: 75,  g: 90,  xp: 70 },
  },
  { // 1 medival
    melee: { cost: 110, hp: 230,  dmg: 30,  spd: 47, range: 60,  g: 55,  xp: 45 },
    range: { cost: 170, hp: 130,  dmg: 24,  spd: 42, range: 250, g: 80,  xp: 60 },
    tank:  { cost: 400, hp: 750,  dmg: 52,  spd: 32, range: 75,  g: 160, xp: 120 },
  },
  { // 2 knight
    melee: { cost: 220, hp: 430,  dmg: 52,  spd: 50, range: 65,  g: 100, xp: 80 },
    range: { cost: 320, hp: 240,  dmg: 42,  spd: 44, range: 260, g: 140, xp: 110 },
    tank:  { cost: 700, hp: 1350, dmg: 90,  spd: 34, range: 80,  g: 280, xp: 210 },
  },
  { // 3 miltary
    melee: { cost: 420,  hp: 780,  dmg: 95,  spd: 55, range: 70,  g: 180, xp: 150 },
    range: { cost: 600,  hp: 430,  dmg: 78,  spd: 48, range: 285, g: 260, xp: 200 },
    tank:  { cost: 1300, hp: 2400, dmg: 160, spd: 36, range: 210, g: 520, xp: 380 },
  },
  { // 4 future
    melee: { cost: 800,  hp: 1400, dmg: 175, spd: 60, range: 75,  g: 340, xp: 280 },
    range: { cost: 1150, hp: 780,  dmg: 145, spd: 52, range: 305, g: 480, xp: 360 },
    tank:  { cost: 2400, hp: 4400, dmg: 300, spd: 40, range: 250, g: 950, xp: 700 },
  },
];

let paused = false;
const EVOLVE_COST = [400, 1000, 2000, 3500]; // xp para pasar de edad i a i+1
const BASE_HP = 2000;
const BASE_DMG_MULT = 2.5; // las unidades pegan más fuerte a la base
const SPEED_MULT = 1.5; // multiplicador global de velocidad de unidades
const DMG_MULT = 1.5;   // multiplicador global de daño (ritmo de combate)
const PASSIVE_GOLD = 14;       // oro/seg pasivo
const AGE_GOLD = 6;            // oro/seg extra por cada edad alcanzada
const SPAWN_CD = 0.8;          // s entre spawns
const PLAYER_PASSIVE_XP = 5;   // xp/seg pasivo para el jugador (evoluciona por tiempo)
const AI_PASSIVE_XP = 6;        // xp/seg pasivo para la IA

// ---- Config multijugador online ----------------------------------------
// WS_HOST: null → auto (usa location.host, funciona en localhost:3000)
//          o pon la URL de tu servidor WebSocket, ej:
//          "wss://age-of-war-server.onrender.com"
const WS_HOST = "wss://age-of-war-web.onrender.com";

function wsUrl() {
  // en desarrollo local, conectar al server local (no al de producción)
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    return proto + "//" + location.host;
  }
  if (WS_HOST) return WS_HOST;
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  return proto + "//" + location.host;
}

// ---- Conexión multijugador -------------------------------------------
let ws = null; // WebSocket

// ── Modelo HOST-AUTORITATIVO ──────────────────────────────────────────
// El host simula TODO el juego y emite el estado completo (~30 Hz). El guest
// no simula: solo renderiza el estado recibido (con coordenadas espejadas) y
// envía sus inputs como comandos. Esto elimina el desync por completo.
let isSyncHost = false; // quien recibe game_start con side:"player" es el host
function isGuest() { return G.mode === "online" && !isSyncHost; }

function sendCmd(cmd) {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: "cmd", cmd }));
}

// El host aplica los comandos del guest sobre el lado "enemy", con las mismas
// puertas de oro/cooldown que el jugador local (anti-trampa + consistencia).
function handleGuestCmd(c) {
  switch (c.type) {
    case "spawn":       trySpawn("enemy", c.unitType); break;
    case "upgrade":     tryUpgrade("enemy", c.unitType, c.stat); break;
    case "evolve":      tryEvolve("enemy"); break;
    case "special":     tryBuySpecial("enemy", c.unitType); break;
    case "villager":    tryVillager("enemy"); break;
    case "villagerupg": tryVillagerUpgrade("enemy"); break;
    case "buy_slot":    tryBuySlot("enemy"); break;
    case "tower_buy":   tryBuyTower("enemy", c.slot, c.towerType); break;
    case "tower_upg":   tryUpgradeTower("enemy", c.slot, c.kind); break;
    case "tower_sell":  trySellTower("enemy", c.slot); break;
  }
}

// ── Serialización de estado (host -> guest) ───────────────────────────
const ANIM_I = { walk: 0, attack: 1, die: 2, idle: 3 };
const TYPE_I = { melee: 0, range: 1, tank: 2 };

function sideSnap(s) {
  return {
    g: Math.round(s.gold), x: Math.round(s.xp), a: s.age, h: Math.round(s.baseHp),
    c: [+s.cd.melee.toFixed(2), +s.cd.range.toFixed(2), +s.cd.tank.toFixed(2)],
    u: s.upg, t: s.towerUpg, v: s.villagers, vl: s.villagerLvl, sl: s.slots,
    sp: [s.specials.melee ? 1 : 0, s.specials.range ? 1 : 0, s.specials.tank ? 1 : 0],
    tw: s.towers.map((t) => t ? [t.type, +(t.angle || 0).toFixed(2), +(t.fireAnim || 0).toFixed(2), t.animFrame | 0] : 0),
  };
}
function serializeState() {
  const u = [];
  for (const un of G.units) {
    u.push([
      un.side === "player" ? 0 : 1, un.age, TYPE_I[un.type],
      Math.round(un.x), Math.round(un.y), Math.round(un.hp), Math.round(un.maxHp),
      ANIM_I[un.anim] || 0, un.frame | 0, un.dying ? 1 : 0, +un.dieTimer.toFixed(2), +un.fade.toFixed(2),
      un.lvl || 1, Math.round(un.dmg || 0), +(un.cd || 0).toFixed(2),
    ]);
  }
  const pr = [];
  for (const p of G.projectiles) {
    pr.push([
      p.side === "player" ? 0 : 1, Math.round(p.x), Math.round(p.y),
      Math.round(p.target.x), Math.round(p.target.y), p.texKey || "", +p.rot.toFixed(2), p.offY | 0,
    ]);
  }
  return { p: sideSnap(G.player), e: sideSnap(G.enemy), u, pr };
}

function applySideSnap(dst, s) {
  dst.gold = s.g; dst.xp = s.x; dst.age = s.a; dst.baseHp = s.h;
  dst.cd.melee = s.c[0]; dst.cd.range = s.c[1]; dst.cd.tank = s.c[2];
  dst.upg = s.u; dst.towerUpg = s.t;
  dst.villagers = s.v; dst.villagerLvl = s.vl; dst.slots = s.sl;
  if (s.sp) dst.specials = { melee: !!s.sp[0], range: !!s.sp[1], tank: !!s.sp[2] };
  dst.towers = s.tw.map((t) => t ? { type: t[0], angle: t[1], fireAnim: t[2], animFrame: t[3], cd: 0, animTimer: 0 } : null);
}
// El guest se ve a sí mismo a la IZQUIERDA: host.player = mi rival, host.enemy = yo.
function applyState(state) {
  applySideSnap(G.player, state.e);
  applySideSnap(G.enemy, state.p);
  const units = [];
  for (const a of state.u) {
    const u = Object.create(Unit.prototype);
    u.side = a[0] === 0 ? "enemy" : "player";     // bando espejado
    u.age = a[1]; u.type = UNIT_TYPES[a[2]];
    u.x = WORLD_W - a[3]; u.y = a[4];             // x espejada
    u.hp = a[5]; u.maxHp = a[6];
    u.anim = ANIMS[a[7]] || "walk"; u.frame = a[8];
    u.dying = !!a[9]; u.dieTimer = a[10]; u.fade = a[11];
    u.lvl = a[12] || 1; u.dmg = a[13] || 0; u.cd = a[14] || 0;
    u.dead = false;
    units.push(u);
  }
  G.units = units;
  const prj = [];
  for (const a of state.pr) {
    const p = Object.create(Projectile.prototype);
    p.side = a[0] === 0 ? "enemy" : "player";
    p.x = WORLD_W - a[1]; p.y = a[2];
    p.target = { x: WORLD_W - a[3], y: a[4], dead: false, dying: false };
    p.texKey = a[5] || null; p.rot = a[6]; p.offY = a[7]; p.dead = false;
    prj.push(p);
  }
  G.projectiles = prj;
}

// Wrappers de input: el guest envía comando (no simula); host/IA aplican local.
function playerSpawn(uid) {
  if (paused) return;
  const u = UNIT_CATALOG[uid];
  if (!u) return false;
  if (isGuest()) return sendCmd({ type: "spawn", unitType: u.combatStyle, unitId: uid });
  return trySpawn("player", u.combatStyle, u.spriteId);
}
function playerUpgrade(type, stat) {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "upgrade", unitType: type, stat });
  return tryUpgrade("player", type, stat);
}
function playerEvolve() {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "evolve" });
  return tryEvolve("player");
}
function playerVillager() {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "villager" });
  return tryVillager("player");
}
function playerVillagerUpg() {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "villagerupg" });
  return tryVillagerUpgrade("player");
}
function playerBuySlot() {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "buy_slot" });
  return tryBuySlot("player");
}
function playerBuySpecial(type) {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "special", unitType: type });
  return tryBuySpecial("player", type);
}
function playerBuyTower(slot, towerType) {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "tower_buy", slot, towerType });
  return tryBuyTower("player", slot, towerType);
}
function playerUpgTower(slot, kind) {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "tower_upg", slot, kind });
  return tryUpgradeTower("player", slot, kind);
}
function playerSellTower(slot) {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "tower_sell", slot });
  return trySellTower("player", slot);
}

// ---- Ciclo día/noche ------------------------------------------------
const DAY_CYCLE_DURATION = 80; // segundos para un ciclo completo
const PHASE_NAMES = ["Temprano", "Día", "Atardecer", "Noche"];
const PHASE_EMOJIS = ["🌅", "☀️", "🌇", "🌙"];
const DAY_COLORS = [
  [255, 180, 60,  0.18],
  [255, 255, 255, 0.00],
  [255, 100, 40,  0.28],
  [0,   2,   20,  0.82],
];
let dayCycleTime = 0;

const dayFillEl = document.getElementById("day-fill");

function getDayPhase() {
  const p = (dayCycleTime / DAY_CYCLE_DURATION) * 4;
  const idx = Math.floor(p) % 4;
  const t = p - Math.floor(p);
  return { idx, t, name: PHASE_NAMES[idx], emoji: PHASE_EMOJIS[idx] };
}

function drawDayFilter() {
  const p = (dayCycleTime / DAY_CYCLE_DURATION) * 4;
  const idx = Math.floor(p) % 4;
  const t = p - Math.floor(p);
  const c1 = DAY_COLORS[idx];
  const c2 = DAY_COLORS[(idx + 1) % 4];
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  const a = c1[3] + (c2[3] - c1[3]) * t;
  ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
  ctx.fillRect(0, 0, W, H);
}

// ---- Sistema de mejoras (separado por stat) --------------------------
const MAX_UPG = 5;
const UPG_DMG = 0.16;        // +16% daño por nivel
const UPG_HP = 0.16;         // +16% vida por nivel
const UPG_SPD = 0.12;        // -12% cooldown de ataque por nivel
const SPECIAL_LEVEL = 6;     // nivel (3 mejoras al máx) que desbloquea el especial

// Especial por tipo de unidad (se compra al llegar a Nv6 -> sube a Nv7).
//  melee: +velocidad de movimiento y aguanta mejor a los tanques.
//  range: +rango y aguanta mejor a los melee.
//  tank:  +vida y +daño.
const SPECIAL = {
  melee: { spd: 1.18, resist: "tank" },
  range: { range: 1.12, resist: "melee" },
  tank:  { hp: 1.30, dmg: 1.30, regen: 0.03 }, // +regen: 3% de su vida máx por seg
};
const RESIST_FACTOR = 0.75;  // recibe 25% menos daño del tipo contra el que resiste
const TANK_RANGED_AGE = 3;   // desde la edad militar, los tanques atacan a distancia
const MAX_UNIT_LEVEL = 1 + MAX_UPG + 1; // Nv7 = 3/4 mejoras al máx + especial
function specialCost(type) { return Math.round(STATS[0][type].cost * 12); } // melee600 range1020 tank2400
// Descripción del especial con números concretos (para el tooltip del botón).
function specialDesc(type) {
  const sp = SPECIAL[type], p = [];
  if (sp.spd)   p.push(`+${Math.round((sp.spd - 1) * 100)}% velocidad`);
  if (sp.range) p.push(`+${Math.round((sp.range - 1) * 100)}% rango`);
  if (sp.hp)    p.push(`+${Math.round((sp.hp - 1) * 100)}% vida`);
  if (sp.dmg)   p.push(`+${Math.round((sp.dmg - 1) * 100)}% daño`);
  if (sp.regen) p.push(`+${Math.round(sp.regen * 100)}% vida/seg (regeneración)`);
  if (sp.resist) p.push(`+${Math.round((1 - RESIST_FACTOR) * 100)}% armadura vs ${sp.resist}`);
  return "★ " + p.join(", ");
}

const UPG_RANGE = 0.05;      // +5% rango por nivel (mejora exclusiva del range)
// Escalado de daño por mejora, por tipo (el range gana menos daño por nivel)
const DMG_UPG_RATE = { melee: 1, range: 0.5, tank: 1 };
const UPG_ARMOR = 0.06;      // -6% daño recibido por nivel (mejora exclusiva del tank)
const LEVEL_BONUS = 0.05;    // +5% a TODOS los stats por cada nivel de unidad

// Mejoras disponibles por tipo. Las 3 primeras definen el nivel (al subirlas todas
// la unidad sube de Nv y gana el bonus global). El tank tiene una 4ª (armadura)
// incluida en el nivel, osea que necesita las 4 para subir de Nv.
const UNIT_LEVEL_STATS = { melee: ["dmg", "hp", "spd"], range: ["dmg", "range", "spd"], tank: ["dmg", "hp", "spd", "armor"] };
const UNIT_UPGS        = { melee: ["dmg", "hp", "spd"], range: ["dmg", "range", "spd"], tank: ["dmg", "hp", "spd", "armor"] };
const UPG_LABEL = { dmg: "+ATK", hp: "+HP", spd: "+VEL", range: "+RNG", armor: "+ARM" };

const UPG_COST_MULT = { dmg: 1.4, hp: 1.2, spd: 1.8, range: 1.5, armor: 1.6 };
function upgradeCost(age, type, stat, lvl) {
  // El precio depende SOLO del nivel de la mejora, no de la edad: la primera
  // mejora de cada tipo cuesta siempre lo mismo (base = costo de la unidad en edad 0).
  return Math.round(STATS[0][type].cost * UPG_COST_MULT[stat] * (lvl + 1));
}
// Nivel: sube cuando las mejoras que cuentan (UNIT_LEVEL_STATS) alcanzan el mismo
// escalón. Nv1 base; todas al máx -> Nv6; comprar especial -> Nv7.
function unitLevel(upg, special, type) {
  const stats = UNIT_LEVEL_STATS[type] || ["dmg", "hp", "spd"];
  let m = Infinity;
  for (const s of stats) m = Math.min(m, upg[s] || 0);
  return 1 + m + (special ? 1 : 0);
}

// Stats efectivos de una unidad (centralizado: lo usan Unit, las cards y la IA).
function computeStats(age, type, upg, special) {
  const s = STATS[age][type];
  const lv = unitLevel(upg, special, type);
  const lb = 1 + LEVEL_BONUS * (lv - 1);   // bonus global por nivel
  let hp    = s.hp  * (1 + UPG_HP  * (upg.hp    || 0)) * lb;
  let dmg   = s.dmg * DMG_MULT * (1 + UPG_DMG * (DMG_UPG_RATE[type] || 1) * (upg.dmg || 0)) * lb;
  let cd    = getBaseCD(age, type) * (1 - UPG_SPD * (upg.spd || 0)) / lb; // menos cd = más rápido
  let spd   = s.spd * SPEED_MULT * lb;
  let range = s.range * (1 + UPG_RANGE * (upg.range || 0)); // sin bonus de nivel: el alcance no se infla
  let resist = null, regen = 0;
  if (special) {
    const sp = SPECIAL[type];
    if (sp.hp) hp *= sp.hp;
    if (sp.dmg) dmg *= sp.dmg;
    if (sp.spd) spd *= sp.spd;
    if (sp.range) range *= sp.range;
    resist = sp.resist || null;
    if (sp.regen) regen = hp * sp.regen; // vida/seg basada en su vida máx final
  }
  // armadura del tank: reducción de daño recibido de TODO (0..0.30)
  const armor = type === "tank" ? Math.min(0.6, UPG_ARMOR * (upg.armor || 0)) : 0;
  return { hp, dmg, cd, spd, range, resist, armor, regen, lvl: lv };
}

// ---- Ataque base desde sprites ----------------------------------------
function getBaseCD(age, type) {
  const n = manifest ? (manifest[AGES[age]][type].attack || 8) : 8;
  return n / 14; // 14 fps para animación de ataque
}

// ---- Economía: aldeanos (oro/seg + oro/muerte + mejora) --------------
const VILLAGER_GOLD = 4;
const MAX_VILLAGERS = 10;
const VILLAGER_KILL_BONUS = 3;
const MAX_VILLAGER_LVL = 5;
function villagerCost(n) { return Math.round(300 * Math.pow(1.65, n)); }
function villagerLvlCost(lvl) { return Math.round(600 * Math.pow(1.85, lvl)); }

// ---- Torres defensivas -----------------------------------------------
const MAX_SLOTS = 4;
const MAX_TOWER_UPG = 4;
const SLOT_COST = [0, 400, 900, 1800];
const TOWER_TIERS = [1, 2, 3];
// Stats base por torre [age][type] según el juego original (projectile_damage, cd, range)
const TOWER_BASE = [
  [ // cave
    { dmg: 15, cd: 1.5, range: 400 },
    { dmg: 5,  cd: 0.5, range: 300 },
    { dmg: 40, cd: 2.5, range: 480 },
  ],
  [ // knight
    { dmg: 40, cd: 1.5, range: 400 },
    { dmg: 60, cd: 1.2, range: 420 },
    { dmg: 300, cd: 3.5, range: 500 },
  ],
  [ // medival
    { dmg: 60, cd: 1.2, range: 420 },
    { dmg: 120, cd: 1.5, range: 420 },
    { dmg: 120, cd: 1.8, range: 480 },
  ],
  [ // miltary
    { dmg: 60, cd: 1.2, range: 420 },
    { dmg: 120, cd: 1.5, range: 420 },
    { dmg: 80, cd: 1.0, range: 350 },
  ],
  [ // future
    { dmg: 100, cd: 1.0, range: 420 },
    { dmg: 50,  cd: 0.4, range: 400 },
    { dmg: 50,  cd: 0.6, range: 400 },
  ],
];
function towerBuyCost(age, type) {
  const base = [180, 450, 1000];
  return Math.round(base[type - 1] * (1 + age * 0.3));
}
function towerUpgCost(age, type, kind, lvl) {
  // El precio depende solo del tipo de torre y del nivel de mejora, NO de la edad.
  const baseCost = kind === "dmg" ? 100 : 80;
  return Math.round(baseCost * type * (lvl + 1));
}
function towerStats(age, type, upgDmg, upgSpd) {
  const b = TOWER_BASE[age][type - 1];
  return {
    dmg: Math.round(b.dmg * DMG_MULT * (1 + age * 0.5) * (1 + 0.3 * upgDmg)),
    range: b.range,
    cd: Math.max(0.3, b.cd * (1 - 0.12 * upgSpd)),
  };
}
function towerSellValue(type, age, upgDmg, upgSpd) {
  let inv = towerBuyCost(age, type);
  for (let l = 0; l < upgDmg; l++) inv += towerUpgCost(age, type, "dmg", l);
  for (let l = 0; l < upgSpd; l++) inv += towerUpgCost(age, type, "spd", l);
  return Math.round(inv * 0.5);
}

// Config de proyectiles por torre (index = age*3 + type-1)
// Formato: [speed, rotSpeed, offsetY, projectilePath]
const TOWER_PROJ = [
  [400, 0,   0,   "towers/cave/t1/cave_turret_1_projectile_01.png"],  // cave 1
  [300, 200, 0,   "towers/cave/t2/cave_turret_2_projectile.png"],      // cave 2 (gira)
  [500, 0,   -20, "towers/cave/t3/cave_turret_3_projectile.png"],      // cave 3
  [1200, 0,  0,   "towers/knight/t1/knight_turret_1_projectile.png"],  // knight 1
  [500, 150, 0,   "towers/knight/t2/knight_turret_2_projectile.png"],  // knight 2 (gira)
  [500, 0,   0,   "towers/knight/t3/knight_turret_3_projectile.png"],  // knight 3
  [1200, 0,  0,   "towers/medival/t1/medival_turret_1_projectile.png"], // medival 1
  [1200, 0,  0,   "towers/medival/t2/medival_turret_2_projectile.png"], // medival 2
  [1200, 0,  0,   "towers/medival/t3/medival_turret_3_projectile.png"], // medival 3
  [1200, 0,  0,   "towers/miltary/t1/miltary_turret_1_projectile.png"], // miltary 1
  [1200, 0,  0,   "towers/miltary/t2/miltary_turret_2_projectile.png"], // miltary 2
  [1200, 0,  0,   "towers/miltary/t1/miltary_turret_1_projectile.png"], // miltary 3 (reusa t1)
  [1200, 0,  0,   "towers/future/t1/future_turret_1_projectile.png"],   // future 1
  [1200, 0,  0,   "towers/future/t2/future_turret_2_projectile0001.png"], // future 2
  [1200, 0,  0,   "towers/future/t3/future_turret_3_projectile0001.png"], // future 3
];

// Número de frames de ataque por torre (age×3 + level-1)
const TOWER_ATTACK_FRAMES = [
  32, 10, 55,   // cave 1,2,3
  99, 99, 77,   // knight 1,2,3
  45, 80, 80,   // medival 1,2,3
  45, 40, 40,   // miltary 1,2,3
  40, 3, 3,     // future 1,2,3
];

// ---- Carga de assets -------------------------------------------------
const IMG = {}; // cache de imágenes por ruta
const ASSET_V = "8"; // versión de assets (cache-busting); subir al regenerar sprites
let manifest = null;

function loadImage(src, retries) {
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => {
      if (retries > 0) {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = src;
      } else {
        res(null);
      }
    };
    im.src = src;
  });
}

async function batchLoad(paths, concurrency) {
  const results = [];
  for (let i = 0; i < paths.length; i += concurrency) {
    const batch = paths.slice(i, i + concurrency);
    const chunk = await Promise.all(batch.map((p) => loadImage(p + "?v=" + ASSET_V, 2)));
    for (let j = 0; j < chunk.length; j++) {
      IMG[paths[i + j]] = chunk[j];
    }
  }
}

async function loadAll() {
  manifest = await fetch("assets/manifest.json?v=" + ASSET_V).then((r) => r.json());
  const paths = [];

  paths.push("assets/bg/wallpaper.png");
  paths.push("assets/bg/background.png");
  for (const age of AGES) {
    paths.push(`assets/bases/${age}/base.png`);
    for (const l of [1, 2, 3]) {
      paths.push(`assets/towers/${age}/t${l}.png`);
      const idx = AGES.indexOf(age) * 3 + (l - 1);
      paths.push(`assets/${TOWER_PROJ[idx][3]}`);
      const nf = TOWER_ATTACK_FRAMES[idx] || 0;
      for (let f = 1; f <= nf; f++) {
        paths.push(`assets/towers/${age}/t${l}/${age}_turret_${l}_attack${String(f).padStart(4, "0")}.png`);
      }
    }
    // Cargar sprites desde el catálogo (cada unidad tiene su spriteId)
    const spriteIds = [...new Set(UNIT_IDS.map(id => UNIT_CATALOG[id].spriteId))];
    for (const sid of spriteIds) {
      for (const anim of ANIMS) {
        const n = manifest[age][sid][anim] || 0;
        for (let i = 0; i < n; i++) paths.push(`assets/units/${age}/${sid}/${anim}/${i}.png`);
      }
    }
  }
  await batchLoad(paths, 20);
}

// Cache de arrays de frames ya resueltos (se construyen una sola vez).
const FCACHE = new Map();
function frames(age, u, anim) {
  if (typeof age === "number") age = AGES[age];
  const key = age + "/" + u + "/" + anim;
  let arr = FCACHE.get(key);
  if (arr) return arr;
  arr = [];
  const n = manifest[age][u][anim] || 0;
  for (let i = 0; i < n; i++) {
    const im = IMG[`assets/units/${age}/${u}/${anim}/${i}.png`];
    if (im) arr.push(im);
  }
  FCACHE.set(key, arr);
  return arr;
}

// ---- Geometría -------------------------------------------------------
const CV = document.getElementById("cv");
const ctx = CV.getContext("2d");
// Mundo lógico (el campo de batalla). El canvas se ajusta a la pantalla y se
// recorre con la cámara. WORLD_W define cuán separadas están las bases.
const WORLD_W = 1280, WORLD_H = 540;
const W = WORLD_W, H = WORLD_H; // alias para código de gameplay
const GROUND_Y = WORLD_H - 135;
const PLAYER_BASE_X = 90;
const ENEMY_BASE_X = WORLD_W - 90;

// ---- Cámara ----------------------------------------------------------
let BW = 1280, BH = 540;       // tamaño del buffer del canvas (px reales)
let camX = 0, camY = 0;        // desplazamiento de cámara (unidades de mundo)
let camScale = 1;              // px de buffer por unidad de mundo
let viewW = WORLD_W, viewH = WORLD_H; // mundo visible
let pxToWorld = 1;             // unidades de mundo por px CSS (para drag)

function clampCam() {
  camX = Math.max(0, Math.min(camX, Math.max(0, WORLD_W - viewW)));
  // vertical: anclar para que el suelo/unidades queden cerca del borde inferior
  const desiredY = GROUND_Y + 40 - viewH;
  camY = Math.max(0, Math.min(WORLD_H - viewH, Math.max(0, desiredY)));
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = CV.clientWidth || 1280;
  const cssH = CV.clientHeight || 540;
  BW = Math.max(1, Math.round(cssW * dpr));
  BH = Math.max(1, Math.round(cssH * dpr));
  if (CV.width !== BW) CV.width = BW;
  if (CV.height !== BH) CV.height = BH;
  // "cover" del mundo: llena el canvas sin huecos (recorta el lado sobrante)
  camScale = Math.max(BW / WORLD_W, BH / WORLD_H);
  viewW = BW / camScale;
  viewH = BH / camScale;
  pxToWorld = dpr / camScale; // 1 px CSS = pxToWorld unidades de mundo
  clampCam();
}
window.addEventListener("resize", resizeCanvas);

// Arrastre de cámara (mouse + touch)
let dragging = false, dragStartX = 0, camStart = 0;
function camPointerDown(clientX) { dragging = true; dragStartX = clientX; camStart = camX; }
function camPointerMove(clientX) {
  if (!dragging) return;
  camX = camStart - (clientX - dragStartX) * pxToWorld;
  clampCam();
}
function camPointerUp() { dragging = false; }

CV.addEventListener("mousedown", (e) => camPointerDown(e.clientX));
window.addEventListener("mousemove", (e) => camPointerMove(e.clientX));
window.addEventListener("mouseup", camPointerUp);
CV.addEventListener("touchstart", (e) => { if (e.touches[0]) camPointerDown(e.touches[0].clientX); }, { passive: true });
CV.addEventListener("touchmove", (e) => {
  if (e.touches[0]) { camPointerMove(e.touches[0].clientX); e.preventDefault(); }
}, { passive: false });
window.addEventListener("touchend", camPointerUp);
CV.addEventListener("wheel", (e) => {
  camX += (e.deltaX || e.deltaY) * pxToWorld;
  clampCam();
  e.preventDefault();
}, { passive: false });

// ---- Entidades -------------------------------------------------------
class Unit {
  constructor(side, age, type, spriteId) {
    this.side = side;
    this.age = age;
    this.type = type;
    this.spriteId = spriteId || type;
    const s = STATS[age][type];
    this.special = !!(G[side].specials && G[side].specials[type]);
    const cs = computeStats(age, type, G[side].upg[age][type], this.special);
    this.lvl = cs.lvl;            // nivel "horneado" al nacer
    this.cost = s.cost;
    this.maxHp = cs.hp;
    this.dmg = cs.dmg;
    this.baseCD = getBaseCD(age, type);
    this.cd = cs.cd;
    this.spd = cs.spd;
    this.range = cs.range;
    this.resist = cs.resist;      // resistencia del especial
    this.armor = cs.armor;        // reducción de daño (tank)
    this.regen = cs.regen;        // vida/seg (especial del tank)
    this.rangedAttack = type === "range" || (type === "tank" && age >= TANK_RANGED_AGE);
    this.hp = this.maxHp;
    this.reward = { g: s.g, xp: s.xp };
    this.atkTimer = 0;
    this.anim = "walk";
    this.frame = 0;
    this.frameTimer = 0;
    this.dead = false;
    this.dying = false;
    this.dieTimer = 0;

    this.dir = side === "player" ? 1 : -1; // +1 mueve a la derecha
    // nacen en la puerta (borde frontal de su base) y aparecen con un fundido
    const baseImg = IMG[`assets/bases/${AGES[age]}/base.png`];
    const halfW = baseImg ? baseImg.width / 2 : 150;
    this.x = side === "player"
      ? PLAYER_BASE_X + halfW - 35
      : ENEMY_BASE_X - halfW + 35;
    this.y = GROUND_Y;
    this.fade = 0;
    // ancho aproximado para el espaciado en fila
    this.half = type === "tank" ? 46 : 26;
  }

  get walkFrames() { return frames(this.age, this.spriteId, "walk"); }

  draw() {
    const fr = frames(this.age, this.spriteId, this.dying ? "die" : this.anim);
    if (!fr.length) return;
    const im = fr[Math.min(this.frame, fr.length - 1)];
    if (!im) return;

    const nativeRight = FACE_RIGHT[AGES[this.age]][this.type];
    // El jugador debe mirar a la derecha; el enemigo a la izquierda.
    const wantRight = this.side === "player";
    const flip = wantRight !== nativeRight;

    const w = im.width, h = im.height;
    ctx.save();
    ctx.translate(this.x, this.y);
    if (flip) ctx.scale(-1, 1);
    if (this.dying) ctx.globalAlpha = Math.max(0, 1 - this.dieTimer / 0.8);
    else if (this.fade < 1) ctx.globalAlpha = this.fade;
    ctx.drawImage(im, -w / 2, -h, w, h);
    ctx.restore();

    if (!this.dying) this.drawHpBar(h);
  }

  drawHpBar() {
    const bw = 46, bh = 5;
    const x = this.x - bw / 2;
    const fr = this.walkFrames;
    const topY = this.y - (fr[0] ? fr[0].height : 90) - 10;
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 1, topY - 1, bw + 2, bh + 2);
    const pct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = this.side === "player" ? "#4fd16b" : "#e0524a";
    ctx.fillRect(x, topY, bw * pct, bh);
  }
}

class Projectile {
  constructor(x, y, target, dmg, side, projIdx, atkType) {
    this.x = x; this.y = y;
    this.target = target;
    this.dmg = dmg;
    this.side = side;
    this.atkType = atkType || null; // tipo del atacante (para resistencias)
    this.spd = 620;
    this.rot = 0;
    this.rotSpd = 0;
    this.offY = 0;
    this.texKey = null;
    this.dead = false;
    if (projIdx !== undefined && projIdx >= 0) {
      const cfg = TOWER_PROJ[projIdx];
      if (cfg) {
        this.spd = cfg[0];
        this.rotSpd = cfg[1];
        this.offY = cfg[2];
        this.texKey = `assets/${cfg[3]}`;
      }
    }
  }
  update(dt) {
    if (this.target.dead || this.target.dying) { this.dead = true; return; }
    const tx = this.target.x, ty = this.target.y - 40;
    const dx = tx - this.x, dy = ty - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 14) {
      hitTarget(this.target, this.dmg, this.side, this.atkType);
      this.dead = true;
      return;
    }
    this.x += (dx / dist) * this.spd * dt;
    this.y += (dy / dist) * this.spd * dt;
    this.rot += this.rotSpd * dt;
  }
  draw() {
    if (this.texKey) {
      const im = IMG[this.texKey];
      if (im) {
        // El ángulo de viaje (mismo punto que usa update) orienta el sprite en
        // cualquier dirección. NO se hace flip por bando: la rotación ya cubre
        // 0..2π, así que la bala conserva su diagonal en ambos lados.
        const dx = this.target.x - this.x;
        const dy = (this.target.y - 40) - this.y;
        const dirAngle = Math.atan2(dy, dx);
        ctx.save();
        ctx.translate(this.x, this.y + this.offY);
        ctx.rotate(dirAngle + this.rot);
        const pw = 36, ph = im.height * (pw / im.width);
        ctx.drawImage(im, -pw / 2, -ph / 2, pw, ph);
        ctx.restore();
        return;
      }
    }
    // Fallback orientado: flecha fina para el range, obús grande para el tank
    const dx = this.target.x - this.x;
    const dy = (this.target.y - 40) - this.y;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(dy, dx));
    if (this.atkType === "tank") {
      ctx.fillStyle = this.side === "player" ? "#ffd27a" : "#ff9a6b";
      ctx.beginPath(); ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(-8, -0.8, 5, 1.6);
    } else {
      ctx.fillStyle = this.side === "player" ? "#e8d8b0" : "#d8a890";
      ctx.fillRect(-6, -1.5, 12, 3);
    }
    ctx.restore();
  }
}

class FloatText {
  constructor(x, y, txt, color) {
    this.x = x; this.y = y; this.txt = txt; this.color = color;
    this.life = 1.0; this.dead = false;
  }
  update(dt) { this.y -= 22 * dt; this.life -= dt * 1.2; if (this.life <= 0) this.dead = true; }
  draw() {
    const a = Math.max(0, this.life);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = "14px Segoe UI";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = this.color;
    ctx.fillText(this.txt, this.x, this.y);
    ctx.restore();
  }
}

// ---- Estado del juego ------------------------------------------------
function freshSide(gold) {
  const upg = [];
  for (let a = 0; a < AGES.length; a++) {
    const ageUpg = {};
    for (const t of UNIT_TYPES) {
      ageUpg[t] = {};
      for (const s of UNIT_UPGS[t]) ageUpg[t][s] = 0;
    }
    upg.push(ageUpg);
  }
  return {
    gold, xp: 0, age: 0, baseHp: BASE_HP,
    cd: { melee: 0, range: 0, tank: 0 },
    upg,
    towerUpg: { dmg: [0, 0, 0], spd: [0, 0, 0] },
    specials: { melee: false, range: false, tank: false },
    villagers: 0,
    villagerLvl: 0,
    slots: 1,
    towers: [null, null, null, null],
    aiTimer: 0,
    aiBuildTimer: 0,
    aiUpgTimer: 0,
    spawnCycle: 0,
  };
}
const G = {
  player: freshSide(250),
  enemy: freshSide(200),
  units: [],
  projectiles: [],
  floats: [],
  over: false,
  mode: "ai", // "ai" | "online"
};

function hitTarget(t, dmg, side, atkType) {
  if (t.dead || t.dying) return;
  // resistencia del especial: recibe menos daño del tipo contra el que aguanta
  if (atkType && t.resist === atkType) dmg *= RESIST_FACTOR;
  // armadura (tank): reduce el daño recibido de todo
  if (t.armor) dmg *= (1 - t.armor);
  t.hp -= dmg;
  G.floats.push(new FloatText(t.x, t.y - 95, "-" + Math.round(dmg), "#ffce54"));
  if (t.hp <= 0) killUnit(t);
}

function killUnit(t) {
  t.dying = true;
  t.dieTimer = 0;
  t.frame = 0;
  t.frameTimer = 0;
  const winner = t.side === "player" ? G.enemy : G.player;
  // bonus de aldeanos por muerte
  const villagerBonus = t.side === "enemy"
    ? G.player.villagers * G.player.villagerLvl * VILLAGER_KILL_BONUS
    : 0;
  const totalGold = t.reward.g + villagerBonus;
  winner.gold += totalGold;
  winner.xp += t.reward.xp;
  if (t.side === "enemy") {
    G.floats.push(new FloatText(t.x, t.y - 110, "+" + totalGold + "🪙", "#ffd866"));
    if (villagerBonus > 0) {
      G.floats.push(new FloatText(t.x, t.y - 130, "(+" + villagerBonus + " aldeanos)", "#b0d6a0"));
    }
  }
}

// ---- Spawning --------------------------------------------------------
function trySpawn(side, type, spriteId) {
  const st = G[side];
  // Para el enemigo (IA): ver disponibilidad global
  if (side === "enemy" && !UnitDB.isStyleAvailable(type, st.age)) return false;
  const s = STATS[st.age][type];
  if (st.gold < s.cost || st.cd[type] > 0) return false;
  st.gold -= s.cost;
  st.cd[type] = SPAWN_CD;
  G.units.push(new Unit(side, st.age, type, spriteId));
  return true;
}

function tryUpgrade(side, type, stat) {
  const st = G[side];
  const lvl = st.upg[st.age][type][stat];
  if (lvl === undefined) return false;   // stat no válido para este tipo
  if (lvl >= MAX_UPG) return false;
  const cost = upgradeCost(st.age, type, stat, lvl);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.upg[st.age][type][stat]++;
  return true;
}

function tryVillager(side) {
  const st = G[side];
  if (st.villagers >= MAX_VILLAGERS) return false;
  const cost = villagerCost(st.villagers);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.villagers++;
  return true;
}

function tryVillagerUpgrade(side) {
  const st = G[side];
  if (st.villagerLvl >= MAX_VILLAGER_LVL) return false;
  const cost = villagerLvlCost(st.villagerLvl);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.villagerLvl++;
  return true;
}

function tryBuySlot(side) {
  const st = G[side];
  if (st.slots >= MAX_SLOTS) return false;
  const cost = SLOT_COST[st.slots];
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.slots++;
  return true;
}

function tryBuyTower(side, slot, type) {
  const st = G[side];
  if (slot >= st.slots || st.towers[slot]) return false;
  const cost = towerBuyCost(st.age, type);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.towers[slot] = { type, cd: 0, angle: 0, fireAnim: 0, animFrame: 0, animTimer: 0 };
  return true;
}

function tryUpgradeTower(side, slot, kind) {
  const st = G[side];
  const t = st.towers[slot];
  if (!t) return false;
  const lvl = st.towerUpg[kind][t.type - 1];
  if (lvl >= MAX_TOWER_UPG) return false;
  const cost = towerUpgCost(st.age, t.type, kind, lvl);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.towerUpg[kind][t.type - 1] = lvl + 1;
  return true;
}

function trySellTower(side, slot) {
  const st = G[side];
  const t = st.towers[slot];
  if (!t) return false;
  const d = st.towerUpg.dmg[t.type - 1];
  const s = st.towerUpg.spd[t.type - 1];
  st.gold += towerSellValue(t.type, st.age, d, s);
  st.towers[slot] = null;
  return true;
}

function tryBuySpecial(side, type) {
  const st = G[side];
  if (st.specials[type]) return false;                       // ya comprado
  if (unitLevel(st.upg[st.age][type], false, type) < SPECIAL_LEVEL) return false; // requiere Nv6
  const cost = specialCost(type);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.specials[type] = true;
  return true;
}

function tryEvolve(side) {
  const st = G[side];
  if (st.age >= AGES.length - 1) return false;
  const cost = EVOLVE_COST[st.age];
  if (st.xp < cost) return false;
  st.xp -= cost;
  st.age++;
  // +800 de vida máxima por edad; suma 800 al actual sin curar del todo
  st.baseHp = Math.min(baseMaxHp(st.age), st.baseHp + 800);
  if (side === "player") {
    G.floats.push(new FloatText(W / 2, H / 2, "¡Nueva Edad: " + AGE_NAMES[st.age] + "!", "#7af0c0"));
  }
  return true;
}

// ---- Lógica de combate y movimiento ----------------------------------
function update(dt) {
  if (G.over) return;

  // [COMENTADO] ciclo día/noche — siempre de día por ahora
  // dayCycleTime = (dayCycleTime + dt) % DAY_CYCLE_DURATION;

  // oro pasivo (base + aldeanos con mejora)
  // oro pasivo: base + bono por edad (más rápido en edades altas, ya que las
  // unidades son más caras) + aldeanos
  G.player.gold += (PASSIVE_GOLD + G.player.age * AGE_GOLD + G.player.villagers * (VILLAGER_GOLD + G.player.villagerLvl * 2)) * dt;
  const enemyInc = PASSIVE_GOLD + G.enemy.age * AGE_GOLD + G.enemy.villagers * (VILLAGER_GOLD + G.enemy.villagerLvl * 2);
  G.enemy.gold += enemyInc * dt;
  // xp pasivo del jugador (evoluciona con el tiempo, como la IA)
  G.player.xp += PLAYER_PASSIVE_XP * dt;
  if (G.mode === "online") G.enemy.xp += PLAYER_PASSIVE_XP * dt;
  for (const t of UNIT_TYPES) {
    if (G.player.cd[t] > 0) G.player.cd[t] -= dt;
    if (G.enemy.cd[t] > 0) G.enemy.cd[t] -= dt;
  }

  if (G.mode === "ai") runAI(dt);

  // separar vivos por bando (una sola pasada) y avanzar la animación de muerte
  const players = [], enemies = [];
  let anyDead = false;
  for (const u of G.units) {
    if (u.dying) {
      u.dieTimer += dt;
      advanceAnim(u, dt, "die", false);
      if (u.dieTimer >= 0.8) { u.dead = true; anyDead = true; }
    } else if (u.side === "player") players.push(u);
    else enemies.push(u);
  }
  // frente primero: mayor x para player, menor x para enemy
  players.sort((a, b) => b.x - a.x);
  enemies.sort((a, b) => a.x - b.x);

  stepSide(players, enemies, "player", ENEMY_BASE_X, "enemy", dt);
  stepSide(enemies, players, "enemy", PLAYER_BASE_X, "player", dt);

  // torres disparan al enemigo del frente que esté en rango
  updateTowers("player", enemies[0] || null, dt);
  updateTowers("enemy", players[0] || null, dt);

  // proyectiles
  for (const p of G.projectiles) p.update(dt);
  if (G.projectiles.some((p) => p.dead))
    G.projectiles = G.projectiles.filter((p) => !p.dead);

  // textos flotantes
  for (const f of G.floats) f.update(dt);
  if (G.floats.some((f) => f.dead))
    G.floats = G.floats.filter((f) => !f.dead);

  // limpiar muertos (solo si hubo bajas)
  if (anyDead) G.units = G.units.filter((u) => !u.dead);

  // condición de victoria (en zona de test no termina nunca)
  if (G.mode !== "test") {
    if (G.enemy.baseHp <= 0) endGame(true);
    else if (G.player.baseHp <= 0) endGame(false);
  }
}

// Procesa todas las unidades vivas de un bando (lista ordenada con el frente
// primero). El objetivo siempre es la unidad enemiga del frente -> O(1).
function stepSide(list, enemyList, side, enemyBaseX, enemyBaseSide, dt) {
  const frontEnemy = enemyList.length ? enemyList[0] : null;
  const dir = side === "player" ? 1 : -1;
  for (let i = 0; i < list.length; i++) {
    const u = list[i];
    if (u.fade < 1) u.fade = Math.min(1, u.fade + dt / 0.4);
    if (u.regen && u.hp < u.maxHp) u.hp = Math.min(u.maxHp, u.hp + u.regen * dt); // regen del especial
    const prevX = u.x;
    let attacking = false;

    const tdist = frontEnemy ? Math.abs(frontEnemy.x - u.x) : Infinity;

    if (frontEnemy && tdist <= u.range) {
      attacking = true;
      u.atkTimer -= dt;
      if (u.atkTimer <= 0) { u.atkTimer = u.cd; dealAttack(u, frontEnemy); }
    } else if (!frontEnemy && Math.abs(enemyBaseX - u.x) <= u.range) {
      attacking = true;
      u.atkTimer -= dt;
      if (u.atkTimer <= 0) {
        u.atkTimer = u.cd;
        const bdmg = u.dmg * BASE_DMG_MULT;
        if (G.mode !== "test") G[enemyBaseSide].baseHp -= bdmg; // bases invulnerables en test
        if (u.rangedAttack) {
          G.projectiles.push(new Projectile(u.x, u.y - 50,
            { x: enemyBaseX, y: GROUND_Y - 60, dead: false, dying: false }, 0, u.side));
        }
        G.floats.push(new FloatText(enemyBaseX, GROUND_Y - 150, "-" + Math.round(bdmg), "#ff7a5c"));
      }
    } else {
      // avanzar respetando el espaciado con el aliado de delante (list[i-1])
      let nextX = u.x + dir * u.spd * dt;
      const ahead = list[i - 1];
      if (ahead) {
        const gap = u.half + ahead.half + 4;
        if (side === "player") nextX = Math.max(u.x, Math.min(nextX, ahead.x - gap));
        else nextX = Math.min(u.x, Math.max(nextX, ahead.x + gap));
      }
      if (side === "player") nextX = Math.min(nextX, enemyBaseX - u.range + 5);
      else nextX = Math.max(nextX, enemyBaseX + u.range - 5);
      u.x = nextX;
    }

    const moved = Math.abs(u.x - prevX) > 0.05;
    advanceAnim(u, dt, attacking ? "attack" : (moved ? "walk" : "idle"), true);
  }
}

function dealAttack(u, target) {
  if (u.rangedAttack) {
    G.projectiles.push(new Projectile(u.x, u.y - 50, target, u.dmg, u.side, undefined, u.type));
  } else {
    hitTarget(target, u.dmg, u.side, u.type);
  }
}

// posición de cada torre (apiladas sobre la torre central de la base)
function towerPos(side, slot) {
  const baseX = side === "player" ? PLAYER_BASE_X : ENEMY_BASE_X;
  return {
    x: baseX + (side === "player" ? 22 : -22),
    y: GROUND_Y - 205 + slot * 44,
  };
}

function updateTowers(side, frontEnemy, dt) {
  const st = G[side];
  for (let i = 0; i < st.slots; i++) {
    const t = st.towers[i];
    if (!t) continue;
    if (t.cd > 0) t.cd -= dt;
    if (t.fireAnim > 0) {
      t.fireAnim -= dt;
    }
    if (t.fireAnim > 0) {
      t.animTimer += dt;
      const projIdx = st.age * 3 + (t.type - 1);
      const nf = TOWER_ATTACK_FRAMES[projIdx] || 1;
      const frameDur = 0.15 / nf;
      if (t.animTimer >= frameDur) {
        t.animTimer = 0;
        t.animFrame = (t.animFrame + 1) % nf;
      }
    } else {
      t.animFrame = 0;
      t.animTimer = 0;
    }

    const p = towerPos(side, i);
    const projIdx = st.age * 3 + (t.type - 1);

    if (!frontEnemy || frontEnemy.dying) {
      t.angle = 0;
      continue;
    }

    const upgDmg = st.towerUpg.dmg[t.type - 1];
    const upgSpd = st.towerUpg.spd[t.type - 1];
    const ts = towerStats(st.age, t.type, upgDmg, upgSpd);
    if (Math.abs(frontEnemy.x - p.x) <= ts.range) {
      const dy = (frontEnemy.y - 40) - p.y;
      const dx = Math.abs(frontEnemy.x - p.x);
      t.angle = Math.max(-0.3, Math.min(0.3, Math.atan2(dy, Math.max(dx, 50))));
      if (t.cd <= 0) {
        t.cd = ts.cd;
        t.fireAnim = 0.15;
        t.animFrame = 0;
        t.animTimer = 0;
        G.projectiles.push(new Projectile(p.x, p.y, frontEnemy, ts.dmg, side, projIdx));
      }
    } else {
      t.angle = 0;
    }
  }
}

function advanceAnim(u, dt, anim, loop) {
  if (u.anim !== anim) { u.anim = anim; u.frame = 0; u.frameTimer = 0; }
  const fr = u.dying ? frames(u.age, u.spriteId, "die") : frames(u.age, u.spriteId, anim);
  if (!fr.length) return;
  let fps = anim === "attack" ? 14 : 12;
  if (anim === "attack" && !u.dying) {
    const spdLvl = G[u.side].upg[u.age][u.type].spd;
    fps = 14 * (1 + UPG_SPD * spdLvl);
  }
  u.frameTimer += dt;
  if (u.frameTimer >= 1 / fps) {
    u.frameTimer = 0;
    u.frame++;
    if (u.frame >= fr.length) u.frame = loop ? 0 : fr.length - 1;
  }
}

// ---- Dificultad / IA -------------------------------------------------
// Cada dificultad tiene una "personalidad" distinta:
//  comp   = composición objetivo [melee, range, tank]
//  react  = cuánto contrarresta la composición del jugador (0..1)
//  econ   = prioridad de economía temprana (aldeanos/torres)
//  towers = nº de torres que intenta tener
//  save   = qué tan dispuesta está a ahorrar para la unidad deseada (vs. spamear melee)
//  idle   = prob. de "descansar" cuando el ejército ya está lleno (errores en fácil)
//  upgEvery = segundos entre intentos de mejora de unidades
const DIFF = {
  easy:    { aiIncome: 0.22, maxUnits: 5,  spawnMin: 1.7,  evolveChance: 0.25, xpMult: 0.8, upgEvery: 16,  comp: [0.62, 0.16, 0.08], react: 0.0,  econ: 0.3, towers: 0, save: 0.45, idle: 0.32, fill: 0.7,  upgAfford: 4.0, buySpecial: false },
  medium:  { aiIncome: 0.45, maxUnits: 8,  spawnMin: 1.05, evolveChance: 0.55, xpMult: 1.0, upgEvery: 7,   comp: [0.42, 0.26, 0.16], react: 0.35, econ: 0.6, towers: 1, save: 0.70, idle: 0.12, fill: 0.85, upgAfford: 2.2, buySpecial: false },
  hard:    { aiIncome: 0.75, maxUnits: 12, spawnMin: 0.68, evolveChance: 0.85, xpMult: 1.3, upgEvery: 4,   comp: [0.36, 0.28, 0.20], react: 0.7,  econ: 0.9, towers: 2, save: 0.85, idle: 0.04, fill: 0.95, upgAfford: 1.5, buySpecial: true },
  extreme: { aiIncome: 1.10, maxUnits: 18, spawnMin: 0.34, evolveChance: 1.0,  xpMult: 2.2, upgEvery: 2.2, comp: [0.32, 0.28, 0.22], react: 1.0,  econ: 1.2, towers: 4, save: 1.0,  idle: 0.0,  fill: 1.0,  upgAfford: 1.1, buySpecial: true },
};
let difficulty = "medium";

function runAI(dt) {
  const ai = G.enemy;
  const D = DIFF[difficulty];
  // Ingreso escalado al costo de la edad actual: así el ritmo de spawn se mantiene
  // al subir de edad (antes el costo subía mucho más rápido que el ingreso).
  ai.gold += STATS[ai.age].melee.cost * D.aiIncome * dt;
  ai.xp += AI_PASSIVE_XP * D.xpMult * dt;
  ai.aiTimer -= dt;
  ai.aiBuildTimer -= dt;
  ai.aiUpgTimer -= dt;

  // ---- EVOLUCIÓN (extreme evoluciona apenas puede; easy casi nunca) ----
  if (ai.age < AGES.length - 1 && ai.xp >= EVOLVE_COST[ai.age]) {
    if (Math.random() < D.evolveChance * dt * 20) tryEvolve("enemy");
  }

  // ---- Conteo de ambos ejércitos por tipo ----
  const curCount = {}, pCount = {};
  const allTypes = UNIT_TYPES.filter(t => UnitDB.isStyleAvailable(t, ai.age));
  for (const t of allTypes) { curCount[t] = 0; pCount[t] = 0; }
  for (const u of G.units) {
    if (u.dying) continue;
    if (u.side === "enemy") { if (curCount[u.type] !== undefined) curCount[u.type]++; }
    else { if (pCount[u.type] !== undefined) pCount[u.type]++; }
  }
  let army = 0, pArmy = 0;
  for (const t of allTypes) { army += curCount[t]; pArmy += pCount[t]; }
  const mc = curCount["melee"] || 0, rc = curCount["range"] || 0, tc = curCount["tank"] || 0;
  const wantVill = Math.min(MAX_VILLAGERS, Math.round(1 + D.econ * 2.5)); // easy ~2, extreme ~4

  // ---- ECONOMÍA: aldeanos pronto, luego torres (ritmo según D.econ) ----
  if (ai.aiBuildTimer <= 0) {
    ai.aiBuildTimer = (2 + Math.random() * 2) / Math.max(0.5, D.econ);
    if (ai.villagers < wantVill && ai.gold >= villagerCost(ai.villagers)) {
      tryVillager("enemy");
    } else if (ai.villagerLvl < MAX_VILLAGER_LVL && ai.villagers >= 3 && D.econ >= 0.8 &&
               ai.gold > villagerLvlCost(ai.villagerLvl) * 1.4) {
      tryVillagerUpgrade("enemy");
    } else if (D.towers > 0 && (army >= 2 || ai.age >= 1)) {
      let empty = -1, built = 0;
      for (let i = 0; i < ai.slots; i++) { if (ai.towers[i]) built++; else if (empty < 0) empty = i; }
      if (built < D.towers && empty >= 0 && ai.gold > towerBuyCost(ai.age, 1) * 1.4) {
        let ty = 1;
        if (ai.gold > towerBuyCost(ai.age, 3) * 1.5) ty = 3;
        else if (ai.gold > towerBuyCost(ai.age, 2) * 1.5) ty = 2;
        tryBuyTower("enemy", empty, ty);
      } else if (built < D.towers && empty < 0 && ai.slots < MAX_SLOTS && ai.gold > SLOT_COST[ai.slots] * 1.4) {
        tryBuySlot("enemy");
      } else {
        for (let i = 0; i < ai.slots; i++) {
          const t = ai.towers[i]; if (!t) continue;
          const ud = ai.towerUpg.dmg[t.type - 1], us = ai.towerUpg.spd[t.type - 1];
          if (ud < MAX_TOWER_UPG && ai.gold > towerUpgCost(ai.age, t.type, "dmg", ud) * 1.6) { tryUpgradeTower("enemy", i, "dmg"); break; }
          if (us < MAX_TOWER_UPG && ai.gold > towerUpgCost(ai.age, t.type, "spd", us) * 1.6) { tryUpgradeTower("enemy", i, "spd"); break; }
        }
      }
    }
  }

  // ---- MEJORAS de unidades: sube hasta el MÁX según dificultad ----
  // Sube la stat de menor nivel (para subir de Nv parejo); al maxear las que
  // cuentan, compra el especial y luego la armadura del tank (mejoras extra).
  if (ai.aiUpgTimer <= 0) {
    ai.aiUpgTimer = D.upgEvery * (0.7 + Math.random() * 0.6);
    const aiUnitOrder = UNIT_TYPES.filter(t => UnitDB.isStyleAvailable(t, ai.age)).sort(
      (a, b) => D.comp[TYPE_I[b]] - D.comp[TYPE_I[a]]);
    for (const t of aiUnitOrder) {
      if (D.comp[TYPE_I[t]] < 0.12) continue; // no invierte en tipos que casi no usa
      const gating = UNIT_LEVEL_STATS[t];
      // stat que cuenta para el nivel con menor progreso
      let lowStat = null, lowLvl = Infinity;
      for (const s of gating) { const lv = ai.upg[ai.age][t][s]; if (lv < lowLvl) { lowLvl = lv; lowStat = s; } }
      if (lowLvl < MAX_UPG) {
        const cost = upgradeCost(ai.age, t, lowStat, lowLvl);
        if (ai.gold > cost * D.upgAfford) { tryUpgrade("enemy", t, lowStat); break; }
      } else {
        // ya está a Nv6: comprar especial (si la dificultad lo permite)
        if (D.buySpecial && !ai.specials[t] && ai.gold > specialCost(t) * 1.15) { tryBuySpecial("enemy", t); break; }
        // tank: subir armadura extra
        if (t === "tank" && ai.upg[ai.age].tank.armor < MAX_UPG) {
          const c = upgradeCost(ai.age, "tank", "armor", ai.upg[ai.age].tank.armor);
          if (ai.gold > c * D.upgAfford) { tryUpgrade("enemy", "tank", "armor"); break; }
        }
      }
    }
  }

  // ---- SPAWN ----
  if (ai.aiTimer > 0) return;
  const maxUnits = Math.floor(D.maxUnits * (1 + ai.age * 0.12));
  if (army >= maxUnits) { ai.aiTimer = 0.5; return; }
  // si el ejército ya está casi lleno, fácil/medio a veces "descansan" (errores)
  if (army >= maxUnits * D.fill && Math.random() < D.idle) { ai.aiTimer = D.spawnMin; return; }

  // Composición objetivo, adaptada a la del jugador (contras)
  const comp = D.comp.slice();
  if (pArmy > 0 && D.react > 0) {
    const pfMelee = (pCount["melee"] || 0) / pArmy;
    const pfRange = (pCount["range"] || 0) / pArmy;
    const pfTank  = (pCount["tank"] || 0) / pArmy;
    comp[1] += D.react * (pfTank * 0.5);              // range castiga a los tanks
    comp[2] += D.react * (pfRange * 0.35);             // tank aguanta a los range
    comp[0] += D.react * (pfRange * 0.2 + pfMelee * 0.1);  // melee presiona
  }
  // elegir el tipo con mayor déficit respecto al objetivo
  const types = UNIT_TYPES.filter(t => UnitDB.isStyleAvailable(t, ai.age));
  const cur = types.map(t => curCount[t]);
  let sum = 0; for (let i = 0; i < types.length; i++) sum += comp[TYPE_I[types[i]]];
  let bestT = types[0] || "melee", bestDef = -Infinity;
  for (let i = 0; i < types.length; i++) {
    const ti = TYPE_I[types[i]];
    const want = (comp[ti] / sum) * (army + 1);
    const def = want - cur[i];
    if (def > bestDef) { bestDef = def; bestT = types[i]; }
  }
  // asegurar tanques: si la dificultad los valora y no hay ninguno vivo, ahorrar para uno
  if (types.includes("tank") && D.comp[2] >= 0.15 && tc === 0 && ai.gold >= STATS[ai.age].tank.cost * 0.4) bestT = "tank";

  // reservar oro para el próximo aldeano (tras un pequeño ejército inicial)
  const reserve = (ai.villagers < wantVill) ? villagerCost(ai.villagers) * 0.9 : 0;

  // ahorrar para la unidad deseada en vez de spamear melee
  let cost = STATS[ai.age][bestT].cost;
  // umbral de espera: cuanto mayor D.save, antes empieza a ahorrar para la cara
  const waitThresh = cost * (1 - D.save * 0.55); // extreme≈0.45·c, easy≈0.75·c
  if (ai.gold < cost) {
    if (ai.gold >= waitThresh) { ai.aiTimer = 0.4; return; } // casi alcanza: ahorrar
    // si no, comprar la mejor (más cara) alternativa asequible
    bestT = null;
    for (const t of types) {
      if (ai.gold >= STATS[ai.age][t].cost && (!bestT || STATS[ai.age][t].cost > STATS[ai.age][bestT].cost)) bestT = t;
    }
    if (!bestT) { ai.aiTimer = 0.5; return; }
    cost = STATS[ai.age][bestT].cost;
  }

  // si gastar dejaría sin oro para el aldeano pendiente, esperar (ya con ejército base)
  if (army >= 2 && reserve > 0 && ai.gold - cost < reserve) { ai.aiTimer = 0.6; return; }

  const ok = trySpawn("enemy", bestT);
  ai.aiTimer = ok ? (D.spawnMin + Math.random() * 0.5) : 0.4;
}

// ---- Render ----------------------------------------------------------
function drawBackground() {
  // imagen única que cubre el MUNDO (1280x540), anclada abajo: el primer plano
  // queda al ras del suelo/HUD y se ve menos "expandida". La cámara muestra una
  // parte de ella (sin duplicar y sin huecos).
  const img = IMG["assets/bg/wallpaper.png"] || IMG["assets/bg/background.png"];
  if (img) {
    const scale = Math.max(WORLD_W / img.width, WORLD_H / img.height); // cover del mundo
    const w = img.width * scale, h = img.height * scale;
    const dx = (WORLD_W - w) / 2;
    const dy = WORLD_H - h; // anclar al fondo
    ctx.drawImage(img, dx, dy, w, h);
  } else {
    ctx.fillStyle = "#3a4d6b"; ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  }
}

function drawBase(side) {
  const st = G[side];
  const im = IMG[`assets/bases/${AGES[st.age]}/base.png`];
  const x = side === "player" ? PLAYER_BASE_X : ENEMY_BASE_X;
  if (im) {
    const w = im.width, h = im.height;
    ctx.save();
    ctx.translate(x, GROUND_Y + 20);
    if (side === "enemy") ctx.scale(-1, 1);
    ctx.drawImage(im, -w / 2, -h, w, h);
    ctx.restore();
  }
}


function drawTowers(side) {
  const st = G[side];
  const flip = side === "enemy";
  for (let i = 0; i < st.slots; i++) {
    const t = st.towers[i];
    const p = towerPos(side, i);
    if (!t) {
      ctx.fillStyle = "rgba(255,255,255,.10)";
      ctx.beginPath(); ctx.ellipse(p.x, p.y + 6, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
      continue;
    }

    // Escoger sprite base o frame de ataque
    let im;
    if (t.fireAnim > 0) {
      const projIdx = st.age * 3 + (t.type - 1);
      const frameNum = t.animFrame + 1;
      im = IMG[`assets/towers/${AGES[st.age]}/t${t.type}/${AGES[st.age]}_turret_${t.type}_attack${String(frameNum).padStart(4, "0")}.png`];
    }
    if (!im) im = IMG[`assets/towers/${AGES[st.age]}/t${t.type}.png`];
    if (!im) continue;

    const baseH = 56 + st.age * 4;
    let h = baseH;
    let w = im.width * (h / im.height);
    if (w > 90) { const r = 90 / w; w = 90; h *= r; }
    if (w < 40) { const r = 40 / w; w = 40; h *= r; }

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath(); ctx.ellipse(p.x, p.y + 6, w * 0.4, 4, 0, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.translate(p.x, p.y - 8);
    if (flip) ctx.scale(-1, 1);
    ctx.rotate(flip ? -(t.angle || 0) : (t.angle || 0));

    if (t.fireAnim > 0) {
      const recoil = -4 * (t.fireAnim / 0.15);
      ctx.translate(recoil, 0);
    }

    let sx = 1, sy = 1;
    if (t.fireAnim > 0.1) { sx = 1.08; sy = 0.92; }
    ctx.scale(sx, sy);

    ctx.drawImage(im, -w / 2, -h, w, h);
    ctx.restore();
  }
}

function render(paused) {
  // limpiar todo el buffer
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, BW, BH);

  // transformación de cámara: mundo -> buffer
  ctx.setTransform(camScale, 0, 0, camScale, -camX * camScale, -camY * camScale);

  drawBackground();
  drawBase("player");
  drawBase("enemy");
  drawTowers("player");
  drawTowers("enemy");

  const sorted = [...G.units].sort((a, b) => a.y - b.y || a.x - b.x);
  for (const u of sorted) u.draw();
  for (const p of G.projectiles) p.draw();
  for (const f of G.floats) f.draw();

  // overlay de pausa en espacio de pantalla
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (paused) {
    ctx.fillStyle = "rgba(0,0,0,.45)";
    ctx.fillRect(0, 0, BW, BH);
    ctx.fillStyle = "#f7c948";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.round(BH * 0.09)}px sans-serif`;
    ctx.fillText("⏸ PAUSA", BW / 2, BH / 2);
    ctx.font = `${Math.round(BH * 0.035)}px sans-serif`;
    ctx.fillStyle = "#a0aec0";
    ctx.fillText("Presiona ⏸ para reanudar", BW / 2, BH / 2 + BH * 0.09);
  }
}

// ---- Bucle principal (timestep fijo 1/60) ----------------------------
const FIXED_DT = 1 / 60;
const STATE_INTERVAL = 1 / 30; // frecuencia de emisión de estado del host
let acc = 0;
let last = 0;
let loopRunning = false;
let syncTimer = 0;
let gameSpeed = 1; // x2 solo en modo VS IA
function loop(ts) {
  const dt = Math.min(0.1, (ts - last) / 1000 || 0);
  last = ts;
  if (!document.getElementById("game").classList.contains("hidden")) {
    const guest = G.mode === "online" && !isSyncHost;
    if (!paused && !guest) {
      // online siempre x1 (sincronía); VS IA y test permiten x2
      acc += dt * (G.mode === "ai" || G.mode === "test" ? gameSpeed : 1);
      if (acc > 0.2) acc = 0.2;
      while (acc >= FIXED_DT) {
        update(FIXED_DT);
        acc -= FIXED_DT;
      }
      // el host emite el estado autoritativo completo a ~30 Hz
      if (G.mode === "online" && isSyncHost && !G.over && ws && ws.readyState === 1) {
        syncTimer += dt;
        if (syncTimer >= STATE_INTERVAL) {
          syncTimer = 0;
          ws.send(JSON.stringify({ type: "state", s: serializeState() }));
        }
      }
    }
    render(paused);
    syncUI();
  }
  requestAnimationFrame(loop);
}

// ---- Tooltip y popup en canvas ----------------------------------------
const unitTooltip = document.createElement("div");
unitTooltip.id = "unit-tooltip";
unitTooltip.className = "hidden";
document.getElementById("game").appendChild(unitTooltip);

let towerSellPopup = null;
function closeTowerSellPopup(e) {
  if (towerSellPopup && !towerSellPopup.contains(e.target) && e.target !== CV) {
    towerSellPopup.remove(); towerSellPopup = null;
    document.removeEventListener("mousedown", closeTowerSellPopup);
  }
}

CV.addEventListener("mousemove", (e) => {
  if (G.over) return;
  const rect = CV.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (CV.width / rect.width);
  const my = (e.clientY - rect.top) * (CV.height / rect.height);
  // Convertir mouse a coordenadas de mundo
  const wx = mx / camScale + camX;
  const wy = my / camScale + camY;
  let closest = null, minDist = 50;
  for (const u of G.units) {
    if (u.hp <= 0) continue;
    const dist = Math.hypot(u.x - wx, (u.y - 50) - wy);
    if (dist < minDist) { minDist = dist; closest = u; }
  }
  if (closest) {
    const gameEl = document.getElementById("game");
    const gameRect = gameEl.getBoundingClientRect();
    unitTooltip.style.left = (e.clientX - gameRect.left + 16) + "px";
    unitTooltip.style.top = (e.clientY - gameRect.top - 28) + "px";
    // stats reales de ESA unidad (horneados al nacer), no los de la edad actual
    const lvTxt = (closest.lvl || 1) >= MAX_UNIT_LEVEL ? "Nv MAX" : "Nv " + (closest.lvl || 1);
    unitTooltip.innerHTML = `<div class="tt-lvl">${lvTxt}</div>`;
    unitTooltip.classList.remove("hidden");
  } else {
    unitTooltip.classList.add("hidden");
  }
});

// Popup para eliminar una unidad (zona de test). Reusa towerSellPopup + su cierre.
function showUnitDeletePopup(u, rect) {
  if (towerSellPopup) { towerSellPopup.remove(); towerSellPopup = null; }
  const gameEl = document.getElementById("game");
  const gameRect = gameEl.getBoundingClientRect();
  const bufX = (u.x - camX) * camScale;
  const bufY = ((u.y - 60) - camY) * camScale;
  const lvTxt = (u.lvl || 1) >= MAX_UNIT_LEVEL ? "NvMAX" : "Nv" + (u.lvl || 1);
  towerSellPopup = document.createElement("div");
  towerSellPopup.id = "tower-sell-popup";
  towerSellPopup.style.left = Math.round(bufX * (rect.width / CV.width) + (rect.left - gameRect.left)) + "px";
  towerSellPopup.style.top = Math.round(bufY * (rect.height / CV.height) + (rect.top - gameRect.top)) + "px";
  towerSellPopup.innerHTML = `
    <div class="tsp-info">${u.type} ${lvTxt} · ${u.side === "player" ? "tuya" : "enemiga"}</div>
    <div class="tsp-btns">
      <button id="ud-del" class="tsp-btn tsp-no">🗑 Eliminar</button>
      <button id="ud-cancel" class="tsp-btn tsp-yes">✕</button>
    </div>`;
  gameEl.appendChild(towerSellPopup);
  const close = () => { if (towerSellPopup) { towerSellPopup.remove(); towerSellPopup = null; } document.removeEventListener("mousedown", closeTowerSellPopup); };
  document.getElementById("ud-del").addEventListener("click", () => {
    const idx = G.units.indexOf(u);
    if (idx >= 0) G.units.splice(idx, 1);
    close();
  });
  document.getElementById("ud-cancel").addEventListener("click", close);
  document.removeEventListener("mousedown", closeTowerSellPopup);
  setTimeout(() => document.addEventListener("mousedown", closeTowerSellPopup), 0);
}

CV.addEventListener("click", (e) => {
  if (G.over) return;
  const rect = CV.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (CV.width / rect.width);
  const my = (e.clientY - rect.top) * (CV.height / rect.height);
  // Convertir mouse a coordenadas de mundo
  const wx = mx / camScale + camX;
  const wy = my / camScale + camY;

  // En zona de test: clickear una unidad permite eliminarla
  if (G.mode === "test") {
    let closest = null, minDist = 55;
    for (const u of G.units) {
      if (u.dead || u.dying) continue;
      const d = Math.hypot(u.x - wx, (u.y - 50) - wy);
      if (d < minDist) { minDist = d; closest = u; }
    }
    if (closest) { showUnitDeletePopup(closest, rect); return; }
  }

  const st = G.player;
  for (let i = 0; i < st.slots; i++) {
    const t = st.towers[i];
    if (!t) continue;
    const p = towerPos("player", i);
    const cx = p.x, cy = p.y - 8;
    if (Math.abs(wx - cx) < 50 && Math.abs(wy - cy) < 50) {
      if (towerSellPopup) { towerSellPopup.remove(); towerSellPopup = null; }
      const d = st.towerUpg.dmg[t.type - 1];
      const s = st.towerUpg.spd[t.type - 1];
      const ts = towerStats(st.age, t.type, d, s);
      const val = towerSellValue(t.type, st.age, d, s);
      // Posición del popup en px CSS relativa al contenedor #game
      const gameEl = document.getElementById("game");
      const gameRect = gameEl.getBoundingClientRect();
      const towerBufX = (cx - camX) * camScale;
      const towerBufY = (cy - camY) * camScale;
      towerSellPopup = document.createElement("div");
      towerSellPopup.id = "tower-sell-popup";
      towerSellPopup.style.left = Math.round(towerBufX * (rect.width / CV.width) + (rect.left - gameRect.left)) + "px";
      towerSellPopup.style.top = Math.round(towerBufY * (rect.height / CV.height) + (rect.top - gameRect.top) - 50) + "px";
      towerSellPopup.innerHTML = `
        <div class="tsp-info">T${t.type} ⚔${ts.dmg} ⏱${ts.cd.toFixed(2)}s</div>
        <div class="tsp-sell">Vender por ${val}🪙</div>
        <div class="tsp-btns">
          <button id="ts-confirm" class="tsp-btn tsp-yes">✔ Vender</button>
          <button id="ts-cancel" class="tsp-btn tsp-no">✕</button>
        </div>`;
      document.getElementById("game").appendChild(towerSellPopup);
      document.getElementById("ts-confirm").addEventListener("click", () => {
        playerSellTower(i);
        if (towerSellPopup) { towerSellPopup.remove(); towerSellPopup = null; }
        document.removeEventListener("mousedown", closeTowerSellPopup);
      });
      document.getElementById("ts-cancel").addEventListener("click", () => {
        if (towerSellPopup) { towerSellPopup.remove(); towerSellPopup = null; }
        document.removeEventListener("mousedown", closeTowerSellPopup);
      });
      document.removeEventListener("mousedown", closeTowerSellPopup);
      setTimeout(() => document.addEventListener("mousedown", closeTowerSellPopup), 0);
      break;
    }
  }
});

// ---- UI --------------------------------------------------------------
const elGold = document.getElementById("gold");
const elXpText = document.getElementById("xptext");
const elXpFill = document.getElementById("xpfill");
const elAge = document.getElementById("ageName");
const elEvolve = document.getElementById("evolveBtn");
const overlay = document.getElementById("overlay");
const diffWrap = document.getElementById("diffWrap");
const hpBars = {
  player: { fill: document.querySelector("#hpPlayer .bb-fill"), txt: document.querySelector("#hpPlayer .bb-txt") },
  enemy:  { fill: document.querySelector("#hpEnemy .bb-fill"),  txt: document.querySelector("#hpEnemy .bb-txt") },
};
function baseMaxHp(age) { return BASE_HP + age * 800; }
function updateHpBar(side) {
  const st = G[side];
  const pct = Math.max(0, Math.min(1, st.baseHp / baseMaxHp(st.age)));
  const b = hpBars[side];
  b.fill.style.width = (pct * 100) + "%";
  b.txt.textContent = Math.max(0, Math.round(st.baseHp));
}

// ---- Panel de economía / torres (jugador) ----------------------------
document.getElementById("econ-section").addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  if (b.dataset.act === "villager")  playerVillager();
  else if (b.dataset.act === "villagerupg") playerVillagerUpg();
  econSig = "";
});


let econSig = "";
function renderEcon() {
  const p = G.player, g = p.gold;
  const income = PASSIVE_GOLD + p.villagers * (VILLAGER_GOLD + p.villagerLvl * 2);
  const aff = (c) => (g >= c ? 1 : 0);
  let sig = p.age + "|" + p.villagers + "|" + p.villagerLvl + "|" + p.slots + "|" +
    p.towers.map((t) => (t ? t.type + "." + (p.towerUpg.dmg[t.type - 1]) + "." + (p.towerUpg.spd[t.type - 1]) : "_")).join(",");

  const vc = villagerCost(p.villagers);
  sig += "|v" + aff(vc);
  if (p.villagers > 0) sig += "|vu" + aff(villagerLvlCost(p.villagerLvl));
  for (let i = 0; i < p.slots; i++) {
    const t = p.towers[i];
    if (t) {
      const ud = p.towerUpg.dmg[t.type - 1];
      const us = p.towerUpg.spd[t.type - 1];
      sig += "|t" + i + ".t" + t.type + ".d" + ud + ".s" + us
        + (ud < MAX_TOWER_UPG ? "|ud" + aff(towerUpgCost(p.age, t.type, "dmg", ud)) : "")
        + (us < MAX_TOWER_UPG ? "|us" + aff(towerUpgCost(p.age, t.type, "spd", us)) : "");
    } else {
      const c1 = towerBuyCost(p.age, 1);
      const c2 = towerBuyCost(p.age, 2);
      const c3 = towerBuyCost(p.age, 3);
      sig += "|b" + i + ".c1" + aff(c1) + ".c2" + aff(c2) + ".c3" + aff(c3);
    }
  }
  if (p.slots < MAX_SLOTS) sig += "|s" + aff(SLOT_COST[p.slots]);
  if (sig === econSig) return;
  econSig = sig;

  // Econ section (villagers)
  let econHtml = `<div style="font-size:11px;color:#718096;margin-bottom:2px">🏘 Village</div>`;
  econHtml += `<span class="lbl">💰${income}/s</span>`;
  econHtml += `<div class="econ-card">`;
  if (p.villagers >= MAX_VILLAGERS) {
    econHtml += `<button disabled>👷 Máx</button>`;
  } else {
    econHtml += `<button data-act="villager" ${g < vc ? "disabled" : ""}>👷${vc}🪙 ${p.villagers}/${MAX_VILLAGERS}</button>`;
  }
  if (p.villagers > 0) {
    const vc2 = villagerLvlCost(p.villagerLvl);
    const killBonus = p.villagerLvl * VILLAGER_KILL_BONUS;
    const vIncome = VILLAGER_GOLD + p.villagerLvl * 2;
    if (p.villagerLvl >= MAX_VILLAGER_LVL) {
      econHtml += `<button disabled>👑 +${vIncome}/s +${killBonus}/kill</button>`;
    } else {
      econHtml += `<button data-act="villagerupg" ${g < vc2 ? "disabled" : ""}>⬆+${vIncome}/s +${killBonus}/k ${vc2}🪙</button>`;
    }
  }
  econHtml += `</div>`;
  document.getElementById("econ-section").innerHTML = econHtml;

}

let shopCards = [];
let towerCards = [];
let slotBtn = null;
function buildShop() {
  const cardsDiv = document.getElementById("cards-area");
  cardsDiv.innerHTML = "";
  shopCards = [];

  const pRace = G.playerRace || "humans";
  const age = G.player ? G.player.age : 0;
  const d = currentDeck && currentDeck[pRace] ? (currentDeck[pRace][age] || []) : UnitDB.getAvailableIdsByRace(pRace, age);
  d.forEach((uid, i) => {
    const u = UNIT_CATALOG[uid];
    if (!u) return;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="key">${i + 1}</div>
      <div class="thumb"><img src="${getUnitThumb(uid)}"></div>
      <div class="name">${u.name}</div>
      <div class="lvl"></div>
      <div class="cost"></div>
      <div class="stats"></div>`;
    card.addEventListener("click", () => playerSpawn(uid));
    cardsDiv.appendChild(card);
    shopCards.push({
      el: card, uid, type: u.combatStyle,
      img: card.querySelector("img"),
      name: card.querySelector(".name"),
      lvl: card.querySelector(".lvl"),
      cost: card.querySelector(".cost"),
      stats: card.querySelector(".stats"),
    });
  });

  // Cards de torres debajo de los guerreros
  towerCards = [];
  TOWER_TIERS.forEach((ty) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="key">T${ty}</div>
      <div class="thumb"><img></div>
      <div class="name">Torre T${ty}</div>
      <div class="cost"></div>
      <div class="stats"></div>`;
    const img = card.querySelector("img");
    const age = G.player ? G.player.age : 0;
    const key = `assets/towers/${AGES[age]}/t${ty}.png`;
    if (IMG[key]) img.src = IMG[key].src;
    card.addEventListener("click", () => {
      const p = G.player;
      for (let i = 0; i < p.slots; i++) {
        if (!p.towers[i]) { playerBuyTower(i, ty); break; }
      }
    });
    cardsDiv.appendChild(card);
    towerCards.push({ el: card, img, ty });
  });

  // panel de upgrades — unidades + torres lado a lado
  const upgPanel = document.getElementById("upg-panel");
  upgPanel.innerHTML = "";

  // Columna de upgrades de unidades (izquierda)
  const unitCol = document.createElement("div");
  unitCol.className = "upg-col";
  const upgRace = G.playerRace || "humans";
  const upgAge = G.player ? G.player.age : 0;
  const upgDeck = (currentDeck && currentDeck[upgRace]) ? (currentDeck[upgRace][upgAge] || []) : UnitDB.getAvailableIdsByRace(upgRace, upgAge);
  const upgradeTypes = [...new Set(upgDeck.map(uid => (UNIT_CATALOG[uid] || {}).combatStyle).filter(Boolean))];
  upgradeTypes.forEach((type, idx) => {
    const u = UnitDB.getUnitForStyle(upgRace, upgAge, type);
    const row = document.createElement("div");
    row.className = "upg-row";
    const grp = document.createElement("div");
    grp.className = "upg-group";
    const lbl = document.createElement("span");
    lbl.className = "upg-group-name";
    lbl.textContent = u ? u.name : type;
    grp.appendChild(lbl);
    UNIT_UPGS[type].forEach((stat) => {
      const btn = document.createElement("button");
      btn.className = "upg-pbtn";
      btn.dataset.type = type;
      btn.dataset.stat = stat;
      btn.addEventListener("click", () => playerUpgrade(type, stat));
      grp.appendChild(btn);
    });
    // botón de especial (se desbloquea al Nv6)
    const sbtn = document.createElement("button");
    sbtn.className = "upg-pbtn upg-special";
    sbtn.dataset.special = type;
    sbtn.addEventListener("click", () => playerBuySpecial(type));
    grp.appendChild(sbtn);
    row.appendChild(grp);
    unitCol.appendChild(row);
  });
  upgPanel.appendChild(unitCol);

  // Columna de upgrades de torres (derecha)
  const towerCol = document.createElement("div");
  towerCol.className = "upg-col";
  for (let idx = 0; idx < 3; idx++) {
    const ty = idx + 1;
    const row = document.createElement("div");
    row.className = "upg-row";
    const grp = document.createElement("div");
    grp.className = "upg-group";
    const lbl = document.createElement("span");
    lbl.className = "upg-group-name";
    lbl.textContent = "T" + ty;
    grp.appendChild(lbl);
    ["dmg", "spd"].forEach((stat) => {
      const btn = document.createElement("button");
      btn.className = "upg-pbtn";
      btn.dataset.towerType = ty;
      btn.dataset.stat = stat;
      btn.addEventListener("click", () => {
        const p = G.player;
        for (let i = 0; i < p.slots; i++) {
          const t = p.towers[i];
          if (t && t.type === ty) { playerUpgTower(i, stat); break; }
        }
      });
      grp.appendChild(btn);
    });
    row.appendChild(grp);
    towerCol.appendChild(row);
  }
  // Botón de slot extra debajo de las torres
  slotBtn = document.createElement("button");
  slotBtn.className = "slot-btn";
  slotBtn.textContent = "➕ Slot";
  slotBtn.addEventListener("click", playerBuySlot);
  towerCol.appendChild(slotBtn);
  upgPanel.appendChild(towerCol);

  refreshShopAge();
}

function effStats(side, age, type) {
  const cs = computeStats(age, type, G[side].upg[age][type], G[side].specials[type]);
  return {
    hp: Math.round(cs.hp),
    dmg: Math.round(cs.dmg),
    spd: Math.round(cs.cd * 100) / 100,
    range: Math.round(cs.range),
    armor: Math.round(cs.armor * 100),
  };
}

function refreshShopAge() {
  const age = G.player.age;
  for (const c of shopCards) {
    const u = UNIT_CATALOG[c.uid];
    if (!u) continue;
    const fr = frames(AGES[age], u.spriteId, "walk");
    const mid = fr[Math.floor(fr.length / 2)];
    if (mid) c.img.src = mid.src;
    c.name.textContent = u.name;
  }
  for (const tc of towerCards) {
    const key = `assets/towers/${AGES[age]}/t${tc.ty}.png`;
    if (IMG[key]) tc.img.src = IMG[key].src;
  }
}

let lastAge = -1;
function syncUI() {
  const p = G.player;
  elGold.textContent = Math.floor(p.gold);
  const need = p.age < EVOLVE_COST.length ? EVOLVE_COST[p.age] : p.xp;
  elXpText.textContent = Math.floor(p.xp) + "/" + need;
  elXpFill.style.width = Math.min(100, (p.xp / need) * 100) + "%";
  elAge.textContent = AGE_NAMES[p.age];

  if (p.age !== lastAge) { buildShop(); lastAge = p.age; }

  updateHpBar("player");
  updateHpBar("enemy");
  renderEcon();

  const canEvolve = p.age < AGES.length - 1 && p.xp >= EVOLVE_COST[p.age];
  elEvolve.disabled = !canEvolve;
  elEvolve.classList.toggle("ready", canEvolve);
  if (p.age >= AGES.length - 1) elEvolve.textContent = "⬆ Edad máxima";
  // fase del día
  dayFillEl.style.width = ((dayCycleTime / DAY_CYCLE_DURATION) * 100) + "%";

  for (const c of shopCards) {
    const s = STATS[p.age][c.type];
    const es = effStats("player", p.age, c.type);
    const lv = unitLevel(p.upg[p.age][c.type], p.specials[c.type], c.type);
    c.lvl.textContent = lv >= MAX_UNIT_LEVEL ? "Nv MAX" : "Nv " + lv;
    c.lvl.classList.toggle("maxed", lv >= MAX_UNIT_LEVEL);
    c.cost.textContent = s.cost + " 🪙";
    c.stats.textContent = c.type === "range"
      ? `❤${es.hp} ⚔${es.dmg} 🎯${es.range}`
      : (c.type === "tank" && es.armor > 0
          ? `❤${es.hp} ⚔${es.dmg} 🛡${es.armor}%`
          : `❤${es.hp} ⚔${es.dmg} ⏱${es.spd}s`);
    c.el.classList.toggle("disabled", !(p.gold >= s.cost && p.cd[c.type] <= 0));
  }
  // Cards de torres
  for (const tc of towerCards) {
    const ty = tc.ty;
    const c = towerBuyCost(p.age, ty);
    const upgDmg = p.towerUpg.dmg[ty - 1];
    const upgSpd = p.towerUpg.spd[ty - 1];
    const ts = towerStats(p.age, ty, upgDmg, upgSpd);
    tc.el.querySelector(".cost").textContent = c + " 🪙";
    tc.el.querySelector(".stats").textContent = `⚔${ts.dmg} ⏱${ts.cd.toFixed(2)}s`;
    const hasEmpty = p.towers.some(t => t === null);
    tc.el.classList.toggle("disabled", !(p.gold >= c && hasEmpty));
  }
  // panel de mejoras
  const upgBtns = document.querySelectorAll(".upg-pbtn");
  upgBtns.forEach((btn) => {
    const type = btn.dataset.type;
    const towerType = btn.dataset.towerType;
    const stat = btn.dataset.stat;
    const special = btn.dataset.special;
    if (special) {
      const owned = p.specials[special];
      const unlocked = unitLevel(p.upg[p.age][special], false, special) >= SPECIAL_LEVEL;
      if (owned) {
        btn.innerHTML = "★ ACTIVO";
        btn.disabled = true;
        btn.classList.add("owned");
        btn.title = specialDesc(special);
      } else if (!unlocked) {
        btn.innerHTML = "★ Nv6";
        btn.disabled = true;
        btn.classList.remove("owned");
        btn.title = "Sube las 3 mejoras al máximo (Nv6) para desbloquear el especial";
      } else {
        const sc = specialCost(special);
        btn.innerHTML = `★ ESP<br>${sc}🪙`;
        btn.disabled = p.gold < sc;
        btn.classList.remove("owned");
        btn.title = specialDesc(special) + ` · ${sc}🪙`;
      }
    } else if (type) {
      // Mejora de unidad
      const l = p.upg[p.age][type][stat];
      if (l >= MAX_UPG) {
        btn.innerHTML = "★MÁX";
        btn.disabled = true;
      } else {
        const uc = upgradeCost(p.age, type, stat, l);
        btn.innerHTML = `${UPG_LABEL[stat]} L${l+1}<br>${uc}🪙`;
        const su = STATS[p.age][type];
        const eff = stat === "dmg"   ? `+${Math.round(su.dmg * DMG_MULT * UPG_DMG * (DMG_UPG_RATE[type] || 1))} de daño`
                  : stat === "hp"    ? `+${Math.round(su.hp * UPG_HP)} de vida`
                  : stat === "range" ? `+${Math.round(su.range * UPG_RANGE)} de rango`
                  : stat === "armor" ? `+${Math.round(UPG_ARMOR * 100)}% de armadura (menos daño recibido)`
                  : `+${Math.round(UPG_SPD * 100)}% vel. de ataque`;
        btn.title = `${eff}  (Nv ${l+1}/${MAX_UPG} · ${uc}🪙)`;
        btn.disabled = p.gold < uc;
      }
    } else if (towerType) {
      // Mejora de torre
      const ty = +towerType;
      const lvl = p.towerUpg[stat][ty - 1];
      if (lvl >= MAX_TOWER_UPG) {
        btn.innerHTML = "★MÁX";
        btn.disabled = true;
      } else {
        const uc = towerUpgCost(p.age, ty, stat, lvl);
        const lbl = { dmg: "+ATK", spd: "+VEL" };
        btn.innerHTML = `${lbl[stat]} L${lvl+1}<br>${uc}🪙`;
        let eff;
        if (stat === "dmg") {
          const sp = p.towerUpg.spd[ty - 1];
          const d = towerStats(p.age, ty, lvl + 1, sp).dmg - towerStats(p.age, ty, lvl, sp).dmg;
          eff = `+${Math.round(d)} de daño`;
        } else {
          eff = `+12% vel. de ataque`;
        }
        btn.title = `${eff}  (Nv ${lvl+1}/${MAX_TOWER_UPG} · ${uc}🪙)`;
        btn.disabled = p.gold < uc;
      }
    }
  });
  // Botón de slot extra
  if (slotBtn) {
    const full = p.slots >= MAX_SLOTS;
    slotBtn.classList.toggle("hidden", full);
    if (!full) {
      const sc = SLOT_COST[p.slots];
      slotBtn.textContent = `➕ Slot ${p.slots}/${MAX_SLOTS} ${sc}🪙`;
      slotBtn.disabled = p.gold < sc;
    }
  }
  // Panel de control del enemigo (zona de test)
  if (G.mode === "test") {
    const e = G.enemy;
    const tg = document.getElementById("tp-gold"); if (tg) tg.textContent = Math.floor(e.gold);
    const ta = document.getElementById("tp-age"); if (ta) ta.textContent = AGE_NAMES[e.age];
    document.querySelectorAll("#test-panel [data-tlvl]").forEach((el) => {
      const t = el.dataset.tlvl;
      const lv = unitLevel(e.upg[e.age][t], e.specials[t], t);
      el.textContent = lv >= MAX_UNIT_LEVEL ? "NvMAX" : "Nv" + lv;
    });
  }
}

function endGame(win) {
  if (G.over) return;
  G.over = true;
  // solo el host detecta el fin (simula); informa el resultado al guest
  if (G.mode === "online" && isSyncHost && ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ type: "game_over", hostWon: win }));
  }
  document.getElementById("overTitle").textContent = win ? "¡Victoria! 🏆" : "Derrota 💀";
  document.getElementById("overTitle").style.color = win ? "#7af0c0" : "#e0524a";
  document.getElementById("overMsg").textContent = win
    ? "Destruiste la base enemiga." : "Tu base fue destruida.";
  overlay.classList.remove("hidden");
}

function resetGame() {
  G.player = freshSide(250);
  G.enemy = freshSide(200);
  G.units = []; G.projectiles = []; G.floats = []; G.over = false;
  G.mode = "ai";
  lastAge = -1; econSig = ""; dayCycleTime = 0;
  camX = 0; clampCam();
  overlay.classList.add("hidden");
  acc = 0; syncTimer = 0;
}

function showMenu() {
  if (ws) { ws.close(); ws = null; }
  stopMusic();
  document.getElementById("game").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("online-menu").classList.add("hidden");
  document.getElementById("test-panel").classList.add("hidden");
  diffWrap.classList.remove("hidden");
  // Sincronizar selector de raza
  const sel = document.getElementById("main-race-select");
  if (sel) sel.value = loadActiveRace();
}

function startGame() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("online-menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("debugBtn").classList.remove("hidden");
  pauseBtn.classList.remove("hidden");
  speedBtn.classList.remove("hidden");
  diffWrap.classList.remove("hidden");
  paused = false;
  pauseBtn.textContent = "⏸";
  gameSpeed = 1; speedBtn.textContent = "⏩ x1";
  document.getElementById("test-panel").classList.add("hidden");
  resetGame();
  G.mode = "ai";
  buildShop();
  requestAnimationFrame(resizeCanvas); // el canvas ya es visible
  startMusic();
  if (!loopRunning) { loopRunning = true; requestAnimationFrame(loop); }
}

// ---- Zona de test: controlas ambos bandos (HUD abajo = tú, panel arriba = enemigo)
function startTestGame() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("online-menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("debugBtn").classList.remove("hidden");
  pauseBtn.classList.remove("hidden");
  speedBtn.classList.remove("hidden");
  diffWrap.classList.add("hidden");
  document.getElementById("test-panel").classList.remove("hidden");
  paused = false; pauseBtn.textContent = "⏸";
  gameSpeed = 1; speedBtn.textContent = "⏩ x1";
  resetGame();
  G.mode = "test";
  G.player.gold += 5000; G.enemy.gold += 5000;
  buildShop();
  requestAnimationFrame(resizeCanvas);
  startMusic();
  if (!loopRunning) { loopRunning = true; requestAnimationFrame(loop); }
}

function startOnlineGame() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("online-menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("debugBtn").classList.add("hidden");
  pauseBtn.classList.add("hidden");
  speedBtn.classList.add("hidden");
  diffWrap.classList.add("hidden");
  document.getElementById("test-panel").classList.add("hidden");
  gameSpeed = 1;
  G.playerRace = document.getElementById("main-race-select").value;
  currentDeck = loadDeck();
  resetGame();
  buildShop();
  G.mode = "online";
  document.getElementById("restartBtn").disabled = false;
  requestAnimationFrame(resizeCanvas);
  startMusic();
  if (!loopRunning) { loopRunning = true; requestAnimationFrame(loop); }
}

// Procesa mensajes de juego comunes a host y guest. Devuelve true si lo manejó.
function handleNetGameMsg(msg) {
  switch (msg.type) {
    case "game_start":
      G.mode = "online";
      isSyncHost = msg.side === "player";
      acc = 0;
      syncTimer = 0;
      startOnlineGame();
      return true;
    case "state":
      if (!G.over && !isSyncHost) applyState(msg.s);
      return true;
    case "cmd":
      if (!G.over && isSyncHost) handleGuestCmd(msg.cmd);
      return true;
    case "opponent_won": {
      // el host informa el resultado; el guest ganó si el host perdió
      if (!G.over) {
        const guestWon = msg.hostWon === false;
        if (guestWon) G.enemy.baseHp = 0; else G.player.baseHp = 0;
        endGame(guestWon);
        document.getElementById("overMsg").textContent = guestWon
          ? "Destruiste la base enemiga." : "Tu base fue destruida.";
      }
      return true;
    }
    case "opponent_rematch":
      if (G.over) document.getElementById("overMsg").textContent = "El oponente quiere revancha. ¡Pulsa Jugar de nuevo!";
      return true;
    case "rematch_failed":
      document.getElementById("overMsg").textContent = "No se pudo: el oponente ya no está.";
      document.getElementById("restartBtn").disabled = true;
      return true;
    case "opponent_disconnected":
      if (!G.over) {
        endGame(true);
        document.getElementById("overMsg").textContent = "El oponente se desconectó.";
      } else {
        document.getElementById("restartBtn").disabled = true;
      }
      return true;
  }
  return false;
}

// ---- Eventos ---------------------------------------------------------
elEvolve.addEventListener("click", () => playerEvolve());

document.getElementById("restartBtn").addEventListener("click", () => {
  if (G.mode === "ai") {
    overlay.classList.add("hidden");
    startGame();
  } else {
    // online: pedir revancha coordinada; se reinicia al recibir game_start
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify({ type: "rematch" }));
      document.getElementById("overMsg").textContent = "Esperando revancha del oponente…";
      document.getElementById("restartBtn").disabled = true;
    } else {
      overlay.classList.add("hidden");
      showMenu();
    }
  }
});
document.getElementById("menuBtn").addEventListener("click", () => {
  overlay.classList.add("hidden");
  G.mode = "ai"; // evitar que onclose dispare endGame
  if (ws) { ws.close(); ws = null; }
  showMenu();
});

// botón de pausa
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶" : "⏸";
  pauseBtn.title = paused ? "Reanudar" : "Pausar";
});

// botón de velocidad x2 (solo VS IA)
const speedBtn = document.getElementById("speedBtn");
speedBtn.addEventListener("click", () => {
  gameSpeed = gameSpeed === 1 ? 2 : 1;
  speedBtn.textContent = "⏩ x" + gameSpeed;
});

// selector de dificultad (reinicia la partida al cambiar)
const diffBtns = document.querySelectorAll(".diff");
diffBtns.forEach((b) => b.addEventListener("click", () => {
  difficulty = b.dataset.d;
  diffBtns.forEach((x) => x.classList.toggle("active", x === b));
  const inGame = !document.getElementById("game").classList.contains("hidden");
  if (G.mode === "ai" && inGame) {
    resetGame();
    G.floats.push(new FloatText(camX + viewW / 2, WORLD_H / 2,
      "Dificultad: " + b.textContent + " — partida reiniciada", "#f7c948"));
  }
}));

// ---- Música y configuración -----------------------------------------
const bgm = document.getElementById("bgm");
let musicMuted = localStorage.getItem("aow_muted") === "1";
let musicVol = parseFloat(localStorage.getItem("aow_vol"));
if (isNaN(musicVol)) musicVol = 0.30;
bgm.volume = musicVol;
bgm.muted = musicMuted;

function startMusic() {
  if (bgm.paused) { bgm.currentTime = 0; }
  const pr = bgm.play();
  if (pr && pr.catch) pr.catch(() => {}); // ignora bloqueo de autoplay
}
function stopMusic() { bgm.pause(); }

const configBtn = document.getElementById("configBtn");
const configPanel = document.getElementById("config-panel");
const muteBtn = document.getElementById("muteBtn");
const volSlider = document.getElementById("volSlider");

function refreshAudioUI() {
  muteBtn.textContent = musicMuted ? "🔇 Off" : "🔊 On";
  muteBtn.classList.toggle("muted", musicMuted);
  volSlider.value = Math.round(musicVol * 100);
}
refreshAudioUI();

configBtn.addEventListener("click", () => {
  configPanel.classList.toggle("hidden");
  const menuBtn = document.getElementById("cfg-menu-btn");
  if (!configPanel.classList.contains("hidden")) {
    if (G.mode === "online") {
      menuBtn.textContent = "🏳 Rendirse";
      menuBtn.classList.add("surrender");
    } else {
      menuBtn.textContent = "⬅ Volver al menú";
      menuBtn.classList.remove("surrender");
    }
  }
});
document.getElementById("cfg-menu-btn").addEventListener("click", () => {
  configPanel.classList.add("hidden");
  if (G.mode === "online") {
    G.over = true;
    endGame(true);
    document.getElementById("overMsg").textContent = "Te has rendido.";
  } else {
    showMenu();
  }
});
muteBtn.addEventListener("click", () => {
  musicMuted = !musicMuted;
  bgm.muted = musicMuted;
  localStorage.setItem("aow_muted", musicMuted ? "1" : "0");
  if (!musicMuted && bgm.paused &&
      !document.getElementById("game").classList.contains("hidden")) startMusic();
  refreshAudioUI();
});
volSlider.addEventListener("input", () => {
  musicVol = volSlider.value / 100;
  bgm.volume = musicVol;
  localStorage.setItem("aow_vol", String(musicVol));
});
// cerrar el panel al tocar fuera
document.addEventListener("click", (e) => {
  if (!configPanel.classList.contains("hidden") &&
      !configPanel.contains(e.target) && e.target !== configBtn) {
    configPanel.classList.add("hidden");
  }
});

// botón de debug: oro infinito + XP máximo
document.getElementById("debugBtn").addEventListener("click", () => {
  G.player.gold += 10000;
  const need = G.player.age < EVOLVE_COST.length ? EVOLVE_COST[G.player.age] : 99999;
  G.player.xp += need * 2;
});

function getUnitThumb(uid) {
  const u = UNIT_CATALOG[uid];
  if (!u) return "❓";
  const sid = u.spriteId;
  const age = AGES[u.homeEra];
  const key = `assets/units/${age}/${sid}/walk/0.png`;
  const im = IMG[key];
  if (im) return `<img src="${im.src}" alt="${u.name}" style="width:28px;height:28px;object-fit:contain;image-rendering:pixelated">`;
  const key2 = `assets/units/${age}/${sid}/idle/0.png`;
  const im2 = IMG[key2];
  if (im2) return `<img src="${im2.src}" alt="${u.name}" style="width:28px;height:28px;object-fit:contain;image-rendering:pixelated">`;
  return u.icon || "❓";
}

// ---- Deck Builder ----------------------------------------------------
const DECK_MAX = 6;
const DECK_MIN = 0;

function defaultDeck() {
  const d = {};
  for (const race of RACES) {
    d[race] = {};
    for (let a = 0; a < AGES.length; a++) {
      d[race][a] = [];
    }
  }
  // Solo humanos tiene unidades por ahora (y zerling para monsters)
  for (let a = 0; a < AGES.length; a++) {
    d["humans"][a] = UnitDB.getAvailableIdsByRace("humans", a);
    d["monsters"][a] = UnitDB.getAvailableIdsByRace("monsters", a);
  }
  return d;
}

function loadDeck() {
  try {
    const raw = localStorage.getItem("aow_deck");
    if (raw) {
      const d = JSON.parse(raw);
      let ok = true;
      for (const race of RACES) {
        if (!d[race] || typeof d[race] !== "object") { ok = false; break; }
        for (let a = 0; a < AGES.length; a++) {
          if (!Array.isArray(d[race][a]) || d[race][a].length < DECK_MIN) { ok = false; break; }
          for (const uid of d[race][a]) {
            if (!UNIT_CATALOG[uid]) { ok = false; break; }
          }
          if (!ok) break;
        }
        if (!ok) break;
      }
      if (ok) return d;
    }
  } catch {}
  return defaultDeck();
}

function saveDeck(deck) {
  localStorage.setItem("aow_deck", JSON.stringify(deck));
  localStorage.setItem("aow_active_race", currentRace);
}

// ---- Propiedad de razas (colección del jugador) ----------------------
// Una raza se "posee" si tiene unidades en el catálogo o fue desbloqueada.
function ownedRaces() {
  let unlocked = [];
  try { unlocked = JSON.parse(localStorage.getItem("aow_owned_races") || "[]"); } catch {}
  return RACES.filter(r => UnitDB.getByRace(r).length > 0 || unlocked.includes(r));
}
function isRaceOwned(race) { return ownedRaces().includes(race); }

// ¿El mazo de la raza está listo? (≥1 unidad en cada era donde la raza tiene unidades)
function deckReady(race, deck) {
  if (!isRaceOwned(race)) return false;
  deck = deck || loadDeck();
  const rd = deck[race];
  if (!rd) return false;
  for (let a = 0; a < AGES.length; a++) {
    if (UnitDB.getByRaceAndEra(race, a).length > 0 && (!rd[a] || rd[a].length < 1)) return false;
  }
  return true;
}

// Gate previo a combate: exige un mazo preseleccionado válido.
function ensurePlayable() {
  const race = loadActiveRace();
  if (!deckReady(race)) {
    alert(`Tu mazo de ${RACE_NAMES[race]} no está completo.\nNecesitas al menos 1 unidad por cada era disponible. Abriendo el editor de mazo…`);
    openDeckBuilder();
    return false;
  }
  return true;
}

function loadActiveRace() {
  let r;
  try { r = localStorage.getItem("aow_active_race") || "humans"; }
  catch { r = "humans"; }
  const owned = ownedRaces();
  return owned.includes(r) ? r : (owned[0] || "humans");
}

let currentDeckAge = 0;
let currentRace = "humans";
let currentDeck = null;

function openDeckBuilder() {
  currentDeck = loadDeck();
  currentRace = loadActiveRace();
  currentDeckAge = 0;
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("deck-builder").classList.remove("hidden");
  renderDeckBuilder();
}

function closeDeckBuilder() {
  document.getElementById("deck-builder").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
}

function renderDeckBuilder() {
  renderRaceTabs();
  renderDeckTabs();
  renderDeckPool();
  renderDeckSlots();
}

function renderRaceTabs() {
  const cont = document.getElementById("deck-race-tabs");
  cont.innerHTML = "";
  for (const race of RACES) {
    const owned = isRaceOwned(race);
    const tab = document.createElement("button");
    tab.className = "deck-tab deck-race-tab" + (race === currentRace ? " active" : "") + (owned ? "" : " locked");
    tab.textContent = (owned ? "" : "🔒 ") + RACE_NAMES[race];
    if (owned) {
      tab.addEventListener("click", () => { currentRace = race; currentDeckAge = 0; renderDeckBuilder(); });
    } else {
      tab.disabled = true;
      tab.title = "Raza bloqueada — aún no la tienes";
    }
    cont.appendChild(tab);
  }
}

function renderDeckTabs() {
  const cont = document.getElementById("deck-tabs");
  cont.innerHTML = "";
  for (let a = 0; a < AGES.length; a++) {
    const tab = document.createElement("button");
    tab.className = "deck-tab" + (a === currentDeckAge ? " active" : "");
    tab.textContent = AGE_NAMES[a];
    tab.addEventListener("click", () => { currentDeckAge = a; renderDeckBuilder(); });
    cont.appendChild(tab);
  }
}

function renderDeckPool() {
  const list = document.getElementById("deck-pool-list");
  const filter = document.getElementById("deck-filter").value.toLowerCase();
  list.innerHTML = "";
  const deckForAge = (currentDeck[currentRace] && currentDeck[currentRace][currentDeckAge]) || [];
  const available = UnitDB.getAvailableIdsByRace(currentRace, currentDeckAge).filter((uid) => {
    const u = UNIT_CATALOG[uid];
    if (!filter) return true;
    return u.name.toLowerCase().includes(filter)
      || String(u.id).includes(filter)
      || u.tags.some(t => t.includes(filter))
      || u.counters.toLowerCase().includes(filter)
      || u.desc.toLowerCase().includes(filter);
  });
  for (const uid of available) {
    const u = UNIT_CATALOG[uid];
    const inDeck = deckForAge.includes(uid);
    const thumb = getUnitThumb(uid);
    const card = document.createElement("div");
    card.className = "dcard" + (inDeck ? " in-deck" : "");
    card.setAttribute("draggable", inDeck ? "false" : "true");
    card.dataset.uid = uid;
    card.innerHTML = `
      <div class="dci">${thumb}</div>
      <div class="dbody">
        <div class="dtop">
          <span class="dcn">${u.name}</span>
          <span class="dcc">🪙${u.cost}</span>
        </div>
        <div class="dtags">
          ${u.tags.map(t => `<span class="dctag dctag-tag-${t}">${t}</span>`).join("")}
          ${u.strongVs.length ? u.strongVs.map(s => `<span class="dctag dctag-strong">+${s}</span>`).join("") : ""}
          ${u.weakVs.length ? u.weakVs.map(s => `<span class="dctag dctag-weak">-${s}</span>`).join("") : ""}
        </div>
        <div class="ddesc">${u.desc}</div>
      </div>`;
    if (!inDeck) {
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", uid);
        card.classList.add("dragging");
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
      card.addEventListener("click", () => addToDeck(uid));
    }
    list.appendChild(card);
  }
}

function renderDeckSlots() {
  const list = document.getElementById("deck-slots-list");
  list.innerHTML = "";
  const deckForAge = (currentDeck[currentRace] && currentDeck[currentRace][currentDeckAge]) || [];
  document.getElementById("deck-count").textContent = deckForAge.length + "/" + DECK_MAX;
  for (let i = 0; i < DECK_MAX; i++) {
    const slot = document.createElement("div");
    slot.className = "deck-slot";
    slot.dataset.idx = i;
    if (i < deckForAge.length) {
      const uid = deckForAge[i];
      const u = UNIT_CATALOG[uid];
      const thumb = getUnitThumb(uid);
      slot.innerHTML = `
        <div class="ds-num">${i + 1}</div>
        <div class="dci">${thumb}</div>
        <div class="dbody">
          <div class="dtop">
            <span class="dcn">${u.name}</span>
            <span class="dcc">🪙${u.cost}</span>
          </div>
          <div class="dtags">
            ${u.tags.map(t => `<span class="dctag dctag-tag-${t}">${t}</span>`).join("")}
          </div>
        </div>
        <button class="ds-rm" data-uid="${uid}" title="Quitar">✕</button>`;
      slot.querySelector(".ds-rm").addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromDeck(uid);
      });
    } else {
      slot.innerHTML = `
        <div class="ds-num">${i + 1}</div>
        <div class="ds-empty">Arrastra una unidad aquí</div>`;
      slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("dragover"); });
      slot.addEventListener("dragleave", () => slot.classList.remove("dragover"));
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.classList.remove("dragover");
        const uid = e.dataTransfer.getData("text/plain");
        addToDeck(uid);
      });
    }
    list.appendChild(slot);
  }
}

function addToDeck(uid) {
  if (!uid || !UNIT_CATALOG[uid]) return;
  const u = UNIT_CATALOG[uid];
  if (u.race !== currentRace) return; // solo unidades de la raza actual
  const deck = currentDeck[currentRace][currentDeckAge];
  if (deck.length >= DECK_MAX) return;
  if (deck.includes(uid)) return;
  deck.push(uid);
  document.getElementById("deck-error").classList.add("hidden");
  renderDeckBuilder();
}

function removeFromDeck(uid) {
  if (!uid) return;
  const deck = currentDeck[currentRace][currentDeckAge];
  const idx = deck.indexOf(uid);
  if (idx === -1) return;
  deck.splice(idx, 1);
  document.getElementById("deck-error").classList.add("hidden");
  renderDeckBuilder();
}

document.getElementById("deck-filter").addEventListener("input", () => renderDeckPool());

document.getElementById("deck-back-btn").addEventListener("click", closeDeckBuilder);

document.getElementById("deck-reset-btn").addEventListener("click", () => {
  if (!confirm("¿Reiniciar mazo de " + RACE_NAMES[currentRace] + " a valores por defecto?")) return;
  currentDeck[currentRace] = {};
  for (let a = 0; a < AGES.length; a++) {
    currentDeck[currentRace][a] = UnitDB.getAvailableIdsByRace(currentRace, a);
  }
  renderDeckBuilder();
});

document.getElementById("deck-save-btn").addEventListener("click", () => {
  // validar: mínimo 1 unidad por edad (solo para razas con unidades)
  for (let a = 0; a < AGES.length; a++) {
    const raceHasUnits = UnitDB.getByRace(currentRace).length > 0;
    if (raceHasUnits && (!currentDeck[currentRace][a] || currentDeck[currentRace][a].length < 1)) {
      document.getElementById("deck-error").textContent = `❌ ${RACE_NAMES[currentRace]} necesita al menos 1 unidad en ${AGE_NAMES[a]}`;
      document.getElementById("deck-error").classList.remove("hidden");
      return;
    }
  }
  saveDeck(currentDeck);
  closeDeckBuilder();
});

window.addEventListener("keydown", (e) => {
  const playerAge = G.player ? G.player.age : 0;
  const pRace = G.playerRace || "humans";
  const deckForAge = (currentDeck && currentDeck[pRace]) ? (currentDeck[pRace][playerAge] || []) : [];
  // Teclas 1-9 spawnean la unidad en esa posición del mazo
  if (e.key >= "1" && e.key <= "9") {
    const idx = parseInt(e.key) - 1;
    const uid = deckForAge[idx];
    if (uid) playerSpawn(uid);
  }
  else if (e.key.toLowerCase() === "e") playerEvolve();
  else if (e.key === "q") playerUpgrade("melee", "dmg");
  else if (e.key === "a") playerUpgrade("melee", "hp");
  else if (e.key === "z") playerUpgrade("melee", "spd");
  else if (e.key === "w") playerUpgrade("range", "dmg");
  else if (e.key === "s") playerUpgrade("range", "hp");
  else if (e.key === "x") playerUpgrade("range", "spd");
  else if (e.key === "r") playerUpgrade("tank", "dmg");
  else if (e.key === "f") playerUpgrade("tank", "hp");
  else if (e.key === "c") playerUpgrade("tank", "spd");
  else if (e.key === "d") playerUpgrade("tank", "armor");
  else if (e.key === "v" || e.key === "V") playerVillager();
  else if (e.key === "b" || e.key === "B") playerVillagerUpg();
  else if (e.key === "p" || e.key === "P" || e.key === "Escape") {
    if (G.mode === "ai" && !document.getElementById("game").classList.contains("hidden")) {
      paused = !paused;
      pauseBtn.textContent = paused ? "▶" : "⏸";
      pauseBtn.title = paused ? "Reanudar" : "Pausar";
    }
  }
});

// ---- Menú principal --------------------------------------------------
function populateRaceSelect() {
  const sel = document.getElementById("main-race-select");
  sel.innerHTML = "";
  for (const race of ownedRaces()) {
    const opt = document.createElement("option");
    opt.value = race;
    opt.textContent = RACE_NAMES[race];
    sel.appendChild(opt);
  }
  sel.value = loadActiveRace();
  sel.addEventListener("change", () => {
    localStorage.setItem("aow_active_race", sel.value);
    G.playerRace = sel.value;
    buildShop();
  });
}
populateRaceSelect();

document.getElementById("btn-vs-ia").addEventListener("click", () => {
  if (!ensurePlayable()) return;
  G.mode = "ai";
  G.playerRace = loadActiveRace();
  currentDeck = loadDeck();
  startGame();
});

document.getElementById("btn-deck").addEventListener("click", openDeckBuilder);

document.getElementById("btn-vs-test").addEventListener("click", () => {
  G.playerRace = document.getElementById("main-race-select").value;
  currentDeck = loadDeck();
  startTestGame();
});

// Panel de control del ENEMIGO (zona de test)
const testPanel = document.getElementById("test-panel");
testPanel.addEventListener("click", (ev) => {
  const b = ev.target.closest("button");
  if (!b) return;
  const e = G.enemy;
  if (b.dataset.tact === "gold") e.gold += 5000;
  else if (b.dataset.tact === "xp") e.xp += (EVOLVE_COST[e.age] || 1000) + 1000;
  else if (b.dataset.tact === "evolve") tryEvolve("enemy");
  else if (b.dataset.tact === "villager") { e.gold += villagerCost(e.villagers); tryVillager("enemy"); }
  else if (b.dataset.tspawn) { e.cd[b.dataset.tspawn] = 0; trySpawn("enemy", b.dataset.tspawn); }
  else if (b.dataset.tupg) { const [t, s] = b.dataset.tupg.split(":"); tryUpgrade("enemy", t, s); }
  else if (b.dataset.tspec) tryBuySpecial("enemy", b.dataset.tspec);
});

document.getElementById("btn-vs-online").addEventListener("click", () => {
  if (!ensurePlayable()) return;
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("online-menu").classList.remove("hidden");
  document.getElementById("online-buttons").classList.remove("hidden");
  document.getElementById("room-waiting").classList.add("hidden");
  document.getElementById("room-join").classList.add("hidden");
  diffWrap.classList.add("hidden");
});

document.getElementById("btn-online-back").addEventListener("click", () => {
  if (ws) { ws.close(); ws = null; }
  document.getElementById("online-menu").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
  diffWrap.classList.remove("hidden");
});

document.getElementById("btn-create").addEventListener("click", () => {
  document.getElementById("online-buttons").classList.add("hidden");
  document.getElementById("room-waiting").classList.remove("hidden");
  document.getElementById("room-code-display").textContent = "Conectando…";
  document.getElementById("room-code-display").style.color = "#a0aec0";

  ws = new WebSocket(wsUrl());
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "create_room" }));
  };
  ws.onerror = () => {
    document.getElementById("room-code-display").textContent = "Error de conexión";
    document.getElementById("room-code-display").style.color = "#fc8181";
  };
  ws.onmessage = (e) => {
    let msg;
    try { msg = JSON.parse(e.data); } catch { return; }
    if (handleNetGameMsg(msg)) return;
    switch (msg.type) {
      case "room_created":
        document.getElementById("room-code-display").textContent = msg.code;
        document.getElementById("room-code-display").style.color = "#f7c948";
        break;
      case "opponent_joined":
        document.getElementById("room-status-text").textContent = "¡Oponente conectado!";
        break;
      case "error":
        alert(msg.message);
        ws.close(); ws = null;
        document.getElementById("online-buttons").classList.remove("hidden");
        document.getElementById("room-waiting").classList.add("hidden");
        break;
    }
  };
  ws.onclose = () => {
    if (!G.over && G.mode === "online") {
      G.over = true;
      endGame(true);
      document.getElementById("overMsg").textContent = "Conexión perdida.";
    }
    ws = null;
  };
});

document.getElementById("btn-join").addEventListener("click", () => {
  document.getElementById("online-buttons").classList.add("hidden");
  document.getElementById("room-join").classList.remove("hidden");
  document.getElementById("join-error").classList.add("hidden");
  document.getElementById("join-code-input").value = "";
  document.getElementById("join-code-input").focus();
});

document.getElementById("btn-join-confirm").addEventListener("click", () => {
  const code = document.getElementById("join-code-input").value.trim().toUpperCase();
  if (code.length !== 4) {
    document.getElementById("join-error").classList.remove("hidden");
    return;
  }
  document.getElementById("join-error").classList.add("hidden");
  document.getElementById("room-join").classList.add("hidden");
  document.getElementById("room-waiting").classList.remove("hidden");
  document.getElementById("room-code-display").textContent = "Uniéndose a " + code + "…";
  document.getElementById("room-code-display").style.color = "#a0aec0";

  ws = new WebSocket(wsUrl());
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "join_room", code }));
  };
  ws.onmessage = (e) => {
    let msg;
    try { msg = JSON.parse(e.data); } catch { return; }
    if (handleNetGameMsg(msg)) return;
    switch (msg.type) {
      case "joined":
        document.getElementById("room-code-display").textContent = "🎮 Conectado";
        document.getElementById("room-code-display").style.color = "#68d391";
        break;
      case "error":
        document.getElementById("join-error").textContent = msg.message;
        document.getElementById("join-error").classList.remove("hidden");
        ws.close(); ws = null;
        document.getElementById("online-buttons").classList.remove("hidden");
        document.getElementById("room-waiting").classList.add("hidden");
        break;
    }
  };
  ws.onclose = () => {
    if (!G.over && G.mode === "online") {
      G.over = true;
      endGame(true);
      document.getElementById("overMsg").textContent = "Conexión perdida.";
    }
    ws = null;
  };
});

// ---- Arranque --------------------------------------------------------
(async function start() {
  await loadAll();
  document.getElementById("loading").classList.add("hidden");
  // solo mostrar el menú si el juego no ha arrancado ya
  if (document.getElementById("game").classList.contains("hidden")) {
    document.getElementById("main-menu").classList.remove("hidden");
  }
  G.playerRace = loadActiveRace();
  currentDeck = loadDeck();
  buildShop();
})();
