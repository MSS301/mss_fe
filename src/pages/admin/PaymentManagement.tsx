import React from "react";
import "../../css/Dashboard.css";

export default function PaymentManagement() {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon success">💰</div>
          <div className="stat-content">
            <div className="stat-label">Doanh thu tháng</div>
            <div className="stat-value">125M đ</div>
            <div className="stat-change positive">
              <span>↑ 18%</span>
              <span>so tháng trước</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">💳</div>
          <div className="stat-content">
            <div className="stat-label">Giao dịch tháng này</div>
            <div className="stat-value">2,543</div>
            <div className="stat-change positive">
              <span>↑ 15%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Chờ xử lý</div>
            <div className="stat-value">23</div>
            <div className="stat-change">
              <span>Cần kiểm tra</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">📊</div>
          <div className="stat-content">
            <div className="stat-label">Giá trị TB</div>
            <div className="stat-value">49K đ</div>
            <div className="stat-change positive">
              <span>↑ 5%</span>
              <span>tháng này</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Giao dịch gần đây</h3>
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <select
              style={{
                padding: "var(--spacing-xs) var(--spacing-sm)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <option>Tất cả</option>
              <option>Thành công</option>
              <option>Chờ xử lý</option>
              <option>Thất bại</option>
            </select>
            <button className="btn btn-ghost btn-sm">Xuất Excel</button>
          </div>
        </div>
        <div className="card-body">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid var(--border-color)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Mã GD
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Người dùng
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Loại
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Số tiền
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Phương thức
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Trạng thái
                  </th>
                  <th style={{ padding: "var(--spacing-md)", fontWeight: 600 }}>
                    Thời gian
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#TXN001</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    nguyenvana@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Nạp tiền</td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      color: "var(--success-color)",
                      fontWeight: 600,
                    }}
                  >
                    +100,000đ
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Momo</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-success">Thành công</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>2 giờ trước</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#TXN002</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    tranthib@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Mua gói</td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      color: "var(--warning-color)",
                      fontWeight: 600,
                    }}
                  >
                    -50,000đ
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Ví</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-success">Thành công</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>5 giờ trước</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#TXN003</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    levanc@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Nạp tiền</td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      color: "var(--success-color)",
                      fontWeight: 600,
                    }}
                  >
                    +200,000đ
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>VNPay</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-warning">Chờ xử lý</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>1 ngày trước</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--spacing-md)" }}>#TXN004</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    phamthid@school.edu
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Mua gói</td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      color: "var(--warning-color)",
                      fontWeight: 600,
                    }}
                  >
                    -99,000đ
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>Ví</td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <span className="badge badge-success">Thành công</span>
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>2 ngày trước</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Biểu đồ doanh thu</h3>
        </div>
        <div className="card-body">
          <div
            style={{
              height: "300px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "var(--font-size-xl)",
            }}
          >
            📊 Revenue Chart (Coming Soon)
          </div>
        </div>
      </div>
    </div>
  );
}
