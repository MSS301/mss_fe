import React, { useState } from "react";
import "../../css/Dashboard.css";

export default function UserProfileManagement() {
  const [activeTab, setActiveTab] = useState<"all" | "teachers" | "students">(
    "all"
  );

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý hồ sơ người dùng</h3>
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button className="btn btn-ghost btn-sm">
              <span>📊</span>
              <span>Xuất báo cáo</span>
            </button>
            <button className="btn btn-primary">
              <span>+</span>
              <span>Thêm người dùng</span>
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "var(--spacing-md)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button
              className={`btn ${
                activeTab === "all" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả
            </button>
            <button
              className={`btn ${
                activeTab === "teachers" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setActiveTab("teachers")}
            >
              Giáo viên
            </button>
            <button
              className={`btn ${
                activeTab === "students" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setActiveTab("students")}
            >
              Học sinh
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
                    ID
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Họ tên
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Email
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Số điện thoại
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Trường
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Lớp
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Trạng thái
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#U001</td>
                  <td style={{ padding: "var(--spacing-md)" }}>Nguyễn Văn A</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    nguyenvana@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>0123456789</td>
                  <td style={{ padding: "var(--spacing-md)" }}>THCS ABC</td>
                  <td style={{ padding: "var(--spacing-md)" }}>8A1</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Xem</button>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#U002</td>
                  <td style={{ padding: "var(--spacing-md)" }}>Trần Thị B</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    tranthib@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>0987654321</td>
                  <td style={{ padding: "var(--spacing-md)" }}>THPT XYZ</td>
                  <td style={{ padding: "var(--spacing-md)" }}>10A2</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-success">Active</span>
                  </td>
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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">👥</div>
          <div className="stat-content">
            <div className="stat-label">Tổng người dùng</div>
            <div className="stat-value">2,543</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">👨‍🏫</div>
          <div className="stat-content">
            <div className="stat-label">Giáo viên</div>
            <div className="stat-value">342</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">👨‍🎓</div>
          <div className="stat-content">
            <div className="stat-label">Học sinh</div>
            <div className="stat-value">2,201</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">🏫</div>
          <div className="stat-content">
            <div className="stat-label">Trường học</div>
            <div className="stat-value">45</div>
          </div>
        </div>
      </div>
    </div>
  );
}
