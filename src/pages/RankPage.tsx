import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { ALL_SERVER_PLAYERS, STEAL_RANKING } from '@/data/friends';
import { getOreById } from '@/data/ores';
import { Trophy, Users, Swords, Crown, Medal, Award } from 'lucide-react';

type TabType = 'friends' | 'server' | 'steal';

export const RankPage = () => {
  const { friends, level, getCollectedOreCount, getTotalOreCount, stolenCount } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('friends');

  const collectedCount = getCollectedOreCount();
  const totalOreCount = getTotalOreCount();

  const tabs = [
    { id: 'friends' as TabType, label: '好友榜', icon: Users },
    { id: 'server' as TabType, label: '全服榜', icon: Trophy },
    { id: 'steal' as TabType, label: '偷矿榜', icon: Swords },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="text-yellow-400" size={20} />;
    if (rank === 2) return <Medal className="text-gray-300" size={20} />;
    if (rank === 3) return <Award className="text-amber-600" size={20} />;
    return <span className="text-gray-500 font-bold">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/30';
    if (rank === 2) return 'bg-gray-400/10 border-gray-400/30';
    if (rank === 3) return 'bg-amber-600/10 border-amber-600/30';
    return 'bg-mine-card border-mine-border';
  };

  // 好友排行榜数据（按矿石总数排序）
  const friendRanking = [...friends]
    .sort((a, b) => b.totalOres - a.totalOres)
    .map((friend, index) => ({
      rank: index + 1,
      id: friend.id,
      name: friend.name,
      avatar: friend.avatar,
      level: friend.level,
      value: friend.totalOres,
      subValue: `收集${friend.totalOres}种`,
    }));

  // 我的排名（模拟）
  const myRank = Math.min(friendRanking.length + 1, 5);
  const myData = {
    rank: myRank,
    name: '我',
    avatar: '⛏️',
    level,
    value: collectedCount,
    subValue: `收集${collectedCount}种`,
    isMe: true,
  };

  // 合并并排序
  const allFriendRanks = [...friendRanking, myData].sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen pb-20 pt-4 px-4">
      <div className="max-w-lg mx-auto">
        {/* 标题 */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-mine-gold text-shadow-gold mb-1">
            🏆 排行榜
          </h1>
          <p className="text-gray-400 text-sm">看看谁是最强矿工！</p>
        </div>

        {/* Tab切换 */}
        <div className="flex bg-mine-card rounded-xl p-1 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                activeTab === tab.id
                  ? 'bg-mine-gold text-mine-bg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 好友榜 */}
        {activeTab === 'friends' && (
          <div className="space-y-2">
            {/* 前三名展示 */}
            <div className="flex justify-center items-end gap-4 mb-6 pt-4">
              {/* 第二名 */}
              <div className="text-center flex-1">
                <div className="w-16 h-16 mx-auto rounded-full bg-mine-card border-4 border-gray-400 flex items-center justify-center text-3xl mb-2">
                  {allFriendRanks[1]?.avatar || '👤'}
                </div>
                <div className="text-white font-medium text-sm truncate">
                  {allFriendRanks[1]?.name || '-'}
                </div>
                <div className="text-mine-gold text-xs">Lv.{allFriendRanks[1]?.level || 0}</div>
                <div className="text-gray-400 text-xs">{allFriendRanks[1]?.value || 0}种</div>
                <div className="mt-2 h-16 bg-gradient-to-t from-gray-400/50 to-gray-400/20 rounded-t-lg flex items-center justify-center">
                  <Medal className="text-gray-300" size={24} />
                </div>
              </div>

              {/* 第一名 */}
              <div className="text-center flex-1 -mt-8">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Crown className="text-yellow-400" size={32} />
                </div>
                <div className="w-20 h-20 mx-auto rounded-full bg-mine-card border-4 border-yellow-400 flex items-center justify-center text-4xl mb-2 glow-gold relative">
                  {allFriendRanks[0]?.avatar || '👤'}
                </div>
                <div className="text-mine-gold font-bold truncate">
                  {allFriendRanks[0]?.name || '-'}
                </div>
                <div className="text-mine-gold text-xs">Lv.{allFriendRanks[0]?.level || 0}</div>
                <div className="text-mine-gold text-xs font-bold">{allFriendRanks[0]?.value || 0}种</div>
                <div className="mt-2 h-24 bg-gradient-to-t from-yellow-500/50 to-yellow-500/20 rounded-t-lg flex items-center justify-center">
                  <Trophy className="text-yellow-400" size={28} />
                </div>
              </div>

              {/* 第三名 */}
              <div className="text-center flex-1">
                <div className="w-16 h-16 mx-auto rounded-full bg-mine-card border-4 border-amber-600 flex items-center justify-center text-3xl mb-2">
                  {allFriendRanks[2]?.avatar || '👤'}
                </div>
                <div className="text-white font-medium text-sm truncate">
                  {allFriendRanks[2]?.name || '-'}
                </div>
                <div className="text-mine-gold text-xs">Lv.{allFriendRanks[2]?.level || 0}</div>
                <div className="text-gray-400 text-xs">{allFriendRanks[2]?.value || 0}种</div>
                <div className="mt-2 h-12 bg-gradient-to-t from-amber-600/50 to-amber-600/20 rounded-t-lg flex items-center justify-center">
                  <Award className="text-amber-600" size={20} />
                </div>
              </div>
            </div>

            {/* 排名列表 */}
            <div className="space-y-2">
              {allFriendRanks.slice(3).map((player, index) => (
                <div
                  key={`rank-${player.rank}-${player.name}`}
                  className={`card-mine flex items-center gap-3 ${
                    'isMe' in player && player.isMe ? 'border-mine-gold' : ''
                  }`}
                >
                  <div className="w-8 text-center">
                    {getRankBadge(player.rank)}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-mine-bg flex items-center justify-center text-2xl">
                    {player.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${
                      'isMe' in player && player.isMe ? 'text-mine-gold' : 'text-white'
                    }`}>
                      {player.name}
                      {'isMe' in player && player.isMe && ' (我)'}
                    </div>
                    <div className="text-xs text-gray-400">Lv.{player.level}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-mine-gold font-bold">{player.value}</div>
                    <div className="text-xs text-gray-400">矿石种类</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 全服榜 */}
        {activeTab === 'server' && (
          <div className="space-y-2">
            {ALL_SERVER_PLAYERS.slice(0, 20).map(player => (
              <div
                key={player.rank}
                className={`card-mine flex items-center gap-3 border ${getRankBg(player.rank)}`}
              >
                <div className="w-8 text-center">
                  {getRankBadge(player.rank)}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-mine-bg flex items-center justify-center text-2xl">
                  {player.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${
                    player.rank <= 3 ? 'text-mine-gold' : 'text-white'
                  }`}>
                    {player.name}
                  </div>
                  <div className="text-xs text-gray-400">Lv.{player.level}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-mine-gold font-bold">{player.totalOres}</div>
                  <div className="text-xs text-gray-400">传说×{player.legendaryCount}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 偷矿榜 */}
        {activeTab === 'steal' && (
          <div className="space-y-2">
            {/* 我的偷矿数据 */}
            <div className="card-mine border-mine-gold mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-mine-gold/20 flex items-center justify-center text-2xl">
                  ⛏️
                </div>
                
                <div className="flex-1">
                  <div className="text-mine-gold font-bold">我的排名</div>
                  <div className="text-xs text-gray-400">偷矿成功 {stolenCount} 次</div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl text-mine-gold font-bold">
                    #{Math.min(stolenCount > 0 ? 5 : 10, 10)}
                  </div>
                </div>
              </div>
            </div>

            {STEAL_RANKING.map(player => (
              <div
                key={player.rank}
                className={`card-mine flex items-center gap-3 border ${getRankBg(player.rank)}`}
              >
                <div className="w-8 text-center">
                  {getRankBadge(player.rank)}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-mine-bg flex items-center justify-center text-2xl">
                  {player.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${
                    player.rank <= 3 ? 'text-mine-gold' : 'text-white'
                  }`}>
                    {player.name}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-mine-gold font-bold">{player.stealCount}</div>
                  <div className="text-xs text-gray-400">偷矿次数</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 底部提示 */}
        <div className="text-center text-gray-500 text-xs mt-6">
          排行榜每周一凌晨0点更新
        </div>
      </div>
    </div>
  );
};
