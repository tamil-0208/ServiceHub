import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProvidersPage } from './pages/ProvidersPage';
import { ProviderDetailPage } from './pages/ProviderDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Customer pages
import { DashboardPage } from './pages/DashboardPage';
import { BookingsPage } from './pages/BookingsPage';

// Provider pages
import { BecomeProviderPage } from './pages/provider/BecomeProviderPage';
import { ProviderDashboardPage } from './pages/provider/ProviderDashboardPage';
import { ManageServicesPage } from './pages/provider/ManageServicesPage';
import { ManageSchedulePage } from './pages/provider/ManageSchedulePage';
import { ProviderBookingsPage } from './pages/provider/ProviderBookingsPage';

// Admin shell + pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminProvidersPage } from './pages/admin/AdminProvidersPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* ── Public Routes ─────────────────────────────────── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/providers/:id" element={<ProviderDetailPage />} />

            {/* ── Customer Protected Routes ─────────────────────── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />

            {/* ── Provider Protected Routes ─────────────────────── */}
            <Route
              path="/provider/become"
              element={
                <ProtectedRoute>
                  <BecomeProviderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <ProviderDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/services"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <ManageServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/schedule"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <ManageSchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/bookings"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <ProviderBookingsPage />
                </ProtectedRoute>
              }
            />

            {/* ── Admin Routes (nested under AdminLayout) ───────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* index = /admin */}
              <Route index element={<AdminOverviewPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="providers" element={<AdminProvidersPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
            </Route>

            {/* ── 404 ───────────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
