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
          <div className="stat-icon-wrapper primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Tổng số slide</div>
            <div className="stat-value">24</div>
            <div className="stat-change positive">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3L12 7H9V13H7V7H4L8 3Z" fill="currentColor"/>
              </svg>
              <span>↑ 12%</span>
              <span>so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Số dư ví</div>
            <div className="stat-value">250,000đ</div>
            <div className="stat-change positive">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3L12 7H9V13H7V7H4L8 3Z" fill="currentColor"/>
              </svg>
              <span>↑ 50,000đ</span>
              <span>vừa nạp</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Lượt xem</div>
            <div className="stat-value">1,234</div>
            <div className="stat-change positive">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3L12 7H9V13H7V7H4L8 3Z" fill="currentColor"/>
              </svg>
              <span>↑ 8%</span>
              <span>tuần này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Đánh giá trung bình</div>
            <div className="stat-value">4.8</div>
            <div className="stat-change positive">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3L12 7H9V13H7V7H4L8 3Z" fill="currentColor"/>
              </svg>
              <span>↑ 0.2</span>
              <span>từ 42 đánh giá</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Thao tác nhanh
          </h3>
        </div>
        <div className="quick-actions">
          <Link to="/slides/create" className="quick-action-card primary">
            <div className="quick-action-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 6V26M6 16H26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="quick-action-title">Tạo slide mới</div>
            <div className="quick-action-desc">
              Bắt đầu tạo bài giảng với AI
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="quick-action-arrow">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <Link to="/curriculum" className="quick-action-card secondary">
            <div className="quick-action-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M26 4H6C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 10H22M10 16H22M10 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="quick-action-title">Khám phá chương trình</div>
            <div className="quick-action-desc">Tìm bài học theo môn & lớp</div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="quick-action-arrow">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <Link to="/wallet" className="quick-action-card accent">
            <div className="quick-action-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M28 8H24V6C24 4.89543 23.1046 4 22 4H6C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H22C23.1046 28 24 27.1046 24 26V24H28C29.1046 24 30 23.1046 30 22V10C30 8.89543 29.1046 8 28 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 16H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="quick-action-title">Nạp tiền</div>
            <div className="quick-action-desc">Mở rộng quota và tính năng</div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="quick-action-arrow">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <Link to="/slides/templates" className="quick-action-card info">
            <div className="quick-action-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M26 4H6C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 10H16M10 16H22M10 22H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="quick-action-title">Mua template</div>
            <div className="quick-action-desc">Khám phá template mới</div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="quick-action-arrow">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-section">
        <div className="recent-slides">
          <div className="recent-header">
            <h3 className="recent-title">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H14C14.5304 18 15.0391 17.7893 15.4142 17.4142C15.7893 17.0391 16 16.5304 16 16V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V6H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 11H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 14H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Slide gần đây
            </h3>
            <Link to="/slides" className="btn-view-all">
              Xem tất cả
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="slide-list">
            <div className="slide-item">
              <div className="slide-thumbnail primary">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L20 12L28 13L22 19L23 28L16 23L9 28L10 19L4 13L12 12L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="slide-info">
                <div className="slide-name">Phép nhân phân số - Toán 5</div>
                <div className="slide-meta">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    2 giờ trước
                  </span>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7C1 7 3 2 7 2C11 2 13 7 13 7C13 7 11 12 7 12C3 12 1 7 1 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    45 lượt xem
                  </span>
                </div>
              </div>
              <span className="badge badge-success">Public</span>
            </div>

            <div className="slide-item">
              <div className="slide-thumbnail accent">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 8V16L22 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="slide-info">
                <div className="slide-name">Địa lý Việt Nam - Lớp 4</div>
                <div className="slide-meta">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    1 ngày trước
                  </span>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7C1 7 3 2 7 2C11 2 13 7 13 7C13 7 11 12 7 12C3 12 1 7 1 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    120 lượt xem
                  </span>
                </div>
              </div>
              <span className="badge badge-primary">Private</span>
            </div>

            <div className="slide-item">
              <div className="slide-thumbnail info">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L20 12L28 13L22 19L23 28L16 23L9 28L10 19L4 13L12 12L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="slide-info">
                <div className="slide-name">Khoa học tự nhiên - Lớp 5</div>
                <div className="slide-meta">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    3 ngày trước
                  </span>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7C1 7 3 2 7 2C11 2 13 7 13 7C13 7 11 12 7 12C3 12 1 7 1 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    89 lượt xem
                  </span>
                </div>
              </div>
              <span className="badge badge-warning">Draft</span>
            </div>
          </div>
        </div>

        <div className="activity-feed">
          <div className="recent-header">
            <h3 className="recent-title">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 5V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Hoạt động
            </h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 4.5V9L12 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-text">
                  Nạp tiền thành công 100,000đ
                </div>
                <div className="activity-time">5 phút trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon primary">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M12 1H4C3.17157 1 2.5 1.67157 2.5 2.5V13.5C2.5 14.3284 3.17157 15 4 15H12C12.8284 15 13.5 14.3284 13.5 13.5V2.5C13.5 1.67157 12.8284 1 12 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 1V5H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 8H6.5M11.5 8H9M9 11H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-text">
                  Tạo slide "Phép nhân phân số"
                </div>
                <div className="activity-time">2 giờ trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon warning">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1L11.5 6.5L17.5 7.5L13 11.5L14.5 17.5L9 14.5L3.5 17.5L5 11.5L0.5 7.5L6.5 6.5L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-text">Nhận 5 sao từ học sinh</div>
                <div className="activity-time">1 ngày trước</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon info">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 4.5V9M9 13.5H9.00833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
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
