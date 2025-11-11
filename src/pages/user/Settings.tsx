import React, { useState } from "react";
import "../../css/Settings.css";

export default function Settings() {
  const [email, setEmail] = useState("user@example.com");
  const [name, setName] = useState("Nguyễn Văn A");
  const [phone, setPhone] = useState("0123456789");
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Đã lưu thay đổi thành công!");
    }, 1000);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2L19.09 11.26L29 12.27L21.5 18.74L23.18 28.02L16 23.77L8.82 28.02L10.5 18.74L3 12.27L12.91 11.26L16 2Z"
              fill="currentColor"
            />
          </svg>
          Cài đặt
        </h1>
        <p className="settings-subtitle">
          Quản lý thông tin cá nhân và tùy chọn tài khoản của bạn
        </p>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 22C3 17.5147 6.51472 14 11 14H13C17.4853 14 21 17.5147 21 22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="settings-card-title">Thông tin cá nhân</h2>
        </div>
        <div className="settings-card-body">
          <form
            className="settings-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="settings-form-group">
              <label className="settings-form-label" htmlFor="nameInput">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.75 16.5C15.75 13.5147 12.7279 11.25 9 11.25C5.27208 11.25 2.25 13.5147 2.25 16.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Họ và tên
              </label>
              <input
                id="nameInput"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="settings-form-input"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label" htmlFor="emailInput">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3 3H15C15.8284 3 16.5 3.67157 16.5 4.5V13.5C16.5 14.3284 15.8284 15 15 15H3C2.17157 15 1.5 14.3284 1.5 13.5V4.5C1.5 3.67157 2.17157 3 3 3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.5 4.5L9 9.75L16.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Email
              </label>
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="settings-form-input"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label" htmlFor="phoneInput">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M15.75 12.75V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H12.75C10.6789 15.75 8.75 14.5711 7.5 12.75C6.25 10.9289 5.25 9 5.25 6.92893C5.25 6.53115 5.40804 6.14956 5.68934 5.86826C5.97064 5.58696 6.35223 5.42893 6.75 5.42893H8.25C8.64777 5.42893 9.02936 5.58696 9.31066 5.86826C9.59196 6.14956 9.75 6.53115 9.75 6.92893V9.75C9.75 10.1478 9.59196 10.5294 9.31066 10.8107C9.02936 11.092 8.64777 11.25 8.25 11.25H6.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Số điện thoại
              </label>
              <input
                id="phoneInput"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="settings-form-input"
                placeholder="0123456789"
              />
            </div>

            <button
              type="submit"
              className="btn-save-settings"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    style={{ animation: "spin 0.7s linear infinite" }}
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity="0.3"
                    />
                    <path
                      d="M9 1.5C11.4853 1.5 13.5 3.51472 13.5 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M16.6667 5L7.5 14.1667L3.33333 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8C18 6.34315 16.6569 5 15 5C13.3431 5 12 6.34315 12 8C12 9.65685 13.3431 11 15 11C16.6569 11 18 9.65685 18 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8C12 9.65685 10.6569 11 9 11C7.34315 11 6 9.65685 6 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 16C18 14.3431 16.6569 13 15 13C13.3431 13 12 14.3431 12 16C12 17.6569 13.3431 19 15 19C16.6569 19 18 17.6569 18 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 16C6 14.3431 7.34315 13 9 13C10.6569 13 12 14.3431 12 16C12 17.6569 10.6569 19 9 19C7.34315 19 6 17.6569 6 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="settings-card-title">Cài đặt thông báo</h2>
        </div>
        <div className="settings-card-body">
          <div className="settings-toggle-group">
            <div className="settings-toggle-item">
              <div className="settings-toggle-content">
                <div className="settings-toggle-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 1.5C5.27208 1.5 2.25 4.52208 2.25 8.25C2.25 12.9779 5.27208 16 9 16C12.7279 16 15.75 12.9779 15.75 8.25C15.75 4.52208 12.7279 1.5 9 1.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 5.25V9.75L12 11.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Thông báo push
                </div>
                <div className="settings-toggle-description">
                  Nhận thông báo về hoạt động mới và cập nhật quan trọng
                </div>
              </div>
              <label className="settings-toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-toggle-item">
              <div className="settings-toggle-content">
                <div className="settings-toggle-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M3 3H15C15.8284 3 16.5 3.67157 16.5 4.5V13.5C16.5 14.3284 15.8284 15 15 15H3C2.17157 15 1.5 14.3284 1.5 13.5V4.5C1.5 3.67157 2.17157 3 3 3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1.5 4.5L9 9.75L16.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Email thông báo
                </div>
                <div className="settings-toggle-description">
                  Nhận email về slide mới, cập nhật và thông báo quan trọng
                </div>
              </div>
              <label className="settings-toggle-switch">
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V12M12 16H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="settings-card-title">Bảo mật</h2>
        </div>
        <div className="settings-card-body">
          <div className="settings-security-actions">
            <button className="settings-security-button">
              <div className="settings-security-button-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 7.5V5.83333C15 3.99238 13.5076 2.5 11.6667 2.5H8.33333C6.49238 2.5 5 3.99238 5 5.83333V7.5M15 7.5H5M15 7.5V15.8333C15 17.6743 13.5076 19.1667 11.6667 19.1667H8.33333C6.49238 19.1667 5 17.6743 5 15.8333V7.5M10 12.5V14.1667"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="settings-security-button-content">
                <div className="settings-security-button-title">
                  Đổi mật khẩu
                </div>
                <div className="settings-security-button-description">
                  Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                </div>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="settings-security-button-arrow"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="settings-security-button">
              <div className="settings-security-button-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2.5V5.83333M10 14.1667V17.5M17.5 10H14.1667M5.83333 10H2.5M15.8333 4.16667L13.75 6.25M6.25 13.75L4.16667 15.8333M15.8333 15.8333L13.75 13.75M6.25 6.25L4.16667 4.16667"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="settings-security-button-content">
                <div className="settings-security-button-title">
                  Xác thực 2 yếu tố
                </div>
                <div className="settings-security-button-description">
                  Thêm lớp bảo mật bổ sung cho tài khoản của bạn
                </div>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="settings-security-button-arrow"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="settings-security-button danger">
              <div className="settings-security-button-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 6.66667V10M10 13.3333H10.0083"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="settings-security-button-content">
                <div className="settings-security-button-title">
                  Xóa tài khoản
                </div>
                <div className="settings-security-button-description">
                  Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn
                </div>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="settings-security-button-arrow"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
