import React from "react";
import "../css/Homepage.css";

type Props = {
  onNavigateToLogin: () => void;
};

export default function Homepage({ onNavigateToLogin }: Props) {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="hero-header">
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-logo">
              <div className="logo-icon">S</div>
              <span className="logo-text">SlideAI</span>
            </div>
            <ul className="navbar-menu">
              <li>
                <a href="#features">Tính năng</a>
              </li>
              <li>
                <a href="#pricing">Bảng giá</a>
              </li>
              <li>
                <a href="#about">Về chúng tôi</a>
              </li>
              <li>
                <a href="#contact">Liên hệ</a>
              </li>
            </ul>
            <div className="navbar-actions">
              <button onClick={onNavigateToLogin} className="btn-login">
                Đăng nhập
              </button>
              <button onClick={onNavigateToLogin} className="btn-signup">
                Bắt đầu miễn phí
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Powered by AI - Tạo slide trong 60 giây</span>
          </div>
          <h1 className="hero-title">
            Tạo Slide Giáo Dục
            <br />
            <span className="gradient-text">Cực Đỉnh Với AI</span>
          </h1>
          <p className="hero-description">
            Hệ thống tạo slide thông minh dành cho giáo viên. Chỉ cần chọn môn
            học, khối lớp và AI sẽ tạo slide chuyên nghiệp cho bạn trong vài
            giây.
          </p>
          <div className="hero-actions">
            <button onClick={onNavigateToLogin} className="btn-primary-large">
              <span>Bắt đầu ngay</span>
              <span className="btn-icon">→</span>
            </button>
            <button className="btn-secondary-large">
              <span className="play-icon">▶</span>
              <span>Xem demo</span>
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Giáo viên</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Slide đã tạo</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Đánh giá</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="float-card card-1">📚 Toán học</div>
          <div className="float-card card-2">🌍 Địa lý</div>
          <div className="float-card card-3">🔬 Khoa học</div>
          <div className="float-card card-4">✍️ Ngữ văn</div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Tính năng</span>
            <h2 className="section-title">Tại sao chọn SlideAI?</h2>
            <p className="section-description">
              Những tính năng đột phá giúp bạn tạo slide nhanh hơn 10 lần
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon icon-ai">🤖</div>
              <h3 className="feature-title">AI Thông Minh</h3>
              <p className="feature-description">
                AI tự động tạo nội dung phù hợp với chương trình học và độ tuổi
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-fast">⚡</div>
              <h3 className="feature-title">Cực Nhanh</h3>
              <p className="feature-description">
                Tạo slide hoàn chỉnh chỉ trong 60 giây với chất lượng cao
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-custom">🎨</div>
              <h3 className="feature-title">Tùy Biến Dễ Dàng</h3>
              <p className="feature-description">
                Chỉnh sửa, thêm hình ảnh, video và tương tác trực quan
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-curriculum">📖</div>
              <h3 className="feature-title">Theo Chương Trình</h3>
              <p className="feature-description">
                Nội dung tuân thủ chặt chẽ chương trình giáo dục Việt Nam
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-template">📐</div>
              <h3 className="feature-title">Templates Đa Dạng</h3>
              <p className="feature-description">
                Hàng trăm template chuyên nghiệp cho mọi môn học
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-export">💾</div>
              <h3 className="feature-title">Xuất Đa Định Dạng</h3>
              <p className="feature-description">
                Xuất PDF, PowerPoint, Google Slides và nhiều định dạng khác
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Quy trình</span>
            <h2 className="section-title">Chỉ 3 bước đơn giản</h2>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Chọn môn học & khối lớp</h3>
                <p className="step-description">
                  Chọn môn học bạn muốn dạy và khối lớp phù hợp
                </p>
              </div>
              <div className="step-icon">📚</div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">AI tạo nội dung</h3>
                <p className="step-description">
                  Trí tuệ nhân tạo tự động tạo slide chuyên nghiệp
                </p>
              </div>
              <div className="step-icon">🤖</div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Tùy chỉnh & sử dụng</h3>
                <p className="step-description">
                  Chỉnh sửa theo ý muốn và bắt đầu giảng dạy
                </p>
              </div>
              <div className="step-icon">✨</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Bảng giá</span>
            <h2 className="section-title">Gói dịch vụ phù hợp với bạn</h2>
            <p className="section-description">
              Bắt đầu miễn phí, nâng cấp khi cần
            </p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Miễn phí</h3>
                <div className="pricing-price">
                  <span className="price-value">0đ</span>
                  <span className="price-period">/tháng</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>✓ 10 slide/tháng</li>
                <li>✓ Templates cơ bản</li>
                <li>✓ Xuất PDF</li>
                <li>✓ Hỗ trợ email</li>
              </ul>
              <button onClick={onNavigateToLogin} className="btn-pricing">
                Bắt đầu miễn phí
              </button>
            </div>

            <div className="pricing-card featured">
              <div className="popular-badge">Phổ biến</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Pro</h3>
                <div className="pricing-price">
                  <span className="price-value">199K</span>
                  <span className="price-period">/tháng</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>✓ Không giới hạn slide</li>
                <li>✓ Tất cả templates</li>
                <li>✓ Xuất mọi định dạng</li>
                <li>✓ AI nâng cao</li>
                <li>✓ Hỗ trợ ưu tiên</li>
              </ul>
              <button
                onClick={onNavigateToLogin}
                className="btn-pricing primary"
              >
                Nâng cấp ngay
              </button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Trường học</h3>
                <div className="pricing-price">
                  <span className="price-value">Liên hệ</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>✓ Tất cả tính năng Pro</li>
                <li>✓ Quản lý nhiều giáo viên</li>
                <li>✓ Thống kê chi tiết</li>
                <li>✓ Đào tạo & onboarding</li>
                <li>✓ Hỗ trợ 24/7</li>
              </ul>
              <button className="btn-pricing">Liên hệ tư vấn</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Sẵn sàng tạo slide tuyệt vời?</h2>
          <p className="cta-description">
            Hàng ngàn giáo viên đã tin dùng. Đến lượt bạn!
          </p>
          <button onClick={onNavigateToLogin} className="btn-cta">
            Bắt đầu miễn phí ngay
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-column">
              <div className="footer-logo">
                <div className="logo-icon">S</div>
                <span className="logo-text">SlideAI</span>
              </div>
              <p className="footer-description">
                Hệ thống tạo slide giáo dục thông minh với AI
              </p>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Sản phẩm</h4>
              <ul className="footer-links">
                <li>
                  <a href="#features">Tính năng</a>
                </li>
                <li>
                  <a href="#pricing">Bảng giá</a>
                </li>
                <li>
                  <a href="#templates">Templates</a>
                </li>
                <li>
                  <a href="#api">API</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Công ty</h4>
              <ul className="footer-links">
                <li>
                  <a href="#about">Về chúng tôi</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#careers">Tuyển dụng</a>
                </li>
                <li>
                  <a href="#contact">Liên hệ</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Hỗ trợ</h4>
              <ul className="footer-links">
                <li>
                  <a href="#help">Trung tâm hỗ trợ</a>
                </li>
                <li>
                  <a href="#docs">Tài liệu</a>
                </li>
                <li>
                  <a href="#privacy">Chính sách</a>
                </li>
                <li>
                  <a href="#terms">Điều khoản</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2025 SlideAI. All rights reserved.
            </p>
            <div className="footer-social">
              <a href="#facebook" className="social-link">
                Facebook
              </a>
              <a href="#twitter" className="social-link">
                Twitter
              </a>
              <a href="#linkedin" className="social-link">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
