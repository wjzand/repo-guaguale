import type { Achievement } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_dig',
    name: '初入矿场',
    description: '完成第一次挖掘',
    icon: '⛏️',
    reward: { exp: 20 },
  },
  {
    id: 'collect_10',
    name: '矿石爱好者',
    description: '收集10种不同的矿石',
    icon: '📚',
    reward: { exp: 50, items: [{ type: 'bomb', count: 1 }] },
  },
  {
    id: 'collect_25',
    name: '矿石收藏家',
    description: '收集25种不同的矿石',
    icon: '🏆',
    reward: { exp: 100, items: [{ type: 'bomb', count: 2 }] },
  },
  {
    id: 'collect_all_series',
    name: '系列收藏家',
    description: '集齐一个完整系列的矿石',
    icon: '🎯',
    reward: { exp: 150, items: [{ type: 'stabilizer', count: 1 }] },
  },
  {
    id: 'first_synthesize',
    name: '炼金学徒',
    description: '第一次成功合成矿石',
    icon: '🔥',
    reward: { exp: 30 },
  },
  {
    id: 'first_epic_synthesize',
    name: '炼金术士',
    description: '第一次成功合成史诗矿石',
    icon: '✨',
    reward: { exp: 100, items: [{ type: 'stabilizer', count: 2 }] },
  },
  {
    id: 'first_legendary',
    name: '天选之人',
    description: '获得第一块传说矿石',
    icon: '🌟',
    reward: { exp: 200, items: [{ type: 'bomb', count: 3 }] },
  },
  {
    id: 'steal_1',
    name: '小偷矿工',
    description: '偷矿成功1次',
    icon: '🦹',
    reward: { exp: 20 },
  },
  {
    id: 'steal_10',
    name: '神偷矿工',
    description: '偷矿成功10次',
    icon: '🥷',
    reward: { exp: 100, items: [{ type: 'bomb', count: 2 }] },
  },
  {
    id: 'dig_10',
    name: '勤劳矿工',
    description: '累计挖掘10次',
    icon: '💪',
    reward: { exp: 30 },
  },
  {
    id: 'dig_50',
    name: '勤奋矿工',
    description: '累计挖掘50次',
    icon: '🏅',
    reward: { exp: 80 },
  },
  {
    id: 'dig_100',
    name: '挖矿达人',
    description: '累计挖掘100次',
    icon: '👑',
    reward: { exp: 150, items: [{ type: 'bomb', count: 3 }] },
  },
  {
    id: 'give_gift',
    name: '慷慨矿工',
    description: '第一次给好友赠送矿石',
    icon: '🎁',
    reward: { exp: 25 },
  },
  {
    id: 'reach_level_5',
    name: '熟练矿工',
    description: '达到5级',
    icon: '⭐',
    reward: { exp: 100, items: [{ type: 'stabilizer', count: 1 }] },
  },
  {
    id: 'reach_level_10',
    name: '资深矿工',
    description: '达到10级',
    icon: '🌟',
    reward: { exp: 200, items: [{ type: 'bomb', count: 5 }] },
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(a => a.id === id);
};
