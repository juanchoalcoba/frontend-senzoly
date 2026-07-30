import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Portal Clientes
import LandingPage from './pages/LandingPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import VerifyEmailPage from './features/auth/pages/VerifyEmailPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import TenantSuspendedPage from './features/auth/pages/TenantSuspendedPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import EmployeesPage from './features/dashboard/pages/EmployeesPage';
import CustomersPage from './features/dashboard/pages/CustomersPage';
import ServicesPage from './features/dashboard/pages/ServicesPage';
import SettingsPage from './features/dashboard/pages/SettingsPage';
import BookingsPage from './features/dashboard/pages/BookingsPage';
import FinancePage from './features/dashboard/pages/FinancePage';
import SubscriptionPage from './features/dashboard/pages/SubscriptionPage';
import PublicBookingPage from './features/public/pages/PublicBookingPage';
import ProfessionalPortalPage from './features/public/pages/ProfessionalPortalPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ProtectedRoute from './components/ProtectedRoute';

// Portal Super Admin
import SuperAdminLogin from './features/superadmin/pages/SuperAdminLogin';
import SuperAdminLayout from './features/superadmin/components/SuperAdminLayout';
import SuperAdminDashboard from './features/superadmin/pages/SuperAdminDashboard';
import SuperAdminCompanies from './features/superadmin/pages/SuperAdminCompanies';
import SuperAdminSubscriptions from './features/superadmin/pages/SuperAdminSubscriptions';
import SuperAdminPlans from './features/superadmin/pages/SuperAdminPlans';
import SuperAdminStats from './features/superadmin/pages/SuperAdminStats';
import SuperAdminConfig from './features/superadmin/pages/SuperAdminConfig';
import SuperAdminAudit from './features/superadmin/pages/SuperAdminAudit';
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute';
import Lenis from "@studio-freight/lenis";


function App() {

  useEffect(() => {
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return () => {
    lenis.destroy();
  };
}, []);




  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
        <Routes>

          {/* ─── Portal Clientes (Tenants) ─── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/casos-de-exito" element={<SuccessStoriesPage />} />
          <Route path="/como-funciona" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account-suspended" element={<TenantSuspendedPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/employees"
            element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/services"
            element={
              <ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/finance"
            element={
              <ProtectedRoute>
                <FinancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/subscription"
            element={
              <ProtectedRoute>
                <SubscriptionPage />
              </ProtectedRoute>
            }
          />

          {/* ─── Portal Público de Reservas y Portal Profesional ─── */}
          <Route path="/reserva/:slug" element={<PublicBookingPage />} />
          <Route path="/p/:token" element={<ProfessionalPortalPage />} />

          {/* ─── Portal Super Admin ─── */}
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route
            path="/super-admin"
            element={
              <SuperAdminProtectedRoute>
                <SuperAdminLayout />
              </SuperAdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="companies" element={<SuperAdminCompanies />} />
            <Route path="subscriptions" element={<SuperAdminSubscriptions />} />
            <Route path="plans" element={<SuperAdminPlans />} />
            <Route path="stats" element={<SuperAdminStats />} />
            <Route path="settings" element={<SuperAdminConfig />} />
            <Route path="audit" element={<SuperAdminAudit />} />
          </Route>

        </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
