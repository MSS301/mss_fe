import React from "react";
import "../../css/Dashboard.css";

export default function ClassManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý lớp học</h3>
          <button className="btn btn-primary">
            <span>+</span>
            <span>Tạo lớp mới</span>
          </button>
        </div>
        <div className="card-body">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid var(--border-color)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Mã lớp
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Tên lớp
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Trường
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Khối
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    GVCN
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Sĩ số
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Năm học
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#CLS001</td>
                  <td style={{ padding: "var(--spacing-md)" }}>8A1</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    THCS Nguyễn Du
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-primary">Khối 8</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Nguyễn Văn A</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <strong>38</strong>/40
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>2024-2025</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Xem DS</button>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#CLS002</td>
                  <td style={{ padding: "var(--spacing-md)" }}>10A2</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    THPT Lê Quý Đôn
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-info">Khối 10</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Trần Thị B</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <strong>40</strong>/40
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>2024-2025</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Xem DS</button>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">🏫</div>
          <div className="stat-content">
            <div className="stat-label">Tổng lớp</div>
            <div className="stat-value">856</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">👨‍🏫</div>
          <div className="stat-content">
            <div className="stat-label">GVCN</div>
            <div className="stat-value">856</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">👥</div>
          <div className="stat-content">
            <div className="stat-label">Tổng học sinh</div>
            <div className="stat-value">32,450</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">📊</div>
          <div className="stat-content">
            <div className="stat-label">Sĩ số TB</div>
            <div className="stat-value">37.9</div>
          </div>
        </div>
      </div>
    </div>
  );
}
