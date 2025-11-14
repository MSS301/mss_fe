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
  generateYAMLFromContent,
  listTemplates,
  getTemplate,
  downloadTemplate,
  getTemplatePreview,
  exportPPTX,
  Subject,
  Grade,
  Book,
  Chapter,
  Lesson,
  Template,
} from "../api/aiService";
import { getMyWallet, deductToken } from "../api/wallet";
import "../css/GenAI.css";

type Step = "selection" | "content" | "option" | "review" | "template" | "result";

export default function GenAI() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("selection");
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [checkingBalance, setCheckingBalance] = useState(false);

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
  const [selectedOption, setSelectedOption] = useState<"default" | "template" | null>(null);

  // Template states
  const [contentYamlId, setContentYamlId] = useState<string | null>(null);
  const [yamlContent, setYamlContent] = useState<string>("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templateStep, setTemplateStep] = useState<"generate" | "select" | "export">("generate");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    if (!token || !user) {
      setError("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    // Check token balance before proceeding
    setCheckingBalance(true);
    setError(null);

    try {
      // Get current wallet balance
      const wallet = await getMyWallet(token, user.id);
      const currentBalance = wallet.token || 0;

      if (currentBalance < 1) {
        setError("Số dư token không đủ. Vui lòng nạp thêm token để tiếp tục.");
        setCheckingBalance(false);
        return;
      }

      // Deduct 1 token
      const deductResponse = await deductToken(token, user.id, {
        tokens: 1,
        description: "promt slide",
        user_id: user.id,
        reference_type: "AI_GENERATION",
        reference_id: `genai_${Date.now()}`,
      });

      // Update token balance
      setTokenBalance(deductResponse.token_after);

      // Move to option selection step
      setCurrentStep("option");
    } catch (err: any) {
      console.error("[GenAI] Error checking/deducting token:", err);
      setError(
        `Lỗi khi kiểm tra/trừ token: ${err.message || "Lỗi không xác định"}`
      );
    } finally {
      setCheckingBalance(false);
    }
  };

  const handleOptionSelect = async (option: "default" | "template") => {
    setSelectedOption(option);
    setError(null);

    if (option === "default") {
      // Option 1: Tạo Slide theo mẫu mặc định
      if (!token) {
        setError("Vui lòng đăng nhập để sử dụng tính năng này");
        return;
      }

      setLoading(true);

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
    } else {
      // Option 2: Tạo Slide theo template có sẵn
      // Cần gọi RAG query trước để có content_id
      if (!token) {
        setError("Vui lòng đăng nhập để sử dụng tính năng này");
        return;
      }

      setLoading(true);

      try {
        // Call RAG query API để có content_id
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
        // Chuyển sang review step để người dùng có thể xem và revise content trước
        setCurrentStep("review");
      } catch (err: any) {
        setError(`Lỗi khi tạo nội dung: ${err.message || "Lỗi không xác định"}`);
        console.error("[GenAI] Error in RAG query:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Template flow handlers
  const handleGenerateYAML = async () => {
    if (!contentId || !token) {
      setError("Không tìm thấy content_id hoặc chưa đăng nhập");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const yamlResponse = await generateYAMLFromContent(token, {
        content_id: contentId,
      });

      setContentYamlId(yamlResponse.content_yaml_id);
      setYamlContent(yamlResponse.yaml);
      setTemplateStep("select");
      
      // Load templates
      await loadTemplates();
    } catch (err: any) {
      setError(`Lỗi khi sinh YAML: ${err.message || "Lỗi không xác định"}`);
      console.error("[GenAI] Error generating YAML:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    if (!token) return;
    
    setLoadingTemplates(true);
    try {
      const templatesList = await listTemplates(token);
      setTemplates(templatesList);
    } catch (err: any) {
      setError(`Lỗi khi tải templates: ${err.message || "Lỗi không xác định"}`);
      console.error("[GenAI] Error loading templates:", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    // Không chuyển step ngay, để người dùng có thể xem lại và click button
  };

  const handlePreviewTemplate = async (template: Template) => {
    setPreviewTemplate(template);
    setPreviewUrl(null); // Reset preview URL
    if (!token) return;

    try {
      // Get preview image from backend
      const previewImageUrl = await getTemplatePreview(token, template.template_id);
      setPreviewUrl(previewImageUrl);
    } catch (err: any) {
      console.error("[GenAI] Error loading template preview:", err);
      setPreviewUrl(null);
    }
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleDownloadTemplate = async () => {
    if (!previewTemplate || !token) return;

    setLoading(true);
    setError(null);

    try {
      const blob = await downloadTemplate(token, previewTemplate.template_id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = previewTemplate.filename || `template_${previewTemplate.template_id}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(`Lỗi khi tải template: ${err.message || "Lỗi không xác định"}`);
      console.error("[GenAI] Error downloading template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPPTX = async () => {
    if (!contentYamlId || !selectedTemplateId || !token) {
      setError("Vui lòng chọn template");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const blob = await exportPPTX(token, {
        content_yaml_id: contentYamlId,
        template_id: selectedTemplateId,
        overwrite_existing: true,
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `slides_${contentYamlId}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Set result for display
      setSlideResult({
        download: url,
        id: contentYamlId,
      });
      setCurrentStep("result");
    } catch (err: any) {
      setError(`Lỗi khi tạo slide: ${err.message || "Lỗi không xác định"}`);
      console.error("[GenAI] Error exporting PPTX:", err);
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
        created_by: user?.id || null, // Backend will use user.user_id from token if not provided
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
    setSelectedOption(null);
  };

  const handleBackToContent = () => {
    setCurrentStep("content");
    setError(null);
  };

  const handleBackToOption = () => {
    setCurrentStep("option");
    setError(null);
    setTemplateStep("generate");
    setContentYamlId(null);
    setYamlContent("");
    setTemplates([]);
    setSelectedTemplateId("");
  };

  // Load token balance on mount
  useEffect(() => {
    if (token && user) {
      getMyWallet(token, user.id)
        .then((wallet) => {
          setTokenBalance(wallet.token || 0);
        })
        .catch((err) => {
          console.error("[GenAI] Error loading token balance:", err);
        });
    }
  }, [token, user]);

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
        {tokenBalance !== null && (
          <div className="genai-token-balance">
            <span className="genai-token-label">Số dư token:</span>
            <span className="genai-token-value">{tokenBalance}</span>
          </div>
        )}
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
                disabled={loading || checkingBalance || !userContent.trim()}
              >
                {loading || checkingBalance ? (
                  <>
                    <div className="genai-btn-spinner"></div>
                    {checkingBalance ? "Đang kiểm tra token..." : "Vui lòng chờ AI gen nội dung..."}
                  </>
                ) : (
                  "🚀 Tạo nội dung"
                )}
              </button>
            </div>
          </form>
        </>
      )}

      {/* Option Selection Step */}
      {currentStep === "option" && (
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
          <div className="genai-option-selection">
            <div className="genai-option-header">
              <h2>Chọn phương thức tạo slide</h2>
              <p>Vui lòng chọn một trong hai phương thức dưới đây</p>
            </div>

            <div className="genai-option-cards">
              <div
                className={`genai-option-card ${selectedOption === "default" ? "selected" : ""}`}
                onClick={() => !loading && handleOptionSelect("default")}
              >
                <div className="genai-option-card-icon">
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                  </svg>
                </div>
                <h3>Option 1: Tạo Slide theo mẫu mặc định</h3>
                <p>
                  Sử dụng mẫu slide mặc định của hệ thống. Nội dung sẽ được tạo tự động từ ghi chú của bạn.
                </p>
                <div className="genai-option-card-arrow">
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
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>

              <div
                className={`genai-option-card ${selectedOption === "template" ? "selected" : ""}`}
                onClick={() => !loading && handleOptionSelect("template")}
              >
                <div className="genai-option-card-icon">
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h3>Option 2: Tạo Slide theo template có sẵn</h3>
                <p>
                  Chọn từ các template slide có sẵn trong hệ thống để tạo slide với thiết kế chuyên nghiệp.
                </p>
                <div className="genai-option-card-arrow">
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
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div className="genai-form-actions">
              <button
                onClick={handleBackToContent}
                className="genai-back-btn"
                disabled={loading}
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </>
      )}

      {/* Review Content Step */}
      {currentStep === "review" && (
        <>
          {loading && (
            <div className="genai-loading-overlay">
              <div className="genai-loading-content">
                <div className="genai-loading-spinner"></div>
                <h3>Vui lòng chờ AI tạo slide</h3>
                <p>Quá trình này có thể mất vài phút, vui lòng không đóng trang...</p>
              </div>
            </div>
          )}
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
            {selectedOption === "template" ? (
              <button
                onClick={() => {
                  setTemplateStep("generate");
                  setCurrentStep("template");
                }}
                className="genai-submit-btn"
                disabled={loading}
              >
                Tiếp tục với Template →
              </button>
            ) : (
              <button
                onClick={handleCreateSlide}
                className="genai-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="genai-btn-spinner"></span>
                    Vui lòng chờ AI tạo slide...
                  </>
                ) : (
                  "🚀 Tạo Slide"
                )}
              </button>
            )}
          </div>
        </div>
        </>
      )}

      {/* Template Step */}
      {currentStep === "template" && (
        <>
          {loading && (
            <div className="genai-loading-overlay">
              <div className="genai-loading-content">
                <div className="genai-loading-spinner"></div>
                <h3>
                  {templateStep === "generate" && "Vui lòng chờ AI sinh YAML slide"}
                  {templateStep === "select" && "Đang tải templates..."}
                  {templateStep === "export" && "Vui lòng chờ tạo slide từ template"}
                </h3>
                <p>Quá trình này có thể mất vài phút, vui lòng không đóng trang...</p>
              </div>
            </div>
          )}

          {/* Step 1: Generate YAML */}
          {templateStep === "generate" && (
            <div className="genai-template-step">
          <div className="genai-template-header">
                <h2>Bước 1: Sinh YAML slide từ nội dung</h2>
                <p>Hệ thống sẽ tự động chuyển đổi nội dung đã tạo thành định dạng YAML cho slide</p>
          </div>

              <div className="genai-content-preview">
                <div className="genai-content-header">
                  <h3>Nội dung đã tạo:</h3>
                </div>
                <div className="genai-content-text">
                  <ReactMarkdown>{generatedContent}</ReactMarkdown>
                </div>
              </div>

              <div className="genai-form-actions">
                <button
                  onClick={handleBackToOption}
                  className="genai-back-btn"
                  disabled={loading}
                >
                  ← Quay lại
                </button>
                <button
                  onClick={handleGenerateYAML}
                  className="genai-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="genai-btn-spinner"></span>
                      Đang sinh YAML...
                    </>
                  ) : (
                    "🚀 Sinh YAML Slide"
                  )}
                </button>
            </div>
            </div>
          )}

          {/* Step 2: Select Template */}
          {templateStep === "select" && (
            <div className="genai-template-step">
              <div className="genai-template-header">
                <h2>Bước 2: Chọn template slide</h2>
                <p>Chọn một template từ danh sách bên dưới để tạo slide</p>
              </div>

              {loadingTemplates ? (
                <div className="genai-loading-state">
                  <div className="genai-loading-spinner"></div>
                  <p>Đang tải templates...</p>
                </div>
              ) : templates.length === 0 ? (
                <div className="genai-empty-state">
                  <p>Không có template nào trong hệ thống</p>
                </div>
              ) : (
                <div className="genai-template-grid">
                  {templates.map((template) => (
                    <div
                      key={template.template_id}
                      className={`genai-template-card ${
                        selectedTemplateId === template.template_id ? "selected" : ""
                      }`}
                    >
                      <div className="genai-template-card-content">
                        <div className="genai-template-card-icon">
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
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                          </svg>
            </div>
                        <h3>{template.name}</h3>
                        {template.description && (
                          <p className="genai-template-description">{template.description}</p>
                        )}
                        <div className="genai-template-meta">
                          <span>{template.filename}</span>
                          {template.size && (
                            <span>{(template.size / 1024).toFixed(2)} KB</span>
                          )}
          </div>
                      </div>
                      <div className="genai-template-card-actions">
                        <button
                          className="genai-template-preview-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewTemplate(template);
                          }}
                          title="Xem preview"
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
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Xem preview
                        </button>
                        <button
                          className={`genai-template-select-btn ${
                            selectedTemplateId === template.template_id ? "selected" : ""
                          }`}
                          onClick={() => handleSelectTemplate(template.template_id)}
                        >
                          {selectedTemplateId === template.template_id ? (
                            <>
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
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              Đã chọn
                            </>
                          ) : (
                            "Chọn template"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTemplateId && (
                <div className="genai-template-selected-info">
                  <div className="genai-template-selected-badge">
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
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Đã chọn: {templates.find(t => t.template_id === selectedTemplateId)?.name}</span>
                  </div>
                </div>
              )}

              <div className="genai-form-actions">
            <button
                  onClick={() => {
                    setTemplateStep("generate");
                    setSelectedTemplateId("");
                  }}
              className="genai-back-btn"
                  disabled={loading}
            >
              ← Quay lại
            </button>
                {selectedTemplateId && (
                  <button
                    onClick={handleExportPPTX}
                    className="genai-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="genai-btn-spinner"></span>
                        Đang tạo slide...
                      </>
                    ) : (
                      "🚀 Tạo Slide từ Template"
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Export (handled by handleExportPPTX, will move to result step) */}
        </>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="genai-preview-modal-overlay" onClick={handleClosePreview}>
          <div className="genai-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="genai-preview-modal-header">
              <h2>Preview Template: {previewTemplate.name}</h2>
              <button
                className="genai-preview-modal-close"
                onClick={handleClosePreview}
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
            <div className="genai-preview-modal-content">
              {previewTemplate.description && (
                <div className="genai-preview-description">
                  <p>{previewTemplate.description}</p>
                </div>
              )}
              <div className="genai-preview-info">
                <div className="genai-preview-info-item">
                  <strong>Tên file:</strong> {previewTemplate.filename}
                </div>
                {previewTemplate.size && (
                  <div className="genai-preview-info-item">
                    <strong>Kích thước:</strong> {(previewTemplate.size / 1024).toFixed(2)} KB
                  </div>
                )}
                {previewTemplate.created_at && (
                  <div className="genai-preview-info-item">
                    <strong>Ngày tạo:</strong> {new Date(previewTemplate.created_at).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </div>
              {previewUrl ? (
                <div className="genai-preview-content">
                  <div className="genai-preview-image-wrapper">
                    <img
                      src={previewUrl}
                      alt={`Preview của ${previewTemplate.name}`}
                      className="genai-preview-image"
                    />
                    <div className="genai-preview-image-label">
                      <span>Preview slide đầu tiên</span>
                      <button
                        className="genai-preview-download-image-btn"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = previewUrl;
                          a.download = `preview_${previewTemplate.template_id}.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        title="Tải preview image"
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
                      </button>
                    </div>
                  </div>
                  <div className="genai-preview-note">
                    <p>💡 Đây là preview của slide đầu tiên trong template. Template sẽ được sử dụng để tạo slide từ nội dung YAML đã sinh.</p>
                  </div>
                </div>
              ) : (
                <div className="genai-preview-loading">
                  <div className="genai-loading-spinner"></div>
                  <p>Đang tải preview...</p>
                </div>
              )}
            </div>
            <div className="genai-preview-modal-footer">
              <button
                className="genai-preview-download-btn"
                onClick={handleDownloadTemplate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="genai-btn-spinner"></div>
                    Đang tải...
                  </>
                ) : (
                  <>
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Tải template
                  </>
                )}
              </button>
              <button
                className="genai-preview-select-btn"
                onClick={() => {
                  handleSelectTemplate(previewTemplate.template_id);
                  handleClosePreview();
                }}
              >
                Chọn template này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Step */}
      {currentStep === "result" && slideResult && (
        <div className="genai-result">
          <div className="genai-result-header">
            <h2>✅ Slide đã được tạo thành công!</h2>
            <p>Bạn có thể xem trước hoặc tải xuống slide</p>
          </div>

          {slideResult.embed && (
            <div className="genai-embed-preview">
              <div className="genai-embed-header">
                <h3>📊 Xem trước Slide</h3>
                <p className="genai-embed-hint">
                  {slideResult.embed.includes('.pdf') 
                    ? 'Đang hiển thị PDF. Bạn có thể cuộn để xem các trang.'
                    : 'Đang hiển thị slide. Bạn có thể tương tác với slide bên dưới.'}
                </p>
              </div>
              <div className="genai-embed-wrapper">
                {slideResult.embed.includes('.pdf') ? (
                  <iframe
                    src={`${slideResult.embed}#toolbar=0`}
                    className="genai-embed-iframe"
                    title="Slide Preview"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    src={slideResult.embed}
                    className="genai-embed-iframe"
                    title="Slide Preview"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          )}

          <div className="genai-result-actions">
            {slideResult.download && (
              <a
                href={slideResult.download}
                target="_blank"
                rel="noopener noreferrer"
                className="genai-download-btn"
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Tải xuống Slide
              </a>
            )}
            {slideResult.embed && (
              <a
                href={slideResult.embed}
                target="_blank"
                rel="noopener noreferrer"
                className="genai-view-btn"
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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Mở trong tab mới
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
