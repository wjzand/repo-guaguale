import { useRef, useEffect, useState, useCallback } from 'react';
import { Bomb } from 'lucide-react';

interface ScratchCardProps {
  coatColor: string;
  coatPattern?: string;
  layers?: number;
  onScratchComplete: () => void;
  onUseBomb?: () => boolean;
  bombCount?: number;
  revealContent: React.ReactNode;
  disabled?: boolean;
  size?: { width: number; height: number };
}

export const ScratchCard = ({
  coatColor,
  coatPattern = 'rock',
  layers = 1,
  onScratchComplete,
  onUseBomb,
  bombCount = 0,
  revealContent,
  disabled = false,
  size = { width: 300, height: 300 },
}: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [scratchPercent, setScratchPercent] = useState(0);
  const lastPos = useRef({ x: 0, y: 0 });

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = coatColor;
    ctx.fillRect(0, 0, size.width, size.height);

    if (coatPattern === 'gold') {
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * size.width;
        const y = Math.random() * size.height;
        const r = Math.random() * 15 + 5;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    } else if (coatPattern === 'crystal') {
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * size.width;
        const y = Math.random() * size.height;
        const r = Math.random() * 20 + 10;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, 'rgba(147, 112, 219, 0.5)');
        gradient.addColorStop(1, 'rgba(147, 112, 219, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    } else if (coatPattern === 'rock') {
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * size.width;
        const y = Math.random() * size.height;
        const r = Math.random() * 25 + 10;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.random() * 30 + 60}, ${Math.random() * 20 + 30}, ${Math.random() * 15 + 15}, 0.4)`;
        ctx.fill();
      }
    } else if (coatPattern === 'diamond') {
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * size.width;
        const y = Math.random() * size.height;
        const r = Math.random() * 20 + 15;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, 'rgba(65, 105, 225, 0.6)');
        gradient.addColorStop(1, 'rgba(65, 105, 225, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    } else if (coatPattern === 'ancient') {
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * size.width;
        const y = Math.random() * size.height;
        const r = Math.random() * 30 + 20;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, 'rgba(75, 0, 130, 0.5)');
        gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    } else if (coatPattern === 'festival') {
      const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'];
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * size.width;
        const y = Math.random() * size.height;
        const r = Math.random() * 12 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ 刮开挖掘 ✨', size.width / 2, size.height / 2);
  }, [coatColor, coatPattern, size]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas, currentLayer]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

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

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    const gradient = ctx.createRadialGradient(x, y, 10, x, y, 35);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';

    calculateScratchPercent();
  };

  const calculateScratchPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, size.width, size.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparent++;
      }
    }

    const percent = (transparent / (pixels.length / 4)) * 100;
    setScratchPercent(percent);

    if (percent >= 60 && !isComplete) {
      if (currentLayer < layers) {
        setCurrentLayer(prev => prev + 1);
        initCanvas();
        setScratchPercent(0);
      } else {
        setIsComplete(true);
        revealAll();
        onScratchComplete();
      }
    }
  };

  const revealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(0, 0, size.width, size.height);
    ctx.globalCompositeOperation = 'source-over';
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || isComplete) return;
    setIsScratching(true);
    const pos = getPos(e);
    lastPos.current = pos;
    scratch(pos.x, pos.y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching || disabled || isComplete) return;
    e.preventDefault();
    const pos = getPos(e);
    
    const dx = pos.x - lastPos.current.x;
    const dy = pos.y - lastPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(dist / 5));
    
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const x = lastPos.current.x + dx * t;
      const y = lastPos.current.y + dy * t;
      scratch(x, y);
    }
    
    lastPos.current = pos;
  };

  const handleEnd = () => {
    setIsScratching(false);
  };

  const handleBomb = () => {
    if (!onUseBomb || bombCount <= 0 || isComplete) return;
    
    const success = onUseBomb();
    if (success) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const centerX = size.width / 2;
      const centerY = size.height / 2;
      const radius = size.width * 0.3;

      ctx.globalCompositeOperation = 'destination-out';
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const r = radius * (i + 1) / 3;
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.fill();
          
          if (i === 2) {
            calculateScratchPercent();
          }
        }, i * 150);
      }

      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const reset = () => {
    setIsComplete(false);
    setCurrentLayer(1);
    setScratchPercent(0);
    initCanvas();
  };

  return (
    <div className="relative" style={{ width: size.width, height: size.height }}>
      <div className="absolute inset-0 flex items-center justify-center bg-mine-card rounded-2xl overflow-hidden">
        {revealContent}
      </div>

      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        className="absolute inset-0 rounded-2xl cursor-pointer touch-none"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {onUseBomb && !isComplete && (
        <button
          onClick={handleBomb}
          disabled={bombCount <= 0}
          className={`
            absolute bottom-2 right-2 p-2 rounded-full
            flex items-center gap-1
            transition-all duration-200
            ${bombCount > 0 
              ? 'bg-red-500/80 text-white hover:bg-red-500 active:scale-95' 
              : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <Bomb size={20} />
          <span className="text-sm font-bold">x{bombCount}</span>
        </button>
      )}

      {layers > 1 && !isComplete && (
        <div className="absolute top-2 left-2 bg-mine-bg/70 px-2 py-1 rounded-lg text-xs">
          <span className="text-mine-gold font-bold">第 {currentLayer}/{layers} 层</span>
        </div>
      )}

      {!isComplete && (
        <div className="absolute top-2 right-2 bg-mine-bg/70 px-2 py-1 rounded-lg text-xs">
          <span className="text-gray-300">{Math.round(scratchPercent)}%</span>
        </div>
      )}

      {isComplete && (
        <button
          onClick={reset}
          className="absolute bottom-2 left-2 px-3 py-1 bg-mine-gold/80 text-mine-bg text-sm font-bold rounded-lg hover:bg-mine-gold transition-colors"
        >
          重新刮开
        </button>
      )}
    </div>
  );
};
