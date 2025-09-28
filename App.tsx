
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import PropertiesPage from './pages/public/PropertiesPage';
import PropertyDetailPage from './pages/public/PropertyDetailPage';
import AboutPage from './pages/public/AboutPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/property/:id" element={<PropertyDetailPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="properties" element={<AdminPropertiesPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="bg-background font-sans text-text-main min-h-screen">
          <AppRoutes />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
