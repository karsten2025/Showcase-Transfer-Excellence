import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDataStore } from '../store/useDataStore';

const AGENT_COUNT = 40;
const LANE_COUNT = 5;
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 200;
const AGENT_RADIUS = 6;
const STAGGER_DELAY = 0.15;

const LANE_Y = [40, 70, 100, 130, 160];
const START_X = 50;
const END_X = 750;
const HAERTEFALL_END_Y = 20;
const TRANSFER_DAUER_JAHRE = 2;

type AgentType = 'haertefall_from_start' | 'never_crosses' | 'switcher';

interface Agent {
  id: number;
  lane: number;
  startAge: number;
  delay: number;
  type: AgentType;
  progressThreshold: number;
}

const SOURCE_LABELS = {
  STEEL: 'MONTAN-STAHL',
  AUTOMOTIVE: 'AUTOMOTIVE / MODERN',
} as const;

const AGENT_COLORS = {
  STEEL: '#1e293b',
  AUTOMOTIVE: '#0891b2',
} as const;

export const TransformationSim: React.FC = () => {
  const haertefallAlter = useDataStore((s) => s.haertefallAlter);
  const speedProfiling = useDataStore((s) => s.speedProfiling);
  const setSpeedProfiling = useDataStore((s) => s.setSpeedProfiling);
  const activeProfile = useDataStore((s) => s.activeProfile);

  const agents = useMemo(() => {
    const result: Agent[] = [];
    for (let i = 0; i < AGENT_COUNT; i++) {
      const startAge = 55 + Math.random() * 9;
      const progressThreshold = (haertefallAlter - startAge) / TRANSFER_DAUER_JAHRE;
      let type: AgentType;
      let clampedThreshold = progressThreshold;
      if (progressThreshold <= 0) {
        type = 'haertefall_from_start';
        clampedThreshold = 0;
      } else if (progressThreshold >= 1) {
        type = 'never_crosses';
        clampedThreshold = 1;
      } else {
        type = 'switcher';
      }
      result.push({
        id: i,
        lane: i % LANE_COUNT,
        startAge,
        delay: i * STAGGER_DELAY,
        type,
        progressThreshold: clampedThreshold,
      });
    }
    return result;
  }, [haertefallAlter]);

  const duration = 8 / (speedProfiling + 0.2);

  const activeCount = agents.filter((a) => a.type !== 'haertefall_from_start').length;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-800 tracking-tight uppercase text-sm">
            Systemische Navigation: Agenten-Fluss
          </h3>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            MODELL: ABM-LIGHT V1.0
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">Speed</label>
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              value={speedProfiling}
              onChange={(e) => setSpeedProfiling(parseFloat(e.target.value))}
              className="w-20 accent-slate-600"
            />
          </div>
          <div className="font-mono text-sm text-slate-600">
            <span className="tabular-nums">{speedProfiling.toFixed(1)}×</span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="tabular-nums">{activeCount} aktiv</span>
          </div>
        </div>
      </div>

      {/* Simulations-Container */}
      <div className="relative h-52 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
        {/* Dezentes Hintergrund-Gitter */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <svg
          className="w-full h-full relative z-10"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Labels - font-bold, uppercase, größer für Dashboard-Grid */}
          <text
            x="20"
            y="28"
            fill="#1e293b"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            {SOURCE_LABELS[activeProfile]}
          </text>
          <text
            x={VIEW_WIDTH - 140}
            y="28"
            fill="#1e293b"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            NEUER JOB
          </text>
          <text
            x={VIEW_WIDTH / 2 - 65}
            y="20"
            fill="#b45309"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            RÜCKZUG (GOLD)
          </text>

          {/* Ankerpunkte */}
          <rect x="0" y="35" width="3" height="130" fill="#e2e8f0" rx="1" />
          <rect x={VIEW_WIDTH - 3} y="35" width="3" height="130" fill="#10b981" rx="1" />

          {/* Agenten – Alterungs-Logik: currentAge = startAge + progress * transferDauer */}
          {agents.map((agent) => {
            const y = LANE_Y[agent.lane];
            const grayColor = AGENT_COLORS[activeProfile];
            const goldColor = '#f59e0b';
            const crossX = START_X + (END_X - START_X) * agent.progressThreshold;

            if (agent.type === 'haertefall_from_start') {
              return (
                <motion.g key={agent.id}>
                  <title>Status: Härtefall (Startalter ≥ {haertefallAlter})</title>
                  <motion.circle
                    r={AGENT_RADIUS}
                    fill={goldColor}
                    stroke="white"
                    strokeWidth={2}
                    initial={{ cx: START_X, cy: y, opacity: 0 }}
                    animate={{
                      cx: START_X,
                      cy: [y, HAERTEFALL_END_Y],
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      duration: duration * 0.6,
                      repeat: Infinity,
                      repeatDelay: 0.3,
                      delay: agent.delay,
                      ease: 'linear',
                    }}
                  />
                </motion.g>
              );
            }

            if (agent.type === 'never_crosses') {
              return (
                <motion.g key={agent.id}>
                  <title>Status: In Transition (erreicht Härtefall nicht)</title>
                  <motion.circle
                    r={AGENT_RADIUS}
                    fill={grayColor}
                    stroke="white"
                    strokeWidth={2}
                    initial={{ cx: START_X, cy: y, opacity: 0 }}
                    animate={{
                      cx: [START_X, END_X],
                      cy: y,
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                      delay: agent.delay,
                      ease: 'linear',
                    }}
                  />
                </motion.g>
              );
            }

            return (
              <motion.g key={agent.id}>
                <title>Status: Switcher (erreicht Alter {haertefallAlter} während Transfer)</title>
                <motion.circle
                  r={AGENT_RADIUS}
                  stroke="white"
                  strokeWidth={2}
                  initial={{ cx: START_X, cy: y, opacity: 0 }}
                  animate={{
                    cx: [START_X, crossX, crossX],
                    cy: [y, y, HAERTEFALL_END_Y],
                    fill: [grayColor, grayColor, goldColor],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration,
                    times: [0, agent.progressThreshold, 1],
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    delay: agent.delay,
                    ease: 'linear',
                  }}
                />
              </motion.g>
            );
          })}
        </svg>

        {/* Legende */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tight">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full ring-2 ring-white"
              style={{ backgroundColor: AGENT_COLORS[activeProfile] }}
            />
            <span>Aktiv im Prozess</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-white" />
            <span>Härtefall-Regelung</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            <span>Match gefunden</span>
          </div>
        </div>
      </div>
    </div>
  );
};
