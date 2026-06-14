"use strict";
/* ============================================================
   Age of War — versión web (HTML5 Canvas)
   ============================================================ */

const AGES = ["cave", "medival", "knight", "miltary", "future"];
const AGE_NAMES = ["Edad de Piedra", "Medieval", "Caballeros", "Era Militar", "Futuro"];
const UNIT_TYPES = ["melee", "range", "tank"];
const UNIT_NAMES = { melee: "Melee", range: "Range", tank: "Tank" };
const ANIMS = ["walk", "attack", "die", "idle"];

// Orientación nativa de cada sprite (true = mira a la derecha)
const FACE_RIGHT = {
  cave:    { melee: true,  range: true,  tank: true  },
  medival: { melee: true,  range: true,  tank: true  },
  knight:  { melee: true,  range: true,  tank: true  },
  miltary: { melee: true,  range: true,  tank: false },
  future:  { melee: false, range: true,  tank: true  },
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
    tank:  { cost: 1300, hp: 2400, dmg: 160, spd: 36, range: 85,  g: 520, xp: 380 },
  },
  { // 4 future
    melee: { cost: 800,  hp: 1400, dmg: 175, spd: 60, range: 75,  g: 340, xp: 280 },
    range: { cost: 1150, hp: 780,  dmg: 145, spd: 52, range: 305, g: 480, xp: 360 },
    tank:  { cost: 2400, hp: 4400, dmg: 300, spd: 40, range: 90,  g: 950, xp: 700 },
  },
];

let paused = false;
const EVOLVE_COST = [400, 1000, 2000, 3500]; // xp para pasar de edad i a i+1
const BASE_HP = 2000;
const BASE_DMG_MULT = 2.5; // las unidades pegan más fuerte a la base
const SPEED_MULT = 1.5; // multiplicador global de velocidad de unidades
const DMG_MULT = 1.5;   // multiplicador global de daño (ritmo de combate)
const PASSIVE_GOLD = 14;       // oro/seg pasivo
const SPAWN_CD = 0.8;          // s entre spawns
const AI_PASSIVE_XP = 6;        // xp/seg pasivo para la IA

// ---- Config multijugador online ----------------------------------------
// WS_HOST: null → auto (usa location.host, funciona en localhost:3000)
//          o pon la URL de tu servidor WebSocket, ej:
//          "wss://age-of-war-server.onrender.com"
const WS_HOST = "wss://age-of-war-web.onrender.com";

function wsUrl() {
  if (WS_HOST) return WS_HOST;
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  return proto + "//" + location.host;
}

// ---- Conexión multijugador -------------------------------------------
let ws = null; // WebSocket

function netSend(action) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ type: "game_action", action }));
  }
}

function handleOpponentAction(action) {
  switch (action.type) {
    case "spawn": trySpawn("enemy", action.unitType); break;
    case "upgrade": tryUpgrade("enemy", action.unitType, action.stat); break;
    case "evolve": tryEvolve("enemy"); break;
    case "villager": tryVillager("enemy"); break;
    case "villagerupg": tryVillagerUpgrade("enemy"); break;
    case "tower_buy": tryBuyTower("enemy", action.slot); break;
    case "tower_upg": tryUpgradeTower("enemy", action.slot); break;
    case "tower_sell": trySellTower("enemy", action.slot); break;
    case "buy_slot": tryBuySlot("enemy"); break;
  }
}

// Wrappers que envían la acción al oponente en modo online
function playerSpawn(type) {
  const ok = trySpawn("player", type);
  if (ok && G.mode === "online") netSend({ type: "spawn", unitType: type });
  return ok;
}
function playerUpgrade(type, stat) {
  const ok = tryUpgrade("player", type, stat);
  if (ok && G.mode === "online") netSend({ type: "upgrade", unitType: type, stat });
  return ok;
}
function playerEvolve() {
  const ok = tryEvolve("player");
  if (ok && G.mode === "online") netSend({ type: "evolve" });
  return ok;
}
function playerVillager() {
  const ok = tryVillager("player");
  if (ok && G.mode === "online") netSend({ type: "villager" });
  return ok;
}
function playerVillagerUpg() {
  const ok = tryVillagerUpgrade("player");
  if (ok && G.mode === "online") netSend({ type: "villagerupg" });
  return ok;
}
function playerBuySlot() {
  const ok = tryBuySlot("player");
  if (ok && G.mode === "online") netSend({ type: "buy_slot" });
  return ok;
}
function playerBuyTower(slot) {
  const ok = tryBuyTower("player", slot);
  if (ok && G.mode === "online") netSend({ type: "tower_buy", slot });
  return ok;
}
function playerUpgTower(slot) {
  const ok = tryUpgradeTower("player", slot);
  if (ok && G.mode === "online") netSend({ type: "tower_upg", slot });
  return ok;
}
function playerSellTower(slot) {
  const ok = trySellTower("player", slot);
  if (ok && G.mode === "online") netSend({ type: "tower_sell", slot });
  return ok;
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

const UPG_COST_MULT = { dmg: 1.4, hp: 1.2, spd: 1.8 };
function upgradeCost(age, type, stat, lvl) {
  return Math.round(STATS[age][type].cost * UPG_COST_MULT[stat] * (lvl + 1));
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
const MAX_TOWER_LVL = 4;
const SLOT_COST = [0, 400, 900, 1800]; // costo para desbloquear el slot índice 1,2,3
function towerBuyCost(age) { return Math.round(160 * (age + 1)); }
function towerUpgCost(age, lvl) { return Math.round(120 * (age + 1) * lvl); }
function towerStats(age, lvl) {
  return { dmg: (12 + 8 * age) * lvl, range: 440, cd: 0.8 };
}
// oro recuperado al vender una torre (50% de lo invertido)
function towerSellValue(t, age) {
  let inv = towerBuyCost(age);
  for (let l = 1; l < t.lvl; l++) inv += towerUpgCost(age, l);
  return Math.round(inv * 0.5);
}

// ---- Carga de assets -------------------------------------------------
const IMG = {}; // cache de imágenes por ruta
const ASSET_V = "6"; // versión de assets (cache-busting); subir al regenerar sprites
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
    for (const u of UNIT_TYPES) {
      for (const anim of ANIMS) {
        const n = manifest[age][u][anim] || 0;
        for (let i = 0; i < n; i++) paths.push(`assets/units/${age}/${u}/${anim}/${i}.png`);
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
const W = CV.width, H = CV.height;
const GROUND_Y = H - 135;
const PLAYER_BASE_X = 90;
const ENEMY_BASE_X = W - 90;

// ---- Entidades -------------------------------------------------------
class Unit {
  constructor(side, age, type) {
    this.side = side;
    this.age = age;
    this.type = type;
    const s = STATS[age][type];
    const lvl = G[side].upg[type];
    this.cost = s.cost;
    this.maxHp = s.hp * (1 + UPG_HP * lvl.hp);
    this.hp = this.maxHp;
    this.dmg = s.dmg * DMG_MULT * (1 + UPG_DMG * lvl.dmg);
    this.baseCD = getBaseCD(age, type);
    this.cd = this.baseCD * (1 - UPG_SPD * lvl.spd);
    this.spd = s.spd * SPEED_MULT;
    this.range = s.range;
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

  get walkFrames() { return frames(this.age, this.type, "walk"); }

  draw() {
    const fr = frames(this.age, this.type, this.dying ? "die" : this.anim);
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
  constructor(x, y, target, dmg, side) {
    this.x = x; this.y = y;
    this.target = target;
    this.dmg = dmg;
    this.side = side;
    this.spd = 620;
    this.dead = false;
  }
  update(dt) {
    if (this.target.dead || this.target.dying) { this.dead = true; return; }
    const tx = this.target.x, ty = this.target.y - 40;
    const dx = tx - this.x, dy = ty - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 14) {
      hitTarget(this.target, this.dmg, this.side);
      this.dead = true;
      return;
    }
    this.x += (dx / dist) * this.spd * dt;
    this.y += (dy / dist) * this.spd * dt;
  }
  draw() {
    ctx.fillStyle = this.side === "player" ? "#ffe27a" : "#ff8a6b";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
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
  return {
    gold, xp: 0, age: 0, baseHp: BASE_HP,
    cd: { melee: 0, range: 0, tank: 0 },
    upg: {
      melee: { dmg: 0, hp: 0, spd: 0 },
      range: { dmg: 0, hp: 0, spd: 0 },
      tank:  { dmg: 0, hp: 0, spd: 0 },
    },
    villagers: 0,
    villagerLvl: 0,
    slots: 1,
    towers: [null, null, null, null],
    aiTimer: 0,
    aiBuildTimer: 0,
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

function hitTarget(t, dmg, side) {
  if (t.dead || t.dying) return;
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
function trySpawn(side, type) {
  const st = G[side];
  const s = STATS[st.age][type];
  if (st.gold < s.cost || st.cd[type] > 0) return false;
  st.gold -= s.cost;
  st.cd[type] = SPAWN_CD;
  G.units.push(new Unit(side, st.age, type));
  return true;
}

function tryUpgrade(side, type, stat) {
  const st = G[side];
  const lvl = st.upg[type][stat];
  if (lvl >= MAX_UPG) return false;
  const cost = upgradeCost(st.age, type, stat, lvl);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.upg[type][stat]++;
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

function tryBuyTower(side, slot) {
  const st = G[side];
  if (slot >= st.slots || st.towers[slot]) return false;
  const cost = towerBuyCost(st.age);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.towers[slot] = { lvl: 1, cd: 0 };
  return true;
}

function tryUpgradeTower(side, slot) {
  const st = G[side];
  const t = st.towers[slot];
  if (!t || t.lvl >= MAX_TOWER_LVL) return false;
  const cost = towerUpgCost(st.age, t.lvl);
  if (st.gold < cost) return false;
  st.gold -= cost;
  t.lvl++;
  return true;
}

function trySellTower(side, slot) {
  const st = G[side];
  const t = st.towers[slot];
  if (!t) return false;
  st.gold += towerSellValue(t, st.age);
  st.towers[slot] = null;
  return true;
}

function tryEvolve(side) {
  const st = G[side];
  if (st.age >= AGES.length - 1) return false;
  const cost = EVOLVE_COST[st.age];
  if (st.xp < cost) return false;
  st.xp -= cost;
  st.age++;
  st.baseHp = BASE_HP + st.age * 800; // +800 HP por edad
  if (st.baseHp > G[side].baseHp) G[side].baseHp = st.baseHp;
  if (side === "player") {
    G.floats.push(new FloatText(W / 2, H / 2, "¡Nueva Edad: " + AGE_NAMES[st.age] + "!", "#7af0c0"));
  }
  return true;
}

// ---- Lógica de combate y movimiento ----------------------------------
function update(dt) {
  if (G.over) return;

  // ciclo día/noche
  dayCycleTime = (dayCycleTime + dt) % DAY_CYCLE_DURATION;

  // oro pasivo (base + aldeanos con mejora)
  G.player.gold += (PASSIVE_GOLD + G.player.villagers * (VILLAGER_GOLD + G.player.villagerLvl * 2)) * dt;
  G.enemy.gold += (PASSIVE_GOLD + G.enemy.villagers * VILLAGER_GOLD) * dt;
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

  // condición de victoria
  if (G.enemy.baseHp <= 0) endGame(true);
  else if (G.player.baseHp <= 0) endGame(false);
}

// Procesa todas las unidades vivas de un bando (lista ordenada con el frente
// primero). El objetivo siempre es la unidad enemiga del frente -> O(1).
function stepSide(list, enemyList, side, enemyBaseX, enemyBaseSide, dt) {
  const frontEnemy = enemyList.length ? enemyList[0] : null;
  const dir = side === "player" ? 1 : -1;
  for (let i = 0; i < list.length; i++) {
    const u = list[i];
    if (u.fade < 1) u.fade = Math.min(1, u.fade + dt / 0.4);
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
        G[enemyBaseSide].baseHp -= bdmg;
        if (u.type === "range") {
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
  if (u.type === "range") {
    G.projectiles.push(new Projectile(u.x, u.y - 50, target, u.dmg, u.side));
  } else {
    hitTarget(target, u.dmg, u.side);
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
    if (!frontEnemy || frontEnemy.dying) continue;
    const ts = towerStats(st.age, t.lvl);
    const p = towerPos(side, i);
    if (t.cd <= 0 && Math.abs(frontEnemy.x - p.x) <= ts.range) {
      t.cd = ts.cd;
      G.projectiles.push(new Projectile(p.x, p.y, frontEnemy, ts.dmg, side));
    }
  }
}

function advanceAnim(u, dt, anim, loop) {
  if (u.anim !== anim) { u.anim = anim; u.frame = 0; u.frameTimer = 0; }
  const fr = u.dying ? frames(u.age, u.type, "die") : frames(u.age, u.type, anim);
  if (!fr.length) return;
  let fps = anim === "attack" ? 14 : 12;
  if (anim === "attack" && !u.dying) {
    const spdLvl = G[u.side].upg[u.type].spd;
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
const DIFF = {
  easy:   { income: 0.65, maxUnits: 5,  spawnMin: 1.8, evolveChance: 0.25, upgChance: 0.00, xpMult: 0.8 },
  medium: { income: 0.90, maxUnits: 8,  spawnMin: 1.1, evolveChance: 0.55, upgChance: 0.15, xpMult: 1.0 },
  hard:   { income: 1.45, maxUnits: 13, spawnMin: 0.6, evolveChance: 0.85, upgChance: 0.50, xpMult: 1.5 },
  extreme:{ income: 2.20, maxUnits: 20, spawnMin: 0.3, evolveChance: 1.00, upgChance: 0.80, xpMult: 2.5 },
};
let difficulty = "medium";

function runAI(dt) {
  const ai = G.enemy;
  const D = DIFF[difficulty];
  ai.gold += PASSIVE_GOLD * (D.income - 1) * dt;
  ai.xp += AI_PASSIVE_XP * D.xpMult * dt;
  ai.aiTimer -= dt;

  if (ai.age < AGES.length - 1 && ai.xp >= EVOLVE_COST[ai.age] && Math.random() < D.evolveChance * dt * 10) {
    tryEvolve("enemy");
  }

  if (D.upgChance && Math.random() < D.upgChance * dt * 3) {
    const t = UNIT_TYPES[(Math.random() * 3) | 0];
    const stats = ["dmg", "hp", "spd"];
    const stat = stats[(Math.random() * 3) | 0];
    const lvl = ai.upg[t][stat];
    if (lvl < MAX_UPG && ai.gold > upgradeCost(ai.age, t, stat, lvl) * 2.2) tryUpgrade("enemy", t, stat);
  }

  // inversión en economía y torres
  ai.aiBuildTimer -= dt;
  if (ai.aiBuildTimer <= 0) {
    ai.aiBuildTimer = 2 + Math.random() * 2.5;
    // aldeanos (economía) — todas las dificultades, más en alta
    if (ai.villagers < MAX_VILLAGERS && ai.gold > villagerCost(ai.villagers) * 2 &&
        Math.random() < 0.4 + D.upgChance) {
      tryVillager("enemy");
    } else if (D.upgChance > 0) {
      // torres: comprar / ampliar / mejorar
      let empty = -1;
      for (let i = 0; i < ai.slots; i++) if (!ai.towers[i]) { empty = i; break; }
      if (empty >= 0 && ai.gold > towerBuyCost(ai.age) * 2.5) {
        tryBuyTower("enemy", empty);
      } else if (empty < 0 && ai.slots < MAX_SLOTS && ai.gold > SLOT_COST[ai.slots] * 2 &&
                 Math.random() < D.upgChance) {
        tryBuySlot("enemy");
      } else {
        for (let i = 0; i < ai.slots; i++) {
          const t = ai.towers[i];
          if (t && t.lvl < MAX_TOWER_LVL && ai.gold > towerUpgCost(ai.age, t.lvl) * 2.5) {
            tryUpgradeTower("enemy", i); break;
          }
        }
      }
    }
  }

  if (ai.aiTimer > 0) return;
  let own = 0;
  for (const u of G.units) if (u.side === "enemy" && !u.dying) own++;
  if (own >= D.maxUnits) { ai.aiTimer = 0.6; return; }

  const order = Math.random() < 0.5 ? ["melee", "range", "tank"] : ["range", "melee", "tank"];
  let spawned = false;
  for (const t of order) {
    if (ai.gold >= STATS[ai.age][t].cost && trySpawn("enemy", t)) { spawned = true; break; }
  }
  ai.aiTimer = spawned ? (D.spawnMin + Math.random() * 0.7) : 0.5;
}

// ---- Render ----------------------------------------------------------
function drawBackground() {
  const wallpaper = IMG["assets/bg/wallpaper.png"];
  if (wallpaper) {
    const scale = Math.max(W / wallpaper.width, H / wallpaper.height);
    const w = wallpaper.width * scale, h = wallpaper.height * scale;
    ctx.drawImage(wallpaper, (W - w) / 2, H - h, w, h);
  } else {
    const bg = IMG["assets/bg/background.png"];
    if (bg) {
      const scale = Math.max(W / bg.width, H / bg.height);
      const w = bg.width * scale, h = bg.height * scale;
      ctx.drawImage(bg, (W - w) / 2, H - h, w, h);
    } else {
      ctx.fillStyle = "#3a4d6b"; ctx.fillRect(0, 0, W, H);
    }
  }
  ctx.fillStyle = "rgba(40,30,20,.45)";
  ctx.fillRect(0, GROUND_Y + 4, W, H - GROUND_Y);
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
  const dir = side === "player" ? 1 : -1;
  for (let i = 0; i < st.slots; i++) {
    const t = st.towers[i];
    const p = towerPos(side, i);
    if (!t) {
      // slot vacío: plataforma tenue
      ctx.fillStyle = "rgba(255,255,255,.10)";
      ctx.beginPath(); ctx.ellipse(p.x, p.y + 8, 16, 6, 0, 0, Math.PI * 2); ctx.fill();
      continue;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(dir, 1);
    // base de la torreta
    ctx.fillStyle = "#3a4150";
    ctx.beginPath(); ctx.ellipse(0, 8, 17, 7, 0, 0, Math.PI * 2); ctx.fill();
    // cuerpo
    const body = ctx.createLinearGradient(0, -14, 0, 10);
    body.addColorStop(0, "#8a93a6"); body.addColorStop(1, "#4a5160");
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.roundRect(-12, -14, 24, 22, 5); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,.4)"; ctx.lineWidth = 1.5; ctx.stroke();
    // cañón apuntando al campo
    ctx.fillStyle = "#2b303b";
    ctx.beginPath(); ctx.roundRect(6, -6, 22, 8, 3); ctx.fill();
    // acento por nivel
    ctx.fillStyle = side === "player" ? "#45f0c0" : "#ff6a5a";
    for (let l = 0; l < t.lvl; l++) {
      ctx.fillRect(-9 + l * 6, -11, 4, 4);
    }
    ctx.restore();
  }
}

function render(paused) {
  drawBackground();
  drawBase("player");
  drawBase("enemy");
  drawTowers("player");
  drawTowers("enemy");

  const sorted = [...G.units].sort((a, b) => a.y - b.y || a.x - b.x);
  for (const u of sorted) u.draw();
  for (const p of G.projectiles) p.draw();
  for (const f of G.floats) f.draw();

  drawDayFilter();

  if (paused) {
    ctx.fillStyle = "rgba(0,0,0,.45)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#f7c948";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⏸ PAUSA", W / 2, H / 2);
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#a0aec0";
    ctx.fillText("Presiona ⏸ para reanudar", W / 2, H / 2 + 50);
  }
}

// ---- Bucle principal -------------------------------------------------
let last = 0;
let loopRunning = false;
function loop(ts) {
  const dt = Math.min(0.05, (ts - last) / 1000 || 0);
  last = ts;
  if (!document.getElementById("game").classList.contains("hidden")) {
    if (!paused) update(dt);
    render(paused);
    syncUI();
  }
  requestAnimationFrame(loop);
}

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
function updateHpBar(side) {
  const st = G[side];
  const pct = Math.max(0, st.baseHp / BASE_HP);
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
document.getElementById("tower-section").addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const slot = +b.dataset.slot;
  if (b.dataset.act === "buyslot")   playerBuySlot();
  else if (b.dataset.act === "buytower")  playerBuyTower(slot);
  else if (b.dataset.act === "upg")       playerUpgTower(slot);
  else if (b.dataset.act === "sell")      playerSellTower(slot);
  econSig = "";
});

let econSig = "";
function renderEcon() {
  const p = G.player, g = p.gold;
  const income = PASSIVE_GOLD + p.villagers * (VILLAGER_GOLD + p.villagerLvl * 2);
  const aff = (c) => (g >= c ? 1 : 0);
  let sig = p.age + "|" + p.villagers + "|" + p.villagerLvl + "|" + p.slots + "|" +
    p.towers.map((t) => (t ? t.lvl : "_")).join(",");

  const vc = villagerCost(p.villagers);
  sig += "|v" + aff(vc);
  if (p.villagers > 0) sig += "|vu" + aff(villagerLvlCost(p.villagerLvl));
  for (let i = 0; i < p.slots; i++) {
    const t = p.towers[i];
    if (t) sig += "|t" + i + (t.lvl < MAX_TOWER_LVL ? aff(towerUpgCost(p.age, t.lvl)) : "x");
    else sig += "|b" + i + aff(towerBuyCost(p.age));
  }
  if (p.slots < MAX_SLOTS) sig += "|s" + aff(SLOT_COST[p.slots]);
  if (sig === econSig) return;
  econSig = sig;

  // Econ section (villagers)
  let econHtml = `<span class="lbl">💰${income}/s</span>`;
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

  // Tower section (right)
  let twrHtml = `<span class="lbl">🗼${p.slots}/${MAX_SLOTS}</span>`;
  for (let i = 0; i < p.slots; i++) {
    twrHtml += `<div class="twr-card">`;
    const t = p.towers[i];
    if (t) {
      twrHtml += `<span>Lv${t.lvl}</span>`;
      if (t.lvl < MAX_TOWER_LVL) {
        twrHtml += `<button class="inc" data-act="upg" data-slot="${i}" ${g < towerUpgCost(p.age, t.lvl) ? "disabled" : ""}>▲${towerUpgCost(p.age, t.lvl)}</button>`;
      }
      twrHtml += `<button class="sell" data-act="sell" data-slot="${i}">✕${towerSellValue(t, p.age)}</button>`;
    } else {
      const c = towerBuyCost(p.age);
      twrHtml += `<button data-act="buytower" data-slot="${i}" ${g < c ? "disabled" : ""}>🗼${c}🪙</button>`;
    }
    twrHtml += `</div>`;
  }
  if (p.slots < MAX_SLOTS) {
    const c = SLOT_COST[p.slots];
    twrHtml += `<div class="twr-card"><button data-act="buyslot" ${g < c ? "disabled" : ""}>➕${c}🪙</button></div>`;
  }
  document.getElementById("tower-section").innerHTML = twrHtml;
}

let shopCards = [];
function buildShop() {
  const cardsDiv = document.getElementById("cards-area");
  cardsDiv.innerHTML = "";
  shopCards = [];

  UNIT_TYPES.forEach((type, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="key">${i + 1}</div>
      <div class="thumb"><img></div>
      <div class="name">${UNIT_NAMES[type]}</div>
      <div class="cost"></div>
      <div class="stats"></div>`;
    card.addEventListener("click", () => playerSpawn(type));
    cardsDiv.appendChild(card);
    shopCards.push({
      el: card, type,
      img: card.querySelector("img"),
      cost: card.querySelector(".cost"),
      stats: card.querySelector(".stats"),
    });
  });

  // panel de upgrades
  const upgPanel = document.getElementById("upg-panel");
  upgPanel.innerHTML = "";

  UNIT_TYPES.forEach((type) => {
    const grp = document.createElement("div");
    grp.className = "upg-group";
    grp.dataset.type = type;
    const lbl = document.createElement("span");
    lbl.className = "upg-group-name";
    lbl.textContent = UNIT_NAMES[type];
    grp.appendChild(lbl);
    ["dmg", "hp", "spd"].forEach((stat) => {
      const btn = document.createElement("button");
      btn.className = "upg-pbtn";
      btn.dataset.type = type;
      btn.dataset.stat = stat;
      btn.addEventListener("click", () => playerUpgrade(type, stat));
      grp.appendChild(btn);
    });
    upgPanel.appendChild(grp);
  });

  refreshShopAge();
}

function effStats(side, age, type) {
  const s = STATS[age][type];
  const lvl = G[side].upg[type];
  return {
    hp: Math.round(s.hp * (1 + UPG_HP * lvl.hp)),
    dmg: Math.round(s.dmg * DMG_MULT * (1 + UPG_DMG * lvl.dmg)),
    spd: Math.round((getBaseCD(age, type) * (1 - UPG_SPD * lvl.spd)) * 100) / 100,
  };
}

function refreshShopAge() {
  const age = G.player.age;
  for (const c of shopCards) {
    const fr = frames(AGES[age], c.type, "walk");
    const mid = fr[Math.floor(fr.length / 2)];
    if (mid) c.img.src = mid.src;
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

  if (p.age !== lastAge) { refreshShopAge(); lastAge = p.age; }

  updateHpBar("player");
  updateHpBar("enemy");
  renderEcon();

  elEvolve.disabled = !(p.age < AGES.length - 1 && p.xp >= EVOLVE_COST[p.age]);
  if (p.age >= AGES.length - 1) elEvolve.textContent = "⬆ Edad máxima";
  // fase del día
  dayFillEl.style.width = ((dayCycleTime / DAY_CYCLE_DURATION) * 100) + "%";

  for (const c of shopCards) {
    const s = STATS[p.age][c.type];
    const es = effStats("player", p.age, c.type);
    c.cost.textContent = s.cost + " 🪙";
    c.stats.textContent = `❤${es.hp} ⚔${es.dmg} ⏱${es.spd}s`;
    c.el.classList.toggle("disabled", !(p.gold >= s.cost && p.cd[c.type] <= 0));
  }
  // panel de mejoras
  const upgBtns = document.querySelectorAll(".upg-pbtn");
  upgBtns.forEach((btn) => {
    const type = btn.dataset.type;
    const stat = btn.dataset.stat;
    const l = p.upg[type][stat];
    if (l >= MAX_UPG) {
      btn.textContent = "★MÁX";
      btn.disabled = true;
    } else {
      const uc = upgradeCost(p.age, type, stat, l);
      const lbl = { dmg: "+ATK", hp: "+HP", spd: "+VeATK" };
      btn.textContent = `${lbl[stat]} Lv${l+1} ${uc}🪙`;
      btn.title = `Nivel ${l+1}/${MAX_UPG} · ${uc}🪙`;
      btn.disabled = p.gold < uc;
    }
  });
}

function endGame(win) {
  if (G.over) return;
  G.over = true;
  if (G.mode === "online" && ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ type: "game_over" }));
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
  overlay.classList.add("hidden");
  diffWrap.classList.remove("hidden");
}

function showMenu() {
  if (ws) { ws.close(); ws = null; }
  document.getElementById("game").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("online-menu").classList.add("hidden");
  diffWrap.classList.remove("hidden");
}

function startGame() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("online-menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("debugBtn").classList.remove("hidden");
  pauseBtn.classList.remove("hidden");
  paused = false;
  pauseBtn.textContent = "⏸";
  resetGame();
  G.mode = "ai";
  if (!loopRunning) { loopRunning = true; requestAnimationFrame(loop); }
}

function startOnlineGame() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("online-menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("debugBtn").classList.add("hidden");
  pauseBtn.classList.add("hidden");
  diffWrap.classList.add("hidden");
  resetGame();
  G.mode = "online";
  if (!loopRunning) { loopRunning = true; requestAnimationFrame(loop); }
}

// ---- Eventos ---------------------------------------------------------
elEvolve.addEventListener("click", () => playerEvolve());

document.getElementById("restartBtn").addEventListener("click", () => {
  overlay.classList.add("hidden");
  if (G.mode === "ai") startGame();
  else startOnlineGame();
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

// selector de dificultad (reinicia la partida al cambiar)
const diffBtns = document.querySelectorAll(".diff");
diffBtns.forEach((b) => b.addEventListener("click", () => {
  difficulty = b.dataset.d;
  diffBtns.forEach((x) => x.classList.toggle("active", x === b));
  if (G.mode === "ai" && !document.getElementById("main-menu").classList.contains("hidden") === false) {
    // ya en partida IA, reiniciamos
    if (!G.over) resetGame();
  }
}));

// botón de debug: oro infinito + XP máximo
document.getElementById("debugBtn").addEventListener("click", () => {
  G.player.gold += 10000;
  const need = G.player.age < EVOLVE_COST.length ? EVOLVE_COST[G.player.age] : 99999;
  G.player.xp += need * 2;
  if (G.mode === "online") netSend({ type: "debug" });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "1") playerSpawn("melee");
  else if (e.key === "2") playerSpawn("range");
  else if (e.key === "3") playerSpawn("tank");
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
document.getElementById("btn-vs-ia").addEventListener("click", () => {
  G.mode = "ai";
  startGame();
});

document.getElementById("btn-vs-online").addEventListener("click", () => {
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
    switch (msg.type) {
      case "room_created":
        document.getElementById("room-code-display").textContent = msg.code;
        document.getElementById("room-code-display").style.color = "#f7c948";
        break;
      case "opponent_joined":
        document.getElementById("room-status-text").textContent = "¡Oponente conectado!";
        break;
      case "game_start":
        G.mode = "online";
        startOnlineGame();
        break;
      case "opponent_disconnected":
        if (!G.over) {
          endGame(true);
          document.getElementById("overMsg").textContent = "El oponente se desconectó.";
        }
        break;
      case "opponent_action":
        if (!G.over) handleOpponentAction(msg.action);
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
    switch (msg.type) {
      case "joined":
        document.getElementById("room-code-display").textContent = "🎮 Conectado";
        document.getElementById("room-code-display").style.color = "#68d391";
        break;
      case "game_start":
        G.mode = "online";
        startOnlineGame();
        break;
      case "opponent_disconnected":
        if (!G.over) {
          endGame(true);
          document.getElementById("overMsg").textContent = "El oponente se desconectó.";
        }
        break;
      case "opponent_action":
        if (!G.over) handleOpponentAction(msg.action);
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
  // mostramos el menú
  document.getElementById("main-menu").classList.remove("hidden");
  // pre-construimos shop para que esté listo
  buildShop();
})();
