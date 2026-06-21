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
  16:"Zerling",17:"Ultralisk",18:"Larva",
  20:"Valkir",21:"Wormmint",22:"Xerath",23:"Kurkor",24:"Hydralisk",
  // Aliens (estilo Protoss)
  25:"Zealot",26:"Dragoon",27:"Stalker",28:"Inmortal",29:"Arconte",30:"Fénix",31:"Explorador",32:"Alto Templario",33:"Coloso",34:"Centinela",
  // Muertes (no-muertos / nigromantes)
  35:"Esqueleto",36:"Zombi",37:"Nigromante",38:"Espectro",39:"Gólem Óseo",40:"Liche",41:"Caballero de la Muerte",42:"Banshee",43:"Abominación",44:"Señor Sepulcral",
  // Demonios (agresivos)
  45:"Diablillo",46:"Sabueso Infernal",47:"Súcubo",48:"Berserker",49:"Cerbero",50:"Íncubo",51:"Balrog",52:"Demonesa",53:"Señor del Foso",54:"Guardián Maldito",
  // Mágicos (defensivos / hostigamiento)
  55:"Aprendiz",56:"Acólito",57:"Clérigo",58:"Mago de Batalla",59:"Guardián",60:"Archimago",61:"Sacerdote",62:"Elemental",63:"Paladín Sagrado",64:"Hechicero",
};
const UNIT_IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,23,24,
  25,26,27,28,29,30,31,32,33,34, 35,36,37,38,39,40,41,42,43,44,
  45,46,47,48,49,50,51,52,53,54, 55,56,57,58,59,60,61,62,63,64,
  65,66,67,68,69,70,71,72];

const UNIT_CATALOG = {
  // ── Era 0 (Cave) ──────────────────────────────────────
     1: { id:1, name:"Troglodita", icon:"⚔️",  spriteId:"melee",  race:"humans",   combatStyle:"melee",  movementType:"ground", homeEra:0,
      desc:"Versátil luchador cuerpo a cuerpo. Efectivo contra arqueros.",
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[0], specialAbility:null, targetType:null,
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:50, hp:120, dmg:18, spd:45, range:60, g:30, xp:25 },
      growth: { hp:1.05, dmg:1.05 } },
     2: { id:2, name:"Cazador", icon:"🏹",  spriteId:"range",  race:"humans",   combatStyle:"range", movementType:"ground", homeEra:0,
      desc:"Ataca desde lejos. Ideal contra unidades aéreas.",
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"],
      inmun:[], availableEras:[0], specialAbility:null, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null},
     stats: { cost:85, hp:70, dmg:14, spd:40, range:240, g:45, xp:35 },
     growth: { hp:1.05, dmg:1.05 } },
     3: { id:3, name:"Forzudo", icon:"🛡️", spriteId:"tank",   race:"humans",   combatStyle:"melee",   movementType:"ground", homeEra:0,
      desc:"Alta resistencia y blindaje. Absorbe y retiene al enemigo.",
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[0], specialAbility:null, targetType:null,
      cooldown:1.5, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:200, hp:560, dmg:32, spd:30, range:72, g:90, xp:70 },
      growth: { hp:1.05, dmg:1.05 } },

  // ── Era 1 (Knight) ─────────────────────────────────────
     4: { id:4, name:"Caballero", icon:"⚔️", spriteId:"melee", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:1,
      desc:"Guerrero montado con armadura de placas. Potencia en la carga.",
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[1], specialAbility:null, targetType:null,
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null},
     stats: { cost:110, hp:230, dmg:30, spd:47, range:60, g:55, xp:45 },
     growth: { hp:1.05, dmg:1.05 } },
     5: { id:5, name:"Arquero", icon:"🏹", spriteId:"range", race:"humans", combatStyle:"range", movementType:"ground", homeEra:1,
      desc:"Arquero entrenado con arco compuesto. Alcance superior.",
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"],
      inmun:[], availableEras:[1], specialAbility:null, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:170, hp:130, dmg:24, spd:42, range:250, g:80, xp:60 },
      growth: { hp:1.05, dmg:1.05 } },
     6: { id:6, name:"Paladín", icon:"🛡️", spriteId:"tank", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:1,
      desc:"Campeón sagrado con escudo y fe inquebrantable.",
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[1], specialAbility:null, targetType:null,
      cooldown:1.5, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:400, hp:750, dmg:52, spd:32, range:75, g:160, xp:120 },
     growth: { hp:1.05, dmg:1.05 } },

  // ── Era 2 (Medival) ────────────────────────────────────
     7:  { id:7,  name:"Espadachín", icon:"⚔️", spriteId:"melee", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:2,
      desc:"Experto en esgrima con espada larga. Golpes precisos y letales.",
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[2], specialAbility:null, targetType:null,
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:220, hp:430, dmg:52, spd:50, range:65, g:100, xp:80 },
      growth: { hp:1.05, dmg:1.05 } },
     8:  { id:8,  name:"Ballestero", icon:"🏹", spriteId:"range", race:"humans", combatStyle:"range", movementType:"ground", homeEra:2,
      desc:"Ballesta de repetición. Perfora blindajes con facilidad.",
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"],
      inmun:[], availableEras:[2], specialAbility:null, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:320, hp:240, dmg:42, spd:44, range:260, g:140, xp:110 },
      growth: { hp:1.05, dmg:1.05 } },
     9:  { id:9,  name:"Blindado", icon:"🛡️", spriteId:"tank", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:2,
      desc:"Armadura de placas completa. Muro impenetrable.",
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[2], specialAbility:null, targetType:null,
      cooldown:1.5, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:700, hp:1350, dmg:90, spd:34, range:80, g:280, xp:210 },
      growth: { hp:1.05, dmg:1.05 } },

  // ── Era 3 (Miltary) ────────────────────────────────────
     10: { id:10, name:"Soldado", icon:"⚔️", spriteId:"melee", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:3,
      desc:"Infantería moderna con fusil de asalto y granadas.",
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[3], specialAbility:null, targetType:null,
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:420, hp:780, dmg:95, spd:55, range:70, g:180, xp:150 },
      growth: { hp:1.05, dmg:1.05 } },
     11: { id:11, name:"Francotirador", icon:"🎯", spriteId:"range", race:"humans", combatStyle:"range", movementType:"ground", homeEra:3,
      desc:"Rifle de precisión de largo alcance. Elimina objetivos clave.",
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"],
      inmun:[], availableEras:[3], specialAbility:null, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:600, hp:430, dmg:78, spd:48, range:285, g:260, xp:200 },
      growth: { hp:1.05, dmg:1.05 } },
     12: { id:12, name:"Tanque", icon:"🛡️", spriteId:"tank", race:"humans", combatStyle:"range", movementType:"ground", homeEra:3,
      desc:"Blindaje pesado con cañón rotatorio. Dispara a distancia.",
      tags:["ranged","ground"], class:"tank", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[3], specialAbility:null, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:1300, hp:2400, dmg:160, spd:36, range:210, g:520, xp:380 },
      growth: { hp:1.05, dmg:1.05 } },

  // ── Era 4 (Future) ─────────────────────────────────────
     13: { id:13, name:"Comando", icon:"⚔️", spriteId:"melee", race:"humans", combatStyle:"melee", movementType:"ground", homeEra:4,
      desc:"Operaciones especiales con exoesqueleto potenciado.",
      tags:["melee","ground"], class:"assassin", upgStats:["dmg","spd"],
      inmun:[], availableEras:[4], specialAbility:null, targetType:null,
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:800, hp:1400, dmg:175, spd:60, range:75, g:340, xp:280 },
      growth: { hp:1.05, dmg:1.05 } },
     14: { id:14, name:"Centinela", icon:"🎯", spriteId:"range", race:"humans", combatStyle:"range", movementType:"ground", homeEra:4,
      desc:"Torreta automatizada con sistema de puntería láser.",
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"],
      inmun:[], availableEras:[4], specialAbility:null, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:1150, hp:780, dmg:145, spd:52, range:305, g:480, xp:360 },
      growth: { hp:1.05, dmg:1.05 } },
     15: { id:15, name:"Mecha", icon:"🛡️", spriteId:"tank", race:"humans", combatStyle:"range", movementType:"ground", homeEra:4,
      desc:"Robot de combate gigante con blindaje de aleación. Cañón de largo alcance.",
      tags:["ranged","ground"], class:"tank", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[4], specialAbility:null, targetType:null,
      cooldown:1.5, sounds:{spawn:null,attack:null,die:null},
      stats: { cost:2400, hp:4400, dmg:300, spd:40, range:250, g:950, xp:700 },
      growth: { hp:1.05, dmg:1.05 } },

  // ── Monsters (escalado INDIVIDUAL: stats base + growth^(lv-1) por nivel) ──
     16: { id:16, name:"Zerling", icon:"👾", spriteId:"zerling", race:"monsters", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Criatura rápida que ataca en enjambre. Devastadora en grupo.",
      tags:["melee","ground"], class:"assassin", upgStats:["dmg","spd"],
      inmun:[], availableEras:[0,1,2,3,4], specialAbility:null, targetType:"ground",
      cooldown:0.45, sounds:{spawn:"assets/audio/units/zerling/spawn.mp3",attack:null,die:null},
      stats:  { cost:38, hp:72, dmg:11, spd:100, range:55, g:18, xp:14, cd:0.50 },
      growth: { hp:1.10, dmg:1.10 } },
     17: { id:17, name:"Ultralisk", icon:"🦂", spriteId:"ultralisk", race:"monsters", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Coloso blindado que arrasa líneas enemigas. Resistente y letal.",
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"],
      inmun:[], availableEras:[3,4], specialAbility:null, targetType:"ground",
      cooldown:5, sounds:{spawn:null,attack:null,die:null},
      stats:  { cost:150, hp:500, dmg:34, spd:24, range:70, g:90, xp:70, cd:0.75 },
      growth: { hp:1.12, dmg:1.12 } },
     18: { id:18, name:"Larva", icon:"🐛", spriteId:"larva", race:"monsters", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Cría barata y frágil. A los 10 s muta en Zerling o Hydralisk.",
      tags:["melee","ground"], class:"warrior", upgStats:["hp","spd"],
      inmun:[], availableEras:[0,1,2,3,4], specialAbility:{ type:"transform", after:10, into:[16,24] }, targetType:"ground",
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null},
      stats:  { cost:30, hp:80, dmg:5, spd:22, range:55, g:18, xp:15, cd:0.60 },
      growth: { hp:1.10, dmg:1.10 } },

     20: { id:20, name:"Valkir", icon:"🦇", spriteId:"valkir", race:"monsters", combatStyle:"range", movementType:"aerial", homeEra:1,
      desc:"Bestia alada que ataca con orbes de energía desde el cielo. Frágil pero letal.",
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"],
      inmun:[], availableEras:[1,2,3], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null},
      stats:  { cost:300, hp:360, dmg:46, spd:52, range:250, g:130, xp:110, cd:0.85 },
      growth: { hp:1.12, dmg:1.12 } },
     21: { id:21, name:"Wormmint", icon:"🧠", spriteId:"wormmint", race:"monsters", combatStyle:"range", movementType:"ground", homeEra:3,
       desc:"Soporte psíquico. No hace daño: controla la mente de un enemigo al azar hasta su muerte.",
       tags:["ranged","ground","support"], class:"support", upgStats:["hp","range","spd"],
       inmun:[], availableEras:[3,4], specialAbility:{ type:"mindControl", cd:20 }, targetType:null,
       cooldown:10, sounds:{spawn:null,attack:null,die:null},
       stats:  { cost:1400, hp:300, dmg:0, spd:26, range:190, g:420, xp:320, cd:1.5 },
       growth: { hp:1.08, dmg:1 } },

  // ── Xerath (Monstruo — solo ataca aéreos) ────────────────────────────
     22: { id:22, name:"Xerath", icon:"🦞", spriteId:"xerath", race:"monsters", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Criatura abisal que ataca objetivos aéreos con sus tenazas. Inútil contra terrestres.",
      tags:["melee","ground","antiair"], class:"assassin", upgStats:["dmg","spd"],
      inmun:["ground"], availableEras:[2,3], specialAbility:null,
      targetType:"aerial",
      cooldown:0.65, sounds:{spawn:null,attack:null,die:null},
      stats:  { cost:80, hp:160, dmg:28, spd:50, range:65, g:38, xp:30, cd:0.65 },
      growth: { hp:1.12, dmg:1.12 } },

  // ── Kurkor (Monstruo — solo ataca terrestres) ────────────────────────
     23: { id:23, name:"Kurkor", icon:"🦎", spriteId:"kurkor", race:"monsters", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Bestia acorazada de embestida. Ignora unidades aéreas y aplasta terrestres.",
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"],
      inmun:["aerial"], availableEras:[0,1], specialAbility:null,
      targetType:"ground",
      cooldown:0.72, sounds:{spawn:null,attack:null,die:null},
      stats:  { cost:130, hp:400, dmg:24, spd:28, range:70, g:60, xp:48, cd:0.72 },
      growth: { hp:1.10, dmg:1.10 } },

  // ── Hydralisk (Monstruo — range, ataca aéreo y terrestre) ────────────
     24: { id:24, name:"Hydralisk", icon:"🐍", spriteId:"hydralisk", race:"monsters", combatStyle:"range", movementType:"ground", homeEra:0,
      desc:"Escupe púas a distancia. Versátil: alcanza tanto a unidades terrestres como aéreas.",
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"],
      inmun:[], availableEras:[1,2,3,4], specialAbility:null,
      targetType:null,
      cooldown:2.5, sounds:{spawn:null,attack:null,die:null},
      stats:  { cost:110, hp:220, dmg:30, spd:40, range:210, g:55, xp:45, cd:0.80 },
      growth: { hp:1.10, dmg:1.10 } },

  // ════════════ ALIENS (estilo Protoss — tecnología psiónica, escudos) ════════════
     25: { id:25, name:"Zealot", icon:"⚔️", spriteId:"a_zealot", race:"aliens", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Guerrero psiónico con hojas de energía. Sólido y veloz cuerpo a cuerpo.", psize:1.0,
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[0,1], specialAbility:null, targetType:null,
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:60, hp:150, dmg:22, spd:48, range:62, g:32, xp:26, cd:0.55 }, growth:{ hp:1.11, dmg:1.11 } },
     26: { id:26, name:"Dragoon", icon:"🔫", spriteId:"a_dragoon", race:"aliens", combatStyle:"range", movementType:"ground", homeEra:1,
      desc:"Caminante acorazado que dispara descargas de fase a distancia.", psize:1.1,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[1,2], specialAbility:null, targetType:null,
      cooldown:0.9, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:180, hp:170, dmg:26, spd:42, range:245, g:72, xp:55, cd:0.9 }, growth:{ hp:1.11, dmg:1.11 } },
     27: { id:27, name:"Stalker", icon:"🟣", spriteId:"a_stalker", race:"aliens", combatStyle:"range", movementType:"ground", homeEra:2,
      desc:"Acechador que lanza ráfagas psiónicas concentradas a un enemigo lejano.", psize:1.1,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[2,3], specialAbility:{ type:"bolt", cd:3, dmg:55, range:300 }, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:340, hp:280, dmg:40, spd:50, range:250, g:120, xp:95, cd:0.85 }, growth:{ hp:1.11, dmg:1.11 } },
     28: { id:28, name:"Inmortal", icon:"🛡️", spriteId:"a_immortal", race:"aliens", combatStyle:"melee", movementType:"ground", homeEra:3,
      desc:"Coloso con escudo de endurecimiento. Muralla de contención casi imparable.", psize:1.35,
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[3,4], specialAbility:null, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:900, hp:1500, dmg:110, spd:34, range:72, g:300, xp:230, cd:0.8 }, growth:{ hp:1.10, dmg:1.10 } },
     29: { id:29, name:"Arconte", icon:"⚡", spriteId:"a_archon", race:"aliens", combatStyle:"melee", movementType:"ground", homeEra:4,
      desc:"Energía psiónica pura. Descarga tormentas que fulminan a distancia.", psize:1.25,
      tags:["melee","ground"], class:"assassin", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[4], specialAbility:{ type:"bolt", cd:2.5, dmg:120, range:170 }, targetType:null,
      cooldown:0.7, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1300, hp:1600, dmg:160, spd:40, range:90, g:420, xp:330, cd:0.7 }, growth:{ hp:1.10, dmg:1.10 } },
     30: { id:30, name:"Fénix", icon:"🛩️", spriteId:"a_phoenix", race:"aliens", combatStyle:"range", movementType:"aerial", homeEra:2,
      desc:"Caza aéreo que barre el cielo con haces de iones.", psize:1.0,
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[2,3], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:360, hp:300, dmg:42, spd:54, range:250, g:130, xp:100, cd:0.85 }, growth:{ hp:1.11, dmg:1.11 } },
     31: { id:31, name:"Explorador", icon:"✈️", spriteId:"a_scout", race:"aliens", combatStyle:"range", movementType:"aerial", homeEra:3,
      desc:"Interceptor pesado con baterías antimateria.", psize:1.1,
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:null, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:760, hp:520, dmg:90, spd:56, range:260, g:270, xp:210, cd:0.8 }, growth:{ hp:1.11, dmg:1.11 } },
     32: { id:32, name:"Alto Templario", icon:"🔮", spriteId:"a_templar", race:"aliens", combatStyle:"range", movementType:"ground", homeEra:3,
      desc:"Soporte psiónico: restaura los escudos del aliado más herido.", psize:1.0,
      tags:["ranged","ground","support"], class:"support", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"heal", cd:4, amount:160, range:240 }, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1000, hp:420, dmg:30, spd:30, range:200, g:320, xp:250, cd:1.2 }, growth:{ hp:1.10, dmg:1.10 } },
     33: { id:33, name:"Coloso", icon:"🦿", spriteId:"a_colossus", race:"aliens", combatStyle:"range", movementType:"ground", homeEra:4,
      desc:"Andador gigante con lanzas térmicas de largísimo alcance.", psize:1.4,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[4], specialAbility:{ type:"bolt", cd:3, dmg:90, range:340 }, targetType:null,
      cooldown:0.9, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1180, hp:1450, dmg:150, spd:40, range:305, g:400, xp:320, cd:0.9 }, growth:{ hp:1.10, dmg:1.10 } },
     34: { id:34, name:"Centinela", icon:"🟡", spriteId:"a_sentry", race:"aliens", combatStyle:"range", movementType:"ground", homeEra:1,
      desc:"Robot de apoyo que hostiga con descargas de iones.", psize:0.9,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[1,2], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:175, hp:135, dmg:24, spd:40, range:240, g:70, xp:55, cd:0.85 }, growth:{ hp:1.11, dmg:1.11 } },

  // ════════════ DEATHS (no-muertos — resucitan e invocan) ════════════
     35: { id:35, name:"Esqueleto", icon:"💀", spriteId:"d_skeleton", race:"deaths", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Hueso reanimado, barato y desechable. Carne de cañón eterna.", psize:0.95,
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[0,1], specialAbility:null, targetType:null,
      cooldown:0.55, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:40, hp:90, dmg:16, spd:46, range:60, g:22, xp:18, cd:0.55 }, growth:{ hp:1.11, dmg:1.11 } },
     36: { id:36, name:"Zombi", icon:"🧟", spriteId:"d_zombie", race:"deaths", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Lento pero resistente. Avanza sin descanso devorando todo.", psize:1.05,
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[0,1], specialAbility:null, targetType:null,
      cooldown:0.7, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:70, hp:170, dmg:18, spd:30, range:62, g:30, xp:26, cd:0.7 }, growth:{ hp:1.11, dmg:1.11 } },
     37: { id:37, name:"Nigromante", icon:"☠️", spriteId:"d_necromancer", race:"deaths", combatStyle:"range", movementType:"ground", homeEra:1,
      desc:"Invoca esqueletos sin cesar mientras lanza energía oscura.", psize:1.0,
      tags:["ranged","ground","summoner"], class:"support", upgStats:["dmg","range","spd"], inmun:[], availableEras:[1,2], specialAbility:{ type:"summon", cd:9, into:35, count:1 }, targetType:null,
      cooldown:0.95, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:220, hp:160, dmg:22, spd:34, range:230, g:90, xp:70, cd:0.95 }, growth:{ hp:1.11, dmg:1.11 } },
     38: { id:38, name:"Espectro", icon:"👻", spriteId:"d_wraith", race:"deaths", combatStyle:"range", movementType:"aerial", homeEra:2,
      desc:"Aparición flotante que drena vida con gritos espectrales.", psize:1.0,
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[2,3], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:340, hp:280, dmg:40, spd:52, range:250, g:120, xp:95, cd:0.85 }, growth:{ hp:1.11, dmg:1.11 } },
     39: { id:39, name:"Gólem Óseo", icon:"🦴", spriteId:"d_bonegolem", race:"deaths", combatStyle:"melee", movementType:"ground", homeEra:2,
      desc:"Mole de huesos fusionados. Tanque que aplasta líneas enemigas.", psize:1.35,
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[2,3], specialAbility:null, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:620, hp:900, dmg:70, spd:32, range:70, g:230, xp:180, cd:0.8 }, growth:{ hp:1.10, dmg:1.10 } },
     40: { id:40, name:"Liche", icon:"🪦", spriteId:"d_lich", race:"deaths", combatStyle:"range", movementType:"ground", homeEra:3,
      desc:"Archimago no-muerto que levanta hordas de esqueletos.", psize:1.05,
      tags:["ranged","ground","summoner"], class:"support", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"summon", cd:8, into:35, count:2 }, targetType:null,
      cooldown:0.9, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:820, hp:460, dmg:85, spd:34, range:260, g:280, xp:230, cd:0.9 }, growth:{ hp:1.11, dmg:1.11 } },
     41: { id:41, name:"Caballero de la Muerte", icon:"⚰️", spriteId:"d_deathknight", race:"deaths", combatStyle:"melee", movementType:"ground", homeEra:3,
      desc:"Al caer, su maldición levanta esqueletos de su cadáver.", psize:1.15,
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"reanimate", into:35, count:2 }, targetType:null,
      cooldown:0.75, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:880, hp:900, dmg:100, spd:40, range:70, g:300, xp:240, cd:0.75 }, growth:{ hp:1.10, dmg:1.10 } },
     42: { id:42, name:"Banshee", icon:"🦇", spriteId:"d_banshee", race:"deaths", combatStyle:"range", movementType:"aerial", homeEra:3,
      desc:"Lamento aéreo que desgarra a distancia con alaridos sónicos.", psize:1.05,
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:null, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:780, hp:540, dmg:95, spd:54, range:260, g:270, xp:210, cd:0.8 }, growth:{ hp:1.11, dmg:1.11 } },
     43: { id:43, name:"Abominación", icon:"🧌", spriteId:"d_abomination", race:"deaths", combatStyle:"melee", movementType:"ground", homeEra:4,
      desc:"Amasijo colosal de cadáveres. Al morir escupe esqueletos.", psize:1.45,
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[4], specialAbility:{ type:"reanimate", into:35, count:3 }, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1300, hp:1700, dmg:150, spd:34, range:80, g:420, xp:330, cd:0.85 }, growth:{ hp:1.10, dmg:1.10 } },
     44: { id:44, name:"Señor Sepulcral", icon:"👑", spriteId:"d_gravelord", race:"deaths", combatStyle:"range", movementType:"ground", homeEra:4,
      desc:"Soberano de los muertos: invoca esqueletos en masa sin parar.", psize:1.2,
      tags:["ranged","ground","summoner"], class:"support", upgStats:["dmg","range","spd"], inmun:[], availableEras:[4], specialAbility:{ type:"summon", cd:7, into:35, count:2 }, targetType:null,
      cooldown:0.9, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1200, hp:1500, dmg:140, spd:36, range:280, g:400, xp:320, cd:0.9 }, growth:{ hp:1.10, dmg:1.10 } },

  // ════════════ DEMONS (agresivos — frenesí, robo de vida, daño alto) ════════════
     45: { id:45, name:"Diablillo", icon:"👹", spriteId:"m_imp", race:"demons", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Pequeño y rabioso. Enjambre veloz de garras ardientes.", psize:0.85,
      tags:["melee","ground"], class:"assassin", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[0,1], specialAbility:null, targetType:null,
      cooldown:0.5, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:55, hp:100, dmg:24, spd:58, range:60, g:28, xp:24, cd:0.5 }, growth:{ hp:1.12, dmg:1.12 } },
     46: { id:46, name:"Sabueso Infernal", icon:"🐺", spriteId:"m_hellhound", race:"demons", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Depredador que se cura con cada mordisco (robo de vida).", psize:1.0,
      tags:["melee","ground"], class:"assassin", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[0,1], specialAbility:{ type:"lifesteal", frac:0.3 }, targetType:null,
      cooldown:0.55, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:75, hp:130, dmg:26, spd:62, range:62, g:32, xp:28, cd:0.55 }, growth:{ hp:1.12, dmg:1.12 } },
     47: { id:47, name:"Súcubo", icon:"💋", spriteId:"m_succubus", race:"demons", combatStyle:"range", movementType:"ground", homeEra:1,
      desc:"Lanza látigos de fuego a distancia media.", psize:1.0,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[1,2], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:190, hp:140, dmg:30, spd:44, range:235, g:78, xp:60, cd:0.85 }, growth:{ hp:1.12, dmg:1.12 } },
     48: { id:48, name:"Berserker", icon:"🪓", spriteId:"m_berserker", race:"demons", combatStyle:"melee", movementType:"ground", homeEra:2,
      desc:"Entra en frenesí: aumenta su daño y velocidad de golpe.", psize:1.1,
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[2,3], specialAbility:{ type:"frenzy", cd:9, dur:4, dmgMul:1.6, spdMul:1.3 }, targetType:null,
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:360, hp:520, dmg:70, spd:52, range:66, g:140, xp:110, cd:0.6 }, growth:{ hp:1.11, dmg:1.11 } },
     49: { id:49, name:"Cerbero", icon:"🐕", spriteId:"m_cerberus", race:"demons", combatStyle:"melee", movementType:"ground", homeEra:2,
      desc:"Bestia de tres cabezas que devora vida con cada ataque.", psize:1.25,
      tags:["melee","ground"], class:"assassin", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[2,3], specialAbility:{ type:"lifesteal", frac:0.35 }, targetType:null,
      cooldown:0.6, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:380, hp:560, dmg:66, spd:56, range:66, g:150, xp:120, cd:0.6 }, growth:{ hp:1.11, dmg:1.11 } },
     50: { id:50, name:"Íncubo", icon:"🔥", spriteId:"m_incubus", race:"demons", combatStyle:"range", movementType:"aerial", homeEra:2,
      desc:"Demonio alado que arroja bolas de fuego desde el cielo.", psize:1.0,
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[2,3], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:360, hp:300, dmg:48, spd:54, range:250, g:130, xp:100, cd:0.85 }, growth:{ hp:1.11, dmg:1.11 } },
     51: { id:51, name:"Balrog", icon:"👿", spriteId:"m_balrog", race:"demons", combatStyle:"melee", movementType:"ground", homeEra:3,
      desc:"Titán de fuego que entra en frenesí devastador.", psize:1.4,
      tags:["melee","ground"], class:"warrior", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"frenzy", cd:8, dur:5, dmgMul:1.7, spdMul:1.3 }, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:980, hp:1300, dmg:150, spd:44, range:80, g:330, xp:260, cd:0.8 }, growth:{ hp:1.10, dmg:1.10 } },
     52: { id:52, name:"Demonesa", icon:"😈", spriteId:"m_demoness", race:"demons", combatStyle:"range", movementType:"ground", homeEra:3,
      desc:"Hechicera infernal que castiga a distancia con maldiciones.", psize:1.05,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:800, hp:470, dmg:100, spd:44, range:270, g:280, xp:220, cd:0.85 }, growth:{ hp:1.11, dmg:1.11 } },
     53: { id:53, name:"Señor del Foso", icon:"🟥", spriteId:"m_pitlord", race:"demons", combatStyle:"melee", movementType:"ground", homeEra:4,
      desc:"Comandante demoníaco que se sacia de vida en combate.", psize:1.4,
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[4], specialAbility:{ type:"lifesteal", frac:0.4 }, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1350, hp:1600, dmg:180, spd:46, range:85, g:430, xp:340, cd:0.85 }, growth:{ hp:1.10, dmg:1.10 } },
     54: { id:54, name:"Guardián Maldito", icon:"🦂", spriteId:"m_doomguard", race:"demons", combatStyle:"range", movementType:"aerial", homeEra:4,
      desc:"Heraldo alado del apocalipsis. Bombardea sin piedad.", psize:1.2,
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[4], specialAbility:null, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1180, hp:780, dmg:150, spd:56, range:270, g:400, xp:320, cd:0.8 }, growth:{ hp:1.11, dmg:1.11 } },

  // ════════════ MAGICS (defensivos — curación, escudos, hostigamiento directo) ════════════
     55: { id:55, name:"Aprendiz", icon:"🔵", spriteId:"g_apprentice", race:"magics", combatStyle:"range", movementType:"ground", homeEra:0,
      desc:"Joven mago que hostiga con dardos arcanos a un enemigo lejano.", psize:0.9,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[0,1], specialAbility:{ type:"bolt", cd:3, dmg:24, range:280 }, targetType:null,
      cooldown:0.9, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:85, hp:80, dmg:16, spd:40, range:240, g:40, xp:32, cd:0.9 }, growth:{ hp:1.11, dmg:1.11 } },
     56: { id:56, name:"Acólito", icon:"✨", spriteId:"g_acolyte", race:"magics", combatStyle:"melee", movementType:"ground", homeEra:0,
      desc:"Defensor con barrera mágica. Aguanta el frente con templanza.", psize:1.0,
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[0,1], specialAbility:null, targetType:null,
      cooldown:0.7, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:60, hp:160, dmg:16, spd:40, range:62, g:30, xp:26, cd:0.7 }, growth:{ hp:1.11, dmg:1.11 } },
     57: { id:57, name:"Clérigo", icon:"⛪", spriteId:"g_cleric", race:"magics", combatStyle:"range", movementType:"ground", homeEra:1,
      desc:"Sanador que restaura la vida del aliado más herido.", psize:1.0,
      tags:["ranged","ground","support"], class:"support", upgStats:["dmg","range","spd"], inmun:[], availableEras:[1,2], specialAbility:{ type:"heal", cd:3.5, amount:120, range:240 }, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:200, hp:180, dmg:14, spd:34, range:200, g:80, xp:64, cd:1.2 }, growth:{ hp:1.11, dmg:1.10 } },
     58: { id:58, name:"Mago de Batalla", icon:"🪄", spriteId:"g_battlemage", race:"magics", combatStyle:"range", movementType:"ground", homeEra:2,
      desc:"Lanza proyectiles y descarga rayos arcanos de hostigamiento.", psize:1.05,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[2,3], specialAbility:{ type:"bolt", cd:2.5, dmg:60, range:320 }, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:340, hp:280, dmg:44, spd:42, range:260, g:120, xp:95, cd:0.85 }, growth:{ hp:1.11, dmg:1.11 } },
     59: { id:59, name:"Guardián", icon:"🛡️", spriteId:"g_guardian", race:"magics", combatStyle:"melee", movementType:"ground", homeEra:2,
      desc:"Centinela con escudo de runas. Pared defensiva inquebrantable.", psize:1.35,
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[2,3], specialAbility:null, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:620, hp:1000, dmg:55, spd:34, range:70, g:230, xp:180, cd:0.8 }, growth:{ hp:1.10, dmg:1.10 } },
     60: { id:60, name:"Archimago", icon:"🌟", spriteId:"g_archmage", race:"magics", combatStyle:"range", movementType:"ground", homeEra:3,
      desc:"Maestro arcano que castiga sin tregua con rayos de poder.", psize:1.1,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"bolt", cd:2, dmg:90, range:340 }, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:820, hp:460, dmg:90, spd:40, range:280, g:280, xp:230, cd:0.8 }, growth:{ hp:1.11, dmg:1.11 } },
     61: { id:61, name:"Sacerdote", icon:"🙏", spriteId:"g_priest", race:"magics", combatStyle:"range", movementType:"ground", homeEra:3,
      desc:"Sanador supremo: regenera grandes cantidades de vida aliada.", psize:1.05,
      tags:["ranged","ground","support"], class:"support", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"heal", cd:3, amount:280, range:260 }, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:900, hp:420, dmg:20, spd:32, range:210, g:300, xp:240, cd:1.2 }, growth:{ hp:1.10, dmg:1.10 } },
     62: { id:62, name:"Elemental", icon:"💧", spriteId:"g_elemental", race:"magics", combatStyle:"range", movementType:"ground", homeEra:3,
      desc:"Ser de pura energía que arroja torrentes elementales.", psize:1.15,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:800, hp:520, dmg:100, spd:40, range:270, g:280, xp:220, cd:0.85 }, growth:{ hp:1.11, dmg:1.11 } },
     63: { id:63, name:"Paladín Sagrado", icon:"⚜️", spriteId:"g_paladin", race:"magics", combatStyle:"melee", movementType:"ground", homeEra:4,
      desc:"Campeón sagrado con armadura bendecida. Muro inquebrantable.", psize:1.4,
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[4], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1300, hp:1800, dmg:140, spd:38, range:80, g:430, xp:340, cd:0.85 }, growth:{ hp:1.10, dmg:1.10 } },
     64: { id:64, name:"Hechicero", icon:"🌀", spriteId:"g_sorcerer", race:"magics", combatStyle:"range", movementType:"ground", homeEra:4,
      desc:"Hostigador supremo: rayos arcanos de altísimo alcance.", psize:1.1,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[4], specialAbility:{ type:"bolt", cd:2, dmg:130, range:360 }, targetType:null,
      cooldown:0.8, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1180, hp:780, dmg:140, spd:42, range:300, g:400, xp:320, cd:0.8 }, growth:{ hp:1.11, dmg:1.11 } },

  // ════════════ CARTAS DE SOBRE (packOnly: solo se obtienen en la tienda) ════════════
     65: { id:65, name:"Mortero", icon:"💥", spriteId:"h_mortar", race:"humans", combatStyle:"range", movementType:"ground", homeEra:3, packOnly:true,
      desc:"Artillería pesada humana: proyectiles de largo alcance y gran daño.", psize:1.15,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:null, targetType:null,
      cooldown:1.1, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:820, hp:600, dmg:115, spd:38, range:330, g:340, xp:270, cd:1.2 }, growth:{ hp:1.10, dmg:1.10 } },
     66: { id:66, name:"Reina Engendro", icon:"🥚", spriteId:"mo_broodqueen", race:"monsters", combatStyle:"range", movementType:"ground", homeEra:3, packOnly:true,
      desc:"Soporte de enjambre: no ataca, pero engendra Zerlings sin cesar.", psize:1.35,
      tags:["ranged","ground","summoner","support"], class:"support", upgStats:["hp","range","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"summon", cd:8, into:16, count:2 }, targetType:null,
      cooldown:1.5, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1250, hp:620, dmg:0, spd:26, range:150, g:380, xp:300, cd:1.5 }, growth:{ hp:1.10, dmg:1 } },
     67: { id:67, name:"Acechador Alado", icon:"🪰", spriteId:"mo_wingstalker", race:"monsters", combatStyle:"range", movementType:"aerial", homeEra:2, packOnly:true,
      desc:"Bestia voladora de hostigamiento: escupe ácido desde el cielo.", psize:1.0,
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[2,3], specialAbility:null, targetType:null,
      cooldown:0.85, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:320, hp:300, dmg:42, spd:54, range:240, g:130, xp:100, cd:0.85 }, growth:{ hp:1.12, dmg:1.12 } },
     68: { id:68, name:"Disruptor", icon:"🟪", spriteId:"a_disruptor", race:"aliens", combatStyle:"range", movementType:"ground", homeEra:3, packOnly:true,
      desc:"Orbe de energía inestable: descarga psiónica que fulmina al frente.", psize:1.2,
      tags:["ranged","ground"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"bolt", cd:3, dmg:110, range:320 }, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:880, hp:560, dmg:90, spd:40, range:280, g:360, xp:290, cd:1.0 }, growth:{ hp:1.11, dmg:1.11 } },
     69: { id:69, name:"Nave Nodriza", icon:"🛸", spriteId:"a_mothership", race:"aliens", combatStyle:"range", movementType:"aerial", homeEra:4, packOnly:true,
      desc:"Coloso aéreo psiónico: barre el cielo y el suelo con haces masivos.", psize:1.6,
      tags:["ranged","aerial"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[4], specialAbility:null, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1500, hp:1250, dmg:150, spd:40, range:300, g:480, xp:380, cd:1.0 }, growth:{ hp:1.10, dmg:1.10 } },
     70: { id:70, name:"Profanador", icon:"🕯️", spriteId:"d_defiler", race:"deaths", combatStyle:"range", movementType:"ground", homeEra:2, packOnly:true,
      desc:"Hechicero impío que alza esqueletos en pleno combate.", psize:1.1,
      tags:["ranged","ground","summoner"], class:"support", upgStats:["dmg","range","spd"], inmun:[], availableEras:[2,3], specialAbility:{ type:"summon", cd:9, into:35, count:1 }, targetType:null,
      cooldown:1.2, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:360, hp:280, dmg:30, spd:34, range:240, g:130, xp:110, cd:1.2 }, growth:{ hp:1.10, dmg:1.10 } },
     71: { id:71, name:"Archidemonio", icon:"😡", spriteId:"m_archdemon", race:"demons", combatStyle:"melee", movementType:"ground", homeEra:4, packOnly:true,
      desc:"Señor del abismo: entra en frenesí destrozando todo a su paso.", psize:1.45,
      tags:["melee","ground"], class:"tank", upgStats:["dmg","hp","spd"], inmun:[], availableEras:[4], specialAbility:{ type:"frenzy", cd:8, dur:5, dmgMul:1.7, spdMul:1.3 }, targetType:null,
      cooldown:0.7, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:1350, hp:1700, dmg:150, spd:44, range:80, g:440, xp:350, cd:0.7 }, growth:{ hp:1.10, dmg:1.10 } },
     72: { id:72, name:"Oráculo", icon:"🔮", spriteId:"g_oracle", race:"magics", combatStyle:"range", movementType:"ground", homeEra:3, packOnly:true,
      desc:"Vidente sagrado: cura a los aliados heridos mientras ataca a distancia.", psize:1.15,
      tags:["ranged","ground","support"], class:"ranger", upgStats:["dmg","range","spd"], inmun:[], availableEras:[3,4], specialAbility:{ type:"heal", cd:3, amount:220, range:250 }, targetType:null,
      cooldown:1.0, sounds:{spawn:null,attack:null,die:null}, stats:{ cost:820, hp:560, dmg:60, spd:40, range:260, g:340, xp:290, cd:1.0 }, growth:{ hp:1.11, dmg:1.11 } },
};

// Razas disponibles (cada unidad pertenece a una raza)
const RACES = ["humans", "aliens", "monsters", "deaths", "demons", "magics"];
const RACE_NAMES = {
  humans: "Humanos", aliens: "Alienígenas", monsters: "Monstruos",
  deaths: "Muertes", demons: "Demonios", magics: "Mágicos",
};

// Base por raza: cada raza tiene su propia base, que evoluciona por era. Las razas
// sin base propia usan la base humana ("base") por defecto.
const RACE_BASE = { monsters: "base_monsters" };
function baseFile(race) { return RACE_BASE[race] || "base"; }
function baseKey(age, race) { return `assets/bases/${AGES[age]}/${baseFile(race)}.png`; }

// HP de base por raza (base + crecimiento por edad, regen/s)
const RACE_BASE_STATS = {
  humans:  { base: 2000, perAge: 1200, regen: [0, 0] },
  monsters:{ base: 1500, perAge: 1500, regen: [4, 3] },
  aliens:  { base: 1900, perAge: 1300, regen: [3, 2] },  // escudos: regen ligera
  deaths:  { base: 1700, perAge: 1250, regen: [2, 2] },
  demons:  { base: 1600, perAge: 1400, regen: [0, 0] },  // agresivos: sin regen, más hp por era
  magics:  { base: 2300, perAge: 1300, regen: [6, 4] },  // defensivos: más vida + regen alta
};

// Paleta procedural por raza (para unidades sin sprite sheet: se dibujan a canvas).
// Aliens = estilo Protoss (oro/turquesa con brillo psiónico).
const PROC_THEME = {
  aliens: { body:"#2bd4c8", edge:"#f0c674", glow:"#7ff5ec", eye:"#fff7d6", dark:"#15706b" },
  deaths: { body:"#d9d3bf", edge:"#7a7a6a", glow:"#9bff9b", eye:"#9bff9b", dark:"#4a4a40" },
  demons: { body:"#8e1b14", edge:"#ff7a2b", glow:"#ff5230", eye:"#ffd24a", dark:"#3d0a07" },
  magics: { body:"#3a6bd6", edge:"#b07aff", glow:"#9fd8ff", eye:"#e8f4ff", dark:"#1c2f6b" },
};

// ════════════ RAREZAS / COLECCIÓN / MONEDA ════════════
// Orden de menor a mayor; legendary es la más alta (borde amarillo).
const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];
const RARITY = {
  common:    { name: "Común",      color: "#9aa0a6" },
  uncommon:  { name: "Poco común", color: "#4fd16b" },
  rare:      { name: "Rara",       color: "#4a90e2" },
  epic:      { name: "Épica",      color: "#a64ee0" },
  legendary: { name: "Legendaria", color: "#f5c518" },
};
// Rareza por unidad (mapa aparte para no tocar cada entrada del catálogo).
const UNIT_RARITY = {
  // Humanos
  1:"common",2:"common",3:"uncommon", 4:"common",5:"uncommon",6:"rare",
  7:"uncommon",8:"uncommon",9:"rare", 10:"uncommon",11:"epic",12:"epic", 13:"epic",14:"uncommon",15:"legendary",
  // Monsters (legendarias forzadas: zerling, ultralisk, larva, wormmint, hydralisk)
  16:"legendary",17:"legendary",18:"legendary",20:"rare",21:"legendary",22:"uncommon",23:"uncommon",24:"legendary",
  // Aliens
  25:"common",26:"common",27:"rare",28:"epic",29:"legendary",30:"uncommon",31:"uncommon",32:"epic",33:"legendary",34:"uncommon",
  // Deaths
  35:"common",36:"common",37:"uncommon",38:"uncommon",39:"rare",40:"epic",41:"rare",42:"epic",43:"legendary",44:"legendary",
  // Demons
  45:"common",46:"uncommon",47:"common",48:"rare",49:"rare",50:"uncommon",51:"epic",52:"rare",53:"legendary",54:"legendary",
  // Magics
  55:"common",56:"common",57:"uncommon",58:"rare",59:"rare",60:"epic",61:"epic",62:"rare",63:"legendary",64:"legendary",
  // Cartas de sobre (packOnly) — rare+ para que no entren al piso por rareza
  65:"epic",66:"legendary",67:"rare",68:"epic",69:"legendary",70:"rare",71:"legendary",72:"epic",
};
function unitRarity(uid) { return UNIT_RARITY[uid] || "common"; }
function rarityRank(r) { return RARITY_ORDER.indexOf(r); }

const MAX_COPIES = 2;     // máximo de copias por carta; una extra "no se ve"
const PACK_PRICE = 200;   // precio de un sobre
const PACK_SIZE = 5;      // cartas por sobre
const WIN_REWARD = { easy: 60, medium: 120, hard: 220, extreme: 400 };

// ---- Colección (cartas poseídas) -------------------------------------
// "Piso" garantizado: lo que el jugador ya tenía antes de la tienda.
//  - HUMANOS y MONSTERS completos (eran las razas jugables desde siempre).
//  - Común/poco común de TODAS las razas (arranque básico de las razas nuevas).
//  - Cobertura: cada (raza, era) con unidades tiene ≥1 carta poseída.
function floorCollection() {
  const c = {};
  for (const uid of UNIT_IDS) {
    const u = UNIT_CATALOG[uid];
    if (u.packOnly) continue; // cartas nuevas: SOLO se obtienen en sobres
    const r = unitRarity(uid);
    if (u.race === "humans" || u.race === "monsters" || r === "common" || r === "uncommon") c[uid] = 1;
  }
  // Torres existentes (humanas) desbloqueadas de arranque; las nuevas (packOnly) se ganan en sobres.
  for (const tid of TOWER_IDS) if (TOWER_CATALOG[tid].race === "humans" && !TOWER_CATALOG[tid].packOnly) c[tid] = 1;
  for (const race of RACES) for (let a = 0; a < AGES.length; a++) {
    const ids = UnitDB.getAvailableIdsByRace(race, a).filter(id => !UNIT_CATALOG[id].packOnly);
    if (ids.length && !ids.some(id => c[id])) {
      let best = ids[0];
      for (const id of ids) if ((UNIT_CATALOG[id].stats.cost || 1e9) < (UNIT_CATALOG[best].stats.cost || 1e9)) best = id;
      c[best] = 1;
    }
  }
  return c;
}
function defaultCollection() { return floorCollection(); }
function getCollection() {
  let col = null;
  try { const raw = localStorage.getItem("aow_collection"); if (raw) col = JSON.parse(raw); } catch {}
  const hadStored = !!col;
  if (!col) col = {};
  // Auto-reparación: garantiza el piso (NUNCA quita cartas; solo añade lo básico que falte).
  const floor = floorCollection();
  let changed = false;
  for (const uid in floor) if (!((col[uid] || 0) >= 1)) { col[uid] = 1; changed = true; }
  if (changed || !hadStored) saveCollection(col);
  return col;
}
function saveCollection(c) { try { localStorage.setItem("aow_collection", JSON.stringify(c)); } catch {} }
function ownsUnit(uid) { return (getCollection()[uid] || 0) >= 1; }

// ---- Moneda ----------------------------------------------------------
function getCoins() { const v = parseInt(localStorage.getItem("aow_coins"), 10); return isNaN(v) ? 0 : v; }
function setCoins(n) { localStorage.setItem("aow_coins", String(Math.max(0, Math.floor(n)))); updateCoinDisplays(); }
function addCoins(n) { setCoins(getCoins() + n); }
function updateCoinDisplays() {
  const v = getCoins();
  const a = document.getElementById("menu-coins-val"); if (a) a.textContent = v;
  const b = document.getElementById("shop-coins-val"); if (b) b.textContent = v;
}
if (localStorage.getItem("aow_coins") === null) localStorage.setItem("aow_coins", "300"); // saldo inicial

// Escala visual por spriteId (unidades monstruo son más grandes, se reducen)
const UNIT_SCALE = { zerling: 0.55, larva: 0.48, valkir: 0.62, wormmint: 0.7, xerath: 0.65, kurkor: 0.8, hydralisk: 0.7, ultralisk: 1.3,
  // Sprites craftpix → escala calculada para ~82px de personaje (igual al resto)
  d_skeleton: 1.26, d_zombie: 1.28, g_apprentice: 1.24, m_hellhound: 1.05 };
// Escala visual de bases por raza
const BASE_SCALE = { monsters: 1.2 };

// Wallpaper por raza (infección visual desde los bordes)
const WALLPAPER_MAP = { humans: "wallpaper_humans.png", monsters: "wallpaper_monster.png" };
function wallpaperKey(race) { return `assets/bg/${WALLPAPER_MAP[race] || "wallpaper_init.png"}`; }

// Calcula 0-1 qué tan avanzada está la infección de un bando
function calcInfection(side) {
  if (!G.units) return 0;
  const units = G.units.filter(u => u.side === side && !u.dead && !u.dying);
  if (!units.length) return 0;
  const totalDist = ENEMY_BASE_X - PLAYER_BASE_X;
  if (side === "player") {
    const maxX = Math.max(...units.map(u => u.x));
    return Math.min(1, Math.max(0, (maxX - PLAYER_BASE_X) / totalDist));
  } else {
    const minX = Math.min(...units.map(u => u.x));
    return Math.min(1, Math.max(0, (ENEMY_BASE_X - minX) / totalDist));
  }
}
// ---- Estado de infección del terreno ---------------------------------
// El frente de infección persigue LENTO al frente de unidades y nunca retrocede
// (el terreno por donde pasaron queda infectado). Da sensación de propagación.
const INFECT_SPEED = 0.012;  // 0..1 por segundo (MUY lento: dominio sostenido)
const INFECT_FADE  = 340;    // px de degradado en el filo (transición amplia)
const INFECT_AMP   = 90;     // px de amplitud del borde irregular
const INFECT_BLUR  = 22;     // px de desenfoque del filo (borde casi imperceptible)
let infectProg = { player: 0, enemy: 0 };
let _infCv = null, _infCtx = null;

function resetInfection() { infectProg = { player: 0, enemy: 0 }; }

function updateInfection(dt) {
  if (!G.units) return;
  for (const side of ["player", "enemy"]) {
    const target = calcInfection(side);
    if (target > infectProg[side])
      infectProg[side] = Math.min(target, infectProg[side] + INFECT_SPEED * dt);
  }
}

// Ruido 1D suave determinista (suma de senos) para el contorno del filo.
function infectNoise(u, phase) {
  return Math.sin(u * 1.7 + phase) * 0.55
       + Math.sin(u * 3.9 + phase * 2.3) * 0.30
       + Math.sin(u * 8.3 + phase * 0.7) * 0.15;
}

// Raza de cada bando. El enemigo (IA) es humano por ahora.
function sideRace(side) {
  const st = G[side];
  if (st && st.race) return st.race;
  return side === "player" ? (G.playerRace || "humans") : "humans";
}

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
const ANIMS = ["walk", "attack", "die", "idle", "spawn"];

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
const EVOLVE_COST = [600, 1200, 2400, 4000]; // xp para pasar de edad i a i+1
const BASE_DMG_MULT = 2.5; // las unidades pegan más fuerte a la base
const SPEED_MULT = 1.5; // multiplicador global de velocidad de unidades
const DMG_MULT = 1.5;   // multiplicador global de daño (ritmo de combate)
const PASSIVE_GOLD = 10;       // oro/seg pasivo
const AGE_GOLD = 5;            // oro/seg extra por cada edad alcanzada
const SPAWN_CD = 0.8;          // s entre spawns
const DIE_TIME = 2.0;          // s que el cadáver permanece antes de desaparecer
const DIE_FADE_START = 1.3;    // s en que el cadáver empieza a desvanecerse
const DIE_FALL_TIME = 0.85;    // s que tardan las unidades aéreas en caer al suelo al morir
const FLIGHT_H = 115;           // px que las unidades aéreas vuelan sobre el suelo
const PLAYER_PASSIVE_XP = 3;   // xp/seg pasivo para el jugador (evoluciona por tiempo)
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
    case "spawn":       trySpawn("enemy", c.unitType, (UNIT_CATALOG[c.unitId]||{}).spriteId, c.unitId); break;
    case "tech":        tryTech("enemy", c.techId); break;
    case "uupg":        tryUnitUpg("enemy", c.uid, c.upKey); break;
    case "evolve":      tryEvolve("enemy"); break;
    case "villager":    tryVillager("enemy"); break;
    case "villagerupg": tryVillagerUpgrade("enemy"); break;
    case "buy_slot":    tryBuySlot("enemy"); break;
    case "tower_buy":   tryBuyTower("enemy", c.slot, c.towerType); break;
    case "tower_upg":   tryUpgradeTower("enemy", c.slot, c.kind); break;
    case "tower_sell":  trySellTower("enemy", c.slot); break;
  }
}

// ── Serialización de estado (host -> guest) ───────────────────────────
const ANIM_I = { walk: 0, attack: 1, die: 2, idle: 3, spawn: 4 };
const TYPE_I = { melee: 0, range: 1, tank: 2 };

function sideSnap(s) {
  return {
    g: Math.round(s.gold), x: Math.round(s.xp), a: s.age, h: Math.round(s.baseHp),
    c: Object.fromEntries(Object.entries(s.cd).map(([k,v]) => [k, +v.toFixed(2)])),
    u: s.tech, uu: s.uupg, t: s.towerUpg, v: s.villagers, vl: s.villagerLvl, sl: s.slots,
    tw: s.towers.map((t) => t ? [t.tid, +(t.angle || 0).toFixed(2), +(t.fireAnim || 0).toFixed(2), t.animFrame | 0] : 0),
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
      un.uid != null ? un.uid : -1, // [15] uid: para que el guest renderice el sprite correcto
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
  dst.cd = {...s.c};
  dst.tech = s.u || {}; dst.uupg = s.uu || {}; dst.towerUpg = s.t;
  dst.villagers = s.v; dst.villagerLvl = s.vl; dst.slots = s.sl;
  dst.towers = s.tw.map((t) => t ? { tid: t[0], angle: t[1], fireAnim: t[2], animFrame: t[3], cd: 0, animTimer: 0 } : null);
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
    // Reconstruir datos de render desde el catálogo (uid) para el sprite correcto.
    const uid = (a[15] != null && a[15] >= 0) ? a[15] : null;
    const def = uid != null ? (UNIT_CATALOG[uid] || {}) : {};
    u.uid = uid;
    u.spriteId = def.spriteId || u.type;
    u.race = def.race || null;
    u.flying = def.movementType === "aerial";
    u.psize = def.psize || 1;
    u.targetType = def.targetType || null;
    u.cc = {}; u.buffT = 0; u.bobPhase = 0; u.frameTimer = 0;
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
  return trySpawn("player", u.combatStyle, u.spriteId, uid);
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

// ---- Sistema de mejoras: ÁRBOL TECNOLÓGICO POR RAZA ------------------
// Cada raza tiene techs propios que se DESBLOQUEAN POR ERA y dan bonos a
// categorías de unidades (melee/range, aéreo/terrestre o todas). Se compran
// con oro en partida; el bono se "hornea" en cada unidad al nacer.
const MAX_UNIT_LEVEL = 6; // (compat: display de nivel)

// Sistema de clases: cada clase tiene una fórmula base que escala por era.
// stat(era) = base * (1 + growth)^era
const CLASS_BASE = {
  warrior: {
    hp: [120, 0.85], dmg: [18, 0.76], spd: [45, 3],
    range: 60, cd: 0.7, costMult: 1.0, goldMult: 0.45, xpMult: 0.35,
  },
  tank: {
    hp: [400, 0.82], dmg: [30, 0.78], spd: [30, 3],
    range: 70, cd: 1.2, costMult: 1.5, goldMult: 0.50, xpMult: 0.40,
  },
  assassin: {
    hp: [70, 0.80], dmg: [25, 0.75], spd: [55, 5],
    range: 55, cd: 0.5, costMult: 0.85, goldMult: 0.45, xpMult: 0.35,
  },
  ranger: {
    hp: [70, 0.82], dmg: [14, 0.80], spd: [40, 3],
    range: 240, cd: 1.0, costMult: 1.2, goldMult: 0.50, xpMult: 0.40,
  },
  support: {
    hp: [300, 0.55], dmg: [0, 0], spd: [26, 2],
    range: 190, cd: 1.5, costMult: 1.3, goldMult: 0.45, xpMult: 0.35,
  },
};
const CLASS_UPG_DEFAULTS = {
  warrior: ["dmg", "hp", "spd"],
  tank:    ["dmg", "hp", "spd"],
  assassin:["dmg", "spd"],
  ranger:  ["dmg", "range", "spd"],
  support: ["hp", "range", "spd"],
};
const RACE_COST_MULT = { humans: 1.0, monsters: 0.55 };


// Mejoras de cada unidad: usa upgStats de la unidad, o fallback por clase.
function unitUpgStats(uid) {
  const u = UNIT_CATALOG[uid];
  if (u && u.upgStats) return u.upgStats;
  if (u && u.class && CLASS_UPG_DEFAULTS[u.class]) return CLASS_UPG_DEFAULTS[u.class];
  return ["dmg", "hp", "spd"];
}
// ════════════ ÁRBOL TECNOLÓGICO (RACE_TECH) ════════════
// stat keys: dmg, hp, atkspd (reduce el cd de ataque), range, movespd.
const TECH_PER = { dmg: 0.12, hp: 0.12, atkspd: 0.08, range: 0.08, movespd: 0.10 };
const TECH_STAT_LABEL = { dmg: "Daño", hp: "Vida", atkspd: "Vel. ataque", range: "Alcance", movespd: "Vel. mov." };
const TECH_STAT_ICON  = { dmg: "⚔", hp: "❤", atkspd: "⏱", range: "🎯", movespd: "🏃" };
const TECH_SCOPE_LABEL = { melee: "Melee", range: "Rango", aerial: "Aéreas", ground: "Terrestres", all: "Todas" };

// Helper para declarar techs de forma compacta.
function _T(name, era, stat, maxLvl, baseCost, scope) {
  const t = { name, era, stat, per: TECH_PER[stat], maxLvl, baseCost, scopeLabel: "all" };
  if (scope) { if (scope.style) { t.style = scope.style; t.scopeLabel = scope.style; } if (scope.move) { t.move = scope.move; t.scopeLabel = scope.move; } }
  return t;
}
const _ME = { style: "melee" }, _RA = { style: "range" }, _GR = { move: "ground" }, _AI = { move: "aerial" };
const RACE_TECH = {
  humans: [
    _T("Filo afilado",       0, "dmg",    3, 110, _ME),
    _T("Armadura de cuero",  0, "hp",     3, 110, _ME),
    _T("Flechas pesadas",    1, "dmg",    3, 240, _RA),
    _T("Arcos largos",       1, "range",  2, 240, _RA),
    _T("Acero templado",     2, "dmg",    3, 480, _ME),
    _T("Cota de malla",      2, "hp",     3, 480, null),
    _T("Munición perforante",3, "dmg",    3, 850, _RA),
    _T("Tácticas de asalto", 3, "atkspd", 3, 850, null),
    _T("Doctrina de guerra", 4, "dmg",    4, 1400, null),
    _T("Blindaje compuesto", 4, "hp",     4, 1400, null),
  ],
  monsters: [
    _T("Garras afiladas",    0, "dmg",    3, 100, _ME),
    _T("Instinto veloz",     0, "movespd",3, 120, _GR),
    _T("Carapacho",          1, "hp",     3, 230, _ME),
    _T("Escupitajo ácido",   1, "dmg",    3, 230, _RA),
    _T("Frenesí de enjambre",2, "atkspd", 3, 460, _ME),
    _T("Mutación rápida",    2, "movespd",3, 460, _GR),
    _T("Biomasa superior",   3, "dmg",    3, 820, null),
    _T("Regeneración densa",  3, "hp",     3, 820, null),
    _T("Evolución suprema",  4, "dmg",    4, 1350, null),
    _T("Furia primigenia",   4, "atkspd", 3, 1350, null),
  ],
  aliens: [
    _T("Escudos de plasma",  1, "hp",     3, 230, null),
    _T("Lentes de fase",     1, "dmg",    3, 230, _RA),
    _T("Matriz de escudos",  2, "hp",     3, 470, null),
    _T("Emisores prismáticos",2,"range",  2, 470, _RA),
    _T("Sobrecarga psiónica",3, "dmg",    3, 830, null),
    _T("Aceleradores iónicos",3,"atkspd", 3, 830, _RA),
    _T("Egida del Khala",    4, "hp",     4, 1400, null),
    _T("Singularidad",       4, "dmg",    3, 1400, null),
  ],
  deaths: [
    _T("Huesos endurecidos", 0, "hp",     3, 100, _ME),
    _T("Filo maldito",       0, "dmg",    3, 110, _ME),
    _T("Carne profana",      1, "hp",     3, 230, null),
    _T("Magia necrótica",    1, "dmg",    3, 230, _RA),
    _T("Plaga corrosiva",    2, "dmg",    3, 460, null),
    _T("Vigor no-muerto",    2, "atkspd", 3, 460, _ME),
    _T("Legión eterna",      3, "hp",     3, 820, null),
    _T("Maldición mayor",    3, "dmg",    3, 820, null),
    _T("Apocalipsis",        4, "dmg",    4, 1350, null),
    _T("Inmortalidad",       4, "hp",     4, 1350, null),
  ],
  demons: [
    _T("Garras infernales",  0, "dmg",    3, 100, _ME),
    _T("Pezuñas veloces",    0, "movespd",3, 120, _GR),
    _T("Furia ardiente",     1, "dmg",    3, 220, null),
    _T("Sed de sangre",      1, "atkspd", 3, 240, _ME),
    _T("Llama abisal",       2, "dmg",    3, 450, null),
    _T("Embestida demoníaca",2, "movespd",3, 460, _GR),
    _T("Cólera del averno",  3, "dmg",    3, 800, null),
    _T("Frenesí infernal",   3, "atkspd", 3, 820, null),
    _T("Cataclismo",         4, "dmg",    4, 1300, null),
    _T("Estampida del foso", 4, "movespd",3, 1300, null),
  ],
  magics: [
    _T("Dardos arcanos",     1, "dmg",    3, 220, _RA),
    _T("Focos de poder",     1, "range",  2, 230, _RA),
    _T("Barrera rúnica",     2, "hp",     3, 460, null),
    _T("Canalización rápida",2, "atkspd", 3, 470, _RA),
    _T("Saber prohibido",    3, "dmg",    3, 820, _RA),
    _T("Esferas mayores",    3, "range",  2, 820, _RA),
    _T("Convergencia astral",4, "dmg",    3, 1350, null),
    _T("Égida arcana",       4, "hp",     4, 1350, null),
  ],
};
// Asigna ids únicos por raza.
for (const race in RACE_TECH) RACE_TECH[race].forEach((t, i) => { t.id = race + "_" + i; t.race = race; });

function techMatches(t, u) {
  if (t.style && u.combatStyle !== t.style) return false;
  if (t.move && u.movementType !== t.move) return false;
  return true;
}
function techCost(t, lvl) { return Math.round(t.baseCost * (1 + lvl * 0.8)); }
function availableTechs(race, age) { return (RACE_TECH[race] || []).filter(t => t.era <= age); }
// Suma de bonos (fracción) que aplica el bando `side` a la unidad `uid` para `stat`.
function techBonus(side, uid, stat) {
  const u = UNIT_CATALOG[uid]; if (!u) return 0;
  const list = RACE_TECH[u.race] || [];
  const rec = (G[side] && G[side].tech) || {};
  let sum = 0;
  for (const t of list) {
    if (t.stat !== stat) continue;
    const lv = rec[t.id] || 0; if (!lv) continue;
    if (!techMatches(t, u)) continue;
    sum += t.per * lv;
  }
  return sum;
}
function tryTech(side, techId) {
  const st = G[side];
  const t = (RACE_TECH[st.race] || []).find(x => x.id === techId);
  if (!t || t.era > st.age) return false;
  const lvl = st.tech[techId] || 0;
  if (lvl >= t.maxLvl) return false;
  const cost = techCost(t, lvl);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.tech[techId] = lvl + 1;
  return true;
}
function playerTech(techId) {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "tech", techId });
  return tryTech("player", techId);
}
// ════════════ MEJORAS POR UNIDAD (UNIT_UPG) ════════════
// Cada unidad tiene mejoras PROPIAS (solo afectan a esa unidad), independientes
// del árbol de raza. Se desbloquean por era (escalonadas a partir de su homeEra)
// y suben el "nivel" de la unidad. Más estrechas que las de raza → un poco más
// fuertes por nivel. La clave upgStats "spd" representa VELOCIDAD DE ATAQUE.
const UNIT_UPG_PER = { dmg: 0.14, hp: 0.14, atkspd: 0.09, range: 0.09, movespd: 0.11 };
const UPG_STAT_MAP = { dmg: "dmg", hp: "hp", spd: "atkspd", range: "range", movespd: "movespd" };
const UPG_STAT_LABEL = { dmg: "Daño", hp: "Vida", atkspd: "Vel. ataque", range: "Alcance", movespd: "Vel. mov." };
const UPG_STAT_ICON  = { dmg: "⚔", hp: "❤", atkspd: "⏱", range: "🎯", movespd: "🏃" };
const UNIT_UPG = {}; // uid -> [ { key, stat, label, era, maxLvl, baseCost, per } ]
(function buildUnitUpg() {
  for (const uid of UNIT_IDS) {
    const u = UNIT_CATALOG[uid]; if (!u) continue;
    const home = u.homeEra || 0;
    const rarity = unitRarity(uid);
    const baseLvl = { common: 2, uncommon: 2, rare: 3, epic: 3, legendary: 3 }[rarity] || 2;
    const ranged = u.combatStyle === "range";
    const hasDmg = (u.stats && u.stats.dmg) > 0;
    // Conjunto de mejoras propias (4 por unidad: ofensiva, ritmo, alcance/movilidad, defensa).
    // Unidades sin daño (soporte) cambian daño por utilidad.
    let statSet;
    if (hasDmg) statSet = ranged ? ["dmg", "atkspd", "range", "hp"] : ["dmg", "atkspd", "movespd", "hp"];
    else        statSet = ranged ? ["hp", "range", "atkspd", "movespd"] : ["hp", "movespd", "atkspd"];
    const cost0 = (u.stats && u.stats.cost) || 100;
    UNIT_UPG[uid] = statSet.map((stat, i) => {
      // Las 2 primeras se desbloquean al subir 1 era desde su debut; el resto escalonadas.
      const era = i < 2 ? Math.min(4, home + 1) : Math.min(4, home + i);
      // legendarias: +1 nivel en su stat primaria (más profundas)
      const maxLvl = (rarity === "legendary" && i === 0) ? baseLvl + 1 : baseLvl;
      const baseCost = Math.max(45, Math.round(cost0 * 0.5 * (i === 0 ? 1 : 0.9)));
      return { key: stat, stat, label: UPG_STAT_LABEL[stat] || stat,
               era, maxLvl, baseCost, per: UNIT_UPG_PER[stat] || 0.10 };
    });
  }
})();
function unitUpgCost(up, lvl) { return Math.round(up.baseCost * (1 + lvl * 0.85)); }
function availableUnitUpgs(uid, age) { return (UNIT_UPG[uid] || []).filter(up => up.era <= age); }
function unitUpgBonus(side, uid, stat) {
  const list = UNIT_UPG[uid]; if (!list) return 0;
  const rec = (G[side] && G[side].uupg && G[side].uupg[uid]) || {};
  let sum = 0;
  for (const up of list) { if (up.stat !== stat) continue; const lv = rec[up.key] || 0; if (lv) sum += up.per * lv; }
  return sum;
}
function tryUnitUpg(side, uid, upKey) {
  const st = G[side]; if (!st) return false;
  const up = (UNIT_UPG[uid] || []).find(x => x.key === upKey);
  if (!up || up.era > st.age) return false;
  if (!st.uupg) st.uupg = {};
  const rec = st.uupg[uid] || (st.uupg[uid] = {});
  const lvl = rec[upKey] || 0;
  if (lvl >= up.maxLvl) return false;
  const cost = unitUpgCost(up, lvl);
  if (st.gold < cost) return false;
  st.gold -= cost;
  rec[upKey] = lvl + 1;
  return true;
}
function playerUnitUpg(uid, upKey) {
  if (paused) return;
  if (isGuest()) return sendCmd({ type: "uupg", uid, upKey });
  return tryUnitUpg("player", uid, upKey);
}
// Nivel de una unidad = 1 + suma de niveles de SUS mejoras propias (no las de raza).
function unitLevel(side, uid) {
  if (side == null || uid == null) return 1;
  const rec = (G[side] && G[side].uupg && G[side].uupg[uid]) || {};
  let n = 1; for (const k in rec) n += rec[k];
  return n;
}
function unitMaxLevel(uid) {
  let n = 1; for (const up of (UNIT_UPG[uid] || [])) n += up.maxLvl;
  return n;
}

// Stats base de una unidad (sin mejoras ni nivel).
// Usa `stats` del catálogo si existe; si no, calcula desde CLASS_BASE.
function unitBase(uid, age, type) {
  const u = uid != null ? UNIT_CATALOG[uid] : null;
  if (u && u.stats) {
    const b = u.stats;
    return { cost: b.cost, hp: b.hp, dmg: b.dmg, spd: b.spd,
             range: b.range, g: b.g, xp: b.xp, cd: b.cd };
  }
  // Fallback: generar desde la clase
  if (u && u.class && CLASS_BASE[u.class]) {
    const f = CLASS_BASE[u.class];
    const race = u.race || "humans";
    const raceM = RACE_COST_MULT[race] || 1.0;
    const era = age || 0;
    const calc = (base, growth) => Math.round(base * Math.pow(1 + growth, era));
    const hp = f.hp[1] > 0 ? calc(f.hp[0], f.hp[1]) : f.hp[0];
    const dmg = f.dmg[1] > 0 ? calc(f.dmg[0], f.dmg[1]) : f.dmg[0];
    const spd = f.spd[1] > 0 ? calc(f.spd[0], f.spd[1]) : f.spd[0];
    const rawPower = hp * 0.35 + dmg * 3;
    const costMult = f.costMult || 1.0;
    const cost = Math.round(rawPower * costMult * raceM);
    return {
      cost, hp, dmg, spd,
      range: f.range,
      g: Math.round(cost * (f.goldMult || 0.4)),
      xp: Math.round(cost * (f.xpMult || 0.3)),
      cd: f.cd,
    };
  }
  return STATS[age][type];
}

// Stats efectivos de una unidad (centralizado: lo usan Unit, las cards y la IA).
// `uupg` = registro de mejoras de ESA unidad. Solo aplica mejoras para stats
// que aparecen en unitUpgStats(uid).
function computeStats(uid, age, side) {
  side = side || "player";
  const u = UNIT_CATALOG[uid] || {};
  const type = u.combatStyle || "melee";
  const s = unitBase(uid, age, type);
  const baseCd = (s.cd != null) ? s.cd : getBaseCD(age, type);
  // Bonos = árbol de RAZA + mejoras propias de la UNIDAD (horneados al nacer).
  const bon = (st) => techBonus(side, uid, st) + unitUpgBonus(side, uid, st);
  const hp    = s.hp  * (1 + bon("hp"));
  const dmg   = s.dmg * DMG_MULT * (1 + bon("dmg"));
  const cd    = baseCd * Math.max(0.25, 1 - bon("atkspd"));
  const spd   = s.spd * SPEED_MULT * (1 + bon("movespd"));
  const range = s.range * (1 + bon("range"));
  return { hp, dmg, cd, spd, range, resist: null, armor: 0, regen: 0, lvl: unitLevel(side, uid) };
}

// ---- Ataque base desde sprites ----------------------------------------
function getBaseCD(age, type) {
  const n = manifest ? (manifest[AGES[age]][type].attack || 8) : 8;
  return n / 14; // 14 fps para animación de ataque
}

// ---- Economía: aldeanos (oro/seg + oro/muerte + mejora) --------------
const VILLAGER_GOLD = 5;
const MAX_VILLAGERS = 8;
const VILLAGER_KILL_BONUS = 4;
const MAX_VILLAGER_LVL = 5;
function villagerCost(n) { return Math.round(250 * Math.pow(1.55, n)); }
function villagerLvlCost(lvl) { return Math.round(500 * Math.pow(1.7, lvl)); }

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
// ════════════ CATÁLOGO DE TORRES (cards por tid) ════════════
// Existentes (humanos) tid 201-215: reutilizan sprites por era/tier.
// Nuevas tid 301+: procedurales, temáticas por raza, salen en sobres.
const TOWER_CATALOG = {};
const TOWER_IDS = [];
const TOWER_TIER_NAME = ["Ligera", "Pesada", "Asedio"];
const TOWER_RARITY_BY_TIER = ["uncommon", "rare", "epic"];
const ERA_ROMAN = ["I", "II", "III", "IV", "V"];
function towerTidFor(age, tier) { return 200 + age * 3 + tier; } // existentes
(function buildTowerCatalog() {
  for (let a = 0; a < 5; a++) for (let tier = 1; tier <= 3; tier++) {
    const tid = towerTidFor(a, tier);
    const b = TOWER_BASE[a][tier - 1];
    TOWER_CATALOG[tid] = {
      tid, name: `Torre ${TOWER_TIER_NAME[tier - 1]} ${ERA_ROMAN[a]}`, icon: "🗼",
      race: "humans", proc: false, spriteAge: a, tier, upgTier: tier,
      availableEras: [a], rarity: TOWER_RARITY_BY_TIER[tier - 1],
      dmg: Math.round(b.dmg * DMG_MULT * (1 + a * 0.5)), cd: b.cd, range: b.range,
      cost: Math.round([180, 450, 1000][tier - 1] * (1 + a * 0.3)),
    };
    TOWER_IDS.push(tid);
  }
  const NEW = [
    { tid: 301, name: "Cañón Pilón",         race: "aliens", eras: [1, 2], rarity: "rare",      dmg: 130, cd: 1.1,  range: 460, cost: 600,  upgTier: 2 },
    { tid: 302, name: "Aguja del Vacío",     race: "aliens", eras: [3, 4], rarity: "epic",      dmg: 230, cd: 0.8,  range: 490, cost: 1400, upgTier: 3 },
    { tid: 303, name: "Escupehuesos",        race: "deaths", eras: [1, 2], rarity: "rare",      dmg: 95,  cd: 0.9,  range: 430, cost: 580,  upgTier: 2 },
    { tid: 304, name: "Cañón de Almas",      race: "deaths", eras: [3, 4], rarity: "epic",      dmg: 250, cd: 1.4,  range: 500, cost: 1350, upgTier: 3 },
    { tid: 305, name: "Torreta Ígnea",       race: "demons", eras: [2, 3], rarity: "rare",      dmg: 150, cd: 0.85, range: 450, cost: 700,  upgTier: 2 },
    { tid: 306, name: "Aguja Apocalíptica",  race: "demons", eras: [4],    rarity: "legendary", dmg: 360, cd: 1.1,  range: 520, cost: 1600, upgTier: 3 },
    { tid: 307, name: "Obelisco Rúnico",     race: "magics", eras: [2, 3], rarity: "epic",      dmg: 170, cd: 0.7,  range: 480, cost: 900,  upgTier: 3 },
    { tid: 308, name: "Faro Celestial",      race: "magics", eras: [4],    rarity: "legendary", dmg: 300, cd: 0.55, range: 540, cost: 1500, upgTier: 3 },
    // ── Cartas de sobre (packOnly): rellenan razas sin torre propia (monsters) y amplían el resto ──
    { tid: 309, name: "Nido Espinado",       race: "monsters",eras: [1, 2], rarity: "rare",      dmg: 110, cd: 0.95, range: 440, cost: 600,  upgTier: 2, packOnly: true },
    { tid: 310, name: "Torre de Bilis",      race: "monsters",eras: [3, 4], rarity: "epic",      dmg: 240, cd: 1.0,  range: 490, cost: 1350, upgTier: 3, packOnly: true },
    { tid: 311, name: "Matriz Fotónica",     race: "aliens",  eras: [2, 3], rarity: "epic",      dmg: 180, cd: 0.75, range: 480, cost: 950,  upgTier: 3, packOnly: true },
    { tid: 312, name: "Tótem Sepulcral",     race: "deaths",  eras: [2, 3], rarity: "epic",      dmg: 170, cd: 1.0,  range: 470, cost: 880,  upgTier: 3, packOnly: true },
    { tid: 313, name: "Brasero Infernal",    race: "demons",  eras: [1, 2], rarity: "rare",      dmg: 130, cd: 0.9,  range: 450, cost: 640,  upgTier: 2, packOnly: true },
    { tid: 314, name: "Cristal Prismático",  race: "magics",  eras: [3, 4], rarity: "epic",      dmg: 210, cd: 0.65, range: 510, cost: 1200, upgTier: 3, packOnly: true },
  ];
  for (const t of NEW) {
    TOWER_CATALOG[t.tid] = { tid: t.tid, name: t.name, icon: "🗼", race: t.race, proc: true,
      availableEras: t.eras, rarity: t.rarity, dmg: t.dmg, cd: t.cd, range: t.range, cost: t.cost, upgTier: t.upgTier, packOnly: !!t.packOnly };
    TOWER_IDS.push(t.tid);
  }
})();
function isTowerId(id) { return id >= 200; }
function towerStats(tid, upgDmg, upgSpd) {
  const e = TOWER_CATALOG[tid];
  if (!e) return { dmg: 0, range: 300, cd: 1 };
  return {
    dmg: Math.round(e.dmg * (1 + 0.3 * (upgDmg || 0))),
    range: e.range,
    cd: Math.max(0.3, e.cd * (1 - 0.12 * (upgSpd || 0))),
  };
}
function towerBuyCost(tid) { const e = TOWER_CATALOG[tid]; return e ? e.cost : 999999; }
function towerUpgCost(tid, kind, lvl) {
  const e = TOWER_CATALOG[tid];
  const baseCost = kind === "dmg" ? 100 : 80;
  return Math.round(baseCost * (e ? e.upgTier : 1) * (lvl + 1));
}
function towerSellValue(tid, upgDmg, upgSpd) {
  let inv = towerBuyCost(tid);
  for (let l = 0; l < upgDmg; l++) inv += towerUpgCost(tid, "dmg", l);
  for (let l = 0; l < upgSpd; l++) inv += towerUpgCost(tid, "spd", l);
  return Math.round(inv * 0.5);
}
function getTowerUpg(side, tid, kind) {
  const m = G[side].towerUpg[kind];
  return (m && m[tid]) || 0;
}
// Torres que el jugador POSEE y puede construir en la era actual.
function ownedTowersForEra(age) {
  const col = getCollection();
  return TOWER_IDS.filter(tid => (col[tid] || 0) >= 1 && TOWER_CATALOG[tid].availableEras.includes(age));
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
const ASSET_V = "24"; // versión de assets (cache-busting); subir al regenerar sprites
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
  paths.push("assets/bg/wallpaper_init.png");
  for (const rf of Object.values(WALLPAPER_MAP)) paths.push(`assets/bg/${rf}`);
  for (const age of AGES) {
    paths.push(`assets/bases/${age}/base.png`);
    for (const rf of Object.values(RACE_BASE)) {
      paths.push(`assets/bases/${age}/${rf}.png`);
      for (let fi = 0; fi < 5; fi++) paths.push(`assets/bases/${age}/${rf}_idle${fi}.png`);
    }
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
      const sheet = manifest[age][sid]; // unidades procedurales (sin sprites) no están en el manifest
      if (!sheet) continue;
      for (const anim of ANIMS) {
        const n = sheet[anim] || 0;
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
  const sheet = manifest[age][u];
  const n = sheet ? (sheet[anim] || 0) : 0; // procedurales: sin frames -> array vacío
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
const GROUND_Y = WORLD_H - 240;
const PLAYER_BASE_X = 90;
const ENEMY_BASE_X = WORLD_W - 90;

// ---- Cámara ----------------------------------------------------------
let BW = 1280, BH = 540;
let camX = 0, camY = 0;
let camScale = 1;
let viewW = WORLD_W, viewH = WORLD_H;
let pxToWorld = 1;
let zoomLevel = 1;
// ZOOM_MIN = 1 → el nivel más alejado ya rellena el canvas entero (cover). No se
// puede alejar más (eso mostraría el vacío negro fuera del mundo). Solo acercar.
const ZOOM_MIN = 1.0, ZOOM_MAX = 2.5, ZOOM_STEP = 0.1;

function clampCam() {
  const maxCamX = Math.max(0, WORLD_W - viewW);
  camX = Math.max(0, Math.min(camX, maxCamX));
  if (viewH >= WORLD_H) {
    // El mundo no llena el alto: anclar el suelo abajo; el exceso es cielo arriba.
    camY = WORLD_H - viewH;
  } else {
    // Con zoom: se puede desplazar verticalmente dentro del mundo (arrastre libre).
    camY = Math.max(0, Math.min(WORLD_H - viewH, camY));
  }
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = CV.clientWidth || 1280;
  const cssH = CV.clientHeight || 540;
  BW = Math.max(1, Math.round(cssW * dpr));
  BH = Math.max(1, Math.round(cssH * dpr));
  if (CV.width !== BW) CV.width = BW;
  if (CV.height !== BH) CV.height = BH;
  // Nivel base (zoomLevel=1): ajustar el ANCHO completo del mundo → ambas bases
  // siempre visibles. El exceso vertical (pantallas 16:9) se rellena con cielo.
  camScale = (BW / WORLD_W) * zoomLevel;
  viewW = BW / camScale;
  viewH = BH / camScale;
  pxToWorld = dpr / camScale;
  clampCam();
}

function updateZoom(delta) {
  zoomLevel = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel + delta));
  resizeCanvas();
}
window.addEventListener("resize", resizeCanvas);

// Arrastre de cámara (mouse + touch) — horizontal y vertical (con zoom).
let dragging = false, dragStartX = 0, dragStartY = 0, camStartX = 0, camStartY = 0;
function camPointerDown(clientX, clientY) { dragging = true; dragStartX = clientX; dragStartY = clientY; camStartX = camX; camStartY = camY; }
function camPointerMove(clientX, clientY) {
  if (!dragging) return;
  camX = camStartX - (clientX - dragStartX) * pxToWorld;
  camY = camStartY - (clientY - dragStartY) * pxToWorld;
  clampCam();
}
function camPointerUp() { dragging = false; }

CV.addEventListener("mousedown", (e) => camPointerDown(e.clientX, e.clientY));
window.addEventListener("mousemove", (e) => camPointerMove(e.clientX, e.clientY));
window.addEventListener("mouseup", camPointerUp);
CV.addEventListener("touchstart", (e) => { if (e.touches[0]) camPointerDown(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
CV.addEventListener("touchmove", (e) => {
  if (e.touches[0]) { camPointerMove(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }
}, { passive: false });
window.addEventListener("touchend", camPointerUp);
CV.addEventListener("wheel", (e) => {
  e.preventDefault();
  // Zoom con la rueda, manteniendo fijo el punto del mundo bajo el cursor (ambos ejes).
  const rect = CV.getBoundingClientRect();
  const px = (e.clientX - rect.left) * (CV.width / rect.width);
  const py = (e.clientY - rect.top) * (CV.height / rect.height);
  const wxBefore = px / camScale + camX;
  const wyBefore = py / camScale + camY;
  const dir = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
  updateZoom(dir);
  const wxAfter = px / camScale + camX;
  const wyAfter = py / camScale + camY;
  camX += wxBefore - wxAfter;
  camY += wyBefore - wyAfter;
  clampCam();
}, { passive: false });

// ---- Entidades -------------------------------------------------------
class Unit {
  constructor(side, age, type, spriteId, uid) {
    this.side = side;
    this.age = age;
    this.type = type;
    this.uid = uid != null ? uid : null;
    this.spriteId = spriteId || type;
    const s = unitBase(uid, age, type);
    const cs = computeStats(uid, age, side);
    this.lvl = cs.lvl;            // nivel "horneado" al nacer
    this.cost = s.cost;
    this.maxHp = cs.hp;
    this.dmg = cs.dmg;
    this.baseCD = getBaseCD(age, type);
    this.cd = cs.cd;
    this.spd = cs.spd;
    this.range = cs.range;
    this.resist = null;
    this.armor = 0;
    this.regen = 0;
    this.rangedAttack = type === "range";
    this.hp = this.maxHp;
    this.reward = { g: s.g, xp: s.xp };
    this.atkTimer = 0;
    // Movimiento aéreo (vuela sobre el suelo) + estado de control de masas (CC)
    const def = UNIT_CATALOG[uid] || {};
    this.flying = def.movementType === "aerial";
    this.race = def.race || null;       // para render procedural (PROC_THEME)
    this.psize = def.psize || 1;        // escala del placeholder procedural
    this.cc = {};                       // estados: { charmed, ... }
    this.ability = def.specialAbility || null;
    // abilityCd inicial: transform usa `after`; periódicas un pequeño retardo; pasivas/on-death = 0
    this.abilityCd = this.ability
      ? (this.ability.type === "transform" ? this.ability.after
         : this.ability.cd != null ? Math.min(this.ability.cd, 6) : 0)
      : 0;
    this.abilityUsed = false;
    this.baseDmg = this.dmg;            // para restaurar tras frenesí
    this.baseSpd = this.spd;
    this.buffT = 0;                     // tiempo restante de buff (frenzy)
    this.targetType = def.targetType || null; // "aerial" | "ground" | null (any)
    // Nacimiento: si la unidad tiene animación "spawn", emerge antes de moverse.
    this.spawning = frames(age, this.spriteId, "spawn").length > 0;
    this.anim = this.spawning ? "spawn" : "walk";
    this.frame = 0;
    this.frameTimer = 0;
    this.dead = false;
    this.dying = false;
    this.dieTimer = 0;

    this.dir = side === "player" ? 1 : -1; // +1 mueve a la derecha
    // nacen en la puerta (borde frontal de su base) y aparecen con un fundido
    const baseImg = IMG[baseKey(age, sideRace(side))] || IMG[`assets/bases/${AGES[age]}/base.png`];
    const baseScale = BASE_SCALE[sideRace(side)] || 1;
    const halfW = baseImg ? (baseImg.width / 2) * baseScale : 150;
    this.x = side === "player"
      ? PLAYER_BASE_X + halfW - 35
      : ENEMY_BASE_X - halfW + 35;
    this.y = GROUND_Y - (this.flying ? FLIGHT_H : 0);
    this.bobPhase = Math.random() * 6.28;   // fase del balanceo de vuelo
    this.fade = 0;
    // ancho para el espaciado en fila (escalado por sprite)
    const unitScale = UNIT_SCALE[spriteId] || 1;
    // El espaciado en fila depende del ancho del SPRITE, no del combatStyle:
    // los sprites "tank" (Forzudo/Paladín/Blindado/Tanque/Mecha) son más anchos.
    const baseHalf = spriteId === "tank" ? 46 : 26;
    this.half = Math.round(baseHalf * unitScale);
    playUnitSound(this.uid, "spawn");
  }

  get walkFrames() { return frames(this.age, this.spriteId, "walk"); }

  draw() {
    const fr = frames(this.age, this.spriteId, this.dying ? "die" : this.anim);
    if (!fr.length) { this.drawProc(); return; } // sin sprite sheet -> placeholder animado
    const im = fr[Math.min(this.frame, fr.length - 1)];
    if (!im) return;

    // Orientación según el SPRITE (no el combatStyle): el sprite "tank" militar
    // mira a la izquierda aunque su unidad ahora ataque a distancia. Sprites de
    // monstruos no están en la tabla -> por defecto miran a la derecha.
    const faceRow = FACE_RIGHT[AGES[this.age]] || {};
    const nativeRight = faceRow[this.spriteId] !== undefined ? faceRow[this.spriteId] : true;
    // El jugador debe mirar a la derecha; el enemigo a la izquierda.
    const wantRight = this.side === "player";
    const flip = wantRight !== nativeRight;

    const scale = UNIT_SCALE[this.spriteId] || 1;
    const w = im.width * scale, h = im.height * scale;
    // balanceo vertical si vuela
    const bob = this.flying && !this.dying ? Math.sin(performance.now() / 380 + this.bobPhase) * 7 : 0;
    let drawY = this.y + bob;
    // las unidades aéreas caen al suelo al morir (gravedad acelerada)
    if (this.flying && this.dying) {
      const ft = Math.min(1, this.dieTimer / DIE_FALL_TIME);
      drawY = this.y + (GROUND_Y - this.y) * ft * ft;
    }
    // Sombra en el suelo (con blur para que no se vea tan falsa)
    const shadowAlpha = this.dying ? Math.max(0, 1 - this.dieTimer / DIE_TIME) : (this.fade < 1 ? this.fade : 1);
    const shadowW = w * 0.6, shadowH = w * 0.12;
    const shadowY = GROUND_Y - 2 + (this.flying ? Math.sin(performance.now() / 380 + this.bobPhase) * 3 : 0);
    ctx.save();
    ctx.filter = "blur(3px)";
    ctx.globalAlpha = shadowAlpha * 0.3;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath(); ctx.ellipse(this.x, shadowY, shadowW / 2, shadowH / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.filter = "none";
    ctx.restore();

    ctx.save();
    ctx.translate(this.x, drawY);
    if (flip) ctx.scale(-1, 1);
    if (this.dying) { const df = Math.max(0, this.dieTimer - DIE_FADE_START) / (DIE_TIME - DIE_FADE_START); ctx.globalAlpha = Math.max(0, 1 - df); }
    else if (this.fade < 1) ctx.globalAlpha = this.fade;
    // aura púrpura si está bajo control mental
    if (this.cc && this.cc.charmed && !this.dying) {
      const cy = -h * 0.45;
      const rg = ctx.createRadialGradient(0, cy, 2, 0, cy, w * 0.7);
      rg.addColorStop(0, "rgba(199,125,255,0.5)");
      rg.addColorStop(1, "rgba(199,125,255,0)");
      ctx.save(); ctx.globalAlpha = (this.fade < 1 ? this.fade : 1) * (0.6 + 0.4 * Math.sin(performance.now() / 220));
      ctx.fillStyle = rg; ctx.beginPath(); ctx.ellipse(0, cy, w * 0.7, h * 0.6, 0, 0, 6.283); ctx.fill(); ctx.restore();
    }
    ctx.drawImage(im, -w / 2, -h, w, h);
    ctx.restore();

    if (!this.dying) {
      this.drawHpBar(h, bob);
      if (this.cc && this.cc.charmed) {
        ctx.save();
        ctx.font = "15px serif"; ctx.textAlign = "center";
        ctx.fillText("🧠", this.x, this.y + bob - h - 20);
        ctx.restore();
      }
    }
  }

  drawHpBar(scaledH, bob = 0) {
    const bw = 46, bh = 5;
    const x = this.x - bw / 2;
    const topY = this.y + bob - (scaledH || 90) - 10;
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 1, topY - 1, bw + 2, bh + 2);
    const pct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = this.side === "player" ? "#4fd16b" : "#e0524a";
    ctx.fillRect(x, topY, bw * pct, bh);
  }

  // Render procedural (placeholder animado) para unidades sin sprite sheet.
  drawProc() {
    const th = PROC_THEME[this.race] || PROC_THEME.aliens;
    const t = performance.now() / 1000;
    const s = this.psize || 1;
    const bodyH = 56 * s, bodyW = 30 * s;
    const ranged = this.combatStyle === "range";
    const wantRight = this.side === "player";
    const facing = wantRight ? 1 : -1;

    // Caída + desvanecido al morir
    let fallY = 0, alpha = this.fade < 1 ? this.fade : 1, tilt = 0;
    if (this.dying) {
      const df = Math.min(1, this.dieTimer / DIE_TIME);
      alpha = Math.max(0, 1 - Math.max(0, this.dieTimer - DIE_FADE_START) / (DIE_TIME - DIE_FADE_START));
      tilt = df * 1.3 * facing;            // se desploma
      if (this.flying) fallY = (GROUND_Y - this.y) * Math.min(1, this.dieTimer / DIE_FALL_TIME) ** 2;
    }
    // Animación según estado
    const walking = this.anim === "walk" && !this.dying;
    const attacking = this.anim === "attack" && !this.dying;
    const bobFly = this.flying && !this.dying ? Math.sin(t * 3 + this.bobPhase) * 6 : 0;
    const stepBob = walking ? Math.abs(Math.sin(t * 8)) * 4 * s : 0;
    const lunge = attacking ? Math.sin(t * 14) * 8 * s * facing : 0;
    const legSwing = walking ? Math.sin(t * 8) * 6 * s : 0;

    const cx = this.x + lunge;
    const groundY = this.y + fallY;
    const topY = groundY - bodyH - stepBob;

    // Sombra
    const shAlpha = this.dying ? alpha : (this.fade < 1 ? this.fade : 1);
    ctx.save();
    ctx.globalAlpha = shAlpha * 0.28;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.filter = "blur(3px)";
    ctx.beginPath(); ctx.ellipse(this.x, GROUND_Y - 2, bodyW * 0.7, bodyW * 0.22, 0, 0, 6.283); ctx.fill();
    ctx.filter = "none"; ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, groundY + bobFly);
    ctx.rotate(tilt);
    ctx.scale(facing, 1); // todo a la derecha; espejo según bando

    // Brillo psiónico/infernal de fondo
    const gy = -bodyH * 0.6;
    const rg = ctx.createRadialGradient(0, gy, 2, 0, gy, bodyW * 1.6);
    rg.addColorStop(0, th.glow); rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save(); ctx.globalAlpha = alpha * (0.18 + 0.10 * Math.sin(t * 2 + this.bobPhase));
    ctx.fillStyle = rg; ctx.beginPath(); ctx.ellipse(0, gy, bodyW * 1.6, bodyH * 0.9, 0, 0, 6.283); ctx.fill(); ctx.restore();

    // Alas si vuela
    if (this.flying) {
      const flap = Math.sin(t * 9) * 0.5;
      ctx.fillStyle = th.dark; ctx.globalAlpha = alpha * 0.9;
      for (const dirW of [-1, 1]) {
        ctx.save(); ctx.translate(0, -bodyH * 0.7); ctx.rotate(dirW * (0.5 + flap));
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dirW * bodyW * 1.5, -bodyW * 0.4);
        ctx.lineTo(dirW * bodyW * 1.2, bodyW * 0.5); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      ctx.globalAlpha = alpha;
    } else {
      // Piernas (sólo terrestres)
      ctx.strokeStyle = th.dark; ctx.lineWidth = 5 * s; ctx.lineCap = "round";
      for (const dirL of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(dirL * bodyW * 0.22, -bodyH * 0.34);
        ctx.lineTo(dirL * bodyW * 0.22 + dirL * legSwing * 0.4 + (dirL > 0 ? legSwing : -legSwing) * 0, 0);
        ctx.stroke();
      }
    }

    // Cuerpo
    ctx.fillStyle = th.body; ctx.strokeStyle = th.edge; ctx.lineWidth = 2.5 * s;
    ctx.beginPath();
    const r = 7 * s;
    roundRectPath(-bodyW / 2, -bodyH, bodyW, bodyH * (this.flying ? 0.75 : 0.7), r);
    ctx.fill(); ctx.stroke();

    // Cabeza
    const headR = 11 * s, hy = -bodyH - headR * 0.2;
    ctx.beginPath(); ctx.arc(0, hy, headR, 0, 6.283); ctx.fill(); ctx.stroke();
    // Ojos brillantes
    ctx.fillStyle = th.eye;
    ctx.beginPath(); ctx.arc(headR * 0.4, hy - 1, 2.2 * s, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.arc(headR * 0.4, hy - 1, 2.2 * s, 0, 6.283); ctx.fill();

    // Detalle por raza
    if (this.race === "demons") { // cuernos
      ctx.fillStyle = th.edge;
      for (const dh of [-1, 1]) { ctx.beginPath(); ctx.moveTo(dh * headR * 0.6, hy - headR * 0.6); ctx.lineTo(dh * headR * 1.1, hy - headR * 1.7); ctx.lineTo(dh * headR * 0.2, hy - headR * 0.9); ctx.closePath(); ctx.fill(); }
    } else if (this.race === "deaths") { // cuencas
      ctx.fillStyle = th.dark; ctx.beginPath(); ctx.arc(headR * 0.4, hy, 3 * s, 0, 6.283); ctx.fill();
    }

    // Arma / orbe
    if (ranged) {
      const orbR = 6 * s, ox = bodyW * 0.65, oy = -bodyH * 0.5;
      const og = ctx.createRadialGradient(ox, oy, 1, ox, oy, orbR * 1.8);
      og.addColorStop(0, th.eye); og.addColorStop(0.5, th.glow); og.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = og; ctx.globalAlpha = alpha * (attacking ? 1 : 0.7);
      ctx.beginPath(); ctx.arc(ox, oy, orbR * (attacking ? 1.4 : 1), 0, 6.283); ctx.fill();
      ctx.globalAlpha = alpha;
    } else {
      // hoja/garra de melee
      ctx.strokeStyle = th.edge; ctx.lineWidth = 4 * s;
      ctx.beginPath(); ctx.moveTo(bodyW * 0.4, -bodyH * 0.55);
      ctx.lineTo(bodyW * 1.1, -bodyH * 0.55 - 14 * s); ctx.stroke();
    }

    // Aura de frenesí (demonios buffados)
    if (this.buffT > 0) {
      ctx.globalAlpha = alpha * (0.4 + 0.3 * Math.sin(t * 12));
      ctx.strokeStyle = "#ff3b1f"; ctx.lineWidth = 2 * s;
      ctx.beginPath(); ctx.arc(0, -bodyH * 0.5, bodyW * 0.95, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = alpha;
    }
    ctx.restore();

    // Aura control mental + barra de vida
    if (!this.dying) {
      this.drawHpBar(bodyH, bobFly + stepBob);
      if (this.cc && this.cc.charmed) {
        ctx.save(); ctx.font = "15px serif"; ctx.textAlign = "center";
        ctx.fillText("🧠", this.x, topY - 18); ctx.restore();
      }
    }
  }
}

// Helper: traza un rectángulo redondeado en el path actual.
function roundRectPath(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
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
function freshSide(gold, race) {
  const cfg = RACE_BASE_STATS[race] || RACE_BASE_STATS.humans;
  return {
    race: race || "humans",
    gold, xp: 0, age: 0, baseHp: cfg.base,
    cd: {},
    baseAnimTimer: 0, baseAnimFrame: 0,
    tech: {},  // árbol tecnológico de la raza: { [techId]: lvl }
    uupg: {},  // mejoras propias por unidad: { [uid]: { [upgKey]: lvl } }
    towerUpg: { dmg: {}, spd: {} }, // mejoras por tid: { dmg:{[tid]:lvl}, spd:{...} }
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
  // Reanimar (no-muertos): al morir levanta minions de su cadáver.
  if (t.ability && t.ability.type === "reanimate") {
    const def = UNIT_CATALOG[t.ability.into];
    if (def) {
      const cnt = t.ability.count || 1;
      for (let k = 0; k < cnt; k++) {
        const nu = new Unit(t.side, t.age, def.combatStyle, def.spriteId, t.ability.into);
        nu.x = t.x + (k - (cnt - 1) / 2) * 22;
        nu.y = GROUND_Y - (nu.flying ? FLIGHT_H : 0);
        nu.dir = t.dir;
        G.units.push(nu);
      }
      G.floats.push(new FloatText(t.x, t.y - 70, "⚰️ ¡Reanimación!", "#9bff9b"));
    }
  }
}

// ---- Spawning --------------------------------------------------------
function trySpawn(side, type, spriteId, uid) {
  const st = G[side];
  // Si no se dio uid (IA/enemigo), resolver la unidad por raza+era+tipo.
  if (uid == null) {
    const u = UnitDB.getUnitForStyle(sideRace(side), st.age, type);
    if (!u) return false;
    uid = u.id; spriteId = spriteId || u.spriteId;
  }
  const uDef = UNIT_CATALOG[uid];
  if (!spriteId) spriteId = (uDef && uDef.spriteId) || type; // evita caer al sprite humano por defecto
  const s = unitBase(uid, st.age, type);
  if (st.gold < s.cost || (st.cd[uid] || 0) > 0) return false;
  st.gold -= s.cost;
  st.cd[uid] = (uDef && uDef.cooldown != null) ? uDef.cooldown : SPAWN_CD;
  G.units.push(new Unit(side, st.age, type, spriteId, uid));
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

function tryBuyTower(side, slot, tid) {
  const st = G[side];
  if (slot >= st.slots || st.towers[slot]) return false;
  if (!TOWER_CATALOG[tid]) return false;
  const cost = towerBuyCost(tid);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.towers[slot] = { tid, cd: 0, angle: 0, fireAnim: 0, animFrame: 0, animTimer: 0 };
  return true;
}

function tryUpgradeTower(side, slot, kind) {
  const st = G[side];
  const t = st.towers[slot];
  if (!t) return false;
  const lvl = getTowerUpg(side, t.tid, kind);
  if (lvl >= MAX_TOWER_UPG) return false;
  const cost = towerUpgCost(t.tid, kind, lvl);
  if (st.gold < cost) return false;
  st.gold -= cost;
  st.towerUpg[kind][t.tid] = lvl + 1;
  return true;
}

function trySellTower(side, slot) {
  const st = G[side];
  const t = st.towers[slot];
  if (!t) return false;
  const d = getTowerUpg(side, t.tid, "dmg");
  const s = getTowerUpg(side, t.tid, "spd");
  st.gold += towerSellValue(t.tid, d, s);
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
  // +vida máxima por edad; suma el crecimiento de la raza sin curar del todo
  const cfg = RACE_BASE_STATS[sideRace(side)] || RACE_BASE_STATS.humans;
  st.baseHp = Math.min(baseMaxHp(st.age, sideRace(side)), st.baseHp + cfg.perAge);
  if (side === "player") {
    G.floats.push(new FloatText(W / 2, H / 2, "¡Nueva Edad: " + AGE_NAMES[st.age] + "!", "#7af0c0"));
  }
  return true;
}

// ---- Lógica de combate y movimiento ----------------------------------
function update(dt) {
  if (G.over) return;
  updateInfection(dt);
  updateAbilities(dt);
  updateCharms(dt);

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
  for (const uid in G.player.cd) { G.player.cd[uid] -= dt; if (G.player.cd[uid] <= 0) delete G.player.cd[uid]; }
  for (const uid in G.enemy.cd) { G.enemy.cd[uid] -= dt; if (G.enemy.cd[uid] <= 0) delete G.enemy.cd[uid]; }

  if (G.mode === "ai") runAI(dt);

  // Regeneración de base para razas monstruo
  for (const s of ["player","enemy"]) {
    const st = G[s];
    const r = RACE_BASE_STATS[st.race] || RACE_BASE_STATS.humans;
    const rVal = Array.isArray(r.regen) ? r.regen[0] + r.regen[1] * st.age : (r.regen || 0);
    if (rVal > 0 && st.baseHp < baseMaxHp(st.age, st.race)) {
      st.baseHp = Math.min(baseMaxHp(st.age, st.race), st.baseHp + rVal * dt);
    }
    // Animación idle de la base (cambia frame cada 0.25s, 5 frames)
    st.baseAnimTimer += dt;
    if (st.baseAnimTimer >= 0.25) {
      st.baseAnimTimer = 0;
      st.baseAnimFrame = (st.baseAnimFrame + 1) % 5;
    }
  }

  // separar vivos por bando (una sola pasada) y avanzar la animación de muerte
  const players = [], enemies = [];
  let anyDead = false;
  for (const u of G.units) {
    if (u.dead) { anyDead = true; continue; } // mutadas/eliminadas fuera del ciclo de muerte
    if (u.dying) {
      u.dieTimer += dt;
      advanceAnim(u, dt, "die", false);
      if (u.dieTimer >= DIE_TIME) { u.dead = true; anyDead = true; }
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
  const dir = side === "player" ? 1 : -1;
  for (let i = 0; i < list.length; i++) {
    const u = list[i];
    // Elegir objetivo según targetType de la unidad
    let frontEnemy = null;
    if (u.targetType === "aerial") {
      frontEnemy = enemyList.find(e => e.flying && !e.dead && !e.dying);
    } else if (u.targetType === "ground") {
      frontEnemy = enemyList.find(e => !e.flying && !e.dead && !e.dying);
    } else {
      frontEnemy = enemyList.length ? enemyList[0] : null;
    }
    if (u.fade < 1) u.fade = Math.min(1, u.fade + dt / 0.4);
    // Fase de nacimiento: emerge en su sitio, sin moverse ni atacar.
    if (u.spawning) {
      advanceAnim(u, dt, "spawn", false);
      const sf = frames(u.age, u.spriteId, "spawn");
      if (u.frame >= sf.length - 1) u.spawning = false;
      continue;
    }
    // Soporte de control mental (Wormmint): tras el primer uso se queda fijo.
    // Animación: "attack" mientras canaliza (víctima viva), "idle" al recargar.
    if (u.ability && u.ability.type === "mindControl" && u.abilityUsed) {
      const t = u.charmTarget;
      const channeling = t && !t.dead && !t.dying && t.cc && t.cc.charmed && t.side === u.side;
      advanceAnim(u, dt, channeling ? "attack" : "idle", true);
      continue;
    }
    const prevX = u.x;
    let attacking = false;

    const tdist = frontEnemy ? Math.abs(frontEnemy.x - u.x) : Infinity;
    // Alcance melee = el MAYOR entre su rango y la distancia a la que el cuerpo
    // queda pegado al objetivo (suma de medios anchos). Así el melee camina hasta
    // TOCAR (sin hueco) y, contra unidades anchas (tanques), igual puede golpear
    // aunque la separación de colisión supere su rango. Los ranged usan su rango tal cual.
    const touchDist = frontEnemy ? (u.half + frontEnemy.half + 4) : 0;
    const reach = u.rangedAttack ? u.range : Math.max(u.range, touchDist);
    const enemyInRange = frontEnemy && tdist <= reach;

    if (enemyInRange && u.dmg > 0) {
      attacking = true;
      u.atkTimer -= dt;
      if (u.atkTimer <= 0) { u.atkTimer = u.cd; dealAttack(u, frontEnemy); }
    } else if (enemyInRange && u.dmg <= 0) {
      // Soporte (Wormmint): no ataca; se queda quieto en idle (recargando habilidad)
      // attacking se queda en false -> abajo cae a "idle"
    } else if (!enemyInRange && u.targetType !== "aerial" && u.dmg > 0 && Math.abs(enemyBaseX - u.x) <= u.range) {
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
      let nextX = u.x + dir * u.spd * dt;
      // Aliados: se traspasan libremente (no se bloquean entre sí); cada unidad
      // sigue caminando hasta toparse con un enemigo. Solo los enemigos detienen.
      // Colisión con enemigos: no atravesar unidades enemigas (Battle Cats-style)
      if (enemyList.length > 0) {
        const fe = enemyList[0];
        const minGap = u.half + fe.half + 2;
        if (side === "player" && fe.x > u.x) {
          nextX = Math.min(nextX, fe.x - minGap);
        } else if (side === "enemy" && fe.x < u.x) {
          nextX = Math.max(nextX, fe.x + minGap);
        }
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
  if (u.dmg <= 0) return; // unidades de soporte (p.ej. Wormmint) no hacen daño
  if (u.rangedAttack) {
    G.projectiles.push(new Projectile(u.x, u.y - 50, target, u.dmg, u.side, undefined, u.type));
  } else {
    hitTarget(target, u.dmg, u.side, u.type);
  }
  // Robo de vida (demonios): el atacante se cura una fracción del daño infligido.
  if (u.ability && u.ability.type === "lifesteal" && u.hp < u.maxHp) {
    const heal = u.dmg * (u.ability.frac || 0.3);
    u.hp = Math.min(u.maxHp, u.hp + heal);
    G.floats.push(new FloatText(u.x, u.y - 95, "+" + Math.round(heal), "#7af07a"));
  }
}

// ---- Habilidades automáticas de unidad -------------------------------
// Recorre las unidades con `specialAbility`, baja su cooldown y la ejecuta.
function updateAbilities(dt) {
  if (!G.units) return;
  for (const u of G.units) {
    if (!u.ability || u.dead || u.dying || u.spawning) continue;
    // Frenesí activo: cuenta atrás y restaura stats al expirar.
    if (u.buffT > 0) {
      u.buffT -= dt;
      if (u.buffT <= 0) { u.dmg = u.baseDmg; u.spd = u.baseSpd; }
    }
    // lifesteal y reanimate son pasivas (no tienen cd que tickear aquí)
    if (u.ability.type === "lifesteal" || u.ability.type === "reanimate") continue;
    u.abilityCd -= dt;
    if (u.abilityCd > 0) continue;
    const ab = u.ability;
    if (ab.type === "transform") {
      transformUnit(u, ab.into[(Math.random() * ab.into.length) | 0]);
      continue;
    }
    if (ab.type === "mindControl") {
      const foes = G.units.filter(t =>
        t.side !== u.side && !t.dead && !t.dying && !t.spawning && !(t.cc && t.cc.charmed));
      if (!foes.length) { u.abilityCd = 0.5; continue; }
      mindControl(foes[(Math.random() * foes.length) | 0], u);
      u.abilityCd = ab.cd;
      u.abilityUsed = true;
    } else if (ab.type === "summon") {
      // Invoca `count` minions del lado del caster, junto a él.
      const cnt = ab.count || 1;
      for (let k = 0; k < cnt; k++) {
        const def = UNIT_CATALOG[ab.into]; if (!def) break;
        const nu = new Unit(u.side, u.age, def.combatStyle, def.spriteId, ab.into);
        nu.x = u.x - u.dir * (20 + k * 18); // detrás del invocador
        nu.y = GROUND_Y - (nu.flying ? FLIGHT_H : 0);
        nu.dir = u.dir;
        G.units.push(nu);
      }
      u.abilityCd = ab.cd;
      G.floats.push(new FloatText(u.x, u.y - 70, "☠️ ¡Invocación!", "#9bff9b"));
    } else if (ab.type === "heal") {
      // Cura al aliado más herido en rango (excluye al propio sanador si está full).
      let best = null, bestMiss = 0;
      for (const t of G.units) {
        if (t.side !== u.side || t.dead || t.dying || t.spawning) continue;
        if (Math.abs(t.x - u.x) > (ab.range || 240)) continue;
        const miss = t.maxHp - t.hp;
        if (miss > bestMiss) { bestMiss = miss; best = t; }
      }
      if (best) {
        best.hp = Math.min(best.maxHp, best.hp + ab.amount);
        G.floats.push(new FloatText(best.x, best.y - 90, "+" + ab.amount, "#7af0c0"));
        u.abilityCd = ab.cd;
      } else { u.abilityCd = 0.6; } // nadie herido: reintenta pronto
    } else if (ab.type === "bolt") {
      // Hostigamiento: daño directo a un enemigo en rango.
      const foes = G.units.filter(t =>
        t.side !== u.side && !t.dead && !t.dying && !t.spawning && Math.abs(t.x - u.x) <= (ab.range || 300));
      if (!foes.length) { u.abilityCd = 0.4; continue; }
      const tgt = foes[(Math.random() * foes.length) | 0];
      hitTarget(tgt, ab.dmg, u.side, u.type);
      G.floats.push(new FloatText(u.x, u.y - 80, "✦", u.race === "demons" ? "#ff7a2b" : "#9fd8ff"));
      u.abilityCd = ab.cd;
    } else if (ab.type === "frenzy") {
      // Buff temporal de daño y velocidad sobre sí mismo.
      u.dmg = u.baseDmg * (ab.dmgMul || 1.5);
      u.spd = u.baseSpd * (ab.spdMul || 1.3);
      u.buffT = ab.dur || 4;
      u.abilityCd = ab.cd;
      G.floats.push(new FloatText(u.x, u.y - 80, "🔥 ¡Frenesí!", "#ff5230"));
    }
  }
}

// Mutación de la larva: desaparece y nace la unidad destino en su sitio.
function transformUnit(u, intoId) {
  const def = UNIT_CATALOG[intoId];
  if (!def) { u.abilityCd = 1; return; }
  const nu = new Unit(u.side, u.age, def.combatStyle, def.spriteId, intoId);
  nu.x = u.x;
  nu.y = GROUND_Y - (nu.flying ? FLIGHT_H : 0);
  nu.dir = u.dir;
  G.units.push(nu);
  u.dead = true; // la larva desaparece; el split loop la barre
  G.floats.push(new FloatText(u.x, u.y - 60, "🧬 ¡Mutación!", "#9f7aea"));
}

// Controla la mente de una unidad: cambia su bando por 5 segundos.
function mindControl(victim, caster) {
  if (!victim.cc) victim.cc = {};
  victim.cc.originalSide = victim.side;
  victim.side = caster.side;
  victim.cc.charmed = true;
  victim.cc.charmedTime = 5;
  victim.atkTimer = 0;
  caster.charmTarget = victim;   // el caster canaliza mientras esta víctima viva
  G.floats.push(new FloatText(victim.x, victim.y - 70, "🧠 ¡Controlado!", "#c77dff"));
}

function updateCharms(dt) {
  for (const u of G.units) {
    if (u.dead || u.dying) continue;
    if (u.cc && u.cc.charmed) {
      u.cc.charmedTime -= dt;
      if (u.cc.charmedTime <= 0) {
        u.cc.charmed = false;
        if (u.cc.originalSide) u.side = u.cc.originalSide;
        u.cc.originalSide = null;
        u.atkTimer = 0;
        G.floats.push(new FloatText(u.x, u.y - 70, "🧠 Control liberado", "#a0aec0"));
      }
    }
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
    const e = TOWER_CATALOG[t.tid] || {};
    // proyectil: sprite reusa el de su era/tier; procedurales usan genérico (-1)
    const projIdx = e.proc ? -1 : (e.spriteAge * 3 + (e.tier - 1));
    if (t.fireAnim > 0) {
      t.animTimer += dt;
      const nf = (projIdx >= 0 ? TOWER_ATTACK_FRAMES[projIdx] : 0) || 1;
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

    if (!frontEnemy || frontEnemy.dying) {
      t.angle = 0;
      continue;
    }

    const upgDmg = getTowerUpg(side, t.tid, "dmg");
    const upgSpd = getTowerUpg(side, t.tid, "spd");
    const ts = towerStats(t.tid, upgDmg, upgSpd);
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
  const fr = frames(u.age, u.spriteId, u.dying ? "die" : anim);
  if (!fr.length) return;
  let fps = anim === "attack" ? 14 : 12;
  if (anim === "attack" && !u.dying && u.baseCD && u.cd) {
    // la animación de ataque sigue la cadencia horneada (tech de vel. de ataque)
    fps = 14 * Math.max(1, Math.min(2.5, u.baseCD / u.cd));
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
let aiRace = (function(){ try { return localStorage.getItem("aow_ai_race") || "humans"; } catch { return "humans"; } })();

// ¿Tiene la raza una unidad de ese combatStyle en esa era? (para la IA, por raza)
function aiStyleAvailable(race, style, age) { return !!UnitDB.getUnitForStyle(race, age, style); }
// Elige una unidad de combate de la raza/era/estilo. Descarta soporte, 0-dmg y
// "fillers" lentos (larva/transform). NO penaliza unidades baratas: las razas de
// enjambre (monsters) deben poder spamear sus unidades baratas.
function aiPickUnit(race, age, style, maxGold) {
  const cands = UNIT_IDS.filter(id => {
    const u = UNIT_CATALOG[id];
    return u.race === race && u.combatStyle === style && u.availableEras.includes(age);
  });
  if (!cands.length) return null;
  let pool = cands.filter(id => {
    const u = UNIT_CATALOG[id];
    if (u.class === "support") return false;
    if (u.specialAbility && u.specialAbility.type === "transform") return false; // larva: tarda 10s en servir
    return u.stats ? u.stats.dmg > 0 : true;
  });
  if (!pool.length) pool = cands;
  // Solo elegir entre las que se pueden pagar; si ninguna, la más barata (evita ciclos
  // desperdiciados al elegir una unidad cara sin oro suficiente → clave para el enjambre).
  if (maxGold != null) {
    const cost = id => unitBase(id, age, UNIT_CATALOG[id].combatStyle).cost;
    const afford = pool.filter(id => cost(id) <= maxGold);
    if (afford.length) pool = afford;
    else pool = [pool.reduce((a, b) => cost(a) <= cost(b) ? a : b)];
  }
  return pool[(Math.random() * pool.length) | 0];
}

function unitCost(side, type) {
  const st = G[side];
  const u = UnitDB.getUnitForStyle(sideRace(side), st.age, type);
  return u && u.stats ? u.stats.cost : 999999;
}

function runAI(dt) {
  const ai = G.enemy;
  const D = DIFF[difficulty];
  ai.gold += (PASSIVE_GOLD + AGE_GOLD * ai.age) * D.aiIncome * dt;
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
  const aiRaceNow = sideRace("enemy");
  const allTypes = UNIT_TYPES.filter(t => aiStyleAvailable(aiRaceNow, t, ai.age));
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
      // La IA (humanos) usa las torres existentes de su era (tier 1/2/3 → tid)
      const t1 = towerTidFor(ai.age, 1), t2 = towerTidFor(ai.age, 2), t3 = towerTidFor(ai.age, 3);
      if (built < D.towers && empty >= 0 && ai.gold > towerBuyCost(t1) * 1.4) {
        let tid = t1;
        if (ai.gold > towerBuyCost(t3) * 1.5) tid = t3;
        else if (ai.gold > towerBuyCost(t2) * 1.5) tid = t2;
        tryBuyTower("enemy", empty, tid);
      } else if (built < D.towers && empty < 0 && ai.slots < MAX_SLOTS && ai.gold > SLOT_COST[ai.slots] * 1.4) {
        tryBuySlot("enemy");
      } else {
        for (let i = 0; i < ai.slots; i++) {
          const t = ai.towers[i]; if (!t) continue;
          const ud = getTowerUpg("enemy", t.tid, "dmg"), us = getTowerUpg("enemy", t.tid, "spd");
          if (ud < MAX_TOWER_UPG && ai.gold > towerUpgCost(t.tid, "dmg", ud) * 1.6) { tryUpgradeTower("enemy", i, "dmg"); break; }
          if (us < MAX_TOWER_UPG && ai.gold > towerUpgCost(t.tid, "spd", us) * 1.6) { tryUpgradeTower("enemy", i, "spd"); break; }
        }
      }
    }
  }

  // ---- INVESTIGACIÓN (árbol tecnológico de la raza): compra el tech disponible
  // más barato que aún no esté al máximo, priorizando los de su era. ----
  if (ai.aiUpgTimer <= 0) {
    ai.aiUpgTimer = D.upgEvery * (0.7 + Math.random() * 0.6);
    const techs = availableTechs(sideRace("enemy"), ai.age)
      .filter(t => (ai.tech[t.id] || 0) < t.maxLvl)
      .sort((a, b) => techCost(a, ai.tech[a.id] || 0) - techCost(b, ai.tech[b.id] || 0));
    for (const t of techs) {
      const cost = techCost(t, ai.tech[t.id] || 0);
      if (ai.gold > cost * D.upgAfford) { tryTech("enemy", t.id); break; }
    }
    // Mejoras de unidad: la IA invierte en las unidades de su era (medio+).
    if (D.econ >= 0.6 && typeof UnitDB !== "undefined") {
      if (!ai.uupg) ai.uupg = {};
      const ids = UnitDB.getAvailableIdsByRace(aiRaceNow, ai.age) || [];
      let best = null, bestCost = Infinity;
      for (const uid of ids) {
        for (const up of availableUnitUpgs(uid, ai.age)) {
          const lvl = (ai.uupg[uid] && ai.uupg[uid][up.key]) || 0;
          if (lvl >= up.maxLvl) continue;
          const c = unitUpgCost(up, lvl);
          if (c < bestCost) { bestCost = c; best = { uid, key: up.key, c }; }
        }
      }
      if (best && ai.gold > best.c * (D.upgAfford + 0.4)) tryUnitUpg("enemy", best.uid, best.key);
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
  const types = UNIT_TYPES.filter(t => aiStyleAvailable(aiRaceNow, t, ai.age));
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
  if (types.includes("tank") && D.comp[2] >= 0.15 && tc === 0 && ai.gold >= unitCost("enemy", "tank") * 0.4) bestT = "tank";

  // reservar oro para el próximo aldeano (tras un pequeño ejército inicial)
  const reserve = (ai.villagers < wantVill) ? villagerCost(ai.villagers) * 0.9 : 0;

  // ahorrar para la unidad deseada en vez de spamear melee
  let cost = unitCost("enemy", bestT);
  // umbral de espera: cuanto mayor D.save, antes empieza a ahorrar para la cara
  const waitThresh = cost * (1 - D.save * 0.55); // extreme≈0.45·c, easy≈0.75·c
  if (ai.gold < cost) {
    if (ai.gold >= waitThresh) { ai.aiTimer = 0.4; return; } // casi alcanza: ahorrar
    // si no, comprar la mejor (más cara) alternativa asequible
    bestT = null;
    for (const t of types) {
      const tc = unitCost("enemy", t);
      if (ai.gold >= tc && (!bestT || tc > unitCost("enemy", bestT))) bestT = t;
    }
    if (!bestT) { ai.aiTimer = 0.5; return; }
    cost = unitCost("enemy", bestT);
  }

  // si gastar dejaría sin oro para el aldeano pendiente, esperar (ya con ejército base)
  if (army >= 2 && reserve > 0 && ai.gold - cost < reserve) { ai.aiTimer = 0.6; return; }

  const pickUid = aiPickUnit(aiRaceNow, ai.age, bestT, ai.gold);
  const ok = pickUid ? trySpawn("enemy", bestT, null, pickUid) : trySpawn("enemy", bestT);
  ai.aiTimer = ok ? (D.spawnMin + Math.random() * 0.5) : 0.4;
}

// ---- Render ----------------------------------------------------------
function drawBackground() {
  // Fondo sólido que cubre todo el canvas visible (más allá del mundo si el zoom muestra extra)
  ctx.fillStyle = "#0a0c12";
  ctx.fillRect(-WORLD_W, -WORLD_H, WORLD_W * 3, WORLD_H * 3);
  const initImg = IMG["assets/bg/wallpaper_init.png"] || IMG["assets/bg/wallpaper.png"] || IMG["assets/bg/background.png"];
  if (!initImg) return;

  const scale = Math.max(WORLD_W / initImg.width, WORLD_H / initImg.height);
  const sw = initImg.width * scale, sh = initImg.height * scale;
  const dx = (WORLD_W - sw) / 2;
  const dy = WORLD_H - sh;

  // Cielo extendido: estira la fila superior del wallpaper hacia arriba para
  // cubrir el exceso vertical (pantallas 16:9) sin dejar vacío negro.
  if (dy > -WORLD_H * 2) {
    ctx.drawImage(initImg, 0, 0, initImg.width, 1, dx, dy - WORLD_H * 2, sw, WORLD_H * 2 + 1);
  }
  // Capa base: wallpaper init
  ctx.drawImage(initImg, dx, dy, sw, sh);

  // Infección izquierda (raza del jugador) y derecha (raza del enemigo)
  const leftImg = IMG[wallpaperKey(sideRace("player"))];
  if (leftImg) drawInfection(leftImg, -1, infectProg.player, dx, dy, sw, sh);
  const rightImg = IMG[wallpaperKey(sideRace("enemy"))];
  if (rightImg) drawInfection(rightImg, 1, infectProg.enemy, dx, dy, sw, sh);
}

// Dibuja el wallpaper de una raza desde un borde, recortado por una máscara
// con contorno irregular animado (borde orgánico) + degradado en el filo.
function drawInfection(img, dir, prog, dx, dy, sw, sh) {
  if (prog <= 0.005) return;
  if (!_infCv) {
    _infCv = document.createElement("canvas");
    _infCv.width = WORLD_W; _infCv.height = WORLD_H;
    _infCtx = _infCv.getContext("2d");
  }
  const m = _infCtx;
  m.setTransform(1, 0, 0, 1, 0, 0);
  m.clearRect(0, 0, WORLD_W, WORLD_H);

  // 1) wallpaper de la raza cubriendo todo el mundo
  m.globalAlpha = 1;
  m.globalCompositeOperation = "source-over";
  m.drawImage(img, dx, dy, sw, sh);

  // 2) recortar por la forma de infección (destination-in)
  m.globalCompositeOperation = "destination-in";
  const reach = prog * WORLD_W;
  const frontX = dir === -1 ? reach : WORLD_W - reach;
  const t = performance.now() / 1000;
  const STEP = 12;

  m.beginPath();
  if (dir === -1) {
    m.moveTo(0, 0);
    for (let y = 0; y <= WORLD_H; y += STEP) {
      const n = infectNoise(y / 64, y * 0.012 + t * 0.5);
      m.lineTo(reach + n * INFECT_AMP, y);
    }
    m.lineTo(0, WORLD_H);
  } else {
    m.moveTo(WORLD_W, 0);
    for (let y = 0; y <= WORLD_H; y += STEP) {
      const n = infectNoise(y / 64, y * 0.012 + t * 0.5 + 11.3);
      m.lineTo(WORLD_W - reach + n * INFECT_AMP, y);
    }
    m.lineTo(WORLD_W, WORLD_H);
  }
  m.closePath();

  // degradado de alpha perpendicular al filo (transición amplia y gradual)
  const g = dir === -1
    ? m.createLinearGradient(frontX - INFECT_FADE, 0, frontX + INFECT_AMP, 0)
    : m.createLinearGradient(frontX + INFECT_FADE, 0, frontX - INFECT_AMP, 0);
  g.addColorStop(0.0, "rgba(0,0,0,1)");
  g.addColorStop(0.35, "rgba(0,0,0,0.75)");
  g.addColorStop(0.65, "rgba(0,0,0,0.4)");
  g.addColorStop(0.85, "rgba(0,0,0,0.15)");
  g.addColorStop(1.0, "rgba(0,0,0,0)");
  m.fillStyle = g;
  // desenfoque del filo: difumina el contorno de recorte -> borde imperceptible
  m.filter = `blur(${INFECT_BLUR}px)`;
  m.fill();
  m.filter = "none";

  // 3) volcar la capa infectada sobre el fondo
  ctx.drawImage(_infCv, 0, 0);
}

// Razas con base procedural (sin sprite propio): se dibujan a canvas por era.
const PROC_BASE_RACES = new Set(["aliens", "deaths", "demons", "magics"]);

function drawBase(side) {
  const st = G[side];
  const race = sideRace(side);
  const x = side === "player" ? PLAYER_BASE_X : ENEMY_BASE_X;
  if (PROC_BASE_RACES.has(race)) { drawProcBase(x, race, st.age, side === "enemy"); return; }
  const baseKeyPath = baseKey(st.age, race);
  const idleKey = baseKeyPath.replace(".png", `_idle${st.baseAnimFrame}.png`);
  const im = IMG[idleKey] || IMG[baseKeyPath] || IMG[`assets/bases/${AGES[st.age]}/base.png`];
  if (im) {
    const s = BASE_SCALE[race] || 1;
    const w = im.width * s, h = im.height * s;
    ctx.save();
    ctx.translate(x, GROUND_Y + 20);
    if (side === "enemy") ctx.scale(-1, 1);
    ctx.drawImage(im, -w / 2, -h, w, h);
    ctx.restore();
  }
}

// Base procedural temática por raza, que se elabora con la era.
function drawProcBase(x, race, age, flip) {
  const th = PROC_THEME[race] || PROC_THEME.aliens;
  const t = performance.now() / 1000;
  const bw = 150 + age * 14;          // ancho crece por era
  const bh = 150 + age * 24;          // alto crece por era
  const pulse = 0.5 + 0.5 * Math.sin(t * 2);
  ctx.save();
  ctx.translate(x, GROUND_Y + 20);
  if (flip) ctx.scale(-1, 1);

  // Halo de energía detrás de la base
  const hg = ctx.createRadialGradient(0, -bh * 0.5, 4, 0, -bh * 0.5, bw);
  hg.addColorStop(0, th.glow); hg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save(); ctx.globalAlpha = 0.12 + 0.06 * pulse; ctx.fillStyle = hg;
  ctx.beginPath(); ctx.ellipse(0, -bh * 0.5, bw, bh * 0.8, 0, 0, 6.283); ctx.fill(); ctx.restore();

  ctx.lineJoin = "round";
  ctx.strokeStyle = th.edge; ctx.lineWidth = 4;

  if (race === "aliens") {
    // Nexus: cuerpo abovedado + cristal flotante (más cristales por era)
    ctx.fillStyle = th.dark;
    ctx.beginPath();
    ctx.moveTo(-bw * 0.5, 0); ctx.lineTo(-bw * 0.38, -bh * 0.6);
    ctx.lineTo(0, -bh * 0.8); ctx.lineTo(bw * 0.38, -bh * 0.6);
    ctx.lineTo(bw * 0.5, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = th.body;
    ctx.beginPath(); ctx.moveTo(-bw * 0.22, 0); ctx.lineTo(-bw * 0.16, -bh * 0.4);
    ctx.lineTo(bw * 0.16, -bh * 0.4); ctx.lineTo(bw * 0.22, 0); ctx.closePath(); ctx.fill();
    // Cristal flotante
    const cy = -bh - 18 - 6 * pulse;
    ctx.fillStyle = th.glow; ctx.globalAlpha = 0.7 + 0.3 * pulse;
    ctx.beginPath(); ctx.moveTo(0, cy - 26); ctx.lineTo(16, cy); ctx.lineTo(0, cy + 22); ctx.lineTo(-16, cy); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1; ctx.strokeStyle = th.edge; ctx.stroke();
    for (let i = 0; i < age; i++) { // mini cristales por era
      const px = (i % 2 ? 1 : -1) * (bw * 0.4 - i * 4), py = -bh * 0.5 - (i >> 1) * 16;
      ctx.fillStyle = th.glow; ctx.globalAlpha = 0.6 + 0.4 * pulse;
      ctx.beginPath(); ctx.moveTo(px, py - 10); ctx.lineTo(px + 6, py); ctx.lineTo(px, py + 9); ctx.lineTo(px - 6, py); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (race === "deaths") {
    // Fortaleza de huesos: cuerpo + espolones (más por era) + calavera sobre la puerta
    ctx.fillStyle = th.dark;
    roundRectPath(-bw * 0.5, -bh * 0.7, bw, bh * 0.7, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = th.body;
    for (let i = 0; i <= age + 2; i++) { // espolones óseos
      const px = -bw * 0.5 + (i + 0.5) * (bw / (age + 3));
      ctx.beginPath(); ctx.moveTo(px - 7, -bh * 0.7); ctx.lineTo(px, -bh * 0.7 - 22 - (i % 2) * 10); ctx.lineTo(px + 7, -bh * 0.7); ctx.closePath(); ctx.fill();
    }
    // Calavera-puerta
    ctx.fillStyle = th.body; ctx.beginPath(); ctx.arc(0, -bh * 0.32, bw * 0.16, 0, 6.283); ctx.fill(); ctx.stroke();
    ctx.fillStyle = th.dark;
    ctx.beginPath(); ctx.arc(-bw * 0.06, -bh * 0.35, 6, 0, 6.283); ctx.arc(bw * 0.06, -bh * 0.35, 6, 0, 6.283); ctx.fill();
  } else if (race === "demons") {
    // Ciudadela infernal: cuerpo oscuro + cuernos + foso de lava brillante
    ctx.fillStyle = th.dark;
    ctx.beginPath();
    ctx.moveTo(-bw * 0.5, 0); ctx.lineTo(-bw * 0.45, -bh * 0.7); ctx.lineTo(-bw * 0.2, -bh * 0.55);
    ctx.lineTo(0, -bh * 0.85); ctx.lineTo(bw * 0.2, -bh * 0.55); ctx.lineTo(bw * 0.45, -bh * 0.7);
    ctx.lineTo(bw * 0.5, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cuernos laterales (más por era)
    ctx.fillStyle = th.edge;
    for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * bw * 0.45, -bh * 0.7); ctx.quadraticCurveTo(d * bw * 0.62, -bh * 0.95, d * bw * 0.5, -bh * 1.05); ctx.quadraticCurveTo(d * bw * 0.4, -bh * 0.85, d * bw * 0.45, -bh * 0.7); ctx.fill(); }
    // Foso de lava (puerta)
    ctx.fillStyle = `rgba(255,${80 + 60 * pulse | 0},30,${0.7 + 0.3 * pulse})`;
    roundRectPath(-bw * 0.18, -bh * 0.42, bw * 0.36, bh * 0.42, 6); ctx.fill();
  } else { // magics
    // Torre arcana: cuerpo + tejado cónico + orbe rúnico (más anillos por era)
    ctx.fillStyle = th.dark;
    roundRectPath(-bw * 0.34, -bh * 0.7, bw * 0.68, bh * 0.7, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = th.body; // tejado
    ctx.beginPath(); ctx.moveTo(-bw * 0.42, -bh * 0.7); ctx.lineTo(0, -bh * 1.05); ctx.lineTo(bw * 0.42, -bh * 0.7); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Orbe rúnico
    const oy = -bh * 0.4;
    ctx.fillStyle = th.glow; ctx.globalAlpha = 0.6 + 0.4 * pulse;
    ctx.beginPath(); ctx.arc(0, oy, bw * 0.13, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = th.edge;
    for (let i = 0; i <= age; i++) { ctx.beginPath(); ctx.arc(0, oy, bw * 0.13 + 6 + i * 5, 0, 6.283); ctx.globalAlpha = 0.5 - i * 0.06; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}


// Torre procedural temática por raza (para torres sin sprite).
function drawProcTower(e, x, y, angle, flip, firing) {
  const th = PROC_THEME[e.race] || PROC_THEME.aliens;
  const tnow = performance.now() / 1000;
  const pulse = 0.5 + 0.5 * Math.sin(tnow * 3);
  const h = 64, w = 34;
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath(); ctx.ellipse(0, 14, w * 0.55, 5, 0, 0, 6.283); ctx.fill();
  // Base/pedestal
  ctx.fillStyle = th.dark; ctx.strokeStyle = th.edge; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
  roundRectPath(-w / 2, -h * 0.45, w, h * 0.6, 5); ctx.fill(); ctx.stroke();
  // Fuste
  ctx.fillStyle = th.body;
  roundRectPath(-w * 0.28, -h, w * 0.56, h * 0.6, 4); ctx.fill(); ctx.stroke();
  // Cabezal que apunta (rota con el ángulo del objetivo)
  ctx.save();
  ctx.translate(0, -h * 0.85);
  ctx.rotate(flip ? -angle : angle);
  ctx.fillStyle = th.edge;
  roundRectPath(0, -5, w * 0.7, 10, 3); ctx.fill();
  // Núcleo emisor brillante (destella al disparar)
  const glowR = (firing ? 9 : 6) + pulse * 2;
  const g = ctx.createRadialGradient(w * 0.55, 0, 1, w * 0.55, 0, glowR * 2);
  g.addColorStop(0, th.eye); g.addColorStop(0.5, th.glow); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(w * 0.55, 0, glowR * 2, 0, 6.283); ctx.fill();
  ctx.restore();
  // Orbe rúnico/cristal sobre el fuste
  ctx.fillStyle = th.glow; ctx.globalAlpha = 0.6 + 0.4 * pulse;
  ctx.beginPath(); ctx.arc(0, -h * 0.55, 5, 0, 6.283); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
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

    const e = TOWER_CATALOG[t.tid] || {};
    // Torres procedurales (razas nuevas): se dibujan a canvas.
    if (e.proc) { drawProcTower(e, p.x, p.y - 8, t.angle || 0, flip, t.fireAnim > 0); continue; }

    // Escoger sprite base o frame de ataque (torres con sprite por era/tier)
    const sa = e.spriteAge, tier = e.tier;
    let im;
    if (t.fireAnim > 0) {
      const frameNum = t.animFrame + 1;
      im = IMG[`assets/towers/${AGES[sa]}/t${tier}/${AGES[sa]}_turret_${tier}_attack${String(frameNum).padStart(4, "0")}.png`];
    }
    if (!im) im = IMG[`assets/towers/${AGES[sa]}/t${tier}.png`];
    if (!im) continue;

    const baseH = 56 + sa * 4;
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

  // overlay oscuro permanente + overlay de pausa en espacio de pantalla
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(5,8,25,0.25)";
  ctx.fillRect(0, 0, BW, BH);
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
    const lvTxt = (closest.lvl || 1) >= unitMaxLevel(closest.uid) ? "Nv MAX" : "Nv " + (closest.lvl || 1);
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
  const lvTxt = (u.lvl || 1) >= unitMaxLevel(u.uid) ? "NvMAX" : "Nv" + (u.lvl || 1);
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
      const d = getTowerUpg("player", t.tid, "dmg");
      const s = getTowerUpg("player", t.tid, "spd");
      const ts = towerStats(t.tid, d, s);
      const val = towerSellValue(t.tid, d, s);
      const tName = (TOWER_CATALOG[t.tid] || {}).name || "Torre";
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
        <div class="tsp-info">${tName} ⚔${ts.dmg} ⏱${ts.cd.toFixed(2)}s</div>
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
const elXpText = document.getElementById("xptext");
const elXpFill = document.getElementById("xpfill");
const elAge = document.getElementById("ageName");
const elEvolve = document.getElementById("evolveBtn");
const overlay = document.getElementById("overlay");
const diffWrap = document.getElementById("diffWrap");
const hpBars = {
  player: { fill: document.querySelector("#hpPlayer .bb-fill"), txt: document.querySelector("#hpPlayer .bb-txt"), ico: document.querySelector("#hpPlayer .bb-ico") },
  enemy:  { fill: document.querySelector("#hpEnemy .bb-fill"),  txt: document.querySelector("#hpEnemy .bb-txt"), ico: document.querySelector("#hpEnemy .bb-ico") },
};
function baseMaxHp(age, race) {
  const cfg = RACE_BASE_STATS[race] || RACE_BASE_STATS.humans;
  return cfg.base + age * cfg.perAge;
}
function updateHpBar(side) {
  const st = G[side];
  const race = st.race || sideRace(side);
  const pct = Math.max(0, Math.min(1, st.baseHp / baseMaxHp(st.age, race)));
  const b = hpBars[side];
  b.fill.style.width = (pct * 100) + "%";
  b.txt.textContent = Math.max(0, Math.round(st.baseHp));
  const mon = race === "monsters";
  b.fill.className = "bb-fill" + (mon ? " race-monsters" : "");
  if (b.ico) b.ico.style.color = mon ? "#7c3aed" : "#68d391";
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
  const vc = villagerCost(p.villagers);
  let sig = p.age + "|" + p.villagers + "|" + p.villagerLvl + "|v" + aff(vc);
  if (p.villagers > 0) sig += "|vu" + aff(villagerLvlCost(p.villagerLvl));
  if (sig === econSig) return;
  econSig = sig;

  // Econ section (gold + villagers)
  let econHtml = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;width:100%">`;
  econHtml += `<div style="display:flex;flex-direction:row;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center"><div style="font-size:11px;color:#718096">🏘 Village</div>`;
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
  econHtml += `</div></div>`;
  document.getElementById("econ-section").innerHTML = econHtml;

}

// ---- Árbol tecnológico de la raza (panel derecho del HUD) ------------
let researchSig = "";
function renderResearch() {
  const sec = document.getElementById("research-section");
  if (!sec) return;
  const p = G.player;
  const race = p.race || "humans";
  const techs = availableTechs(race, p.age);
  const lockedNext = (RACE_TECH[race] || []).filter(t => t.era === p.age + 1).length;
  // unidades del mazo actual (las cards visibles) que tengan mejoras propias
  const deckUids = shopCards.map(c => c.uid);
  // firma SIN oro: solo se reconstruye al cambiar estructura (raza/era/niveles/mazo).
  // (incluir el oro reconstruía el DOM cada frame y mataba el click sobre los botones).
  let sig = race + "|" + p.age + "|" +
    techs.map(t => t.id + (p.tech[t.id] || 0)).join(",") + "|" +
    deckUids.map(uid => uid + ":" + (UNIT_UPG[uid] || []).map(up => (p.uupg[uid] && p.uupg[uid][up.key]) || 0).join("")).join(",");
  if (sig !== researchSig) {
    researchSig = sig;

    // ── Columna IZQUIERDA: mejoras de unidad ──
    let unitHtml = "";
    for (const uid of deckUids) {
      const all = UNIT_UPG[uid] || []; if (!all.length) continue;
      const avail = availableUnitUpgs(uid, p.age);
      const lockedU = all.filter(up => up.era === p.age + 1).length;
      if (!avail.length && !lockedU) continue;
      const u = UNIT_CATALOG[uid];
      const lv = unitLevel("player", uid);
      unitHtml += `<div class="rs-ugroup"><div class="rs-uname">${u.icon || "▸"} ${u.name} <small>Nv ${lv}/${unitMaxLevel(uid)}</small></div>`;
      for (const up of avail) {
        const lvl = (p.uupg[uid] && p.uupg[uid][up.key]) || 0;
        const maxed = lvl >= up.maxLvl;
        const cost = unitUpgCost(up, lvl);
        const pct = Math.round(up.per * 100);
        unitHtml += `<button class="rs-tech rs-utech${maxed ? " maxed" : ""}" data-uupg="${uid}:${up.key}" data-cost="${cost}" data-maxed="${maxed ? 1 : 0}"
          title="${up.label} de ${u.name} +${pct}%/nivel · Era ${ERA_ROMAN[up.era]}">
          <span class="rs-ico">${UPG_STAT_ICON[up.stat]}</span>
          <span class="rs-name">${up.label}<small>+${pct}%</small></span>
          <span class="rs-lvl">${lvl}/${up.maxLvl}</span>
          <span class="rs-cost">${maxed ? "MÁX" : cost + "🪙"}</span>
        </button>`;
      }
      if (lockedU > 0) unitHtml += `<div class="rs-locked">🔒 ${lockedU} en Era ${ERA_ROMAN[p.age + 1]}</div>`;
      unitHtml += `</div>`;
    }
    if (!unitHtml) unitHtml = `<div class="rs-empty">Sin mejoras de unidad disponibles aún</div>`;

    // ── Columna DERECHA: mejoras de raza ──
    let techHtml = "";
    for (const t of techs) {
      const lvl = p.tech[t.id] || 0;
      const maxed = lvl >= t.maxLvl;
      const cost = techCost(t, lvl);
      const scope = TECH_SCOPE_LABEL[t.scopeLabel] || "Todas";
      const pct = Math.round(t.per * 100);
      techHtml += `<button class="rs-tech${maxed ? " maxed" : ""}" data-tech="${t.id}" data-cost="${cost}" data-maxed="${maxed ? 1 : 0}"
        title="${TECH_STAT_LABEL[t.stat]} +${pct}%/nivel · ${scope} · Era ${ERA_ROMAN[t.era]}">
        <span class="rs-ico">${TECH_STAT_ICON[t.stat]}</span>
        <span class="rs-name">${t.name}<small>${scope} · +${pct}%</small></span>
        <span class="rs-lvl">${lvl}/${t.maxLvl}</span>
        <span class="rs-cost">${maxed ? "MÁX" : cost + "🪙"}</span>
      </button>`;
    }
    if (lockedNext > 0) techHtml += `<div class="rs-locked">🔒 ${lockedNext} en la siguiente era</div>`;

    sec.innerHTML =
      `<div class="rs-cols">
        <div class="rs-col">
          <div class="rs-title">⚡ Unidad</div>
          <div class="rs-list">${unitHtml}</div>
        </div>
        <div class="rs-col">
          <div class="rs-title rs-title-race">🔬 ${RACE_NAMES[race]}</div>
          <div class="rs-list">${techHtml}</div>
        </div>
      </div>`;
  }

  // Cada frame: solo actualizar el estado de affordability (sin reconstruir DOM).
  sec.querySelectorAll(".rs-tech").forEach((b) => {
    if (b.dataset.maxed === "1") { b.disabled = true; return; }
    b.disabled = p.gold < +b.dataset.cost;
  });
}
document.getElementById("research-section").addEventListener("click", (e) => {
  const bu = e.target.closest("[data-uupg]");
  if (bu) { if (bu.disabled) return; const [uid, key] = bu.dataset.uupg.split(":"); playerUnitUpg(+uid, key); researchSig = ""; return; }
  const b = e.target.closest("[data-tech]");
  if (!b || b.disabled) return;
  playerTech(b.dataset.tech);
  researchSig = ""; // forzar refresh
});

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

  // 6 slots siempre — llenar con lo que haya en el mazo, el resto vacíos
  for (let i = 0; i < 6; i++) {
    const uid = d[i] || null;
    const slot = document.createElement("div");
    slot.className = "card-slot" + (uid ? "" : " empty");
    slot.dataset.idx = i;

    if (uid) {
      const u = UNIT_CATALOG[uid];
      const card = document.createElement("div");
      card.className = "card rarity-" + unitRarity(uid);
      card.innerHTML = `
        <div class="key">${i + 1}</div>
        <svg class="cd-ring" viewBox="0 0 100 100"><circle class="cd-ring-fill" cx="50" cy="50" r="44" transform="rotate(-90 50 50)"/></svg>
        <div class="thumb">${getUnitThumb(uid)}</div>
        <div class="name">${u.name}</div>
        <div class="lvl"></div>
        <div class="cost"></div>
        <div class="stats"></div>`;
      card.addEventListener("click", () => playerSpawn(uid));
      slot.appendChild(card);
      // (Las mejoras ya NO van bajo las cards: ahora son el árbol tecnológico de la derecha.)

      shopCards.push({
        el: card, uid, type: u.combatStyle,
        img: card.querySelector("img"),
        name: card.querySelector(".name"),
        lvl: card.querySelector(".lvl"),
        cost: card.querySelector(".cost"),
        stats: card.querySelector(".stats"),
        cdSvg: card.querySelector(".cd-ring"),
        cdFill: card.querySelector(".cd-ring-fill"),
      });
    } else {
      // Placeholder visual del slot vacío — mismo tamaño que cards llenas
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="key">${i + 1}</div>
        <div class="thumb" style="opacity:.12;font-size:42px;line-height:80px;color:#fff;background:transparent">+</div>
        <div class="name" style="opacity:.15;font-size:10px">—</div>
        <div class="cost" style="opacity:.1">—</div>`;
      slot.appendChild(card);
    }
    cardsDiv.appendChild(slot);
  }

  // Sección de torres (debajo de las unidades)
  const towerSection = document.getElementById("tower-section");
  towerSection.innerHTML = "";
  towerCards = [];

  // Torres que el jugador posee y puede construir en la era actual
  const towerTids = ownedTowersForEra(G.player ? G.player.age : 0);
  towerTids.forEach((tid) => {
    const e = TOWER_CATALOG[tid];
    const grp = document.createElement("div");
    grp.className = "tower-group";

    const card = document.createElement("div");
    card.className = "card tower-card rarity-" + e.rarity;
    card.innerHTML = `
      <div class="key">🗼</div>
      <div class="thumb">${e.proc ? `<span style="font-size:34px">🗼</span>` : `<img>`}</div>
      <div class="name">${e.name}</div>
      <div class="cost"></div>
      <div class="stats"></div>`;
    const img = card.querySelector("img");
    if (img && !e.proc) { const key = `assets/towers/${AGES[e.spriteAge]}/t${e.tier}.png`; if (IMG[key]) img.src = IMG[key].src; }
    card.addEventListener("click", () => {
      const p = G.player;
      for (let i = 0; i < p.slots; i++) { if (!p.towers[i]) { playerBuyTower(i, tid); break; } }
    });
    grp.appendChild(card);

    const upgs = document.createElement("div");
    upgs.className = "tower-upgs";
    ["dmg", "spd"].forEach((stat) => {
      const btn = document.createElement("button");
      btn.className = "upg-pbtn";
      btn.dataset.towerTid = tid;
      btn.dataset.stat = stat;
      btn.addEventListener("click", () => {
        const p = G.player;
        for (let i = 0; i < p.slots; i++) { const t = p.towers[i]; if (t && t.tid === tid) { playerUpgTower(i, stat); break; } }
      });
      upgs.appendChild(btn);
    });
    grp.appendChild(upgs);
    towerSection.appendChild(grp);
    towerCards.push({ el: card, tid, img, cost: card.querySelector(".cost"), stats: card.querySelector(".stats") });
  });

  // Botón de slot extra
  slotBtn = document.createElement("button");
  slotBtn.className = "slot-btn";
  slotBtn.textContent = "➕ Slot";
  slotBtn.addEventListener("click", playerBuySlot);
  towerSection.appendChild(slotBtn);

  refreshShopAge();
}

function effStats(side, uid) {
  const cs = computeStats(uid, G[side].age, side);
  return {
    hp: Math.round(cs.hp),
    dmg: Math.round(cs.dmg),
    spd: Math.round(cs.cd * 100) / 100,
    range: Math.round(cs.range),
    armor: 0,
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
    const e = TOWER_CATALOG[tc.tid];
    if (tc.img && e && !e.proc) { const key = `assets/towers/${AGES[e.spriteAge]}/t${e.tier}.png`; if (IMG[key]) tc.img.src = IMG[key].src; }
  }
}

let lastAge = -1;
function syncUI() {
  const p = G.player;
  const elGold = document.getElementById("gold");
  if (elGold) elGold.textContent = Math.floor(p.gold);
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
    const s = unitBase(c.uid, p.age, c.type);
    const es = effStats("player", c.uid);
    if (c.lvl) { const lv = unitLevel("player", c.uid); c.lvl.textContent = lv > 1 ? "Nv" + lv : ""; }
    c.cost.textContent = s.cost + " 🪙";
    c.stats.textContent = c.type === "range"
      ? `❤${es.hp} ⚔${es.dmg} 🎯${es.range}`
      : `❤${es.hp} ⚔${es.dmg} ⏱${es.spd}s`;
    const cdRem = p.cd[c.uid] || 0;
    const uDef = UNIT_CATALOG[c.uid];
    const cdMax = (uDef && uDef.cooldown != null) ? uDef.cooldown : SPAWN_CD;
    if (c.cdFill) {
      const circ = 276; // 2 * PI * 44
      const progress = cdRem > 0 ? (cdRem / cdMax) : 0;
      c.cdFill.style.strokeDashoffset = circ * (1 - progress);
      c.cdSvg.classList.toggle("active", cdRem > 0);
    }
    c.el.classList.toggle("disabled", !(p.gold >= s.cost && cdRem <= 0));
  }
  // Cards de torres
  for (const tc of towerCards) {
    const tid = tc.tid;
    const c = towerBuyCost(tid);
    const upgDmg = getTowerUpg("player", tid, "dmg");
    const upgSpd = getTowerUpg("player", tid, "spd");
    const ts = towerStats(tid, upgDmg, upgSpd);
    tc.cost.textContent = c + " 🪙";
    tc.stats.textContent = `⚔${ts.dmg} ⏱${ts.cd.toFixed(2)}s`;
    const hasEmpty = p.towers.some(t => t === null);
    tc.el.classList.toggle("disabled", !(p.gold >= c && hasEmpty));
  }
  // Árbol tecnológico de la raza (panel derecho)
  renderResearch();
  // Mejoras de torres
  document.querySelectorAll(".tower-upgs .upg-pbtn").forEach((btn) => {
    const tid = +btn.dataset.towerTid;
    const stat = btn.dataset.stat;
    const lvl = getTowerUpg("player", tid, stat);
    if (lvl >= MAX_TOWER_UPG) {
      btn.innerHTML = "★MÁX";
      btn.disabled = true;
    } else {
      const uc = towerUpgCost(tid, stat, lvl);
      const lbl = { dmg: "+ATK", spd: "+VEL" };
      btn.innerHTML = `${lbl[stat]} L${lvl+1}<br>${uc}🪙`;
      let eff;
      if (stat === "dmg") {
        const sp = getTowerUpg("player", tid, "spd");
        const d = towerStats(tid, lvl + 1, sp).dmg - towerStats(tid, lvl, sp).dmg;
        eff = `+${Math.round(d)} de daño`;
      } else {
        eff = `+12% vel. de ataque`;
      }
      btn.title = `${eff}  (Nv ${lvl+1}/${MAX_TOWER_UPG} · ${uc}🪙)`;
      btn.disabled = p.gold < uc;
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
      const techs = (RACE_TECH[sideRace("enemy")] || []).filter(x => x.scopeLabel === t || x.scopeLabel === "all");
      let lv = 0; for (const x of techs) lv += (e.tech[x.id] || 0);
      el.textContent = "I+" + lv; // niveles de investigación que aplican a esa categoría
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
  let msg = win ? "Destruiste la base enemiga." : "Tu base fue destruida.";
  // Recompensa de monedas solo al ganar a la IA
  if (win && G.mode === "ai") {
    const reward = WIN_REWARD[difficulty] || 100;
    addCoins(reward);
    msg += ` Ganaste 🪙${reward} (total: ${getCoins()}).`;
  }
  document.getElementById("overMsg").textContent = msg;
  overlay.classList.remove("hidden");
}

function resetGame() {
  G.player = freshSide(250, G.playerRace || "humans");
  G.enemy = freshSide(200, aiRace || "humans"); // online lo fija a humans en startOnlineGame
  G.units = []; G.projectiles = []; G.floats = []; G.over = false;
  G.mode = "ai";
  lastAge = -1; econSig = ""; researchSig = ""; dayCycleTime = 0;
  resetInfection();
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
  updateCoinDisplays();
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
  resizeCanvas();
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
  resizeCanvas();
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
  G.enemy = freshSide(200, "humans"); // online: el rival es un jugador (raza no sincronizada)
  buildShop();
  G.mode = "online";
  document.getElementById("restartBtn").disabled = false;
  resizeCanvas();
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

// ---- SFX por unidad (nacimiento / ataque / muerte) -------------------
// Cada unidad define sus rutas en UNIT_CATALOG[uid].sounds. Se reutiliza un
// Audio base por ruta y se clona para permitir reproducciones solapadas.
const SFX_BASE = {};
const sfxLast = {};            // throttle por ruta (evita stacking en enjambres)
function playUnitSound(uid, kind) {
  if (musicMuted) return;
  const u = UNIT_CATALOG[uid];
  const path = u && u.sounds ? u.sounds[kind] : null;
  if (!path) return;
  const now = performance.now();
  if (sfxLast[path] && now - sfxLast[path] < 80) return;
  sfxLast[path] = now;
  let base = SFX_BASE[path];
  if (!base) { base = new Audio(path); SFX_BASE[path] = base; }
  const node = base.cloneNode();
  node.volume = Math.min(1, musicVol * 1.4);
  const pr = node.play();
  if (pr && pr.catch) pr.catch(() => {});
}

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
  if (im) return `<img src="${im.src}" alt="${u.name}" class="unit-thumb">`;
  const key2 = `assets/units/${age}/${sid}/idle/0.png`;
  const im2 = IMG[key2];
  if (im2) return `<img src="${im2.src}" alt="${u.name}" class="unit-thumb">`;
  return u.icon || "❓";
}

// ---- Helpers de carta (unidad o torre) ------------------------------
function cardRarity(id) { return isTowerId(id) ? (TOWER_CATALOG[id] || {}).rarity || "common" : unitRarity(id); }
function cardName(id) { return isTowerId(id) ? (TOWER_CATALOG[id] || {}).name || "Torre" : (UNIT_CATALOG[id] || {}).name || "?"; }
function cardThumb(id) {
  if (!isTowerId(id)) return getUnitThumb(id);
  const e = TOWER_CATALOG[id];
  if (e && !e.proc) { const k = `assets/towers/${AGES[e.spriteAge]}/t${e.tier}.png`; if (IMG[k]) return `<img src="${IMG[k].src}" alt="${e.name}" class="unit-thumb">`; }
  return "🗼";
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
  // Autorrellena cada raza/era con las primeras DECK_MAX unidades POSEÍDAS.
  const col = getCollection();
  for (const race of RACES) {
    for (let a = 0; a < AGES.length; a++) {
      d[race][a] = UnitDB.getAvailableIdsByRace(race, a).filter(uid => (col[uid] || 0) >= 1).slice(0, DECK_MAX);
    }
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
      if (ok) {
        const col = getCollection();
        const def = defaultDeck();
        for (const race of RACES)
          for (let a = 0; a < AGES.length; a++) {
            // Quita del mazo cartas que ya no se poseen (vendidas/no compradas)
            d[race][a] = (d[race][a] || []).filter(uid => (col[uid] || 0) >= 1);
            // Rellena eras vacías con las poseídas por defecto
            if (d[race][a].length === 0 && def[race][a].length > 0) d[race][a] = def[race][a];
          }
        return d;
      }
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
let selectedUnitId = null;
let deckInfoAnimTimer = null;

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
  renderDeckInfo(selectedUnitId);
}

function renderDeckInfo(uid) {
  const spriteEl = document.getElementById("deck-info-sprite");
  const statsEl = document.getElementById("deck-info-stats");
  const descEl = document.getElementById("deck-info-desc");
  if (deckInfoAnimTimer) { clearInterval(deckInfoAnimTimer); deckInfoAnimTimer = null; }
  spriteEl.innerHTML = "";
  statsEl.innerHTML = "";
  descEl.textContent = "";
  if (!uid || !UNIT_CATALOG[uid]) {
    spriteEl.innerHTML = '<div id="deck-info-placeholder">Selecciona una unidad</div>';
    return;
  }
  const u = UNIT_CATALOG[uid];
  const sid = u.spriteId;
  const age = AGES[u.homeEra];
  const frames = [];
  for (let f = 0; f < 8; f++) {
    const k = `assets/units/${age}/${sid}/idle/${f}.png`;
    if (IMG[k]) frames.push(k);
    else break;
  }
  if (frames.length === 0) {
    for (let f = 0; f < 8; f++) {
      const k = `assets/units/${age}/${sid}/walk/${f}.png`;
      if (IMG[k]) frames.push(k);
      else break;
    }
  }
  const imgEl = document.createElement("img");
  imgEl.alt = u.name;
  if (frames.length > 0) {
    imgEl.src = IMG[frames[0]].src;
    let fi = 0;
    deckInfoAnimTimer = setInterval(() => {
      fi = (fi + 1) % frames.length;
      imgEl.src = IMG[frames[fi]].src;
    }, 250);
  } else {
    imgEl.style.fontSize = "32px";
    spriteEl.innerHTML = u.icon || "❓";
  }
  spriteEl.appendChild(imgEl);
  const s = u.stats || {};
  const g = u.growth || {};
  const rar = unitRarity(uid);
  const lines = [
    { label: "💎 Rareza", value: `<span style="color:${RARITY[rar].color};font-weight:700">${RARITY[rar].name}</span>` },
    { label: "🏛 Eras", value: u.availableEras.map(e => AGE_NAMES[e].replace("Era ", "")).join(", ") },
    { label: "📋 Clase", value: u.class ? (u.class.charAt(0).toUpperCase() + u.class.slice(1)) : "—" },
    { label: "❤ Vida", value: s.hp || "—" },
    { label: "⚔ Daño", value: s.dmg || "—" },
    { label: "🏃 Velocidad", value: s.spd || "—" },
    { label: "🎯 Alcance", value: (s.range != null ? s.range + "px" : "—") },
    { label: "🪙 Costo", value: s.cost != null ? s.cost + " 🪙" : "—" },
    { label: "💰 Oro/muerte", value: s.g || "—" },
    { label: "⭐ XP/muerte", value: s.xp || "—" },
    { label: "⏱ Spawn CD", value: u.cooldown ? u.cooldown + "s" : "—" },
  ];
  statsEl.innerHTML = lines.map(l =>
    `<div class="di-stat"><span class="di-label">${l.label}</span><span class="di-value">${l.value}</span></div>`
  ).join("");
  descEl.textContent = u.desc || "";
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
  const col = getCollection();
  // Solo se muestran las unidades POSEÍDAS (las demás se consiguen en la tienda)
  const available = UnitDB.getAvailableIdsByRace(currentRace, currentDeckAge).filter((uid) => {
    if ((col[uid] || 0) < 1) return false;
    const u = UNIT_CATALOG[uid];
    if (!filter) return true;
    return u.name.toLowerCase().includes(filter)
      || String(u.id).includes(filter)
      || u.tags.some(t => t.includes(filter))
      || u.desc.toLowerCase().includes(filter);
  });
  if (!available.length) {
    list.innerHTML = `<div class="deck-pool-empty">No tienes unidades de ${RACE_NAMES[currentRace]} en ${AGE_NAMES[currentDeckAge]}.<br>Consíguelas en la 🛒 Tienda.</div>`;
    return;
  }
  for (const uid of available) {
    const u = UNIT_CATALOG[uid];
    const inDeck = deckForAge.includes(uid);
    const rar = unitRarity(uid);
    const cnt = col[uid] || 0;
    const thumb = getUnitThumb(uid);
    const card = document.createElement("div");
    card.className = "dcard rarity-" + rar + (inDeck ? " in-deck" : "") + (uid === selectedUnitId ? " selected" : "");
    card.dataset.uid = uid;
    card.innerHTML = `
      ${cnt > 1 ? `<span class="dcount">x${cnt}</span>` : ""}
      <div class="dci">${thumb}</div>
      <span class="dcn">${u.name}</span>
      <span class="dcc">🪙${u.stats.cost}</span>
      <div class="dtags">
        <span class="dctag dctag-rar" style="background:${RARITY[rar].color}33;color:${RARITY[rar].color}">${RARITY[rar].name}</span>
      </div>`;
    card.addEventListener("click", () => {
      selectedUnitId = uid;
      renderDeckBuilder();
    });
    if (!inDeck) {
      card.addEventListener("dblclick", () => addToDeck(uid));
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
      slot.className = "deck-slot rarity-" + unitRarity(uid);
      const thumb = getUnitThumb(uid);
      slot.innerHTML = `
        <div class="ds-num">${i + 1}</div>
        <div class="dci">${thumb}</div>
        <div class="dbody">
          <div class="dtop">
            <span class="dcn">${u.name}</span>
            <span class="dcc">🪙${u.stats.cost}</span>
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
        <div class="ds-empty">Doble clic en una unidad</div>`;
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
});

// ---- Tienda de sobres ------------------------------------------------
const PACK_NORMAL = [["common", 58], ["uncommon", 27], ["rare", 11], ["epic", 3], ["legendary", 1]];
const PACK_LUCKY  = [["uncommon", 45], ["rare", 35], ["epic", 15], ["legendary", 5]];

function rollRarity(table) {
  const total = table.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [rar, w] of table) { if ((r -= w) < 0) return rar; }
  return table[table.length - 1][0];
}
// Pool de cartas de una raza = sus unidades + sus torres (las torres salen mezcladas).
function raceCardPool(race) {
  const ids = UnitDB.getByRace(race).map(u => u.id);
  for (const tid of TOWER_IDS) if (TOWER_CATALOG[tid].race === race) ids.push(tid);
  return ids;
}
// Elige una carta de la raza con la rareza pedida; si no existe, baja de rareza.
function pickUnitForPack(race, rarity) {
  const pool = raceCardPool(race);
  for (let rank = rarityRank(rarity); rank >= 0; rank--) {
    const rar = RARITY_ORDER[rank];
    const ids = pool.filter(id => cardRarity(id) === rar);
    if (ids.length) return ids[(Math.random() * ids.length) | 0];
  }
  return pool[(Math.random() * pool.length) | 0];
}
function openPack(race) {
  const col = getCollection();
  const results = [];
  for (let i = 0; i < PACK_SIZE; i++) {
    const lucky = i === PACK_SIZE - 1; // la última carta tiene mejores probabilidades
    const uid = pickUnitForPack(race, rollRarity(lucky ? PACK_LUCKY : PACK_NORMAL));
    const had = col[uid] || 0;
    let status;
    if (had < MAX_COPIES) { col[uid] = had + 1; status = had === 0 ? "new" : "dup"; }
    else status = "wasted"; // ya tiene el máximo de copias: no se añade
    results.push({ uid, lucky, status });
  }
  saveCollection(col);
  return results;
}

function openShop() {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("shop").classList.remove("hidden");
  document.getElementById("shop-reveal").classList.add("hidden");
  updateCoinDisplays();
  renderShop();
}
function closeShop() {
  document.getElementById("shop").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
}
function renderShop() {
  const cont = document.getElementById("shop-packs");
  cont.innerHTML = "";
  const coins = getCoins();
  for (const race of RACES) {
    const th = PROC_THEME[race] || { body: "#888", edge: "#ccc" };
    const pack = document.createElement("div");
    pack.className = "pack-card";
    pack.style.borderColor = th.edge;
    pack.innerHTML = `
      <div class="pack-art" style="background:linear-gradient(160deg, ${th.body}, ${th.edge})">🎴</div>
      <div class="pack-name">${RACE_NAMES[race]}</div>
      <div class="pack-sub">${PACK_SIZE} cartas</div>
      <button class="menu-btn pack-buy" data-race="${race}" ${coins < PACK_PRICE ? "disabled" : ""}>🪙 ${PACK_PRICE}</button>`;
    cont.appendChild(pack);
  }
}
document.getElementById("shop-packs").addEventListener("click", (e) => {
  const btn = e.target.closest(".pack-buy");
  if (!btn || btn.disabled) return;
  const race = btn.dataset.race;
  if (getCoins() < PACK_PRICE) return;
  setCoins(getCoins() - PACK_PRICE);
  showReveal(openPack(race));
  renderShop();
});
function showReveal(results) {
  const wrap = document.getElementById("shop-reveal");
  const cards = document.getElementById("shop-reveal-cards");
  cards.innerHTML = "";
  for (const r of results) {
    const rar = cardRarity(r.uid);
    const isTw = isTowerId(r.uid);
    const tag = r.status === "new" ? `<span class="rv-tag rv-new">¡Nueva!</span>`
              : r.status === "dup" ? `<span class="rv-tag rv-dup">+1</span>`
              : `<span class="rv-tag rv-waste">Repetida</span>`;
    const card = document.createElement("div");
    card.className = "reveal-card rarity-" + rar + (r.lucky ? " lucky" : "") + (r.status === "wasted" ? " wasted" : "");
    card.innerHTML = `
      <div class="rv-thumb">${cardThumb(r.uid)}</div>
      <div class="rv-name">${cardName(r.uid)}${isTw ? " 🗼" : ""}</div>
      <div class="rv-rar" style="color:${RARITY[rar].color}">${RARITY[rar].name}${isTw ? " · Torre" : ""}</div>
      ${tag}`;
    cards.appendChild(card);
  }
  wrap.classList.remove("hidden");
}
document.getElementById("shop-reveal-close").addEventListener("click", () => {
  document.getElementById("shop-reveal").classList.add("hidden");
});
document.getElementById("shop-back-btn").addEventListener("click", closeShop);
document.getElementById("btn-shop").addEventListener("click", openShop);
updateCoinDisplays();

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
  // Upgrades ahora son por unidad (uid): se hacen desde los botones de cada carta.
  // (Se quitaron los atajos q/a/z/w/s/x/r/f/c/d del sistema viejo por tipo.)
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

// Selector de raza de la IA (cualquier raza, no depende de la colección del jugador).
function populateAiRaceSelect() {
  const sel = document.getElementById("ai-race-select");
  if (!sel) return;
  sel.innerHTML = "";
  for (const race of RACES) {
    const opt = document.createElement("option");
    opt.value = race; opt.textContent = RACE_NAMES[race];
    sel.appendChild(opt);
  }
  sel.value = aiRace;
  sel.addEventListener("change", () => {
    aiRace = sel.value;
    try { localStorage.setItem("aow_ai_race", aiRace); } catch {}
    const inGame = !document.getElementById("game").classList.contains("hidden");
    if (G.mode === "ai" && inGame) resetGame(); // aplica de inmediato si ya está jugando
  });
}
populateAiRaceSelect();
getCollection(); // auto-repara el piso de la colección (restaura cartas previas) — seguro: UnitDB ya existe

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
  else if (b.dataset.tspawn) { e.cd = {}; trySpawn("enemy", b.dataset.tspawn); }
  else if (b.dataset.tupg) {
    // Investiga el primer tech disponible del enemigo para esa categoría (zona de test).
    const [t] = b.dataset.tupg.split(":");
    const tech = availableTechs(sideRace("enemy"), e.age).find(x => x.scopeLabel === t || x.scopeLabel === "all");
    if (tech) { e.gold += techCost(tech, e.tech[tech.id] || 0); tryTech("enemy", tech.id); }
  }
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
