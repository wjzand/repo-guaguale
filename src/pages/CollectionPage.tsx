import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { ORES, getAllSeries, SERIES_INFO, getOresBySeries } from '@/data/ores';
import { OreCard } from '@/components/OreCard';
import type { Ore, OreRarity } from '@/types';
import { Grid3X3, Layers, X } from 'lucide-react';

export const CollectionPage = () => {
  const { ores: playerOres, getPlayerOre, getCollectedOreCount, fragments } = useGameStore();
  
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<OreRarity | 'all'>('all');
  const [selectedOre, setSelectedOre] = useState<Ore | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'series'>('grid');

  const collectedCount = getCollectedOreCount();
  const totalOreCount = ORES.length;
  const series = getAllSeries();

  const filteredOres = ORES.filter(ore => {
    if (selectedRarity !== 'all' && ore.rarity !== selectedRarity) return false;
    if (selectedSeries && ore.series !== selectedSeries) return false;
    return true;
  });

  const isOreCollected = (oreId: string) => {
    const playerOre = getPlayerOre(oreId);
    return playerOre && playerOre.count > 0;
  };

  const getOreCount = (oreId: string) => {
    const playerOre = getPlayerOre(oreId);
    return playerOre?.count || 0;
  };

  const getSeriesProgress = (seriesName: string) => {
    const seriesOres = getOresBySeries(seriesName);
    const collected = seriesOres.filter(ore => isOreCollected(ore.id)).length;
    return { collected, total: seriesOres.length };
  };

  const rarityFilters: { value: OreRarity | 'all'; label: string; color: string }[] = [
    { value: 'all', label: '全部', color: 'text-gray-300' },
    { value: 'normal', label: '普通', color: 'text-rarity-normal' },
    { value: 'rare', label: '稀有', color: 'text-rarity-rare' },
    { value: 'epic', label: '史诗', color: 'text-rarity-epic' },
    { value: 'legendary', label: '传说', color: 'text-rarity-legendary' },
  ];

  const rarityText = {
    normal: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };

  return (
    <div className="min-h-screen pb-20 pt-4 px-4">
      <div className="max-w-lg mx-auto">
        {/* 标题和统计 */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-mine-gold text-shadow-gold mb-1">
            💎 矿石图鉴
          </h1>
          <p className="text-gray-400 text-sm">
            已收集 <span className="text-mine-gold font-bold">{collectedCount}</span> / {totalOreCount} 种
          </p>
        </div>

        {/* 收集进度条 */}
        <div className="card-mine mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">收集进度</span>
            <span className="text-mine-gold font-bold">
              {Math.round((collectedCount / totalOreCount) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-mine-bg rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-mine-copper to-mine-gold transition-all duration-500"
              style={{ width: `${(collectedCount / totalOreCount) * 100}%` }}
            />
          </div>
        </div>

        {/* 碎片统计 */}
        <div className="card-mine mb-4">
          <div className="text-mine-gold font-bold mb-2">矿石碎片</div>
          <div className="grid grid-cols-4 gap-2">
            {(['normal', 'rare', 'epic', 'legendary'] as OreRarity[]).map(rarity => (
              <div key={rarity} className="text-center">
                <div className="text-2xl mb-1">
                  {rarity === 'normal' ? '⚪' : rarity === 'rare' ? '🔵' : rarity === 'epic' ? '🟣' : '🟡'}
                </div>
                <div className={`text-xs ${
                  rarity === 'normal' ? 'text-rarity-normal' :
                  rarity === 'rare' ? 'text-rarity-rare' :
                  rarity === 'epic' ? 'text-rarity-epic' : 'text-rarity-legendary'
                }`}>
                  {fragments[rarity]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 视图切换 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === 'grid'
                ? 'bg-mine-gold text-mine-bg'
                : 'bg-mine-card text-gray-300 hover:bg-mine-border/50'
            }`}
          >
            <Grid3X3 size={18} />
            全部矿石
          </button>
          <button
            onClick={() => setViewMode('series')}
            className={`flex-1 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === 'series'
                ? 'bg-mine-gold text-mine-bg'
                : 'bg-mine-card text-gray-300 hover:bg-mine-border-border'
            }`}
          >
            <Layers size={18} />
            系列收集
          </button>
        </div>

        {/* 网格视图 */}
        {viewMode === 'grid' && (
          <>
            {/* 稀有度筛选 */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {rarityFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedRarity(filter.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedRarity === filter.value
                      ? `bg-mine-gold text-mine-bg`
                      : `bg-mine-card ${filter.color} hover:bg-mine-border-border`
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* 矿石网格 */}
            <div className="grid grid-cols-4 gap-3">
              {filteredOres.map(ore => (
                <div key={ore.id} className="flex justify-center">
                  <OreCard
                    ore={ore}
                    count={getOreCount(ore.id)}
                    isCollected={isOreCollected(ore.id)}
                    size="sm"
                    onClick={() => isOreCollected(ore.id) && setSelectedOre(ore)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* 系列视图 */}
        {viewMode === 'series' && (
          <div className="space-y-4">
            {series.map(s => {
              const info = SERIES_INFO[s];
              const { collected, total } = getSeriesProgress(s);
              const isComplete = collected === total;
              const seriesOres = getOresBySeries(s);

              return (
                <div
                  key={s}
                  className={`card-mine cursor-pointer transition-all hover:scale-[1.02] ${
                    isComplete ? 'border-mine-gold glow-gold' : ''
                  }`}
                  onClick={() => setSelectedSeries(selectedSeries === s ? null : s)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {s === 'basic_metal' ? '🔩' :
                         s === 'common_stone' ? '🪨' :
                         s === 'precious_metal' ? '🏅' :
                         s === 'crystal' ? '💎' :
                         s === 'gemstone' ? '💍' :
                         s === 'rare_mineral' ? '⚗️' :
                         s === 'legendary' ? '👑' : '🎉'}
                      </span>
                      <div>
                        <div className={`font-bold ${isComplete ? 'text-mine-gold' : 'text-white'}`}>
                          {info.name}
                        </div>
                        <div className="text-xs text-gray-400">{info.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${isComplete ? 'text-mine-gold' : 'text-gray-300'}`}>
                        {collected}/{total}
                      </div>
                      {isComplete && (
                        <div className="text-xs text-mine-gold">✨ 已集齐</div>
                      )}
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="h-2 bg-mine-bg rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isComplete
                          ? 'bg-gradient-to-r from-mine-gold to-yellow-400'
                          : 'bg-mine-copper'
                      }`}
                      style={{ width: `${(collected / total) * 100}%` }}
                    />
                  </div>

                  {/* 展开的矿石列表 */}
                  {selectedSeries === s && (
                    <div className="grid grid-cols-5 gap-2 pt-2 border-t border-mine-border">
                      {seriesOres.map(ore => (
                        <div key={ore.id} className="flex flex-col items-center">
                          <div className={`text-2xl ${isOreCollected(ore.id) ? '' : 'grayscale opacity-30'}`}>
                            {ore.emoji}
                          </div>
                          <div className={`text-xs mt-1 truncate w-full text-center ${
                            isOreCollected(ore.id) ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {isOreCollected(ore.id) ? ore.name : '???'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 矿石详情弹窗 */}
      {selectedOre && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in"
          onClick={() => setSelectedOre(null)}
        >
          <div
            className="bg-mine-card rounded-2xl p-6 max-w-xs w-full mx-4 border-2 border-mine-border pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOre(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="my-6">
                <OreCard ore={selectedOre} size="lg" />
              </div>

              <h3 className={`text-xl font-bold mb-2 ${
                selectedOre.rarity === 'legendary' ? 'text-rarity-legendary text-shadow-legendary' :
                selectedOre.rarity === 'epic' ? 'text-rarity-epic text-shadow-epic' :
                selectedOre.rarity === 'rare' ? 'text-rarity-rare text-shadow-rare' :
                'text-rarity-normal'
              }`}>
                {selectedOre.name}
              </h3>

              <div className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
                selectedOre.rarity === 'legendary' ? 'bg-rarity-legendary/20 text-rarity-legendary' :
                selectedOre.rarity === 'epic' ? 'bg-rarity-epic/20 text-rarity-epic' :
                selectedOre.rarity === 'rare' ? 'bg-rarity-rare/20 text-rarity-rare' :
                'bg-rarity-normal/20 text-rarity-normal'
              }`}>
                {rarityText[selectedOre.rarity]}
              </div>

              <p className="text-gray-300 text-sm mb-4">
                {selectedOre.description}
              </p>

              <div className="text-sm text-gray-400 space-y-1">
                <div>所属系列: {SERIES_INFO[selectedOre.series]?.name || '未知'}</div>
                <div>
                  拥有数量: <span className="text-mine-gold font-bold">{getOreCount(selectedOre.id)}</span>
                </div>
                {getPlayerOre(selectedOre.id) && (
                  <div>
                    首次获得: <span className="text-mine-gold">
                      {getPlayerOre(selectedOre.id)?.firstObtained}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedOre(null)}
                className="w-full btn-game mt-6"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
