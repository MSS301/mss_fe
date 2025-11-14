import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  listTemplates,
  getTemplate,
  uploadTemplate,
  deleteTemplate,
  downloadTemplate,
  getTemplatePreview,
  Template,
  TemplateUploadRequest,
} from "../../api/aiService";
import "../../css/AdminPages.css";

export default function TemplateManagement() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadTemplates();
    }
  }, [token]);

  const loadTemplates = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listTemplates(token);
      setTemplates(data);
    } catch (err: any) {
      setError(`Lỗi khi tải templates: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    if (!name || !file) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const req: TemplateUploadRequest = {
        name,
        description: description || undefined,
        file,
      };
      await uploadTemplate(token, req);
      setIsUploadModalOpen(false);
      await loadTemplates();
    } catch (err: any) {
      setError(`Lỗi khi upload template: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!token) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa template này?")) return;

    setLoading(true);
    setError(null);
    try {
      await deleteTemplate(token, templateId);
      await loadTemplates();
    } catch (err: any) {
      setError(`Lỗi khi xóa template: ${err.message || "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (templateId: string, filename: string) => {
    if (!token) return;
    try {
      const blob = await downloadTemplate(token, templateId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(`Lỗi khi tải template: ${err.message || "Lỗi không xác định"}`);
    }
  };

  const handlePreview = async (template: Template) => {
    if (!token) return;
    setSelectedTemplate(template);
    try {
      const url = await getTemplatePreview(token, template.template_id);
      setPreviewUrl(url);
    } catch (err: any) {
      setError(`Lỗi khi tải preview: ${err.message || "Lỗi không xác định"}`);
    }
  };

  const closePreview = () => {
    setSelectedTemplate(null);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Templates</h1>
        <div className="admin-page-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
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
            Upload Template
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
          <h2 className="admin-card-title">Danh sách Templates</h2>
          <span className="admin-badge admin-badge-info">
            {templates.length} templates
          </span>
        </div>

        {loading && templates.length === 0 ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Đang tải templates...</p>
          </div>
        ) : templates.length === 0 ? (
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <h3 className="admin-empty-title">Chưa có template nào</h3>
            <p className="admin-empty-description">
              Hãy upload template đầu tiên để bắt đầu!
            </p>
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Template
            </button>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>File</th>
                  <th>Kích thước</th>
                  <th>Mô tả</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.template_id}>
                    <td>
                      <strong>{template.name}</strong>
                    </td>
                    <td>
                      <span className="admin-code">{template.filename}</span>
                    </td>
                    <td>
                      {template.size
                        ? `${(template.size / 1024).toFixed(2)} KB`
                        : "N/A"}
                    </td>
                    <td>{template.description || "-"}</td>
                    <td>
                      {template.created_at
                        ? new Date(template.created_at).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => handlePreview(template)}
                          title="Xem preview"
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
                          Preview
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() =>
                            handleDownload(template.template_id, template.filename)
                          }
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
                          Tải
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(template.template_id)}
                          title="Xóa"
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

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Upload Template</h2>
              <button
                className="admin-modal-close"
                onClick={() => setIsUploadModalOpen(false)}
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
              <form onSubmit={handleUpload}>
                <div className="admin-form-group">
                  <label htmlFor="name" className="admin-form-label">
                    Tên template *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="admin-form-input"
                    required
                    placeholder="Nhập tên template"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="description" className="admin-form-label">
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="admin-form-textarea"
                    rows={3}
                    placeholder="Nhập mô tả (tùy chọn)"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="file" className="admin-form-label">
                    File PPTX *
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    className="admin-form-input"
                    accept=".pptx"
                    required
                  />
                </div>
                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => setIsUploadModalOpen(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Đang upload..." : "Upload"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedTemplate && previewUrl && (
        <div className="admin-modal-overlay" onClick={closePreview}>
          <div
            className="admin-modal"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Preview: {selectedTemplate.name}</h2>
              <button className="admin-modal-close" onClick={closePreview}>
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
              <div style={{ textAlign: "center" }}>
                <img
                  src={previewUrl}
                  alt="Template preview"
                  className="admin-preview-image"
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closePreview}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

