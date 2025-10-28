import React from "react";
import "../../css/Dashboard.css";

export default function Wallet() {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon success">💰</div>
          <div className="stat-content">
            <div className="stat-label">Số dư ví</div>
            <div className="stat-value">250,000 đ</div>
            <div className="stat-change positive">
              <span>↑ 50,000đ</span>
              <span>tuần này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">📦</div>
          <div className="stat-content">
            <div className="stat-label">Gói đang dùng</div>
            <div className="stat-value">Premium</div>
            <div className="stat-change">
              <span>Còn 25 ngày</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">💳</div>
          <div className="stat-content">
            <div className="stat-label">Giao dịch tháng này</div>
            <div className="stat-value">12</div>
            <div className="stat-change positive">
              <span>↑ 3</span>
              <span>so tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">🎁</div>
          <div className="stat-content">
            <div className="stat-label">Điểm thưởng</div>
            <div className="stat-value">1,280</div>
            <div className="stat-change positive">
              <span>+120</span>
              <span>tuần này</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Thao tác nhanh</h3>
        </div>
        <div className="quick-actions">
          <button
            className="quick-action-card"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            <div className="quick-action-icon">💰</div>
            <div className="quick-action-title">Nạp tiền</div>
            <div className="quick-action-desc">Nạp tiền vào ví</div>
          </button>

          <button
            className="quick-action-card"
            style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)" }}
          >
            <div className="quick-action-icon">📦</div>
            <div className="quick-action-title">Mua gói</div>
            <div className="quick-action-desc">Nâng cấp tài khoản</div>
          </button>

          <button
            className="quick-action-card"
            style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)" }}
          >
            <div className="quick-action-icon">📜</div>
            <div className="quick-action-title">Lịch sử</div>
            <div className="quick-action-desc">Xem giao dịch</div>
          </button>

          <button
            className="quick-action-card"
            style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)" }}
          >
            <div className="quick-action-icon">🎁</div>
            <div className="quick-action-title">Đổi điểm</div>
            <div className="quick-action-desc">Đổi quà tặng</div>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lịch sử giao dịch</h3>
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
                +
              </div>
              <div className="slide-info">
                <div className="slide-name">Nạp tiền vào ví</div>
                <div className="slide-meta">
                  <span>🕐 2 giờ trước</span>
                  <span>💳 Momo</span>
                </div>
              </div>
              <span className="badge badge-success">+100,000đ</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #f093fb, #f5576c)",
                }}
              >
                -
              </div>
              <div className="slide-info">
                <div className="slide-name">Mua gói Premium</div>
                <div className="slide-meta">
                  <span>🕐 1 ngày trước</span>
                  <span>📦 Gói 1 tháng</span>
                </div>
              </div>
              <span className="badge badge-warning">-50,000đ</span>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                }}
              >
                +
              </div>
              <div className="slide-info">
                <div className="slide-name">Thưởng từ hệ thống</div>
                <div className="slide-meta">
                  <span>🕐 3 ngày trước</span>
                  <span>🎁 Event</span>
                </div>
              </div>
              <span className="badge badge-success">+20,000đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
