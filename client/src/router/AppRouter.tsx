import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../store/auth.store';
import { Spinner } from '../components/ui/Spinner';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import DriversPage from '../pages/DriversPage';
import DriverDetailPage from '../pages/DriverDetailPage';
import DriverComparePage from '../pages/DriverComparePage';
import { TeamsPage } from '../pages/TeamsPage';
import { TeamDetailPage } from '../pages/TeamDetailPage';
import CircuitsPage from '../pages/CircuitsPage';
import CircuitDetailPage from '../pages/CircuitDetailPage';
import CalendarPage from '../pages/CalendarPage';
import RaceDetailPage from '../pages/RaceDetailPage';
import PredictionsPage from '../pages/PredictionsPage';
import PredictionDetailPage from '../pages/PredictionDetailPage';
import SimulationPage from '../pages/SimulationPage';
import SeasonSimulationPage from '../pages/SeasonSimulationPage';
import WhatIfPage from '../pages/WhatIfPage';
import RankingsPage from '../pages/RankingsPage';
import LeaguesPage from '../pages/LeaguesPage';
import LeagueDetailPage from '../pages/LeagueDetailPage';
import FantasyPage from '../pages/FantasyPage';
import FantasyTeamPage from '../pages/FantasyTeamPage';
import ProfilePage from '../pages/ProfilePage';
import AIPredictionsPage from '../pages/AIPredictionsPage';
import NotFoundPage from '../pages/NotFoundPage';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/drivers/compare" element={<DriverComparePage />} />
            <Route path="/drivers/:id" element={<DriverDetailPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamDetailPage />} />
            <Route path="/circuits" element={<CircuitsPage />} />
            <Route path="/circuits/:id" element={<CircuitDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/races/:id" element={<RaceDetailPage />} />
            <Route path="/predictions" element={<ProtectedRoute><PredictionsPage /></ProtectedRoute>} />
            <Route path="/predictions/:id" element={<ProtectedRoute><PredictionDetailPage /></ProtectedRoute>} />
            <Route path="/simulation/race" element={<SimulationPage />} />
            <Route path="/simulation/season" element={<SeasonSimulationPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/leagues" element={<ProtectedRoute><LeaguesPage /></ProtectedRoute>} />
            <Route path="/leagues/:id" element={<ProtectedRoute><LeagueDetailPage /></ProtectedRoute>} />
            <Route path="/simulation/what-if" element={<WhatIfPage />} />
            <Route path="/fantasy" element={<ProtectedRoute><FantasyPage /></ProtectedRoute>} />
            <Route path="/fantasy/team/:id" element={<ProtectedRoute><FantasyTeamPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/ai-predictions" element={<ProtectedRoute><AIPredictionsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}
