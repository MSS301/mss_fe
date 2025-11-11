import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getLessonById,
  incrementLessonView,
  getCommentsByLesson,
  createSelfComment,
  updateComment,
  deleteComment,
  getRatingsByLesson,
  createSelfRating,
  updateRating,
  deleteRating,
} from "../api/content";
import type {
  TeacherLessonResponse,
  LessonCommentResponse,
  LessonRatingResponse,
} from "../api/content";
import { getCurrentUserProfile } from "../api/auth";

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<TeacherLessonResponse | null>(null);
  const [comments, setComments] = useState<LessonCommentResponse[]>([]);
  const [commentsPage, setCommentsPage] = useState(0);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [ratings, setRatings] = useState<LessonRatingResponse[]>([]);
  const [userProfileId, setUserProfileId] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<LessonRatingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Editing states
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editingRating, setEditingRating] = useState(false);
  const [editRatingValue, setEditRatingValue] = useState(5);

  // Calculate average rating - show 0 if no ratings
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  useEffect(() => {
    async function load() {
      if (!token || !id) return;
      setLoading(true);
      setError(null);
      try {
        // Load user profile to get profileId
        const profile = await getCurrentUserProfile(token);
        if (profile) {
          setUserProfileId(profile.id);
        }

        const lessonData = await getLessonById(token, Number(id));
        setLesson(lessonData);
        
        // Increment view count
        incrementLessonView(token, Number(id));

        // Load comments and ratings
        const [commentsData, ratingsData] = await Promise.all([
          getCommentsByLesson(token, Number(id), 0, 10),
          getRatingsByLesson(token, Number(id)),
        ]);
        setComments(commentsData.content);
        setCommentsPage(0);
        setCommentsTotalPages(commentsData.pagination.totalPages);
        setRatings(ratingsData.content);

        // Check if user has already rated
        if (profile) {
          const existingRating = ratingsData.content.find(
            (r) => r.studentId === profile.id
          );
          setUserRating(existingRating || null);
          if (existingRating) {
            setNewRating(existingRating.rating);
          }
        }
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const loadMoreComments = async () => {
    if (!token || !id || commentsLoading) return;
    const nextPage = commentsPage + 1;
    if (nextPage >= commentsTotalPages) return;

    setCommentsLoading(true);
    try {
      const commentsData = await getCommentsByLesson(token, Number(id), nextPage, 10);
      setComments([...comments, ...commentsData.content]);
      setCommentsPage(nextPage);
    } catch (err: any) {
      console.error("Failed to load more comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const created = await createSelfComment(token, {
        lessonId: Number(id),
        comment: newComment.trim(),
      });
      setComments([created, ...comments]);
      setNewComment("");
      alert("Đã gửi bình luận!");
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;

    // If user already has a rating, update it instead
    if (userRating) {
      if (!editingRating) {
        setEditingRating(true);
        setEditRatingValue(userRating.rating);
        return;
      }

      setSubmittingRating(true);
      try {
        const updated = await updateRating(
          token,
          userRating.id,
          userRating.lessonId,
          userRating.studentId,
          editRatingValue
        );
        setRatings(ratings.map((r) => (r.id === updated.id ? updated : r)));
        setUserRating(updated);
        setEditingRating(false);
        alert("Đã cập nhật đánh giá!");
      } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
      } finally {
        setSubmittingRating(false);
      }
      return;
    }

    // Create new rating
    setSubmittingRating(true);
    try {
      const created = await createSelfRating(token, {
        lessonId: Number(id),
        rating: newRating,
      });
      setRatings([created, ...ratings]);
      setUserRating(created);
      alert("Đã gửi đánh giá!");
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!token || !userRating) return;
    if (!globalThis.confirm("Xóa đánh giá của bạn?")) return;

    try {
      await deleteRating(token, userRating.id);
      setRatings(ratings.filter((r) => r.id !== userRating.id));
      setUserRating(null);
      setNewRating(5);
      setEditingRating(false);
      alert("Đã xóa đánh giá!");
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  const handleEditComment = (comment: LessonCommentResponse) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.comment);
  };

  const handleUpdateComment = async (comment: LessonCommentResponse) => {
    if (!token || !editCommentText.trim()) return;

    try {
      const updated = await updateComment(
        token,
        comment.id,
        comment.lessonId,
        comment.studentId,
        editCommentText.trim()
      );
      setComments(comments.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCommentId(null);
      setEditCommentText("");
      alert("Đã cập nhật bình luận!");
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;
    if (!globalThis.confirm("Xóa bình luận này?")) return;

    try {
      await deleteComment(token, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      alert("Đã xóa bình luận!");
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Đang tải bài học...</div>;
  }

  if (error || !lesson) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "#d32f2f" }}>Lỗi: {error || "Không tìm thấy bài học"}</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : "0.0";

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: 6,
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          ← Quay lại
        </button>
        <h1 style={{ margin: "0 0 12px 0" }}>{lesson.title}</h1>
        <div style={{ fontSize: 14, color: "#666" }}>
          <span>Lớp: {lesson.classId || "Chung"}</span>
          <span style={{ margin: "0 12px" }}>•</span>
          <span>{lesson.viewCount || 0} lượt xem</span>
          <span style={{ margin: "0 12px" }}>•</span>
          <span>⭐ {averageRating.toFixed(1)} ({ratings.length} đánh giá)</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Main Content */}
        <div>
          {/* Lesson Files */}
          <div
            style={{
              padding: 24,
              backgroundColor: "white",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: 24,
            }}
          >
            <h3>Tài liệu bài học</h3>
            {lesson.lessonFiles && lesson.lessonFiles.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {lesson.lessonFiles.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      padding: 12,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{file.fileName}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {(file.fileSize / 1024).toFixed(2)} KB • {file.fileType}
                      </div>
                    </div>
                    <a
                      href={file.fileUrl}
                      download
                      style={{
                        padding: "6px 16px",
                        fontSize: 14,
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        textDecoration: "none",
                      }}
                    >
                      Tải xuống
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#999" }}>Chưa có tài liệu nào</p>
            )}
          </div>

          {/* Comments Section */}
          <div
            style={{
              padding: 24,
              backgroundColor: "white",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Bình luận ({comments.length})</h3>
            
            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} style={{ marginBottom: 24 }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                rows={3}
                style={{
                  width: "100%",
                  padding: 12,
                  fontSize: 14,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                style={{
                  marginTop: 8,
                  padding: "8px 20px",
                  fontSize: 14,
                  backgroundColor: submittingComment || !newComment.trim() ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: submittingComment || !newComment.trim() ? "not-allowed" : "pointer",
                }}
              >
                {submittingComment ? "Đang gửi..." : "Gửi bình luận"}
              </button>
            </form>

            {/* Comments List */}
            <div style={{ display: "grid", gap: 16 }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: 16,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 6,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ fontWeight: 600, marginRight: 8 }}>
                        {comment.studentName || `User #${comment.studentId}`}
                      </div>
                      <div style={{ fontSize: 12, color: "#999" }}>
                        {new Date(comment.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    
                    {/* Edit/Delete buttons for own comments */}
                    {userProfileId === comment.studentId && (
                      <div style={{ display: "flex", gap: 8 }}>
                        {editingCommentId === comment.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateComment(comment)}
                              style={{
                                padding: "4px 12px",
                                fontSize: 12,
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Lưu
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              style={{
                                padding: "4px 12px",
                                fontSize: 12,
                                backgroundColor: "#999",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Hủy
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditComment(comment)}
                              style={{
                                padding: "4px 12px",
                                fontSize: 12,
                                backgroundColor: "#2196F3",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              style={{
                                padding: "4px 12px",
                                fontSize: 12,
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Xóa
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Comment text - editable if editing */}
                  {editingCommentId === comment.id ? (
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: 8,
                        fontSize: 14,
                        border: "1px solid #2196F3",
                        borderRadius: 4,
                        boxSizing: "border-box",
                        resize: "vertical",
                      }}
                    />
                  ) : (
                    <div>{comment.comment}</div>
                  )}
                </div>
              ))}
              {comments.length === 0 && (
                <p style={{ color: "#999", textAlign: "center" }}>Chưa có bình luận nào</p>
              )}
              
              {/* Load More Button */}
              {commentsPage < commentsTotalPages - 1 && (
                <button
                  onClick={loadMoreComments}
                  disabled={commentsLoading}
                  style={{
                    padding: "12px 24px",
                    fontSize: 14,
                    backgroundColor: commentsLoading ? "#ccc" : "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: commentsLoading ? "not-allowed" : "pointer",
                    marginTop: 16,
                  }}
                >
                  {commentsLoading ? "Đang tải..." : "Xem thêm bình luận"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Rating Section */}
          <div
            style={{
              padding: 24,
              backgroundColor: "white",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: 24,
            }}
          >
            <h3>Đánh giá</h3>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, fontWeight: "bold", color: "#FF9800" }}>
                {avgRating}
              </div>
              <div style={{ fontSize: 14, color: "#666" }}>{ratings.length} đánh giá</div>
            </div>

            {userRating && !editingRating ? (
              /* Show existing rating with edit/delete buttons */
              <div style={{ marginBottom: 20 }}>
                <div style={{ padding: 16, backgroundColor: "#f9f9f9", borderRadius: 6, border: "1px solid #e0e0e0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Đánh giá của bạn</div>
                      <div style={{ fontSize: 24, color: "#FF9800" }}>
                        {"⭐".repeat(userRating.rating)} ({userRating.rating} sao)
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => {
                          setEditingRating(true);
                          setEditRatingValue(userRating.rating);
                        }}
                        style={{
                          padding: "8px 16px",
                          fontSize: 14,
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={handleDeleteRating}
                        style={{
                          padding: "8px 16px",
                          fontSize: 14,
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
                </div>
              </div>
            ) : (
              /* Show rating form */
              <form onSubmit={handleSubmitRating}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                    {userRating ? "Cập nhật đánh giá" : "Số sao"}
                  </label>
                  <select
                    value={editingRating ? editRatingValue : newRating}
                    onChange={(e) =>
                      editingRating
                        ? setEditRatingValue(Number(e.target.value))
                        : setNewRating(Number(e.target.value))
                    }
                    style={{
                      width: "100%",
                      padding: 8,
                      fontSize: 14,
                      border: "1px solid #ccc",
                      borderRadius: 6,
                    }}
                  >
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>
                        {"⭐".repeat(star)} ({star} sao)
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    disabled={submittingRating}
                    style={{
                      flex: 1,
                      padding: "10px",
                      fontSize: 14,
                      backgroundColor: submittingRating ? "#ccc" : "#FF9800",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: submittingRating ? "not-allowed" : "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {(() => {
                      if (submittingRating) return "Đang gửi...";
                      if (editingRating) return "Cập nhật";
                      return "Gửi đánh giá";
                    })()}
                  </button>
                  {editingRating && (
                    <button
                      type="button"
                      onClick={() => setEditingRating(false)}
                      style={{
                        padding: "10px 20px",
                        fontSize: 14,
                        backgroundColor: "#999",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
