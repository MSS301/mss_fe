import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AdminLayout.css";

type AdminLayoutProps = {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
};

export default function AdminLayout({
  children,
  title,
  breadcrumb,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">A</div>
            <span>
              Admin Panel
              <span className="admin-badge">Admin</span>
            </span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {/* Dashboard */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">Tổng quan</div>
            <Link
              to="/admin/dashboard"
              className={`admin-sidebar-link ${
                isActive("/admin/dashboard") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/analytics"
              className={`admin-sidebar-link ${
                isActive("/admin/analytics") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📈</span>
              <span>Analytics</span>
            </Link>
          </div>

          {/* User Management */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">
              Quản lý người dùng
            </div>
            <Link
              to="/admin/users"
              className={`admin-sidebar-link ${
                isActive("/admin/users") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">👥</span>
              <span>Tất cả người dùng</span>
            </Link>
            <Link
              to="/admin/teachers"
              className={`admin-sidebar-link ${
                isActive("/admin/teachers") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">👨‍🏫</span>
              <span>Giáo viên</span>
            </Link>
            <Link
              to="/admin/students"
              className={`admin-sidebar-link ${
                isActive("/admin/students") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">👨‍🎓</span>
              <span>Học sinh</span>
            </Link>
            <Link
              to="/admin/roles"
              className={`admin-sidebar-link ${
                isActive("/admin/roles") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">🔐</span>
              <span>Vai trò & Quyền</span>
            </Link>
          </div>

          {/* Content Management */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">Quản lý nội dung</div>
            <Link
              to="/admin/slides"
              className={`admin-sidebar-link ${
                isActive("/admin/slides") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📄</span>
              <span>Quản lý Slide</span>
            </Link>
            <Link
              to="/admin/subject"
              className={`admin-sidebar-link ${
                isActive("/admin/subject") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📘</span>
              <span>Quản lý môn học</span>
            </Link>
            <Link
              to="/admin/chapter"
              className={`admin-sidebar-link ${
                isActive("/admin/chapter") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📑</span>
              <span>Quản lý chương</span>
            </Link>
            <Link
              to="/admin/lesson-comment"
              className={`admin-sidebar-link ${
                isActive("/admin/lesson-comment") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">�</span>
              <span>Quản lý bình luận bài học</span>
            </Link>
            <Link
              to="/admin/lesson-rating"
              className={`admin-sidebar-link ${
                isActive("/admin/lesson-rating") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">⭐</span>
              <span>Quản lý đánh giá bài học</span>
            </Link>
            <Link
              to="/admin/lesson-file"
              className={`admin-sidebar-link ${
                isActive("/admin/lesson-file") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📎</span>
              <span>Quản lý file bài học</span>
            </Link>
            <Link
              to="/admin/teacher-lesson"
              className={`admin-sidebar-link ${
                isActive("/admin/teacher-lesson") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">👨‍🏫</span>
              <span>Quản lý bài học của giáo viên</span>
            </Link>
            <Link
              to="/admin/curriculum-lesson"
              className={`admin-sidebar-link ${
                isActive("/admin/curriculum-lesson") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📚</span>
              <span>Quản lý bài học của chương trình</span>
            </Link>
            <Link
              to="/admin/curriculum"
              className={`admin-sidebar-link ${
                isActive("/admin/curriculum") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📚</span>
              <span>Chương trình học</span>
            </Link>
            <Link
              to="/admin/templates"
              className={`admin-sidebar-link ${
                isActive("/admin/templates") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">🎨</span>
              <span>Templates</span>
            </Link>
          </div>

          {/* Financial */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">Tài chính</div>
            <Link
              to="/admin/payments"
              className={`admin-sidebar-link ${
                isActive("/admin/payments") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">💳</span>
              <span>Thanh toán</span>
            </Link>
            <Link
              to="/admin/wallets"
              className={`admin-sidebar-link ${
                isActive("/admin/wallets") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">💰</span>
              <span>Quản lý Ví</span>
            </Link>
            <Link
              to="/admin/transactions"
              className={`admin-sidebar-link ${
                isActive("/admin/transactions") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📝</span>
              <span>Giao dịch</span>
            </Link>
          </div>

          {/* System */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">Hệ thống</div>
            <Link
              to="/admin/notifications"
              className={`admin-sidebar-link ${
                isActive("/admin/notifications") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">🔔</span>
              <span>Thông báo</span>
            </Link>
            <Link
              to="/admin/reports"
              className={`admin-sidebar-link ${
                isActive("/admin/reports") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📊</span>
              <span>Báo cáo</span>
            </Link>
            <Link
              to="/admin/settings"
              className={`admin-sidebar-link ${
                isActive("/admin/settings") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">⚙️</span>
              <span>Cài đặt</span>
            </Link>
            <Link
              to="/admin/logs"
              className={`admin-sidebar-link ${
                isActive("/admin/logs") ? "active" : ""
              }`}
            >
              <span className="admin-sidebar-link-icon">📋</span>
              <span>System Logs</span>
            </Link>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user" onClick={logout}>
            <img
              src="https://i.pravatar.cc/150?img=68"
              alt="Admin"
              className="avatar avatar-sm"
            />
            <div className="admin-user-info">
              <div className="admin-user-name">{user?.email || "Admin"}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
            <span style={{ color: "rgba(226, 232, 240, 0.5)" }}>▾</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            {title && (
              <div>
                <h1 className="admin-header-title">{title}</h1>
                {breadcrumb && (
                  <div className="header-breadcrumb">
                    {breadcrumb.map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <span className="header-breadcrumb-separator">/</span>
                        )}
                        {item.href ? (
                          <a href={item.href}>{item.label}</a>
                        ) : (
                          <span>{item.label}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
            <span className="admin-header-badge">Admin Mode</span>
          </div>

          <div className="header-right">
            <div className="header-actions">
              <button className="header-action-btn">
                <span className="header-action-btn-badge"></span>
                🔔
              </button>
              <button className="header-action-btn">💬</button>
              {/* User Menu Dropdown */}
              <div
                className="user-menu-container"
                style={{ position: "relative" }}
              >
                <button
                  className="header-action-btn user-menu-trigger"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <img
                    src="https://i.pravatar.cc/150?img=68"
                    alt="Admin"
                    className="avatar avatar-sm"
                  />
                </button>
                {sidebarOpen && (
                  <div
                    className="user-menu-dropdown"
                    style={{
                      right: 0,
                      top: "40px",
                      position: "absolute",
                      minWidth: 180,
                    }}
                  >
                    <div className="user-menu-header">
                      <img
                        src="https://i.pravatar.cc/150?img=68"
                        alt="Admin"
                        className="avatar avatar-md"
                      />
                      <div className="user-menu-info">
                        <div className="user-menu-name">
                          {user?.email || "Admin"}
                        </div>
                        <div className="user-menu-email">Quản trị viên</div>
                      </div>
                    </div>
                    <div className="user-menu-divider"></div>
                    <Link to="/admin/profile" className="user-menu-item">
                      <span className="user-menu-item-icon">👤</span>
                      <span>Xem hồ sơ</span>
                    </Link>
                    <Link to="/admin/settings" className="user-menu-item">
                      <span className="user-menu-item-icon">⚙️</span>
                      <span>Cài đặt</span>
                    </Link>
                    <div className="user-menu-divider"></div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSidebarOpen(false);
                        logout();
                      }}
                      className="user-menu-item user-menu-item-danger"
                    >
                      <span className="user-menu-item-icon">🚪</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="modal-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ background: "rgba(0,0,0,0.5)" }}
        />
      )}
    </div>
  );
}
