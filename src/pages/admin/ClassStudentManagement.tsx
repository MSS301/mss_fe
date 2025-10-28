import React from "react";
import "../../css/Dashboard.css";

export default function ClassStudentManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý học sinh theo lớp</h3>
          <div
            style={{
              display: "flex",
              gap: "var(--spacing-sm)",
              alignItems: "center",
            }}
          >
            <select
              style={{
                padding: "var(--spacing-xs) var(--spacing-sm)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <option>Tất cả trường</option>
              <option>THCS Nguyễn Du</option>
              <option>THPT Lê Quý Đôn</option>
            </select>
            <select
              style={{
                padding: "var(--spacing-xs) var(--spacing-sm)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <option>Lớp 8A1</option>
              <option>Lớp 8A2</option>
              <option>Lớp 10A1</option>
            </select>
            <button className="btn btn-primary">
              <span>+</span>
              <span>Thêm học sinh</span>
            </button>
          </div>
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
                    STT
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    MSHS
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Họ và tên
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Ngày sinh
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Giới tính
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Email
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Phụ huynh
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    SĐT PH
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>1</td>
                  <td style={{ padding: "var(--spacing-md)" }}>#HS001</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <strong>Nguyễn Văn An</strong>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>15/03/2010</td>
                  <td style={{ padding: "var(--spacing-md)" }}>Nam</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    nguyenvanan@student.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Nguyễn Văn A</td>
                  <td style={{ padding: "var(--spacing-md)" }}>0912345678</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Xem</button>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>2</td>
                  <td style={{ padding: "var(--spacing-md)" }}>#HS002</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <strong>Trần Thị Bình</strong>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>22/07/2010</td>
                  <td style={{ padding: "var(--spacing-md)" }}>Nữ</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    tranthibinh@student.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Trần Văn B</td>
                  <td style={{ padding: "var(--spacing-md)" }}>0987654321</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Xem</button>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Thống kê lớp 8A1</h3>
        </div>
        <div className="card-body">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary">👥</div>
              <div className="stat-content">
                <div className="stat-label">Sĩ số</div>
                <div className="stat-value">38/40</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">👦</div>
              <div className="stat-content">
                <div className="stat-label">Nam</div>
                <div className="stat-value">20</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon info">👧</div>
              <div className="stat-content">
                <div className="stat-label">Nữ</div>
                <div className="stat-value">18</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning">📊</div>
              <div className="stat-content">
                <div className="stat-label">Điểm TB</div>
                <div className="stat-value">8.2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
