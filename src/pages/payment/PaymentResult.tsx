import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentResult.css";

const PaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const success = searchParams.get("success") === "true";
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");
  const cancel = searchParams.get("cancel") === "true";
  const reason = searchParams.get("reason");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/wallet");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToWallet = () => {
    navigate("/wallet");
  };

  const handleGoToPackages = () => {
    navigate("/packages");
  };

  if (cancel) {
    return (
      <div className="payment-result-page">
        <div className="result-container cancelled">
          <div className="result-icon">⚠️</div>
          <h1>Thanh toán đã bị hủy</h1>
          <p className="result-message">
            {reason || "Bạn đã hủy giao dịch thanh toán"}
          </p>
          {orderCode && (
            <div className="result-details">
              <p>
                <strong>Mã đơn hàng:</strong> {orderCode}
              </p>
            </div>
          )}
          <div className="result-actions">
            <button className="btn-primary" onClick={handleGoToPackages}>
              Thử lại
            </button>
            <button className="btn-secondary" onClick={handleGoToWallet}>
              Về ví của tôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="payment-result-page">
        <div className="result-container success">
          <div className="result-icon success-icon">✓</div>
          <h1>Thanh toán thành công!</h1>
          <p className="result-message">
            Giao dịch của bạn đã được xử lý thành công. Credits đã được cộng vào
            tài khoản.
          </p>
          {orderCode && (
            <div className="result-details">
              <p>
                <strong>Mã đơn hàng:</strong> {orderCode}
              </p>
              {status && (
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span className="status-badge success">{status}</span>
                </p>
              )}
            </div>
          )}
          <p className="redirect-message">
            Tự động chuyển về ví trong {countdown} giây...
          </p>
          <div className="result-actions">
            <button className="btn-primary" onClick={handleGoToWallet}>
              Về ví ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-page">
      <div className="result-container failed">
        <div className="result-icon">❌</div>
        <h1>Thanh toán thất bại</h1>
        <p className="result-message">
          Rất tiếc, giao dịch của bạn không thành công. Vui lòng thử lại.
        </p>
        {orderCode && (
          <div className="result-details">
            <p>
              <strong>Mã đơn hàng:</strong> {orderCode}
            </p>
            {status && (
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className="status-badge failed">{status}</span>
              </p>
            )}
          </div>
        )}
        <div className="result-actions">
          <button className="btn-primary" onClick={handleGoToPackages}>
            Thử lại
          </button>
          <button className="btn-secondary" onClick={handleGoToWallet}>
            Về ví của tôi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
