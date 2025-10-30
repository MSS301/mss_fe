import React, { useEffect, useState, useCallback } from "react";
import "../../css/Dashboard.css";
import "../../css/Modal.css";
import { getToken } from "utils/utils";
import axios from "axios";

// --- Interfaces ---
interface TeacherLesson {
  id: number;
  teacherId: number;
  teacherName: string;
  curriculumLessonId: number;
  curriculumLessonTitle: string;
  title: string;
  lessonStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  classId: number;
  className: string;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  commentCount: number;
  fileCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

interface LessonAnalytics {
  lessonId: number;
  lessonTitle: string;
  totalViews: number;
  uniqueViewers: number;
  totalFeedbacks: number;
  averageRating: number;
  totalFiles: number;
  totalFileSize: number;
}

interface ApiResponse<T> {
  content: T[];
  pagination: any;
}

interface Class {
  id: number;
  name: string;
}

type ModalMode = 'create' | 'edit';

// --- Lesson Modal Component ---
interface LessonModalProps {
  mode: ModalMode;
  lesson: TeacherLesson | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, id?: number) => void;
}

const LessonModal: React.FC<LessonModalProps> = ({ mode, lesson, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    teacherId: 0,
    curriculumLessonId: 0,
    title: "",
    lessonStatus: "DRAFT",
    classId: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && lesson) {
        setFormData({
          teacherId: lesson.teacherId,
          curriculumLessonId: lesson.curriculumLessonId,
          title: lesson.title,
          lessonStatus: lesson.lessonStatus,
          classId: lesson.classId,
        });
      } else {
        setFormData({
          teacherId: 0,
          curriculumLessonId: 0,
          title: "",
          lessonStatus: "DRAFT",
          classId: 0,
        });
      }
    }
  }, [mode, lesson, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'title' || name === 'lessonStatus' ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, lesson?.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'edit' ? 'Edit Lesson' : 'Create New Lesson'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teacherId">Teacher ID</label>
            <input type="number" id="teacherId" name="teacherId" value={formData.teacherId} onChange={handleChange} required disabled={mode === 'edit'} />
          </div>
          <div className="form-group">
            <label htmlFor="curriculumLessonId">Curriculum Lesson ID</label>
            <input type="number" id="curriculumLessonId" name="curriculumLessonId" value={formData.curriculumLessonId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lessonStatus">Status</label>
            <select id="lessonStatus" name="lessonStatus" value={formData.lessonStatus} onChange={handleChange} required>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="classId">Class ID</label>
            <input type="number" id="classId" name="classId" value={formData.classId} onChange={handleChange} required />
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

// --- Analytics Modal Component ---
interface AnalyticsModalProps {
  analytics: LessonAnalytics | null;
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ analytics, isOpen, onClose }) => {
  if (!isOpen || !analytics) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Lesson Analytics: {analytics.lessonTitle}</h2>
        <p><strong>Total Views:</strong> {analytics.totalViews}</p>
        <p><strong>Unique Viewers:</strong> {analytics.uniqueViewers}</p>
        <p><strong>Total Feedbacks:</strong> {analytics.totalFeedbacks}</p>
        <p><strong>Average Rating:</strong> {analytics.averageRating}</p>
        <p><strong>Total Files:</strong> {analytics.totalFiles}</p>
        <p><strong>Total File Size:</strong> {analytics.totalFileSize} bytes</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Teacher Lesson Management Component ---
export default function TeacherLessonManagement() {
  const [teacherLessons, setTeacherLessons] = useState<TeacherLesson[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedLesson, setSelectedLesson] = useState<TeacherLesson | null>(null);
  const [filterTeacherId, setFilterTeacherId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClassId, setFilterClassId] = useState("");
  const [activeFilterTeacherId, setActiveFilterTeacherId] = useState<string>("");
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>("");
  const [activeFilterClassId, setActiveFilterClassId] = useState<string>("");
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [lessonAnalytics, setLessonAnalytics] = useState<LessonAnalytics | null>(null);
  const token = getToken();

  const fetchTeacherLessons = useCallback(async () => {
    if (!token) return;
    let url = `http://localhost:8080/content-service/teacher-lessons`;
    const params = new URLSearchParams();
    if (activeFilterTeacherId) params.append("teacherId", activeFilterTeacherId);
    if (activeFilterStatus) params.append("status", activeFilterStatus);
    if (activeFilterClassId) params.append("classId", activeFilterClassId);
    if (params.toString()) url += `?${params.toString()}`;

    try {
      const res = await axios.get<ApiResponse<TeacherLesson>>(url, { headers: { Authorization: `Bearer ${token}` } });
      setTeacherLessons(res.data.content || []);
    } catch (err) {
      console.error(`Error fetching teacher lessons:`, err);
      setTeacherLessons([]);
    }
  }, [token, activeFilterTeacherId, activeFilterStatus, activeFilterClassId]);

  const fetchLessonAnalytics = useCallback(async (lessonId: number) => {
    if (!token) return;
    try {
      const res = await axios.get<{ code: number; message: string; result: LessonAnalytics }>(`http://localhost:8080/content-service/teacher-lessons/${lessonId}/analytics`, { headers: { Authorization: `Bearer ${token}` } });
      setLessonAnalytics(res.data.result);
      setAnalyticsModalOpen(true);
    } catch (err) {
      console.error(`Error fetching lesson analytics:`, err);
      setLessonAnalytics(null);
    }
  }, [token]);

  useEffect(() => {
    fetchTeacherLessons();
  }, [fetchTeacherLessons]);

  const handleApplyFilter = () => {
    setActiveFilterTeacherId(filterTeacherId);
    setActiveFilterStatus(filterStatus);
    setActiveFilterClassId(filterClassId);
  };

  const handleClearFilter = () => {
    setFilterTeacherId("");
    setFilterStatus("");
    setFilterClassId("");
    setActiveFilterTeacherId("");
    setActiveFilterStatus("");
    setActiveFilterClassId("");
  };

  const handleOpenModal = (mode: ModalMode, lesson: TeacherLesson | null = null) => {
    setModalMode(mode);
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const handleCloseAnalyticsModal = () => {
    setAnalyticsModalOpen(false);
    setLessonAnalytics(null);
  };

  const handleSaveLesson = async (data: any, id?: number) => {
    if (!token) return;
    const url = `http://localhost:8080/content-service/teacher-lessons${id ? `/${id}` : ''}`;
    const method = id ? 'put' : 'post';
    try {
      await axios[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
      handleCloseModal();
      fetchTeacherLessons();
    } catch (err) {
      console.error(`Error saving lesson:`, err);
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/content-service/teacher-lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTeacherLessons();
    } catch (err) {
      console.error("Error deleting lesson:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Teacher Lesson Management</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal('create')}>+ Add Lesson</button>
        </div>
        
        <div className="filter-bar" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="number" 
            placeholder="Filter by Teacher ID" 
            value={filterTeacherId} 
            onChange={(e) => setFilterTeacherId(e.target.value)} 
            style={{ padding: '0.5rem' }}
          />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            style={{ padding: '0.5rem' }}
          >
            <option value="">-- Filter by Status --</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
          <input 
            type="number" 
            placeholder="Filter by Class ID" 
            value={filterClassId} 
            onChange={(e) => setFilterClassId(e.target.value)} 
            style={{ padding: '0.5rem' }}
          />
          <button className="btn btn-primary" onClick={handleApplyFilter}>Filter</button>
          <button className="btn btn-ghost" onClick={handleClearFilter}>Clear</button>
        </div>

        <div className="card-body">
          <table style={{ width: "100%"}}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>ID</th>
                <th>Title</th>
                <th>Teacher</th>
                <th>Curriculum Lesson</th>
                <th>Status</th>
                <th>Class</th>
                <th>Views</th>
                <th>Avg Rating</th>
                <th>Comments</th>
                <th>Files</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teacherLessons.length > 0 ? (
                teacherLessons.map((lesson) => (
                  <tr key={lesson.id} style={{ textAlign: "center" }}>
                    <td>{lesson.id}</td>
                    <td>{lesson.title}</td>
                    <td>{lesson.teacherName} (ID: {lesson.teacherId})</td>
                    <td>{lesson.curriculumLessonTitle} (ID: {lesson.curriculumLessonId})</td>
                    <td>{lesson.lessonStatus}</td>
                    <td>{lesson.className} (ID: {lesson.classId})</td>
                    <td>{lesson.viewCount}</td>
                    <td>{lesson.averageRating} ({lesson.ratingCount} ratings)</td>
                    <td>{lesson.commentCount}</td>
                    <td>{lesson.fileCount}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal('edit', lesson)}>Edit</button>
                      <button className="btn btn-info btn-sm" onClick={() => fetchLessonAnalytics(lesson.id)}>Analytics</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteLesson(lesson.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center" }}>
                    No teacher lesson data available.
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
      />

      <AnalyticsModal
        analytics={lessonAnalytics}
        isOpen={analyticsModalOpen}
        onClose={handleCloseAnalyticsModal}
      />
    </div>
  );
}
