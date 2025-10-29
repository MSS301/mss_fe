import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/Dashboard.css";
// Định nghĩa kiểu dữ liệu cho user
interface Role {
  name: string;
  description: string;
}
interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  authProvider: string;
  roles: Role[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Lấy token từ localStorage
  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get<{ code: number; result: User[] }>(
          "http://localhost:8080/auth-service/users",
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (res.data.code === 1000) {
          setUsers(res.data.result);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Đã thay thế bằng getToken()

  const handleEdit = async (id: string) => {
    try {
      const res = await axios.get<{ code: number; result: User }>(
        `http://localhost:8080/auth-service/users/${id}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (res.data.code === 1000 && res.data.result) {
        setSelectedUser(res.data.result);
        setShowModal(true);
      }
    } catch (err) {
      // handle error
    }
  };

  // Hàm cập nhật người dùng
  const handleUpdate = async (data: {
    password?: string;
    firstName?: string;
    lastName?: string;
    dob?: string;
    roles?: string[];
  }) => {
    if (!selectedUser) return;
    try {
      const res = await axios.put<{ code: number; result: User }>(
        `http://localhost:8080/auth-service/users/${selectedUser.id}`,
        data,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.code === 1000 && res.data.result) {
        setSelectedUser(res.data.result);
        alert("Cập nhật thành công!");
        setShowModal(false);
        // Reload user list
        window.location.reload();
      }
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  // Hàm xóa người dùng
  const handleDelete = async () => {
    if (!selectedUser) return;
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const res = await axios.delete<{ code: number }>(
        `http://localhost:8080/auth-service/users/${selectedUser.id}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (res.data.code === 1000) {
        alert("Xóa thành công!");
        setShowModal(false);
        window.location.reload();
      }
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <button className="btn btn-primary">
            <span>+</span>
            <span>Thêm người dùng</span>
          </button>
        </div>
        <div className="card-body">
          <div style={{ overflowX: "auto" }}>
            {loading ? (
              <div>Đang tải...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid var(--border-color)",
                      textAlign: "left",
                    }}
                  >
                    <th
                      style={{ padding: "var(--spacing-md)", fontWeight: 600 }}
                    >
                      ID
                    </th>
                    <th
                      style={{ padding: "var(--spacing-md)", fontWeight: 600 }}
                    >
                      Tên
                    </th>
                    <th
                      style={{ padding: "var(--spacing-md)", fontWeight: 600 }}
                    >
                      Email
                    </th>
                    <th
                      style={{ padding: "var(--spacing-md)", fontWeight: 600 }}
                    >
                      Vai trò
                    </th>
                    <th
                      style={{ padding: "var(--spacing-md)", fontWeight: 600 }}
                    >
                      Trạng thái
                    </th>
                    <th
                      style={{ padding: "var(--spacing-md)", fontWeight: 600 }}
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {user.id}
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {user.username}
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {user.email}
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role, idx) => (
                            <span
                              key={idx}
                              className="badge badge-primary"
                              style={{ marginRight: 4 }}
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="badge badge-info">User</span>
                        )}
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <span
                          className={
                            "badge " +
                            (user.emailVerified
                              ? "badge-success"
                              : "badge-warning")
                          }
                        >
                          {user.emailVerified ? "Active" : "Pending"}
                        </span>
                      </td>
                      <td style={{ padding: "var(--spacing-md)" }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleEdit(user.id)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: "var(--danger-color)" }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal hiển thị thông tin người dùng và nút cập nhật/xóa */}
      {showModal && selectedUser && (
        <div
          className="modal"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              minWidth: 280,
              maxWidth: "95vw",
              width: "100%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              margin: "0 auto",
              overflowY: "auto",
              maxHeight: "90vh",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: 18,
                color: "#2d6cdf",
              }}
            >
              Thông tin người dùng
            </h2>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <b>ID:</b> {selectedUser.id}
            </div>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <b>Tên:</b> {selectedUser.username}
            </div>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <b>Email:</b> {selectedUser.email}
            </div>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <b>Trạng thái email:</b>{" "}
              <span
                style={{
                  color: selectedUser.emailVerified ? "#2ecc40" : "#f39c12",
                }}
              >
                {selectedUser.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
              </span>
            </div>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <b>Provider:</b> {selectedUser.authProvider}
            </div>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <b>Vai trò:</b>{" "}
              {selectedUser.roles && selectedUser.roles.length > 0 ? (
                selectedUser.roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="badge badge-primary"
                    style={{
                      marginRight: 4,
                      background: "#2d6cdf",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  >
                    {role.name}
                  </span>
                ))
              ) : (
                <span className="badge badge-info">User</span>
              )}
            </div>
            {/* Form cập nhật đơn giản */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const password = (form.password as HTMLInputElement).value;
                const firstName = (form.firstName as HTMLInputElement).value;
                const lastName = (form.lastName as HTMLInputElement).value;
                const dob = (form.dob as HTMLInputElement).value;
                const roles = (form.roles as HTMLInputElement).value
                  .split(",")
                  .map((r) => r.trim())
                  .filter((r) => r);
                handleUpdate({ password, firstName, lastName, dob, roles });
              }}
              style={{
                marginTop: 18,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontWeight: 500 }}>Mật khẩu mới</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    padding: "8px",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontWeight: 500 }}>Họ</label>
                <input
                  name="firstName"
                  type="text"
                  className="form-control"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    padding: "8px",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontWeight: 500 }}>Tên</label>
                <input
                  name="lastName"
                  type="text"
                  className="form-control"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    padding: "8px",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontWeight: 500 }}>Ngày sinh</label>
                <input
                  name="dob"
                  type="date"
                  className="form-control"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    padding: "8px",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontWeight: 500 }}>
                  Vai trò (phân cách dấu phẩy)
                </label>
                <input
                  name="roles"
                  type="text"
                  className="form-control"
                  placeholder="ADMIN,TEACHER,USER"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                    padding: "8px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 10,
                  justifyContent: "center",
                }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: "#2d6cdf",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 600,
                    padding: "8px 18px",
                    border: "none",
                  }}
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 600,
                    padding: "8px 18px",
                    border: "none",
                  }}
                >
                  Xóa
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "#888",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 600,
                    padding: "8px 18px",
                    border: "none",
                  }}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ...existing code for stats-grid... */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">👥</div>
          <div className="stat-content">
            <div className="stat-label">Tổng người dùng</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-change positive">
              <span>↑ 12%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">👨‍🏫</div>
          <div className="stat-content">
            <div className="stat-label">Giáo viên</div>
            <div className="stat-value">
              {
                users.filter(
                  (u) => u.roles && u.roles.some((r) => r.name === "TEACHER")
                ).length
              }
            </div>
            <div className="stat-change positive">
              <span>↑ 8%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">👨‍🎓</div>
          <div className="stat-content">
            <div className="stat-label">Học sinh</div>
            <div className="stat-value">
              {users.filter((u) => !u.roles || u.roles.length === 0).length}
            </div>
            <div className="stat-change positive">
              <span>↑ 15%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Chờ duyệt</div>
            <div className="stat-value">
              {users.filter((u) => !u.emailVerified).length}
            </div>
            <div className="stat-change">
              <span>Cần xử lý</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
