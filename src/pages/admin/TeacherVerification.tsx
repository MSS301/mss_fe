import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAllPendingTeacherProfiles, promoteToTeacher, resolveAvatarUrl } from "../../api/auth";
import type { UserProfileResult } from "../../api/auth";

export default function TeacherVerification() {
  const { token } = useAuth();
  const [profiles, setProfiles] = useState<UserProfileResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadPendingProfiles = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAllPendingTeacherProfiles(token, page, 10);
      setProfiles(result.content);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page]);

  const handleApprove = async (profile: UserProfileResult) => {
    if (!token || !profile.accountId) return;
    setProcessingId(profile.id);
    setError(null);
    try {
      await promoteToTeacher(token, profile.accountId);
      alert(`Đã phê duyệt ${profile.fullName} trở thành giáo viên!`);
      loadPendingProfiles();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (profile: UserProfileResult) => {
    // For now, just remove from list (you can implement actual rejection API later)
    alert(`Từ chối hồ sơ của ${profile.fullName}`);
    setProfiles(profiles.filter((p) => p.id !== profile.id));
  };

  if (loading && profiles.length === 0) {
    return <div style={{ padding: 24 }}>Đang tải danh sách chờ duyệt...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Phê duyệt giáo viên</h2>

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

      {profiles.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
          Không có hồ sơ nào đang chờ duyệt
        </div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        {profiles.map((profile) => (
          <div
            key={profile.id}
            style={{
              padding: 20,
              backgroundColor: "white",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "1px solid #e0e0e0",
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "start" }}>
              {/* Avatar */}
              <img
                src={resolveAvatarUrl(profile.avatarUrl) || "https://via.placeholder.com/120"}
                alt={profile.fullName || "User"}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 8,
                  objectFit: "cover",
                  border: "2px solid #ddd",
                }}
              />

              {/* Profile Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ marginTop: 0, marginBottom: 12 }}>{profile.fullName}</h3>
                <div style={{ marginBottom: 8, color: "#666" }}>
                  <strong>Vai trò:</strong> {profile.role}
                </div>
                <div style={{ marginBottom: 8, color: "#666" }}>
                  <strong>Trường:</strong> {profile.schoolName || profile.schoolId || "Chưa có"}
                </div>
                <div style={{ marginBottom: 8, color: "#666" }}>
                  <strong>Ngày sinh:</strong> {profile.dateOfBirth || "Chưa có"}
                </div>
                <div style={{ marginBottom: 12, color: "#666" }}>
                  <strong>Ngày tạo:</strong>{" "}
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleString("vi-VN") : "N/A"}
                </div>

                {/* Teacher Proof */}
                {profile.teacherProofUrl && (
                  <div style={{ marginBottom: 12 }}>
                    <strong>Giấy tờ chứng minh:</strong>
                    <div style={{ marginTop: 8 }}>
                      {profile.teacherProofUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img
                          src={resolveAvatarUrl(profile.teacherProofUrl) || ""}
                          alt="Teacher Proof"
                          style={{
                            maxWidth: "100%",
                            maxHeight: 300,
                            borderRadius: 8,
                            border: "1px solid #ddd",
                          }}
                        />
                      ) : (
                        <a
                          href={resolveAvatarUrl(profile.teacherProofUrl) || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#2196F3", textDecoration: "underline" }}
                        >
                          Xem file chứng minh
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => handleReject(profile)}
                disabled={processingId === profile.id}
                style={{
                  padding: "10px 24px",
                  fontSize: 14,
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: processingId === profile.id ? "not-allowed" : "pointer",
                  opacity: processingId === profile.id ? 0.6 : 1,
                }}
              >
                Từ chối
              </button>
              <button
                onClick={() => handleApprove(profile)}
                disabled={processingId === profile.id}
                style={{
                  padding: "10px 24px",
                  fontSize: 14,
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: processingId === profile.id ? "not-allowed" : "pointer",
                  opacity: processingId === profile.id ? 0.6 : 1,
                }}
              >
                {processingId === profile.id ? "Đang xử lý..." : "Phê duyệt"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 8 }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              padding: "8px 16px",
              cursor: page === 0 ? "not-allowed" : "pointer",
              opacity: page === 0 ? 0.5 : 1,
            }}
          >
            ← Trước
          </button>
          <span style={{ padding: "8px 16px" }}>
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              padding: "8px 16px",
              cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
              opacity: page >= totalPages - 1 ? 0.5 : 1,
            }}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
