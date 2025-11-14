import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import "../css/Notification.css";

type NotificationBellProps = {
  variant?: "user" | "admin";
};

const NotificationBell: React.FC<NotificationBellProps> = ({
  variant = "user",
}) => {
  const { notifications, unreadCount, loading, error, markAsRead, refresh } =
    useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const latestNotifications = notifications.slice(0, 5);
  const destination =
    variant === "admin" ? "/admin/notifications" : "/notifications";

  return (
    <div className="notification-bell" ref={containerRef}>
      {isOpen && (
        <div className="notification-popover">
          <div className="notification-popover__header">
            <div>
              <p className="notification-popover__title">Thong bao</p>
              <p className="notification-popover__subtitle">
                {loading
                  ? "Dang tai..."
                  : error
                  ? error
                  : unreadCount > 0
                  ? `${unreadCount} thong bao chua doc`
                  : "Ban da xem het thong bao"}
              </p>
            </div>
            <Link to={destination} className="notification-popover__link">
              Xem tat ca
            </Link>
          </div>

          <div className="notification-popover__content">
            {latestNotifications.length === 0 && !loading ? (
              <div className="notification-empty">
                <span aria-hidden>✅</span>
                <p>Chua co thong bao moi</p>
              </div>
            ) : (
              <ul className="notification-list">
                {latestNotifications.map((item) => (
                  <li
                    key={item.id}
                    className={`notification-item${
                      item.seen ? "" : " notification-item--unread"
                    }`}
                    onClick={() => markAsRead(item.id)}
                  >
                    <div className="notification-item__title">{item.title}</div>
                    {item.message && (
                      <div className="notification-item__message">
                        {item.message}
                      </div>
                    )}
                    <div className="notification-item__meta">
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                      {item.event && (
                        <span className="notification-item__event">
                          {item.event}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
