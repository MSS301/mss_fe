import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  getPackages,
  createPayment,
  getUserIdFromToken,
} from "../../api/payment";
import PackageCard from "../../components/payment/PackageCard";
import "./Packages.css";

const Packages: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPackageId, setProcessingPackageId] = useState<number | null>(
    null
  );

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const data = await getPackages(token);
      setPackages(data);
    } catch (err: any) {
      console.error("Error loading packages:", err);
      setError(err.message || "Không thể tải danh sách gói");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPackage = async (pkg: Package) => {
    try {
      setProcessingPackageId(pkg.id);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Lấy userId từ token hoặc localStorage
      const userId =
        getUserIdFromToken(token) || localStorage.getItem("userId") || "";

      if (!userId) {
        setError("Không tìm thấy thông tin người dùng");
        setProcessingPackageId(null);
        return;
      }

      const payment = await createPayment(token, pkg.id, userId, "PayOS", "");

      // Redirect to PayOS payment URL
      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      } else {
        throw new Error("Không nhận được link thanh toán");
      }
    } catch (err: any) {
      console.error("Error creating payment:", err);
      setError(err.message || "Không thể tạo thanh toán");
      setProcessingPackageId(null);
    }
  };

  if (loading) {
    return (
      <div className="packages-page">
        <div className="packages-container">
          <div className="loading-state">
            <div className="loading-spinner">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle
                  cx="30"
                  cy="30"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeOpacity="0.2"
                />
                <path
                  d="M30 6C16.7452 6 6 16.7452 6 30"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p>Đang tải danh sách gói...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="packages-page">
      <div className="packages-container">
        <div className="packages-header">
          <div className="packages-header-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="coinGradPkg" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FFD66B" />
                  <stop offset="60%" stopColor="#FFB84D" />
                  <stop offset="100%" stopColor="#CE8A00" />
                </linearGradient>
                <radialGradient id="coinShinePkg" cx="30%" cy="25%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="60%" stopColor="rgba(255,255,255,0.12)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="url(#coinGradPkg)"
                stroke="#b07a00"
                strokeWidth="1.2"
              />
              <circle
                cx="24"
                cy="24"
                r="14.5"
                fill="none"
                stroke="#e6b34a"
                strokeWidth="1.4"
              />
              <ellipse
                cx="18"
                cy="16"
                rx="7.5"
                ry="4.5"
                fill="url(#coinShinePkg)"
              />
              <g>
                <path
                  d="M24 17 C25.5 17 26.7 18 26.7 19.5 C26.7 21 25.5 22 24 22 C22.5 22 21.3 21 21.3 19.5 C21.3 18 22.5 17 24 17 Z"
                  fill="#fff9e6"
                  opacity="0.16"
                />
                <text
                  x="24"
                  y="30"
                  textAnchor="middle"
                  fontWeight="800"
                  fontSize="9"
                  fill="#6b3f00"
                >
                  ₫
                </text>
              </g>
            </svg>
          </div>
          <h1>Chọn gói nạp Credits</h1>
          <p>
            Chọn gói phù hợp với nhu cầu của bạn và bắt đầu tạo slide tuyệt vời
          </p>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V12M12 16H12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="error-text">{error}</span>
            <button onClick={loadPackages} className="btn-retry">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 4.5V9L12 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Thử lại</span>
            </button>
          </div>
        )}

        <div className="packages-grid">
          {packages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onSelect={handleSelectPackage}
              isLoading={processingPackageId === pkg.id}
              index={index}
            />
          ))}
        </div>

        {packages.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path
                  d="M20 20H60C62.7614 20 65 22.2386 65 25V55C65 57.7614 62.7614 60 60 60H20C17.2386 60 15 57.7614 15 55V25C15 22.2386 17.2386 20 20 20Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25 30H55M25 40H55M25 50H45"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p>Không có gói nào khả dụng</p>
            <p className="empty-state-subtitle">Vui lòng thử lại sau</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
