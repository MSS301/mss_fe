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

const FRIENDLY_STATUS_CODE_MESSAGES: Record<number, string> = {
  400: "Du lieu gui len khong hop le, vui long kiem tra lai.",
  401: "Ban chua dang nhap hoac phien da het han.",
  403: "Email hoac mat khau khong dung.",
  404: "Khong tim thay tai khoan.",
  429: "Ban thao tac qua nhanh, vui long thu lai sau.",
  500: "May chu dang co su co, vui long thu lai.",
  503: "Dich vu dang tam thoi ngung, vui long thu lai sau.",
};

type WithStatusError = {
  status?: number | string;
  statusCode?: number | string;
  response?: {
    status?: number | string;
  };
  message?: string;
};

function extractStatusFromError(error: unknown): number | null {
  if (typeof error === "object" && error !== null) {
    const candidate = error as WithStatusError;
    const statusValue =
      candidate.status ?? candidate.statusCode ?? candidate.response?.status;
    if (typeof statusValue === "number" && !Number.isNaN(statusValue)) {
      return statusValue;
    }
    if (typeof statusValue === "string") {
      const parsed = Number(statusValue);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  const message =
    typeof error === "string"
      ? error
      : (error as WithStatusError).message;
  if (typeof message === "string") {
    const match = message.match(/HTTP\s+(\d{3})/);
    if (match) {
      const parsed = Number(match[1]);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

function getFriendlyErrorMessage(error: unknown, fallback: string): string {
  if (error === undefined || error === null) {
    return fallback;
  }

  const status = extractStatusFromError(error);
  if (status !== null && FRIENDLY_STATUS_CODE_MESSAGES[status]) {
    return FRIENDLY_STATUS_CODE_MESSAGES[status];
  }

  const message =
    typeof error === "string"
      ? error
      : (error as WithStatusError).message;
  if (typeof message === "string" && message.trim().length) {
    return message;
  }

  return fallback;
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
        getFriendlyErrorMessage(
          err,
          isRegisterMode
            ? "Loi khi dang ky voi Google"
            : "Loi khi dang nhap voi Google"
        )
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
        setError(getFriendlyErrorMessage(err, "Loi khi dang ky"));
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
        setError(getFriendlyErrorMessage(err, "Loi khi goi API"));
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
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Trang chủ</span>
        </button>
      )}
      
      <div className="login-background-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrapper">
            <div className="login-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
                <path
                  d="M16 8L22 14H18V20H14V14H10L16 8Z"
                  fill="white"
                />
                <path
                  d="M10 24H22V22H10V24Z"
                  fill="white"
                />
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#667eea"/>
                    <stop offset="100%" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="login-title">
            {isRegisterMode ? "Tạo tài khoản mới" : "Chào mừng trở lại"}
          </h1>
          <p className="login-subtitle">
            {isRegisterMode
              ? "Đăng ký để bắt đầu hành trình học tập của bạn"
              : "Đăng nhập để tiếp tục học tập"}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-message login-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="login-message login-success">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {isRegisterMode && (
            <div className="input-group">
              <label htmlFor="username">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.75 16.5C15.75 13.5147 12.7279 11.25 9 11.25C5.27208 11.25 2.25 13.5147 2.25 16.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
                autoComplete="username"
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M15.75 4.5H2.25C1.42157 4.5 0.75 5.17157 0.75 6V15C0.75 15.8284 1.42157 16.5 2.25 16.5H15.75C16.5784 16.5 17.25 15.8284 17.25 15V6C17.25 5.17157 16.5784 4.5 15.75 4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0.75 6L9 10.5L17.25 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="3"
                  y="8"
                  width="12"
                  height="7.5"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.25 8V5.25C5.25 3.17893 6.92893 1.5 9 1.5C11.0711 1.5 12.75 3.17893 12.75 5.25V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
              </svg>
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={isRegisterMode ? "new-password" : "current-password"}
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>{isRegisterMode ? "Đang đăng ký..." : "Đang đăng nhập..."}</span>
              </>
            ) : (
              <>
                <span>{isRegisterMode ? "Đăng ký" : "Đăng nhập"}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 10H15M15 10L11 6M15 10L11 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span className="divider-line"></span>
          <span className="divider-text">hoặc</span>
          <span className="divider-line"></span>
        </div>

        <button
          type="button"
          onClick={handleGoogleOAuth2Login}
          disabled={loading}
          className="google-oauth-btn"
        >
          <svg width="20" height="20" viewBox="0 0 18 18">
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
            {isRegisterMode ? "Đăng ký bằng Google" : "Đăng nhập bằng Google"}
          </span>
        </button>

        <div className="login-footer">
          <span className="footer-text">
            {isRegisterMode ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
          </span>
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
