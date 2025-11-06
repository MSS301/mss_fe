import React from "react";
import { useNotifications } from "../../contexts/NotificationContext";
import "../../css/Notification.css";

const UserNotifications: React.FC = () => {
  const { notifications, loading, error, markAsRead } = useNotifications();

  return (
    <div className="notification-page">
      <div className="notification-page__header">
        <div>
          <h2>Thong bao cua toi</h2>
          <p>Theo doi hoat dong va cap nhat quan trong tu he thong.</p>
        </div>
      </div>

      <div>
        {loading && <p className="muted">Dang tai danh sach thong bao...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && notifications.length === 0 && (
          <div className="empty-state">
            <span aria-hidden>dY"-</span>
            <p>Ban chua co thong bao nao.</p>
            <p className="muted">
              Cac cap nhat quan trong se xuat hien tai day khi co.
            </p>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="notification-table">
            <table>
              <thead>
                <tr>
                  <th>Tieu de</th>
                  <th>Noi dung</th>
                  <th>Thoi gian</th>
                  <th>Trang thai</th>
                  <th>Su kien</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.message ?? "-"}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>
                      {item.seen ? (
                        <span className="notification-status notification-status--read">
                          Da doc
                        </span>
                      ) : (
                        <button
                          className="btn-link"
                          onClick={() => markAsRead(item.id)}
                        >
                          Danh dau da doc
                        </button>
                      )}
                    </td>
                    <td>{item.event ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;
