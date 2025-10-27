import React, { useState, useEffect, useRef } from "react";
import "../css/Layout.css";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  onLogout?: () => void | Promise<void>;
};

export default function Layout({
  children,
  title,
  breadcrumb,
  onLogout,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [userMenuOpen]);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">S</div>
            <span>Slide System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Main */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Tổng quan</div>
            <a href="/dashboard" className="sidebar-link active">
              <span className="sidebar-link-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/profile" className="sidebar-link">
              <span className="sidebar-link-icon">👤</span>
              <span>Hồ sơ</span>
            </a>
          </div>

          {/* Curriculum */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Chương trình học</div>
            <a href="/curriculum" className="sidebar-link">
              <span className="sidebar-link-icon">📚</span>
              <span>Khám phá</span>
            </a>
          </div>

          {/* Slides */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Slide</div>
            <a href="/slides/create" className="sidebar-link">
              <span className="sidebar-link-icon">➕</span>
              <span>Tạo mới</span>
            </a>
            <a href="/slides" className="sidebar-link">
              <span className="sidebar-link-icon">📄</span>
              <span>Slide của tôi</span>
            </a>
            <a href="/slides/templates" className="sidebar-link">
              <span className="sidebar-link-icon">🎨</span>
              <span>Templates</span>
            </a>
          </div>

          {/* Financial */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Tài chính</div>
            <a href="/wallet" className="sidebar-link">
              <span className="sidebar-link-icon">💰</span>
              <span>Ví của tôi</span>
            </a>
            <a href="/payment" className="sidebar-link">
              <span className="sidebar-link-icon">💳</span>
              <span>Nạp tiền</span>
            </a>
          </div>

          {/* System */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Hệ thống</div>
            <a href="/notifications" className="sidebar-link">
              <span className="sidebar-link-icon">🔔</span>
              <span>Thông báo</span>
              <span className="sidebar-link-badge">3</span>
            </a>
            <a href="/settings" className="sidebar-link">
              <span className="sidebar-link-icon">⚙️</span>
              <span>Cài đặt</span>
            </a>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User"
              className="avatar avatar-sm"
            />
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Nguyễn Văn A</div>
              <div className="sidebar-user-role">Giáo viên</div>
            </div>
            <span>▾</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        <header className="header">
          <div className="header-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            {title && <h1 className="header-title">{title}</h1>}
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

          <div className="header-right">
            <div className="header-search">
              <span className="header-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="header-search-input"
              />
            </div>

            <div className="header-actions">
              <button className="header-action-btn">
                <span className="header-action-btn-badge"></span>
                🔔
              </button>
              <button className="header-action-btn">💬</button>

              {/* User Menu Dropdown */}
              <div className="user-menu-container" ref={userMenuRef}>
                <button
                  className="header-action-btn user-menu-trigger"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="User"
                    className="avatar avatar-sm"
                  />
                </button>

                {userMenuOpen && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <img
                        src="https://i.pravatar.cc/150?img=12"
                        alt="User"
                        className="avatar avatar-md"
                      />
                      <div className="user-menu-info">
                        <div className="user-menu-name">Nguyễn Văn A</div>
                        <div className="user-menu-email">
                          nguyenvana@gmail.com
                        </div>
                      </div>
                    </div>

                    <div className="user-menu-divider"></div>

                    <a href="/profile" className="user-menu-item">
                      <span className="user-menu-item-icon">👤</span>
                      <span>Xem hồ sơ</span>
                    </a>

                    <a href="/settings" className="user-menu-item">
                      <span className="user-menu-item-icon">⚙️</span>
                      <span>Cài đặt</span>
                    </a>

                    {onLogout && (
                      <>
                        <div className="user-menu-divider"></div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("Logout button clicked!");
                            console.log("onLogout function:", onLogout);
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="user-menu-item user-menu-item-danger"
                        >
                          <span className="user-menu-item-icon">🚪</span>
                          <span>Đăng xuất</span>
                        </button>
                      </>
                    )}
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
          style={{ background: "rgba(0,0,0,0.3)" }}
        />
      )}
    </div>
  );
}
