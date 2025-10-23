import React, { useState } from "react";
import { login as loginApi } from "../api/auth";
import "../css/login.css";

type Props = {
  onLogin: (token: string) => void;
};

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">S</div>
          <h2>Đăng nhập</h2>
          <p className="login-subtitle">Hệ thống Slide Giáo dục AI</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
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
              autoComplete="current-password"
            />
          </label>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <>
                <span className="spinner spinner-sm"></span>
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="login-help">
          💡 <strong>Demo:</strong> nhducminhqt@gmail.com /
          nhducminhqt@gmail.com
        </div>

        <div className="login-footer">
          Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
}
