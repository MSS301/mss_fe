import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { createSelfLesson } from "../../api/content";
import type { SelfTeacherLessonRequest } from "../../api/content";

export default function CreateLesson() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill classId from URL if provided
  useEffect(() => {
    const classIdParam = searchParams.get("classId");
    if (classIdParam) {
      setClassId(classIdParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Missing auth token");
    if (!title.trim()) return setError("Tiêu đề không được để trống");

    setSubmitting(true);
    setError(null);

    try {
      const request: SelfTeacherLessonRequest = {
        title: title.trim(),
        classId: classId ? Number(classId) : undefined,
        lessonStatus: status,
      };

      const created = await createSelfLesson(token, request);
      alert("Tạo bài học thành công!");
      navigate(`/lesson/${created.id}`);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 24 }}>Tạo bài học mới</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: 32,
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
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

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="title" style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
            Tiêu đề bài học <span style={{ color: "#d32f2f" }}>*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Bài 1 - Giới thiệu về lập trình"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 8,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="classId" style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
            Lớp học (tùy chọn)
          </label>
          <input
            id="classId"
            type="number"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            placeholder="Nhập ID lớp học"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 16,
              border: "1px solid #ccc",
              borderRadius: 8,
              boxSizing: "border-box",
            }}
          />
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            Để trống nếu bài học chưa được gán cho lớp nào
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>
            Trạng thái
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="radio"
                name="status"
                value="DRAFT"
                checked={status === "DRAFT"}
                onChange={() => setStatus("DRAFT")}
                style={{ marginRight: 6 }}
              />
              <span>Bản nháp</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="radio"
                name="status"
                value="PUBLISHED"
                checked={status === "PUBLISHED"}
                onChange={() => setStatus("PUBLISHED")}
                style={{ marginRight: 6 }}
              />
              <span>Xuất bản ngay</span>
            </label>
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            {status === "DRAFT"
              ? "Bài học sẽ được lưu dưới dạng bản nháp, chỉ bạn có thể xem"
              : "Bài học sẽ được xuất bản và học sinh có thể xem ngay"}
          </div>
        </div>

        <div
          style={{
            padding: 16,
            backgroundColor: "#e3f2fd",
            borderRadius: 8,
            marginBottom: 24,
            fontSize: 14,
            color: "#1976d2",
          }}
        >
          💡 <strong>Lưu ý:</strong> Sau khi tạo bài học, bạn có thể thêm file tài liệu, video và nội dung chi tiết
          ở trang chi tiết bài học.
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => navigate("/teacher/dashboard")}
            disabled={submitting}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: "#f5f5f5",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: 8,
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "12px 32px",
              fontSize: 16,
              backgroundColor: submitting ? "#ccc" : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 600,
              boxShadow: submitting ? "none" : "0 2px 6px rgba(33,150,243,0.3)",
            }}
          >
            {submitting ? "Đang tạo..." : "Tạo bài học"}
          </button>
        </div>
      </form>
    </div>
  );
}
