import React from "react";
import "../../css/Dashboard.css";

export default function MySlides() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Slides của tôi</h2>
          <button className="btn btn-primary">
            <span>+</span>
            <span>Tạo slide mới</span>
          </button>
        </div>
        <div className="card-body">
          <div className="slide-list">
            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                }}
              >
                📊
              </div>
              <div className="slide-info">
                <div className="slide-name">Toán học lớp 5 - Phân số</div>
                <div className="slide-meta">
                  <span>📅 20/10/2024</span>
                  <span>👁️ 245 views</span>
                  <span>⭐ 4.8</span>
                </div>
              </div>
              <div className="slide-actions">
                <button className="btn btn-ghost btn-sm">Chỉnh sửa</button>
                <button className="btn btn-ghost btn-sm">Xem</button>
              </div>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #f093fb, #f5576c)",
                }}
              >
                🔬
              </div>
              <div className="slide-info">
                <div className="slide-name">
                  Khoa học tự nhiên - Chu trình nước
                </div>
                <div className="slide-meta">
                  <span>📅 18/10/2024</span>
                  <span>👁️ 189 views</span>
                  <span>⭐ 4.9</span>
                </div>
              </div>
              <div className="slide-actions">
                <button className="btn btn-ghost btn-sm">Chỉnh sửa</button>
                <button className="btn btn-ghost btn-sm">Xem</button>
              </div>
            </div>

            <div className="slide-item">
              <div
                className="slide-thumbnail"
                style={{
                  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                }}
              >
                📖
              </div>
              <div className="slide-info">
                <div className="slide-name">Tiếng Việt - Tả cảnh</div>
                <div className="slide-meta">
                  <span>📅 15/10/2024</span>
                  <span>👁️ 312 views</span>
                  <span>⭐ 4.7</span>
                </div>
              </div>
              <div className="slide-actions">
                <button className="btn btn-ghost btn-sm">Chỉnh sửa</button>
                <button className="btn btn-ghost btn-sm">Xem</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
