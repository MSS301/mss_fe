import React from "react";
import { Package, formatPrice, formatCredits } from "../../api/payment";
import "./PackageCard.css";

interface PackageCardProps {
  package: Package;
  onSelect: (pkg: Package) => void;
  isLoading?: boolean;
  index?: number;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onSelect,
  isLoading = false,
  index = 0,
}) => {
  const handleClick = () => {
    if (!isLoading) {
      onSelect(pkg);
    }
  };

  return (
    <div className={`package-card ${isLoading ? "loading" : ""}`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="package-header">
        <div className="package-header-top">
          <h3 className="package-name">{pkg.name}</h3>
          <span className="package-code">{pkg.code}</span>
        </div>
      </div>

      <div className="package-body">
        <p className="package-description">{pkg.description}</p>

        <div className="package-credits">
          <div className="credits-item">
            <div className="credits-item-left">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 5V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="credits-label">Credits:</span>
            </div>
            <span className="credits-value">
              {formatCredits(pkg.credits - pkg.bonusCredits)}
            </span>
          </div>
          {pkg.bonusCredits > 0 && (
            <div className="credits-item bonus">
              <div className="credits-item-left">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.5 7.5L18.5 8.5L14 12.5L15.5 18.5L10 15.5L4.5 18.5L6 12.5L1.5 8.5L7.5 7.5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="credits-label">Bonus:</span>
              </div>
              <span className="credits-value">
                +{formatCredits(pkg.bonusCredits)}
              </span>
            </div>
          )}
          <div className="credits-item total">
            <div className="credits-item-left">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 1C5.58172 1 2 4.58172 2 9C2 13.4183 5.58172 17 10 17C14.4183 17 18 13.4183 18 9C18 4.58172 14.4183 1 10 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 7L9 11L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="credits-label">Total Credits:</span>
            </div>
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
          {isLoading ? (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="btn-spinner">
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                <path d="M9 1.5C11.4853 1.5 13.5 3.51472 13.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Chọn gói</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="btn-arrow">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
