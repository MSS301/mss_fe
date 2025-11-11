import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getClassroomById } from "../../api/classroom";
import { getMyLessons, createSelfLesson } from "../../api/content";
import type { ClassroomResponse } from "../../api/classroom";
import type { TeacherLessonResponse, SelfTeacherLessonRequest } from "../../api/content";

export default function ClassroomDetail() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [classroom, setClassroom] = useState<ClassroomResponse | null>(null);
  const [lessons, setLessons] = useState<TeacherLessonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create lesson form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonStatus, setLessonStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id && token) {
      loadClassroom();
      loadLessons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const loadClassroom = async () => {
    if (!token || !id) return;
    try {
      const data = await getClassroomById(token, Number(id));
      setClassroom(data);
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  const loadLessons = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getMyLessons(token, 0, 100);
      // Filter lessons by classId
      const classLessons = result.content.filter(
        (lesson) => lesson.classId === Number(id)
      );
      setLessons(classLessons);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;
    if (!lessonTitle.trim()) return setError("Tiêu đề bài học không được để trống");

    setSubmitting(true);
    setError(null);

    try {
      const request: SelfTeacherLessonRequest = {
        title: lessonTitle.trim(),
        classId: Number(id),
        lessonStatus: lessonStatus,
      };

      await createSelfLesson(token, request);
      alert("Tạo bài học thành công!");
      setShowCreateForm(false);
      setLessonTitle("");
      setLessonStatus("DRAFT");
      loadLessons();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !classroom) {
    return <div style={{ padding: 24 }}>Đang tải...</div>;
  }

  if (!classroom) {
    return <div style={{ padding: 24 }}>Không tìm thấy lớp học</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate("/teacher/classrooms")}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            backgroundColor: "#f5f5f5",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: 6,
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          ← Quay lại
        </button>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, marginBottom: 8 }}>{classroom.name}</h2>
            <p style={{ margin: 0, color: "#666" }}>
              Trường: {classroom.schoolName || "Chưa xác định"} | 
              Học sinh: {classroom.enrollmentCount || 0}
              {classroom.capacity ? ` / ${classroom.capacity}` : ""}
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>+</span>
            Tạo bài học
          </button>
        </div>
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

      {/* Create Lesson Modal */}
      {showCreateForm && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={() => setShowCreateForm(false)}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: 32,
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              zIndex: 1000,
              minWidth: 500,
              maxWidth: "90%",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 24 }}>Tạo bài học mới</h3>
            
            <form onSubmit={handleCreateLesson}>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="lessonTitle" style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                  Tiêu đề bài học <span style={{ color: "#d32f2f" }}>*</span>
                </label>
                <input
                  id="lessonTitle"
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Ví dụ: Bài 1 - Giới thiệu về lập trình"
                  required
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
                <label htmlFor="lessonStatus" style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                  Trạng thái
                </label>
                <select
                  id="lessonStatus"
                  value={lessonStatus}
                  onChange={(e) => setLessonStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: 16,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    boxSizing: "border-box",
                  }}
                >
                  <option value="DRAFT">Nháp</option>
                  <option value="PUBLISHED">Xuất bản</option>
                </select>
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
                    backgroundColor: submitting ? "#ccc" : "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontWeight: 600,
                  }}
                >
                  {submitting ? "Đang tạo..." : "Tạo bài học"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Lessons List */}
      <div>
        <h3 style={{ marginBottom: 16 }}>Danh sách bài học ({lessons.length})</h3>
        
        {lessons.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
              color: "#999",
            }}
          >
            <p style={{ fontSize: 16 }}>Chưa có bài học nào</p>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: "10px 20px",
                fontSize: 14,
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                marginTop: 16,
              }}
            >
              Tạo bài học đầu tiên
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                style={{
                  padding: 20,
                  backgroundColor: "white",
                  borderRadius: 8,
                  border: "1px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div>
                  <h4 style={{ margin: 0, marginBottom: 8, color: "#2196F3" }}>
                    {lesson.title}
                  </h4>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    Lượt xem: {lesson.viewCount || 0}
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    backgroundColor:
                      lesson.lessonStatus === "PUBLISHED"
                        ? "#e8f5e9"
                        : lesson.lessonStatus === "DRAFT"
                        ? "#fff3e0"
                        : "#f5f5f5",
                    color:
                      lesson.lessonStatus === "PUBLISHED"
                        ? "#2e7d32"
                        : lesson.lessonStatus === "DRAFT"
                        ? "#f57c00"
                        : "#666",
                  }}
                >
                  {lesson.lessonStatus === "PUBLISHED"
                    ? "Xuất bản"
                    : lesson.lessonStatus === "DRAFT"
                    ? "Nháp"
                    : "Lưu trữ"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
