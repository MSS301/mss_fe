import React, { useState, useEffect } from "react";
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
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
          <h2 className="balance-title">Số dư khả dụng</h2>
          {wallet?.status === "ACTIVE" && (
            <span className="status-badge">✓ Đang hoạt động</span>
          )}
        </div>
        <div className="balance-amount">
          {formatCurrency(wallet?.balance || 0)}
        </div>
        <div className="balance-actions">
          <button className="action-btn deposit">
            <span className="btn-icon">+</span>
            Nạp tiền
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="wallet-stats">
        <div className="stat-item">
          <span className="stat-label">Thu nhập</span>
          <span className="stat-value income">
            {formatCurrency(wallet?.total_earned || 0)}
          </span>
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
          <button className="btn-filter">🔍 Lọc</button>
        </div>

        {loading && !transactions.length ? (
          <div className="transactions-empty">
            <p>Đang tải...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="transactions-empty">
            <p>📭 Chưa có giao dịch nào</p>
          </div>
        ) : (
          <>
            <div className="transaction-list">
              {transactions.map((transaction) => {
                const isIncome =
                  transaction.transaction_type === "TOP_UP" ||
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
                        {formatCurrency(Math.abs(transaction.amount))}
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
        )}
      </div>
    </div>
  );
}
