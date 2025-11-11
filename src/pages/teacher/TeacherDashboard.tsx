import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getMyLessons } from "../../api/content";
import type { TeacherLessonResponse } from "../../api/content";

export default function TeacherDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<TeacherLessonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    loadLessons(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadLessons = async (page: number = 0) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getMyLessons(token, page, pageSize);
      setLessons(result.content);
      setCurrentPage(result.pagination.page);
      setTotalPages(result.pagination.totalPages);

      // Calculate stats
      const published = result.content.filter((l) => l.lessonStatus === "PUBLISHED").length;
      const draft = result.content.filter((l) => l.lessonStatus === "DRAFT").length;
      const totalViews = result.content.reduce((sum, l) => sum + (l.viewCount || 0), 0);

      setStats({
        total: result.pagination.totalElements,
        published,
        draft,
        totalViews,
      });
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Đang tải...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ margin: 0 }}>Dashboard Giáo viên</h2>
        <button
          onClick={() => navigate("/teacher/create-lesson")}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(33,150,243,0.3)",
          }}
        >
          + Tạo bài học mới
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

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard title="Tổng bài học" value={stats.total} color="#2196F3" />
        <StatCard title="Đã xuất bản" value={stats.published} color="#4CAF50" />
        <StatCard title="Bản nháp" value={stats.draft} color="#FF9800" />
        <StatCard title="Tổng lượt xem" value={stats.totalViews} color="#9C27B0" />
      </div>

      {/* Recent Lessons */}
      <div>
        <h3 style={{ marginBottom: 16 }}>Bài học gần đây</h3>
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
            <p style={{ fontSize: 16, marginBottom: 16 }}>Bạn chưa có bài học nào</p>
            <button
              onClick={() => navigate("/teacher/create-lesson")}
              style={{
                padding: "10px 20px",
                fontSize: 14,
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Tạo bài học đầu tiên
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {lessons.slice(0, 5).map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                style={{
                  padding: 20,
                  backgroundColor: "white",
                  borderRadius: 8,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "1px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: 18 }}>{lesson.title}</h4>
                    <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                      <span>Lớp: {lesson.classId || "Chưa gán"}</span>
                      <span style={{ margin: "0 12px" }}>•</span>
                      <span>{lesson.viewCount || 0} lượt xem</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      Cập nhật: {new Date(lesson.updatedAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={lesson.lessonStatus} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 24 }}>
            <button
              onClick={() => loadLessons(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: currentPage === 0 ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Trang trước
            </button>
            <span style={{ fontSize: 14, color: "#666" }}>
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => loadLessons(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || loading}
              style={{
                padding: "8px 16px",
                fontSize: 14,
                backgroundColor: currentPage >= totalPages - 1 ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
              }}
            >
              Trang sau →
            </button>
          </div>
        )}
        
        {lessons.length > 5 && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              onClick={() => navigate("/teacher/lessons")}
              style={{
                padding: "10px 24px",
                fontSize: 14,
                backgroundColor: "#f5f5f5",
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Xem tất cả ({stats.total})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div
      style={{
        padding: 24,
        backgroundColor: "white",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: `2px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: "bold", color }}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    PUBLISHED: { bg: "#e8f5e9", text: "#2e7d32" },
    DRAFT: { bg: "#fff3e0", text: "#e65100" },
    ARCHIVED: { bg: "#f5f5f5", text: "#616161" },
  };

  const style = colors[status] || colors.DRAFT;

  return (
    <span
      style={{
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.text,
        borderRadius: 16,
        textTransform: "uppercase",
      }}
    >
      {status === "PUBLISHED" ? "Xuất bản" : status === "DRAFT" ? "Nháp" : "Lưu trữ"}
    </span>
  );
}
