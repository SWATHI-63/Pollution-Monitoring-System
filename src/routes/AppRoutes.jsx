import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { RoleGuard } from '../components/layout/RoleGuard';

// Pages
import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import { RegisterPage } from '../pages/RegisterPage';
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
import { EnvironmentalReadingPage } from '../pages/EnvironmentalReadingPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
        <Route path="environmental-reading" element={<EnvironmentalReadingPage />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

