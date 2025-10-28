import React from "react";
import "../../css/Dashboard.css";

export default function SchoolManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý trường học</h3>
          <button className="btn btn-primary">
            <span>+</span>
            <span>Thêm trường</span>
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
                    Mã trường
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Tên trường
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Loại
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Địa chỉ
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Số lớp
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Số GV
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Số HS
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
                  <td style={{ padding: "var(--spacing-md)" }}>#SCH001</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    THCS Nguyễn Du
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-primary">THCS</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    123 Đường ABC, Q.1, TP.HCM
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>24</td>
                  <td style={{ padding: "var(--spacing-md)" }}>56</td>
                  <td style={{ padding: "var(--spacing-md)" }}>890</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <button className="btn btn-ghost btn-sm">Xem</button>
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#SCH002</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    THPT Lê Quý Đôn
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-info">THPT</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    456 Đường XYZ, Q.3, TP.HCM
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>36</td>
                  <td style={{ padding: "var(--spacing-md)" }}>82</td>
                  <td style={{ padding: "var(--spacing-md)" }}>1,245</td>
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
          <div className="stat-icon primary">🏫</div>
          <div className="stat-content">
            <div className="stat-label">Tổng trường</div>
            <div className="stat-value">45</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">📚</div>
          <div className="stat-content">
            <div className="stat-label">THCS</div>
            <div className="stat-value">28</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">🎓</div>
          <div className="stat-content">
            <div className="stat-label">THPT</div>
            <div className="stat-value">17</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">👥</div>
          <div className="stat-content">
            <div className="stat-label">Tổng học sinh</div>
            <div className="stat-value">32,450</div>
          </div>
        </div>
      </div>
    </div>
  );
}
