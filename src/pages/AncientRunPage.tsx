import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAncientMineStore } from '@/store/useAncientMineStore';
import { MINE_THEMES, getBossByTheme, getShopItems } from '@/data/ancientMine';
import { MineMap } from '@/components/MineMap';
import { BattleScratchCard } from '@/components/BattleScratchCard';
import { Heart, Coins, Package, X, ShoppingCart, Check, ArrowLeft } from 'lucide-react';
import type { ShopItem, MineEvent } from '@/types';

export const AncientRunPage = () => {
  const navigate = useNavigate();
  const currentRun = useAncientMineStore((state) => state.currentRun);
  const lastRunResult = useAncientMineStore((state) => state.lastRunResult);
  const enterRoom = useAncientMineStore((state) => state.enterRoom);
  const doBattleTurn = useAncientMineStore((state) => state.doBattleTurn);
  const useBattleBomb = useAncientMineStore((state) => state.useBattleBomb);
  const makeEventChoice = useAncientMineStore((state) => state.makeEventChoice);
  const buyShopItem = useAncientMineStore((state) => state.buyShopItem);
  const finishRun = useAncientMineStore((state) => state.finishRun);
  const abandonRun = useAncientMineStore((state) => state.abandonRun);

  const [showEventModal, setShowEventModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [runFinished, setRunFinished] = useState(false);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);

  const theme = currentRun ? MINE_THEMES.find((t) => t.id === currentRun.mineType) : null;
  const boss = theme ? getBossByTheme(theme.id) : null;

  useEffect(() => {
    if (!currentRun) {
      navigate('/ancient');
    }
  }, [currentRun, navigate]);

  useEffect(() => {
    if (!currentRun) return;

    const currentRoom = currentRun.rooms.find((r) => r.id === currentRun.currentRoomId);
    if (!currentRoom) return;

    if (currentRoom.type === 'event' && currentRun.currentEvent && !currentRoom.cleared) {
      setShowEventModal(true);
    } else if (currentRoom.type === 'rest') {
      if (currentRun.shopItems && currentRun.shopItems.length > 0) {
        setShopItems(currentRun.shopItems);
      } else {
        setShopItems(getShopItems());
      }
    } else if (currentRoom.type === 'treasure' && !currentRoom.cleared) {
      setShowTreasureModal(true);
    }
  }, [currentRun?.currentRoomId]);

  useEffect(() => {
    if (currentRun && currentRun.hp <= 0 && !runFinished) {
      handleDefeat();
    }
  }, [currentRun?.hp]);

  const handleRoomClick = (roomId: string) => {
    if (runFinished) return;
    enterRoom(roomId);
  };

  const handleTurnComplete = (damage: number, critHit: boolean) => {
    const result = doBattleTurn(damage, critHit);
    
    if (result.victory) {
      setTimeout(() => {
        const currentRoom = currentRun?.rooms.find(r => r.id === currentRun?.currentRoomId);
        if (currentRoom?.type === 'boss') {
          handleVictory();
        }
      }, 1500);
    } else if (currentRun?.battleState?.isVictory === false) {
      setTimeout(() => handleDefeat(), 1500);
    }
  };

  const handleUseBomb = () => {
    useBattleBomb();
  };

  const handleEventChoice = (choiceId: string) => {
    makeEventChoice(choiceId);
    setShowEventModal(false);
  };

  const handleBuyItem = (itemId: string) => {
    const success = buyShopItem(itemId);
    if (success) {
      setShopItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, stock: item.stock - 1, purchased: item.stock <= 1 } : item
      ));
    }
  };

  const handleClaimTreasure = () => {
    const currentRoom = currentRun?.rooms.find(r => r.id === currentRun?.currentRoomId);
    if (currentRoom) {
      const newRooms = currentRun!.rooms.map(r => 
        r.id === currentRoom.id ? { ...r, cleared: true } : r
      );
      useAncientMineStore.setState({
        currentRun: currentRun ? { ...currentRun, rooms: newRooms } : null,
      });
    }
    setShowTreasureModal(false);
  };

  const handleVictory = () => {
    finishRun(true);
    setRunFinished(true);
    setShowResultModal(true);
  };

  const handleDefeat = () => {
    finishRun(false);
    setRunFinished(true);
    setShowResultModal(true);
  };

  const handleAbandon = () => {
    if (confirm('确定要放弃本次探索吗？将只保留部分奖励。')) {
      abandonRun();
      navigate('/ancient');
    }
  };

  if (!currentRun || !theme || !boss) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  const currentRoom = currentRun.rooms.find((r) => r.id === currentRun.currentRoomId);
  const hpPercent = (currentRun.hp / 100) * 100;
  const battleState = currentRun.battleState;

  return (
    <div className="min-h-screen pb-4 bg-gradient-to-b from-stone-900 to-stone-950">
      {/* 顶部状态栏 */}
      <div className="sticky top-0 z-20 bg-stone-900/95 backdrop-blur border-b border-stone-700 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleAbandon}
              className="p-1.5 text-gray-400 hover:text-red-400"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <div className="text-mine-gold font-bold">{theme.name}</div>
              <div className="text-xs text-gray-500">远古矿脉探索</div>
            </div>
            <div className="w-8" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-stone-800 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <Heart size={12} className="text-red-400" />
                体力
              </div>
              <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              <div className="text-right text-xs text-white mt-0.5">{currentRun.hp}/100</div>
            </div>

            <div className="bg-stone-800 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <span>💎</span>
                远古碎片
              </div>
              <div className="text-mine-gold font-bold text-lg">
                {currentRun.ancientFragments}
              </div>
            </div>

            <div className="bg-stone-800 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <Package size={12} className="text-blue-400" />
                道具
              </div>
              <div className="text-white font-bold text-lg">
                {currentRun.bombs + currentRun.itemsCollected.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {currentRoom?.type === 'battle' || currentRoom?.type === 'boss' ? (
          <div className="space-y-4">
            <div className="text-center text-gray-400 text-sm">
              {currentRoom.type === 'boss' ? '⚠️ Boss 战 ⚠️' : '战斗房'}
            </div>
            
            {battleState && (
              <BattleScratchCard
                battleState={battleState}
                onTurnComplete={handleTurnComplete}
                themeColor={theme.color}
                enemyEmoji={currentRoom.type === 'boss' ? boss.emoji : '👹'}
                enemyName={currentRoom.type === 'boss' ? boss.name : '矿石守卫'}
                disabled={battleState.isVictory !== undefined}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={handleUseBomb}
                className="flex-1 btn-game py-3 rounded-xl font-bold"
                disabled={!currentRun.bombs || battleState?.isVictory !== undefined}
              >
                💣 炸弹 ({currentRun.bombs})
              </button>
              <button
                onClick={() => setShowShopModal(true)}
                className="flex-1 bg-stone-700 hover:bg-stone-600 text-white py-3 rounded-xl font-bold"
              >
                🎒 背包
              </button>
            </div>
          </div>
        ) : currentRoom?.type === 'rest' ? (
          <div className="space-y-4">
            <div className="card-mine text-center py-8">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-white mb-2">休息营地</h3>
              <p className="text-gray-400 text-sm mb-4">
                你找到了一处安全的营地，可以在这里恢复体力和购买补给
              </p>
              <div className="text-mine-gold text-sm">
                恢复了 20 点体力
              </div>
            </div>

            <div className="card-mine">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <ShoppingCart size={18} />
                商店
              </h4>
              <div className="space-y-2">
                {shopItems.map((item) => {
                  const soldOut = item.stock <= 0;
                  const canAfford = currentRun.ancientFragments >= item.price;
                  
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        soldOut
                          ? 'bg-stone-800/50 opacity-50'
                          : 'bg-stone-800 hover:bg-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <div className="text-white font-medium text-sm">{item.name}</div>
                          <div className="text-gray-400 text-xs">{item.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyItem(item.id)}
                        disabled={soldOut || !canAfford}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                          soldOut
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : canAfford
                            ? 'bg-mine-gold text-stone-900 hover:bg-mine-gold/90'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {soldOut ? (
                          <Check size={16} />
                        ) : (
                          `💎 ${item.price}`
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center text-sm text-gray-400">
              选择地图上的下一个房间继续探索
            </div>
          </div>
        ) : currentRoom?.type === 'camp' ? (
          <div className="space-y-4">
            <div className="card-mine text-center py-8">
              <div className="text-6xl mb-4">🏕️</div>
              <h3 className="text-xl font-bold text-white mb-2">探险营地</h3>
              <p className="text-gray-400 text-sm">
                这是你进入矿脉的起点，准备好了吗？
              </p>
            </div>
            <div className="card-mine">
              <h4 className="text-white font-bold mb-3">🧰 携带道具</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-stone-800 p-2 rounded text-center">
                  <div className="text-2xl">💣</div>
                  <div className="text-xs text-gray-400">炸弹 ×{currentRun.bombs}</div>
                </div>
                {currentRun.itemsCollected.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="bg-stone-800 p-2 rounded text-center">
                    <div className="text-2xl">📦</div>
                    <div className="text-xs text-gray-400">{item.type} ×{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-mine-gold">
              点击地图上的房间开始探索 →
            </div>
          </div>
        ) : (
          <div className="card-mine text-center py-8">
            <div className="text-4xl mb-3">
              {currentRoom?.type === 'treasure' ? '💎' : '❓'}
            </div>
            <div className="text-white">{currentRoom?.cleared ? '已探索' : '探索中...'}</div>
          </div>
        )}

        {/* 地图区域 */}
        <div className="mt-6">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🗺️</span> 矿脉地图
          </h3>
          <div className="card-mine p-3">
            <MineMap
              rooms={currentRun.rooms}
              currentRoomId={currentRun.currentRoomId}
              onRoomClick={handleRoomClick}
              themeColor={theme.color}
            />
          </div>
        </div>
      </div>

      {/* 事件弹窗 */}
      {showEventModal && currentRun.currentEvent && (
        <EventModal
          event={currentRun.currentEvent}
          onChoice={handleEventChoice}
          fragments={currentRun.ancientFragments}
          hp={currentRun.hp}
        />
      )}

      {/* 宝箱弹窗 */}
      {showTreasureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card-mine max-w-sm w-full text-center">
            <div className="text-6xl mb-4 animate-bounce">💎</div>
            <h3 className="text-xl font-bold text-mine-gold mb-2">发现宝箱！</h3>
            <p className="text-gray-300 mb-4">
              你发现了一个古老的宝箱，里面装满了宝藏！
            </p>
            <div className="bg-stone-800 rounded-lg p-4 mb-4">
              <div className="text-mine-gold font-bold">
                +{Math.floor(20 + Math.random() * 30)} 远古碎片
              </div>
              <div className="text-sm text-gray-400 mt-1">
                获得 1 块矿石
              </div>
            </div>
            <button
              onClick={handleClaimTreasure}
              className="btn-gold w-full py-3 rounded-xl font-bold"
            >
              收下宝藏
            </button>
          </div>
        </div>
      )}

      {/* 商店/背包弹窗 */}
      {showShopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card-mine max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">🎒 背包</h3>
              <button
                onClick={() => setShowShopModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              <div className="bg-stone-800 p-3 rounded-lg flex items-center gap-3">
                <span className="text-2xl">💣</span>
                <div className="flex-1">
                  <div className="text-white font-medium">炸弹</div>
                  <div className="text-xs text-gray-400">对敌人造成大量伤害</div>
                </div>
                <div className="text-mine-gold font-bold">×{currentRun.bombs}</div>
              </div>
              {currentRun.itemsCollected.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-stone-800 p-3 rounded-lg flex items-center gap-3"
                >
                  <span className="text-2xl">📦</span>
                  <div className="flex-1">
                    <div className="text-white font-medium">{item.type}</div>
                    <div className="text-xs text-gray-400">收集的道具</div>
                  </div>
                  <div className="text-mine-gold font-bold">×{item.count}</div>
                </div>
              ))}
              {currentRun.itemsCollected.length === 0 && currentRun.bombs === 0 && (
                <div className="text-center text-gray-500 py-8">背包空空如也</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 结算弹窗 */}
      {showResultModal && lastRunResult && (
        <RunResultModal
          victory={lastRunResult.victory}
          onClose={() => navigate('/ancient')}
        />
      )}
    </div>
  );
};

const EventModal = ({
  event,
  onChoice,
  fragments,
  hp,
}: {
  event: MineEvent;
  onChoice: (choiceId: string) => void;
  fragments: number;
  hp: number;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="card-mine max-w-sm w-full">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">{event.emoji}</div>
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <p className="text-gray-300 text-sm">{event.description}</p>
        </div>

        <div className="space-y-2">
          {event.choices.map((choice) => {
            const hpCost = choice.cost?.hp || 0;
            const fragmentCost = choice.cost?.ancientFragments || 0;
            const canAffordHp = hpCost === 0 || hp > hpCost;
            const canAffordFragments = fragmentCost === 0 || fragments >= fragmentCost;
            const canAfford = canAffordHp && canAffordFragments;

            return (
              <button
                key={choice.id}
                onClick={() => canAfford && onChoice(choice.id)}
                disabled={!canAfford}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  canAfford
                    ? 'bg-stone-700 hover:bg-stone-600 text-white'
                    : 'bg-stone-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="font-medium text-sm">{choice.description}</div>
                {!canAfford && (
                  <div className="text-xs text-red-400 mt-1">
                    {!canAffordHp ? '体力不足' : '碎片不足'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RunResultModal = ({
  victory,
  onClose,
}: {
  victory: boolean;
  onClose: () => void;
}) => {
  const lastRunResult = useAncientMineStore((state) => state.lastRunResult);

  const result = lastRunResult || {
    victory,
    oresCollected: [],
    fragments: 0,
    expGained: 0,
    newMedals: [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="card-mine max-w-sm w-full text-center">
        <div className="text-6xl mb-3">{result.victory ? '🏆' : '💀'}</div>
        <h2 className={`text-2xl font-bold mb-2 ${result.victory ? 'text-mine-gold' : 'text-red-400'}`}>
          {result.victory ? '探索成功！' : '探索失败...'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {result.victory ? '恭喜你击败了矿脉守护者！' : '体力耗尽，你被送出了矿脉...'}
        </p>

        <div className="bg-stone-800 rounded-xl p-4 mb-6">
          <h4 className="text-white font-bold mb-3">🎁 获得奖励</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-700 rounded-lg p-2">
              <div className="text-mine-gold font-bold text-lg">{result.fragments}</div>
              <div className="text-xs text-gray-400">远古碎片</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-2">
              <div className="text-mine-gold font-bold text-lg">
                {result.oresCollected.length}
              </div>
              <div className="text-xs text-gray-400">矿石</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-2">
              <div className="text-mine-gold font-bold text-lg">{result.expGained}</div>
              <div className="text-xs text-gray-400">经验</div>
            </div>
            <div className="bg-stone-700 rounded-lg p-2">
              <div className="text-mine-gold font-bold text-lg">{result.newMedals.length}</div>
              <div className="text-xs text-gray-400">新勋章</div>
            </div>
          </div>
        </div>

        {result.newMedals.length > 0 && (
          <div className="mb-6">
            <div className="text-mine-gold font-bold mb-2">🎖️ 获得新勋章</div>
            <div className="flex justify-center gap-2">
              {result.newMedals.map((medal, idx) => (
                <div key={idx} className="text-4xl">🏅</div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="btn-gold w-full py-3 rounded-xl font-bold text-lg"
        >
          返回
        </button>
      </div>
    </div>
  );
};
