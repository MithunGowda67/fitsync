import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { UserProvider, useUser } from './lib/UserContext';
import { HydrationProvider } from './lib/HydrationContext';

import SplashScreen from './components/SplashScreen';
import Onboarding from './pages/onboarding/Onboarding';
import Dashboard from './pages/dashboard/Dashboard';
import MealPlanner from './pages/MealPlanner';
import SnapCook from './pages/SnapCook';
import Progress from './pages/Progress';
import Hydration from './pages/Hydration';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { profile } = useUser();
  const { user, isAuthLoading } = useAuth();

  // ✅ Prevent blank screen
  if (isAuthLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            {!profile?.onboarded ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <main
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '24px',
                    paddingBottom: '100px',
                    overflowX: 'hidden',
                  }}
                >
                  <Routes>
                    {/* ✅ FIXED: removed leading "/" */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="meal-planner" element={<MealPlanner />} />
                    <Route path="snap-cook" element={<SnapCook />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="hydration" element={<Hydration />} />
                    <Route path="settings" element={<Settings />} />

                    {/* default route */}
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </main>
                <MobileNav />
              </div>
            )}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    // ✅ FIXED: added basename
    <BrowserRouter basename="/">
      <AuthProvider>
        <UserProvider>
          <HydrationProvider>
            {!splashDone && (
              <SplashScreen onComplete={() => setSplashDone(true)} />
            )}
            {splashDone && <AppRoutes />}
          </HydrationProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}