import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/login.css";

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Đang xử lý đăng nhập Google...");

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for error in URL
        const errorParam = searchParams.get("error");
        if (errorParam) {
          throw new Error(errorParam);
        }

        // Get token from URL query parameters
        const token = searchParams.get("token");
        const expiryTime = searchParams.get("expiryTime");

        if (!token) {
          throw new Error("No token received from authentication");
        }

        // Store token and redirect to dashboard
        setStatus("Đăng nhập thành công!");
        login(token);

        // Optional: Store expiry time
        if (expiryTime) {
          localStorage.setItem("tokenExpiryTime", expiryTime);
        }

        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (err: any) {
        console.error("OAuth2 callback error:", err);
        setError(err?.message || "Lỗi khi xử lý đăng nhập Google");
        // Redirect back to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleOAuth2Callback();
  }, [login, navigate, searchParams]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">S</div>
          <h2>Google OAuth2</h2>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div
              className="spinner"
              style={{
                margin: "0 auto 1rem",
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p style={{ color: "#666", fontSize: "14px" }}>{status}</p>
          </div>
        )}

        {error && (
          <div className="login-error">
            <span>⚠️</span>
            <div>
              <div>{error}</div>
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Đang chuyển về trang đăng nhập...
              </p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="login-success">
            <span>✓</span>
            <div>
              <div>Đăng nhập thành công!</div>
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Đang chuyển hướng...
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
