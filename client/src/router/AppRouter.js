import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
function AuthGuard({ children }) {
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Spinner, { size: "lg" }) }));
    }
    return _jsx(_Fragment, { children: children });
}
export function AppRouter() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthGuard, { children: _jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(MainLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/drivers", element: _jsx(DriversPage, {}) }), _jsx(Route, { path: "/drivers/compare", element: _jsx(DriverComparePage, {}) }), _jsx(Route, { path: "/drivers/:id", element: _jsx(DriverDetailPage, {}) }), _jsx(Route, { path: "/teams", element: _jsx(TeamsPage, {}) }), _jsx(Route, { path: "/teams/:id", element: _jsx(TeamDetailPage, {}) }), _jsx(Route, { path: "/circuits", element: _jsx(CircuitsPage, {}) }), _jsx(Route, { path: "/circuits/:id", element: _jsx(CircuitDetailPage, {}) }), _jsx(Route, { path: "/calendar", element: _jsx(CalendarPage, {}) }), _jsx(Route, { path: "/races/:id", element: _jsx(RaceDetailPage, {}) }), _jsx(Route, { path: "/predictions", element: _jsx(ProtectedRoute, { children: _jsx(PredictionsPage, {}) }) }), _jsx(Route, { path: "/predictions/:id", element: _jsx(ProtectedRoute, { children: _jsx(PredictionDetailPage, {}) }) }), _jsx(Route, { path: "/simulation/race", element: _jsx(SimulationPage, {}) }), _jsx(Route, { path: "/simulation/season", element: _jsx(SeasonSimulationPage, {}) }), _jsx(Route, { path: "/rankings", element: _jsx(RankingsPage, {}) }), _jsx(Route, { path: "/leagues", element: _jsx(ProtectedRoute, { children: _jsx(LeaguesPage, {}) }) }), _jsx(Route, { path: "/leagues/:id", element: _jsx(ProtectedRoute, { children: _jsx(LeagueDetailPage, {}) }) }), _jsx(Route, { path: "/simulation/what-if", element: _jsx(WhatIfPage, {}) }), _jsx(Route, { path: "/fantasy", element: _jsx(ProtectedRoute, { children: _jsx(FantasyPage, {}) }) }), _jsx(Route, { path: "/fantasy/team/:id", element: _jsx(ProtectedRoute, { children: _jsx(FantasyTeamPage, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/ai-predictions", element: _jsx(ProtectedRoute, { children: _jsx(AIPredictionsPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }), _jsxs(Route, { element: _jsx(AuthLayout, {}), children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) })] })] }) }) }));
}
//# sourceMappingURL=AppRouter.js.map