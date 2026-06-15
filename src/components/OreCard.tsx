import type { Ore } from '@/types';

interface OreCardProps {
  ore: Ore;
  count?: number;
  isCollected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const rarityColors = {
  normal: 'border-rarity-normal text-rarity-normal',
  rare: 'border-rarity-rare text-rarity-rare',
  epic: 'border-rarity-epic text-rarity-epic',
  legendary: 'border-rarity-legendary text-rarity-legendary',
};

const rarityGlow = {
  normal: '',
  rare: 'glow-rare',
  epic: 'glow-epic',
  legendary: 'glow-legendary',
};

const rarityBg = {
  normal: 'bg-rarity-normal/10',
  rare: 'bg-rarity-rare/10',
  epic: 'bg-rarity-epic/10',
  legendary: 'bg-rarity-legendary/10',
};

const sizeClasses = {
  sm: 'w-14 h-14 text-2xl',
  md: 'w-20 h-20 text-4xl',
  lg: 'w-28 h-28 text-6xl',
};

export const OreCard = ({ ore, count, isCollected = true, size = 'md', onClick }: OreCardProps) => {
  const colorClass = rarityColors[ore.rarity];
  const glowClass = isCollected ? rarityGlow[ore.rarity] : '';
  const bgClass = isCollected ? rarityBg[ore.rarity] : 'bg-gray-800/50';

  return (
    <div
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${bgClass}
        ${colorClass}
        ${glowClass}
        rounded-xl border-2 flex flex-col items-center justify-center
        transition-all duration-300 cursor-pointer
        hover:scale-105 active:scale-95
        ${!isCollected ? 'grayscale opacity-50' : ''}
        relative
      `}
    >
      <span className={`${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'} ${isCollected ? 'ore-float' : ''}`}>
        {isCollected ? ore.emoji : '❓'}
      </span>
      
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-mine-gold text-mine-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
      
      {size !== 'sm' && (
        <span className={`text-xs mt-1 font-medium ${isCollected ? '' : 'text-gray-500'}`}>
          {isCollected ? ore.name : '???'}
        </span>
      )}
    </div>
  );
};
