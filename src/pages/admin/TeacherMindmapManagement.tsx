import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../../css/Dashboard.css";
import "../../css/MindmapManager.css";
import {
  deleteMindmapAdmin,
  downloadMindmapAdmin,
  getMindmapAdmin,
  listAllMindmaps,
  MindmapResponse,
  MindmapSummary,
  triggerMindmapNotification,
} from "../../api/mindmap";
import { getToken } from "utils/utils";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("vi-VN");
  } catch {
    return value;
  }
};

const statusClassName = (status?: string) => {
  if (!status) return "";
  const normalized = status.toLowerCase();
  if (normalized.includes("ready") || normalized.includes("completed")) {
    return "mindmap-status-ready";
  }
  if (normalized.includes("processing") || normalized.includes("pending")) {
    return "mindmap-status-processing";
  }
  return "mindmap-status-failed";
};

function describeApiError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return fallback;
}

export default function TeacherMindmapManagement() {
  const token = getToken();
  const [mindmaps, setMindmaps] = useState<MindmapSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MindmapResponse | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [busyMindmapId, setBusyMindmapId] = useState<string | null>(null);

  const filteredMindmaps = useMemo(() => {
    return mindmaps.filter((item) => {
      const matchesStatus = statusFilter
        ? item.status?.toLowerCase().includes(statusFilter.toLowerCase())
        : true;
      const matchesUser = userFilter
        ? item.userId.toLowerCase().includes(userFilter.toLowerCase())
        : true;
      const matchesProject = projectFilter
        ? (item.project || "")
            .toLowerCase()
            .includes(projectFilter.toLowerCase())
        : true;
      return matchesStatus && matchesUser && matchesProject;
    });
  }, [mindmaps, statusFilter, userFilter, projectFilter]);

  const loadDetail = useCallback(
    async (summary: MindmapSummary) => {
      if (!token) {
        setMessage("Không tìm thấy token, vui lòng đăng nhập lại.");
        return;
      }
      setSelectedId(summary.id);
      setDetailLoading(true);
      try {
        const payload = await getMindmapAdmin(token, summary.id);
        setDetail(payload);
        setMessage(null);
      } catch (err) {
        setDetail(null);
        setMessage(
          describeApiError(
            err,
            "Không thể tải chi tiết mindmap. Vui lòng thử lại."
          )
        );
      } finally {
        setDetailLoading(false);
      }
    },
    [token]
  );

  const fetchMindmaps = useCallback(async () => {
    if (!token) {
      setMessage("Không tìm thấy token, vui lòng đăng nhập lại.");
      return;
    }
    setLoadingList(true);
    try {
      const list = await listAllMindmaps(token);
      setMindmaps(list);
      if (list.length > 0) {
        await loadDetail(list[0]);
      } else {
        setSelectedId(null);
        setDetail(null);
      }
      setMessage(null);
    } catch (err) {
      setMessage(
        describeApiError(
          err,
          "Không thể tải danh sách mindmap. Hãy kiểm tra lại kết nối."
        )
      );
    } finally {
      setLoadingList(false);
    }
  }, [token, loadDetail]);

  useEffect(() => {
    void fetchMindmaps();
  }, [fetchMindmaps]);

  const handleSelect = (summary: MindmapSummary) => {
    if (selectedId === summary.id) return;
    void loadDetail(summary);
  };

  const handleDelete = async () => {
    if (!selectedId || !token || !detail?.metadata) return;
    const confirmation = window.confirm(
      "Bạn có chắc chắn muốn xóa mindmap này không?"
    );
    if (!confirmation) return;

    setBusyMindmapId(selectedId);
    try {
      await deleteMindmapAdmin(token, selectedId);
      setMessage("Mindmap đã được xóa thành công.");
      setDetail(null);
      setSelectedId(null);
      await fetchMindmaps();
    } catch (err) {
      setMessage(
        describeApiError(err, "Không thể xóa mindmap. Vui lòng thử lại.")
      );
    } finally {
      setBusyMindmapId(null);
    }
  };

  const handleDownload = async () => {
    if (!selectedId || !token) return;
    setBusyMindmapId(selectedId);
    try {
      await downloadMindmapAdmin(token, selectedId);
      setMessage("Yêu cầu tải xuống mindmap đã được gửi đến trình duyệt.");
    } catch (err) {
      setMessage(
        describeApiError(err, "Không thể tải mindmap. Vui lòng thử lại.")
      );
    } finally {
      setBusyMindmapId(null);
    }
  };

  const handleNotify = async () => {
    if (!selectedId || !token || !detail?.metadata?.userId) return;
    setBusyMindmapId(selectedId);
    try {
      await triggerMindmapNotification(
        token,
        detail.metadata.userId,
        selectedId
      );
      setMessage("Thông báo đã được gửi đến người dùng.");
    } catch (err) {
      setMessage(
        describeApiError(err, "Không thể gửi thông báo. Vui lòng thử lại.")
      );
    } finally {
      setBusyMindmapId(null);
    }
  };

  return (
    <div className="mindmap-page">
      <div className="mindmap-grid">
        <div className="mindmap-card">
          <div className="mindmap-list-header">
            <div>
              <h2>Danh sách mindmap của giáo viên</h2>
              <p className="mindmap-meta-info">
                Tổng cộng {mindmaps.length} mindmap, lọc riêng bằng thanh bộ lọc
              </p>
            </div>
            <button className="mindmap-btn secondary" onClick={() => void fetchMindmaps()}>
              {loadingList ? "Đang tải..." : "Làm mới"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <input
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Tìm theo user ID..."
              style={{ flex: "1 1 180px" }}
            />
            <input
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="Tình trạng (ready/pending/failed)"
              style={{ flex: "1 1 180px" }}
            />
            <input
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              placeholder="Tên project"
              style={{ flex: "1 1 180px" }}
            />
          </div>

          {message && (
            <div className="mindmap-alert info" style={{ marginBottom: 12 }}>
              {message}
            </div>
          )}

          {filteredMindmaps.length === 0 ? (
            <div className="mindmap-empty">
              {loadingList ? "Đang nạp mindmap..." : "Không tìm thấy mindmap phù hợp."}
            </div>
          ) : (
            <div className="mindmap-items">
              {filteredMindmaps.map((summary) => (
                <div
                  key={summary.id}
                  className={`mindmap-item ${
                    selectedId === summary.id ? "active" : ""
                  }`}
                  onClick={() => handleSelect(summary)}
                >
                  <div className="mindmap-item-title">
                    <span>{summary.name || "Mindmap không tên"}</span>
                    <span
                      className={`mindmap-status-badge ${statusClassName(
                        summary.status
                      )}`}
                    >
                      {summary.status || "unknown"}
                    </span>
                  </div>
                  <div className="mindmap-item-prompt">{summary.prompt}</div>
                  <div className="mindmap-item-footer">
                    <span>User: {summary.userId}</span>
                    <span>{summary.project || "Không gắn project"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mindmap-card">
          <div className="mindmap-detail-header">
            <h2>Chi tiết mindmap</h2>
            <div className="mindmap-actions">
              <button
                className="mindmap-btn secondary"
                onClick={handleDownload}
                disabled={!selectedId || busyMindmapId === selectedId}
              >
                Tải JSON
              </button>
              <button
                className="mindmap-btn secondary"
                onClick={handleNotify}
                disabled={!selectedId || busyMindmapId === selectedId}
              >
                Gửi thông báo
              </button>
              <button
                className="mindmap-btn danger"
                onClick={handleDelete}
                disabled={!selectedId || busyMindmapId === selectedId}
              >
                Xóa mindmap
              </button>
            </div>
          </div>

          {detailLoading ? (
            <div
              className="mindmap-loading-popup"
              style={{ background: "#f8fafc", border: "1px solid #cbd5f5" }}
            >
              <div className="mindmap-loading-spinner"></div>
              <h3>Đang tải chi tiết...</h3>
              <p>Vui lòng chờ trong giây lát.</p>
            </div>
          ) : detail ? (
            <div className="mindmap-detail-body">
              <div className="mindmap-metadata-grid">
                {[
                  { label: "ID", value: detail.metadata.id },
                  { label: "User ID", value: detail.metadata.userId },
                  { label: "Tên", value: detail.metadata.name },
                  { label: "Project", value: detail.metadata.project },
                  { label: "Tình trạng", value: detail.metadata.status },
                  {
                    label: "Tạo lúc",
                    value: formatDateTime(detail.metadata.createdAt),
                  },
                  {
                    label: "Cập nhật",
                    value: formatDateTime(detail.metadata.updatedAt),
                  },
                  { label: "Tên tệp", value: detail.metadata.filename },
                ].map((meta) => (
                  <div key={meta.label} className="mindmap-metadata-item">
                    <span>{meta.label}</span>
                    <strong>{meta.value || "-"}</strong>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  color: "#475569",
                }}
              >
                <strong>Prompt:</strong>
                <p style={{ margin: "6px 0" }}>{detail.metadata.prompt}</p>
              </div>

              <div className="mindmap-json">
                <pre>
                  {JSON.stringify(detail.mindmap ?? detail.metadata, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="mindmap-empty-detail">
              Chọn một mindmap để xem chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
