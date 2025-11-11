import React, { useState } from "react";
import "../css/Curriculum.css";

type Subject = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

type Grade = {
  id: number;
  name: string;
  level: number;
};

export default function Curriculum() {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const subjects: Subject[] = [
    { id: 1, name: "Toán học", icon: "📐", color: "#4F46E5" },
    { id: 2, name: "Ngữ văn", icon: "📚", color: "#10B981" },
    { id: 3, name: "Tiếng Anh", icon: "🌍", color: "#F59E0B" },
    { id: 4, name: "Khoa học", icon: "🔬", color: "#3B82F6" },
    { id: 5, name: "Lịch sử", icon: "🏛️", color: "#8B5CF6" },
    { id: 6, name: "Địa lý", icon: "🗺️", color: "#EF4444" },
    { id: 7, name: "Tin học", icon: "💻", color: "#06B6D4" },
    { id: 8, name: "Thể dục", icon: "⚽", color: "#F97316" },
  ];

  const grades: Grade[] = [
    { id: 1, name: "Lớp 1", level: 1 },
    { id: 2, name: "Lớp 2", level: 2 },
    { id: 3, name: "Lớp 3", level: 3 },
    { id: 4, name: "Lớp 4", level: 4 },
    { id: 5, name: "Lớp 5", level: 5 },
  ];

  const topics = [
    { id: 1, name: "Phép cộng và phép trừ", lessons: 8 },
    { id: 2, name: "Phép nhân và phép chia", lessons: 12 },
    { id: 3, name: "Phân số", lessons: 10 },
    { id: 4, name: "Hình học cơ bản", lessons: 6 },
    { id: 5, name: "Đo lường", lessons: 5 },
  ];

  return (
    <div className="curriculum-container">
      {/* Step 1: Chọn môn học */}
      <div className="curriculum-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="step-badge">1</span>
            Chọn môn học
          </h2>
          <p className="section-desc">Chọn môn học bạn muốn tạo slide</p>
        </div>
        <div className="subject-grid">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`subject-card ${
                selectedSubject === subject.id ? "active" : ""
              }`}
              onClick={() => setSelectedSubject(subject.id)}
              style={
                { "--subject-color": subject.color } as React.CSSProperties
              }
            >
              <div className="subject-icon">{subject.icon}</div>
              <div className="subject-name">{subject.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Chọn khối lớp */}
      {selectedSubject && (
        <div className="curriculum-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="step-badge">2</span>
              Chọn khối lớp
            </h2>
            <p className="section-desc">Chọn cấp độ phù hợp với học sinh</p>
          </div>
          <div className="grade-grid">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className={`grade-card ${
                  selectedGrade === grade.id ? "active" : ""
                }`}
                onClick={() => setSelectedGrade(grade.id)}
              >
                <div className="grade-level">{grade.level}</div>
                <div className="grade-name">{grade.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Chọn chủ đề */}
      {selectedSubject && selectedGrade && (
        <div className="curriculum-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="step-badge">3</span>
              Chọn chủ đề
            </h2>
            <p className="section-desc">
              Chọn chủ đề cụ thể trong chương trình
            </p>
          </div>
          <div className="topic-list">
            {topics.map((topic) => (
              <div key={topic.id} className="topic-card">
                <div className="topic-info">
                  <div className="topic-icon">📖</div>
                  <div>
                    <div className="topic-name">{topic.name}</div>
                    <div className="topic-meta">{topic.lessons} bài học</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm">Tạo slide →</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
