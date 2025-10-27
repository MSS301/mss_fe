import React, { useState, useEffect } from "react";
import {
  login as loginApi,
  register as registerApi,
  googleAuth,
} from "../api/auth";
import "../css/login.css";

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
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        onLogin(token);
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
        if (token) onLogin(token);
        else setError("Đăng nhập thất bại");
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

        {/* Google Sign-In Button Container */}
        <div
          id="google-signin-button"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        ></div>

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
