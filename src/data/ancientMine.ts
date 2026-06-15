import type { MineTheme, MineBoss, MineEvent, ShopItem, MineThemeType } from '@/types';

export const MINE_THEMES: MineTheme[] = [
  {
    id: 'magma',
    name: '岩浆矿脉',
    description: '炽热的岩浆深处，蕴藏着珍贵的火成矿石。小心熔岩守卫！',
    emoji: '🌋',
    unlockLevel: 3,
    bgColor: 'from-red-900 to-orange-900',
    color: '#ff6b35',
    bossId: 'magma_guardian',
    difficulty: 1,
  },
  {
    id: 'ice',
    name: '冰霜矿脉',
    description: '永冻冰层之下，冰封着亿万年的冰晶宝石。',
    emoji: '❄️',
    unlockLevel: 5,
    bgColor: 'from-blue-900 to-cyan-900',
    color: '#00d4ff',
    bossId: 'ice_beast',
    difficulty: 2,
  },
  {
    id: 'poison',
    name: '毒气矿脉',
    description: '弥漫着剧毒气体的矿洞，只有最勇敢的矿工才敢进入。',
    emoji: '☠️',
    unlockLevel: 7,
    bgColor: 'from-green-900 to-emerald-900',
    color: '#00ff88',
    bossId: 'poison_wyrm',
    difficulty: 3,
  },
  {
    id: 'crystal',
    name: '水晶矿脉',
    description: '闪烁着神秘光芒的水晶洞穴，传说中有水晶龙栖息。',
    emoji: '💎',
    unlockLevel: 10,
    bgColor: 'from-purple-900 to-pink-900',
    color: '#c084fc',
    bossId: 'crystal_dragon',
    difficulty: 4,
  },
  {
    id: 'ancient',
    name: '远古矿脉',
    description: '最深处的远古遗迹，蕴藏着失落文明的宝藏。',
    emoji: '🏛️',
    unlockLevel: 15,
    bgColor: 'from-amber-900 to-yellow-900',
    color: '#fbbf24',
    bossId: 'ancient_titan',
    difficulty: 5,
  },
];

export const getMineThemeById = (id: string): MineTheme | undefined => {
  return MINE_THEMES.find(t => t.id === id);
};

export const MINE_BOSSES: MineBoss[] = [
  {
    id: 'magma_guardian',
    name: '熔岩守卫',
    emoji: '🔥',
    maxHp: 500,
    shield: 50,
    theme: 'magma',
    skills: [
      { id: 'magma_heal', name: '熔岩再生', description: '恢复生命值', damage: 0, cooldown: 3, effect: 'heal' },
      { id: 'magma_shield', name: '岩浆护盾', description: '获得护盾', damage: 0, cooldown: 4, effect: 'shield' },
    ],
    rewards: {
      ancientFragments: 100,
      ores: [{ oreId: 'ore_030', count: 1 }],
    },
  },
  {
    id: 'ice_beast',
    name: '冰霜巨兽',
    emoji: '🐲',
    maxHp: 800,
    shield: 100,
    theme: 'ice',
    skills: [
      { id: 'ice_freeze', name: '冰封', description: '加厚涂层', damage: 0, cooldown: 2, effect: 'thicken' },
      { id: 'ice_shield', name: '冰甲', description: '获得护盾', damage: 0, cooldown: 4, effect: 'shield' },
    ],
    rewards: {
      ancientFragments: 150,
      ores: [{ oreId: 'ore_035', count: 1 }],
    },
  },
  {
    id: 'poison_wyrm',
    name: '毒雾蠕虫',
    emoji: '🐛',
    maxHp: 1000,
    shield: 80,
    theme: 'poison',
    skills: [
      { id: 'poison_cloud', name: '毒雾', description: '遮挡视野', damage: 0, cooldown: 2, effect: 'obscure' },
      { id: 'poison_heal', name: '腐蚀再生', description: '恢复生命', damage: 0, cooldown: 4, effect: 'heal' },
    ],
    rewards: {
      ancientFragments: 200,
      ores: [{ oreId: 'ore_040', count: 1 }],
    },
  },
  {
    id: 'crystal_dragon',
    name: '水晶龙',
    emoji: '🐉',
    maxHp: 1500,
    shield: 200,
    theme: 'crystal',
    skills: [
      { id: 'crystal_refract', name: '折射', description: '增加涂层厚度', damage: 0, cooldown: 2, effect: 'thicken' },
      { id: 'crystal_shield', name: '晶盾', description: '大量护盾', damage: 0, cooldown: 3, effect: 'shield' },
      { id: 'crystal_heal', name: '晶核复苏', description: '大量恢复', damage: 0, cooldown: 5, effect: 'heal' },
    ],
    rewards: {
      ancientFragments: 300,
      ores: [{ oreId: 'ore_045', count: 1 }],
    },
  },
  {
    id: 'ancient_titan',
    name: '远古泰坦',
    emoji: '🗿',
    maxHp: 2500,
    shield: 300,
    theme: 'ancient',
    skills: [
      { id: 'titan_stomp', name: '地震', description: '遮挡部分区域', damage: 0, cooldown: 2, effect: 'obscure' },
      { id: 'titan_shield', name: '石甲', description: '获得大量护盾', damage: 0, cooldown: 3, effect: 'shield' },
      { id: 'titan_regen', name: '远古之力', description: '大量恢复', damage: 0, cooldown: 4, effect: 'heal' },
    ],
    rewards: {
      ancientFragments: 500,
      ores: [{ oreId: 'ore_050', count: 1 }],
    },
  },
];

export const getMineBossById = (id: string): MineBoss | undefined => {
  return MINE_BOSSES.find(b => b.id === id);
};

export const getBossByTheme = (theme: MineThemeType): MineBoss | undefined => {
  return MINE_BOSSES.find(b => b.theme === theme);
};

export const MINE_EVENTS: MineEvent[] = [
  {
    id: 'event_ancient_vein',
    name: '古老矿脉',
    title: '古老矿脉',
    description: '你发现了一条闪闪发光的古老矿脉，但挖掘需要消耗体力...',
    emoji: '✨',
    icon: '✨',
    choices: [
      {
        id: 'dig',
        text: '挖掘矿石 (-10体力)',
        description: '挖掘矿石 (-10体力)',
        cost: { hp: 10 },
        reward: { ancientFragments: 30, ores: [{ oreId: 'ore_010', count: 2 }] },
        successRate: 0.8,
      },
      {
        id: 'skip',
        text: '继续前进 (+5体力)',
        description: '继续前进 (+5体力)',
        reward: { hp: 5 },
      },
    ],
  },
  {
    id: 'event_poison_gas',
    name: '毒气包围',
    title: '毒气包围',
    description: '一团毒雾正向你逼近...',
    emoji: '💨',
    icon: '💨',
    choices: [
      {
        id: 'rush',
        text: '快速穿过 (-15体力)',
        description: '快速穿过 (-15体力)',
        cost: { hp: 15 },
        reward: { ancientFragments: 20 },
      },
      {
        id: 'search',
        text: '寻找解毒剂 (获得道具)',
        description: '寻找解毒剂 (获得道具)',
        reward: { items: [{ type: 'stabilizer', count: 1 }] },
        successRate: 0.5,
      },
    ],
  },
  {
    id: 'event_lost_miner',
    name: '遇难矿工',
    title: '遇难矿工',
    description: '你发现了一位受伤的矿工，他请求你的帮助...',
    emoji: '👷',
    icon: '👷',
    choices: [
      {
        id: 'help',
        text: '救助矿工 (-20体力)',
        description: '救助矿工 (-20体力)',
        cost: { hp: 20 },
        reward: { ancientFragments: 50, items: [{ type: 'bomb', count: 1 }] },
      },
      {
        id: 'ignore',
        text: '继续前进',
        description: '继续前进',
        reward: {},
      },
    ],
  },
  {
    id: 'event_mysterious_chest',
    name: '神秘宝箱',
    title: '神秘宝箱',
    description: '一个散发着诡异光芒的宝箱...',
    emoji: '🎁',
    icon: '🎁',
    choices: [
      {
        id: 'open',
        text: '打开宝箱',
        description: '打开宝箱',
        reward: { ancientFragments: 80 },
        successRate: 0.6,
      },
      {
        id: 'leave',
        text: '谨慎离开',
        description: '谨慎离开',
        reward: { hp: 5 },
      },
    ],
  },
  {
    id: 'event_crystal_fountain',
    name: '水晶喷泉',
    title: '水晶喷泉',
    description: '清澈的泉水闪烁着光芒，似乎有恢复效果...',
    emoji: '⛲',
    icon: '⛲',
    choices: [
      {
        id: 'drink',
        text: '饮用泉水 (+25体力)',
        description: '饮用泉水 (+25体力)',
        reward: { hp: 25 },
        successRate: 0.85,
      },
      {
        id: 'collect',
        text: '收集水晶 (+40碎片)',
        description: '收集水晶 (+40碎片)',
        reward: { ancientFragments: 40 },
      },
    ],
  },
  {
    id: 'event_old_shrine',
    name: '远古神殿',
    title: '远古神殿',
    description: '一座被遗忘的神殿，祭坛上似乎可以献祭...',
    emoji: '🏛️',
    icon: '🏛️',
    choices: [
      {
        id: 'pray',
        text: '祈祷 (-30碎片)',
        description: '祈祷 (-30碎片)',
        cost: { ancientFragments: 30 },
        reward: { hp: 30, attackBonus: 0.2 },
        successRate: 0.7,
      },
      {
        id: 'loot',
        text: '搜刮神殿',
        description: '搜刮神殿',
        reward: { ancientFragments: 60 },
        successRate: 0.5,
      },
    ],
  },
  {
    id: 'event_falling_rocks',
    name: '落石！',
    title: '落石！',
    description: '头顶的岩石正在崩塌！',
    emoji: '🪨',
    icon: '🪨',
    choices: [
      {
        id: 'dodge',
        text: '快速躲避',
        description: '快速躲避',
        reward: {},
        successRate: 0.7,
      },
      {
        id: 'shield',
        text: '用护盾抵挡 (-10体力)',
        description: '用护盾抵挡 (-10体力)',
        cost: { hp: 10 },
        reward: { ancientFragments: 25 },
      },
    ],
  },
  {
    id: 'event_glowing_mushroom',
    name: '发光蘑菇',
    title: '发光蘑菇',
    description: '一簇发光的神秘蘑菇...',
    emoji: '🍄',
    icon: '🍄',
    choices: [
      {
        id: 'eat',
        text: '试吃蘑菇',
        description: '试吃蘑菇',
        reward: { hp: 20, attackBonus: 0.1 },
        successRate: 0.6,
      },
      {
        id: 'collect',
        text: '收集研究 (+35碎片)',
        description: '收集研究 (+35碎片)',
        reward: { ancientFragments: 35 },
      },
    ],
  },
];

export const getRandomEvent = (): MineEvent => {
  const index = Math.floor(Math.random() * MINE_EVENTS.length);
  return MINE_EVENTS[index];
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'shop_heal_small',
    name: '小型治疗药水',
    description: '恢复15点体力',
    emoji: '🧪',
    icon: '🧪',
    price: 20,
    type: 'heal',
    effect: { value: 15 },
    stock: 3,
  },
  {
    id: 'shop_heal_large',
    name: '大型治疗药水',
    description: '恢复35点体力',
    emoji: '⚗️',
    icon: '⚗️',
    price: 45,
    type: 'heal',
    effect: { value: 35 },
    stock: 2,
  },
  {
    id: 'shop_attack',
    name: '攻击强化',
    description: '本次探索攻击+20%',
    emoji: '⚔️',
    icon: '⚔️',
    price: 60,
    type: 'attack',
    effect: { value: 0.2 },
    stock: 1,
  },
  {
    id: 'shop_shield',
    name: '体力护盾',
    description: '获得30点护盾',
    emoji: '🛡️',
    icon: '🛡️',
    price: 40,
    type: 'shield',
    effect: { value: 30 },
    stock: 2,
  },
  {
    id: 'shop_bomb',
    name: '矿脉炸弹',
    description: '对Boss造成80点伤害',
    emoji: '💣',
    icon: '💣',
    price: 50,
    type: 'bomb',
    effect: { value: 80 },
    stock: 2,
  },
  {
    id: 'shop_precision',
    name: '精准之眼',
    description: '暴击区出现概率+30%',
    emoji: '👁️',
    icon: '👁️',
    price: 55,
    type: 'precision',
    effect: { value: 0.3 },
    stock: 1,
  },
];

export const getShopItems = (): ShopItem[] => {
  return SHOP_ITEMS.map(item => ({ ...item }));
};

export const getRandomEnemy = (theme: MineThemeType, difficulty: number): { id: string; name: string; emoji: string; hp: number; shield: number } => {
  const enemies = {
    magma: [
      { id: 'fire_slime', name: '火焰史莱姆', emoji: '🔥', hp: 80, shield: 0 },
      { id: 'lava_golem', name: '熔岩傀儡', emoji: '🗿', hp: 120, shield: 20 },
      { id: 'ember_bat', name: '余烬蝙蝠', emoji: '🦇', hp: 60, shield: 0 },
    ],
    ice: [
      { id: 'ice_slime', name: '冰霜史莱姆', emoji: '❄️', hp: 90, shield: 10 },
      { id: 'frost_wolf', name: '冻狼', emoji: '🐺', hp: 130, shield: 0 },
      { id: 'ice_golem', name: '寒冰傀儡', emoji: '🧊', hp: 150, shield: 30 },
    ],
    poison: [
      { id: 'poison_spider', name: '毒蜘蛛', emoji: '🕷️', hp: 70, shield: 0 },
      { id: 'slime_poison', name: '毒液史莱姆', emoji: '🟢', hp: 100, shield: 10 },
      { id: 'toxic_snake', name: '毒蛇', emoji: '🐍', hp: 110, shield: 0 },
    ],
    crystal: [
      { id: 'crystal_imp', name: '水晶小鬼', emoji: '👻', hp: 120, shield: 20 },
      { id: 'gem_golem', name: '宝石傀儡', emoji: '💎', hp: 180, shield: 40 },
      { id: 'prism_bat', name: '棱镜蝙蝠', emoji: '🦋', hp: 90, shield: 10 },
    ],
    ancient: [
      { id: 'stone_sentry', name: '石头哨兵', emoji: '🗿', hp: 200, shield: 50 },
      { id: 'golden_idol', name: '黄金神像', emoji: '🗽', hp: 250, shield: 30 },
      { id: 'ancient_ghost', name: '远古幽灵', emoji: '👻', hp: 180, shield: 20 },
    ],
  };

  const themeEnemies = enemies[theme] || enemies.magma;
  const enemy = themeEnemies[Math.floor(Math.random() * themeEnemies.length)];
  const multiplier = 1 + (difficulty - 1) * 0.3;
  
  return {
    ...enemy,
    hp: Math.floor(enemy.hp * multiplier),
    shield: Math.floor(enemy.shield * multiplier),
  };
};

export const generateCritZones = (canvasWidth: number, canvasHeight: number, count: number): { x: number; y: number; radius: number; hit: boolean }[] => {
  const zones: { x: number; y: number; radius: number; hit: boolean }[] = [];
  const radius = Math.min(canvasWidth, canvasHeight) * 0.08;
  
  for (let i = 0; i < count; i++) {
    zones.push({
      x: Math.random() * (canvasWidth - radius * 2) + radius,
      y: Math.random() * (canvasHeight - radius * 2) + radius,
      radius,
      hit: false,
    });
  }
  
  return zones;
};
