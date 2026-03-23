import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../lib/UserContext';
import {
  LayoutDashboard, UtensilsCrossed, Camera, TrendingUp,
  Dumbbell, Droplets, Settings as SettingsIcon
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/meal-planner', icon: UtensilsCrossed, label: 'Meal Planner' },
  { path: '/snap-cook', icon: Camera, label: 'AI Snap & Cook' },
  { path: '/hydration', icon: Droplets, label: 'Hydration' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/settings', icon: SettingsIcon, label: 'Settings' },
];

export default function Sidebar() {
  const { profile } = useUser();
  const navigate = useNavigate();

  return (
    <aside
      style={{ width: '260px', minWidth: '260px' }}
      className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-white/[0.06] bg-[#0e0e16]"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/[0.06]">
        <div
          style={{ background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Dumbbell className="text-white" style={{ width: '20px', height: '20px' }} />
        </div>
        <span
          className="text-lg font-bold"
          style={{ background: 'linear-gradient(135deg, #6c5ce7, #a29bfe, #74b9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          FitSync
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-200 no-underline ${
                isActive
                  ? 'text-white'
                  : 'text-[#b0b0c8] hover:text-white'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'linear-gradient(90deg, rgba(108,92,231,0.2), rgba(162,155,254,0.1))' }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  style={{ width: '20px', height: '20px', flexShrink: 0, color: isActive ? '#a29bfe' : undefined }}
                />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div
                    style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6c5ce7', marginLeft: 'auto' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Status */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #6c5ce7, #40c4ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span className="text-xs font-bold text-white">{profile.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p className="text-sm font-medium text-white" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.name || 'User'}
            </p>
            <p className="text-xs flex items-center gap-1" style={{ color: '#5a5a7a' }}>
              <Droplets style={{ width: '12px', height: '12px' }} /> {profile.goals?.[0]?.replace(/_/g, ' ') || 'Stay healthy'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
