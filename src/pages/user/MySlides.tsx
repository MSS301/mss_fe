import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  listMySlides,
  SlideListItem,
  getLessonById,
  getGradeById,
  getSubjectById,
  getBookById,
  getChapterById,
} from "../../api/aiService";
import ReactMarkdown from "react-markdown";
import "../../css/Dashboard.css";
import "./MySlides.css";

export default function MySlides() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [slides, setSlides] = useState<SlideListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [selectedSlide, setSelectedSlide] = useState<SlideListItem | null>(
    null
  );
  const [namesMap, setNamesMap] = useState<{
    grades: Record<string, string>;
    subjects: Record<string, string>;
    books: Record<string, string>;
    chapters: Record<string, string>;
    lessons: Record<string, string>;
  }>({
    grades: {},
    subjects: {},
    books: {},
    chapters: {},
    lessons: {},
  });

  useEffect(() => {
    if (token && user) {
      loadSlides();
    }
  }, [token, user, page]);

  const loadSlides = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const skip = (page - 1) * limit;
      const response = await listMySlides(token, limit, skip);
      setSlides(response.slides);
      setTotal(response.total);

      // Load names for all IDs
      await loadNamesForSlides(response.slides);
    } catch (err: any) {
      console.error("[MySlides] Error loading slides:", err);
      setError(`Lỗi khi tải slides: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const loadNamesForSlides = async (slides: SlideListItem[]) => {
    if (!token) return;

    const gradesToLoad = new Set<string>();
    const subjectsToLoad = new Set<string>();
    const booksToLoad = new Set<string>();
    const chaptersToLoad = new Set<string>();
    const lessonsToLoad = new Set<string>();

    slides.forEach((slide) => {
      if (slide.grade_id) gradesToLoad.add(slide.grade_id);
      if (slide.subject_id) subjectsToLoad.add(slide.subject_id);
      if (slide.book_id) booksToLoad.add(slide.book_id);
      if (slide.chapter_id) chaptersToLoad.add(slide.chapter_id);
      if (slide.lesson_id) lessonsToLoad.add(slide.lesson_id);
    });

    const newNamesMap = { ...namesMap };

    // Load grades
    for (const gradeId of gradesToLoad) {
      if (!newNamesMap.grades[gradeId]) {
        try {
          const grade = await getGradeById(token, gradeId);
          newNamesMap.grades[gradeId] = grade.grade_name;
        } catch (err) {
          console.error(`[MySlides] Error loading grade ${gradeId}:`, err);
          newNamesMap.grades[gradeId] = gradeId;
        }
      }
    }

    // Load subjects
    for (const subjectId of subjectsToLoad) {
      if (!newNamesMap.subjects[subjectId]) {
        try {
          const subject = await getSubjectById(token, subjectId);
          newNamesMap.subjects[subjectId] = subject.subject_name;
        } catch (err) {
          console.error(`[MySlides] Error loading subject ${subjectId}:`, err);
          newNamesMap.subjects[subjectId] = subjectId;
        }
      }
    }

    // Load books
    for (const bookId of booksToLoad) {
      if (!newNamesMap.books[bookId]) {
        try {
          const book = await getBookById(token, bookId);
          newNamesMap.books[bookId] = book.book_name;
        } catch (err) {
          console.error(`[MySlides] Error loading book ${bookId}:`, err);
          newNamesMap.books[bookId] = bookId;
        }
      }
    }

    // Load chapters
    for (const chapterId of chaptersToLoad) {
      if (!newNamesMap.chapters[chapterId]) {
        try {
          const chapter = await getChapterById(token, chapterId);
          newNamesMap.chapters[chapterId] = chapter.title;
        } catch (err) {
          console.error(`[MySlides] Error loading chapter ${chapterId}:`, err);
          newNamesMap.chapters[chapterId] = chapterId;
        }
      }
    }

    // Load lessons
    for (const lessonId of lessonsToLoad) {
      if (!newNamesMap.lessons[lessonId]) {
        try {
          const lesson = await getLessonById(token, lessonId);
          newNamesMap.lessons[lessonId] = lesson.title;
        } catch (err) {
          console.error(`[MySlides] Error loading lesson ${lessonId}:`, err);
          newNamesMap.lessons[lessonId] = lessonId;
        }
      }
    }

    setNamesMap(newNamesMap);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getPreviewText = (
    contentText: string | null | undefined,
    maxLength: number = 150
  ) => {
    if (!contentText) return "Không có mô tả";
    if (contentText.length <= maxLength) return contentText;
    return contentText.substring(0, maxLength) + "...";
  };

  const handleViewSlide = (slide: SlideListItem) => {
    if (slide.slidesgpt?.embed) {
      window.open(slide.slidesgpt.embed, "_blank");
    } else if (slide.slidesgpt?.download) {
      window.open(slide.slidesgpt.download, "_blank");
    }
  };

  const handleDownloadSlide = async (slide: SlideListItem) => {
    if (!slide.slidesgpt?.download) {
      setError("Không có link download cho slide này");
      return;
    }

    // Nếu là relative URL (template export), cần gọi API với full URL
    if (slide.slidesgpt.download.startsWith("/")) {
      try {
        const response = await fetch(
          `http://localhost:8080/ai-chatbot-service${slide.slidesgpt.download}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-User-Id": user?.id || "",
            },
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            (slide.slidesgpt as any)?.filename ||
            `slide_${slide.content_id}.pptx`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          setError("Không thể tải slide. Vui lòng thử lại.");
        }
      } catch (err: any) {
        console.error("[MySlides] Error downloading slide:", err);
        setError("Lỗi khi tải slide: " + (err.message || "Lỗi không xác định"));
      }
    } else {
      // External URL (SlidesGPT)
      window.open(slide.slidesgpt.download, "_blank");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Slides của tôi</h2>
          <div className="my-slides-header-actions">
            <div className="my-slides-stats">
              <span className="my-slides-count">
                Tổng cộng: <strong>{total}</strong> slides
              </span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/genai")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Tạo slide mới</span>
            </button>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="my-slides-loading">
              <div className="my-slides-spinner"></div>
              <p>Đang tải slides...</p>
            </div>
          ) : error ? (
            <div className="my-slides-error">
              <div className="my-slides-error-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <p className="my-slides-error-text">{error}</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setPage(1);
                  loadSlides();
                }}
              >
                Thử lại
              </button>
            </div>
          ) : slides.length === 0 ? (
            <div className="my-slides-empty">
              <div className="my-slides-empty-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="9" y1="9" x2="21" y2="9"></line>
                </svg>
              </div>
              <h3>Chưa có slides nào</h3>
              <p>Bạn chưa tạo slide nào. Hãy tạo slide mới để bắt đầu!</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/genai")}
              >
                Tạo slide mới
              </button>
            </div>
          ) : (
            <>
              <div className="slide-list-vertical">
                {slides.map((slide) => (
                  <div key={slide.content_id} className="slide-item-vertical">
                    <div className="slide-item-content">
                      <div className="slide-title-short">
                        {slide.lesson_id && namesMap.lessons[slide.lesson_id]
                          ? namesMap.lessons[slide.lesson_id]
                          : slide.content_text
                          ? getPreviewText(slide.content_text, 80)
                          : `Slide ${slide.content_id.substring(0, 8)}`}
                      </div>
                      <div className="slide-date">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {formatDate(
                          slide.slidesgpt?.created_at || slide.created_at
                        )}
                      </div>
                    </div>
                    <div className="slide-actions-vertical">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedSlide(slide)}
                        title="Xem chi tiết"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        Chi tiết
                      </button>
                      {slide.slidesgpt?.download && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleDownloadSlide(slide)}
                          title="Tải xuống"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Tải xuống
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="my-slides-pagination">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Trước
                  </button>
                  <span className="my-slides-page-info">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Slide Details Modal */}
      {selectedSlide && (
        <div
          className="slide-details-modal-overlay"
          onClick={() => setSelectedSlide(null)}
        >
          <div
            className="slide-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="slide-details-header">
              <h3>Chi tiết Slide</h3>
              <button
                className="slide-details-close"
                onClick={() => setSelectedSlide(null)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="slide-details-content">
              <div className="slide-details-section">
                <h4>Nội dung</h4>
                <div className="slide-details-text slide-details-markdown">
                  {selectedSlide.content_text ? (
                    <ReactMarkdown>{selectedSlide.content_text}</ReactMarkdown>
                  ) : (
                    "Không có nội dung"
                  )}
                </div>
              </div>
              {(selectedSlide.grade_id ||
                selectedSlide.subject_id ||
                selectedSlide.book_id ||
                selectedSlide.chapter_id ||
                selectedSlide.lesson_id) && (
                <div className="slide-details-section">
                  <h4>Thông tin</h4>
                  <div className="slide-details-info">
                    {selectedSlide.grade_id && (
                      <div>
                        <strong>Khối:</strong>{" "}
                        {namesMap.grades[selectedSlide.grade_id] ||
                          selectedSlide.grade_id}
                      </div>
                    )}
                    {selectedSlide.subject_id && (
                      <div>
                        <strong>Môn học:</strong>{" "}
                        {namesMap.subjects[selectedSlide.subject_id] ||
                          selectedSlide.subject_id}
                      </div>
                    )}
                    {selectedSlide.book_id && (
                      <div>
                        <strong>Sách:</strong>{" "}
                        {namesMap.books[selectedSlide.book_id] ||
                          selectedSlide.book_id}
                      </div>
                    )}
                    {selectedSlide.chapter_id && (
                      <div>
                        <strong>Chương:</strong>{" "}
                        {namesMap.chapters[selectedSlide.chapter_id] ||
                          selectedSlide.chapter_id}
                      </div>
                    )}
                    {selectedSlide.lesson_id && (
                      <div>
                        <strong>Bài học:</strong>{" "}
                        {namesMap.lessons[selectedSlide.lesson_id] ||
                          selectedSlide.lesson_id}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="slide-details-section">
                <h4>Thời gian tạo</h4>
                <div className="slide-details-date">
                  {formatDate(
                    selectedSlide.slidesgpt?.created_at ||
                      selectedSlide.created_at
                  )}
                </div>
              </div>
            </div>
            <div className="slide-details-footer">
              {selectedSlide.slidesgpt?.download && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleDownloadSlide(selectedSlide);
                    setSelectedSlide(null);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Tải xuống
                </button>
              )}
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedSlide(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
