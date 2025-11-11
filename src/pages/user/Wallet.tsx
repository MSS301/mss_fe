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
          <div className="wallet-spinner"></div>
          <p>Đang tải thông tin ví...</p>
        </div>
      </div>
    );
  }

  if (error && !wallet) {
    return (
      <div className="wallet-container">
        <div className="wallet-error">
          <div className="wallet-error-icon"></div>
          <p className="wallet-error-text">{error}</p>
          <button onClick={loadWalletData} className="wallet-retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          {wallet?.status === "ACTIVE" && (
            <span className="status-badge">✓ Đang hoạt động</span>
          )}
        </div>
        <div className="token-display">
          <span className="token-icon">🪙</span>
          <span className="token-count">{wallet?.token || 0}</span>
          <span className="token-label">Tokens còn lại</span>
        </div>
        <div className="balance-actions">
          <button
            className="action-btn deposit"
            onClick={() => navigate("/packages")}
          >
            <span className="btn-icon">+</span>
            Nạp tiền
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="wallet-stats">
        <div className="stat-item">
          <span className="stat-label">Tokens</span>
          <span className="stat-value income">{wallet?.token || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Chi tiêu</span>
          <span className="stat-value expense">
            {formatCurrency(wallet?.total_spent || 0)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Đang giữ</span>
          <span className="stat-value locked">
            {formatCurrency(wallet?.locked_balance || 0)}
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="wallet-transactions">
        <div className="transactions-header">
          <h2>Lịch sử giao dịch</h2>
          <div className="transaction-tabs">
            <button
              className={`tab-btn ${activeTab === "topup" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("topup");
                setPage(1);
              }}
            >
              💰 Nạp tiền
            </button>
            <button
              className={`tab-btn ${activeTab === "wallet" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("wallet");
                setPage(1);
              }}
            >
              🪙 Lịch sử ví
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
                  <p>
                    📭{" "}
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
                            {isIncome ? "↓" : "↑"}
                          </div>
                          <div className="transaction-details">
                            <div className="transaction-title">
                              {transaction.description}
                            </div>
                            <div className="transaction-date">
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
                      ← Trước
                    </button>
                    <span className="page-info">
                      Trang {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="btn-page"
                    >
                      Sau →
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
