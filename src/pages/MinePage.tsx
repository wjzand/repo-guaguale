import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { MINES, getMineById } from '@/data/mines';
import { ScratchCard } from '@/components/ScratchCard';
import { OreCard } from '@/components/OreCard';
import type { Ore } from '@/types';
import { ChevronLeft, ChevronRight, Star, Zap, Gift, Play, Share2 } from 'lucide-react';

export const MinePage = () => {
  const {
    level,
    exp,
    currentMine,
    items,
    getCurrentLevelInfo,
    getNextLevelExp,
    getRemainingDigs,
    canDig,
    dig,
    useBomb,
    selectMine,
    getOreById,
    freeDigsUsed,
    videoDigsUsed,
    shareDigsUsed,
  } = useGameStore();

  const [selectedMineIndex, setSelectedMineIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultOre, setResultOre] = useState<Ore | null>(null);
  const [isNewOre, setIsNewOre] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(level);

  const levelInfo = getCurrentLevelInfo();
  const nextLevelExp = getNextLevelExp();
  const currentMineData = getMineById(currentMine);
  const remainingDigs = getRemainingDigs();
  const unlockedMines = MINES.filter(m => m.unlockLevel <= level);

  useEffect(() => {
    const index = MINES.findIndex(m => m.id === currentMine);
    if (index !== -1) {
      setSelectedMineIndex(index);
    }
  }, [currentMine]);

  const handleMineSelect = (mineId: string) => {
    if (selectMine(mineId)) {
      setIsScratching(false);
      setCardKey(prev => prev + 1);
    }
  };

  const prevMine = () => {
    const currentIndex = unlockedMines.findIndex(m => m.id === currentMine);
    if (currentIndex > 0) {
      handleMineSelect(unlockedMines[currentIndex - 1].id);
    }
  };

  const nextMine = () => {
    const currentIndex = unlockedMines.findIndex(m => m.id === currentMine);
    if (currentIndex < unlockedMines.length - 1) {
      handleMineSelect(unlockedMines[currentIndex + 1].id);
    }
  };

  const handleStartDig = () => {
    if (!canDig() || isScratching) return;
    setIsScratching(true);
  };

  const handleScratchComplete = () => {
    if (!isScratching) return;
    
    const result = dig();
    if (result.success && result.ore) {
      setResultOre(result.ore);
      setIsNewOre(result.isNew || false);
      setShowResult(true);
      
      if (level !== useGameStore.getState().level) {
        setNewLevel(useGameStore.getState().level);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
    }
    setIsScratching(false);
  };

  const handleUseBomb = (): boolean => {
    return useBomb();
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResultOre(null);
    setCardKey(prev => prev + 1);
  };

  const handleWatchVideo = () => {
    if (videoDigsUsed < 3) {
      alert('观看视频获得 +3 次挖掘机会！（模拟）');
    }
  };

  const handleShare = () => {
    if (shareDigsUsed < 1) {
      alert('分享成功获得 +1 次挖掘机会！（模拟）');
    }
  };

  const rarityText = {
    normal: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };

  const rarityColor = {
    normal: 'text-rarity-normal',
    rare: 'text-rarity-rare',
    epic: 'text-rarity-epic',
    legendary: 'text-rarity-legendary',
  };

  const rarityBg = {
    normal: 'bg-rarity-normal/20',
    rare: 'bg-rarity-rare/20',
    epic: 'bg-rarity-epic/20',
    legendary: 'bg-rarity-legendary/20',
  };

  const revealContent = resultOre ? (
    <div className="flex flex-col items-center justify-center">
      <div className={`text-8xl mb-4 pop-in ${resultOre.rarity === 'legendary' ? 'animate-bounce' : 'ore-float'}`}>
        {resultOre.emoji}
      </div>
      <div className={`text-xl font-bold ${rarityColor[resultOre.rarity]} ${
        resultOre.rarity === 'legendary' ? 'text-shadow-legendary' :
        resultOre.rarity === 'epic' ? 'text-shadow-epic' :
        resultOre.rarity === 'rare' ? 'text-shadow-rare' : ''
      }`}>
        {resultOre.name}
      </div>
      <div className={`text-sm mt-1 px-3 py-1 rounded-full ${rarityBg[resultOre.rarity]} ${rarityColor[resultOre.rarity]}`}>
        {rarityText[resultOre.rarity]}
      </div>
      {isNewOre && (
        <div className="mt-3 px-4 py-1 bg-mine-gold text-mine-bg text-sm font-bold rounded-full animate-pulse">
          ✨ 新获得！
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center text-gray-500">
      <span className="text-lg">点击下方按钮开始挖掘</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-4 px-4">
      <div className="max-w-lg mx-auto">
        {/* 顶部状态栏 */}
        <div className="card-mine mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⛏️</span>
              <div>
                <div className="text-mine-gold font-bold text-lg">Lv.{level} {levelInfo.title}</div>
                <div className="text-gray-400 text-xs">累计挖掘: {useGameStore.getState().totalDigs}次</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-mine-gold font-bold">
                剩余次数: <span className="text-2xl">{remainingDigs}</span>
              </div>
              <div className="text-gray-400 text-xs">每日免费 {levelInfo.dailyFreeDigs} 次</div>
            </div>
          </div>
          
          {/* 经验条 */}
          <div className="relative h-3 bg-mine-bg rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-mine-copper to-mine-gold transition-all duration-500"
              style={{ width: `${(exp / nextLevelExp) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
              {exp} / {nextLevelExp} EXP
            </div>
          </div>
        </div>

        {/* 矿洞选择器 */}
        <div className="relative mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevMine}
              disabled={unlockedMines.findIndex(m => m.id === currentMine) === 0}
              className="p-2 text-mine-gold disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex-1 flex justify-center">
              {currentMineData && (
                <div 
                  key={currentMineData.id}
                  className="card-mine w-64 text-center cursor-pointer transition-all hover:scale-105"
                  onClick={() => {}}
                >
                  <div className="text-4xl mb-2">{currentMineData.emoji}</div>
                  <div className="text-mine-gold font-bold text-lg">{currentMineData.name}</div>
                  <div className="text-gray-400 text-xs mt-1">{currentMineData.description}</div>
                  {currentMineData.isLimited && (
                    <div className="mt-2 px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full inline-block">
                      🔥 限时矿洞
                    </div>
                  )}
                  {currentMineData.layers > 1 && (
                    <div className="mt-2 text-xs text-mine-copper">
                      多重涂层: {currentMineData.layers}层
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={nextMine}
              disabled={unlockedMines.findIndex(m => m.id === currentMine) === unlockedMines.length - 1}
              className="p-2 text-mine-gold disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* 矿洞指示器 */}
          <div className="flex justify-center gap-1 mt-2">
            {unlockedMines.map((mine) => (
              <button
                key={mine.id}
                onClick={() => handleMineSelect(mine.id)}
                className={`w-2 h-2 rounded-full transition-all ${
                  mine.id === currentMine ? 'bg-mine-gold w-4' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 刮卡区域 */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <ScratchCard
              key={cardKey}
              coatColor={currentMineData?.coatColor || '#8B4513'}
              coatPattern={currentMineData?.coatPattern}
              layers={currentMineData?.layers || 1}
              onScratchComplete={handleScratchComplete}
              onUseBomb={handleUseBomb}
              bombCount={items.bomb}
              revealContent={revealContent}
              disabled={!isScratching}
              size={{ width: 320, height: 320 }}
            />
          </div>
        </div>

        {/* 开始挖掘按钮 */}
        <div className="flex justify-center mb-6">
          {!isScratching ? (
            <button
              onClick={handleStartDig}
              disabled={!canDig()}
              className={`
                px-10 py-4 rounded-xl font-bold text-xl
                transition-all duration-200 transform
                ${canDig()
                  ? 'btn-gold hover:scale-105 active:scale-95'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {canDig() ? '⛏️ 开始挖掘' : '今日次数已用完'}
            </button>
          ) : (
            <div className="px-10 py-4 text-mine-gold font-bold text-xl">
              ✨ 刮开涂层挖掘矿石！
            </div>
          )}
        </div>

        {/* 获取次数途径 */}
        <div className="card-mine">
          <div className="text-mine-gold font-bold mb-3 flex items-center gap-2">
            <Zap size={18} />
            获取更多次数
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleWatchVideo}
              disabled={videoDigsUsed >= 3}
              className={`
                p-3 rounded-xl text-center transition-all
                ${videoDigsUsed < 3
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 active:scale-95'
                  : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Play size={20} className="mx-auto mb-1" />
              <div className="text-xs font-medium">看视频</div>
              <div className="text-xs opacity-70">+3次 ({3 - videoDigsUsed}/3)</div>
            </button>
            
            <button
              onClick={handleShare}
              disabled={shareDigsUsed >= 1}
              className={`
                p-3 rounded-xl text-center transition-all
                ${shareDigsUsed < 1
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 active:scale-95'
                  : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Share2 size={20} className="mx-auto mb-1" />
              <div className="text-xs font-medium">分享</div>
              <div className="text-xs opacity-70">+1次 ({1 - shareDigsUsed}/1)</div>
            </button>
            
            <div className="p-3 rounded-xl text-center bg-purple-500/20 text-purple-400">
              <Gift size={20} className="mx-auto mb-1" />
              <div className="text-xs font-medium">好友赠送</div>
              <div className="text-xs opacity-70">+1次/天</div>
            </div>
          </div>
        </div>

        {/* 今日掉落概率提示 */}
        {currentMineData && (
          <div className="card-mine mt-4">
            <div className="text-mine-gold font-bold mb-3 flex items-center gap-2">
              <Star size={18} />
              掉落概率
            </div>
            <div className="space-y-2">
              {currentMineData.oreProbabilities.map((prob) => (
                <div key={prob.rarity} className="flex items-center gap-3">
                  <span className={`text-sm font-medium w-16 ${rarityColor[prob.rarity]}`}>
                    {rarityText[prob.rarity]}
                  </span>
                  <div className="flex-1 h-2 bg-mine-bg rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        prob.rarity === 'legendary' ? 'bg-rarity-legendary' :
                        prob.rarity === 'epic' ? 'bg-rarity-epic' :
                        prob.rarity === 'rare' ? 'bg-rarity-rare' : 'bg-rarity-normal'
                      }`}
                      style={{ width: `${prob.probability * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs w-12 text-right">
                    {(prob.probability * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 获得矿石弹窗 */}
      {showResult && resultOre && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in"
          onClick={handleCloseResult}
        >
          <div 
            className="bg-mine-card rounded-2xl p-6 max-w-xs w-full mx-4 border-2 border-mine-border pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">
                {isNewOre ? '🎉 恭喜获得新矿石！' : '💎 获得矿石！'}
              </div>
              
              <div className="my-6">
                <OreCard ore={resultOre} size="lg" />
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                {resultOre.description}
              </p>
              
              <button
                onClick={handleCloseResult}
                className="w-full btn-gold"
              >
                继续挖矿
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 升级弹窗 */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in">
          <div className="text-center pop-in">
            <div className="text-6xl mb-4 animate-bounce">🎊</div>
            <div className="text-3xl font-bold text-mine-gold text-shadow-gold mb-2">
              恭喜升级！
            </div>
            <div className="text-xl text-white mb-4">
              达到 <span className="text-mine-gold font-bold">Lv.{newLevel}</span>
            </div>
            <div className="text-gray-400">
              {getCurrentLevelInfo().title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
