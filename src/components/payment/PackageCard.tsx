import React from "react";
import { Package, formatPrice, formatCredits } from "../../api/payment";
import "./PackageCard.css";

interface PackageCardProps {
  package: Package;
  onSelect: (pkg: Package) => void;
  isLoading?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onSelect,
  isLoading = false,
}) => {
  const handleClick = () => {
    if (!isLoading) {
      onSelect(pkg);
    }
  };

  return (
    <div className={`package-card ${isLoading ? "loading" : ""}`}>
      <div className="package-header">
        <h3 className="package-name">{pkg.name}</h3>
        <span className="package-code">{pkg.code}</span>
      </div>

      <div className="package-body">
        <p className="package-description">{pkg.description}</p>

        <div className="package-credits">
          <div className="credits-item">
            <span className="credits-label">Credits:</span>
            <span className="credits-value">
              {formatCredits(pkg.credits - pkg.bonusCredits)}
            </span>
          </div>
          {pkg.bonusCredits > 0 && (
            <div className="credits-item bonus">
              <span className="credits-label">Bonus:</span>
              <span className="credits-value">
                +{formatCredits(pkg.bonusCredits)}
              </span>
            </div>
          )}
          <div className="credits-item total">
            <span className="credits-label">Total Credits:</span>
            <span className="credits-value">{formatCredits(pkg.credits)}</span>
          </div>
        </div>

        <div className="package-price">
          <span className="price-amount">
            {formatPrice(pkg.price, pkg.currency)}
          </span>
        </div>
      </div>

      <div className="package-footer">
        <button
          className="btn-select-package"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Chọn gói"}
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
