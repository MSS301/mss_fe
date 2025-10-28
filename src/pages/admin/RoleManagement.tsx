import React from "react";
import "../../css/Dashboard.css";

export default function RoleManagement() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý vai trò & quyền</h3>
          <button className="btn btn-primary">
            <span>+</span>
            <span>Tạo vai trò</span>
          </button>
        </div>
        <div className="card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--spacing-lg)",
            }}
          >
            {/* Admin Role */}
            <div
              style={{
                border: "2px solid var(--primary-color)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-md)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--primary-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  👑
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "var(--font-size-lg)" }}>
                    ADMIN
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--font-size-sm)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Quản trị viên hệ thống
                  </p>
                </div>
              </div>
              <div style={{ marginBottom: "var(--spacing-md)" }}>
                <strong>Quyền:</strong>
                <ul
                  style={{
                    marginTop: "var(--spacing-xs)",
                    paddingLeft: "var(--spacing-lg)",
                  }}
                >
                  <li>✅ Quản lý toàn bộ hệ thống</li>
                  <li>✅ Quản lý người dùng</li>
                  <li>✅ Quản lý nội dung</li>
                  <li>✅ Cấu hình hệ thống</li>
                  <li>✅ Xem báo cáo</li>
                </ul>
              </div>
              <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                <button className="btn btn-ghost btn-sm">Sửa</button>
                <button className="btn btn-ghost btn-sm">Xem chi tiết</button>
              </div>
            </div>

            {/* Teacher Role */}
            <div
              style={{
                border: "2px solid var(--success-color)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-md)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--success-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  👨‍🏫
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "var(--font-size-lg)" }}>
                    TEACHER
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--font-size-sm)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Giáo viên
                  </p>
                </div>
              </div>
              <div style={{ marginBottom: "var(--spacing-md)" }}>
                <strong>Quyền:</strong>
                <ul
                  style={{
                    marginTop: "var(--spacing-xs)",
                    paddingLeft: "var(--spacing-lg)",
                  }}
                >
                  <li>✅ Tạo & quản lý slide</li>
                  <li>✅ Xem chương trình học</li>
                  <li>✅ Đánh giá học sinh</li>
                  <li>✅ Xem thống kê lớp</li>
                  <li>❌ Quản lý hệ thống</li>
                </ul>
              </div>
              <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                <button className="btn btn-ghost btn-sm">Sửa</button>
                <button className="btn btn-ghost btn-sm">Xem chi tiết</button>
              </div>
            </div>

            {/* Student Role */}
            <div
              style={{
                border: "2px solid var(--info-color)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-md)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--info-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  👨‍🎓
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "var(--font-size-lg)" }}>
                    STUDENT
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--font-size-sm)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Học sinh
                  </p>
                </div>
              </div>
              <div style={{ marginBottom: "var(--spacing-md)" }}>
                <strong>Quyền:</strong>
                <ul
                  style={{
                    marginTop: "var(--spacing-xs)",
                    paddingLeft: "var(--spacing-lg)",
                  }}
                >
                  <li>✅ Xem slide</li>
                  <li>✅ Tải tài liệu</li>
                  <li>✅ Đánh giá & bình luận</li>
                  <li>✅ Xem điểm & thống kê</li>
                  <li>❌ Tạo nội dung</li>
                </ul>
              </div>
              <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                <button className="btn btn-ghost btn-sm">Sửa</button>
                <button className="btn btn-ghost btn-sm">Xem chi tiết</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Phân quyền theo vai trò</h3>
        </div>
        <div className="card-body">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid var(--border-color)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Chức năng
                  </th>
                  <th
                    style={{
                      padding: "var(--spacing-md)",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Admin
                  </th>
                  <th
                    style={{
                      padding: "var(--spacing-md)",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Teacher
                  </th>
                  <th
                    style={{
                      padding: "var(--spacing-md)",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Student
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    Quản lý người dùng
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--success-color)",
                        fontSize: "20px",
                      }}
                    >
                      ✓
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{ color: "var(--danger-color)", fontSize: "20px" }}
                    >
                      ✗
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{ color: "var(--danger-color)", fontSize: "20px" }}
                    >
                      ✗
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    Tạo & chỉnh sửa slide
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--success-color)",
                        fontSize: "20px",
                      }}
                    >
                      ✓
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--success-color)",
                        fontSize: "20px",
                      }}
                    >
                      ✓
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{ color: "var(--danger-color)", fontSize: "20px" }}
                    >
                      ✗
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    Xem & tải slide
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--success-color)",
                        fontSize: "20px",
                      }}
                    >
                      ✓
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--success-color)",
                        fontSize: "20px",
                      }}
                    >
                      ✓
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--success-color)",
                        fontSize: "20px",
                      }}
                    >
                      ✓
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    Cấu hình hệ thống
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--success-color)",
                        fontSize: "20px",
                      }}
                    >
                      ✓
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{ color: "var(--danger-color)", fontSize: "20px" }}
                    >
                      ✗
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{ color: "var(--danger-color)", fontSize: "20px" }}
                    >
                      ✗
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
