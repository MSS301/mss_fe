import React, { useState } from "react";
import "../../css/Dashboard.css";

export default function Settings() {
  const [email, setEmail] = useState("user@example.com");
  const [name, setName] = useState("Nguyễn Văn A");
  const [phone, setPhone] = useState("0123456789");
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Thông tin cá nhân</h3>
        </div>
        <div className="card-body">
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-xs)",
              }}
            >
              <label
                style={{ fontWeight: 500, color: "var(--text-secondary)" }}
              >
                Họ và tên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-xs)",
              }}
            >
              <label
                style={{ fontWeight: 500, color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-xs)",
              }}
            >
              <label
                style={{ fontWeight: 500, color: "var(--text-secondary)" }}
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-base)",
                }}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "fit-content" }}
            >
              Lưu thay đổi
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Cài đặt thông báo</h3>
        </div>
        <div className="card-body">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>Thông báo push</div>
                <div
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Nhận thông báo về hoạt động mới
                </div>
              </div>
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "48px",
                  height: "24px",
                }}
              >
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: notifications
                      ? "var(--primary-color)"
                      : "#ccc",
                    transition: "0.4s",
                    borderRadius: "24px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: '""',
                      height: "18px",
                      width: "18px",
                      left: notifications ? "26px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      transition: "0.4s",
                      borderRadius: "50%",
                    }}
                  ></span>
                </span>
              </label>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>Email thông báo</div>
                <div
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Nhận email về slide mới và cập nhật
                </div>
              </div>
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "48px",
                  height: "24px",
                }}
              >
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: emailNotif
                      ? "var(--primary-color)"
                      : "#ccc",
                    transition: "0.4s",
                    borderRadius: "24px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: '""',
                      height: "18px",
                      width: "18px",
                      left: emailNotif ? "26px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      transition: "0.4s",
                      borderRadius: "50%",
                    }}
                  ></span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Bảo mật</h3>
        </div>
        <div className="card-body">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
            }}
          >
            <button
              className="btn btn-ghost"
              style={{ justifyContent: "flex-start" }}
            >
              🔒 Đổi mật khẩu
            </button>
            <button
              className="btn btn-ghost"
              style={{ justifyContent: "flex-start" }}
            >
              📱 Xác thực 2 yếu tố
            </button>
            <button
              className="btn btn-ghost"
              style={{
                justifyContent: "flex-start",
                color: "var(--danger-color)",
              }}
            >
              ⚠️ Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
