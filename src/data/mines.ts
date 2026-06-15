import type { Mine } from '@/types';

export const MINES: Mine[] = [
  {
    id: 'mine_beginner',
    name: '新手矿洞',
    description: '适合新手矿工的初级矿洞，矿石丰富但稀有度较低。',
    emoji: '⛏️',
    unlockLevel: 1,
    coatColor: '#8B4513',
    coatPattern: 'rock',
    oreProbabilities: [
      { rarity: 'normal', probability: 0.75 },
      { rarity: 'rare', probability: 0.20 },
      { rarity: 'epic', probability: 0.045 },
      { rarity: 'legendary', probability: 0.005 },
    ],
    layers: 1,
  },
  {
    id: 'mine_gold',
    name: '黄金矿洞',
    description: '富含黄金的矿洞，贵金属矿石掉落率更高。',
    emoji: '🏆',
    unlockLevel: 3,
    coatColor: '#DAA520',
    coatPattern: 'gold',
    oreProbabilities: [
      { rarity: 'normal', probability: 0.55 },
      { rarity: 'rare', probability: 0.32 },
      { rarity: 'epic', probability: 0.11 },
      { rarity: 'legendary', probability: 0.02 },
    ],
    layers: 1,
  },
  {
    id: 'mine_crystal',
    name: '水晶矿洞',
    description: '闪耀着水晶光芒的神秘矿洞。',
    emoji: '💎',
    unlockLevel: 5,
    coatColor: '#9370DB',
    coatPattern: 'crystal',
    oreProbabilities: [
      { rarity: 'normal', probability: 0.50 },
      { rarity: 'rare', probability: 0.35 },
      { rarity: 'epic', probability: 0.12 },
      { rarity: 'legendary', probability: 0.03 },
    ],
    layers: 2,
  },
  {
    id: 'mine_diamond',
    name: '钻石矿洞',
    description: '传说中有钻石的深层矿洞，需要高超的采矿技巧。',
    emoji: '💠',
    unlockLevel: 8,
    coatColor: '#4169E1',
    coatPattern: 'diamond',
    oreProbabilities: [
      { rarity: 'normal', probability: 0.40 },
      { rarity: 'rare', probability: 0.35 },
      { rarity: 'epic', probability: 0.20 },
      { rarity: 'legendary', probability: 0.05 },
    ],
    layers: 2,
  },
  {
    id: 'mine_ancient',
    name: '远古矿洞',
    description: '沉睡万年的远古矿洞，蕴藏着传说中的矿石。',
    emoji: '🏛️',
    unlockLevel: 12,
    coatColor: '#4B0082',
    coatPattern: 'ancient',
    oreProbabilities: [
      { rarity: 'normal', probability: 0.30 },
      { rarity: 'rare', probability: 0.35 },
      { rarity: 'epic', probability: 0.25 },
      { rarity: 'legendary', probability: 0.10 },
    ],
    layers: 3,
  },
  {
    id: 'mine_festival',
    name: '节日矿洞',
    description: '限时开放的节日矿洞，掉落节日限定矿石！',
    emoji: '🎉',
    unlockLevel: 1,
    coatColor: '#FF69B4',
    coatPattern: 'festival',
    oreProbabilities: [
      { rarity: 'normal', probability: 0.40 },
      { rarity: 'rare', probability: 0.35 },
      { rarity: 'epic', probability: 0.20 },
      { rarity: 'legendary', probability: 0.05 },
    ],
    layers: 1,
    isLimited: true,
    limitedEndDate: '2026-12-31',
  },
];

export const getMineById = (id: string): Mine | undefined => {
  return MINES.find(mine => mine.id === id);
};

export const getUnlockedMines = (level: number): Mine[] => {
  return MINES.filter(mine => mine.unlockLevel <= level);
};
