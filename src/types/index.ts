export type OreRarity = 'normal' | 'rare' | 'epic' | 'legendary';

export interface Ore {
  id: string;
  name: string;
  emoji: string;
  rarity: OreRarity;
  series: string;
  description: string;
  color: string;
}

export interface PlayerOre {
  oreId: string;
  count: number;
  firstObtained: string;
}

export interface Mine {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockLevel: number;
  unlockCost?: { oreId: string; count: number };
  coatColor: string;
  coatPattern?: string;
  oreProbabilities: { rarity: OreRarity; probability: number }[];
  layers: number;
  isLimited?: boolean;
  limitedEndDate?: string;
}

export interface MinerLevel {
  level: number;
  title: string;
  expRequired: number;
  dailyFreeDigs: number;
  bombBonus: number;
  synthesizeBonus: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: { exp?: number; items?: { type: string; count: number }[] };
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  recentOre: string;
  totalOres: number;
  stolenToday: number;
  canSteal: boolean;
}

export interface Items {
  bomb: number;
  stabilizer: number;
}

export interface Fragments {
  normal: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface SynthesizeRecord {
  inputOres: string[];
  outputOre?: string;
  success: boolean;
  date: string;
}

export interface StolenRecord {
  friendId: string;
  friendName: string;
  oreId: string;
  oreName: string;
  date: string;
  success: boolean;
}

export interface GameState {
  level: number;
  exp: number;
  todayDate: string;
  lastLoginDate: string;
  freeDigsUsed: number;
  videoDigsUsed: number;
  shareDigsUsed: number;
  giftDigsUsed: number;
  totalDigs: number;
  totalSynthesized: number;
  stolenCount: number;
  beenStolenCount: number;
  ores: PlayerOre[];
  fragments: Fragments;
  items: Items;
  achievements: string[];
  friends: Friend[];
  stolenFrom: StolenRecord[];
  stolenBy: StolenRecord[];
  giftsSent: number;
  synthesizeHistory: SynthesizeRecord[];
  currentMine: string;
  digStreak: number;
  lastDigDate: string;
}

export interface GameActions {
  dig: () => { success: boolean; ore?: Ore; isNew?: boolean; message?: string };
  canDig: () => boolean;
  getRemainingDigs: () => number;
  addDigFromVideo: () => boolean;
  addDigFromShare: () => boolean;
  addDigFromGift: () => boolean;
  synthesize: (oreIds: string[], useStabilizer?: boolean) => { success: boolean; ore?: Ore; message: string };
  canSynthesize: (rarity: OreRarity) => boolean;
  useBomb: () => boolean;
  stealFromFriend: (friendId: string) => { success: boolean; ore?: Ore; message: string };
  giveGift: (friendId: string, oreId: string) => boolean;
  addExp: (amount: number) => { leveledUp: boolean; newLevel?: number };
  unlockAchievement: (id: string) => boolean;
  checkAchievements: () => void;
  selectMine: (mineId: string) => boolean;
  resetDailyIfNeeded: () => void;
  checkDailyReset: () => void;
  addDailyBonus: () => void;
  getOreById: (id: string) => Ore | undefined;
  getPlayerOre: (oreId: string) => PlayerOre | undefined;
  getCurrentLevelInfo: () => MinerLevel;
  getNextLevelExp: () => number;
  getCollectedOreCount: () => number;
  getTotalOreCount: () => number;
}

export type GameStore = GameState & GameActions;

export type TabType = 'mine' | 'collection' | 'rank' | 'profile';
