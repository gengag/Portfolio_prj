import React, { Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Code-split lazy routes for instant initial page loading & bandwidth optimization
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const PracticePage = lazy(() => import('./pages/PracticePage').then((m) => ({ default: m.PracticePage })));
const TutorPage = lazy(() => import('./pages/TutorPage').then((m) => ({ default: m.TutorPage })));
const MockTestsPage = lazy(() => import('./pages/MockTestsPage').then((m) => ({ default: m.MockTestsPage })));
const MistakesPage = lazy(() => import('./pages/MistakesPage').then((m) => ({ default: m.MistakesPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const StudyPlanPage = lazy(() => import('./pages/StudyPlanPage').then((m) => ({ default: m.StudyPlanPage })));
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage').then((m) => ({ default: m.KnowledgeBasePage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

// Protected Route Guard: Only authenticated users can access
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
        Loading AI Exam Coach...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public/Auth Route Guard: If user is already logged in, redirect them directly to /dashboard
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
        Loading AI Exam Coach...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Route transition suspense fallback
const RouteLoadingFallback: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--text-secondary)' }}>
    <div className="badge badge-indigo" style={{ padding: '0.5rem 1rem' }}>
      Loading module...
    </div>
  </div>
);

// Catch-all handler for invalid/wrong URLs:
// If logged in -> securely directs to /dashboard
// If not logged in -> directs to /login
const NotFoundRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            {/* Onboarding route - requires auth but may be un‑onboarded */}
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            {/* Public/Auth Routes: Block authenticated users from accessing login/register/landing */}
            <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <PracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor"
              element={
                <ProtectedRoute>
                  <TutorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-tests"
              element={
                <ProtectedRoute>
                  <MockTestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mistakes"
              element={
                <ProtectedRoute>
                  <MistakesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/study-plan"
              element={
                <ProtectedRoute>
                  <StudyPlanPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <KnowledgeBasePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all: prevent broken view on wrong URLs */}
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
