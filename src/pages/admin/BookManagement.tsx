import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAllIngestedBooks,
  getIngestedBookById,
  getBookStructure,
  ingestBook,
  deleteBookById,
  deleteBookByName,
  getAllGrades,
  Grade,
  BooksListResponse,
  BookInfo,
  BookStructureResponse,
  IngestBookRequest,
} from "../../api/aiService";
import "../../css/AdminPages.css";

export default function BookManagement() {
  const { token } = useAuth();
  const [books, setBooks] = useState<Record<string, BookInfo>>({});
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
  const [structure, setStructure] = useState<any>(null);
  const [viewingStructure, setViewingStructure] = useState(false);

  useEffect(() => {
    if (token) {
      loadBooks();
      loadGrades();
    }
  }, [token]);

  const loadBooks = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data: BooksListResponse = await getAllIngestedBooks(token);
      setBooks(data.books || {});
    } catch (err: any) {
      setError(`Lỗi khi tải danh sách sách: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async () => {
    if (!token) return;
    try {
      const data = await getAllGrades(token);
      setGrades(data);
    } catch (err: any) {
      console.error("Error loading grades:", err);
    }
  };

  const handleIngest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.currentTarget);
    const pdf_url = formData.get("pdf_url") as string;
    const book_name = formData.get("book_name") as string;
    const grade_id = formData.get("grade_id") as string;
    const force_reparse = formData.get("force_reparse") === "on";
    const force_clear_cache = formData.get("force_clear_cache") === "on";

    if (!pdf_url || !book_name || !grade_id) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const req: IngestBookRequest = {
        pdf_url,
        book_name,
        grade_id,
        force_reparse,
        force_clear_cache,
      };
      await ingestBook(token, req);
      setIsIngestModalOpen(false);
      await loadBooks();
    } catch (err: any) {
      setError(`Lỗi khi ingest sách: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (bookId: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const book = await getIngestedBookById(token, bookId);
      setSelectedBook(book);
    } catch (err: any) {
      setError(`Lỗi khi tải thông tin sách: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStructure = async (bookId: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data: BookStructureResponse = await getBookStructure(token, bookId);
      setStructure(data.structure);
      setViewingStructure(true);
    } catch (err: any) {
      setError(`Lỗi khi tải cấu trúc sách: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteById = async (bookId: string) => {
    if (!token) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác!")) return;

    setLoading(true);
    setError(null);
    try {
      await deleteBookById(token, bookId);
      await loadBooks();
    } catch (err: any) {
      setError(`Lỗi khi xóa sách: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteByName = async (bookName: string) => {
    if (!token) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác!")) return;

    setLoading(true);
    setError(null);
    try {
      await deleteBookByName(token, bookName);
      await loadBooks();
    } catch (err: any) {
      setError(`Lỗi khi xóa sách: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const booksList = Object.entries(books).map(([name, info]) => ({
    name,
    ...info,
    book_id: (info as any).id || info.book_id || "", // Use 'id' from API response, fallback to 'book_id'
  }));

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Sách</h1>
        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => setIsIngestModalOpen(true)}
            disabled={loading}
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
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Ingest Sách
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
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
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Danh sách Sách đã Ingest</h2>
          <span className="admin-badge admin-badge-info">
            {booksList.length} sách
          </span>
        </div>

        {loading && booksList.length === 0 ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Đang tải danh sách sách...</p>
          </div>
        ) : booksList.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
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
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h3 className="admin-empty-title">Chưa có sách nào</h3>
            <p className="admin-empty-description">
              Hãy ingest sách đầu tiên để bắt đầu!
            </p>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => setIsIngestModalOpen(true)}
            >
              Ingest Sách
            </button>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>ID</th>
                  <th>Khối</th>
                  <th>Chunks</th>
                  <th>Pages</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {booksList.map((book) => (
                  <tr key={book.book_id}>
                    <td>
                      <strong>{book.name}</strong>
                    </td>
                    <td>
                      <span className="admin-code">{book.book_id}</span>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-info">
                        {book.grade_id}
                      </span>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-success">
                        {book.chunks || 0} chunks
                      </span>
                    </td>
                    <td>
                      {book.pages && book.pages.length > 0 ? (
                        <span className="admin-badge admin-badge-warning">
                          {book.pages.length} trang
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => handleViewDetails(book.book_id)}
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
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Chi tiết
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => handleViewStructure(book.book_id)}
                          title="Xem cấu trúc"
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
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                          </svg>
                          Cấu trúc
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDeleteById(book.book_id)}
                          title="Xóa theo ID"
                          disabled={loading}
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
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ingest Modal */}
      {isIngestModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsIngestModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Ingest Sách Mới</h2>
              <button
                className="admin-modal-close"
                onClick={() => setIsIngestModalOpen(false)}
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleIngest}>
                <div className="admin-form-group">
                  <label htmlFor="pdf_url" className="admin-form-label">
                    URL PDF *
                  </label>
                  <input
                    type="url"
                    id="pdf_url"
                    name="pdf_url"
                    className="admin-form-input"
                    required
                    placeholder="https://example.com/book.pdf"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="book_name" className="admin-form-label">
                    Tên sách *
                  </label>
                  <input
                    type="text"
                    id="book_name"
                    name="book_name"
                    className="admin-form-input"
                    required
                    placeholder="Nhập tên sách"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="grade_id" className="admin-form-label">
                    Khối *
                  </label>
                  <select
                    id="grade_id"
                    name="grade_id"
                    className="admin-form-select"
                    required
                  >
                    <option value="">Chọn khối</option>
                    {grades.map((grade) => (
                      <option key={grade.grade_id} value={grade.grade_id}>
                        {grade.grade_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <div className="admin-form-checkbox">
                    <input type="checkbox" id="force_reparse" name="force_reparse" />
                    <label htmlFor="force_reparse" className="admin-form-label" style={{ margin: 0 }}>
                      Force reparse
                    </label>
                  </div>
                </div>
                <div className="admin-form-group">
                  <div className="admin-form-checkbox">
                    <input
                      type="checkbox"
                      id="force_clear_cache"
                      name="force_clear_cache"
                    />
                    <label
                      htmlFor="force_clear_cache"
                      className="admin-form-label"
                      style={{ margin: 0 }}
                    >
                      Force clear cache
                    </label>
                  </div>
                </div>
                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => setIsIngestModalOpen(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Đang ingest..." : "Ingest"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="admin-modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Chi tiết Sách</h2>
              <button
                className="admin-modal-close"
                onClick={() => setSelectedBook(null)}
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-form-label">Tên sách</label>
                <p style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
                  {selectedBook.book_name}
                </p>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">ID</label>
                <p style={{ margin: 0 }}>
                  <span className="admin-code">{selectedBook.book_id}</span>
                </p>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Khối</label>
                <p style={{ margin: 0 }}>
                  <span className="admin-badge admin-badge-info">
                    {selectedBook.grade_id}
                  </span>
                </p>
              </div>
              {selectedBook.chunks !== undefined && (
                <div className="admin-form-group">
                  <label className="admin-form-label">Chunks</label>
                  <p style={{ margin: 0 }}>
                    <span className="admin-badge admin-badge-success">
                      {selectedBook.chunks} chunks
                    </span>
                  </p>
                </div>
              )}
              {selectedBook.pages && selectedBook.pages.length > 0 && (
                <div className="admin-form-group">
                  <label className="admin-form-label">Pages</label>
                  <p style={{ margin: 0 }}>
                    <span className="admin-badge admin-badge-warning">
                      {selectedBook.pages.length} trang
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setSelectedBook(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Structure Modal */}
      {viewingStructure && structure && (
        <div
          className="admin-modal-overlay"
          onClick={() => {
            setViewingStructure(false);
            setStructure(null);
          }}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Cấu trúc Sách</h2>
              <button
                className="admin-modal-close"
                onClick={() => {
                  setViewingStructure(false);
                  setStructure(null);
                }}
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-structure-viewer">
                <pre>{JSON.stringify(structure, null, 2)}</pre>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => {
                  setViewingStructure(false);
                  setStructure(null);
                }}
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

