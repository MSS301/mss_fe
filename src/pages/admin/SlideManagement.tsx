import React from "react";
import "../../css/Dashboard.css";

export default function SlideManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý Slides</h3>
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button className="btn btn-ghost">
              <span>🔍</span>
              <span>Tìm kiếm</span>
            </button>
            <button className="btn btn-primary">
              <span>+</span>
              <span>Tạo mẫu</span>
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="slide-list">
            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                }}
              >
                📊
              </div>
              <div className="slide-info">
                <div className="slide-name">Toán học lớp 5 - Phân số</div>
                <div className="slide-meta">
                  <span>👤 Nguyễn Văn A</span>
                  <span>👁️ 892 views</span>
                  <span>⭐ 4.9</span>
                </div>
              </div>
              <div className="slide-actions">
                <button className="btn btn-ghost btn-sm">Xem</button>
                <button className="btn btn-ghost btn-sm">Duyệt</button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--danger-color)" }}
                >
                  Xóa
                </button>
              </div>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #f093fb, #f5576c)",
                }}
              >
                🔬
              </div>
              <div className="slide-info">
                <div className="slide-name">Khoa học - Chu trình nước</div>
                <div className="slide-meta">
                  <span>👤 Trần Thị B</span>
                  <span>👁️ 756 views</span>
                  <span>⭐ 4.8</span>
                </div>
              </div>
              <div className="slide-actions">
                <button className="btn btn-ghost btn-sm">Xem</button>
                <button className="btn btn-ghost btn-sm">Duyệt</button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--danger-color)" }}
                >
                  Xóa
                </button>
              </div>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                }}
              >
                📖
              </div>
              <div className="slide-info">
                <div className="slide-name">Tiếng Việt - Tả cảnh</div>
                <div className="slide-meta">
                  <span>👤 Lê Văn C</span>
                  <span>👁️ 634 views</span>
                  <span>⭐ 4.7</span>
                </div>
              </div>
              <div className="slide-actions">
                <button className="btn btn-ghost btn-sm">Xem</button>
                <button className="btn btn-ghost btn-sm">Duyệt</button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--danger-color)" }}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">📄</div>
          <div className="stat-content">
            <div className="stat-label">Tổng số slide</div>
            <div className="stat-value">15,847</div>
            <div className="stat-change positive">
              <span>↑ 24%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">✅</div>
          <div className="stat-content">
            <div className="stat-label">Đã duyệt</div>
            <div className="stat-value">14,982</div>
            <div className="stat-change positive">
              <span>95%</span>
              <span>tỷ lệ</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Chờ duyệt</div>
            <div className="stat-value">865</div>
            <div className="stat-change">
              <span>Cần xử lý</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">👁️</div>
          <div className="stat-content">
            <div className="stat-label">Lượt xem</div>
            <div className="stat-value">2.4M</div>
            <div className="stat-change positive">
              <span>↑ 32%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
