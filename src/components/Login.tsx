import React, { useState, useEffect } from "react";
import {
  login as loginApi,
  register as registerApi,
  googleAuth,
} from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import "../css/login.css";

const API_BASE =
  (process.env.REACT_APP_API_BASE?.trim().replace(/\/$/, "")) ||
  "http://localhost:8080";

type Props = {
  onLogin: (token: string) => void;
  onBack?: () => void;
};

declare global {
  interface Window {
    google: any;
  }
}

export default function Login({ onLogin, onBack }: Props) {
  const { login } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle OAuth2 login - redirect to backend OAuth2 endpoint
  function handleGoogleOAuth2Login() {
    // Redirect through API Gateway to auth service OAuth2 authorization endpoint
    // Gateway rewrites /auth-service/** to /auth/** for the auth service
    window.location.href = `http://localhost:8080/auth-service/oauth2/authorization/google`;
  }

  async function handleGoogleCallback(response: any) {
    try {
      setLoading(true);
      setError(null);

      // Decode JWT token from Google
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split(".")[1]));

      // Call backend API (backend sẽ tự động đăng ký nếu chưa có tài khoản)
      const token = await googleAuth(
        payload.sub, // googleId
        payload.email, // email
        payload.name, // name
        payload.picture // picture
      );

      if (token) {
        login(token); // Update AuthContext
        onLogin(token); // Trigger navigation
      } else {
        setError(
          isRegisterMode
            ? "Đăng ký với Google thất bại"
            : "Đăng nhập với Google thất bại"
        );
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (isRegisterMode
            ? "Lỗi khi đăng ký với Google"
            : "Lỗi khi đăng nhập với Google")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initialize Google Sign-In
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

    if (!GOOGLE_CLIENT_ID) {
      console.warn(
        "Google Client ID chưa được cấu hình. Vui lòng thêm REACT_APP_GOOGLE_CLIENT_ID vào .env"
      );
      return;
    }

    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render button vào container nếu có
        const buttonDiv = document.getElementById("google-signin-button");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: 350,
            text: isRegisterMode ? "signup_with" : "signin_with",
          });
        }
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
        setError("Không thể khởi tạo Google Sign-In");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegisterMode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (isRegisterMode) {
      // Register mode
      if (!username || !email || !password) {
        setError("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setLoading(true);
      try {
        const response = await registerApi(username, email, password);
        if (response.code === 1000) {
          setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập.");
          setIsRegisterMode(false);
          setPassword("");
        } else {
          setError("Đăng ký thất bại");
        }
      } catch (err: any) {
        setError(err?.message || "Lỗi khi đăng ký");
      } finally {
        setLoading(false);
      }
    } else {
      // Login mode
      if (!email || !password) {
        setError("Vui lòng nhập email và mật khẩu");
        return;
      }
      setLoading(true);
      try {
        const token = await loginApi(email, password);
        if (token) {
          login(token); // Update AuthContext
          onLogin(token); // Trigger navigation
        } else {
          setError("Đăng nhập thất bại");
        }
      } catch (err: any) {
        setError(err?.message || "Lỗi khi gọi API");
      } finally {
        setLoading(false);
      }
    }
  }

  function toggleMode() {
    setIsRegisterMode(!isRegisterMode);
    setError(null);
    setSuccessMessage(null);
    setPassword("");
  }

  return (
    <div className="login-container">
      {onBack && (
        <button onClick={onBack} className="back-button">
          ← Trang chủ
        </button>
      )}
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">S</div>
          <h2>{isRegisterMode ? "Đăng ký" : "Đăng nhập"}</h2>
          <p className="login-subtitle">Hệ thống Slide Giáo dục AI</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="login-success">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {isRegisterMode && (
            <label>
              Tên đăng nhập
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
                autoComplete="username"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              autoComplete="email"
            />
          </label>

          <label>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={
                isRegisterMode ? "new-password" : "current-password"
              }
            />
          </label>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <span className="spinner spinner-sm"></span>
                <span>
                  {isRegisterMode ? "Đang đăng ký..." : "Đang đăng nhập..."}
                </span>
              </>
            ) : isRegisterMode ? (
              "Đăng ký"
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>hoặc</span>
        </div>

        {/* Google OAuth2 Login Button */}
        <button
          type="button"
          onClick={handleGoogleOAuth2Login}
          disabled={loading}
          className="google-oauth-btn"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #dadce0",
            borderRadius: "4px",
            backgroundColor: "white",
            color: "#3c4043",
            fontSize: "14px",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.2s",
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#f8f9fa";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "white";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.55 0 9s.348 2.827.957 4.042l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
            />
          </svg>
          <span>
            {isRegisterMode
              ? "Đăng ký bằng Google"
              : "Đăng nhập bằng Google"}
          </span>
        </button>

        <div className="login-footer">
          {isRegisterMode ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
          <button
            type="button"
            onClick={toggleMode}
            className="login-toggle-link"
          >
            {isRegisterMode ? "Đăng nhập ngay" : "Đăng ký ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}
