import React, { useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  loginWithGoogle,
} from "../api/auth";
import "../css/login.css";

type Props = {
  onLogin: (token: string) => void;
  onBack?: () => void;
};

export default function Login({ onLogin, onBack }: Props) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        if (token) onLogin(token);
        else setError("Đăng nhập thất bại");
      } catch (err: any) {
        setError(err?.message || "Lỗi khi gọi API");
      } finally {
        setLoading(false);
      }
    }
  }

  function handleGoogleLogin() {
    loginWithGoogle();
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

        <button onClick={handleGoogleLogin} className="login-btn-google">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z"
              fill="#4285F4"
            />
            <path
              d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
              fill="#EA4335"
            />
          </svg>
          Đăng nhập với Google
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
