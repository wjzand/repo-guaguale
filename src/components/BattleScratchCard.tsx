import { useRef, useEffect, useState, useCallback } from 'react';
import type { BattleState } from '@/types';

interface BattleScratchCardProps {
  battleState: BattleState;
  onTurnComplete: (damage: number, critHit: boolean) => void;
  themeColor?: string;
  enemyEmoji?: string;
  enemyName?: string;
  disabled?: boolean;
}

export const BattleScratchCard = ({
  battleState,
  onTurnComplete,
  themeColor = '#ff6b35',
  enemyEmoji = '👹',
  enemyName = '守卫',
  disabled = false,
}: BattleScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [damageDone, setDamageDone] = useState(0);
  const [critHit, setCritHit] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const canvasWidth = 320;
  const canvasHeight = 400;

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, '#2d1810');
    gradient.addColorStop(0.5, '#4a2c1a');
    gradient.addColorStop(1, '#2d1810');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      const r = 10 + Math.random() * 30;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    
    battleState.critZones.forEach((zone, index) => {
      if (!zone.hit) {
        const gradient = ctx.createRadialGradient(zone.x, zone.y, 0, zone.x, zone.y, zone.radius);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    const coatGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    coatGradient.addColorStop(0, '#5c3d2e');
    coatGradient.addColorStop(0.5, '#7a5238');
    coatGradient.addColorStop(1, '#5c3d2e');
    ctx.fillStyle = coatGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      const r = 15 + Math.random() * 35;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('刮开攻击', canvasWidth / 2, canvasHeight / 2);

    setDamageDone(0);
    setCritHit(false);
    setScratchProgress(0);
    lastPosRef.current = null;
  }, [battleState.critZones]);

  useEffect(() => {
    initCanvas();
  }, [battleState.playerTurns, initCanvas]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const checkCritHit = (x: number, y: number): boolean => {
    for (let i = 0; i < battleState.critZones.length; i++) {
      const zone = battleState.critZones[i];
      if (zone.hit) continue;
      
      const dx = x - zone.x;
      const dy = y - zone.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= zone.radius) {
        return true;
      }
    }
    return false;
  };

  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = imageData.data;
    let transparentPixels = 0;
    const totalPixels = canvasWidth * canvasHeight;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    return transparentPixels / totalPixels;
  };

  const handleScratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPosRef.current = { x, y };

    const hitCrit = checkCritHit(x, y);
    if (hitCrit) {
      setCritHit(true);
    }

    const progress = calculateProgress();
    setScratchProgress(progress);
    setDamageDone(Math.floor(progress * 100));

    if (progress >= 0.6) {
      const finalDamage = Math.floor(progress * 100);
      const isCrit = critHit || hitCrit;
      setIsScratching(false);
      lastPosRef.current = null;
      setTimeout(() => {
        onTurnComplete(finalDamage, isCrit);
      }, 300);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsScratching(true);
    const coords = getCanvasCoords(e);
    lastPosRef.current = null;
    handleScratch(coords.x, coords.y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching || disabled) return;
    const coords = getCanvasCoords(e);
    handleScratch(coords.x, coords.y);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
    lastPosRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsScratching(true);
    const coords = getCanvasCoords(e);
    lastPosRef.current = null;
    handleScratch(coords.x, coords.y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching || disabled) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    handleScratch(coords.x, coords.y);
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
    lastPosRef.current = null;
  };

  const hpPercent = (battleState.enemyHp / battleState.enemyMaxHp) * 100;
  const shieldPercent = (battleState.enemyShield / (battleState.enemyMaxHp * 0.3)) * 100;
  const turnsLeft = battleState.maxTurns - battleState.playerTurns;

  return (
    <div className="relative">
      <div className="bg-mine-card rounded-xl p-3 mb-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-4xl">{enemyEmoji}</div>
          <div className="flex-1">
            <div className="text-white font-bold">{enemyName}</div>
            <div className="text-xs text-gray-400">
              {battleState.isBoss ? 'Boss' : '普通守卫'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-mine-gold font-bold">{battleState.enemyHp}</div>
            <div className="text-xs text-gray-400">HP</div>
          </div>
        </div>

        <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mb-1">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
            style={{ width: `${hpPercent}%` }}
          />
          {battleState.enemyShield > 0 && (
            <div 
              className="absolute top-0 left-0 h-full bg-blue-400/50 transition-all duration-300"
              style={{ width: `${Math.min(shieldPercent, 100)}%` }}
            />
          )}
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          <span>回合 {battleState.playerTurns + 1}/{battleState.maxTurns}</span>
          <span>{turnsLeft} 回合剩余</span>
        </div>
      </div>

      <div className="relative mx-auto" style={{ width: '100%', maxWidth: canvasWidth }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="w-full rounded-xl cursor-pointer touch-none"
          style={{ aspectRatio: `${canvasWidth}/${canvasHeight}` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <div className="bg-black/50 px-2 py-1 rounded text-xs text-white">
            伤害: {damageDone}
          </div>
          {critHit && (
            <div className="bg-yellow-500/90 px-2 py-1 rounded text-xs text-white font-bold animate-pulse">
              暴击！
            </div>
          )}
        </div>

        {disabled && !battleState.isVictory && battleState.isVictory !== false && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <div className="text-white text-lg">等待中...</div>
          </div>
        )}

        {battleState.isVictory && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="text-5xl mb-2">🎉</div>
              <div className="text-mine-gold text-2xl font-bold">胜利！</div>
              <div className="text-gray-300 text-sm mt-1">总伤害: {battleState.totalDamage}</div>
            </div>
          </div>
        )}

        {battleState.isVictory === false && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="text-5xl mb-2">💀</div>
              <div className="text-red-400 text-2xl font-bold">失败...</div>
              <div className="text-gray-300 text-sm mt-1">总伤害: {battleState.totalDamage}</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-center text-sm text-gray-400">
        刮开60%以上完成攻击 · 金色区域是暴击区（2倍伤害）
      </div>
    </div>
  );
};
