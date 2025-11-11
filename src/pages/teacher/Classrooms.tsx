import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getMyClassrooms, createClassroom, deleteClassroom } from "../../api/classroom";
import type { ClassroomResponse, CreateClassroomRequest } from "../../api/classroom";
import { getCurrentUserProfile } from "../../api/auth";

export default function Classrooms() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [password, setPassword] = useState("");
  const [schoolId, setSchoolId] = useState<number | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadClassrooms();
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadProfile = async () => {
    if (!token) return;
    try {
      const profile = await getCurrentUserProfile(token);
      if (profile && profile.schoolId) {
        setSchoolId(profile.schoolId);
      }
    } catch (err) {
      console.warn("Could not load profile:", err);
    }
  };

  const loadClassrooms = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getMyClassrooms(token, 0, 7);
      setClassrooms(result.content);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Missing auth token");
    if (!name.trim()) return setError("Tên lớp học không được để trống");
    if (!schoolId) return setError("School ID is required");

    setSubmitting(true);
    setError(null);

    try {
      const request: CreateClassroomRequest = {
        name: name.trim(),
        schoolId: schoolId,
        grade: grade ? Number(grade) : undefined,
        password: password.trim() || undefined,
      };

      await createClassroom(token, request);
      alert("Tạo lớp học thành công!");
      setShowCreateForm(false);
      setName("");
      setGrade("");
      setPassword("");
      loadClassrooms();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClassroom = async (id: number, className: string) => {
    if (!token) return;
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Bạn có chắc muốn xóa lớp "${className}"?`)) return;

    try {
      await deleteClassroom(token, id);
      alert("Đã xóa lớp học!");
      loadClassrooms();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  if (loading && classrooms.length === 0) {
    return <div style={{ padding: 24 }}>Đang tải danh sách lớp học...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Lớp học của tôi</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(76,175,80,0.3)",
          }}
        >
          {showCreateForm ? "Hủy" : "+ Tạo lớp học mới"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: 6,
            border: "1px solid #ef5350",
          }}
        >
          {error}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateClassroom}
          style={{
            padding: 24,
            backgroundColor: "white",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: 24,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Tạo lớp học mới</h3>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
              Tên lớp học <span style={{ color: "#d32f2f" }}>*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Lớp 10A1"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 15,
                border: "1px solid #ccc",
                borderRadius: 6,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="grade" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
              Khối (tùy chọn)
            </label>
            <input
              id="grade"
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Ví dụ: 10, 11, 12"
              min="1"
              max="12"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 15,
                border: "1px solid #ccc",
                borderRadius: 6,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
              Mật khẩu (tùy chọn)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu để học sinh tham gia lớp"
              minLength={4}
              maxLength={100}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 15,
                border: "1px solid #ccc",
                borderRadius: 6,
                boxSizing: "border-box",
              }}
            />
            <small style={{ color: "#666", fontSize: 13 }}>
              Nếu có mật khẩu, học sinh cần nhập mật khẩu để tham gia lớp
            </small>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              disabled={submitting}
              style={{
                padding: "10px 24px",
                fontSize: 14,
                backgroundColor: "#f5f5f5",
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: 6,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "10px 24px",
                fontSize: 14,
                backgroundColor: submitting ? "#ccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: submitting ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {submitting ? "Đang tạo..." : "Tạo lớp học"}
            </button>
          </div>
        </form>
      )}

      {/* Classrooms List */}
      {classrooms.length === 0 && !loading ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            color: "#999",
          }}
        >
          <p style={{ fontSize: 16, marginBottom: 16 }}>Bạn chưa có lớp học nào</p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Tạo lớp học đầu tiên
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              role="button"
              tabIndex={0}
              style={{
                padding: 20,
                backgroundColor: "white",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "1px solid #e0e0e0",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => navigate(`/teacher/classrooms/${classroom.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/teacher/classrooms/${classroom.id}`);
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <h3 style={{ margin: "0 0 12px 0", fontSize: 18, color: "#2196F3" }}>{classroom.name}</h3>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 8 }}>
                <div>Trường: {classroom.schoolName || "Chưa xác định"}</div>
                <div>
                  Học sinh: {classroom.enrollmentCount || 0}
                  {classroom.capacity ? ` / ${classroom.capacity}` : ""}
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClassroom(classroom.id, classroom.name);
                  }}
                  style={{
                    padding: "8px 12px",
                    fontSize: 13,
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
