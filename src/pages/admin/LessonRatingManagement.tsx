import React, { useEffect, useState, useCallback } from "react";
import "../../css/Dashboard.css";
import "../../css/Modal.css";
import { getToken } from "utils/utils";
import axios from "axios";

// --- Interfaces ---
interface TeacherLesson {
  id: number;
  title: string;
}

interface LessonRating {
  id: number;
  lessonId: number;
  lessonTitle: string;
  studentId: number;
  studentName: string;
  rating: number;
  createdAt: string;
}

interface ApiResponse<T> {
  content: T[];
  pagination: any;
}

type ModalMode = 'create' | 'edit';

// --- Rating Modal Component ---
interface RatingModalProps {
  mode: ModalMode;
  rating: LessonRating | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, id?: number) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ mode, rating, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ lessonId: 0, studentId: 0, rating: 5 });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && rating) {
        setFormData({ lessonId: rating.lessonId, studentId: rating.studentId, rating: rating.rating });
      } else {
        setFormData({ lessonId: 0, studentId: 0, rating: 5 });
      }
    }
  }, [mode, rating, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, rating?.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'edit' ? 'Edit Rating' : 'Create New Rating'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="lessonId">Lesson ID</label>
            <input type="number" id="lessonId" name="lessonId" value={formData.lessonId} onChange={handleChange} required disabled={mode === 'edit'} />
          </div>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input type="number" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required disabled={mode === 'edit'} />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating (1-5)</label>
            <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} min="1" max="5" required />
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

// --- Main Rating Management Component ---
export default function LessonRatingManagement() {
  const [ratings, setRatings] = useState<LessonRating[]>([]);
  const [teacherLessons, setTeacherLessons] = useState<TeacherLesson[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedRating, setSelectedRating] = useState<LessonRating | null>(null);
  const [filterId, setFilterId] = useState("");
  const [activeFilterId, setActiveFilterId] = useState<string>("");
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

  const fetchRatings = useCallback(async (lessonId: string) => {
    if (!token) return;
    let url = `http://localhost:8080/content-service/lesson-ratings`;
    if (lessonId) {
      url += `?lessonId=${lessonId}`;
    }
    try {
      const res = await axios.get<ApiResponse<LessonRating>>(url, { headers: { Authorization: `Bearer ${token}` } });
      setRatings(res.data.content || []);
    } catch (err) {
      console.error(`Error fetching ratings:`, err);
      setRatings([]);
    }
  }, [token]);

  useEffect(() => {
    fetchData<TeacherLesson>("content-service/teacher-lessons", setTeacherLessons);
  }, [fetchData]);

  useEffect(() => {
    fetchRatings(activeFilterId);
  }, [fetchRatings, activeFilterId]);

  const handleApplyFilter = () => {
    setActiveFilterId(filterId);
  };

  const handleClearFilter = () => {
    setFilterId("");
    setActiveFilterId("");
  };

  const handleOpenModal = (mode: ModalMode, rating: LessonRating | null = null) => {
    setModalMode(mode);
    setSelectedRating(rating);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRating(null);
  };

  const handleSaveRating = async (data: any, id?: number) => {
    if (!token) return;
    const url = `http://localhost:8080/content-service/lesson-ratings${id ? `/${id}` : ''}`;
    const method = id ? 'put' : 'post';
    try {
      await axios[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
      handleCloseModal();
      fetchRatings(activeFilterId);
    } catch (err) {
      console.error(`Error saving rating:`, err);
    }
  };

  const handleDeleteRating = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/content-service/lesson-ratings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchRatings(activeFilterId);
    } catch (err) {
      console.error("Error deleting rating:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lesson Rating Management</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal('create')}>+ Add Rating</button>
        </div>
        
        <div className="filter-bar" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filterId} 
            onChange={(e) => setFilterId(e.target.value)} 
            style={{ padding: '0.5rem' }}
          >
            <option value="">-- Select a Lesson to Filter --</option>
            {teacherLessons.map(lesson => (
              <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleApplyFilter}>Filter</button>
          <button className="btn btn-ghost" onClick={handleClearFilter}>Clear</button>
        </div>

        <div className="card-body">
          <table style={{ width: "100%"}}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Lesson</th>
                <th>Student</th>
                <th>Rating</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length > 0 ? (
                ratings.map((rating) => (
                  <tr key={rating.id} style={{ textAlign: "center" }}>
                    <td>{rating.lessonTitle} (ID: {rating.lessonId})</td>
                    <td>{rating.studentName} (ID: {rating.studentId})</td>
                    <td>{rating.rating}</td>
                    <td>{new Date(rating.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal('edit', rating)}>Edit</button>                      
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRating(rating.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No rating data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RatingModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRating}
        rating={selectedRating}
      />
    </div>
  );
}
