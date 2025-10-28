import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserInfo, isTokenExpired, UserRole } from "../utils/jwt";

interface UserInfo {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}

interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        logout();
        return;
      }

      // Decode and set user info
      const userInfo = getUserInfo(token);
      if (userInfo) {
        setUser(userInfo);
        localStorage.setItem("token", token);
      } else {
        logout();
      }
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "ROLE_ADMIN",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
