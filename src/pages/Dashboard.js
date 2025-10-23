import React from "react";

export default function Dashboard({ token, onLogout }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Bạn đã đăng nhập thành công. Token (rút gọn):</p>
      <pre style={{ maxWidth: "80%", overflow: "auto" }}>
        {token?.slice(0, 120)}
        {token && token.length > 120 ? "..." : ""}
      </pre>
      <button onClick={onLogout} style={{ marginTop: 16 }}>
        Đăng xuất
      </button>
    </div>
  );
}
