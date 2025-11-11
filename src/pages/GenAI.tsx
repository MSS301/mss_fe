import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllSubjects,
  getAllGrades,
  getBooksByGrade,
  getChaptersByBook,
  getLessonsByChapter,
  Subject,
  Grade,
  Book,
  Chapter,
  Lesson,
} from "../api/aiService";
import "../css/GenAI.css";

export default function GenAI() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log("[GenAI] Loading subjects with token:", token.substring(0, 20) + "...");
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
    const parenMatch = formatted.match(/^(.+?)\s*\(([^)]+)\)\s*\(([^)]+)\)\s*$/);
    if (parenMatch) {
      const [, main, firstParen, secondParen] = parenMatch;
      // Convert second parentheses content to title case and add en dash
      formatted = `${main.trim()} (${firstParen.trim()}) – ${toTitleCase(secondParen.trim())}`;
    } else {
      // Normal case: just normalize spacing
      formatted = formatted.replace(/\s+/g, " ");
      // Replace "–" or "-" with "–" (en dash) for consistency
      formatted = formatted.replace(/\s*-\s*/g, " – ");
      // Normalize parentheses spacing
      formatted = formatted.replace(/\s*\(\s*/g, " (").replace(/\s*\)\s*/g, ") ");
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
    if (!selectedSubjectId || !selectedGradeId || !selectedBookId) {
      alert("Vui lòng chọn đầy đủ: Môn học, Khối, và Sách giáo khoa");
      return;
    }

    const selection = {
      subjectId: selectedSubjectId,
      gradeId: selectedGradeId,
      bookId: selectedBookId,
      chapterId: selectedChapterId || undefined,
      lessonId: selectedLessonId || undefined,
    };

    console.log("Selected:", selection);
    // TODO: Navigate to slide generation or RAG query page
    alert(`Đã chọn:\n${JSON.stringify(selection, null, 2)}`);
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
            <label htmlFor="chapter" className="genai-label">
              <span className="step-number">4</span>
              Chương (tùy chọn)
            </label>
            <select
              id="chapter"
              value={selectedChapterId}
              onChange={handleChapterChange}
              className="genai-select"
              disabled={loadingChapters}
            >
              <option value="">
                {loadingChapters ? "Đang tải..." : "-- Chọn chương (nếu có) --"}
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
            <label htmlFor="lesson" className="genai-label">
              <span className="step-number">5</span>
              Bài học (tùy chọn)
            </label>
            <select
              id="lesson"
              value={selectedLessonId}
              onChange={handleLessonChange}
              className="genai-select"
              disabled={loadingLessons}
            >
              <option value="">
                {loadingLessons ? "Đang tải..." : "-- Chọn bài học (nếu có) --"}
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
        {selectedSubjectId && selectedGradeId && selectedBookId && (
          <div className="genai-form-actions">
            <button
              type="submit"
              className="genai-submit-btn"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "🚀 Tạo Slide"}
            </button>
          </div>
        )}
      </form>

    </div>
  );
}

