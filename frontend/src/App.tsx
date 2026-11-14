import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider } from './context/LanguageContext';
import { FarmProvider } from './context/FarmContext';

// Layout shell
import DashboardLayout from './layouts/DashboardLayout';

// Dynamic code splitting for all route pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const FarmsPage = React.lazy(() => import('./pages/FarmsPage'));
const FarmDetailPage = React.lazy(() => import('./pages/FarmDetailPage'));
const SoilAnalysisPage = React.lazy(() => import('./pages/SoilAnalysisPage'));
const SoilAnalysisAgentPage = React.lazy(() => import('./pages/SoilAnalysisAgentPage'));
const PlantingAdvisorAgentPage = React.lazy(() => import('./pages/PlantingAdvisorAgentPage'));
const SatellitePage = React.lazy(() => import('./pages/SatellitePage'));
const RecommendationsPage = React.lazy(() => import('./pages/RecommendationsPage'));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const MLOpsPage = React.lazy(() => import('./pages/MLOpsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 1;
      },
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-[#FAFAF5]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-emerald-200 border-t-[#166534] animate-spin" />
        <p className="text-xs text-gray-500 font-medium tracking-wide">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-[#166534] animate-spin" />
        <p className="text-sm text-gray-600 font-medium">CSN Bhoomi...</p>
      </div>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <FarmProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                  {/* Protected dashboard routes */}
                  <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="farms" element={<FarmsPage />} />
                    <Route path="farms/:farmId" element={<FarmDetailPage />} />
                    <Route path="soil" element={<SoilAnalysisPage />} />
                    <Route path="satellite" element={<SatellitePage />} />
                    <Route path="recommendations" element={<RecommendationsPage />} />
                    <Route path="reports" element={<ReportsPage />} />

                    {/* AI Agriculture Agents */}
                    <Route path="agents/soil-analysis" element={<SoilAnalysisAgentPage />} />
                    <Route path="agents/planting-advisor" element={<PlantingAdvisorAgentPage />} />
                    <Route path="agents/farming-assistant" element={<PlantingAdvisorAgentPage />} />
                    {/* Convenient Aliases */}
                    <Route path="soil-analysis" element={<SoilAnalysisAgentPage />} />
                    <Route path="planting-advisor" element={<PlantingAdvisorAgentPage />} />
                    <Route path="farming-assistant" element={<PlantingAdvisorAgentPage />} />

                    {/* Developer & Diagnostics */}
                    <Route path="ml-ops" element={<MLOpsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </FarmProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
