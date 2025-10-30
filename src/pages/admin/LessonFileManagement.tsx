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

interface LessonFile {
  id: number;
  lessonId: number;
  lessonTitle: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  uploaderId: number;
  uploaderName: string;
  createdAt: string;
}

interface ApiResponse<T> {
  content: T[];
  pagination: any;
}

type ModalMode = 'create';

// --- File Upload Modal Component ---
interface FileModalProps {
  mode: ModalMode;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const FileModal: React.FC<FileModalProps> = ({ mode, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    lessonId: 0,
    fileName: "",
    fileUrl: "",
    mimeType: "",
    sizeBytes: 0,
    uploaderId: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        lessonId: 0,
        fileName: "",
        fileUrl: "",
        mimeType: "",
        sizeBytes: 0,
        uploaderId: 0,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fileName' || name === 'fileUrl' || name === 'mimeType' ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload New File</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="lessonId">Lesson ID</label>
            <input type="number" id="lessonId" name="lessonId" value={formData.lessonId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="fileName">File Name</label>
            <input type="text" id="fileName" name="fileName" value={formData.fileName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="fileUrl">File URL</label>
            <input type="text" id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="mimeType">MIME Type</label>
            <input type="text" id="mimeType" name="mimeType" value={formData.mimeType} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="sizeBytes">Size (Bytes)</label>
            <input type="number" id="sizeBytes" name="sizeBytes" value={formData.sizeBytes} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="uploaderId">Uploader ID</label>
            <input type="number" id="uploaderId" name="uploaderId" value={formData.uploaderId} onChange={handleChange} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main File Management Component ---
export default function LessonFileManagement() {
  const [files, setFiles] = useState<LessonFile[]>([]);
  const [teacherLessons, setTeacherLessons] = useState<TeacherLesson[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
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

  const fetchFiles = useCallback(async (lessonId: string) => {
    if (!token) return;
    let url = `http://localhost:8080/content-service/lesson-files`;
    if (lessonId) {
      url += `?lessonId=${lessonId}`;
    }
    console.log(url)
    try {
      const res = await axios.get<ApiResponse<LessonFile>>(url, { headers: { Authorization: `Bearer ${token}` } });
      console.log(JSON.stringify(res))
      setFiles(res.data.content || []);
    } catch (err) {
      console.error(`Error fetching files:`, err);
      setFiles([]);
    }
  }, [token]);

  useEffect(() => {
    fetchData<TeacherLesson>("content-service/teacher-lessons", setTeacherLessons);
  }, [fetchData]);

  useEffect(() => {
    fetchFiles(activeFilterId);
  }, [fetchFiles, activeFilterId]);

  const handleApplyFilter = () => {
    setActiveFilterId(filterId);
  };

  const handleClearFilter = () => {
    setFilterId("");
    setActiveFilterId("");
  };

  const handleOpenModal = (mode: ModalMode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveFile = async (data: any) => {
    if (!token) return;
    const url = `http://localhost:8080/content-service/lesson-files`;
    try {
      await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
      handleCloseModal();
      fetchFiles(activeFilterId);
    } catch (err) {
      console.error(`Error uploading file:`, err);
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/content-service/lesson-files/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchFiles(activeFilterId);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lesson File Management</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal('create')}>+ Upload File</button>
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
                <th>File Name</th>
                <th>MIME Type</th>
                <th>Size (Bytes)</th>
                <th>Uploader</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((file) => (
                  <tr key={file.id} style={{ textAlign: "center" }}>
                    <td>{file.lessonTitle} (ID: {file.lessonId})</td>
                    <td><a href={file.fileUrl} target="_blank" rel="noopener noreferrer">{file.fileName}</a></td>
                    <td>{file.mimeType}</td>
                    <td>{file.sizeBytes}</td>
                    <td>{file.uploaderName} (ID: {file.uploaderId})</td>
                    <td>{new Date(file.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFile(file.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No file data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FileModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFile}
      />
    </div>
  );
}
