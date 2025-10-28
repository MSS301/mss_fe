import React from "react";
import "../../css/Dashboard.css";

export default function Statistics() {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">👁️</div>
          <div className="stat-content">
            <div className="stat-label">Tổng lượt xem</div>
            <div className="stat-value">3,245</div>
            <div className="stat-change positive">
              <span>↑ 18%</span>
              <span>so tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">👍</div>
          <div className="stat-content">
            <div className="stat-label">Lượt thích</div>
            <div className="stat-value">892</div>
            <div className="stat-change positive">
              <span>↑ 24%</span>
              <span>tuần này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">⭐</div>
          <div className="stat-content">
            <div className="stat-label">Đánh giá trung bình</div>
            <div className="stat-value">4.8</div>
            <div className="stat-change positive">
              <span>↑ 0.2</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">💬</div>
          <div className="stat-content">
            <div className="stat-label">Bình luận</div>
            <div className="stat-value">156</div>
            <div className="stat-change positive">
              <span>↑ 12</span>
              <span>tuần này</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Biểu đồ lượt xem</h3>
        </div>
        <div className="card-body">
          <div
            style={{
              height: "300px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "var(--font-size-xl)",
            }}
          >
            📈 Chart Component (Coming Soon)
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="recent-slides">
          <div className="recent-header">
            <h3 className="recent-title">Top slides nổi bật</h3>
          </div>
          <div className="slide-list">
            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                }}
              >
                1
              </div>
              <div className="slide-info">
                <div className="slide-name">Toán học lớp 5 - Phân số</div>
                <div className="slide-meta">
                  <span>👁️ 892 views</span>
                  <span>⭐ 4.9</span>
                </div>
              </div>
              <span className="badge badge-primary">Best</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #f093fb, #f5576c)",
                }}
              >
                2
              </div>
              <div className="slide-info">
                <div className="slide-name">Khoa học - Chu trình nước</div>
                <div className="slide-meta">
                  <span>👁️ 756 views</span>
                  <span>⭐ 4.8</span>
                </div>
              </div>
              <span className="badge badge-success">Hot</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                }}
              >
                3
              </div>
              <div className="slide-info">
                <div className="slide-name">Tiếng Việt - Tả cảnh</div>
                <div className="slide-meta">
                  <span>👁️ 634 views</span>
                  <span>⭐ 4.7</span>
                </div>
              </div>
              <span className="badge badge-info">Popular</span>
            </div>
          </div>
        </div>

        <div className="activity-feed">
          <div className="recent-header">
            <h3 className="recent-title">Hoạt động gần đây</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#dbeafe" }}>
                👁️
              </div>
              <div className="activity-content">
                <div className="activity-text">
                  Slide Toán học được xem 50 lần
                </div>
                <div className="activity-time">2 giờ trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#d1fae5" }}>
                👍
              </div>
              <div className="activity-content">
                <div className="activity-text">Nhận 15 lượt thích mới</div>
                <div className="activity-time">5 giờ trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#fef3c7" }}>
                ⭐
              </div>
              <div className="activity-content">
                <div className="activity-text">5 đánh giá 5 sao</div>
                <div className="activity-time">1 ngày trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#fce7f3" }}>
                💬
              </div>
              <div className="activity-content">
                <div className="activity-text">8 bình luận mới</div>
                <div className="activity-time">2 ngày trước</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
