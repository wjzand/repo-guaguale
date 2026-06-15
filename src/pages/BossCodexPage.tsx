import { useNavigate } from 'react-router-dom';
import { useAncientMineStore } from '@/store/useAncientMineStore';
import { MINE_BOSSES, MINE_THEMES, getMineThemeById } from '@/data/ancientMine';
import { ArrowLeft, Clock, Trophy, Swords, Shield, Heart, Zap } from 'lucide-react';

export const BossCodexPage = () => {
  const navigate = useNavigate();
  const { bossKills, bestTime } = useAncientMineStore();

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
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate('/ancient')}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-mine-gold">👹 Boss 图鉴</h1>
        </div>

        {/* 统计概览 */}
        <div className="card-mine mb-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-stone-800/50 rounded-xl p-3">
              <div className="text-mine-gold font-bold text-xl">{MINE_BOSSES.length}</div>
              <div className="text-gray-400 text-xs">Boss种类</div>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-3">
              <div className="text-mine-gold font-bold text-xl">
                {Object.values(bossKills).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-gray-400 text-xs">总击杀数</div>
            </div>
            <div className="bg-stone-800/50 rounded-xl p-3">
              <div className="text-mine-gold font-bold text-xl">
                {Object.keys(bossKills).length}/{MINE_BOSSES.length}
              </div>
              <div className="text-gray-400 text-xs">已遭遇</div>
            </div>
          </div>
        </div>

        {/* Boss列表 */}
        <div className="space-y-4">
          {MINE_BOSSES.map((boss) => {
            const kills = bossKills[boss.id] || 0;
            const best = bestTime[boss.id];
            const encountered = kills > 0;
            const theme = getMineThemeById(boss.theme);

            return (
              <div
                key={boss.id}
                className={`card-mine relative overflow-hidden ${
                  encountered ? '' : 'opacity-70'
                }`}
              >
                {theme && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${theme.bgColor} opacity-10`}
                  />
                )}

                <div className="relative z-10">
                  {/* Boss头部信息 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shrink-0 ${
                        encountered
                          ? `bg-gradient-to-br ${theme?.bgColor || 'from-stone-700 to-stone-800'}`
                          : 'bg-stone-800'
                      }`}
                    >
                      {encountered ? boss.emoji : '❓'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">
                          {encountered ? boss.name : '???'}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          encountered ? 'bg-red-500/20 text-red-400' : 'bg-gray-600/30 text-gray-500'
                        }`}>
                          {encountered ? '已遭遇' : '未发现'}
                        </span>
                      </div>
                      {encountered && theme && (
                        <div className="text-sm text-gray-400">
                          {theme.name} · 守护者
                        </div>
                      )}
                    </div>
                  </div>

                  {encountered && (
                    <>
                      {/* 属性信息 */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-stone-800/60 rounded-lg p-2 flex items-center gap-2">
                          <Heart size={14} className="text-red-400 shrink-0" />
                          <div>
                            <div className="text-white text-sm font-bold">{boss.maxHp}</div>
                            <div className="text-[10px] text-gray-500">生命值</div>
                          </div>
                        </div>
                        <div className="bg-stone-800/60 rounded-lg p-2 flex items-center gap-2">
                          <Shield size={14} className="text-blue-400 shrink-0" />
                          <div>
                            <div className="text-white text-sm font-bold">{boss.shield}</div>
                            <div className="text-[10px] text-gray-500">护盾</div>
                          </div>
                        </div>
                        <div className="bg-stone-800/60 rounded-lg p-2 flex items-center gap-2">
                          <Zap size={14} className="text-yellow-400 shrink-0" />
                          <div>
                            <div className="text-white text-sm font-bold">{boss.skills.length}</div>
                            <div className="text-[10px] text-gray-500">技能</div>
                          </div>
                        </div>
                      </div>

                      {/* 技能列表 */}
                      <div className="mb-4">
                        <h4 className="text-sm text-mine-gold font-bold mb-2">⚡ 技能</h4>
                        <div className="space-y-1.5">
                          {boss.skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center gap-2 bg-stone-800/40 rounded-lg px-3 py-2"
                            >
                              <span className="text-sm">
                                {skill.effect === 'heal' ? '💚' :
                                 skill.effect === 'shield' ? '🛡️' :
                                 skill.effect === 'obscure' ? '🌫️' :
                                 skill.effect === 'thicken' ? '🧱' : '⚡'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-xs font-medium">{skill.name}</div>
                                <div className="text-gray-500 text-[10px]">{skill.description}</div>
                              </div>
                              <div className="text-gray-500 text-[10px] shrink-0">
                                CD: {skill.cooldown}回合
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 战绩记录 */}
                      <div className="bg-stone-800/40 rounded-xl p-3">
                        <h4 className="text-sm text-mine-gold font-bold mb-2">📊 战绩</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <Trophy size={14} className="text-mine-gold" />
                            <div>
                              <div className="text-white text-sm font-bold">{kills}</div>
                              <div className="text-[10px] text-gray-500">击杀次数</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-blue-400" />
                            <div>
                              <div className="text-white text-sm font-bold">
                                {best ? formatTime(best) : '--'}
                              </div>
                              <div className="text-[10px] text-gray-500">最快通关</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {!encountered && (
                    <div className="text-center py-4">
                      <div className="text-gray-500 text-sm">
                        击败对应矿脉的Boss后解锁图鉴
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
