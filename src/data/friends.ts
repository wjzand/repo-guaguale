import type { Friend } from '@/types';

export const FRIENDS: Friend[] = [
  { id: 'friend_1', name: '矿工小明', avatar: '👨‍🌾', level: 4, recentOre: 'ore_014', totalOres: 28, stolenToday: 0, canSteal: true },
  { id: 'friend_2', name: '淘金者阿花', avatar: '👩‍🔧', level: 6, recentOre: 'ore_017', totalOres: 42, stolenToday: 1, canSteal: true },
  { id: 'friend_3', name: '钻石王老五', avatar: '🧔', level: 8, recentOre: 'ore_022', totalOres: 58, stolenToday: 2, canSteal: true },
  { id: 'friend_4', name: '水晶妹妹', avatar: '👧', level: 3, recentOre: 'ore_018', totalOres: 20, stolenToday: 0, canSteal: true },
  { id: 'friend_5', name: '铁匠老张', avatar: '👨‍🏭', level: 5, recentOre: 'ore_001', totalOres: 35, stolenToday: 1, canSteal: false },
  { id: 'friend_6', name: '探险家小李', avatar: '🧑‍🚀', level: 7, recentOre: 'ore_024', totalOres: 51, stolenToday: 0, canSteal: true },
  { id: 'friend_7', name: '宝石商人', avatar: '🧙', level: 9, recentOre: 'ore_033', totalOres: 65, stolenToday: 3, canSteal: false },
  { id: 'friend_8', name: '矿洞之主', avatar: '🤴', level: 12, recentOre: 'ore_034', totalOres: 88, stolenToday: 0, canSteal: true },
  { id: 'friend_9', name: '小矿工豆豆', avatar: '👦', level: 2, recentOre: 'ore_002', totalOres: 12, stolenToday: 0, canSteal: true },
  { id: 'friend_10', name: '神秘矿工', avatar: '🦸', level: 15, recentOre: 'ore_037', totalOres: 120, stolenToday: 1, canSteal: true },
];

export const ALL_SERVER_PLAYERS = [
  { rank: 1, name: '矿神下凡', avatar: '🏆', level: 20, totalOres: 256, legendaryCount: 12 },
  { rank: 2, name: '钻石大亨', avatar: '💎', level: 19, totalOres: 220, legendaryCount: 9 },
  { rank: 3, name: '黄金矿工王', avatar: '👑', level: 18, totalOres: 198, legendaryCount: 7 },
  { rank: 4, name: '水晶公主', avatar: '👸', level: 17, totalOres: 175, legendaryCount: 5 },
  { rank: 5, name: '寻宝猎人', avatar: '🗺️', level: 16, totalOres: 160, legendaryCount: 4 },
  { rank: 6, name: '矿石收藏家', avatar: '📦', level: 15, totalOres: 145, legendaryCount: 3 },
  { rank: 7, name: '挖矿达人', avatar: '⛏️', level: 14, totalOres: 130, legendaryCount: 3 },
  { rank: 8, name: '金手指', avatar: '🖐️', level: 13, totalOres: 118, legendaryCount: 2 },
  { rank: 9, name: '幸运矿工', avatar: '🍀', level: 12, totalOres: 105, legendaryCount: 2 },
  { rank: 10, name: '勤劳小蜜蜂', avatar: '🐝', level: 11, totalOres: 92, legendaryCount: 1 },
  { rank: 11, name: '岩石粉碎者', avatar: '💥', level: 10, totalOres: 85, legendaryCount: 1 },
  { rank: 12, name: '洞穴探险家', avatar: '🏔️', level: 10, totalOres: 80, legendaryCount: 1 },
  { rank: 13, name: '宝石猎人', avatar: '💎', level: 9, totalOres: 72, legendaryCount: 0 },
  { rank: 14, name: '铁矿工', avatar: '🔩', level: 9, totalOres: 68, legendaryCount: 0 },
  { rank: 15, name: '新手上路', avatar: '🐣', level: 8, totalOres: 60, legendaryCount: 0 },
  { rank: 16, name: '矿工小白', avatar: '🥚', level: 7, totalOres: 52, legendaryCount: 0 },
  { rank: 17, name: '挖呀挖呀挖', avatar: '🎵', level: 7, totalOres: 48, legendaryCount: 0 },
  { rank: 18, name: '黄金梦想家', avatar: '✨', level: 6, totalOres: 42, legendaryCount: 0 },
  { rank: 19, name: '小小矿工', avatar: '🧒', level: 5, totalOres: 35, legendaryCount: 0 },
  { rank: 20, name: '矿石爱好者', avatar: '💫', level: 5, totalOres: 30, legendaryCount: 0 },
];

export const STEAL_RANKING = [
  { rank: 1, name: '神偷矿工', avatar: '🥷', stealCount: 25 },
  { rank: 2, name: '夜行侠', avatar: '🦇', stealCount: 20 },
  { rank: 3, name: '快手小王', avatar: '⚡', stealCount: 18 },
  { rank: 4, name: '神秘来客', avatar: '👤', stealCount: 15 },
  { rank: 5, name: '影子矿工', avatar: '👤', stealCount: 12 },
  { rank: 6, name: '顺手牵羊', avatar: '🐑', stealCount: 10 },
  { rank: 7, name: '偷矿达人', avatar: '🎯', stealCount: 8 },
  { rank: 8, name: '小小偷', avatar: '🐭', stealCount: 6 },
  { rank: 9, name: '菜鸟小偷', avatar: '🐤', stealCount: 3 },
  { rank: 10, name: '新手上路', avatar: '🆕', stealCount: 1 },
];
