import { useNavigate } from 'react-router-dom';
import { useAncientMineStore } from '@/store/useAncientMineStore';
import { MINE_THEMES } from '@/data/ancientMine';
import { ArrowLeft, Check, Lock } from 'lucide-react';

const MEDAL_INFO: Record<string, { name: string; description: string; icon: string }> = {
  medal_magma: {
    name: '熔岩征服者',
    description: '首次通关岩浆矿脉，击败熔岩守卫',
    icon: '🌋',
  },
  medal_ice: {
    name: '冰霜征服者',
    description: '首次通关冰霜矿脉，击败冰霜巨兽',
    icon: '❄️',
  },
  medal_poison: {
    name: '毒雾征服者',
    description: '首次通关毒气矿脉，击败毒雾蠕虫',
    icon: '☠️',
  },
  medal_crystal: {
    name: '水晶征服者',
    description: '首次通关水晶矿脉，击败水晶龙',
    icon: '💎',
  },
  medal_ancient: {
    name: '远古征服者',
    description: '首次通关远古矿脉，击败远古泰坦',
    icon: '🏛️',
  },
};

export const MedalPage = () => {
  const navigate = useNavigate();
  const { medals } = useAncientMineStore();

  const hasConquerorTitle = medals.length >= MINE_THEMES.length;

  return (
    <div className="min-h-screen pb-8 pt-4 px-4 bg-gradient-to-b from-stone-900 to-stone-950">
      <div className="max-w-lg mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('/ancient')}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-mine-gold">🏅 勋章墙</h1>
        </div>

        {/* 进度 */}
        <div className="card-mine mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">收集进度</span>
            <span className="text-mine-gold font-bold">{medals.length}/{MINE_THEMES.length}</span>
          </div>
          <div className="h-3 bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-mine-copper to-mine-gold transition-all duration-500"
              style={{ width: `${(medals.length / MINE_THEMES.length) * 100}%` }}
            />
          </div>
          {hasConquerorTitle && (
            <div className="mt-3 bg-mine-gold/10 border border-mine-gold/30 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">👑</div>
              <div className="text-mine-gold font-bold text-sm">远古征服者</div>
              <div className="text-gray-400 text-xs">集齐所有矿脉勋章解锁此称号</div>
            </div>
          )}
        </div>

        {/* 勋章列表 */}
        <div className="space-y-3">
          {MINE_THEMES.map((theme) => {
            const medalId = `medal_${theme.id}`;
            const earned = medals.includes(medalId);
            const info = MEDAL_INFO[medalId];

            return (
              <div
                key={theme.id}
                className={`card-mine relative overflow-hidden transition-colors ${
                  earned ? '' : 'opacity-60'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${theme.bgColor} opacity-${
                    earned ? '15' : '5'
                  }`}
                />

                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 ${
                      earned
                        ? `bg-gradient-to-br ${theme.bgColor} glow-gold`
                        : 'bg-stone-800'
                    }`}
                  >
                    {earned ? (
                      <span className="drop-shadow-lg">{info?.icon || '🏅'}</span>
                    ) : (
                      <Lock size={24} className="text-gray-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`font-bold ${earned ? 'text-white' : 'text-gray-500'}`}>
                        {earned ? info?.name || '未知勋章' : '???'}
                      </h3>
                      {earned && (
                        <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[10px]">
                          <Check size={10} className="inline" /> 已获得
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${earned ? 'text-gray-400' : 'text-gray-600'}`}>
                      {earned ? info?.description || '' : `通关${theme.name}后解锁`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        earned ? 'bg-mine-gold/20 text-mine-gold' : 'bg-gray-700/50 text-gray-500'
                      }`}>
                        {theme.name}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {'⭐'.repeat(theme.difficulty)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 称号系统 */}
        <div className="mt-6 card-mine">
          <h3 className="text-mine-gold font-bold mb-3">👑 可获得称号</h3>
          <div className="space-y-2">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              hasConquerorTitle ? 'bg-mine-gold/10 border border-mine-gold/30' : 'bg-stone-800/50'
            }`}>
              <div className="text-3xl">👑</div>
              <div className="flex-1">
                <div className={`font-bold text-sm ${hasConquerorTitle ? 'text-mine-gold' : 'text-gray-500'}`}>
                  远古征服者
                </div>
                <div className="text-xs text-gray-400">集齐全部5枚矿脉勋章</div>
              </div>
              {hasConquerorTitle && (
                <span className="text-green-400 text-sm font-bold">✓</span>
              )}
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-800/50 opacity-50">
              <div className="text-3xl">⚡</div>
              <div className="flex-1">
                <div className="font-bold text-sm text-gray-500">速通大师</div>
                <div className="text-xs text-gray-400">所有Boss均在2分钟内通关</div>
              </div>
              <Lock size={16} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
