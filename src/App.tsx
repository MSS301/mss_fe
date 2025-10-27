import React, { useState, useEffect } from "react";
import "./css/variables.css";
import "./css/global.css";
import "./css/components.css";
import "./css/App.css";
import Homepage from "./pages/Homepage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { logout as logoutApi } from "./api/auth";

type Page = "homepage" | "login" | "dashboard";

function App(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<Page>("homepage");
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setCurrentPage("dashboard");
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  function handleLogin(newToken: string) {
    setToken(newToken);
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
    setToken(null);
    setCurrentPage("homepage");
  }

  function navigateToLogin() {
    setCurrentPage("login");
  }

  function navigateToHomepage() {
    setCurrentPage("homepage");
  }

  // Render based on current page
  if (currentPage === "homepage" && !token) {
    return <Homepage onNavigateToLogin={navigateToLogin} />;
  }

  if (currentPage === "login" && !token) {
    return <Login onLogin={handleLogin} onBack={navigateToHomepage} />;
  }

  if (token) {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  return <Homepage onNavigateToLogin={navigateToLogin} />;
}

export default App;
