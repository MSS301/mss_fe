import React from "react";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      {/* Admin Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">👥</div>
          <div className="stat-content">
            <div className="stat-label">Tổng người dùng</div>
            <div className="stat-value">2,543</div>
            <div className="stat-change positive">
              <span>↑ 12%</span>
              <span>so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">📄</div>
          <div className="stat-content">
            <div className="stat-label">Tổng số slide</div>
            <div className="stat-value">15,847</div>
            <div className="stat-change positive">
              <span>↑ 24%</span>
              <span>tuần này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">💰</div>
          <div className="stat-content">
            <div className="stat-label">Doanh thu tháng</div>
            <div className="stat-value">125M đ</div>
            <div className="stat-change positive">
              <span>↑ 18%</span>
              <span>so tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">🚀</div>
          <div className="stat-content">
            <div className="stat-label">System Health</div>
            <div className="stat-value">99.8%</div>
            <div className="stat-change positive">
              <span>↑ 0.2%</span>
              <span>uptime tốt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Thao tác nhanh</h3>
        </div>
        <div className="quick-actions">
          <Link
            to="/admin/users/create"
            className="quick-action-card"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          >
            <div className="quick-action-icon">➕</div>
            <div className="quick-action-title">Tạo người dùng</div>
            <div className="quick-action-desc">Thêm giáo viên/học sinh mới</div>
          </Link>

          <Link
            to="/admin/curriculum/import"
            className="quick-action-card"
            style={{
              background: "linear-gradient(135deg, #f093fb, #f5576c)",
            }}
          >
            <div className="quick-action-icon">📚</div>
            <div className="quick-action-title">Import chương trình</div>
            <div className="quick-action-desc">Cập nhật chương trình Bộ GD</div>
          </Link>

          <Link
            to="/admin/reports"
            className="quick-action-card"
            style={{
              background: "linear-gradient(135deg, #4facfe, #00f2fe)",
            }}
          >
            <div className="quick-action-icon">📊</div>
            <div className="quick-action-title">Xem báo cáo</div>
            <div className="quick-action-desc">Thống kê và phân tích</div>
          </Link>

          <Link
            to="/admin/settings"
            className="quick-action-card"
            style={{
              background: "linear-gradient(135deg, #43e97b, #38f9d7)",
            }}
          >
            <div className="quick-action-icon">⚙️</div>
            <div className="quick-action-title">Cấu hình hệ thống</div>
            <div className="quick-action-desc">Cài đặt và bảo trì</div>
          </Link>
        </div>
      </div>

      {/* Recent Activities & Users */}
      <div className="recent-section">
        <div className="recent-slides">
          <div className="recent-header">
            <h3 className="recent-title">Hoạt động gần đây</h3>
            <Link to="/admin/logs" className="btn btn-ghost btn-sm">
              Xem tất cả →
            </Link>
          </div>
          <div className="slide-list">
            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                }}
              >
                👤
              </div>
              <div className="slide-info">
                <div className="slide-name">
                  User mới đăng ký: nguyenvana@school.edu
                </div>
                <div className="slide-meta">
                  <span>🕐 5 phút trước</span>
                  <span>📧 Email đã verify</span>
                </div>
              </div>
              <span className="badge badge-success">New User</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #f093fb, #f5576c)",
                }}
              >
                💰
              </div>
              <div className="slide-info">
                <div className="slide-name">
                  Thanh toán thành công: 500,000đ
                </div>
                <div className="slide-meta">
                  <span>🕐 10 phút trước</span>
                  <span>👤 tranvanb@school.edu</span>
                </div>
              </div>
              <span className="badge badge-success">Payment</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                }}
              >
                📄
              </div>
              <div className="slide-info">
                <div className="slide-name">
                  Slide mới được tạo: Toán học lớp 5
                </div>
                <div className="slide-meta">
                  <span>🕐 30 phút trước</span>
                  <span>👤 phamthic@school.edu</span>
                </div>
              </div>
              <span className="badge badge-primary">Slide</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #fa709a, #fee140)",
                }}
              >
                ⚠️
              </div>
              <div className="slide-info">
                <div className="slide-name">Cảnh báo: Server load cao 85%</div>
                <div className="slide-meta">
                  <span>🕐 1 giờ trước</span>
                  <span>🖥️ Auth Service</span>
                </div>
              </div>
              <span className="badge badge-warning">Alert</span>
            </div>
          </div>
        </div>

        <div className="activity-feed">
          <div className="recent-header">
            <h3 className="recent-title">System Status</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#d1fae5" }}>
                ✅
              </div>
              <div className="activity-content">
                <div className="activity-text">Auth Service: Running</div>
                <div className="activity-time">Uptime: 99.9%</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#d1fae5" }}>
                ✅
              </div>
              <div className="activity-content">
                <div className="activity-text">Slide Service: Running</div>
                <div className="activity-time">Uptime: 99.8%</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#fef3c7" }}>
                ⚠️
              </div>
              <div className="activity-content">
                <div className="activity-text">Payment Service: High Load</div>
                <div className="activity-time">CPU: 85%</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#d1fae5" }}>
                ✅
              </div>
              <div className="activity-content">
                <div className="activity-text">Database: Healthy</div>
                <div className="activity-time">Connections: 234/1000</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: "#d1fae5" }}>
                ✅
              </div>
              <div className="activity-content">
                <div className="activity-text">Redis Cache: Running</div>
                <div className="activity-time">Memory: 45%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts placeholder */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Biểu đồ thống kê</h3>
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
    </div>
  );
}
