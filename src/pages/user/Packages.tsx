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
            <div className="spinner"></div>
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
          <h1>Chọn gói nạp Credits</h1>
          <p>Chọn gói phù hợp với nhu cầu của bạn</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={loadPackages} className="btn-retry">
              Thử lại
            </button>
          </div>
        )}

        <div className="packages-grid">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onSelect={handleSelectPackage}
              isLoading={processingPackageId === pkg.id}
            />
          ))}
        </div>

        {packages.length === 0 && !error && (
          <div className="empty-state">
            <p>Không có gói nào khả dụng</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
