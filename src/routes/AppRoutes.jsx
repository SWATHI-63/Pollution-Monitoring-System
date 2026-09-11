import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { RoleGuard } from '../components/layout/RoleGuard';

// Pages
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AirQualityPage } from '../pages/AirQualityPage';
import { WaterQualityPage } from '../pages/WaterQualityPage';
import { SimulatorPage } from '../pages/SimulatorPage';
import { CompliancePage } from '../pages/CompliancePage';
import { ThresholdsPage } from '../pages/ThresholdsPage';
import { AlertsPage } from '../pages/AlertsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { HistoricalDataPage } from '../pages/HistoricalDataPage';
import { FacilitiesPage } from '../pages/FacilitiesPage';
import { ReportsPage } from '../pages/ReportsPage';
import { UsersPage } from '../pages/UsersPage';
import { SettingsPage } from '../pages/SettingsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Application Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="air-quality" element={<AirQualityPage />} />
        <Route path="water-quality" element={<WaterQualityPage />} />
        <Route path="simulator" element={<SimulatorPage />} />
        <Route path="compliance" element={<CompliancePage />} />

        {/* Admin-only Protected Route: Threshold Configuration */}
        <Route
          path="thresholds"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <ThresholdsPage />
            </RoleGuard>
          }
        />

        <Route path="alerts" element={<AlertsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="history" element={<HistoricalDataPage />} />
        <Route path="facilities" element={<FacilitiesPage />} />
        <Route path="reports" element={<ReportsPage />} />

        {/* Admin-only Protected Route: User Management */}
        <Route
          path="users"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <UsersPage />
            </RoleGuard>
          }
        />

        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

