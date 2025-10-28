import React, { useState } from "react";
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
            <a href="/admin/dashboard" className="admin-sidebar-link active">
              <span className="admin-sidebar-link-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/admin/analytics" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">📈</span>
              <span>Analytics</span>
            </a>
          </div>

          {/* User Management */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">
              Quản lý người dùng
            </div>
            <a href="/admin/users" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">👥</span>
              <span>Tất cả người dùng</span>
            </a>
            <a href="/admin/teachers" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">👨‍🏫</span>
              <span>Giáo viên</span>
            </a>
            <a href="/admin/students" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">👨‍🎓</span>
              <span>Học sinh</span>
            </a>
            <a href="/admin/roles" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">🔐</span>
              <span>Vai trò & Quyền</span>
            </a>
          </div>

          {/* Content Management */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">Quản lý nội dung</div>
            <a href="/admin/slides" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">📄</span>
              <span>Quản lý Slide</span>
            </a>
            <a href="/admin/curriculum" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">📚</span>
              <span>Chương trình học</span>
            </a>
            <a href="/admin/templates" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">🎨</span>
              <span>Templates</span>
            </a>
          </div>

          {/* Financial */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">Tài chính</div>
            <a href="/admin/payments" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">💳</span>
              <span>Thanh toán</span>
            </a>
            <a href="/admin/wallets" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">💰</span>
              <span>Quản lý Ví</span>
            </a>
            <a href="/admin/transactions" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">📝</span>
              <span>Giao dịch</span>
            </a>
          </div>

          {/* System */}
          <div className="admin-sidebar-section">
            <div className="admin-sidebar-section-title">Hệ thống</div>
            <a href="/admin/notifications" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">🔔</span>
              <span>Thông báo</span>
            </a>
            <a href="/admin/reports" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">📊</span>
              <span>Báo cáo</span>
            </a>
            <a href="/admin/settings" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">⚙️</span>
              <span>Cài đặt</span>
            </a>
            <a href="/admin/logs" className="admin-sidebar-link">
              <span className="admin-sidebar-link-icon">📋</span>
              <span>System Logs</span>
            </a>
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
              <button className="header-action-btn">
                <img
                  src="https://i.pravatar.cc/150?img=68"
                  alt="Admin"
                  className="avatar avatar-sm"
                />
              </button>
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
