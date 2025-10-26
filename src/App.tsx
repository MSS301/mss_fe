import React, { useState, useEffect } from "react";
import "./css/variables.css";
import "./css/global.css";
import "./css/components.css";
import "./css/App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App(): JSX.Element {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  function handleLogin(newToken: string) {
    setToken(newToken);
  }

  function handleLogout() {
    setToken(null);
  }

  return (
    <div className="App">
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
