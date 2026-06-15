import { useState } from 'react';
import { useAncientMineStore } from '@/store/useAncientMineStore';
import { useGameStore } from '@/store/useGameStore';
import { MINE_THEMES, getBossByTheme } from '@/data/ancientMine';
import { useNavigate } from 'react-router-dom';
import { Ticket, Trophy, Clock, ArrowLeft, Lock, Play } from 'lucide-react';

export const AncientMinePage = () => {
  const navigate = useNavigate();
  const level = useGameStore((state) => state.level);
  const {
    tickets,
    bossKills,
    bestTime,
    medals,
    currentRun,
    claimDailyTicket,
    getAncientTickets,
  } = useAncientMineStore();

  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const dailyClaimed = useAncientMineStore((state) => {
    const today = new Date().toISOString().split('T')[0];
    return state.todayTicketDate === today;
  });

  const handleClaimDaily = () => {
    const success = claimDailyTicket();
    if (success) {
      getAncientTickets();
    }
  };

  const handleStartExplore = (themeId: string) => {
    const theme = MINE_THEMES.find((t) => t.id === themeId);
    if (!theme || level < theme.unlockLevel) return;
    if (tickets <= 0) return;

    if (currentRun) {
      if (confirm('有进行中的探索，继续还是重新开始？') === false) {
        navigate('/ancient/run');
        return;
      }
    }

    const success = useAncientMineStore.getState().startAncientRun(themeId as any);
    if (success) {
      navigate('/ancient/run');
    } else {
      alert('无法开始探索，请检查门票数量');
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  return (
    <div className="min-h-screen pb-8 pt-4 px-4 bg-gradient-to-b from-stone-900 to-stone-950">
      <div className="max-w-lg mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-mine-gold">🏔️ 远古矿脉</h1>
        </div>

        {/* 状态卡片 */}
        <div className="card-mine mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-1">🎫</div>
              <div className="text-mine-gold font-bold text-xl">{tickets}</div>
              <div className="text-gray-400 text-xs">矿脉门票</div>
              {!dailyClaimed && (
                <button
                  onClick={handleClaimDaily}
                  className="mt-2 px-3 py-1 bg-mine-gold/20 text-mine-gold text-xs rounded-full hover:bg-mine-gold/30"
                >
                  领取每日
                </button>
              )}
            </div>
            <div>
              <div className="text-3xl mb-1">🏆</div>
              <div className="text-mine-gold font-bold text-xl">{medals.length}</div>
              <div className="text-gray-400 text-xs">获得勋章</div>
            </div>
            <div>
              <div className="text-3xl mb-1">👹</div>
              <div className="text-mine-gold font-bold text-xl">
                {Object.values(bossKills).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-gray-400 text-xs">Boss击杀</div>
            </div>
          </div>
        </div>

        {/* 继续探索 */}
        {currentRun && (
          <div className="card-mine mb-6 border-mine-gold">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-mine-gold font-bold">有进行中的探索</div>
                <div className="text-sm text-gray-400">
                  {MINE_THEMES.find((t) => t.id === currentRun.mineType)?.name}
                </div>
              </div>
              <button
                onClick={() => navigate('/ancient/run')}
                className="btn-gold px-4 py-2 rounded-lg font-bold"
              >
                继续
              </button>
            </div>
          </div>
        )}

        {/* 矿脉选择 */}
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>🗺️</span> 选择矿脉
        </h2>

        <div className="space-y-3 mb-8">
          {MINE_THEMES.map((theme) => {
            const unlocked = level >= theme.unlockLevel;
            const boss = getBossByTheme(theme.id);
            const kills = bossKills[boss?.id || ''] || 0;
            const best = bestTime[boss?.id || ''];
            const hasMedal = medals.includes(`medal_${theme.id}`);

            return (
              <div
                key={theme.id}
                className={`card-mine relative overflow-hidden ${
                  unlocked ? 'cursor-pointer hover:border-mine-gold' : 'opacity-60'
                }`}
                onClick={() => unlocked && setSelectedTheme(theme.id)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${theme.bgColor} opacity-20`}
                />

                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl bg-gradient-to-br ${theme.bgColor}`}
                  >
                    {unlocked ? theme.emoji : <Lock size={24} className="text-gray-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{theme.name}</h3>
                      {hasMedal && (
                        <span className="text-mine-gold" title="已获得勋章">
                          🏅
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{theme.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Trophy size={12} />
                        击杀 {kills}
                      </span>
                      {best && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          最快 {formatTime(best)}
                        </span>
                      )}
                      <span>难度 {'⭐'.repeat(theme.difficulty)}</span>
                    </div>
                  </div>

                  {unlocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartExplore(theme.id);
                      }}
                      className="btn-game px-4 py-2 rounded-lg font-bold"
                      disabled={tickets <= 0}
                    >
                      <Play size={16} className="inline mr-1" />
                      探索
                    </button>
                  )}
                </div>

                {!unlocked && (
                  <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-gray-400">
                    Lv.{theme.unlockLevel} 解锁
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 规则说明 */}
        <div className="card-mine">
          <h3 className="text-mine-gold font-bold mb-3">📖 玩法说明</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• 消耗门票进入矿脉，在体力耗尽前探索尽量多的房间</li>
            <li>• 战斗房通过刮卡攻击敌人，金色区域是暴击区（2倍伤害）</li>
            <li>• 宝箱房直接获得奖励，事件房需要做出选择</li>
            <li>• 休息房可以恢复体力并购买临时道具</li>
            <li>• 击败最终Boss获得丰厚奖励和勋章</li>
            <li>• 失败会保留部分矿石，远古碎片减半</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
