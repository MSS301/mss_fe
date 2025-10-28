import React from "react";
import "../../css/Dashboard.css";

export default function SystemSettings() {
  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Cấu hình hệ thống</h3>
        </div>
        <div className="card-body">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-xl)",
            }}
          >
            <div>
              <h4
                style={{
                  marginBottom: "var(--spacing-md)",
                  fontSize: "var(--font-size-lg)",
                }}
              >
                Thông tin chung
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-md)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-xs)",
                  }}
                >
                  <label
                    style={{ fontWeight: 500, color: "var(--text-secondary)" }}
                  >
                    Tên hệ thống
                  </label>
                  <input
                    type="text"
                    defaultValue="MSS Education Platform"
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--font-size-base)",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-xs)",
                  }}
                >
                  <label
                    style={{ fontWeight: 500, color: "var(--text-secondary)" }}
                  >
                    Email hệ thống
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@mss.edu.vn"
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--font-size-base)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4
                style={{
                  marginBottom: "var(--spacing-md)",
                  fontSize: "var(--font-size-lg)",
                }}
              >
                Microservices
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "var(--spacing-md)",
                }}
              >
                <div
                  style={{
                    padding: "var(--spacing-md)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>Auth Service</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      http://localhost:8081
                    </div>
                  </div>
                  <span className="badge badge-success">Running</span>
                </div>

                <div
                  style={{
                    padding: "var(--spacing-md)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>User Service</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      http://localhost:8082
                    </div>
                  </div>
                  <span className="badge badge-success">Running</span>
                </div>

                <div
                  style={{
                    padding: "var(--spacing-md)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>Slide Service</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      http://localhost:8083
                    </div>
                  </div>
                  <span className="badge badge-success">Running</span>
                </div>

                <div
                  style={{
                    padding: "var(--spacing-md)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>Payment Service</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      http://localhost:8084
                    </div>
                  </div>
                  <span className="badge badge-warning">High Load</span>
                </div>

                <div
                  style={{
                    padding: "var(--spacing-md)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>Curriculum Service</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      http://localhost:8085
                    </div>
                  </div>
                  <span className="badge badge-success">Running</span>
                </div>

                <div
                  style={{
                    padding: "var(--spacing-md)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>Notification Service</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      http://localhost:8086
                    </div>
                  </div>
                  <span className="badge badge-success">Running</span>
                </div>
              </div>
            </div>

            <div>
              <h4
                style={{
                  marginBottom: "var(--spacing-md)",
                  fontSize: "var(--font-size-lg)",
                }}
              >
                Bảo mật
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-md)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--spacing-md)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>JWT Token Expiration</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Thời gian hết hạn token
                    </div>
                  </div>
                  <input
                    type="text"
                    defaultValue="24 hours"
                    style={{
                      padding: "var(--spacing-xs) var(--spacing-sm)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      width: "150px",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--spacing-md)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>Max Login Attempts</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Số lần đăng nhập sai tối đa
                    </div>
                  </div>
                  <input
                    type="number"
                    defaultValue="5"
                    style={{
                      padding: "var(--spacing-xs) var(--spacing-sm)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      width: "80px",
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "fit-content" }}
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
