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

interface LessonComment {
  id: number;
  lessonId: number;
  lessonTitle: string;
  studentId: number;
  studentName: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  content: T[];
  pagination: any;
}

type ModalMode = 'create' | 'edit';

// --- Comment Modal Component ---
interface CommentModalProps {
  mode: ModalMode;
  comment: LessonComment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, id?: number) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ mode, comment, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ lessonId: 0, studentId: 0, comment: "" });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && comment) {
        setFormData({ lessonId: comment.lessonId, studentId: comment.studentId, comment: comment.comment });
      } else {
        setFormData({ lessonId: 0, studentId: 0, comment: "" });
      }
    }
  }, [mode, comment, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'comment' ? value : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, comment?.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'edit' ? 'Edit Comment' : 'Create New Comment'}</h2>
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
            <label htmlFor="comment">Comment</label>
            <textarea id="comment" name="comment" value={formData.comment} onChange={handleChange} rows={4} required />
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

// --- Main Comment Management Component ---
export default function LessonCommentManagement() {
  const [comments, setComments] = useState<LessonComment[]>([]);
  const [teacherLessons, setTeacherLessons] = useState<TeacherLesson[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedComment, setSelectedComment] = useState<LessonComment | null>(null);
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

  const fetchComments = useCallback(async (lessonId: string) => {
    if (!token) return;
    let url = `http://localhost:8080/content-service/lesson-comments`;
    if (lessonId) {
      url += `?lessonId=${lessonId}`;
    }
    try {
      const res = await axios.get<ApiResponse<LessonComment>>(url, { headers: { Authorization: `Bearer ${token}` } });
      console.log(res.data.content)
      setComments(res.data.content || []);
    } catch (err) {
      console.error(`Error fetching comments:`, err);
      setComments([]);
    }
  }, [token]);

  useEffect(() => {
    fetchData<TeacherLesson>("content-service/teacher-lessons", setTeacherLessons);
  }, [fetchData]);

  useEffect(() => {
    fetchComments(activeFilterId);
  }, [fetchComments, activeFilterId]);

  const handleApplyFilter = () => {
    setActiveFilterId(filterId);
  };

  const handleClearFilter = () => {
    setFilterId("");
    setActiveFilterId("");
  };

  const handleOpenModal = (mode: ModalMode, comment: LessonComment | null = null) => {
    setModalMode(mode);
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComment(null);
  };

  const handleSaveComment = async (data: any, id?: number) => {
    if (!token) return;
    const url = `http://localhost:8080/content-service/lesson-comments${id ? `/${id}` : ''}`;
    const method = id ? 'put' : 'post';
    try {
      await axios[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
      handleCloseModal();
      fetchComments(activeFilterId);
    } catch (err) {
      console.error(`Error saving comment:`, err);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/content-service/lesson-comments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchComments(activeFilterId);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lesson Comment Management</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal('create')}>+ Add Comment</button>
        </div>
        
        {/* Filter Bar */}
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
          <table style={{ width: "100%", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Lesson</th>
                <th>Student</th>
                <th style={{ width: '40%' }}>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <tr key={comment.id} style={{ textAlign: "center" }}>
                    <td>{comment.lessonTitle} (ID: {comment.lessonId})</td>
                    <td>{comment.studentName} (ID: {comment.studentId})</td>
                    <td>{comment.comment}</td>
                    <td>{new Date(comment.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal('edit', comment)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No comment data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CommentModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveComment}
        comment={selectedComment}
      />
    </div>
  );
}
