import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getCurrentUserProfile,
  createSelfUserProfile,
  getSchools,
  UserProfileResult,
  resolveAvatarUrl,
} from "../api/auth";
import "../css/Profile.css";

export default function Profile(): JSX.Element {
  const { token } = useAuth();
  console.debug("Profile component render - token present?", !!token, token ? `${token.substring(0,8)}...${token.slice(-6)}` : null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [choice, setChoice] = useState<"STUDENT" | "TEACHER" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [schoolId, setSchoolId] = useState<number | "">("");
  const [fullName, setFullName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [teacherProofFile, setTeacherProofFile] = useState<File | null>(null);
  const [schools, setSchools] = useState<Array<{ id: number; name: string }>>([]);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      setLoading(true);
      try {
        const p = await getCurrentUserProfile(token);
        if (mounted) setProfile(p);
        // fetch schools for dropdown
        try {
          const page = await getSchools(token, 0, 100, "desc");
          if (mounted) setSchools(page.content || []);
        } catch (error_) {
          console.warn("Failed to load schools:", error_);
        }
      } catch (err: any) {
        // If server returns 404 for no profile, getCurrentUserProfile throws; treat as no profile
        console.warn("getCurrentUserProfile error:", err);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  function onChoose(c: "STUDENT" | "TEACHER") {
    setChoice(c);

    // Fetch schools at the moment user chooses role to avoid token race on mount
    (async () => {
      if (!token) {
        console.warn("Profile:onChoose - no token available when fetching schools");
        return;
      }
      try {
        const page = await getSchools(token, 0, 100, "desc");
        setSchools(page.content || []);
      } catch (err) {
        console.error("Profile:onChoose - failed to load schools", err);
      }
    })();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) return setError("Missing auth token");

    if (!fullName) return setError("Full name is required");
    if (!choice) return setError("Please choose Student or Teacher");

    setSubmitting(true);
    try {
      const form = new FormData();
      if (schoolId !== "") form.append("schoolId", String(schoolId));
      form.append("fullName", fullName);
      if (dateOfBirth) form.append("dateOfBirth", dateOfBirth);
      form.append("role", choice);

      // If avatar file is selected, convert to Base64 and send as avatarUrl
      if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          form.append("avatarUrl", base64Data);
          await submitProfileForm(form);
        };
        reader.onerror = () => {
          setError("Lỗi khi đọc ảnh avatar");
          setSubmitting(false);
        };
        reader.readAsDataURL(avatarFile);
      } else {
        await submitProfileForm(form);
      }
    } catch (err: any) {
      console.error("Create profile error:", err);
      setError(err?.message || String(err));
      setSubmitting(false);
    }
  }

  async function submitProfileForm(form: FormData) {
    try {
      if (teacherProofFile) {
        form.append("teacherProof", teacherProofFile, teacherProofFile.name);
      }
      const created = await createSelfUserProfile(token!, form);
      setProfile(created);
    } catch (err: any) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '12px', animation: 'spin 0.8s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
            <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38643 22 10.6868 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Đang tải thông tin hồ sơ...
        </div>
      </div>
    );
  }

  if (profile) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-title">Hồ sơ của bạn</h1>
            <div className="profile-avatar-wrapper">
              <img
                src={resolveAvatarUrl(profile.avatarUrl) || "https://i.pravatar.cc/150"}
                alt={profile.fullName || "Avatar"}
                className="profile-avatar"
              />
              <div className="profile-avatar-badge">
                {profile.role === "TEACHER" ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L12.5 7.5L18.5 8.5L14 12.5L15 18.5L10 15.5L5 18.5L6 12.5L1.5 8.5L7.5 7.5L10 2Z" fill="#667eea"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#43e97b"/>
                    <path d="M10 12C6.68629 12 4 14.6863 4 18H16C16 14.6863 13.3137 12 10 12Z" fill="#43e97b"/>
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="profile-info-section">
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <div className="profile-info-label">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 14C2 11.5147 4.51472 9 7 9H9C11.4853 9 14 11.5147 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Họ và tên
                </div>
                <div className="profile-info-value">{profile.fullName || "-"}</div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-label">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L10 6L14 7L11 10L11.5 14L8 12L4.5 14L5 10L2 7L6 6L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Vai trò
                </div>
                <div className="profile-info-value">
                  <span className={`profile-role-badge ${profile.role === "TEACHER" ? "teacher" : "student"}`}>
                    {profile.role === "TEACHER" ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1L9.5 5.5L14 6.5L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6.5L6.5 5.5L8 1Z" fill="currentColor"/>
                        </svg>
                        Giáo viên
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" fill="currentColor"/>
                          <path d="M2 14C2 11.5147 4.51472 9 7 9H9C11.4853 9 14 11.5147 14 14" fill="currentColor"/>
                        </svg>
                        Học sinh
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-label">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 16C1 12.6863 3.68629 10 7 10H9C12.3137 10 15 12.6863 15 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Trường
                </div>
                <div className="profile-info-value">{profile.schoolName || profile.schoolId || "-"}</div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-label">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Ngày sinh
                </div>
                <div className="profile-info-value">
                  {profile.dateOfBirth 
                    ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : "-"}
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                onClick={() => navigate("/profile/edit")}
                className="btn-edit-profile"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M11.25 3.75L14.25 6.75M2.5 17.5L6.13333 16.8667C6.38333 16.8167 6.60833 16.6917 6.78333 16.5167L15.25 8.05C15.5833 7.71667 15.5833 7.18333 15.25 6.85L13.15 4.75C12.8167 4.41667 12.2833 4.41667 11.95 4.75L3.48333 13.2167C3.30833 13.3917 3.18333 13.6167 3.13333 13.8667L2.5 17.5L11.25 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No profile -> show choice and form
  return (
    <div className="profile-container">
      <div className="profile-create-card">
        <div className="profile-create-header">
          <h1 className="profile-create-title">Tạo hồ sơ</h1>
          <p className="profile-create-subtitle">
            Bạn chưa có hồ sơ. Vui lòng chọn vai trò và điền thông tin để bắt đầu.
          </p>
        </div>

        {!choice && (
          <div className="profile-role-selection">
            <button
              onClick={() => onChoose("STUDENT")}
              className="profile-role-button"
            >
              <div className="profile-role-icon student">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 16C19.3137 16 22 13.3137 22 10C22 6.68629 19.3137 4 16 4C12.6863 4 10 6.68629 10 10C10 13.3137 12.6863 16 16 16Z" fill="white"/>
                  <path d="M4 28C4 23.0294 8.02944 19 13 19H19C23.9706 19 28 23.0294 28 28" fill="white"/>
                </svg>
              </div>
              <div className="profile-role-name">Học sinh</div>
              <div className="profile-role-description">
                Tạo hồ sơ để tham gia các lớp học và học tập
              </div>
            </button>
            <button
              onClick={() => onChoose("TEACHER")}
              className="profile-role-button"
            >
              <div className="profile-role-icon teacher">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L19.09 11.26L29 12.27L21.5 18.74L23.18 28.02L16 23.77L8.82 28.02L10.5 18.74L3 12.27L12.91 11.26L16 2Z" fill="white"/>
                </svg>
              </div>
              <div className="profile-role-name">Giáo viên</div>
              <div className="profile-role-description">
                Tạo hồ sơ để quản lý lớp học và tạo slide
              </div>
            </button>
          </div>
        )}

        {choice && (
          <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-form-section">
            <div className="profile-selected-role">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {choice === "TEACHER" ? (
                  <path d="M9 1L11.5 6.5L17.5 7.5L13 11.5L14.5 17.5L9 14.5L3.5 17.5L5 11.5L0.5 7.5L6.5 6.5L9 1Z" fill="currentColor"/>
                ) : (
                  <>
                    <path d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z" fill="currentColor"/>
                    <path d="M15.75 16.5C15.75 13.5147 12.7279 11.25 9 11.25C5.27208 11.25 2.25 13.5147 2.25 16.5" fill="currentColor"/>
                  </>
                )}
              </svg>
              <span>Vai trò: {choice === "TEACHER" ? "Giáo viên" : "Học sinh"}</span>
            </div>

            <div className="profile-form-group">
              <label htmlFor="schoolSelect" className="profile-form-label">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.75 16.5C15.75 13.5147 12.7279 11.25 9 11.25C5.27208 11.25 2.25 13.5147 2.25 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Trường
              </label>
              <select
                id="schoolSelect"
                value={schoolId === "" ? "" : String(schoolId)}
                onChange={(e) => setSchoolId(e.target.value === "" ? "" : Number(e.target.value))}
                className="profile-form-select"
              >
                <option value="">-- Chọn trường --</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="profile-form-group">
              <label htmlFor="fullNameInput" className="profile-form-label">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.75 16.5C15.75 13.5147 12.7279 11.25 9 11.25C5.27208 11.25 2.25 13.5147 2.25 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Họ và tên
                <span className="required">*</span>
              </label>
              <input
                id="fullNameInput"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="profile-form-input"
                placeholder="Nhập họ và tên của bạn"
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="dobInput" className="profile-form-label">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 4.5V9L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Ngày sinh
              </label>
              <input
                id="dobInput"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="profile-form-input"
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="avatarFile" className="profile-form-label">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M14.25 12.75L11.25 9.75L8.25 12.75M14.25 3.75H3.75C2.92157 3.75 2.25 4.42157 2.25 5.25V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V5.25C15.75 4.42157 15.0784 3.75 14.25 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6.75" cy="6.75" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Avatar (ảnh đại diện)
              </label>
              <input
                id="avatarFile"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                className="profile-form-file-input"
              />
            </div>
          </div>

          {choice === "TEACHER" && (
            <div className="profile-form-section">
              <div className="profile-teacher-proof-notice">
                <div className="profile-teacher-proof-notice-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5L11.25 6.75L17.25 7.5L13.5 11.25L14.25 17.25L9 14.25L3.75 17.25L4.5 11.25L0.75 7.5L6.75 6.75L9 1.5Z" fill="currentColor"/>
                  </svg>
                  Yêu cầu đặc biệt cho giáo viên
                </div>
                <p className="profile-teacher-proof-notice-text">
                  Vui lòng tải lên giấy tờ chứng minh bạn là giáo viên (bằng cấp, giấy phép giảng dạy, v.v.) để được xác minh.
                </p>
              </div>
              <div className="profile-form-group">
                <label htmlFor="teacherProof" className="profile-form-label">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M14 2H4C3.17157 2 2.5 2.67157 2.5 3.5V14.5C2.5 15.3284 3.17157 16 4 16H14C14.8284 16 15.5 15.3284 15.5 14.5V3.5C15.5 2.67157 14.8284 2 14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.5 5.5H12.5M5.5 9H12.5M5.5 12.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Giấy tờ chứng minh (ảnh, PDF)
                  <span className="required">*</span>
                </label>
                <input
                  id="teacherProof"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setTeacherProofFile(e.target.files ? e.target.files[0] : null)}
                  className="profile-form-file-input"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="profile-form-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="profile-form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="btn-submit-profile"
            >
              {submitting ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
                    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                    <path d="M9 1.5C11.4853 1.5 13.5 3.51472 13.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Gửi hồ sơ</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setChoice(null)}
              className="btn-cancel-profile"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Quay lại</span>
            </button>
          </div>
          </form>
        )}
      </div>
    </div>
  );
}

