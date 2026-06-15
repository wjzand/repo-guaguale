import type { Ore } from '@/types';

export const ORES: Ore[] = [
  // 普通矿石 - 基础金属系列
  { id: 'ore_001', name: '铁矿石', emoji: '🪨', rarity: 'normal', series: 'basic_metal', description: '最常见的矿石，是炼铁的基础原料。', color: '#9CA3AF' },
  { id: 'ore_002', name: '铜矿石', emoji: '🟤', rarity: 'normal', series: 'basic_metal', description: '呈现橙红色光泽的常见矿石。', color: '#CD7F32' },
  { id: 'ore_003', name: '煤矿石', emoji: '⬛', rarity: 'normal', series: 'basic_metal', description: '黑色的可燃矿石，熔炼必备燃料。', color: '#374151' },
  { id: 'ore_004', name: '锡矿石', emoji: '⚪', rarity: 'normal', series: 'basic_metal', description: '银白色的软金属矿石。', color: '#D1D5DB' },
  { id: 'ore_005', name: '铅矿石', emoji: '🔘', rarity: 'normal', series: 'basic_metal', description: '沉重的蓝灰色金属矿石。', color: '#6B7280' },
  { id: 'ore_006', name: '铝矿石', emoji: '⚪', rarity: 'normal', series: 'basic_metal', description: '轻量金属的主要来源。', color: '#E5E7EB' },
  { id: 'ore_007', name: '锌矿石', emoji: '🔵', rarity: 'normal', series: 'basic_metal', description: '略带蓝色的灰白色矿石。', color: '#94A3B8' },
  { id: 'ore_008', name: '锰矿石', emoji: '🟤', rarity: 'normal', series: 'basic_metal', description: '黑色或棕黑色的矿石。', color: '#78716C' },
  
  // 普通矿石 - 普通石头系列
  { id: 'ore_009', name: '花岗岩', emoji: '🪨', rarity: 'normal', series: 'common_stone', description: '坚硬的火成岩，常见于矿洞墙壁。', color: '#9CA3AF' },
  { id: 'ore_010', name: '石灰石', emoji: '🪨', rarity: 'normal', series: 'common_stone', description: '灰白色的沉积岩。', color: '#D1D5DB' },
  { id: 'ore_011', name: '砂岩', emoji: '🟡', rarity: 'normal', series: 'common_stone', description: '由砂粒胶结而成的岩石。', color: '#D4A574' },
  { id: 'ore_012', name: '页岩', emoji: '🪨', rarity: 'normal', series: 'common_stone', description: '具有薄页状层理的岩石。', color: '#6B7280' },

  // 稀有矿石 - 贵金属系列
  { id: 'ore_013', name: '银矿石', emoji: '🥈', rarity: 'rare', series: 'precious_metal', description: '闪闪发光的银白色贵金属矿石。', color: '#C0C0C0' },
  { id: 'ore_014', name: '金矿石', emoji: '🥇', rarity: 'rare', series: 'precious_metal', description: '人人向往的黄金矿石！', color: '#FFD700' },
  { id: 'ore_015', name: '铂金矿石', emoji: '⚪', rarity: 'rare', series: 'precious_metal', description: '比黄金更稀有的贵重金属。', color: '#E5E4E2' },
  { id: 'ore_016', name: '钯金矿石', emoji: '⬜', rarity: 'rare', series: 'precious_metal', description: '银白色的稀有贵金属。', color: '#EEEEEE' },
  
  // 稀有矿石 - 水晶系列
  { id: 'ore_017', name: '白水晶', emoji: '💎', rarity: 'rare', series: 'crystal', description: '纯净透明的石英晶体。', color: '#F0F8FF' },
  { id: 'ore_018', name: '紫水晶', emoji: '💜', rarity: 'rare', series: 'crystal', description: '神秘的紫色水晶。', color: '#9966CC' },
  { id: 'ore_019', name: '粉水晶', emoji: '💗', rarity: 'rare', series: 'crystal', description: '温柔的粉红色水晶。', color: '#FFB6C1' },
  { id: 'ore_020', name: '黄水晶', emoji: '💛', rarity: 'rare', series: 'crystal', description: '温暖的黄色水晶。', color: '#FFD700' },
  { id: 'ore_021', name: '烟水晶', emoji: '🖤', rarity: 'rare', series: 'crystal', description: '深褐色的半透明水晶。', color: '#708090' },

  // 史诗矿石 - 宝石系列
  { id: 'ore_022', name: '红宝石', emoji: '❤️', rarity: 'epic', series: 'gemstone', description: '炙热的红色宝石，象征爱情与热情。', color: '#E0115F' },
  { id: 'ore_023', name: '蓝宝石', emoji: '💙', rarity: 'epic', series: 'gemstone', description: '深邃的蓝色宝石，象征智慧与真理。', color: '#0F52BA' },
  { id: 'ore_024', name: '祖母绿', emoji: '💚', rarity: 'epic', series: 'gemstone', description: '翠绿的宝石，象征生命与希望。', color: '#50C878' },
  { id: 'ore_025', name: '翡翠', emoji: '💚', rarity: 'epic', series: 'gemstone', description: '东方特有的珍贵玉石。', color: '#00A86B' },
  { id: 'ore_026', name: '海蓝宝', emoji: '💎', rarity: 'epic', series: 'gemstone', description: '如海水般清澈的蓝绿色宝石。', color: '#89CFF0' },
  { id: 'ore_027', name: '石榴石', emoji: '🔴', rarity: 'epic', series: 'gemstone', description: '深红色的宝石，形状如石榴籽。', color: '#7A003C' },
  { id: 'ore_028', name: '托帕石', emoji: '🧡', rarity: 'epic', series: 'gemstone', description: '金黄色的宝石，闪耀着温暖的光芒。', color: '#FFC87C' },

  // 史诗矿石 - 稀有矿物系列
  { id: 'ore_029', name: '钨矿石', emoji: '⬜', rarity: 'epic', series: 'rare_mineral', description: '高硬度的稀有金属矿石。', color: '#BCC6CC' },
  { id: 'ore_030', name: '钛矿石', emoji: '⚪', rarity: 'epic', series: 'rare_mineral', description: '银白色的轻金属矿石。', color: '#C0C0C0' },
  { id: 'ore_031', name: '镍矿石', emoji: '🪙', rarity: 'epic', series: 'rare_mineral', description: '银白色的铁磁性金属。', color: '#727472' },
  { id: 'ore_032', name: '钴矿石', emoji: '🔵', rarity: 'epic', series: 'rare_mineral', description: '银蓝色的稀有金属矿石。', color: '#0047AB' },

  // 传说矿石
  { id: 'ore_033', name: '钻石', emoji: '💎', rarity: 'legendary', series: 'legendary', description: '世界上最硬的宝石，永恒的象征！', color: '#B9F2FF' },
  { id: 'ore_034', name: '陨石矿', emoji: '☄️', rarity: 'legendary', series: 'legendary', description: '来自外太空的神秘矿石，蕴含宇宙能量。', color: '#4B0082' },
  { id: 'ore_035', name: '彩虹矿石', emoji: '🌈', rarity: 'legendary', series: 'legendary', description: '传说中的七彩矿石，能折射出彩虹光芒。', color: '#FF69B4' },
  { id: 'ore_036', name: '暗金矿石', emoji: '🌟', rarity: 'legendary', series: 'legendary', description: '比黄金更珍贵的暗金色金属。', color: '#996515' },
  { id: 'ore_037', name: '龙晶石', emoji: '🐉', rarity: 'legendary', series: 'legendary', description: '传说中龙族守护的神秘晶石。', color: '#00FF7F' },
  { id: 'ore_038', name: '月光石', emoji: '🌙', rarity: 'legendary', series: 'legendary', description: '散发着柔和月光的神奇宝石。', color: '#F5F5DC' },
  
  // 节日限定系列
  { id: 'ore_039', name: '月饼矿', emoji: '🥮', rarity: 'epic', series: 'festival', description: '中秋节限定的月饼形矿石。', color: '#D2691E' },
  { id: 'ore_040', name: '雪花矿', emoji: '❄️', rarity: 'epic', series: 'festival', description: '圣诞节限定的雪花结晶。', color: '#ADD8E6' },
  { id: 'ore_041', name: '彩蛋矿', emoji: '🥚', rarity: 'rare', series: 'festival', description: '复活节限定的彩色蛋形矿石。', color: '#FF69B4' },
  { id: 'ore_042', name: '粽子矿', emoji: '🍙', rarity: 'rare', series: 'festival', description: '端午节限定的粽子形矿石。', color: '#228B22' },
  { id: 'ore_043', name: '爱心矿', emoji: '❤️', rarity: 'epic', series: 'festival', description: '情人节限定的爱心矿石。', color: '#FF1493' },
  
  // 额外补充的矿石
  { id: 'ore_044', name: '琥珀', emoji: '🟠', rarity: 'rare', series: 'gemstone', description: '远古树脂形成的有机宝石。', color: '#FFBF00' },
  { id: 'ore_045', name: '孔雀石', emoji: '💚', rarity: 'rare', series: 'gemstone', description: '具有美丽纹路的绿色矿石。', color: '#00A693' },
  { id: 'ore_046', name: '青金石', emoji: '💙', rarity: 'rare', series: 'gemstone', description: '深蓝色的古老宝石。', color: '#1E3D59' },
  { id: 'ore_047', name: '黑曜石', emoji: '🖤', rarity: 'normal', series: 'common_stone', description: '火山喷发形成的黑色玻璃状岩石。', color: '#1C1C1C' },
  { id: 'ore_048', name: '绿松石', emoji: '💙', rarity: 'rare', series: 'gemstone', description: '鲜艳的蓝绿色宝石。', color: '#40E0D0' },
  { id: 'ore_049', name: '橄榄石', emoji: '💚', rarity: 'rare', series: 'gemstone', description: '橄榄绿色的透明宝石。', color: '#9AB973' },
  { id: 'ore_050', name: '血玉髓', emoji: '❤️', rarity: 'epic', series: 'gemstone', description: '带有红色斑点的绿色玉髓。', color: '#87A96B' },
  { id: 'ore_051', name: '星彩红宝石', emoji: '⭐', rarity: 'legendary', series: 'legendary', description: '在光线下呈现星光效应的珍稀红宝石。', color: '#DC143C' },
];

export const getOreById = (id: string): Ore | undefined => {
  return ORES.find(ore => ore.id === id);
};

export const getOresByRarity = (rarity: string): Ore[] => {
  return ORES.filter(ore => ore.rarity === rarity);
};

export const getOresBySeries = (series: string): Ore[] => {
  return ORES.filter(ore => ore.series === series);
};

export const getAllSeries = (): string[] => {
  const series = new Set(ORES.map(ore => ore.series));
  return Array.from(series);
};

export const SERIES_INFO: Record<string, { name: string; description: string }> = {
  basic_metal: { name: '基础金属系列', description: '最常见的金属矿石，是矿工的入门收藏。' },
  common_stone: { name: '普通石头系列', description: '矿洞中随处可见的普通岩石。' },
  precious_metal: { name: '贵金属系列', description: '价值较高的贵金属矿石。' },
  crystal: { name: '水晶系列', description: '各种颜色的美丽水晶。' },
  gemstone: { name: '宝石系列', description: '璀璨夺目的珍贵宝石。' },
  rare_mineral: { name: '稀有矿物系列', description: '稀有的工业金属矿物。' },
  legendary: { name: '传说系列', description: '传说中的珍稀矿石，可遇不可求。' },
  festival: { name: '节日限定系列', description: '只在特定节日出现的限定矿石。' },
};
