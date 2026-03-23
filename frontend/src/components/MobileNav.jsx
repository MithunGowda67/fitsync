import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Camera, Droplets, TrendingUp, Settings } from 'lucide-react';

const tabs = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/meal-planner', icon: UtensilsCrossed, label: 'Meals' },
  { path: '/snap-cook', icon: Camera, label: 'Snap' },
  { path: '/hydration', icon: Droplets, label: 'Water' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(14, 14, 22, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className="no-underline"
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div
                className="flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-all"
                style={{
                  color: isActive ? '#a29bfe' : '#5a5a7a',
                  background: isActive ? 'rgba(108,92,231,0.1)' : 'transparent',
                }}
              >
                <tab.icon style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>
                  {tab.label}
                </span>
                {isActive && (
                  <div
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                      marginTop: '1px',
                    }}
                  />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
