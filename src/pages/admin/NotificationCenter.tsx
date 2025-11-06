import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchAllNotifications,
  markNotificationAsRead,
  NotificationRecord,
  PaginatedResponse,
} from "../../api/notification";
import "../../css/Notification.css";

const PAGE_SIZE = 20;

const AdminNotificationCenter: React.FC = () => {
  const { token } = useAuth();
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] =
    useState<PaginatedResponse<NotificationRecord> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!token) {
        setData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchAllNotifications(token, pageIndex, PAGE_SIZE);
        if (!ignore) {
          setData(response);
        }
      } catch (err: any) {
        console.error("Khong the tai thong bao", err);
        if (!ignore) {
          setError(err?.message ?? "Khong the tai thong bao");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [token, pageIndex]);

  const notifications = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleMarkAsRead = async (id: number) => {
    if (!token) {
      return;
    }

    try {
      await markNotificationAsRead(token, id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              content: prev.content.map((item) =>
                item.id === id
                  ? { ...item, seen: true, seenAt: new Date().toISOString() }
                  : item
              ),
            }
          : prev
      );
    } catch (err) {
      console.error("Khong the cap nhat trang thai thong bao", err);
      setError("Khong the cap nhat trang thai thong bao");
    }
  };

  return (
    <div className="notification-page">
      <div className="notification-page__header">
        <div>
          <h2>Trung tam thong bao</h2>
          <p>Giam sat su kien he thong va hoat dong nguoi dung.</p>
        </div>
      </div>

      <div>
        {loading && <p className="muted">Dang tai danh sach thong bao...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && notifications.length === 0 && (
          <div className="empty-state">
            <span aria-hidden>✅</span>
            <p>Chua co thong bao trong he thong.</p>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="notification-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nguoi nhan</th>
                  <th>Tieu de</th>
                  <th>Noi dung</th>
                  <th>Loai</th>
                  <th>Su kien</th>
                  <th>Thoi gian</th>
                  <th>Trang thai</th>
                  <th>Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <div>{item.userId}</div>
                      <div className="muted">{item.recipientEmail ?? "-"}</div>
                    </td>
                    <td>{item.title}</td>
                    <td>{item.message ?? "-"}</td>
                    <td>{item.type}</td>
                    <td>{item.event ?? "-"}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>
                      {item.seen ? (
                        <span className="notification-status notification-status--read">
                          Da doc
                        </span>
                      ) : (
                        <span className="notification-status">Chua doc</span>
                      )}
                    </td>
                    <td>
                      {!item.seen && (
                        <button
                          className="btn-link"
                          onClick={() => handleMarkAsRead(item.id)}
                        >
                          Danh dau da doc
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="notification-pagination">
          <button
            className="btn-link"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          >
            Trang truoc
          </button>
          <span className="muted">
            Trang {pageIndex + 1} / {totalPages}
          </span>
          <button
            className="btn-link"
            disabled={pageIndex >= totalPages - 1}
            onClick={() =>
              setPageIndex((prev) =>
                totalPages === 0 ? prev : Math.min(prev + 1, totalPages - 1)
              )
            }
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationCenter;
