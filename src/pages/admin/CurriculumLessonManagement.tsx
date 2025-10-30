import React, { useEffect, useState, useCallback } from "react";
import "../../css/Dashboard.css";
import "../../css/Modal.css";
import { getToken } from "utils/utils";
import axios from "axios";

// --- Interfaces ---
interface CurriculumLesson {
  id: number;
  chapterId: number;
  chapterTitle: string;
  title: string;
  description: string;
  orderIndex: number;
}

interface Chapter {
  id: number;
  title: string;
}

interface ApiResponse<T> {
  content: T[];
  pagination: any;
}

type ModalMode = 'create' | 'edit';

// --- Lesson Modal Component ---
interface LessonModalProps {
  mode: ModalMode;
  lesson: CurriculumLesson | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, id?: number) => void;
  chapters: Chapter[];
}

const LessonModal: React.FC<LessonModalProps> = ({ mode, lesson, isOpen, onClose, onSave, chapters }) => {
  const [formData, setFormData] = useState({
    chapterId: 0,
    title: "",
    description: "",
    orderIndex: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && lesson) {
        setFormData({
          chapterId: lesson.chapterId,
          title: lesson.title,
          description: lesson.description,
          orderIndex: lesson.orderIndex,
        });
      } else {
        setFormData({
          chapterId: 0,
          title: "",
          description: "",
          orderIndex: 0,
        });
      }
    }
  }, [mode, lesson, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'title' || name === 'description' ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, lesson?.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'edit' ? 'Edit Curriculum Lesson' : 'Create New Curriculum Lesson'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="chapterId">Chapter</label>
            <select id="chapterId" name="chapterId" value={formData.chapterId} onChange={handleChange} required>
              <option value="">-- Select a Chapter --</option>
              {chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
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

// --- Main Curriculum Lesson Management Component ---
export default function CurriculumLessonManagement() {
  const [curriculumLessons, setCurriculumLessons] = useState<CurriculumLesson[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedLesson, setSelectedLesson] = useState<CurriculumLesson | null>(null);
  const [filterChapterId, setFilterChapterId] = useState("");
  const [activeFilterChapterId, setActiveFilterChapterId] = useState<string>("");
  const token = getToken();

  const fetchData = useCallback(async <T,>(endpoint: string, setter: (data: T[]) => void) => {
    if (!token) return;
    try {
      const res = await axios.get<ApiResponse<T>>(`http://localhost:8080/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
      setter(res.data.content || []);
    } catch (err) {
      console.error(`Error fetching from ${endpoint}:`, err);
    }
  }, [token]);

  const fetchCurriculumLessons = useCallback(async () => {
    if (!token) return;
    let url = `http://localhost:8080/content-service/curriculum-lessons`;
    const params = new URLSearchParams();
    if (activeFilterChapterId) params.append("chapterId", activeFilterChapterId);
    if (params.toString()) url += `?${params.toString()}`;

    try {
      const res = await axios.get<ApiResponse<CurriculumLesson>>(url, { headers: { Authorization: `Bearer ${token}` } });
      setCurriculumLessons(res.data.content || []);
    } catch (err) {
      console.error(`Error fetching curriculum lessons:`, err);
      setCurriculumLessons([]);
    }
  }, [token, activeFilterChapterId]);

  useEffect(() => {
    fetchData<Chapter>("content-service/chapters", setChapters);
  }, [fetchData]);

  useEffect(() => {
    fetchCurriculumLessons();
  }, [fetchCurriculumLessons]);

  const handleApplyFilter = () => {
    setActiveFilterChapterId(filterChapterId);
  };

  const handleClearFilter = () => {
    setFilterChapterId("");
    setActiveFilterChapterId("");
  };

  const handleOpenModal = (mode: ModalMode, lesson: CurriculumLesson | null = null) => {
    setModalMode(mode);
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const handleSaveLesson = async (data: any, id?: number) => {
    if (!token) return;
    const url = `http://localhost:8080/content-service/curriculum-lessons${id ? `/${id}` : ''}`;
    const method = id ? 'put' : 'post';
    try {
      await axios[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
      handleCloseModal();
      fetchCurriculumLessons();
    } catch (err) {
      console.error(`Error saving curriculum lesson:`, err);
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this curriculum lesson?")) return;
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/content-service/curriculum-lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCurriculumLessons();
    } catch (err) {
      console.error("Error deleting curriculum lesson:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Curriculum Lesson Management</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal('create')}>+ Add Lesson</button>
        </div>
        
        <div className="filter-bar" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filterChapterId} 
            onChange={(e) => setFilterChapterId(e.target.value)} 
            style={{ padding: '0.5rem' }}
          >
            <option value="">-- Select a Chapter to Filter --</option>
            {chapters.map(chapter => (
              <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleApplyFilter}>Filter</button>
          <button className="btn btn-ghost" onClick={handleClearFilter}>Clear</button>
        </div>

        <div className="card-body">
          <table style={{ width: "100%"}}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>ID</th>
                <th>Chapter</th>
                <th>Title</th>
                <th>Description</th>
                <th>Order Index</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {curriculumLessons.length > 0 ? (
                curriculumLessons.map((lesson) => (
                  <tr key={lesson.id} style={{ textAlign: "center" }}>
                    <td>{lesson.id}</td>
                    <td>{lesson.chapterTitle} (ID: {lesson.chapterId})</td>
                    <td>{lesson.title}</td>
                    <td>{lesson.description}</td>
                    <td>{lesson.orderIndex}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal('edit', lesson)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteLesson(lesson.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No curriculum lesson data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LessonModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLesson}
        lesson={selectedLesson}
        chapters={chapters}
      />
    </div>
  );
}
