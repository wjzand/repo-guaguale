import { useState, useRef, useCallback } from 'react';
import { useAncientMineStore } from '@/store/useAncientMineStore';
import { useGameStore } from '@/store/useGameStore';
import { MINE_THEMES, getBossByTheme } from '@/data/ancientMine';
import { useNavigate } from 'react-router-dom';
import { Ticket, Trophy, Clock, ArrowLeft, Lock, Play, ChevronRight, Share2 } from 'lucide-react';

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
  const [showShareModal, setShowShareModal] = useState(false);

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

  const totalKills = Object.values(bossKills).reduce((a, b) => a + b, 0);
  const totalThemes = MINE_THEMES.filter(t => level >= t.unlockLevel).length;

  return (
    <div className="min-h-screen pb-8 pt-4 px-4 bg-gradient-to-b from-stone-900 to-stone-950">
      <div className="max-w-lg mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-mine-gold">🏔️ 远古矿脉</h1>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 text-gray-400 hover:text-mine-gold transition-colors"
            title="分享战绩"
          >
            <Share2 size={22} />
          </button>
        </div>

        {/* 状态卡片 */}
        <div className="card-mine mb-5">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleClaimDaily}
              className="bg-stone-800/50 rounded-xl p-3 text-center hover:bg-stone-700/50 transition-colors"
            >
              <div className="text-3xl mb-1">🎫</div>
              <div className="text-mine-gold font-bold text-xl">{tickets}</div>
              <div className="text-gray-400 text-xs">门票</div>
              {!dailyClaimed && (
                <div className="mt-1.5 px-2 py-0.5 bg-mine-gold/20 text-mine-gold text-[10px] rounded-full">
                  领取每日
                </div>
              )}
            </button>

            <button
              onClick={() => navigate('/ancient/medals')}
              className="bg-stone-800/50 rounded-xl p-3 text-center hover:bg-stone-700/50 transition-colors"
            >
              <div className="text-3xl mb-1">�</div>
              <div className="text-mine-gold font-bold text-xl">{medals.length}/{MINE_THEMES.length}</div>
              <div className="text-gray-400 text-xs">勋章</div>
              <div className="mt-1.5 flex items-center justify-center text-[10px] text-gray-500">
                查看 <ChevronRight size={10} />
              </div>
            </button>

            <button
              onClick={() => navigate('/ancient/boss')}
              className="bg-stone-800/50 rounded-xl p-3 text-center hover:bg-stone-700/50 transition-colors"
            >
              <div className="text-3xl mb-1">👹</div>
              <div className="text-mine-gold font-bold text-xl">{totalKills}</div>
              <div className="text-gray-400 text-xs">Boss击杀</div>
              <div className="mt-1.5 flex items-center justify-center text-[10px] text-gray-500">
                图鉴 <ChevronRight size={10} />
              </div>
            </button>
          </div>
        </div>

        {/* 继续探索 */}
        {currentRun && (
          <div
            className="card-mine mb-5 cursor-pointer hover:border-mine-gold transition-colors"
            onClick={() => navigate('/ancient/run')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-mine-gold font-bold">⚡ 有进行中的探索</div>
                <div className="text-sm text-gray-400 mt-0.5">
                  {MINE_THEMES.find((t) => t.id === currentRun.mineType)?.name}
                </div>
              </div>
              <div className="btn-gold px-4 py-2 rounded-lg font-bold text-sm">
                继续
              </div>
            </div>
          </div>
        )}

        {/* 矿脉选择 */}
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>🗺️</span> 选择矿脉
          <span className="text-sm font-normal text-gray-500">({totalThemes}/{MINE_THEMES.length} 已解锁)</span>
        </h2>

        <div className="space-y-3 mb-6">
          {MINE_THEMES.map((theme) => {
            const unlocked = level >= theme.unlockLevel;
            const boss = getBossByTheme(theme.id);
            const kills = bossKills[boss?.id || ''] || 0;
            const best = bestTime[boss?.id || ''];
            const hasMedal = medals.includes(`medal_${theme.id}`);

            return (
              <div
                key={theme.id}
                className={`card-mine relative overflow-hidden transition-colors ${
                  unlocked ? 'hover:border-mine-gold/50' : 'opacity-50'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${theme.bgColor} opacity-15`}
                />

                <div className="relative z-10">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-gradient-to-br ${theme.bgColor}`}
                    >
                      {unlocked ? theme.emoji : <Lock size={22} className="text-gray-500" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-bold text-white">{theme.name}</h3>
                        {hasMedal && (
                          <span className="text-mine-gold text-sm" title="已获得勋章">🏅</span>
                        )}
                        <span className="text-xs text-gray-600">{'⭐'.repeat(theme.difficulty)}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{theme.description}</p>
                    </div>

                    {unlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartExplore(theme.id);
                        }}
                        className="btn-game px-3 py-1.5 rounded-lg font-bold text-sm shrink-0"
                        disabled={tickets <= 0}
                      >
                        <Play size={14} className="inline mr-0.5" />
                        探索
                      </button>
                    ) : (
                      <div className="bg-black/40 px-2 py-1 rounded text-[10px] text-gray-400 shrink-0">
                        Lv.{theme.unlockLevel}
                      </div>
                    )}
                  </div>

                  {/* 通关记录 */}
                  {unlocked && (kills > 0 || best) && (
                    <div className="flex items-center gap-4 mt-2.5 ml-[68px] text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/ancient/boss');
                        }}
                        className="flex items-center gap-1 text-gray-400 hover:text-mine-gold transition-colors"
                      >
                        <Trophy size={11} />
                        击杀 {kills}
                      </button>
                      {best && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock size={11} />
                          最快 {formatTime(best)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 规则说明 */}
        <div className="card-mine">
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="text-mine-gold font-bold">📖 玩法说明</h3>
            <ChevronRight
              size={18}
              className={`text-gray-500 transition-transform ${showTutorial ? 'rotate-90' : ''}`}
            />
          </button>
          {showTutorial && (
            <ul className="text-sm text-gray-300 space-y-2 mt-3">
              <li>• 消耗门票进入矿脉，在体力耗尽前探索尽量多的房间</li>
              <li>• 战斗房通过刮卡攻击敌人，金色区域是暴击区（2倍伤害）</li>
              <li>• 宝箱房直接获得奖励，事件房需要做出选择</li>
              <li>• 休息房可以恢复体力并购买临时道具</li>
              <li>• 击败最终Boss获得丰厚奖励和勋章</li>
              <li>• 失败会保留部分矿石，远古碎片减半</li>
            </ul>
          )}
        </div>
      </div>

      {/* 分享弹窗 */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

const ShareModal = ({ onClose }: { onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { bossKills, bestTime, medals, seasonScore } = useAncientMineStore();
  const level = useGameStore((state) => state.level);
  const [imageGenerated, setImageGenerated] = useState(false);

  const totalKills = Object.values(bossKills).reduce((a, b) => a + b, 0);

  const generateShareImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 600;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1a0f0a');
    bg.addColorStop(1, '#2d1810');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(184, 115, 51, 0.1)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 20 + Math.random() * 40, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏔️ 远古矿脉战绩', w / 2, 50);

    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.fillRect(40, 65, w - 80, 2);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(`矿工等级 Lv.${level}`, w / 2, 95);

    const stats = [
      { label: 'Boss击杀', value: totalKills.toString(), emoji: '👹' },
      { label: '勋章收集', value: `${medals.length}/${MINE_THEMES.length}`, emoji: '🏅' },
      { label: '赛季积分', value: seasonScore.toString(), emoji: '🏆' },
    ];

    const boxWidth = (w - 120) / 3;
    stats.forEach((stat, i) => {
      const x = 60 + i * (boxWidth + 15);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.roundRect(x, 120, boxWidth, 90, 12);
      ctx.fill();

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stat.emoji, x + boxWidth / 2, 155);

      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(stat.value, x + boxWidth / 2, 185);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '12px sans-serif';
      ctx.fillText(stat.label, x + boxWidth / 2, 202);
    });

    if (Object.keys(bossKills).length > 0) {
      ctx.fillStyle = '#DAA520';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('⚔️ 击杀记录', 60, 250);

      let y = 275;
      ctx.font = '14px sans-serif';
      Object.entries(bossKills).forEach(([bossId, kills]) => {
        const boss = MINE_THEMES.find(t => t.bossId === bossId);
        if (boss) {
          ctx.fillStyle = '#D4A574';
          ctx.fillText(`${boss.emoji} ${boss.name}  ×${kills}`, 80, y);

          const best = bestTime[bossId];
          if (best) {
            const mins = Math.floor(best / 60);
            const secs = best % 60;
            ctx.fillStyle = '#9CA3AF';
            ctx.textAlign = 'right';
            ctx.fillText(`最快 ${mins}分${secs}秒`, w - 80, y);
            ctx.textAlign = 'left';
          }
          y += 24;
        }
      });
    }

    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.fillRect(40, h - 55, w - 80, 2);

    ctx.fillStyle = '#6B7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('黄金矿工大冒险 · 远古矿脉', w / 2, h - 25);

    setImageGenerated(true);
  }, [bossKills, bestTime, medals, seasonScore, level, totalKills]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `远古矿脉战绩_${new Date().toLocaleDateString()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyShare = () => {
    const text = `🏔️ 远古矿脉战绩\n👷 矿工等级: Lv.${level}\n👹 Boss击杀: ${totalKills}\n🏅 勋章收集: ${medals.length}/${MINE_THEMES.length}\n🏆 赛季积分: ${seasonScore}\n\n来自「黄金矿工大冒险」`;
    navigator.clipboard?.writeText(text).then(() => {
      alert('战绩已复制到剪贴板！');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="card-mine max-w-sm w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 size={18} />
            分享战绩
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">✕</button>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full rounded-xl mb-4"
          style={{ display: 'block' }}
        />

        {!imageGenerated && (
          <button
            onClick={generateShareImage}
            className="w-full btn-game py-3 rounded-xl font-bold mb-3"
          >
            生成战绩图
          </button>
        )}

        {imageGenerated && (
          <div className="space-y-2">
            <button
              onClick={handleDownload}
              className="w-full btn-gold py-3 rounded-xl font-bold"
            >
              📥 保存战绩图
            </button>
            <button
              onClick={handleCopyShare}
              className="w-full bg-stone-700 hover:bg-stone-600 text-white py-3 rounded-xl font-bold transition-colors"
            >
              📋 复制战绩文字
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
