import { useHydration } from '../lib/HydrationContext';
import { Droplets, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QUICK_AMOUNTS = [150, 250, 500];

export default function HydrationWidget() {
  const { goalMl, totalMl, percentage, addWater } = useHydration();
  const navigate = useNavigate();
  const remaining = Math.max(goalMl - totalMl, 0);

  // Ring geometry
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div
      style={{
        background: '#12121a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#b0b0c8', margin: 0 }}>
          <Droplets style={{ width: '16px', height: '16px', color: '#4fc3f7' }} />
          Hydration
        </h3>
        <button
          onClick={() => navigate('/hydration')}
          style={{
            background: 'none', border: 'none', color: '#a29bfe', fontSize: '12px',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}
        >
          View details →
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Mini Ring */}
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="#1a1a2e" strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={percentage >= 100 ? '#00e676' : 'url(#hydrationGrad)'}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <defs>
              <linearGradient id="hydrationGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4fc3f7" />
                <stop offset="100%" stopColor="#29b6f6" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: percentage >= 100 ? '#00e676' : '#4fc3f7' }}>
              {percentage}%
            </span>
            <span style={{ fontSize: '9px', color: '#5a5a7a' }}>hydrated</span>
          </div>
        </div>

        {/* Stats + Quick Add */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '13px', color: '#e8e8f0', fontWeight: 600, margin: 0 }}>
              {totalMl} <span style={{ color: '#5a5a7a', fontWeight: 400 }}>/ {goalMl} ml</span>
            </p>
            <p style={{ fontSize: '11px', color: '#5a5a7a', margin: '2px 0 0' }}>
              {remaining > 0 ? `${remaining} ml remaining` : '🎉 Goal reached!'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {QUICK_AMOUNTS.map(ml => (
              <button
                key={ml}
                onClick={(e) => { e.stopPropagation(); addWater(ml); }}
                style={{
                  padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                  background: 'rgba(79,195,247,0.1)', border: '1px solid rgba(79,195,247,0.2)',
                  color: '#4fc3f7', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '3px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,195,247,0.2)'; e.currentTarget.style.borderColor = 'rgba(79,195,247,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,195,247,0.1)'; e.currentTarget.style.borderColor = 'rgba(79,195,247,0.2)'; }}
              >
                <Plus style={{ width: '10px', height: '10px' }} />
                {ml}ml
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
