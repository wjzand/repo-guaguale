import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BottomTabNav } from '@/components/BottomTabNav';
import { MinePage } from '@/pages/MinePage';
import { CollectionPage } from '@/pages/CollectionPage';
import { RankPage } from '@/pages/RankPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AncientMinePage } from '@/pages/AncientMinePage';
import { AncientRunPage } from '@/pages/AncientRunPage';
import { BossCodexPage } from '@/pages/BossCodexPage';
import { MedalPage } from '@/pages/MedalPage';
import { useGameStore } from '@/store/useGameStore';
import { Gift } from 'lucide-react';

const TabNavWrapper = () => {
  const location = useLocation();
  const showTabNav = !location.pathname.startsWith('/ancient');
  return showTabNav ? <BottomTabNav /> : null;
};

function App() {
  const { checkDailyReset, lastLoginDate, addDailyBonus } = useGameStore();
  const [showDailyBonus, setShowDailyBonus] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastLoginDate !== today) {
      checkDailyReset();
      setShowDailyBonus(true);
      addDailyBonus();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-mine-bg">
        <Routes>
          <Route path="/" element={<Navigate to="/mine" replace />} />
          <Route path="/mine" element={<MinePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/rank" element={<RankPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ancient" element={<AncientMinePage />} />
          <Route path="/ancient/run" element={<AncientRunPage />} />
          <Route path="/ancient/boss" element={<BossCodexPage />} />
          <Route path="/ancient/medals" element={<MedalPage />} />
        </Routes>
        
        <TabNavWrapper />
      </div>

      {/* 每日登录奖励弹窗 */}
      {showDailyBonus && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in">
          <div className="bg-mine-card rounded-2xl p-6 max-w-xs w-full mx-4 border-2 border-mine-gold pop-in text-center">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-mine-gold mb-2">每日登录奖励</h3>
            <p className="text-gray-300 mb-4">欢迎回来，矿工！</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-mine-bg rounded-xl p-3">
                <div className="text-2xl mb-1">⛏️</div>
                <div className="text-white font-bold">+5</div>
                <div className="text-xs text-gray-400">挖掘次数</div>
              </div>
              <div className="bg-mine-bg rounded-xl p-3">
                <div className="text-2xl mb-1">✨</div>
                <div className="text-white font-bold">+30</div>
                <div className="text-xs text-gray-400">经验值</div>
              </div>
            </div>
            
            <button
              onClick={() => setShowDailyBonus(false)}
              className="w-full btn-gold py-3 rounded-xl font-bold"
            >
              领取奖励
            </button>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
