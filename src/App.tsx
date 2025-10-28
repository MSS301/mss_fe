import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./css/variables.css";
import "./css/global.css";
import "./css/components.css";
import "./css/App.css";
import Homepage from "./pages/Homepage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Curriculum from "./pages/Curriculum";
import MySlides from "./pages/user/MySlides";
import Wallet from "./pages/user/Wallet";
import Statistics from "./pages/user/Statistics";
import Settings from "./pages/user/Settings";
import UserManagement from "./pages/admin/UserManagement";
import SlideManagement from "./pages/admin/SlideManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { logout as logoutApi } from "./api/auth";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

type Page = "homepage" | "login" | "dashboard";

function AppContent(): JSX.Element {
  const { token, isAuthenticated, isAdmin, logout: authLogout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return isAuthenticated ? "dashboard" : "homepage";
  });

  function handleLogin(newToken: string) {
    // Login xử lý bởi AuthContext
    setCurrentPage("dashboard");
  }

  async function handleLogout() {
    console.log("handleLogout called");
    if (token) {
      try {
        console.log("Calling logout API with token");
        await logoutApi(token);
        console.log("Logout API success");
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with logout even if API call fails
      }
    }
    console.log("Clearing token and navigating to homepage");
    authLogout();
    setCurrentPage("homepage");
  }

  function navigateToLogin() {
    setCurrentPage("login");
  }

  function navigateToHomepage() {
    setCurrentPage("homepage");
  }

  // Show homepage or login when not authenticated
  if (!isAuthenticated) {
    if (currentPage === "login") {
      return <Login onLogin={handleLogin} onBack={navigateToHomepage} />;
    }
    return <Homepage onNavigateToLogin={navigateToLogin} />;
  }

  // Authenticated routes with React Router
  return (
    <Routes>
      {/* User Routes */}
      {!isAdmin && (
        <>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Layout title="Dashboard">
                <Dashboard token={token!} onLogout={handleLogout} />
              </Layout>
            }
          />
          <Route
            path="/curriculum"
            element={
              <Layout title="Chương trình học">
                <Curriculum />
              </Layout>
            }
          />
          <Route
            path="/slides"
            element={
              <Layout title="Slides của tôi">
                <MySlides />
              </Layout>
            }
          />
          <Route
            path="/wallet"
            element={
              <Layout title="Ví tiền">
                <Wallet />
              </Layout>
            }
          />
          <Route
            path="/statistics"
            element={
              <Layout title="Thống kê">
                <Statistics />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout title="Cài đặt">
                <Settings />
              </Layout>
            }
          />
        </>
      )}

      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout title="Admin Dashboard">
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout title="Quản lý người dùng">
                <UserManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/slides"
            element={
              <AdminLayout title="Quản lý Slides">
                <SlideManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminLayout title="Quản lý thanh toán">
                <PaymentManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout title="Cài đặt hệ thống">
                <SystemSettings />
              </AdminLayout>
            }
          />
        </>
      )}

      {/* Catch all */}
      <Route
        path="*"
        element={
          <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace />
        }
      />
    </Routes>
  );
}

function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
