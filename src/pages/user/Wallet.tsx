import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyWallet,
  getMyTransactions,
  formatCurrency,
  getTransactionStatusLabel,
  getTransactionStatusColor,
  Wallet as WalletType,
  Transaction,
} from "../../api/wallet";
import "../../css/Wallet.css";

type Props = {
  token: string;
  userId: string;
};

export default function Wallet({ token, userId }: Props) {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"topup" | "wallet">("topup");

  useEffect(() => {
    loadWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId, page]);

  async function loadWalletData() {
    try {
      setLoading(true);
      setError(null);
      const [walletData, transactionsData] = await Promise.all([
        getMyWallet(token, userId),
        getMyTransactions(token, userId, page, 10),
      ]);
      setWallet(walletData);
      setTransactions(transactionsData.content);
      setTotalPages(transactionsData.totalPages);
    } catch (err: any) {
      setError(err?.message || "Không thể tải thông tin ví");
      console.error("Error loading wallet:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !wallet) {
    return (
      <div className="wallet-container">
        <div className="wallet-loading">
          <div className="wallet-spinner">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3"/>
              <path d="M25 5C13.9543 5 5 13.9543 5 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <p>Đang tải thông tin ví...</p>
        </div>
      </div>
    );
  }

  if (error && !wallet) {
    return (
      <div className="wallet-container">
        <div className="wallet-error">
          <div className="wallet-error-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 20V36M32 44H32.04" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="wallet-error-text">{error}</p>
          <button onClick={loadWalletData} className="wallet-retry-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 4.5V9L12 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Thử lại</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      {/* Page Header */}
      <div className="wallet-page-header">
        <div className="wallet-header-content">
          <h1 className="wallet-page-title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M28 8H24V6C24 4.89543 23.1046 4 22 4H6C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H22C23.1046 28 24 27.1046 24 26V24H28C29.1046 24 30 23.1046 30 22V10C30 8.89543 29.1046 8 28 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 16H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ví của tôi
          </h1>
          <p className="wallet-page-subtitle">
            Quản lý số dư, nạp tiền và xem lịch sử giao dịch của bạn
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          {wallet?.status === "ACTIVE" && (
            <span className="status-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Đang hoạt động
            </span>
          )}
        </div>
        <div className="token-display">
          <div className="token-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 8V16M24 32V40M40 24H32M16 24H8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="token-count">{wallet?.token || 0}</span>
          <span className="token-label">Tokens còn lại</span>
        </div>
        <div className="balance-actions">
          <button
            className="action-btn deposit"
            onClick={() => navigate("/packages")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="btn-icon">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Nạp tiền</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="btn-arrow">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="wallet-stats">
        <div className="stat-item">
          <div className="stat-icon-wrapper income">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="stat-label">Tokens</span>
          <span className="stat-value income">{wallet?.token || 0}</span>
        </div>
        <div className="stat-item">
          <div className="stat-icon-wrapper expense">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="stat-label">Chi tiêu</span>
          <span className="stat-value expense">
            {formatCurrency(wallet?.total_spent || 0)}
          </span>
        </div>
        <div className="stat-item">
          <div className="stat-icon-wrapper locked">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="stat-label">Đang giữ</span>
          <span className="stat-value locked">
            {formatCurrency(wallet?.locked_balance || 0)}
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="wallet-transactions">
        <div className="transactions-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Lịch sử giao dịch
          </h2>
          <div className="transaction-tabs">
            <button
              className={`tab-btn ${activeTab === "topup" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("topup");
                setPage(1);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 4.5V9L12 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Nạp tiền
            </button>
            <button
              className={`tab-btn ${activeTab === "wallet" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("wallet");
                setPage(1);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 4.5V9L12 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Lịch sử ví
            </button>
          </div>
        </div>

        {loading && !transactions.length ? (
          <div className="transactions-empty">
            <p>Đang tải...</p>
          </div>
        ) : (
          (() => {
            // Filter transactions based on active tab
            const filteredTransactions = transactions.filter((t) => {
              if (activeTab === "topup") {
                return t.transaction_type === "TOP_UP";
              } else {
                return (
                  t.transaction_type === "TOKEN_DEDUCTION" ||
                  t.transaction_type === "TOKEN_ADDITION"
                );
              }
            });

            if (filteredTransactions.length === 0) {
              return (
                <div className="transactions-empty">
                  <div className="transactions-empty-icon">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <path d="M16 16H48C50.2091 16 52 17.7909 52 20V44C52 46.2091 50.2091 48 48 48H16C13.7909 48 12 46.2091 12 44V20C12 17.7909 13.7909 16 16 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 24H44M20 32H44M20 40H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p>
                    {activeTab === "topup"
                      ? "Chưa có giao dịch nạp tiền nào"
                      : "Chưa có giao dịch token nào"}
                  </p>
                </div>
              );
            }

            return (
              <>
                <div className="transaction-list">
                  {filteredTransactions.map((transaction) => {
                    const isIncome =
                      transaction.transaction_type === "TOP_UP" ||
                      transaction.transaction_type === "TOKEN_ADDITION" ||
                      transaction.transaction_type === "REFUND" ||
                      transaction.transaction_type === "REWARD";
                    const statusColor = getTransactionStatusColor(
                      transaction.status
                    );

                    return (
                      <div className="transaction-item" key={transaction.id}>
                        <div className="transaction-left">
                          <div
                            className={`transaction-icon ${
                              isIncome ? "income" : "expense"
                            }`}
                          >
                            {isIncome ? (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 19V5M12 19L18 13M12 19L6 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <div className="transaction-details">
                            <div className="transaction-title">
                              {transaction.description}
                            </div>
                            <div className="transaction-date">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              {new Date(transaction.created_at).toLocaleString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="transaction-right">
                          <div
                            className={`transaction-amount ${
                              isIncome ? "income" : "expense"
                            }`}
                          >
                            {isIncome ? "+" : "-"}
                            {activeTab === "topup"
                              ? formatCurrency(Math.abs(transaction.amount))
                              : `1 token`}
                          </div>
                          <span className={`transaction-status ${statusColor}`}>
                            {getTransactionStatusLabel(transaction.status)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="transactions-pagination">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="btn-page"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Trước</span>
                    </button>
                    <span className="page-info">
                      Trang {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="btn-page"
                    >
                      <span>Sau</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            );
          })()
        )}
      </div>
    </div>
  );
}
