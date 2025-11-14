import React, { useEffect, useMemo, useState } from "react";
import "../css/Dashboard.css";
import { getToken } from "utils/utils";
import axios from "axios";

const PAYMENT_BASE = "http://localhost:8080/payment-service/api/dashboard";

interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

interface RevenueStatsResponse {
  todayRevenue?: string;
  weekRevenue?: string;
  monthRevenue?: string;
  yearRevenue?: string;
  todayTransactions?: number;
  weekTransactions?: number;
  monthTransactions?: number;
  yearTransactions?: number;
  averageTransactionValue?: string;
  totalRefunds?: string;
  revenueByMethod?: Record<string, string>;
  transactionsByStatus?: Record<string, number>;
}

interface PaymentOverviewResponse {
  totalPayments?: number;
  successfulPayments?: number;
  failedPayments?: number;
  pendingPayments?: number;
  cancelledPayments?: number;
  totalRevenue?: string;
  successfulAmount?: string;
  pendingAmount?: string;
  failedAmount?: string;
  averagePaymentValue?: string;
  successRate?: number;
  todayRevenue?: string;
  weekRevenue?: string;
  monthRevenue?: string;
  todayPayments?: number;
  weekPayments?: number;
  monthPayments?: number;
}

interface PaymentByStatusResponse {
  status?: string;
  count?: number;
  totalAmount?: string;
  percentage?: number;
}

interface DailyRevenueResponse {
  date?: string;
  totalRevenue?: string;
  orderCount?: number;
  successfulPayments?: number;
  failedPayments?: number;
  averageOrderValue?: string;
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0,
});

const formatCurrency = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") return "-";
  const parsed = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(parsed)) {
    return "-";
  }
  return currencyFormatter.format(parsed);
};

const formatPercent = (value?: number | string | null) => {
  if (value === undefined || value === null) return "-";
  const parsed = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(parsed)) return "-";
  return `${parsed.toFixed(1)}%`;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  try {
    const formatted = new Date(value);
    return formatted.toLocaleDateString("vi-VN");
  } catch {
    return value;
  }
};

const ensureResult = <T,>(payload: ApiResponse<T>, fallback: string): T => {
  if (payload.code !== 1000) {
    throw new Error(payload.message || fallback);
  }
  return payload.result;
};

export default function AdminDashboard() {
  const [userAmount, setUserAmount] = useState(0);
  const [revenueStats, setRevenueStats] = useState<RevenueStatsResponse | null>(null);
  const [paymentOverview, setPaymentOverview] = useState<PaymentOverviewResponse | null>(null);
  const [paymentsByStatus, setPaymentsByStatus] = useState<PaymentByStatusResponse[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenueResponse[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get<{
          code: number;
          result?: any[];
          content?: any[];
          data?: { code: number; result?: any[]; content?: any[] };
        }>("http://localhost:8080/auth-service/users", {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const body = res.data?.data ?? res.data;
        const list = body?.result ?? body?.content;
        if (body?.code === 1000 && Array.isArray(list)) {
          setUserAmount(list.length);
        } else if (Array.isArray(res.data?.result)) {
          setUserAmount(res.data.result.length);
        } else if (Array.isArray(res.data?.content)) {
          setUserAmount(res.data.content.length);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setPaymentError("Thiếu token, vui lòng đăng nhập lại.");
      return;
    }

    const params = (() => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      const formatDateParam = (date: Date) => date.toISOString().split("T")[0];
      return {
        startDate: formatDateParam(startDate),
        endDate: formatDateParam(endDate),
      };
    })();

    async function loadPaymentStats() {
      setLoadingPayments(true);
      setPaymentError(null);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [
          revenueRes,
          overviewRes,
          statusRes,
          dailyRes,
        ] = await Promise.all([
          axios.get<ApiResponse<RevenueStatsResponse>>(`${PAYMENT_BASE}/revenue`, {
            headers,
          }),
          axios.get<ApiResponse<PaymentOverviewResponse>>(
            `${PAYMENT_BASE}/payment-overview`,
            { headers }
          ),
          axios.get<ApiResponse<PaymentByStatusResponse[]>>(
            `${PAYMENT_BASE}/payment-by-status`,
            { headers }
          ),
          axios.get<ApiResponse<DailyRevenueResponse[]>>(
            `${PAYMENT_BASE}/daily-revenue`,
            { headers, params }
          ),
        ]);

        setRevenueStats(ensureResult(revenueRes.data, "Không thể tải doanh thu."));
        setPaymentOverview(
          ensureResult(overviewRes.data, "Không thể tải tổng quan thanh toán.")
        );
        setPaymentsByStatus(
          ensureResult(statusRes.data, "Không thể tải trạng thái thanh toán.")
        );
        setDailyRevenue(
          ensureResult(dailyRes.data, "Không thể tải doanh thu hàng ngày.")
        );
      } catch (err: any) {
        setPaymentError(
          err?.message || "Có lỗi khi tải dữ liệu giao dịch, vui lòng thử lại."
        );
      } finally {
        setLoadingPayments(false);
      }
    }

    void loadPaymentStats();
  }, []);

  const statusSummary = useMemo(() => {
    if (!paymentsByStatus.length) return "Chưa có dữ liệu trạng thái.";
    return `${paymentsByStatus.length} trạng thái theo dõi`;
  }, [paymentsByStatus]);

  const todayRevenueValue = revenueStats?.todayRevenue ?? paymentOverview?.todayRevenue;
  const totalRevenueValue = paymentOverview?.totalRevenue ?? revenueStats?.weekRevenue;
  const successRateValue = paymentOverview?.successRate;

  return (
    <div className="dashboard">
      {paymentError && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "12px 16px",
            color: "#b91c1c",
            fontWeight: 600,
          }}
        >
          {paymentError}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper primary">
            <span role="img" aria-label="users">
              👥
            </span>
          </div>
          <div className="stat-content">
            <div className="stat-label">Tổng người dùng</div>
            <div className="stat-value">{userAmount}</div>
            <div className="stat-change positive">
              <span>Đang theo dõi</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper success">
            <span role="img" aria-label="revenue">
              💰
            </span>
          </div>
          <div className="stat-content">
            <div className="stat-label">Doanh thu tổng</div>
            <div className="stat-value">
              {paymentOverview ? formatCurrency(totalRevenueValue) : "--"}
            </div>
            <div className="stat-change positive">
              <span>
                {paymentOverview
                  ? `${formatCurrency(paymentOverview.weekRevenue)} (tuần)`
                  : "Đang cập nhật"}
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper warning">
            <span role="img" aria-label="rate">
              ✅
            </span>
          </div>
          <div className="stat-content">
            <div className="stat-label">Tỷ lệ thành công</div>
            <div className="stat-value">
              {successRateValue !== undefined ? formatPercent(successRateValue) : "--"}
            </div>
            <div className="stat-change positive">
              <span>
                {paymentOverview?.successfulPayments ?? 0} thành công
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper info">
            <span role="img" aria-label="today">
              📅
            </span>
          </div>
          <div className="stat-content">
            <div className="stat-label">Doanh thu hôm nay</div>
            <div className="stat-value">
              {formatCurrency(todayRevenueValue)}
            </div>
            <div className="stat-change positive">
              <span>
                {revenueStats?.todayTransactions ?? paymentOverview?.todayPayments ?? 0} giao dịch
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          marginTop: "1rem",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#0f172a",
                }}
              >
                Trạng thái thanh toán
              </div>
              <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
                {statusSummary}
              </p>
            </div>
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "#475569",
              }}
            >
              {loadingPayments ? "Đang tải..." : "Đã cập nhật gần nhất"}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
              {paymentsByStatus.length === 0 && !loadingPayments ? (
                <p style={{ color: "#475569" }}>Không có dữ liệu trạng thái.</p>
              ) : (
                paymentsByStatus.map((item, index) => (
                  <div
                    key={`${item.status ?? "status"}-${index}`}
                  style={{
                    background: "#f8fafc",
                    borderRadius: 12,
                    border: "1px solid rgba(148, 163, 184, 0.5)",
                    padding: "12px 14px",
                    minHeight: 100,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#0f172a",
                    }}
                  >
                    {item.status || "Khác"}
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {item.count ?? 0} đơn hàng
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {formatCurrency(item.totalAmount)} / {formatPercent(item.percentage)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#0f172a",
                }}
              >
                Doanh thu hàng ngày (7 ngày gần nhất)
              </div>
              <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
                Tổng {dailyRevenue.length} ngày
              </p>
            </div>
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "#475569",
              }}
            >
              {loadingPayments ? "Đang tải..." : "Dữ liệu mới nhất"}
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px 6px" }}>Ngày</th>
                  <th style={{ textAlign: "left", padding: "8px 6px" }}>Doanh thu</th>
                  <th style={{ textAlign: "left", padding: "8px 6px" }}>Đơn hàng</th>
                  <th style={{ textAlign: "left", padding: "8px 6px" }}>Thành công</th>
                  <th style={{ textAlign: "left", padding: "8px 6px" }}>Thất bại</th>
                </tr>
              </thead>
              <tbody>
                {dailyRevenue.map((item, index) => (
                  <tr
                    key={`${item.date ?? "day"}-${index}`}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "8px 6px" }}>{formatDate(item.date)}</td>
                    <td style={{ padding: "8px 6px" }}>
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td style={{ padding: "8px 6px" }}>
                      {item.orderCount ?? 0}
                    </td>
                    <td style={{ padding: "8px 6px" }}>
                      {item.successfulPayments ?? 0}
                    </td>
                    <td style={{ padding: "8px 6px" }}>
                      {item.failedPayments ?? 0}
                    </td>
                  </tr>
                ))}
                {dailyRevenue.length === 0 && !loadingPayments && (
                  <tr>
                    <td colSpan={5} style={{ padding: "12px 6px", textAlign: "center" }}>
                      Chưa có dữ liệu doanh thu ngày.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
