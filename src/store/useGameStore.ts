import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStore, Ore, OreRarity, PlayerOre } from '@/types';
import { ORES, getOreById, getOresByRarity, getAllSeries, getOresBySeries } from '@/data/ores';
import { MINES, getMineById } from '@/data/mines';
import { LEVELS, getLevelInfo, getNextLevelExp, getExpForLevel } from '@/data/levels';
import { ACHIEVEMENTS } from '@/data/achievements';
import { FRIENDS } from '@/data/friends';

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getRandomOreByRarity = (rarity: OreRarity): Ore => {
  const ores = getOresByRarity(rarity);
  const randomIndex = Math.floor(Math.random() * ores.length);
  return ores[randomIndex];
};

const getRandomOre = (probabilities: { rarity: OreRarity; probability: number }[]): Ore => {
  const random = Math.random();
  let cumulative = 0;
  
  for (const { rarity, probability } of probabilities) {
    cumulative += probability;
    if (random <= cumulative) {
      return getRandomOreByRarity(rarity);
    }
  }
  
  return getRandomOreByRarity('normal');
};

const initialState = {
  level: 1,
  exp: 0,
  todayDate: getTodayString(),
  lastLoginDate: '',
  freeDigsUsed: 0,
  videoDigsUsed: 0,
  shareDigsUsed: 0,
  giftDigsUsed: 0,
  totalDigs: 0,
  totalSynthesized: 0,
  stolenCount: 0,
  beenStolenCount: 0,
  ores: [] as PlayerOre[],
  fragments: { normal: 0, rare: 0, epic: 0, legendary: 0 },
  items: { bomb: 2, stabilizer: 1 },
  achievements: [] as string[],
  friends: FRIENDS,
  stolenFrom: [] as any[],
  stolenBy: [] as any[],
  giftsSent: 0,
  synthesizeHistory: [] as any[],
  currentMine: 'mine_beginner',
  digStreak: 0,
  lastDigDate: '',
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      dig: () => {
        const state = get();
        
        if (!state.canDig()) {
          return { success: false, message: '今日挖掘次数已用完' };
        }

        const mine = getMineById(state.currentMine);
        if (!mine) {
          return { success: false, message: '矿洞不存在' };
        }

        const ore = getRandomOre(mine.oreProbabilities);
        const playerOre = state.ores.find(o => o.oreId === ore.id);
        const isNew = !playerOre;

        set((state) => {
          const newOres = [...state.ores];
          const newFragments = { ...state.fragments };

          if (isNew) {
            newOres.push({
              oreId: ore.id,
              count: 1,
              firstObtained: getTodayString(),
            });
          } else {
            const oreIndex = newOres.findIndex(o => o.oreId === ore.id);
            if (oreIndex !== -1) {
              newOres[oreIndex] = {
                ...newOres[oreIndex],
                count: newOres[oreIndex].count + 1,
              };
              newFragments[ore.rarity] += 1;
            }
          }

          let newFreeDigsUsed = state.freeDigsUsed;
          let newVideoDigsUsed = state.videoDigsUsed;
          let newShareDigsUsed = state.shareDigsUsed;
          let newGiftDigsUsed = state.giftDigsUsed;

          const levelInfo = getLevelInfo(state.level);
          const remainingFree = levelInfo.dailyFreeDigs - state.freeDigsUsed;
          
          if (remainingFree > 0) {
            newFreeDigsUsed++;
          } else if (state.videoDigsUsed < 3) {
            newVideoDigsUsed++;
          } else if (state.shareDigsUsed < 1) {
            newShareDigsUsed++;
          } else {
            newGiftDigsUsed++;
          }

          return {
            ores: newOres,
            fragments: newFragments,
            freeDigsUsed: newFreeDigsUsed,
            videoDigsUsed: newVideoDigsUsed,
            shareDigsUsed: newShareDigsUsed,
            giftDigsUsed: newGiftDigsUsed,
            totalDigs: state.totalDigs + 1,
            digStreak: state.lastDigDate === getTodayString() ? state.digStreak : 1,
            lastDigDate: getTodayString(),
          };
        });

        const expGain = ore.rarity === 'legendary' ? 50 : 
                        ore.rarity === 'epic' ? 20 : 
                        ore.rarity === 'rare' ? 10 : 5;
        get().addExp(expGain);

        get().checkAchievements();

        return { success: true, ore, isNew };
      },

      canDig: () => {
        const state = get();
        const levelInfo = getLevelInfo(state.level);
        const totalUsed = state.freeDigsUsed + state.videoDigsUsed + state.shareDigsUsed + state.giftDigsUsed;
        const maxDigs = levelInfo.dailyFreeDigs + 3 + 1 + 1;
        return totalUsed < maxDigs;
      },

      getRemainingDigs: () => {
        const state = get();
        const levelInfo = getLevelInfo(state.level);
        const totalUsed = state.freeDigsUsed + state.videoDigsUsed + state.shareDigsUsed + state.giftDigsUsed;
        const maxDigs = levelInfo.dailyFreeDigs + 3 + 1 + 1;
        return Math.max(0, maxDigs - totalUsed);
      },

      addDigFromVideo: () => {
        const state = get();
        if (state.videoDigsUsed >= 3) return false;
        return true;
      },

      addDigFromShare: () => {
        const state = get();
        if (state.shareDigsUsed >= 1) return false;
        return true;
      },

      addDigFromGift: () => {
        const state = get();
        if (state.giftDigsUsed >= 1) return false;
        return true;
      },

      synthesize: (oreIds: string[], useStabilizer = false) => {
        const state = get();
        
        if (oreIds.length !== 3) {
          return { success: false, message: '需要3个矿石' };
        }

        const ores = oreIds.map(id => getOreById(id)).filter(Boolean) as Ore[];
        if (ores.length !== 3) {
          return { success: false, message: '矿石不存在' };
        }

        const rarity = ores[0].rarity;
        if (!ores.every(o => o.rarity === rarity)) {
          return { success: false, message: '需要同稀有度的矿石' };
        }

        if (rarity === 'legendary') {
          return { success: false, message: '传说矿石无法继续合成' };
        }

        const playerOres = oreIds.map(id => state.getPlayerOre(id));
        if (playerOres.some(o => !o || o.count < 1)) {
          return { success: false, message: '矿石数量不足' };
        }

        const levelInfo = getLevelInfo(state.level);
        
        let successRate = rarity === 'normal' ? 1.0 :
                          rarity === 'rare' ? 0.7 :
                          rarity === 'epic' ? 0.4 : 0;
        
        successRate += levelInfo.synthesizeBonus;
        if (useStabilizer && state.items.stabilizer > 0) {
          successRate += 0.2;
        }
        successRate = Math.min(successRate, 1);

        const success = Math.random() < successRate;

        set((state) => {
          const newOres = [...state.ores];
          
          oreIds.forEach(id => {
            const index = newOres.findIndex(o => o.oreId === id);
            if (index !== -1) {
              newOres[index] = {
                ...newOres[index],
                count: newOres[index].count - 1,
              };
            }
          });

          let newItems = { ...state.items };
          if (useStabilizer && state.items.stabilizer > 0) {
            newItems.stabilizer -= 1;
          }

          let outputOre: Ore | null = null;
          if (success) {
            const nextRarity: OreRarity = rarity === 'normal' ? 'rare' :
                                          rarity === 'rare' ? 'epic' : 'legendary';
            outputOre = getRandomOreByRarity(nextRarity);
            
            const existingIndex = newOres.findIndex(o => o.oreId === outputOre!.id);
            if (existingIndex === -1) {
              newOres.push({
                oreId: outputOre.id,
                count: 1,
                firstObtained: getTodayString(),
              });
            } else {
              newOres[existingIndex] = {
                ...newOres[existingIndex],
                count: newOres[existingIndex].count + 1,
              };
            }
          }

          const newHistory = [...state.synthesizeHistory, {
            inputOres: oreIds,
            outputOre: outputOre?.id,
            success,
            date: getTodayString(),
          }];

          return {
            ores: newOres,
            items: newItems,
            synthesizeHistory: newHistory,
            totalSynthesized: state.totalSynthesized + 1,
          };
        });

        const expGain = success ? (rarity === 'epic' ? 50 : rarity === 'rare' ? 20 : 10) : 5;
        get().addExp(expGain);

        get().checkAchievements();

        if (success) {
          const nextRarity: OreRarity = rarity === 'normal' ? 'rare' :
                                        rarity === 'rare' ? 'epic' : 'legendary';
          const outputOre = getRandomOreByRarity(nextRarity);
          return { success: true, ore: outputOre, message: '合成成功！' };
        }

        return { success: false, message: '合成失败，矿石损失了...' };
      },

      canSynthesize: (rarity: OreRarity) => {
        const state = get();
        const oresOfRarity = state.ores.filter(o => {
          const ore = getOreById(o.oreId);
          return ore && ore.rarity === rarity && o.count > 0;
        });
        
        const totalCount = oresOfRarity.reduce((sum, o) => sum + o.count, 0);
        return totalCount >= 3;
      },

      useBomb: () => {
        const state = get();
        if (state.items.bomb <= 0) return false;
        
        set((state) => ({
          items: {
            ...state.items,
            bomb: state.items.bomb - 1,
          },
        }));
        return true;
      },

      stealFromFriend: (friendId: string) => {
        const state = get();
        const friend = state.friends.find(f => f.id === friendId);
        
        if (!friend) {
          return { success: false, message: '好友不存在' };
        }
        
        if (!friend.canSteal) {
          return { success: false, message: '今日已偷过该好友或好友今日被偷次数已满' };
        }

        const success = Math.random() < 0.5;
        
        if (success) {
          const ore = getOreById(friend.recentOre);
          if (ore) {
            set((state) => {
              const newOres = [...state.ores];
              const newFragments = { ...state.fragments };
              const existingIndex = newOres.findIndex(o => o.oreId === ore.id);
              
              if (existingIndex === -1) {
                newOres.push({
                  oreId: ore.id,
                  count: 1,
                  firstObtained: getTodayString(),
                });
              } else {
                newOres[existingIndex] = {
                  ...newOres[existingIndex],
                  count: newOres[existingIndex].count + 1,
                };
                newFragments[ore.rarity] += 1;
              }

              const newFriends = state.friends.map(f => 
                f.id === friendId ? { ...f, canSteal: false } : f
              );

              const newStolenFrom = [...state.stolenFrom, {
                friendId,
                friendName: friend.name,
                oreId: ore.id,
                oreName: ore.name,
                date: getTodayString(),
                success: true,
              }];

              return {
                ores: newOres,
                fragments: newFragments,
                friends: newFriends,
                stolenFrom: newStolenFrom,
                stolenCount: state.stolenCount + 1,
              };
            });

            get().addExp(25);
            get().checkAchievements();

            return { success: true, ore, message: `成功偷取了${friend.name}的${ore.name}！` };
          }
        }

        set((state) => {
          const newFriends = state.friends.map(f => 
            f.id === friendId ? { ...f, canSteal: false } : f
          );
          
          const newStolenFrom = [...state.stolenFrom, {
            friendId,
            friendName: friend.name,
            oreId: '',
            oreName: '',
            date: getTodayString(),
            success: false,
          }];

          return {
            friends: newFriends,
            stolenFrom: newStolenFrom,
          };
        });

        return { success: false, message: `偷取失败！被${friend.name}发现了...` };
      },

      giveGift: (friendId: string, oreId: string) => {
        const state = get();
        const playerOre = state.getPlayerOre(oreId);
        
        if (!playerOre || playerOre.count <= 0) {
          return false;
        }

        const ore = getOreById(oreId);
        if (!ore || ore.rarity !== 'normal') {
          return false;
        }

        set((state) => {
          const newOres = state.ores.map(o => 
            o.oreId === oreId ? { ...o, count: o.count - 1 } : o
          );

          return {
            ores: newOres,
            giftsSent: state.giftsSent + 1,
          };
        });

        get().addExp(10);
        get().checkAchievements();

        return true;
      },

      addExp: (amount: number) => {
        const state = get();
        const currentLevel = state.level;
        const currentExp = state.exp + amount;
        
        let newLevel = currentLevel;
        let remainingExp = currentExp;
        
        while (newLevel < LEVELS.length && remainingExp >= getNextLevelExp(newLevel)) {
          remainingExp -= getNextLevelExp(newLevel);
          newLevel++;
        }

        const leveledUp = newLevel > currentLevel;
        
        set({
          level: newLevel,
          exp: remainingExp,
        });

        if (leveledUp) {
          get().checkAchievements();
          return { leveledUp: true, newLevel };
        }

        return { leveledUp: false };
      },

      unlockAchievement: (id: string) => {
        const state = get();
        if (state.achievements.includes(id)) return false;

        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return false;

        set((state) => ({
          achievements: [...state.achievements, id],
        }));

        if (achievement.reward.exp) {
          get().addExp(achievement.reward.exp);
        }

        if (achievement.reward.items) {
          set((state) => {
            const newItems = { ...state.items };
            achievement.reward.items?.forEach(item => {
              if (item.type === 'bomb') {
                newItems.bomb += item.count;
              } else if (item.type === 'stabilizer') {
                newItems.stabilizer += item.count;
              }
            });
            return { items: newItems };
          });
        }

        return true;
      },

      checkAchievements: () => {
        const state = get();
        
        if (state.totalDigs >= 1) state.unlockAchievement('first_dig');
        if (state.totalDigs >= 10) state.unlockAchievement('dig_10');
        if (state.totalDigs >= 50) state.unlockAchievement('dig_50');
        if (state.totalDigs >= 100) state.unlockAchievement('dig_100');
        
        const collectedCount = state.ores.filter(o => o.count > 0).length;
        if (collectedCount >= 10) state.unlockAchievement('collect_10');
        if (collectedCount >= 25) state.unlockAchievement('collect_25');
        
        const series = getAllSeries();
        let hasCompleteSeries = false;
        for (const s of series) {
          const seriesOres = getOresBySeries(s);
          const collected = seriesOres.filter(ore => 
            state.ores.some(o => o.oreId === ore.id && o.count > 0)
          );
          if (collected.length === seriesOres.length && seriesOres.length > 0) {
            hasCompleteSeries = true;
            break;
          }
        }
        if (hasCompleteSeries) state.unlockAchievement('collect_all_series');
        
        if (state.totalSynthesized >= 1) state.unlockAchievement('first_synthesize');
        
        const hasLegendary = state.ores.some(o => {
          const ore = getOreById(o.oreId);
          return ore && ore.rarity === 'legendary' && o.count > 0;
        });
        if (hasLegendary) state.unlockAchievement('first_legendary');
        
        if (state.stolenCount >= 1) state.unlockAchievement('steal_1');
        if (state.stolenCount >= 10) state.unlockAchievement('steal_10');
        
        if (state.giftsSent >= 1) state.unlockAchievement('give_gift');
        
        if (state.level >= 5) state.unlockAchievement('reach_level_5');
        if (state.level >= 10) state.unlockAchievement('reach_level_10');
      },

      selectMine: (mineId: string) => {
        const state = get();
        const mine = getMineById(mineId);
        
        if (!mine) return false;
        if (mine.unlockLevel > state.level) return false;
        
        set({ currentMine: mineId });
        return true;
      },

      checkDailyReset: () => {
        const state = get();
        const today = getTodayString();
        
        if (state.todayDate !== today) {
          set({
            todayDate: today,
            freeDigsUsed: 0,
            videoDigsUsed: 0,
            shareDigsUsed: 0,
            giftDigsUsed: 0,
            friends: FRIENDS.map(f => ({ ...f, canSteal: true, stolenToday: 0 })),
          });
        }
      },

      addDailyBonus: () => {
        const today = getTodayString();
        set({ lastLoginDate: today });
        get().addExp(30);
      },

      resetDailyIfNeeded: () => {
        get().checkDailyReset();
      },

      getOreById: (id: string) => getOreById(id),

      getPlayerOre: (oreId: string) => {
        const state = get();
        return state.ores.find(o => o.oreId === oreId);
      },

      getCurrentLevelInfo: () => {
        const state = get();
        return getLevelInfo(state.level);
      },

      getNextLevelExp: () => {
        const state = get();
        return getNextLevelExp(state.level);
      },

      getCollectedOreCount: () => {
        const state = get();
        return state.ores.filter(o => o.count > 0).length;
      },

      getTotalOreCount: () => {
        const state = get();
        return state.ores.reduce((sum, o) => sum + o.count, 0);
      },
    }),
    {
      name: 'gold-miner-game-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.resetDailyIfNeeded();
        }
      },
    }
  )
);
