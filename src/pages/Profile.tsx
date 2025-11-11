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

  if (loading) return <div>Đang tải thông tin hồ sơ...</div>;

  if (profile) {
    return (
      <div className="container" style={{ maxWidth: 650, margin: '40px auto', padding: '24px', backgroundColor: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#333' }}>Hồ sơ của bạn</h2>
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24, padding: 20, backgroundColor: 'white', borderRadius: 8 }}>
          <img
            src={resolveAvatarUrl(profile.avatarUrl) || "https://i.pravatar.cc/150"}
            alt={profile.fullName || "Avatar"}
            className="avatar avatar-lg"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid #2196F3' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <strong style={{ color: '#555' }}>Họ và tên:</strong> <span style={{ color: '#333' }}>{profile.fullName}</span>
            </div>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <strong style={{ color: '#555' }}>Vai trò:</strong> <span style={{ color: '#333' }}>{profile.role === "TEACHER" ? "Giáo viên" : "Học sinh"}</span>
            </div>
            <div style={{ marginBottom: 12, fontSize: 15 }}>
              <strong style={{ color: '#555' }}>Trường:</strong> <span style={{ color: '#333' }}>{profile.schoolName || profile.schoolId || "-"}</span>
            </div>
            <div style={{ fontSize: 15 }}>
              <strong style={{ color: '#555' }}>Ngày sinh:</strong> <span style={{ color: '#333' }}>{profile.dateOfBirth || "-"}</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => navigate("/profile/edit")}
            style={{
              padding: '12px 32px',
              fontSize: 16,
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(33,150,243,0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
          >
            ✏️ Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>
    );
  }

  // No profile -> show choice and form
  return (
    <div className="container" style={{ maxWidth: 650, margin: '40px auto', padding: '24px', backgroundColor: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16, color: '#333' }}>Tạo hồ sơ</h2>
      <p style={{ textAlign: 'center', marginBottom: 24, color: '#666' }}>Bạn chưa có hồ sơ. Vui lòng chọn vai trò và điền thông tin.</p>

      {!choice && (
        <div style={{ display: "flex", gap: 16, justifyContent: 'center', marginTop: 24 }}>
          <button
            onClick={() => onChoose("STUDENT")}
            style={{
              padding: '14px 40px',
              fontSize: 16,
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(76,175,80,0.3)'
            }}
          >
            Học sinh
          </button>
          <button
            onClick={() => onChoose("TEACHER")}
            style={{
              padding: '14px 40px',
              fontSize: 16,
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(33,150,243,0.3)'
            }}
          >
            Giáo viên
          </button>
        </div>
      )}

      {choice && (
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 20, padding: 12, backgroundColor: '#e8f5e9', borderRadius: 6, border: '1px solid #4CAF50' }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Vai trò:</div>
            <strong style={{ fontSize: 16, color: '#333' }}>{choice === "TEACHER" ? "Giáo viên" : "Học sinh"}</strong>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="schoolSelect" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>Trường</label>
            <select
              id="schoolSelect"
              value={schoolId === "" ? "" : String(schoolId)}
              onChange={(e) => setSchoolId(e.target.value === "" ? "" : Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 15,
                border: '1px solid #ccc',
                borderRadius: 6,
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Chọn trường --</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="fullNameInput" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>Họ và tên</label>
            <input
              id="fullNameInput"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 15,
                border: '1px solid #ccc',
                borderRadius: 6,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="dobInput" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>Ngày sinh</label>
            <input
              id="dobInput"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 15,
                border: '1px solid #ccc',
                borderRadius: 6,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label htmlFor="avatarFile" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>Avatar (ảnh)</label>
            <input
              id="avatarFile"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: 14,
                border: '1px solid #ccc',
                borderRadius: 6,
                backgroundColor: 'white'
              }}
            />
          </div>

          {choice === "TEACHER" && (
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#fff3e0', borderRadius: 6, border: '1px solid #FF9800' }}>
              <label htmlFor="teacherProof" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>
                Giấy tờ chứng minh (ảnh, pdf) <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                id="teacherProof"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setTeacherProofFile(e.target.files ? e.target.files[0] : null)}
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: 14,
                  border: '1px solid #FF9800',
                  borderRadius: 6,
                  backgroundColor: 'white'
                }}
              />
            </div>
          )}

          {error && (
            <div style={{
              padding: 12,
              marginBottom: 16,
              backgroundColor: '#ffebee',
              color: '#c62828',
              border: '1px solid #ef5350',
              borderRadius: 6,
              fontSize: 14
            }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '12px 32px',
                fontSize: 16,
                backgroundColor: submitting ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                boxShadow: submitting ? 'none' : '0 2px 6px rgba(76,175,80,0.3)'
              }}
            >
              {submitting ? "Đang gửi..." : "Gửi hồ sơ"}
            </button>
            <button
              type="button"
              onClick={() => setChoice(null)}
              style={{
                padding: '12px 32px',
                fontSize: 16,
                backgroundColor: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              Quay lại
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

