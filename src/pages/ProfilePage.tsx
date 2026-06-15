import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { ACHIEVEMENTS } from '@/data/achievements';
import { ORES, getOresByRarity } from '@/data/ores';
import { OreCard } from '@/components/OreCard';
import type { Ore, OreRarity } from '@/types';
import { Settings, Flame, Trophy, Users, Package, X, Gift, Swords, ChevronRight } from 'lucide-react';

type TabType = 'smelt' | 'achievements' | 'friends' | 'items';

export const ProfilePage = () => {
  const {
    level,
    exp,
    items,
    achievements,
    friends,
    ores: playerOres,
    totalDigs,
    totalSynthesized,
    stolenCount,
    getCurrentLevelInfo,
    getNextLevelExp,
    getCollectedOreCount,
    getPlayerOre,
    synthesize,
    canSynthesize,
    stealFromFriend,
    giveGift,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabType>('smelt');
  const [selectedRarity, setSelectedRarity] = useState<OreRarity>('normal');
  const [selectedOres, setSelectedOres] = useState<string[]>([]);
  const [isSmelting, setIsSmelting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultOre, setResultOre] = useState<Ore | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFriendDetail, setShowFriendDetail] = useState<string | null>(null);
  const [showStealResult, setShowStealResult] = useState<{ success: boolean; message: string; ore?: Ore } | null>(null);

  const levelInfo = getCurrentLevelInfo();
  const nextLevelExp = getNextLevelExp();
  const collectedCount = getCollectedOreCount();

  const tabs = [
    { id: 'smelt' as TabType, label: '熔炼炉', icon: Flame },
    { id: 'achievements' as TabType, label: '成就', icon: Trophy },
    { id: 'friends' as TabType, label: '好友', icon: Users },
    { id: 'items' as TabType, label: '道具', icon: Package },
  ];

  const rarityOptions: { value: OreRarity; label: string; color: string }[] = [
    { value: 'normal', label: '普通', color: 'text-rarity-normal' },
    { value: 'rare', label: '稀有', color: 'text-rarity-rare' },
    { value: 'epic', label: '史诗', color: 'text-rarity-epic' },
  ];

  const rarityText = {
    normal: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };

  const availableOres = getOresByRarity(selectedRarity).filter(ore => {
    const playerOre = getPlayerOre(ore.id);
    return playerOre && playerOre.count > 0;
  });

  const handleOreSelect = (oreId: string) => {
    const playerOre = getPlayerOre(oreId);
    if (!playerOre || playerOre.count <= 0) return;

    const selectedCount = selectedOres.filter(id => id === oreId).length;
    if (selectedCount >= playerOre.count) return;

    if (selectedOres.length < 3) {
      setSelectedOres([...selectedOres, oreId]);
    }
  };

  const handleRemoveOre = (index: number) => {
    const newSelected = [...selectedOres];
    newSelected.splice(index, 1);
    setSelectedOres(newSelected);
  };

  const handleSmelt = () => {
    if (selectedOres.length !== 3 || isSmelting) return;
    if (!canSynthesize(selectedRarity)) return;

    setIsSmelting(true);
    
    setTimeout(() => {
      const result = synthesize(selectedOres, false);
      setIsSuccess(result.success);
      setResultOre(result.ore || null);
      setIsSmelting(false);
      setShowResult(true);
      setSelectedOres([]);
    }, 2500);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResultOre(null);
  };

  const handleSteal = (friendId: string) => {
    const result = stealFromFriend(friendId);
    setShowStealResult(result);
    setShowFriendDetail(null);
    setTimeout(() => setShowStealResult(null), 3000);
  };

  const handleGiveGift = (friendId: string) => {
    const normalOres = ORES.filter(ore => ore.rarity === 'normal');
    for (const ore of normalOres) {
      const playerOre = getPlayerOre(ore.id);
      if (playerOre && playerOre.count > 0) {
        giveGift(friendId, ore.id);
        alert(`成功赠送 ${ore.name} 给好友！`);
        return;
      }
    }
    alert('你没有普通矿石可以赠送');
  };

  const getSuccessRate = (rarity: OreRarity) => {
    let rate = rarity === 'normal' ? 1.0 : rarity === 'rare' ? 0.7 : 0.4;
    rate += levelInfo.synthesizeBonus;
    return Math.min(rate, 1) * 100;
  };

  return (
    <div className="min-h-screen pb-20 pt-4 px-4">
      <div className="max-w-lg mx-auto">
        {/* 矿工信息卡片 */}
        <div className="card-mine mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-mine-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mine-copper to-mine-gold flex items-center justify-center text-3xl border-4 border-mine-gold/50">
                ⛏️
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">黄金矿工</h2>
                  <span className="px-2 py-0.5 bg-mine-gold/20 text-mine-gold text-xs rounded-full font-medium">
                    {levelInfo.title}
                  </span>
                </div>
                <div className="text-mine-gold font-bold text-lg">Lv.{level}</div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-white">
                <Settings size={20} />
              </button>
            </div>
            
            {/* 经验条 */}
            <div className="relative h-3 bg-mine-bg rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-mine-copper to-mine-gold transition-all duration-500"
                style={{ width: `${(exp / nextLevelExp) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                {exp} / {nextLevelExp} EXP
              </div>
            </div>
            
            {/* 统计数据 */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-mine-gold font-bold text-lg">{collectedCount}</div>
                <div className="text-gray-400 text-xs">矿石种类</div>
              </div>
              <div>
                <div className="text-mine-gold font-bold text-lg">{totalDigs}</div>
                <div className="text-gray-400 text-xs">累计挖掘</div>
              </div>
              <div>
                <div className="text-mine-gold font-bold text-lg">{totalSynthesized}</div>
                <div className="text-gray-400 text-xs">合成次数</div>
              </div>
              <div>
                <div className="text-mine-gold font-bold text-lg">{achievements.length}</div>
                <div className="text-gray-400 text-xs">成就数</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab切换 */}
        <div className="flex bg-mine-card rounded-xl p-1 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
                activeTab === tab.id
                  ? 'bg-mine-gold text-mine-bg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 熔炼炉 */}
        {activeTab === 'smelt' && (
          <div className="space-y-4">
            {/* 熔炉展示 */}
            <div className="card-mine">
              <div className="text-mine-gold font-bold mb-3 flex items-center gap-2">
                <Flame size={18} />
                熔炼炉
              </div>
              
              {/* 熔炉动画区域 */}
              <div className="relative h-40 bg-mine-bg rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                {isSmelting ? (
                  <div className="text-center">
                    <div className="text-6xl animate-bounce">🔥</div>
                    <div className="text-mine-gold mt-2 animate-pulse">熔炼中...</div>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    {[0, 1, 2].map(index => (
                      <div key={index} className="relative">
                        {selectedOres[index] ? (
                          <div onClick={() => handleRemoveOre(index)} className="cursor-pointer">
                            <OreCard 
                              ore={ORES.find(o => o.id === selectedOres[index])!} 
                              size="md" 
                            />
                            <button 
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                              onClick={(e) => { e.stopPropagation(); handleRemoveOre(index); }}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-mine-border flex items-center justify-center text-gray-500">
                            ?
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="text-2xl text-mine-gold mx-2">→</div>
                    
                    <div className="w-20 h-20 rounded-xl border-2 border-mine-gold/50 flex items-center justify-center bg-mine-gold/10">
                      {showResult && resultOre ? (
                        <span className="text-4xl pop-in">{resultOre.emoji}</span>
                      ) : (
                        <span className="text-2xl text-mine-gold/50">?</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 稀有度选择 */}
              <div className="flex gap-2 mb-3">
                {rarityOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedRarity(option.value);
                      setSelectedOres([]);
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedRarity === option.value
                        ? `bg-${option.value === 'normal' ? 'gray' : option.value === 'rare' ? 'blue' : 'purple'}-500/30 ${option.color} border border-current`
                        : 'bg-mine-bg text-gray-400 hover:bg-mine-border/30'
                    }`}
                  >
                    {option.label}
                    <span className="text-xs ml-1">
                      ({getSuccessRate(option.value).toFixed(0)}%)
                    </span>
                  </button>
                ))}
              </div>
              
              {/* 可用矿石 */}
              <div className="text-sm text-gray-400 mb-2">
                点击添加矿石 (已有 {availableOres.reduce((sum, o) => sum + (getPlayerOre(o.id)?.count || 0), 0)} 个)
              </div>
              
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableOres.map(ore => {
                  const playerOre = getPlayerOre(ore.id);
                  const selectedCount = selectedOres.filter(id => id === ore.id).length;
                  const available = (playerOre?.count || 0) - selectedCount;
                  
                  return (
                    <button
                      key={ore.id}
                      onClick={() => handleOreSelect(ore.id)}
                      disabled={available <= 0 || selectedOres.length >= 3}
                      className={`p-2 rounded-lg border transition-all ${
                        available > 0 && selectedOres.length < 3
                          ? 'border-mine-border hover:border-mine-gold bg-mine-bg hover:bg-mine-card'
                          : 'border-mine-border/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-2xl">{ore.emoji}</div>
                      <div className="text-xs text-gray-400 mt-1">×{available}</div>
                    </button>
                  );
                })}
                
                {availableOres.length === 0 && (
                  <div className="w-full text-center text-gray-500 py-4">
                    暂无该稀有度的矿石
                  </div>
                )}
              </div>
              
              {/* 合成按钮 */}
              <button
                onClick={handleSmelt}
                disabled={selectedOres.length !== 3 || isSmelting || !canSynthesize(selectedRarity)}
                className={`w-full mt-4 py-3 rounded-xl font-bold text-lg transition-all ${
                  selectedOres.length === 3 && canSynthesize(selectedRarity) && !isSmelting
                    ? 'btn-gold'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSmelting ? '🔥 熔炼中...' : selectedOres.length === 3 ? '⚗️ 开始熔炼' : `选择3个${rarityText[selectedRarity]}矿石`}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                3个{rarityText[selectedRarity]}矿石 → 1个{rarityText[
                  selectedRarity === 'normal' ? 'rare' : selectedRarity === 'rare' ? 'epic' : 'legendary'
                ]}矿石
              </p>
            </div>
          </div>
        )}

        {/* 成就 */}
        {activeTab === 'achievements' && (
          <div className="space-y-2">
            {ACHIEVEMENTS.map(achievement => {
              const isUnlocked = achievements.includes(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`card-mine flex items-center gap-3 ${
                    isUnlocked ? 'border-mine-gold' : 'opacity-70'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                    isUnlocked ? 'bg-mine-gold/20' : 'bg-gray-700/50 grayscale'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold ${isUnlocked ? 'text-mine-gold' : 'text-gray-400'}`}>
                      {achievement.name}
                      {isUnlocked && <span className="ml-2 text-xs">✓</span>}
                    </div>
                    <div className="text-xs text-gray-400">{achievement.description}</div>
                    {achievement.reward.exp && (
                      <div className="text-xs text-mine-copper mt-1">
                        奖励: +{achievement.reward.exp} 经验
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 好友 */}
        {activeTab === 'friends' && (
          <div className="space-y-2">
            {friends.map(friend => (
              <div
                key={friend.id}
                className="card-mine flex items-center gap-3 cursor-pointer hover:border-mine-gold transition-colors"
                onClick={() => setShowFriendDetail(friend.id)}
              >
                <div className="w-12 h-12 rounded-full bg-mine-bg flex items-center justify-center text-2xl">
                  {friend.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{friend.name}</div>
                  <div className="text-xs text-gray-400">Lv.{friend.level} · 收集 {friend.totalOres} 种</div>
                </div>
                
                <ChevronRight size={20} className="text-gray-500" />
              </div>
            ))}
          </div>
        )}

        {/* 道具 */}
        {activeTab === 'items' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="card-mine text-center">
              <div className="text-4xl mb-2">💣</div>
              <div className="text-white font-bold">炸弹</div>
              <div className="text-mine-gold font-bold text-2xl mt-1">×{items.bomb}</div>
              <div className="text-xs text-gray-400 mt-1">一次性炸开30%涂层</div>
            </div>
            
            <div className="card-mine text-center">
              <div className="text-4xl mb-2">🧪</div>
              <div className="text-white font-bold">稳定剂</div>
              <div className="text-mine-gold font-bold text-2xl mt-1">×{items.stabilizer}</div>
              <div className="text-xs text-gray-400 mt-1">提升20%合成成功率</div>
            </div>
            
            <div className="col-span-2 card-mine">
              <div className="text-mine-gold font-bold mb-2">获取途径</div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 完成成就获得</li>
                <li>• 升级奖励</li>
                <li>• 活动赠送</li>
                <li>• 每日任务奖励</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 好友详情弹窗 */}
      {showFriendDetail && (() => {
        const friend = friends.find(f => f.id === showFriendDetail);
        if (!friend) return null;
        const recentOre = ORES.find(o => o.id === friend.recentOre);
        
        return (
          <div 
            className="fixed inset-0 bg-black/70 flex items-end z-50 fade-in"
            onClick={() => setShowFriendDetail(null)}
          >
            <div 
              className="bg-mine-card rounded-t-2xl p-6 w-full max-w-lg mx-auto slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-mine-bg flex items-center justify-center text-3xl">
                  {friend.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{friend.name}</h3>
                  <p className="text-mine-gold">Lv.{friend.level}</p>
                  <p className="text-sm text-gray-400">收集 {friend.totalOres} 种矿石</p>
                </div>
              </div>
              
              {recentOre && (
                <div className="card-mine mb-4">
                  <div className="text-sm text-gray-400 mb-2">最近获得</div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{recentOre.emoji}</span>
                    <div>
                      <div className="text-white font-medium">{recentOre.name}</div>
                      <div className={`text-xs ${
                        recentOre.rarity === 'legendary' ? 'text-rarity-legendary' :
                        recentOre.rarity === 'epic' ? 'text-rarity-epic' :
                        recentOre.rarity === 'rare' ? 'text-rarity-rare' : 'text-rarity-normal'
                      }`}>
                        {rarityText[recentOre.rarity]}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSteal(friend.id)}
                  disabled={!friend.canSteal}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    friend.canSteal
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                      : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Swords size={18} className="inline mr-1" />
                  {friend.canSteal ? '偷矿' : '已偷过'}
                </button>
                
                <button
                  onClick={() => handleGiveGift(friend.id)}
                  className="py-3 rounded-xl font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 transition-all"
                >
                  <Gift size={18} className="inline mr-1" />
                  赠送
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                偷矿成功率50%，每日每个好友可偷1次
              </p>
            </div>
          </div>
        );
      })()}

      {/* 熔炼结果弹窗 */}
      {showResult && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in"
          onClick={handleCloseResult}
        >
          <div 
            className="bg-mine-card rounded-2xl p-6 max-w-xs w-full mx-4 border-2 border-mine-border pop-in text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl mb-2">
              {isSuccess ? '🎉 熔炼成功！' : '💔 熔炼失败...'}
            </div>
            
            {resultOre && isSuccess ? (
              <div className="my-6">
                <OreCard ore={resultOre} size="lg" />
                <p className="text-gray-300 text-sm mt-4">{resultOre.description}</p>
              </div>
            ) : (
              <div className="my-6 text-gray-400">
                <div className="text-6xl mb-4">💨</div>
                <p>矿石在熔炼中化为灰烬...</p>
                <p className="text-sm mt-2">损失了2块矿石</p>
              </div>
            )}
            
            <button
              onClick={handleCloseResult}
              className="w-full btn-game"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 偷矿结果提示 */}
      {showStealResult && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pop-in">
          <div className={`px-6 py-4 rounded-xl text-center ${
            showStealResult.success 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
          }`}>
            <div className="text-4xl mb-2">
              {showStealResult.success ? '🎉' : '😅'}
            </div>
            <div className="font-bold">{showStealResult.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};
