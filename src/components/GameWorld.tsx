import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LOCATIONS, NPCS } from '../data/npcs';
import { sound } from '../utils/audio';
import { MessageSquare, Bed, BarChart2, Info } from 'lucide-react';

interface InteractableTarget {
  type: 'npc' | 'bed' | 'terminal' | 'newsstand';
  id?: string;
  name: string;
  label: string;
  x: number;
  y: number;
}

export const GameWorld: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    player,
    movePlayer,
    openDialogue,
    openOverlay,
    endDayAndSleep,
    currentLocationId,
    tutorialHint,
  } = useGameStore(state => ({
    player: state.player,
    movePlayer: state.movePlayer,
    openDialogue: state.openDialogue,
    openOverlay: state.openOverlay,
    endDayAndSleep: state.endDayAndSleep,
    currentLocationId: state.player.currentLocationId,
    tutorialHint: state.tutorialHint,
  }));

  const [nearbyTarget, setNearbyTarget] = useState<InteractableTarget | null>(null);

  // Position and movement state stored in refs for fluid 60fps physics
  const playerPosRef = useRef({ x: player.x, y: player.y, vx: 0, vy: 0, facing: player.facing });
  const keysDownRef = useRef<{ [key: string]: boolean }>({});
  const animFrameRef = useRef<number>(0);
  const stepCountRef = useRef<number>(0);

  // Fixed world dimensions
  const WORLD_WIDTH = 1000;
  const WORLD_HEIGHT = 580;

  // Static interactables (Bed in apartment, Trading terminal in office)
  const INTERACTABLES: InteractableTarget[] = [
    {
      type: 'bed',
      name: 'Your Bed',
      label: 'Sleep / End Day',
      x: 100,
      y: 110,
    },
    {
      type: 'terminal',
      name: 'Apex Trading Terminal',
      label: 'Access Market Terminal',
      x: 510,
      y: 120,
    },
    ...NPCS.map(npc => ({
      type: 'npc' as const,
      id: npc.id,
      name: npc.name,
      label: `Talk to ${npc.name}`,
      x: npc.x,
      y: npc.y,
    })),
  ];

  // Obstacle collision boxes (walls, furniture, boundaries)
  const OBSTACLES = [
    // World outer bounds handled by clamp
    // Apartment furniture
    { x: 50, y: 70, w: 90, h: 70 }, // Bed
    { x: 190, y: 70, w: 90, h: 40 }, // Desk
    // Apex Office furniture
    { x: 420, y: 90, w: 50, h: 30 }, // Maya desk
    { x: 560, y: 90, w: 50, h: 30 }, // Daniel desk
    { x: 480, y: 90, w: 60, h: 40 }, // Player terminal desk
    // Cafe tables
    { x: 90, y: 400, w: 45, h: 45 },
    { x: 190, y: 410, w: 45, h: 45 },
    { x: 70, y: 500, w: 180, h: 35 }, // Counter
    // Exchange monument
    { x: 480, y: 420, w: 60, h: 40 }, // Wall street bull statue
    // Club bar & lounge
    { x: 740, y: 220, w: 200, h: 35 }, // Long bar
    { x: 810, y: 340, w: 60, h: 45 }, // VIP table
  ];

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      keysDownRef.current[e.key.toLowerCase()] = true;

      // Interaction key E or Space
      if (e.key.toLowerCase() === 'e' || e.key === ' ') {
        e.preventDefault();
        triggerNearbyInteraction();
      }

      // Shortcut keys
      if (e.key.toLowerCase() === 'p') {
        openOverlay('phone');
      }
      if (e.key.toLowerCase() === 'm') {
        openOverlay('market');
      }
      if (e.key.toLowerCase() === 'n') {
        openOverlay('news');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyTarget]);

  // Sync prop changes (e.g. waking up in apartment or attending party)
  useEffect(() => {
    playerPosRef.current.x = player.x;
    playerPosRef.current.y = player.y;
    playerPosRef.current.facing = player.facing;
  }, [player.x, player.y, player.facing]);

  const triggerNearbyInteraction = () => {
    if (!nearbyTarget) return;

    if (nearbyTarget.type === 'npc' && nearbyTarget.id) {
      openDialogue(nearbyTarget.id);
    } else if (nearbyTarget.type === 'bed') {
      sound.playNotification();
      endDayAndSleep();
    } else if (nearbyTarget.type === 'terminal') {
      openOverlay('market');
    }
  };

  // Main 60 FPS game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // 1. Process movement inputs
      const speed = 190; // Pixels per second
      let dx = 0;
      let dy = 0;

      const keys = keysDownRef.current;
      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      // Normalize diagonal speed
      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      let newX = playerPosRef.current.x + dx * speed * dt;
      let newY = playerPosRef.current.y + dy * speed * dt;

      // Facing orientation
      let newFacing = playerPosRef.current.facing;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) newFacing = 'right';
        if (dx < 0) newFacing = 'left';
      } else if (Math.abs(dy) > 0) {
        if (dy > 0) newFacing = 'down';
        if (dy < 0) newFacing = 'up';
      }

      // Bounds clamping
      const pRadius = 14;
      newX = Math.max(pRadius + 10, Math.min(WORLD_WIDTH - pRadius - 10, newX));
      newY = Math.max(pRadius + 10, Math.min(WORLD_HEIGHT - pRadius - 10, newY));

      // Obstacle collision check
      for (const obs of OBSTACLES) {
        const closestX = Math.max(obs.x, Math.min(newX, obs.x + obs.w));
        const closestY = Math.max(obs.y, Math.min(newY, obs.y + obs.h));
        const distX = newX - closestX;
        const distY = newY - closestY;
        const distSq = distX * distX + distY * distY;

        if (distSq < pRadius * pRadius) {
          // Push away
          const dist = Math.sqrt(distSq) || 1;
          const overlap = pRadius - dist;
          newX += (distX / dist) * overlap;
          newY += (distY / dist) * overlap;
        }
      }

      // Step animation counter
      if (dx !== 0 || dy !== 0) {
        stepCountRef.current += dt * 10;
      }

      playerPosRef.current.x = newX;
      playerPosRef.current.y = newY;
      playerPosRef.current.facing = newFacing;

      // Check proximity to interactables
      let closest: InteractableTarget | null = null;
      let minDistance = 58; // Proximity threshold

      for (const item of INTERACTABLES) {
        const d = Math.hypot(newX - item.x, newY - item.y);
        if (d < minDistance) {
          minDistance = d;
          closest = item;
        }
      }
      setNearbyTarget(closest);

      // 2. Render Frame
      renderWorld(ctx, newX, newY, newFacing, stepCountRef.current, closest);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    // Periodically update store player position for location detection
    const syncInterval = setInterval(() => {
      movePlayer(
        Math.round(playerPosRef.current.x),
        Math.round(playerPosRef.current.y),
        playerPosRef.current.facing
      );
    }, 200);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(syncInterval);
    };
  }, []);

  // Visual Renderer
  const renderWorld = (
    ctx: CanvasRenderingContext2D,
    px: number,
    py: number,
    facing: string,
    steps: number,
    closestTarget: InteractableTarget | null
  ) => {
    // Background City Street Base (dark tarmac)
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Street Crosswalks and Asphalt Lanes
    ctx.strokeStyle = '#1e2638';
    ctx.lineWidth = 60;
    // Main horizontal avenue
    ctx.beginPath();
    ctx.moveTo(0, 290);
    ctx.lineTo(WORLD_WIDTH, 290);
    ctx.stroke();

    // Main vertical street
    ctx.beginPath();
    ctx.moveTo(330, 0);
    ctx.lineTo(330, WORLD_HEIGHT);
    ctx.stroke();

    // Street center dashed yellow line
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(0, 290);
    ctx.lineTo(710, 290);
    ctx.moveTo(330, 0);
    ctx.lineTo(330, WORLD_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosswalk zebra stripes
    ctx.fillStyle = '#334155';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(305 + i * 10, 260, 6, 60);
    }

    // Streetlamps with warm ambient glow
    const streetLamps = [
      { x: 310, y: 240 },
      { x: 350, y: 340 },
      { x: 670, y: 260 },
      { x: 670, y: 320 },
    ];
    streetLamps.forEach(lamp => {
      const grad = ctx.createRadialGradient(lamp.x, lamp.y, 2, lamp.x, lamp.y, 45);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
      grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y, 45, 0, Math.PI * 2);
      ctx.fill();

      // Post
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(lamp.x - 2, lamp.y - 2, 4, 4);
    });

    // Render All 5 Buildings & Districts
    LOCATIONS.forEach(loc => {
      const { x, y, width, height } = loc.bounds;

      // Building footprint shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(x + 4, y + 4, width, height);

      // Building interior floor
      ctx.fillStyle = loc.color;
      ctx.fillRect(x, y, width, height);

      // Architectural border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Floor grid / tile texture
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let tx = x + 20; tx < x + width; tx += 20) {
        ctx.beginPath();
        ctx.moveTo(tx, y);
        ctx.lineTo(tx, y + height);
        ctx.stroke();
      }
      for (let ty = y + 20; ty < y + height; ty += 20) {
        ctx.beginPath();
        ctx.moveTo(x, ty);
        ctx.lineTo(x + width, ty);
        ctx.stroke();
      }

      // Doorway entrance highlight
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(loc.door.x - 18, loc.door.y - 4, 36, 6);

      // Building Header Title Banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(x + 10, y + 8, width - 20, 26);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 10, y + 8, width - 20, 26);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(loc.name.toUpperCase(), loc.labelX, y + 25);
    });

    // Specific Interior Props:

    // 1. Apartment Interior (Bed & Desk)
    // Bed
    ctx.fillStyle = '#475569'; // Frame
    ctx.fillRect(50, 70, 90, 70);
    ctx.fillStyle = '#0284c7'; // Blanket
    ctx.fillRect(55, 95, 80, 40);
    ctx.fillStyle = '#f8fafc'; // Pillows
    ctx.fillRect(60, 75, 30, 16);
    ctx.fillRect(95, 75, 30, 16);
    // Bed label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono"';
    ctx.fillText('BED [SLEEP]', 95, 120);

    // Apartment Desk
    ctx.fillStyle = '#334155';
    ctx.fillRect(190, 70, 80, 35);
    ctx.fillStyle = '#38bdf8'; // Laptop screen
    ctx.fillRect(220, 75, 20, 14);

    // 2. Apex Capital Office (Desks, Trading Screens)
    // Maya Desk
    ctx.fillStyle = '#334155';
    ctx.fillRect(420, 90, 50, 30);
    ctx.fillStyle = '#22c55e'; // Green screen
    ctx.fillRect(425, 95, 18, 12);
    ctx.fillRect(448, 95, 18, 12);

    // Daniel Desk
    ctx.fillStyle = '#334155';
    ctx.fillRect(560, 90, 50, 30);
    ctx.fillStyle = '#3b82f6'; // Blue research screen
    ctx.fillRect(565, 95, 18, 12);
    ctx.fillRect(588, 95, 18, 12);

    // Executive Trading Terminal (Center)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(480, 90, 60, 38);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(480, 90, 60, 38);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(485, 95, 50, 20);
    ctx.fillStyle = '#10b981';
    ctx.font = '9px "JetBrains Mono"';
    ctx.fillText('TERMINAL', 510, 108);

    // Wall Ticker Ribbon
    ctx.fillStyle = '#020617';
    ctx.fillRect(380, 40, 260, 12);
    ctx.fillStyle = '#10b981';
    ctx.font = '9px "JetBrains Mono"';
    ctx.fillText('▲ CHPX $100.00   ▲ TECH $100.00   ▼ BNKR $100.00', 510, 49);

    // 3. Cafe Props
    // Coffee Counter
    ctx.fillStyle = '#78350f';
    ctx.fillRect(70, 500, 180, 30);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px "JetBrains Mono"';
    ctx.fillText('ESPRESSO BAR', 160, 519);

    // Cafe Tables
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(110, 420, 20, 0, Math.PI * 2);
    ctx.arc(210, 430, 20, 0, Math.PI * 2);
    ctx.fill();

    // 4. Financial District Props (Exchange Plaza & Wall St Bull)
    // Plaza monument
    ctx.fillStyle = '#d97706'; // Bronze Bull
    ctx.beginPath();
    ctx.ellipse(510, 440, 25, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '9px "JetBrains Mono"';
    ctx.fillText('BRONZE BULL', 510, 444);

    // 5. Sovereign Club Props (Lounge bar & sofas)
    ctx.fillStyle = '#831843'; // Velvet Bar
    ctx.fillRect(740, 220, 210, 28);
    ctx.fillStyle = '#f43f5e';
    ctx.font = '10px "JetBrains Mono"';
    ctx.fillText('VIP CHAMPAGNE LOUNGE', 845, 238);

    // VIP sofas
    ctx.fillStyle = '#500724';
    ctx.fillRect(780, 330, 130, 30);

    // Render NPCs
    NPCS.forEach(npc => {
      // NPC Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(npc.x, npc.y + 12, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // NPC Body
      ctx.fillStyle = npc.color;
      ctx.beginPath();
      ctx.arc(npc.x, npc.y, 12, 0, Math.PI * 2);
      ctx.fill();

      // NPC Collar / tie detail
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(npc.x - 4, npc.y - 2);
      ctx.lineTo(npc.x + 4, npc.y - 2);
      ctx.lineTo(npc.x, npc.y + 5);
      ctx.fill();

      // NPC Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(npc.x, npc.y - 5, 7, 0, Math.PI * 2);
      ctx.fill();

      // NPC Overhead Role Tag
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(npc.x - 35, npc.y - 32, 70, 16);
      ctx.strokeStyle = npc.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(npc.x - 35, npc.y - 32, 70, 16);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 9px "Plus Jakarta Sans"';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, npc.x, npc.y - 21);

      // Dialogue indicator bubble ("...")
      const bob = Math.sin(Date.now() / 300) * 2;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(npc.x + 12, npc.y - 14 + bob, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('!', npc.x + 12, npc.y - 11 + bob);
    });

    // Render Player
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking vertical bob
    const walkBob = Math.sin(steps) * 2;

    // Body (Sleek navy suit)
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(px, py + walkBob, 14, 0, Math.PI * 2);
    ctx.fill();

    // White shirt collar & red silk tie
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py + walkBob - 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444'; // Red tie
    ctx.fillRect(px - 1.5, py + walkBob, 3, 7);

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(px, py - 6 + walkBob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hair (black slick)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(px, py - 8 + walkBob, 8, Math.PI, Math.PI * 2);
    ctx.fill();

    // Directional eye glance
    ctx.fillStyle = '#0f172a';
    let eyeOffsetX = 0;
    let eyeOffsetY = 0;
    if (facing === 'left') eyeOffsetX = -2;
    if (facing === 'right') eyeOffsetX = 2;
    if (facing === 'up') eyeOffsetY = -2;
    if (facing === 'down') eyeOffsetY = 2;
    ctx.beginPath();
    ctx.arc(px + eyeOffsetX - 2, py - 6 + walkBob + eyeOffsetY, 1.2, 0, Math.PI * 2);
    ctx.arc(px + eyeOffsetX + 2, py - 6 + walkBob + eyeOffsetY, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Player Founder Badge
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(px - 6, py + 2 + walkBob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Floating Interaction Prompt
    if (closestTarget) {
      const promptY = closestTarget.y - 42;
      const promptX = closestTarget.x;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(promptX - 70, promptY - 14, 140, 24);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(promptX - 70, promptY - 14, 140, 24);

      // Key badge [E]
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(promptX - 64, promptY - 10, 18, 16);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('E', promptX - 55, promptY + 2);

      // Action text
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(closestTarget.label.slice(0, 18), promptX - 42, promptY + 2);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden select-none"
    >
      {/* 2D Canvas Viewport */}
      <div className="relative border-2 border-slate-800 rounded-lg shadow-2xl overflow-hidden bg-slate-900">
        <canvas
          ref={canvasRef}
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          className="block cursor-crosshair"
          onClick={() => {
            if (nearbyTarget) triggerNearbyInteraction();
          }}
        />

        {/* Quick Location Badge Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-100">
            {LOCATIONS.find(l => l.id === currentLocationId)?.name ?? 'Financial District'}
          </span>
        </div>

        {/* Contextual Directional & Control Hints */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-400">
          <span className="text-amber-400 font-mono font-bold">WASD / Arrows:</span> Move
          <span className="mx-1 text-slate-600">|</span>
          <span className="text-sky-400 font-mono font-bold">[E]:</span> Interact
          <span className="mx-1 text-slate-600">|</span>
          <span className="text-emerald-400 font-mono font-bold">[P]:</span> Phone
          <span className="mx-1 text-slate-600">|</span>
          <span className="text-purple-400 font-mono font-bold">[M]:</span> Market
        </div>

        {/* On-screen quick interact button if target is nearby */}
        {nearbyTarget && (
          <button
            onClick={triggerNearbyInteraction}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg border border-sky-300 transition-transform active:scale-95 animate-bounce"
          >
            {nearbyTarget.type === 'bed' ? (
              <Bed className="w-4 h-4" />
            ) : nearbyTarget.type === 'terminal' ? (
              <BarChart2 className="w-4 h-4" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
            <span>Press E: {nearbyTarget.label}</span>
          </button>
        )}
      </div>

      {/* Tutorial / Next Step Guidance Ribbon */}
      <div className="w-full max-w-[1000px] mt-2 px-4 py-1.5 bg-slate-900/95 border border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-300 shadow-md">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="font-semibold text-sky-400">NEXT OBJECTIVE:</span>
          <span className="text-slate-200">{tutorialHint}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openOverlay('phone', 'news')}
            className="text-xs text-amber-400 hover:text-amber-300 font-mono underline"
          >
            Read News Wire
          </button>
          <button
            onClick={() => openOverlay('market')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-mono underline"
          >
            Open Market
          </button>
        </div>
      </div>
    </div>
  );
};
