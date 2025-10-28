import React, { useState } from "react";
import "./css/variables.css";
import "./css/global.css";
import "./css/components.css";
import "./css/App.css";
import Homepage from "./pages/Homepage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { logout as logoutApi } from "./api/auth";

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

  // Render based on authentication and role
  if (currentPage === "homepage" && !isAuthenticated) {
    return <Homepage onNavigateToLogin={navigateToLogin} />;
  }

  if (currentPage === "login" && !isAuthenticated) {
    return <Login onLogin={handleLogin} onBack={navigateToHomepage} />;
  }

  // Role-based routing: ROLE_ADMIN -> AdminDashboard, ROLE_USER -> Dashboard
  if (isAuthenticated) {
    if (isAdmin) {
      console.log("User is ADMIN, showing AdminDashboard");
      return <AdminDashboard />;
    } else {
      console.log("User is USER, showing Dashboard");
      return <Dashboard token={token!} onLogout={handleLogout} />;
    }
  }

  return <Homepage onNavigateToLogin={navigateToLogin} />;
}

function App(): JSX.Element {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
