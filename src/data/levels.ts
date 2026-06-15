import type { MinerLevel } from '@/types';

export const LEVELS: MinerLevel[] = [
  { level: 1, title: '见习矿工', expRequired: 0, dailyFreeDigs: 5, bombBonus: 0, synthesizeBonus: 0 },
  { level: 2, title: '初级矿工', expRequired: 100, dailyFreeDigs: 5, bombBonus: 0, synthesizeBonus: 0 },
  { level: 3, title: '初级矿工', expRequired: 250, dailyFreeDigs: 6, bombBonus: 0.02, synthesizeBonus: 0 },
  { level: 4, title: '熟练矿工', expRequired: 450, dailyFreeDigs: 6, bombBonus: 0.02, synthesizeBonus: 0 },
  { level: 5, title: '熟练矿工', expRequired: 700, dailyFreeDigs: 6, bombBonus: 0.05, synthesizeBonus: 0.02 },
  { level: 6, title: '熟练矿工', expRequired: 1000, dailyFreeDigs: 7, bombBonus: 0.05, synthesizeBonus: 0.02 },
  { level: 7, title: '资深矿工', expRequired: 1400, dailyFreeDigs: 7, bombBonus: 0.08, synthesizeBonus: 0.05 },
  { level: 8, title: '资深矿工', expRequired: 1900, dailyFreeDigs: 7, bombBonus: 0.08, synthesizeBonus: 0.05 },
  { level: 9, title: '资深矿工', expRequired: 2500, dailyFreeDigs: 8, bombBonus: 0.10, synthesizeBonus: 0.08 },
  { level: 10, title: '资深矿工', expRequired: 3200, dailyFreeDigs: 8, bombBonus: 0.10, synthesizeBonus: 0.08 },
  { level: 11, title: '采矿大师', expRequired: 4000, dailyFreeDigs: 8, bombBonus: 0.15, synthesizeBonus: 0.10 },
  { level: 12, title: '采矿大师', expRequired: 5000, dailyFreeDigs: 9, bombBonus: 0.15, synthesizeBonus: 0.10 },
  { level: 13, title: '采矿大师', expRequired: 6200, dailyFreeDigs: 9, bombBonus: 0.18, synthesizeBonus: 0.12 },
  { level: 14, title: '采矿大师', expRequired: 7600, dailyFreeDigs: 9, bombBonus: 0.18, synthesizeBonus: 0.12 },
  { level: 15, title: '采矿大师', expRequired: 9200, dailyFreeDigs: 10, bombBonus: 0.20, synthesizeBonus: 0.15 },
  { level: 16, title: '矿脉之主', expRequired: 11000, dailyFreeDigs: 10, bombBonus: 0.22, synthesizeBonus: 0.18 },
  { level: 17, title: '矿脉之主', expRequired: 13000, dailyFreeDigs: 10, bombBonus: 0.25, synthesizeBonus: 0.20 },
  { level: 18, title: '矿脉之主', expRequired: 15500, dailyFreeDigs: 11, bombBonus: 0.28, synthesizeBonus: 0.22 },
  { level: 19, title: '矿脉之主', expRequired: 18500, dailyFreeDigs: 11, bombBonus: 0.30, synthesizeBonus: 0.25 },
  { level: 20, title: '矿脉之主', expRequired: 22000, dailyFreeDigs: 12, bombBonus: 0.35, synthesizeBonus: 0.30 },
];

export const getLevelInfo = (level: number): MinerLevel => {
  const clampedLevel = Math.max(1, Math.min(level, LEVELS.length));
  return LEVELS[clampedLevel - 1];
};

export const getNextLevelExp = (level: number): number => {
  if (level >= LEVELS.length) return LEVELS[LEVELS.length - 1].expRequired;
  return LEVELS[level].expRequired;
};

export const getExpForLevel = (level: number): number => {
  const clampedLevel = Math.max(1, Math.min(level, LEVELS.length));
  return LEVELS[clampedLevel - 1].expRequired;
};
