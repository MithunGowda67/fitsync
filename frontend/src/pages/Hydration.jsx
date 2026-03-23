import { useState } from 'react';
import { useHydration } from '../lib/HydrationContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets, Plus, Minus, Settings, Trash2, Clock,
  Target, TrendingUp, RotateCcw, Check, X
} from 'lucide-react';

const PRESETS = [
  { ml: 150, label: 'Small Glass', icon: '🥛' },
  { ml: 250, label: 'Glass', icon: '🥤' },
  { ml: 350, label: 'Large Glass', icon: '🫗' },
  { ml: 500, label: 'Bottle', icon: '🍶' },
  { ml: 750, label: 'Large Bottle', icon: '💧' },
  { ml: 1000, label: '1 Litre', icon: '🧊' },
];

function GoalEditor({ goalMl, onSave, onClose }) {
  const [value, setValue] = useState(goalMl);
  const stepGoals = [1500, 2000, 2500, 3000, 3500, 4000];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="card"
      style={{ marginBottom: '16px' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Target className="w-4 h-4 text-accent-secondary" /> Set Daily Goal
        </h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-dark-600 transition-colors">
          <X className="w-4 h-4 text-dark-300" />
        </button>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {stepGoals.map(g => (
          <button
            key={g}
            onClick={() => setValue(g)}
            className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
              value === g
                ? 'bg-water/20 border border-water/40 text-water'
                : 'bg-dark-700 border border-dark-500 text-dark-200 hover:border-dark-300'
            }`}
          >
            {(g / 1000).toFixed(1)}L
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="number"
            min="250"
            max="6000"
            step="50"
            className="input-field pr-10"
            value={value}
            onChange={e => setValue(parseInt(e.target.value) || 250)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-sm">ml</span>
        </div>
        <button
          onClick={() => { onSave(value); onClose(); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Check className="w-4 h-4" /> Save
        </button>
      </div>
    </motion.div>
  );
}

export default function Hydration() {
  const {
    goalMl, todayEntries, totalMl, percentage, progress,
    addWater, removeEntry, setGoal, resetToday,
  } = useHydration();

  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [customMl, setCustomMl] = useState('');
  const remaining = Math.max(goalMl - totalMl, 0);

  // Ring geometry
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Droplets className="w-8 h-8 text-water" />
              <span className="gradient-text">Hydration</span>
            </h1>
            <p className="text-dark-200 mt-1">Track your daily water intake and stay hydrated.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGoalEditor(!showGoalEditor)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Settings className="w-4 h-4" /> Goal: {(goalMl / 1000).toFixed(1)}L
            </button>
          </div>
        </div>
      </motion.div>

      {/* Goal Editor */}
      <AnimatePresence>
        {showGoalEditor && (
          <GoalEditor
            goalMl={goalMl}
            onSave={setGoal}
            onClose={() => setShowGoalEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Area: Ring + Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card flex flex-col items-center justify-center py-8"
        >
          <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke="var(--color-dark-600)" strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={percentage >= 100 ? 'var(--color-green-accent)' : 'url(#hydrationPageGrad)'}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              <defs>
                <linearGradient id="hydrationPageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4fc3f7" />
                  <stop offset="100%" stopColor="#29b6f6" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: '42px', fontWeight: 800,
                color: percentage >= 100 ? 'var(--color-green-accent)' : '#4fc3f7',
              }}>
                {percentage}%
              </span>
              <span style={{ fontSize: '13px', color: '#8888a8' }}>
                {totalMl} / {goalMl} ml
              </span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 w-full">
            {[
              { label: 'Consumed', value: `${totalMl}`, unit: 'ml', icon: Droplets, color: '#4fc3f7' },
              { label: 'Remaining', value: `${remaining}`, unit: 'ml', icon: Target, color: '#a29bfe' },
              { label: 'Entries', value: `${todayEntries.length}`, unit: '', icon: TrendingUp, color: '#ffd740' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <stat.icon style={{ width: '16px', height: '16px', color: stat.color, margin: '0 auto 4px' }} />
                <p style={{ fontSize: '18px', fontWeight: 700, color: stat.color }}>
                  {stat.value}<span style={{ fontSize: '11px', fontWeight: 400, color: '#5a5a7a' }}>{stat.unit}</span>
                </p>
                <p style={{ fontSize: '10px', color: '#5a5a7a' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Add Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-dark-100">
            <Plus className="w-4 h-4 text-water" /> Quick Add
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {PRESETS.map(preset => (
              <button
                key={preset.ml}
                onClick={() => addWater(preset.ml)}
                style={{
                  padding: '14px 12px', borderRadius: '14px',
                  background: '#1a1a2e', border: '1px solid #222240',
                  cursor: 'pointer', transition: 'all 0.2s',
                  color: 'white', fontFamily: 'inherit', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#222240'; e.currentTarget.style.borderColor = 'rgba(79,195,247,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a1a2e'; e.currentTarget.style.borderColor = '#222240'; }}
              >
                <span style={{ fontSize: '20px' }}>{preset.icon}</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>+{preset.ml}ml</p>
                  <p style={{ fontSize: '10px', color: '#5a5a7a' }}>{preset.label}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                min="10"
                step="10"
                className="input-field pr-10 text-sm"
                placeholder="Custom amount"
                value={customMl}
                onChange={e => setCustomMl(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customMl) {
                    addWater(parseInt(customMl));
                    setCustomMl('');
                  }
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 text-xs">ml</span>
            </div>
            <button
              onClick={() => { if (customMl) { addWater(parseInt(customMl)); setCustomMl(''); } }}
              disabled={!customMl}
              className="btn-primary text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </motion.div>
      </div>

      {/* Today's Log */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-dark-100">
            <Clock className="w-4 h-4 text-accent-secondary" /> Today's Log
          </h3>
          {todayEntries.length > 0 && (
            <button
              onClick={resetToday}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#5a5a7a',
                padding: '4px 8px', borderRadius: '8px', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ff5252'; e.currentTarget.style.background = 'rgba(255,82,82,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#5a5a7a'; e.currentTarget.style.background = 'transparent'; }}
            >
              <RotateCcw style={{ width: '12px', height: '12px' }} /> Reset Day
            </button>
          )}
        </div>

        {todayEntries.length === 0 ? (
          <div style={{
            padding: '32px', borderRadius: '14px', border: '1px dashed #222240',
            textAlign: 'center', color: '#3d3d5c',
          }}>
            <Droplets style={{ width: '32px', height: '32px', margin: '0 auto 8px', opacity: 0.3 }} />
            <p style={{ fontSize: '13px', fontWeight: 500 }}>No entries yet today</p>
            <p style={{ fontSize: '11px', marginTop: '4px' }}>Use the quick-add buttons above to log water</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[...todayEntries].reverse().map(entry => (
              <div
                key={entry.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '12px', background: '#1a1a2e',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'rgba(79,195,247,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Droplets style={{ width: '14px', height: '14px', color: '#4fc3f7' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#e8e8f0' }}>
                      +{entry.amount} ml
                    </p>
                    <p style={{ fontSize: '10px', color: '#5a5a7a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock style={{ width: '10px', height: '10px' }} />
                      {formatTime(entry.timestamp)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d3d5c', padding: '6px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ff5252')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3d3d5c')}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Day Summary */}
        {todayEntries.length > 0 && (
          <div style={{
            marginTop: '12px', padding: '12px 14px', borderRadius: '12px',
            background: percentage >= 100
              ? 'rgba(0,230,118,0.08)'
              : 'rgba(79,195,247,0.08)',
            border: `1px solid ${percentage >= 100 ? 'rgba(0,230,118,0.15)' : 'rgba(79,195,247,0.15)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '12px', color: percentage >= 100 ? '#00e676' : '#4fc3f7', fontWeight: 600 }}>
              {percentage >= 100 ? '🎉 Daily goal reached!' : `${remaining} ml to reach your goal`}
            </span>
            <span style={{ fontSize: '12px', color: '#5a5a7a' }}>
              {todayEntries.length} entries today
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
