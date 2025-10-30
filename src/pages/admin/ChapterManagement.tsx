import React, { useEffect, useState, useCallback } from "react";
import "../../css/Dashboard.css";
import "../../css/Modal.css";
import { getToken } from "utils/utils";
import axios from "axios";

// --- Interfaces based on API ---
interface Subject {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  subjectId: number;
  subjectName: string;
  grade: string; // e.g., "GRADE_1"
  title: string;
  orderIndex: number;
  lessonCount: number;
}

interface ChapterApiResponse {
  content: Chapter[];
  pagination: any;
}

interface SubjectsApiResponse {
  content: Subject[];
}

type ModalMode = 'create' | 'edit';

const GRADES = Array.from({ length: 12 }, (_, i) => `GRADE_${i + 1}`);

// --- Chapter Modal Component ---
interface ChapterModalProps {
  mode: ModalMode;
  chapter: Chapter | null;
  subjects: Subject[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, id?: number) => void;
}

const ChapterModal: React.FC<ChapterModalProps> = ({ mode, chapter, subjects, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || 0,
    grade: GRADES[0],
    title: "",
    orderIndex: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && chapter) {
        setFormData({
          subjectId: chapter.subjectId,
          grade: chapter.grade,
          title: chapter.title,
          orderIndex: chapter.orderIndex,
        });
      } else {
        setFormData({
          subjectId: subjects[0]?.id || 0,
          grade: GRADES[0],
          title: "",
          orderIndex: 0,
        });
      }
    }
  }, [mode, chapter, subjects, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = name === 'subjectId' || name === 'orderIndex';
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, chapter?.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'edit' ? 'Edit Chapter' : 'Create New Chapter'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="subjectId">Subject</label>
            <select id="subjectId" name="subjectId" value={formData.subjectId} onChange={handleChange} required>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="grade">Grade</label>
            <select id="grade" name="grade" value={formData.grade} onChange={handleChange} required>
              {GRADES.map(g => <option key={g} value={g}>{g.replace("_", " ")}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="orderIndex">Order Index</label>
            <input type="number" id="orderIndex" name="orderIndex" value={formData.orderIndex} onChange={handleChange} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Chapter Management Component ---
export default function ChapterManagement() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const token = getToken();

  const fetchChapters = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get<ChapterApiResponse>("http://localhost:8080/content-service/chapters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChapters(res.data.content || []);
    } catch (err) {
      console.error("Error fetching chapters:", err);
    }
  }, [token]);

  const fetchSubjects = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get<SubjectsApiResponse>("http://localhost:8080/content-service/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data.content || []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchChapters();
    fetchSubjects();
  }, [fetchChapters, fetchSubjects]);

  const handleOpenModal = (mode: ModalMode, chapter: Chapter | null = null) => {
    setModalMode(mode);
    setSelectedChapter(chapter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChapter(null);
  };

  const handleSaveChapter = async (data: any, id?: number) => {
    if (!token) return;
    const url = id ? `http://localhost:8080/content-service/chapters/${id}` : "http://localhost:8080/content-service/chapters";
    const method = id ? 'put' : 'post';
    try {
      await axios[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
      handleCloseModal();
      fetchChapters();
    } catch (err) {
      console.error(`Error saving chapter:`, err);
    }
  };

  const handleDeleteChapter = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/content-service/chapters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      fetchChapters();
    } catch (err) {
      console.error("Error deleting chapter:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Chapter Management</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal('create')}>+ Add Chapter</button>
        </div>
        <div className="card-body">
          <table style={{ width: "100%", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Title</th>
                <th>Subject</th>
                <th>Grade</th>
                <th>Order</th>
                <th>Lessons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.length > 0 ? (
                chapters.sort((a, b) => a.orderIndex - b.orderIndex).sort((a,b) => a.subjectId - b.subjectId).map((chapter) => (
                  <tr key={chapter.id} style={{ textAlign: "center" }}>
                    <td>{chapter.title}</td>
                    <td>{chapter.subjectName}</td>
                    <td>{chapter.grade.replace("_", " ")}</td>
                    <td>{chapter.orderIndex}</td>
                    <td>{chapter.lessonCount}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal('edit', chapter)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteChapter(chapter.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No chapter data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ChapterModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChapter}
        chapter={selectedChapter}
        subjects={subjects}
      />
    </div>
  );
}
