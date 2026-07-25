import React from 'react';
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
import DashboardPage from './features/dashboard/pages/DashboardPage';
import EmployeesPage from './features/dashboard/pages/EmployeesPage';
import CustomersPage from './features/dashboard/pages/CustomersPage';
import ServicesPage from './features/dashboard/pages/ServicesPage';
import SettingsPage from './features/dashboard/pages/SettingsPage';
import BookingsPage from './features/dashboard/pages/BookingsPage';
import PublicBookingPage from './features/public/pages/PublicBookingPage';
import ProtectedRoute from './components/ProtectedRoute';

// Portal Super Admin
import SuperAdminLogin from './features/superadmin/pages/SuperAdminLogin';
import SuperAdminLayout from './features/superadmin/components/SuperAdminLayout';
import SuperAdminDashboard from './features/superadmin/pages/SuperAdminDashboard';
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
        <Routes>

          {/* ─── Portal Clientes (Tenants) ─── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
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

          {/* ─── Portal Público de Reservas ─── */}
          <Route path="/reserva/:slug" element={<PublicBookingPage />} />

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
            {/* Rutas futuras: companies, subscriptions, plans, stats, settings, audit */}
          </Route>

        </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
