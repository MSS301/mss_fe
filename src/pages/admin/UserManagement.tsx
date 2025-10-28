import React from "react";
import "../../css/Dashboard.css";

export default function UserManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý người dùng</h3>
          <button className="btn btn-primary">
            <span>+</span>
            <span>Thêm người dùng</span>
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
                    ID
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Tên
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Email
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Vai trò
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
                  <td style={{ padding: "var(--spacing-md)" }}>#001</td>
                  <td style={{ padding: "var(--spacing-md)" }}>Nguyễn Văn A</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    nguyenvana@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-primary">Teacher</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--danger-color)" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#002</td>
                  <td style={{ padding: "var(--spacing-md)" }}>Trần Thị B</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    tranthib@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-info">Student</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--danger-color)" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#003</td>
                  <td style={{ padding: "var(--spacing-md)" }}>Lê Văn C</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    levanc@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-primary">Teacher</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-warning">Pending</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--danger-color)" }}
                    >
                      Xóa
                    </button>
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
            <div className="stat-change positive">
              <span>↑ 12%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">👨‍🏫</div>
          <div className="stat-content">
            <div className="stat-label">Giáo viên</div>
            <div className="stat-value">342</div>
            <div className="stat-change positive">
              <span>↑ 8%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">👨‍🎓</div>
          <div className="stat-content">
            <div className="stat-label">Học sinh</div>
            <div className="stat-value">2,201</div>
            <div className="stat-change positive">
              <span>↑ 15%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Chờ duyệt</div>
            <div className="stat-value">23</div>
            <div className="stat-change">
              <span>Cần xử lý</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
