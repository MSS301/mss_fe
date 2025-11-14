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
        const res = await axios.get<{
          code: number;
          result?: User[];
          content?: User[];
          data?: { code: number; result?: User[]; content?: User[] };
        }>("http://localhost:8080/auth-service/users", {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        console.log(JSON.stringify(res))
        const body = res.data?.data ?? res.data;
        const list = body?.result ?? body?.content;
        if (body?.code === 1000 && Array.isArray(list)) {
          setUsers(list);
        } else if (Array.isArray(res.data?.result)) {
          setUsers(res.data.result);
        } else if (Array.isArray(res.data?.content)) {
          setUsers(res.data.content);
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
          className="modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-card"
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 32px",
              width: "min(520px, 100%)",
              boxShadow: "0 20px 60px rgba(15,23,42,0.35)",
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  Thông tin người dùng
                </p>
                <p
                  style={{
                    margin: 4,
                    fontSize: 14,
                    color: "#475569",
                  }}
                >
                  Chỉnh sửa quyền hoặc xóa tài khoản khi cần
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 24,
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
                aria-label="Đóng modal"
              >
                &times;
              </button>
            </header>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                { label: "ID", value: selectedUser.id },
                { label: "Tên", value: selectedUser.username },
                { label: "Email", value: selectedUser.email },
                {
                  label: "Trạng thái email",
                  value: selectedUser.emailVerified ? "Đã xác thực" : "Chưa xác thực",
                  accent: selectedUser.emailVerified ? "#16a34a" : "#f97316",
                },
                { label: "Provider", value: selectedUser.authProvider },
              ].map((info) => (
                <div
                  key={info.label}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 1,
                      color: "#475569",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {info.label}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: info.accent || "#0f172a",
                      fontWeight: info.accent ? 600 : 500,
                      wordBreak: "break-word",
                    }}
                  >
                    {info.value}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginBottom: 18,
                fontSize: 15,
              }}
            >
              <span style={{ fontWeight: 600, color: "#475569" }}>Vai trò: </span>
              {selectedUser.roles && selectedUser.roles.length > 0 ? (
                selectedUser.roles.map((role, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginRight: 6,
                      marginBottom: 4,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background:
                        role.name === "TEACHER" ? "#e0f2fe" : "#ede9fe",
                      color: role.name === "TEACHER" ? "#0284c7" : "#7c3aed",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {role.name}
                  </span>
                ))
              ) : (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "#e0f2fe",
                    color: "#0284c7",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  USER
                </span>
              )}
            </div>

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
                display: "grid",
                gap: 12,
              }}
            >
              {[
                { name: "password", label: "Mật khẩu mới", type: "password" },
                { name: "firstName", label: "Họ", type: "text" },
                { name: "lastName", label: "Tên", type: "text" },
                { name: "dob", label: "Ngày sinh", type: "date" },
                {
                  name: "roles",
                  label: "Vai trò (phân cách dấu phẩy)",
                  type: "text",
                  placeholder: "ADMIN,TEACHER,USER",
                },
              ].map((field) => (
                <div
                  key={field.name}
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  <label style={{ fontWeight: 600, color: "#475569" }}>
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="form-control"
                    style={{
                      borderRadius: 10,
                      border: "1px solid #d1d5db",
                      padding: "10px 12px",
                      fontSize: 14,
                    }}
                  />
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  marginTop: 4,
                }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    flex: "1 1 140px",
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    color: "#fff",
                    borderRadius: 10,
                    border: "none",
                    padding: "10px 16px",
                    fontWeight: 600,
                    boxShadow: "0 4px 10px rgba(37,99,235,0.35)",
                  }}
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                  style={{
                    flex: "1 1 110px",
                    background: "#f43f5e",
                    color: "#fff",
                    borderRadius: 10,
                    border: "none",
                    padding: "10px 16px",
                    fontWeight: 600,
                  }}
                >
                  Xóa
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: "1 1 110px",
                    background: "#64748b",
                    color: "#fff",
                    borderRadius: 10,
                    border: "none",
                    padding: "10px 16px",
                    fontWeight: 600,
                  }}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
