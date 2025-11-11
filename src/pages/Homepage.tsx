import React, { useState, useEffect } from "react";
import "../css/Homepage.css";

type Props = {
  onNavigateToLogin: () => void;
};

export default function Homepage({ onNavigateToLogin }: Props) {
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const featuresSection = document.getElementById('features');
      const pricingSection = document.getElementById('pricing');
      const howItWorksSection = document.querySelector('.how-it-works-section');
      
      // Kiểm tra nếu scroll xuống phần features, pricing hoặc how-it-works (có nền trắng)
      if (featuresSection || pricingSection || howItWorksSection) {
        const featuresTop = featuresSection?.getBoundingClientRect().top || Infinity;
        const pricingTop = pricingSection?.getBoundingClientRect().top || Infinity;
        const howItWorksTop = howItWorksSection?.getBoundingClientRect().top || Infinity;
        
        // Nếu scroll xuống phần có nền trắng (features, pricing hoặc how-it-works)
        if (featuresTop < 100 || pricingTop < 100 || howItWorksTop < 100) {
          setNavbarScrolled(true);
        } else {
          setNavbarScrolled(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="homepage">
      {/* Header */}
      <header className="hero-header">
        <nav className={`navbar ${navbarScrolled ? 'navbar-scrolled' : ''}`}>
          <div className="navbar-container">
            <div className="navbar-logo">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="logo-svg">
                  <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
                  <path
                    d="M16 8L22 14H18V20H14V14H10L16 8Z"
                    fill="white"
                    className="logo-path"
                  />
                  <path
                    d="M10 24H22V22H10V24Z"
                    fill="white"
                    className="logo-path"
                  />
                  <defs>
                    <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stopColor="#667eea"/>
                      <stop offset="100%" stopColor="#764ba2"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="logo-text">SlideAI</span>
            </div>
            <ul className="navbar-menu">
              <li>
                <a 
                  href="#ai-create" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('ai-create');
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  AI tạo Slide
                </a>
              </li>
              <li>
                <a 
                  href="#features" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('features');
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  Tính năng
                </a>
              </li>
              <li>
                <a 
                  href="#pricing" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('pricing');
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  Bảng giá
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('about');
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  Về chúng tôi
                </a>
              </li>
            </ul>
            <div className="navbar-actions">
              <button onClick={onNavigateToLogin} className="btn-login">
                Đăng nhập
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero-content">
          <div className="hero-badge">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="badge-icon">
              <path d="M10 2L12.5 7.5L18.5 8.5L14 12.5L15 18.5L10 15.5L5 18.5L6 12.5L1.5 8.5L7.5 7.5L10 2Z" fill="currentColor"/>
            </svg>
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="btn-icon">
                <path d="M5 10H15M15 10L11 6M15 10L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-secondary-large">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="play-icon">
                <path d="M6 4.5L14.25 9L6 13.5V4.5Z" fill="currentColor"/>
              </svg>
              <span>Xem demo</span>
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stat-icon">
                  <path d="M16 16C19.3137 16 22 13.3137 22 10C22 6.68629 19.3137 4 16 4C12.6863 4 10 6.68629 10 10C10 13.3137 12.6863 16 16 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 28C4 23.0294 8.02944 19 13 19H19C23.9706 19 28 23.0294 28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Giáo viên</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stat-icon">
                  <path d="M6 8C6 6.89543 6.89543 6 8 6H24C25.1046 6 26 6.89543 26 8V24C26 25.1046 25.1046 26 24 26H8C6.89543 26 6 25.1046 6 24V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12H26M12 6V26M20 6V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-number">50K+</div>
              <div className="stat-label">Slide đã tạo</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="stat-icon">
                  <path d="M16 2L19.09 11.26L29 12.27L21.5 18.74L23.18 28.02L16 23.77L8.82 28.02L10.5 18.74L3 12.27L12.91 11.26L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Đánh giá</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="float-card card-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Toán học</span>
          </div>
          <div className="float-card card-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2C15.31 2 18.23 3.92 19.77 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 22C8.69 22 5.77 20.08 4.23 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Địa lý</span>
          </div>
          <div className="float-card card-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Khoa học</span>
          </div>
          <div className="float-card card-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Ngữ văn</span>
          </div>
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
      <section id="ai-create" className="cta-section">
        <div className="cta-container">
          <div className="cta-icon-wrapper">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="cta-ai-icon">
              <circle cx="40" cy="40" r="38" fill="url(#ctaGradient)" opacity="0.2"/>
              <path d="M40 20L50 35H45V50H35V35H30L40 20Z" fill="white"/>
              <path d="M25 60H55V55H25V60Z" fill="white"/>
              <path d="M20 25C20 22.7909 21.7909 21 24 21H26C28.2091 21 30 22.7909 30 25V27C30 29.2091 28.2091 31 26 31H24C21.7909 31 20 29.2091 20 27V25Z" fill="white" opacity="0.8"/>
              <path d="M50 25C50 22.7909 51.7909 21 54 21H56C58.2091 21 60 22.7909 60 25V27C60 29.2091 58.2091 31 56 31H54C51.7909 31 50 29.2091 50 27V25Z" fill="white" opacity="0.8"/>
              <defs>
                <linearGradient id="ctaGradient" x1="0" y1="0" x2="80" y2="80">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="100%" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="cta-sparkle sparkle-1">✨</div>
            <div className="cta-sparkle sparkle-2">✨</div>
            <div className="cta-sparkle sparkle-3">✨</div>
          </div>
          <h2 className="cta-title">
            Tạo Slide Chuyên Nghiệp
            <br />
            <span className="cta-title-highlight">Với Sức Mạnh AI</span>
          </h2>
          <p className="cta-description">
            Chỉ cần vài cú click, AI sẽ tạo slide hoàn chỉnh cho bạn trong 60 giây.
            <br />
            <strong>Hàng ngàn giáo viên</strong> đã tin dùng và tiết kiệm hàng giờ mỗi tuần.
          </p>
          <div className="cta-features">
            <div className="cta-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
              <span>AI thông minh</span>
            </div>
            <div className="cta-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
              </svg>
              <span>Tạo trong 60 giây</span>
            </div>
            <div className="cta-feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Chất lượng cao</span>
            </div>
          </div>
          <button onClick={onNavigateToLogin} className="btn-cta">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 10H15M15 10L11 6M15 10L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Bắt đầu miễn phí ngay</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-column footer-about">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="8" fill="url(#footerLogoGradient)"/>
                    <path
                      d="M16 8L22 14H18V20H14V14H10L16 8Z"
                      fill="white"
                    />
                    <path
                      d="M10 24H22V22H10V24Z"
                      fill="white"
                    />
                    <defs>
                      <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#667eea"/>
                        <stop offset="100%" stopColor="#764ba2"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="logo-text">SlideAI</span>
              </div>
              <p className="footer-description">
                Hệ thống tạo slide giáo dục thông minh với AI. Giúp giáo viên tạo slide chuyên nghiệp trong vài giây.
              </p>
              <div className="footer-contact-info">
                <div className="contact-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 3H2.25C1.42157 3 0.75 3.67157 0.75 4.5V13.5C0.75 14.3284 1.42157 15 2.25 15H15.75C16.5784 15 17.25 14.3284 17.25 13.5V4.5C17.25 3.67157 16.5784 3 15.75 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M0.75 4.5L9 9.75L17.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>support@slideai.vn</span>
                </div>
                <div className="contact-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 12.75C15.75 13.5784 15.0784 14.25 14.25 14.25H3.75C2.92157 14.25 2.25 13.5784 2.25 12.75V5.25C2.25 4.42157 2.92157 3.75 3.75 3.75H14.25C15.0784 3.75 15.75 4.42157 15.75 5.25V12.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.75 8.25H11.25M6.75 10.5H9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span>+84 1900 1234</span>
                </div>
                <div className="contact-item">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 1.5C6.51472 1.5 4.5 3.51472 4.5 6C4.5 8.25 9 15.75 9 15.75C9 15.75 13.5 8.25 13.5 6C13.5 3.51472 11.4853 1.5 9 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                </div>
              </div>
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
                  <a href="#faq">Câu hỏi thường gặp</a>
                </li>
                <li>
                  <a href="#contact">Liên hệ hỗ trợ</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Pháp lý</h4>
              <ul className="footer-links">
                <li>
                  <a href="#privacy">Chính sách bảo mật</a>
                </li>
                <li>
                  <a href="#terms">Điều khoản sử dụng</a>
                </li>
                <li>
                  <a href="#cookie">Chính sách Cookie</a>
                </li>
                <li>
                  <a href="#license">Giấy phép</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <p className="footer-copyright">
                © 2025 <strong>SlideAI</strong>. Bản quyền thuộc về Công ty TNHH SlideAI Việt Nam.
              </p>
              <p className="footer-license">
                Giấy phép ĐKKD số: 0123456789 do Sở KH&ĐT TP. Hồ Chí Minh cấp ngày 01/01/2024
              </p>
            </div>
            <div className="footer-social">
              <a href="#facebook" className="social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.3333 10C18.3333 5.4 14.6 1.66667 10 1.66667C5.4 1.66667 1.66667 5.4 1.66667 10C1.66667 14.0333 4.68333 17.4083 8.61667 18.15V12.5H6.66667V10H8.61667V8.125C8.61667 6.00833 9.925 4.79167 11.9167 4.79167C12.8833 4.79167 13.8917 5 13.8917 5V7.08333H12.75C11.7083 7.08333 11.3833 7.66667 11.3833 8.26667V10H13.8083L13.3917 12.5H11.3833V18.15C15.3167 17.4083 18.3333 14.0333 18.3333 10Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#twitter" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.3333 4.99167C17.7083 5.275 17.0333 5.46667 16.325 5.56667C17.05 5.15 17.6083 4.46667 17.875 3.625C17.1917 4.00833 16.4333 4.29167 15.625 4.45833C14.975 3.75 14.0083 3.33333 12.9167 3.33333C10.7917 3.33333 9.08333 5.04167 9.08333 7.16667C9.08333 7.45 9.11667 7.725 9.175 7.99167C6.25833 7.85 3.73333 6.41667 2.03333 4.19167C1.725 4.65 1.55 5.15 1.55 5.69167C1.55 6.70833 2.09167 7.59167 2.91667 8.10833C2.33333 8.09167 1.79167 7.93333 1.30833 7.69167V7.73333C1.30833 9.55 2.53333 11.0833 4.19167 11.4333C3.89167 11.5083 3.575 11.5417 3.25 11.5417C3.01667 11.5417 2.79167 11.525 2.56667 11.4917C3.03333 12.95 4.35 14.0333 5.93333 14.0583C4.71667 15.05 3.19167 15.625 1.525 15.625C1.24167 15.625 0.958333 15.6083 0.683333 15.575C2.28333 16.625 4.18333 17.25 6.23333 17.25C12.9083 17.25 16.6833 11.6 16.6833 6.70833C16.6833 6.55 16.6833 6.39167 16.675 6.23333C17.375 5.70833 17.9833 5.075 18.3333 4.99167Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#linkedin" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6667 2.5H3.33333C2.875 2.5 2.5 2.875 2.5 3.33333V16.6667C2.5 17.125 2.875 17.5 3.33333 17.5H16.6667C17.125 17.5 17.5 17.125 17.5 16.6667V3.33333C17.5 2.875 17.125 2.5 16.6667 2.5ZM7.5 15H5V8.33333H7.5V15ZM6.25 7.08333C5.39167 7.08333 4.70833 6.4 4.70833 5.54167C4.70833 4.68333 5.39167 4 6.25 4C7.10833 4 7.79167 4.68333 7.79167 5.54167C7.79167 6.4 7.10833 7.08333 6.25 7.08333ZM15 15H12.5V11.25C12.5 10.3333 12.5 9.16667 11.25 9.16667C10 9.16667 9.79167 10.1667 9.79167 11.1917V15H7.29167V8.33333H9.66667V9.41667C10.0417 8.75 10.8333 8.33333 11.875 8.33333C14.0417 8.33333 15 9.79167 15 12.0833V15Z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#youtube" className="social-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.3333 5.83333C18.125 5.08333 17.5167 4.475 16.7667 4.26667C15.4167 3.83333 10 3.83333 10 3.83333C10 3.83333 4.58333 3.83333 3.23333 4.26667C2.48333 4.475 1.875 5.08333 1.66667 5.83333C1.25 7.18333 1.25 10 1.25 10C1.25 10 1.25 12.8167 1.66667 14.1667C1.875 14.9167 2.48333 15.525 3.23333 15.7333C4.58333 16.1667 10 16.1667 10 16.1667C10 16.1667 15.4167 16.1667 16.7667 15.7333C17.5167 15.525 18.125 14.9167 18.3333 14.1667C18.75 12.8167 18.75 10 18.75 10C18.75 10 18.75 7.18333 18.3333 5.83333Z" fill="currentColor"/>
                  <path d="M8.33333 12.5L13.3333 10L8.33333 7.5V12.5Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
