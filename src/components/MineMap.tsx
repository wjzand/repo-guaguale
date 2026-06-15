import { useRef, useEffect } from 'react';
import type { MineRoom, RoomType } from '@/types';

interface MineMapProps {
  rooms: MineRoom[];
  currentRoomId: string;
  onRoomClick: (roomId: string) => void;
  themeColor?: string;
}

const roomIcons: Record<RoomType, string> = {
  camp: '🏕️',
  battle: '⚔️',
  treasure: '💎',
  event: '❓',
  rest: '🔥',
  boss: '👹',
  unknown: '❓',
};

const roomLabels: Record<RoomType, string> = {
  camp: '营地',
  battle: '战斗',
  treasure: '宝箱',
  event: '事件',
  rest: '休息',
  boss: 'Boss',
  unknown: '未知',
};

export const MineMap = ({ rooms, currentRoomId, onRoomClick, themeColor = '#ff6b35' }: MineMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasWidth = 340;
  const canvasHeight = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    bgGradient.addColorStop(0, '#1a0f0a');
    bgGradient.addColorStop(1, '#2d1810');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvasWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    const scaleX = canvasWidth / 100;
    const scaleY = canvasHeight / 600;

    rooms.forEach(room => {
      room.connections.forEach(connId => {
        const connRoom = rooms.find(r => r.id === connId);
        if (!connRoom) return;

        const startX = room.x * scaleX;
        const startY = room.y * scaleY;
        const endX = connRoom.x * scaleX;
        const endY = connRoom.y * scaleY;

        const isConnected = room.visited || connRoom.visited;
        const isRevealed = room.revealed && connRoom.revealed;

        if (!isRevealed && !isConnected) return;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        if (isConnected) {
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
        }

        ctx.stroke();
        ctx.setLineDash([]);
      });
    });

    rooms.forEach(room => {
      const x = room.x * scaleX;
      const y = room.y * scaleY;
      const radius = 28;

      if (!room.revealed && !room.visited) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(50, 30, 20, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(100, 70, 50, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText('?', x, y);
        return;
      }

      const isCurrent = room.id === currentRoomId;
      const isCleared = room.cleared;
      const canEnter = rooms.find(r => r.id === currentRoomId)?.connections.includes(room.id);

      const gradient = ctx.createRadialGradient(x, y - 5, 0, x, y, radius);
      
      if (isCurrent) {
        gradient.addColorStop(0, themeColor);
        gradient.addColorStop(1, '#8B4513');
      } else if (isCleared) {
        gradient.addColorStop(0, '#4a5568');
        gradient.addColorStop(1, '#2d3748');
      } else if (canEnter) {
        gradient.addColorStop(0, '#d4a574');
        gradient.addColorStop(1, '#8B4513');
      } else {
        gradient.addColorStop(0, '#5c4033');
        gradient.addColorStop(1, '#3d2817');
      }

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = isCurrent ? '#fff' : isCleared ? '#718096' : '#8B4513';
      ctx.lineWidth = isCurrent ? 3 : 2;
      ctx.stroke();

      if (isCurrent) {
        ctx.shadowColor = themeColor;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, radius - 2, 0, Math.PI * 2);
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      const displayType = room.revealed || room.visited ? room.type : 'unknown';
      const icon = roomIcons[displayType];

      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(icon, x, y);

      if (isCurrent) {
        ctx.beginPath();
        ctx.moveTo(x, y - radius - 10);
        ctx.lineTo(x - 8, y - radius - 20);
        ctx.lineTo(x + 8, y - radius - 20);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      }
    });

  }, [rooms, currentRoomId, themeColor]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const scaleXMap = canvasWidth / 100;
    const scaleYMap = canvasHeight / 600;

    for (const room of rooms) {
      const roomX = room.x * scaleXMap;
      const roomY = room.y * scaleYMap;
      const radius = 30;

      const dx = x - roomX;
      const dy = y - roomY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= radius) {
        const currentRoom = rooms.find(r => r.id === currentRoomId);
        if (currentRoom?.connections.includes(room.id) && !room.visited) {
          onRoomClick(room.id);
        }
        break;
      }
    }
  };

  const currentRoom = rooms.find(r => r.id === currentRoomId);
  const nextRooms = currentRoom?.connections
    .map(id => rooms.find(r => r.id === id))
    .filter(Boolean) as MineRoom[];

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="w-full rounded-xl cursor-pointer"
        style={{ maxHeight: '60vh' }}
        onClick={handleCanvasClick}
      />

      <div className="mt-4 space-y-2">
        <div className="text-sm text-gray-400">
          当前位置：<span className="text-mine-gold">{roomLabels[currentRoom?.type || 'camp']}</span>
        </div>
        
        {nextRooms?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">可前往：</span>
            {nextRooms.map(room => (
              <button
                key={room.id}
                onClick={() => onRoomClick(room.id)}
                disabled={room.visited}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  room.visited
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-mine-gold/20 text-mine-gold hover:bg-mine-gold/30 border border-mine-gold/30'
                }`}
              >
                {roomIcons[room.revealed ? room.type : 'unknown']} {' '}
                {room.revealed ? roomLabels[room.type] : '未知'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">
        <span>🏕️ 营地</span>
        <span>⚔️ 战斗</span>
        <span>💎 宝箱</span>
        <span>❓ 事件</span>
        <span>🔥 休息</span>
        <span>👹 Boss</span>
      </div>
    </div>
  );
};
