import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllSubjects,
  getAllGrades,
  getBooksByGrade,
  getChaptersByBook,
  getLessonsByChapter,
  ragQuery,
  reviseContent,
  createSlideFromContent,
  Subject,
  Grade,
  Book,
  Chapter,
  Lesson,
} from "../api/aiService";
import "../css/GenAI.css";

type Step = "selection" | "content" | "review" | "result";

export default function GenAI() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("selection");

  // Data states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Selected values
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");

  // Content states
  const [userContent, setUserContent] = useState<string>("");
  const [contentId, setContentId] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [reviseInstruction, setReviseInstruction] = useState<string>("");
  const [slideResult, setSlideResult] = useState<{
    embed?: string;
    download?: string;
    id?: string;
  } | null>(null);

  // Loading states for each dropdown
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Load subjects on mount
  useEffect(() => {
    if (!token) return;
    loadSubjects();
  }, [token]);

  // Load grades when subject changes
  useEffect(() => {
    if (!token || !selectedSubjectId) {
      setGrades([]);
      setSelectedGradeId("");
      return;
    }
    loadGrades();
  }, [token, selectedSubjectId]);

  // Load books when grade changes
  useEffect(() => {
    if (!token || !selectedGradeId) {
      setBooks([]);
      setSelectedBookId("");
      return;
    }
    loadBooks();
  }, [token, selectedGradeId]);

  // Load chapters when book changes
  useEffect(() => {
    if (!token || !selectedBookId) {
      setChapters([]);
      setSelectedChapterId("");
      return;
    }
    loadChapters();
  }, [token, selectedBookId]);

  // Load lessons when chapter changes
  useEffect(() => {
    if (!token || !selectedChapterId) {
      setLessons([]);
      setSelectedLessonId("");
      return;
    }
    loadLessons();
  }, [token, selectedChapterId]);

  const loadSubjects = async () => {
    if (!token) {
      setError("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }
    setLoadingSubjects(true);
    setError(null);
    try {
      console.log(
        "[GenAI] Loading subjects with token:",
        token.substring(0, 20) + "..."
      );
      const data = await getAllSubjects(token);
      console.log("[GenAI] Loaded subjects:", data);
      setSubjects(data);
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi không xác định";
      setError(`Lỗi khi tải môn học: ${errorMsg}`);
      console.error("[GenAI] Error loading subjects:", err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const loadGrades = async () => {
    if (!token) return;
    setLoadingGrades(true);
    setError(null);
    try {
      const data = await getAllGrades(token);
      setGrades(data);
    } catch (err: any) {
      setError(`Lỗi khi tải khối: ${err.message}`);
      console.error("Error loading grades:", err);
    } finally {
      setLoadingGrades(false);
    }
  };

  const loadBooks = async () => {
    if (!token || !selectedGradeId) return;
    setLoadingBooks(true);
    setError(null);
    try {
      const data = await getBooksByGrade(token, selectedGradeId);
      setBooks(data);
    } catch (err: any) {
      setError(`Lỗi khi tải sách: ${err.message}`);
      console.error("Error loading books:", err);
    } finally {
      setLoadingBooks(false);
    }
  };

  const loadChapters = async () => {
    if (!token || !selectedBookId) return;
    setLoadingChapters(true);
    setError(null);
    try {
      const data = await getChaptersByBook(token, selectedBookId);
      setChapters(data);
    } catch (err: any) {
      setError(`Lỗi khi tải chương: ${err.message}`);
      console.error("Error loading chapters:", err);
    } finally {
      setLoadingChapters(false);
    }
  };

  const loadLessons = async () => {
    if (!token || !selectedChapterId) return;
    setLoadingLessons(true);
    setError(null);
    try {
      const data = await getLessonsByChapter(token, selectedChapterId);
      setLessons(data);
    } catch (err: any) {
      setError(`Lỗi khi tải bài học: ${err.message}`);
      console.error("Error loading lessons:", err);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSubjectId(value);
    // Reset dependent selections
    setSelectedGradeId("");
    setSelectedBookId("");
    setSelectedChapterId("");
    setSelectedLessonId("");
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGradeId(value);
    // Reset dependent selections
    setSelectedBookId("");
    setSelectedChapterId("");
    setSelectedLessonId("");
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedBookId(value);
    // Reset dependent selections
    setSelectedChapterId("");
    setSelectedLessonId("");
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedChapterId(value);
    // Reset dependent selections
    setSelectedLessonId("");
  };

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLessonId(value);
  };

  // Helper functions to format text
  const formatSubjectName = (name: string): string => {
    // Remove patterns like "(1)", "(2)" etc.
    return name.replace(/\s*\(\d+\)\s*$/, "").trim();
  };

  const formatGradeName = (name: string): string => {
    // Extract just the number, remove "Khối" prefix and extra text
    const match = name.match(/\d+/);
    return match ? match[0] : name;
  };

  const formatBookName = (name: string): string => {
    // Remove "Sách giáo khoa" prefix if exists
    let formatted = name.replace(/^Sách giáo khoa\s*/i, "").trim();

    // Helper to convert to title case (first letter of each word uppercase)
    const toTitleCase = (str: string): string => {
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    // Handle multiple parentheses: keep first one, convert second to en dash
    // Pattern: "Text (first) (second)" -> "Text (first) – second"
    const parenMatch = formatted.match(
      /^(.+?)\s*\(([^)]+)\)\s*\(([^)]+)\)\s*$/
    );
    if (parenMatch) {
      const [, main, firstParen, secondParen] = parenMatch;
      // Convert second parentheses content to title case and add en dash
      formatted = `${main.trim()} (${firstParen.trim()}) – ${toTitleCase(
        secondParen.trim()
      )}`;
    } else {
      // Normal case: just normalize spacing
      formatted = formatted.replace(/\s+/g, " ");
      // Replace "–" or "-" with "–" (en dash) for consistency
      formatted = formatted.replace(/\s*-\s*/g, " – ");
      // Normalize parentheses spacing
      formatted = formatted
        .replace(/\s*\(\s*/g, " (")
        .replace(/\s*\)\s*/g, ") ");
    }

    return formatted.trim();
  };

  const formatChapterTitle = (title: string): string => {
    // Remove leading numbers and dots like "0", "1.", "2." etc.
    return title.replace(/^\d+\.?\s*/, "").trim();
  };

  const formatLessonTitle = (title: string): string => {
    // Remove leading numbers and dots like "1.", "2." etc.
    return title.replace(/^\d+\.?\s*/, "").trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedSubjectId ||
      !selectedGradeId ||
      !selectedBookId ||
      !selectedChapterId ||
      !selectedLessonId
    ) {
      setError(
        "Vui lòng chọn đầy đủ: Môn học, Khối, Sách giáo khoa, Chương và Bài học"
      );
      return;
    }

    // Move to content input step
    setCurrentStep("content");
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userContent.trim()) {
      setError("Vui lòng nhập nội dung ghi chú");
      return;
    }

    if (!token) {
      setError("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call RAG query API
      const ragResponse = await ragQuery(token, {
        grade_id: selectedGradeId,
        book_id: selectedBookId,
        chapter_id: selectedChapterId,
        lesson_id: selectedLessonId,
        content: userContent,
        subject_id: selectedSubjectId,
        k: 8,
      });

      setContentId(ragResponse.content_id);
      setGeneratedContent(ragResponse.content_text);
      setCurrentStep("review");
    } catch (err: any) {
      setError(`Lỗi khi tạo nội dung: ${err.message || "Lỗi không xác định"}`);
      console.error("[GenAI] Error in RAG query:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviseContent = async () => {
    if (!contentId || !reviseInstruction.trim()) {
      setError("Vui lòng nhập yêu cầu chỉnh sửa");
      return;
    }

    if (!token) {
      setError("Vui lòng đăng nhập");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reviseResponse = await reviseContent(token, contentId, {
        instruction: reviseInstruction,
      });

      setGeneratedContent(reviseResponse.content_text);
      setReviseInstruction("");
    } catch (err: any) {
      setError(
        `Lỗi khi chỉnh sửa nội dung: ${err.message || "Lỗi không xác định"}`
      );
      console.error("[GenAI] Error revising content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlide = async () => {
    if (!contentId) {
      setError("Không tìm thấy content_id");
      return;
    }

    if (!token) {
      setError("Vui lòng đăng nhập");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const slideResponse = await createSlideFromContent(token, {
        content_id: contentId,
      });

      setSlideResult(slideResponse);
      setCurrentStep("result");
    } catch (err: any) {
      setError(`Lỗi khi tạo slide: ${err.message || "Lỗi không xác định"}`);
      console.error("[GenAI] Error creating slide:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep("selection");
    setError(null);
    setUserContent("");
    setContentId(null);
    setGeneratedContent("");
    setReviseInstruction("");
    setSlideResult(null);
  };

  const handleBackToContent = () => {
    setCurrentStep("content");
    setError(null);
  };

  if (!token) {
    return (
      <div className="genai-container">
        <div className="genai-error">
          Vui lòng đăng nhập để sử dụng tính năng Gen AI
        </div>
      </div>
    );
  }

  return (
    <div className="genai-container">
      <div className="genai-header">
        <h1>🤖 Gen AI - Tạo Slide Thông Minh</h1>
        <p>Chọn môn học, khối, sách và bài học để tạo slide tự động</p>
      </div>

      {error && (
        <div className="genai-error-banner">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {currentStep === "selection" && (
        <form onSubmit={handleSubmit} className="genai-form">
          {/* Step 1: Subject */}
          <div className="genai-form-group">
            <label htmlFor="subject" className="genai-label required">
              <span className="step-number">1</span>
              Môn học
            </label>
            <select
              id="subject"
              value={selectedSubjectId}
              onChange={handleSubjectChange}
              className="genai-select"
              required
              disabled={loadingSubjects}
            >
              <option value="">
                {loadingSubjects ? "Đang tải..." : "-- Chọn môn học --"}
              </option>
              {subjects.map((subject) => (
                <option key={subject.subject_id} value={subject.subject_id}>
                  {formatSubjectName(subject.subject_name)}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Grade */}
          {selectedSubjectId && (
            <div className="genai-form-group">
              <label htmlFor="grade" className="genai-label required">
                <span className="step-number">2</span>
                Khối
              </label>
              <select
                id="grade"
                value={selectedGradeId}
                onChange={handleGradeChange}
                className="genai-select"
                required
                disabled={loadingGrades}
              >
                <option value="">
                  {loadingGrades ? "Đang tải..." : "-- Chọn khối --"}
                </option>
                {grades.map((grade) => (
                  <option key={grade.grade_id} value={grade.grade_id}>
                    {grade.grade_number}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 3: Book */}
          {selectedGradeId && (
            <div className="genai-form-group">
              <label htmlFor="book" className="genai-label required">
                <span className="step-number">3</span>
                Sách giáo khoa
              </label>
              <select
                id="book"
                value={selectedBookId}
                onChange={handleBookChange}
                className="genai-select"
                required
                disabled={loadingBooks}
              >
                <option value="">
                  {loadingBooks ? "Đang tải..." : "-- Chọn sách giáo khoa --"}
                </option>
                {books.map((book) => (
                  <option key={book.book_id} value={book.book_id}>
                    {formatBookName(book.book_name)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 4: Chapter */}
          {selectedBookId && (
            <div className="genai-form-group">
              <label htmlFor="chapter" className="genai-label required">
                <span className="step-number">4</span>
                Chương
              </label>
              <select
                id="chapter"
                value={selectedChapterId}
                onChange={handleChapterChange}
                className="genai-select"
                required
                disabled={loadingChapters}
              >
                <option value="">
                  {loadingChapters ? "Đang tải..." : "-- Chọn chương --"}
                </option>
                {chapters.map((chapter) => (
                  <option key={chapter.chapter_id} value={chapter.chapter_id}>
                    {formatChapterTitle(chapter.title)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 5: Lesson */}
          {selectedChapterId && (
            <div className="genai-form-group">
              <label htmlFor="lesson" className="genai-label required">
                <span className="step-number">5</span>
                Bài học
              </label>
              <select
                id="lesson"
                value={selectedLessonId}
                onChange={handleLessonChange}
                className="genai-select"
                required
                disabled={loadingLessons}
              >
                <option value="">
                  {loadingLessons ? "Đang tải..." : "-- Chọn bài học --"}
                </option>
                {lessons.map((lesson) => (
                  <option key={lesson.lesson_id} value={lesson.lesson_id}>
                    {formatLessonTitle(lesson.title)}
                    {lesson.page && ` (Trang ${lesson.page})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          {selectedSubjectId &&
            selectedGradeId &&
            selectedBookId &&
            selectedChapterId &&
            selectedLessonId && (
              <div className="genai-form-actions">
                <button
                  type="submit"
                  className="genai-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Tiếp theo →"}
                </button>
              </div>
            )}
        </form>
      )}

      {/* Content Input Step */}
      {currentStep === "content" && (
        <>
          {loading && (
            <div className="genai-loading-overlay">
              <div className="genai-loading-content">
                <div className="genai-loading-spinner"></div>
                <h3>Vui lòng chờ AI gen nội dung</h3>
                <p>Quá trình này có thể mất vài phút, vui lòng không đóng trang...</p>
              </div>
            </div>
          )}
          <form onSubmit={handleContentSubmit} className="genai-form">
            <div className="genai-form-group">
              <label htmlFor="content" className="genai-label required">
                <span className="step-number">6</span>
                Nhập nội dung ghi chú
              </label>
              <textarea
                id="content"
                value={userContent}
                onChange={(e) => setUserContent(e.target.value)}
                className="genai-textarea"
                placeholder="Nhập ghi chú, yêu cầu hoặc nội dung bạn muốn bổ sung cho bài học..."
                rows={8}
                required
                disabled={loading}
              />
              <p className="genai-hint">
                💡 Gợi ý: Bạn có thể nhập các ghi chú, yêu cầu đặc biệt, hoặc nội
                dung bổ sung cho bài học.
              </p>
            </div>

            <div className="genai-form-actions">
              <button
                type="button"
                onClick={handleBackToSelection}
                className="genai-back-btn"
                disabled={loading}
              >
                ← Quay lại
              </button>
              <button
                type="submit"
                className="genai-submit-btn"
                disabled={loading || !userContent.trim()}
              >
                {loading ? (
                  <>
                    <span className="genai-btn-spinner"></span>
                    Vui lòng chờ AI gen nội dung...
                  </>
                ) : (
                  "🚀 Tạo nội dung"
                )}
              </button>
            </div>
          </form>
        </>
      )}

      {/* Review Content Step */}
      {currentStep === "review" && (
        <div className="genai-review">
          <div className="genai-review-header">
            <h2>Xem lại nội dung đã tạo</h2>
            <p>Bạn có thể chỉnh sửa nội dung nếu cần thiết</p>
          </div>

          <div className="genai-content-preview">
            <div className="genai-content-header">
              <h3>Nội dung đã tạo:</h3>
            </div>
            <div className="genai-content-text">
              <ReactMarkdown>{generatedContent}</ReactMarkdown>
            </div>
          </div>

          <div className="genai-revise-section">
            <label htmlFor="revise" className="genai-label">
              <span className="step-number">✏️</span>
              Chỉnh sửa nội dung (tùy chọn)
            </label>
            <textarea
              id="revise"
              value={reviseInstruction}
              onChange={(e) => setReviseInstruction(e.target.value)}
              className="genai-textarea"
              placeholder="Nhập yêu cầu chỉnh sửa, ví dụ: 'Làm ngắn gọn hơn', 'Thêm ví dụ cụ thể', 'Tập trung vào phần...'"
              rows={4}
              disabled={loading}
            />
            <button
              onClick={handleReviseContent}
              className="genai-revise-btn"
              disabled={loading || !reviseInstruction.trim()}
            >
              {loading ? "Đang chỉnh sửa..." : "Chỉnh sửa"}
            </button>
          </div>

          <div className="genai-form-actions">
            <button
              onClick={handleBackToContent}
              className="genai-back-btn"
              disabled={loading}
            >
              ← Quay lại
            </button>
            <button
              onClick={handleCreateSlide}
              className="genai-submit-btn"
              disabled={loading}
            >
              {loading ? "Đang tạo slide..." : "🚀 Tạo Slide"}
            </button>
          </div>
        </div>
      )}

      {/* Result Step */}
      {currentStep === "result" && slideResult && (
        <div className="genai-result">
          <div className="genai-result-header">
            <h2>✅ Slide đã được tạo thành công!</h2>
          </div>

          {slideResult.embed && (
            <div className="genai-embed-preview">
              <h3>Xem trước:</h3>
              <iframe
                src={slideResult.embed}
                className="genai-embed-iframe"
                title="Slide Preview"
                allowFullScreen
              />
            </div>
          )}

          <div className="genai-result-actions">
            {slideResult.download && (
              <a
                href={slideResult.download}
                download
                className="genai-download-btn"
              >
                📥 Tải xuống Slide
              </a>
            )}
            <button onClick={handleBackToSelection} className="genai-back-btn">
              Tạo slide mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
