import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getCurrentUserProfile,
  updateSelfUserProfile,
  getSchools,
  UserProfileResult,
  resolveAvatarUrl,
} from "../api/auth";

export default function EditProfile(): JSX.Element {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [schoolId, setSchoolId] = useState<number | "">("");
  const [fullName, setFullName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [teacherProofFile, setTeacherProofFile] = useState<File | null>(null);
  const [schools, setSchools] = useState<Array<{ id: number; name: string }>>([]);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      setLoading(true);
      try {
        const p = await getCurrentUserProfile(token);
        if (mounted && p) {
          setProfile(p);
          setSchoolId(p.schoolId || "");
          setFullName(p.fullName || "");
          setDateOfBirth(p.dateOfBirth || "");
          setPreviewAvatar(resolveAvatarUrl(p.avatarUrl));
        }
        // fetch schools for dropdown
        try {
          const page = await getSchools(token, 0, 100, "desc");
          if (mounted) setSchools(page.content || []);
        } catch (error_) {
          console.warn("Failed to load schools:", error_);
        }
      } catch (err: any) {
        console.warn("getCurrentUserProfile error:", err);
        if (mounted) {
          setError("Không thể tải thông tin hồ sơ");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) return setError("Missing auth token");

    if (!fullName) return setError("Full name is required");

    setSubmitting(true);
    try {
      const form = new FormData();
      if (schoolId !== "") form.append("schoolId", String(schoolId));
      form.append("fullName", fullName);
      if (dateOfBirth) form.append("dateOfBirth", dateOfBirth);
      if (profile?.role) form.append("role", profile.role);
      
      // If avatar file is selected, convert to Base64 and send as avatarUrl
      if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          form.append("avatarUrl", base64Data);
          await submitForm(form);
        };
        reader.onerror = () => {
          setError("Lỗi khi đọc ảnh avatar");
          setSubmitting(false);
        };
        reader.readAsDataURL(avatarFile);
      } else {
        await submitForm(form);
      }
    } catch (err: any) {
      console.error("Update profile error:", err);
      setError(err?.message || String(err));
      setSubmitting(false);
    }
  }

  async function submitForm(form: FormData) {
    try {
      if (teacherProofFile) {
        form.append("teacherProof", teacherProofFile, teacherProofFile.name);
      }
      const updated = await updateSelfUserProfile(token!, form);
      setProfile(updated);
      alert("Cập nhật hồ sơ thành công!");
      navigate("/profile");
    } catch (err: any) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  if (loading) return <div>Đang tải thông tin hồ sơ...</div>;

  if (!profile) {
    return (
      <div className="container">
        <h2>Không tìm thấy hồ sơ</h2>
        <p>Vui lòng tạo hồ sơ trước.</p>
        <button onClick={() => navigate("/profile")}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 650, margin: '40px auto', padding: '24px', backgroundColor: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16, color: '#333' }}>Chỉnh sửa hồ sơ</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        {/* Avatar Preview */}
        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={previewAvatar || "https://i.pravatar.cc/150"}
            alt="Avatar"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #2196F3',
              marginBottom: 12
            }}
          />
          <div style={{ fontSize: 14, color: '#666' }}>Vai trò: <strong>{profile.role === "TEACHER" ? "Giáo viên" : "Học sinh"}</strong></div>
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
          <label htmlFor="avatarFile" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>Avatar (ảnh mới)</label>
          <input
            id="avatarFile"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: 14,
              border: '1px solid #ccc',
              borderRadius: 6,
              backgroundColor: 'white'
            }}
          />
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Chọn file mới để thay đổi avatar</div>
        </div>

        {profile.role === "TEACHER" && (
          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#fff3e0', borderRadius: 6, border: '1px solid #FF9800' }}>
            <label htmlFor="teacherProof" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#333' }}>
              Giấy tờ chứng minh mới (ảnh, pdf)
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
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              Chỉ tải lên nếu muốn cập nhật giấy tờ
              {profile.teacherProofVerified && (
                <span style={{ color: '#4CAF50', marginLeft: 8 }}>✓ Đã xác minh</span>
              )}
            </div>
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
              backgroundColor: submitting ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: submitting ? 'none' : '0 2px 6px rgba(33,150,243,0.3)'
            }}
          >
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
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
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
