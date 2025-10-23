import React, { useState } from "react";
import { login as loginApi } from "../api/auth";
import "../css/login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
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
    } catch (err) {
      setError(err.message || "Lỗi khi gọi API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Đăng nhập - Hệ thống Slide Giáo dục</h2>
        {error && <div className="login-error">{error}</div>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@domain.com"
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            required
          />
        </label>
        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <div className="login-help">
          Bạn có thể dùng email demo: nhducminhqt@gmail.com
        </div>
      </form>
    </div>
  );
}
