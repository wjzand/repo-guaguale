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
  addOre: (oreId: string, count: number) => void;
  getOreById: (id: string) => Ore | undefined;
  getPlayerOre: (oreId: string) => PlayerOre | undefined;
  getCurrentLevelInfo: () => MinerLevel;
  getNextLevelExp: () => number;
  getCollectedOreCount: () => number;
  getTotalOreCount: () => number;
}

export type GameStore = GameState & GameActions;

export type TabType = 'mine' | 'collection' | 'rank' | 'profile';

// ============ 远古矿脉相关类型 ============

export type RoomType = 'camp' | 'battle' | 'treasure' | 'event' | 'rest' | 'boss' | 'unknown';

export type MineThemeType = 'magma' | 'ice' | 'poison' | 'crystal' | 'ancient';

export interface MineTheme {
  id: MineThemeType;
  name: string;
  description: string;
  emoji: string;
  unlockLevel: number;
  bgColor: string;
  color: string;
  bossId: string;
  difficulty: number;
}

export interface MineRoom {
  id: string;
  type: RoomType;
  x: number;
  y: number;
  layer: number;
  connections: string[];
  visited: boolean;
  cleared: boolean;
  revealed: boolean;
  eventId?: string;
  enemyId?: string;
  reward?: MineRoomReward;
  battleState?: BattleState;
  event?: MineEvent;
  restoredHp?: number;
}

export interface MineRoomReward {
  ores?: { oreId: string; count: number }[];
  fragments?: number;
  ancientFragments?: number;
  items?: { type: string; count: number }[];
  attackBonus?: number;
  hp?: number;
}

export interface MineBoss {
  id: string;
  name: string;
  emoji: string;
  maxHp: number;
  shield: number;
  theme: MineThemeType;
  skills: BossSkill[];
  rewards: MineRoomReward;
}

export interface BossSkill {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  effect?: 'heal' | 'shield' | 'obscure' | 'thicken';
}

export interface MineEvent {
  id: string;
  name: string;
  title: string;
  description: string;
  emoji: string;
  icon: string;
  choices: EventChoice[];
}

export interface EventChoice {
  id: string;
  text: string;
  description: string;
  cost?: { hp?: number; ancientFragments?: number };
  reward?: MineRoomReward;
  successRate?: number;
}

export interface BattleState {
  enemyHp: number;
  enemyMaxHp: number;
  enemyShield: number;
  playerTurns: number;
  maxTurns: number;
  isBoss: boolean;
  bossSkillCooldown: number;
  critZones: { x: number; y: number; radius: number; hit: boolean }[];
  totalDamage: number;
  isVictory?: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  icon: string;
  price: number;
  type: 'heal' | 'attack' | 'shield' | 'bomb' | 'precision' | 'skip';
  effect: { value: number };
  stock: number;
  purchased?: boolean;
}

export interface AncientRunState {
  mineType: MineThemeType;
  rooms: MineRoom[];
  currentRoomId: string;
  hp: number;
  maxHp: number;
  ancientFragments: number;
  attackBonus: number;
  critBonus: number;
  shield: number;
  bombs: number;
  oresCollected: { oreId: string; count: number }[];
  itemsCollected: { type: string; count: number }[];
  battleState?: BattleState;
  shopItems?: ShopItem[];
  currentEvent?: MineEvent;
  isFinished: boolean;
  victory: boolean;
  startTime: number;
}

export interface RunResult {
  victory: boolean;
  oresCollected: { oreId: string; count: number }[];
  fragments: number;
  expGained: number;
  newMedals: string[];
}

export interface AncientMineState {
  tickets: number;
  todayTicketDate: string;
  bossKills: Record<string, number>;
  bestTime: Record<string, number>;
  seasonScore: number;
  seasonDate: string;
  bossPets: string[];
  medals: string[];
  currentRun: AncientRunState | null;
  lastRunResult: RunResult | null;
}

export interface AncientMineActions {
  getAncientTickets: () => number;
  claimDailyTicket: () => boolean;
  startAncientRun: (mineType: MineThemeType) => boolean;
  enterRoom: (roomId: string) => boolean;
  doBattleTurn: (damage: number, critHit: boolean) => { victory: boolean; damage: number; enemyTurn?: boolean };
  useBattleBomb: () => number;
  makeEventChoice: (choiceId: string) => { success: boolean; message: string; reward?: any };
  buyShopItem: (itemId: string) => boolean;
  finishRun: (victory: boolean) => { ores: any[]; fragments: any; ancientFragments: number };
  abandonRun: () => void;
  getMedals: () => string[];
}

export type FullGameStore = GameStore & { ancientMine: AncientMineState } & AncientMineActions;
