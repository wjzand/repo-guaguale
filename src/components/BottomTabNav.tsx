import { NavLink } from 'react-router-dom';
import { Pickaxe, Gem, Trophy, User } from 'lucide-react';

const tabs = [
  { path: '/', label: '矿洞', icon: Pickaxe },
  { path: '/collection', label: '图鉴', icon: Gem },
  { path: '/rank', label: '排行', icon: Trophy },
  { path: '/profile', label: '我的', icon: User },
];

export const BottomTabNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-mine-card border-t-2 border-mine-border z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                isActive
                  ? 'text-mine-gold'
                  : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-mine-gold/20 scale-110' : ''
                }`}>
                  <Icon size={24} />
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-shadow-gold' : ''
                }`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
