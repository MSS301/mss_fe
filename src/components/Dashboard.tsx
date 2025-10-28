import React from "react";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";

type Props = {
  token: string | null;
  onLogout: () => void | Promise<void>;
};

export default function Dashboard({ token, onLogout }: Props) {
  console.log("Dashboard rendered with onLogout:", onLogout);
  return (
    <div className="dashboard">
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">📄</div>
          <div className="stat-content">
            <div className="stat-label">Tổng số slide</div>
            <div className="stat-value">24</div>
            <div className="stat-change positive">
              <span>↑ 12%</span>
              <span>so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">💰</div>
          <div className="stat-content">
            <div className="stat-label">Số dư ví</div>
            <div className="stat-value">250,000đ</div>
            <div className="stat-change positive">
              <span>↑ 50,000đ</span>
              <span>vừa nạp</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">👁️</div>
          <div className="stat-content">
            <div className="stat-label">Lượt xem</div>
            <div className="stat-value">1,234</div>
            <div className="stat-change positive">
              <span>↑ 8%</span>
              <span>tuần này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">⭐</div>
          <div className="stat-content">
            <div className="stat-label">Đánh giá trung bình</div>
            <div className="stat-value">4.8</div>
            <div className="stat-change positive">
              <span>↑ 0.2</span>
              <span>từ 42 đánh giá</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Thao tác nhanh</h3>
        </div>
        <div className="quick-actions">
          <Link to="/slides/create" className="quick-action-card">
            <div className="quick-action-icon">➕</div>
            <div className="quick-action-title">Tạo slide mới</div>
            <div className="quick-action-desc">
              Bắt đầu tạo bài giảng với AI
            </div>
          </Link>

          <Link
            to="/curriculum"
            className="quick-action-card"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          >
            <div className="quick-action-icon">📚</div>
            <div className="quick-action-title">Khám phá chương trình</div>
            <div className="quick-action-desc">Tìm bài học theo môn & lớp</div>
          </Link>

          <Link
            to="/wallet"
            className="quick-action-card"
            style={{
              background: "linear-gradient(135deg, #f093fb, #f5576c)",
            }}
          >
            <div className="quick-action-icon">💳</div>
            <div className="quick-action-title">Nạp tiền</div>
            <div className="quick-action-desc">Mở rộng quota và tính năng</div>
          </Link>

          <Link
            to="/slides/templates"
            className="quick-action-card"
            style={{
              background: "linear-gradient(135deg, #4facfe, #00f2fe)",
            }}
          >
            <div className="quick-action-icon">🎨</div>
            <div className="quick-action-title">Mua template</div>
            <div className="quick-action-desc">Khám phá template mới</div>
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-section">
        <div className="recent-slides">
          <div className="recent-header">
            <h3 className="recent-title">Slide gần đây</h3>
            <Link to="/slides" className="btn btn-ghost btn-sm">
              Xem tất cả →
            </Link>
          </div>
          <div className="slide-list">
            <div className="slide-item">
              <div className="slide-thumbnail">📐</div>
              <div className="slide-info">
                <div className="slide-name">Phép nhân phân số - Toán 5</div>
                <div className="slide-meta">
                  <span>🕐 2 giờ trước</span>
                  <span>👁️ 45 lượt xem</span>
                </div>
              </div>
              <span className="badge badge-success">Public</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #f093fb, #f5576c)",
                }}
              >
                🌍
              </div>
              <div className="slide-info">
                <div className="slide-name">Địa lý Việt Nam - Lớp 4</div>
                <div className="slide-meta">
                  <span>🕐 1 ngày trước</span>
                  <span>👁️ 120 lượt xem</span>
                </div>
              </div>
              <span className="badge badge-primary">Private</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                }}
              >
                🔬
              </div>
              <div className="slide-info">
                <div className="slide-name">Khoa học tự nhiên - Lớp 5</div>
                <div className="slide-meta">
                  <span>🕐 3 ngày trước</span>
                  <span>👁️ 89 lượt xem</span>
                </div>
              </div>
              <span className="badge badge-warning">Draft</span>
            </div>
          </div>
        </div>

        <div className="activity-feed">
          <div className="recent-header">
            <h3 className="recent-title">Hoạt động</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">💰</div>
              <div className="activity-content">
                <div className="activity-text">
                  Nạp tiền thành công 100,000đ
                </div>
                <div className="activity-time">5 phút trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📄</div>
              <div className="activity-content">
                <div className="activity-text">
                  Tạo slide "Phép nhân phân số"
                </div>
                <div className="activity-time">2 giờ trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">⭐</div>
              <div className="activity-content">
                <div className="activity-text">Nhận 5 sao từ học sinh</div>
                <div className="activity-time">1 ngày trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">🔔</div>
              <div className="activity-content">
                <div className="activity-text">Bạn có 3 thông báo mới</div>
                <div className="activity-time">2 ngày trước</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
