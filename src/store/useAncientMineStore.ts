import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AncientMineState, AncientMineActions, MineRoom, RoomType, BattleState, MineThemeType, MineEvent, ShopItem } from '@/types';
import { MINE_THEMES, getBossByTheme, getRandomEnemy, getRandomEvent, getShopItems, generateCritZones } from '@/data/ancientMine';
import { getOreById, getOresByRarity } from '@/data/ores';
import { useGameStore } from './useGameStore';

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getSeasonDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
};

const generateMineMap = (mineType: MineThemeType): MineRoom[] => {
  const theme = MINE_THEMES.find(t => t.id === mineType);
  if (!theme) return [];

  const rooms: MineRoom[] = [];
  const roomCount = 8 + Math.floor(Math.random() * 5);
  const layers = Math.ceil(roomCount / 2);

  const campRoom: MineRoom = {
    id: 'room_camp',
    type: 'camp',
    x: 50,
    y: 50,
    layer: 0,
    connections: [],
    visited: true,
    cleared: true,
    revealed: true,
  };
  rooms.push(campRoom);

  const roomTypes: RoomType[] = ['battle', 'battle', 'battle', 'treasure', 'event', 'event', 'rest'];
  let prevLayerRooms: MineRoom[] = [campRoom];

  for (let layer = 1; layer < layers; layer++) {
    const isLastLayer = layer === layers - 1;
    const count = isLastLayer ? 1 : (Math.random() > 0.5 ? 2 : 1);
    const currentLayerRooms: MineRoom[] = [];

    for (let i = 0; i < count; i++) {
      const type = isLastLayer
        ? 'boss'
        : roomTypes[Math.floor(Math.random() * roomTypes.length)];

      const roomId = `room_${layer}_${i}`;
      const x = count === 1 ? 50 : (i === 0 ? 25 : 75);
      const y = 50 + (layer * 120);

      const room: MineRoom = {
        id: roomId,
        type,
        x,
        y,
        layer,
        connections: [],
        visited: false,
        cleared: false,
        revealed: layer === 1,
      };

      if (type === 'event') {
        room.eventId = getRandomEvent().id;
      }
      if (type === 'battle') {
        const enemy = getRandomEnemy(mineType, theme.difficulty);
        room.enemyId = enemy.id;
      }

      rooms.push(room);
      currentLayerRooms.push(room);
    }

    for (const prevRoom of prevLayerRooms) {
      for (const currRoom of currentLayerRooms) {
        if (!prevRoom.connections.includes(currRoom.id)) {
          prevRoom.connections.push(currRoom.id);
        }
      }
    }

    prevLayerRooms = currentLayerRooms;
  }

  return rooms;
};

const initialState: AncientMineState = {
  tickets: 1,
  todayTicketDate: '',
  bossKills: {},
  bestTime: {},
  seasonScore: 0,
  seasonDate: getSeasonDate(),
  bossPets: [],
  medals: [],
  currentRun: null,
  lastRunResult: null,
};

export const useAncientMineStore = create<AncientMineState & AncientMineActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      getAncientTickets: () => {
        const state = get();
        const today = getTodayString();
        if (state.todayTicketDate !== today) {
          set({
            tickets: state.tickets + 1,
            todayTicketDate: today,
          });
          return state.tickets + 1;
        }
        return state.tickets;
      },

      claimDailyTicket: () => {
        const state = get();
        const today = getTodayString();
        if (state.todayTicketDate === today) {
          return false;
        }
        set({
          tickets: state.tickets + 1,
          todayTicketDate: today,
        });
        return true;
      },

      startAncientRun: (mineType: MineThemeType) => {
        const state = get();
        const theme = MINE_THEMES.find(t => t.id === mineType);
        
        if (!theme) return false;
        if (state.tickets <= 0) return false;

        const level = useGameStore.getState().level;
        if (level < theme.unlockLevel) return false;

        const rooms = generateMineMap(mineType);
        const campRoom = rooms.find(r => r.type === 'camp');
        if (!campRoom) return false;

        const newRun = {
          mineType,
          rooms,
          currentRoomId: campRoom.id,
          hp: 100,
          maxHp: 100,
          ancientFragments: 0,
          attackBonus: 0,
          critBonus: 0,
          shield: 0,
          bombs: 1,
          oresCollected: [] as { oreId: string; count: number }[],
          itemsCollected: [] as { type: string; count: number }[],
          battleState: undefined as BattleState | undefined,
          shopItems: undefined as ShopItem[] | undefined,
          currentEvent: undefined as MineEvent | undefined,
          isFinished: false,
          victory: false,
          startTime: Date.now(),
        };

        set({
          tickets: state.tickets - 1,
          currentRun: newRun,
        });

        return true;
      },

      enterRoom: (roomId: string) => {
        const state = get();
        if (!state.currentRun || state.currentRun.isFinished) return false;

        const currentRoom = state.currentRun.rooms.find(r => r.id === state.currentRun!.currentRoomId);
        if (!currentRoom || !currentRoom.connections.includes(roomId)) return false;

        const targetRoom = state.currentRun.rooms.find(r => r.id === roomId);
        if (!targetRoom || targetRoom.visited) return false;

        const hpCost = targetRoom.type === 'boss' ? 15 : 10;
        let newHp = state.currentRun.hp;
        let newShield = state.currentRun.shield;

        if (newShield > 0) {
          if (newShield >= hpCost) {
            newShield -= hpCost;
          } else {
            newHp = state.currentRun.hp - (hpCost - newShield);
            newShield = 0;
          }
        } else {
          newHp -= hpCost;
        }

        if (newHp <= 0) {
          set((state) => ({
            currentRun: state.currentRun ? {
              ...state.currentRun,
              hp: 0,
              isFinished: true,
              victory: false,
            } : null,
          }));
          return false;
        }

        const newRooms = state.currentRun.rooms.map(room => {
          if (room.id === roomId) {
            return { ...room, visited: true, revealed: true };
          }
          if (targetRoom.connections.includes(room.id) || room.connections.includes(roomId)) {
            return { ...room, revealed: true };
          }
          return room;
        });

        let battleState: BattleState | undefined;
        let currentEvent: MineEvent | undefined;
        let shopItems: ShopItem[] | undefined;

        if (targetRoom.type === 'battle' || targetRoom.type === 'boss') {
          const theme = MINE_THEMES.find(t => t.id === state.currentRun!.mineType);
          const isBoss = targetRoom.type === 'boss';
          
          if (isBoss) {
            const boss = getBossByTheme(state.currentRun!.mineType);
            if (boss) {
              battleState = {
                enemyHp: boss.maxHp,
                enemyMaxHp: boss.maxHp,
                enemyShield: boss.shield,
                playerTurns: 0,
                maxTurns: 8,
                isBoss: true,
                bossSkillCooldown: 2,
                critZones: generateCritZones(300, 400, 4),
                totalDamage: 0,
              };
            }
          } else {
            const enemy = getRandomEnemy(state.currentRun!.mineType, theme?.difficulty || 1);
            battleState = {
              enemyHp: enemy.hp,
              enemyMaxHp: enemy.hp,
              enemyShield: enemy.shield,
              playerTurns: 0,
              maxTurns: 5,
              isBoss: false,
              bossSkillCooldown: 0,
              critZones: generateCritZones(300, 400, 3),
              totalDamage: 0,
            };
          }
        }

        if (targetRoom.type === 'event') {
          currentEvent = getRandomEvent();
        }

        if (targetRoom.type === 'rest') {
          shopItems = getShopItems();
          newHp = Math.min(newHp + 20, state.currentRun.maxHp);
        }

        set((state) => ({
          currentRun: state.currentRun ? {
            ...state.currentRun,
            rooms: newRooms,
            currentRoomId: roomId,
            hp: newHp,
            shield: newShield,
            battleState,
            currentEvent,
            shopItems,
          } : null,
        }));

        return true;
      },

      doBattleTurn: (damage: number, critHit: boolean) => {
        const state = get();
        if (!state.currentRun || !state.currentRun.battleState) {
          return { victory: false, damage: 0 };
        }

        const battle = state.currentRun.battleState;
        const attackBonus = state.currentRun.attackBonus;

        let actualDamage = Math.floor(damage * (1 + attackBonus));
        if (critHit) {
          actualDamage = Math.floor(actualDamage * 2);
        }

        let newShield = battle.enemyShield;
        let newHp = battle.enemyHp;

        if (newShield > 0) {
          if (newShield >= actualDamage) {
            newShield -= actualDamage;
            actualDamage = 0;
          } else {
            actualDamage -= newShield;
            newShield = 0;
          }
        }

        newHp = Math.max(0, newHp - actualDamage);
        const victory = newHp <= 0;

        let newTurns = battle.playerTurns + 1;
        const totalDamage = battle.totalDamage + actualDamage;

        if (victory) {
          const theme = MINE_THEMES.find(t => t.id === state.currentRun!.mineType);
          
          let fragmentReward = battle.isBoss 
            ? (theme?.difficulty || 1) * 100 
            : Math.floor(20 + Math.random() * 30);
          
          let oreReward: { oreId: string; count: number }[] = [];
          if (battle.isBoss) {
            const boss = getBossByTheme(state.currentRun!.mineType);
            if (boss && boss.rewards.ores) {
              oreReward = boss.rewards.ores;
            }
          } else {
            const rarity = Math.random() > 0.7 ? 'rare' : 'normal';
            const ores = getOresByRarity(rarity as any);
            const randomOre = ores[Math.floor(Math.random() * ores.length)];
            oreReward = [{ oreId: randomOre.id, count: 1 }];
          }

          const newOresCollected = [...state.currentRun.oresCollected];
          oreReward.forEach(ore => {
            const existing = newOresCollected.find(o => o.oreId === ore.oreId);
            if (existing) {
              existing.count += ore.count;
            } else {
              newOresCollected.push({ ...ore });
            }
          });

          const newRooms = state.currentRun.rooms.map(r => 
            r.id === state.currentRun!.currentRoomId
              ? { ...r, cleared: true }
              : r
          );

          let newMedals = [...get().medals];
          let newBossKills = { ...get().bossKills };
          let newBestTime = { ...get().bestTime };

          if (battle.isBoss) {
            const boss = getBossByTheme(state.currentRun!.mineType);
            if (boss) {
              newBossKills[boss.id] = (newBossKills[boss.id] || 0) + 1;
              
              const elapsed = Math.floor((Date.now() - state.currentRun!.startTime) / 1000);
              if (!newBestTime[boss.id] || elapsed < newBestTime[boss.id]) {
                newBestTime[boss.id] = elapsed;
              }

              const medalId = `medal_${state.currentRun!.mineType}`;
              if (!newMedals.includes(medalId)) {
                newMedals.push(medalId);
              }
            }
          }

          set((state) => ({
            bossKills: newBossKills,
            bestTime: newBestTime,
            medals: newMedals,
            currentRun: state.currentRun ? {
              ...state.currentRun,
              rooms: newRooms,
              ancientFragments: state.currentRun.ancientFragments + fragmentReward,
              oresCollected: newOresCollected,
              battleState: {
                ...battle,
                enemyHp: 0,
                enemyShield: newShield,
                playerTurns: newTurns,
                totalDamage,
                isVictory: true,
              },
              isFinished: battle.isBoss,
              victory: battle.isBoss,
            } : null,
          }));

          return { victory: true, damage: actualDamage };
        }

        let bossSkillUsed = false;
        let playerHpDamage = 0;

        if (battle.isBoss && battle.bossSkillCooldown <= 0) {
          bossSkillUsed = true;
          playerHpDamage = 10 + Math.floor(Math.random() * 10);
        }

        let playerNewHp = state.currentRun.hp;
        let playerNewShield = state.currentRun.shield;

        if (playerHpDamage > 0) {
          if (playerNewShield > 0) {
            if (playerNewShield >= playerHpDamage) {
              playerNewShield -= playerHpDamage;
            } else {
              playerNewHp -= (playerHpDamage - playerNewShield);
              playerNewShield = 0;
            }
          } else {
            playerNewHp -= playerHpDamage;
          }
        }

        const playerDefeat = playerNewHp <= 0 || newTurns >= battle.maxTurns;

        if (playerDefeat) {
          set((state) => ({
            currentRun: state.currentRun ? {
              ...state.currentRun,
              hp: Math.max(0, playerNewHp),
              shield: playerNewShield,
              isFinished: true,
              victory: false,
              battleState: {
                ...battle,
                enemyHp: newHp,
                enemyShield: newShield,
                playerTurns: newTurns,
                totalDamage,
                isVictory: false,
              },
            } : null,
          }));

          return { victory: false, damage: actualDamage, enemyTurn: bossSkillUsed };
        }

        const newCritZones = generateCritZones(300, 400, battle.isBoss ? 4 : 3);

        set((state) => ({
          currentRun: state.currentRun ? {
            ...state.currentRun,
            hp: playerNewHp,
            shield: playerNewShield,
            battleState: {
              ...battle,
              enemyHp: newHp,
              enemyShield: newShield,
              playerTurns: newTurns,
              bossSkillCooldown: battle.isBoss 
                ? (battle.bossSkillCooldown <= 0 ? 2 : battle.bossSkillCooldown - 1)
                : 0,
              critZones: newCritZones,
              totalDamage,
            },
          } : null,
        }));

        return { victory: false, damage: actualDamage, enemyTurn: bossSkillUsed };
      },

      useBattleBomb: () => {
        const state = get();
        if (!state.currentRun || !state.currentRun.battleState || state.currentRun.bombs <= 0) {
          return 0;
        }

        const battle = state.currentRun.battleState;
        const damage = 80 + state.currentRun.attackBonus * 80;

        let newShield = battle.enemyShield;
        let actualDamage = damage;

        if (newShield > 0) {
          if (newShield >= actualDamage) {
            newShield -= actualDamage;
            actualDamage = 0;
          } else {
            actualDamage -= newShield;
            newShield = 0;
          }
        }

        const newHp = Math.max(0, battle.enemyHp - actualDamage);
        const victory = newHp <= 0;

        set((state) => ({
          currentRun: state.currentRun ? {
            ...state.currentRun,
            bombs: state.currentRun.bombs - 1,
            battleState: state.currentRun.battleState ? {
              ...state.currentRun.battleState,
              enemyHp: newHp,
              enemyShield: newShield,
              totalDamage: state.currentRun.battleState.totalDamage + actualDamage,
              isVictory: victory,
            } : undefined,
            isFinished: victory && state.currentRun.battleState?.isBoss,
            victory: victory && state.currentRun.battleState?.isBoss,
          } : null,
        }));

        return Math.floor(actualDamage);
      },

      makeEventChoice: (choiceId: string) => {
        const state = get();
        if (!state.currentRun || !state.currentRun.currentEvent) {
          return { success: false, message: '没有事件' };
        }

        const event = state.currentRun.currentEvent;
        const choice = event.choices.find(c => c.id === choiceId);
        
        if (!choice) {
          return { success: false, message: '选项不存在' };
        }

        let success = true;
        if (choice.successRate !== undefined) {
          success = Math.random() < choice.successRate;
        }

        let newHp = state.currentRun.hp;
        let newFragments = state.currentRun.ancientFragments;
        let newAttackBonus = state.currentRun.attackBonus;
        let newShield = state.currentRun.shield;
        let newOresCollected = [...state.currentRun.oresCollected];
        let newCollectedItems = [...state.currentRun.itemsCollected];

        if (choice.cost?.hp) {
          newHp -= choice.cost.hp;
        }
        if (choice.cost?.ancientFragments) {
          newFragments -= choice.cost.ancientFragments;
        }

        if (success && choice.reward) {
          if (choice.reward.hp) {
            newHp = Math.min(newHp + choice.reward.hp, state.currentRun.maxHp);
          }
          if (choice.reward.ancientFragments) {
            newFragments += choice.reward.ancientFragments;
          }
          if ((choice.reward as any).attackBonus) {
            newAttackBonus += (choice.reward as any).attackBonus;
          }
          if (choice.reward.ores) {
            choice.reward.ores.forEach(ore => {
              const existing = newOresCollected.find(o => o.oreId === ore.oreId);
              if (existing) {
                existing.count += ore.count;
              } else {
                newOresCollected.push({ ...ore });
              }
            });
          }
          if (choice.reward.items) {
            choice.reward.items.forEach(item => {
              const existing = newCollectedItems.find(i => i.type === item.type);
              if (existing) {
                existing.count += item.count;
              } else {
                newCollectedItems.push({ ...item });
              }
            });
          }
        }

        if (newHp <= 0) {
          set((state) => ({
            currentRun: state.currentRun ? {
              ...state.currentRun,
              hp: 0,
              isFinished: true,
              victory: false,
            } : null,
          }));
          return { success: false, message: '体力耗尽...' };
        }

        const newRooms = state.currentRun.rooms.map(r =>
          r.id === state.currentRun!.currentRoomId
            ? { ...r, cleared: true }
            : r
        );

        set((state) => ({
          currentRun: state.currentRun ? {
            ...state.currentRun,
            hp: newHp,
            ancientFragments: newFragments,
            attackBonus: newAttackBonus,
            shield: newShield,
            oresCollected: newOresCollected,
            itemsCollected: newCollectedItems,
            rooms: newRooms,
            currentEvent: undefined,
          } : null,
        }));

        return {
          success,
          message: success ? '成功！' : '失败了...',
          reward: success ? choice.reward : undefined,
        };
      },

      buyShopItem: (itemId: string) => {
        const state = get();
        if (!state.currentRun || !state.currentRun.shopItems) return false;

        const item = state.currentRun.shopItems.find(i => i.id === itemId);
        if (!item || item.stock <= 0) return false;
        if (state.currentRun.ancientFragments < item.price) return false;

        let newHp = state.currentRun.hp;
        let newAttackBonus = state.currentRun.attackBonus;
        let newCritBonus = state.currentRun.critBonus;
        let newShield = state.currentRun.shield;
        let newBombs = state.currentRun.bombs;

        switch (item.type) {
          case 'heal':
            newHp = Math.min(newHp + item.effect.value, state.currentRun.maxHp);
            break;
          case 'attack':
            newAttackBonus += item.effect.value;
            break;
          case 'precision':
            newCritBonus += item.effect.value;
            break;
          case 'shield':
            newShield += item.effect.value;
            break;
          case 'bomb':
            newBombs += 1;
            break;
        }

        const newShopItems = state.currentRun.shopItems.map(i =>
          i.id === itemId ? { ...i, stock: i.stock - 1 } : i
        );

        set((state) => ({
          currentRun: state.currentRun ? {
            ...state.currentRun,
            ancientFragments: state.currentRun.ancientFragments - item.price,
            hp: newHp,
            attackBonus: newAttackBonus,
            critBonus: newCritBonus,
            shield: newShield,
            bombs: newBombs,
            shopItems: newShopItems,
          } : null,
        }));

        return true;
      },

      finishRun: (victory: boolean) => {
        const state = get();
        if (!state.currentRun) {
          return { ores: [], fragments: { normal: 0, rare: 0, epic: 0, legendary: 0 }, ancientFragments: 0 };
        }

        const run = state.currentRun;

        const fragmentMultiplier = victory ? 1 : 0.5;
        const convertedFragments = Math.floor(run.ancientFragments * fragmentMultiplier / 10);
        const fragments = {
          normal: convertedFragments,
          rare: Math.floor(convertedFragments * 0.3),
          epic: Math.floor(convertedFragments * 0.1),
          legendary: 0,
        };

        run.oresCollected.forEach(ore => {
          const oreData = getOreById(ore.oreId);
          if (oreData) {
            fragments[oreData.rarity] += ore.count;
          }
        });

        const score = run.oresCollected.length * 10 + run.ancientFragments;
        const finalScore = victory ? score * 2 : score;

        const newSeasonScore = state.seasonScore + finalScore;

        const gameStore = useGameStore.getState();
        
        run.oresCollected.forEach(ore => {
          const oreData = getOreById(ore.oreId);
          if (oreData) {
            gameStore.addOre(ore.oreId, ore.count);
          }
        });

        const newMedals: string[] = [];
        if (victory) {
          const medalId = `medal_${run.mineType}`;
          if (!state.medals.includes(medalId)) {
            newMedals.push(medalId);
          }
        }

        const lastRunResult = {
          victory,
          oresCollected: run.oresCollected,
          fragments: Math.floor(run.ancientFragments * (victory ? 1 : 0.5)),
          expGained: victory ? 100 : 30,
          newMedals,
        };

        set((state) => ({
          seasonScore: newSeasonScore,
          currentRun: null,
          lastRunResult,
        }));

        return {
          ores: run.oresCollected,
          fragments,
          ancientFragments: run.ancientFragments,
        };
      },

      abandonRun: () => {
        set({ currentRun: null });
      },

      getMedals: () => {
        return get().medals;
      },
    }),
    {
      name: 'ancient-mine-storage',
    }
  )
);
