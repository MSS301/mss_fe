import React, { useEffect, useState, useCallback } from "react";
import "../../css/Dashboard.css";
import "../../css/Modal.css";
import { getToken } from "utils/utils";
import axios from "axios";

// --- Interfaces ---
interface Subject {
  id: number;
  name: string;
  description: string;
  chapterCount: number;
}

interface ApiResponse {
  code: number;
  content: Subject[];
  pagination: any;
}

type ModalMode = 'create' | 'edit';

// --- Subject Modal Component ---
interface SubjectModalProps {
  mode: ModalMode;
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }, id?: number) => void;
}

const SubjectModal: React.FC<SubjectModalProps> = ({ mode, subject, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (mode === 'edit' && subject) {
      setFormData({ name: subject.name, description: subject.description });
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [mode, subject, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, subject?.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'edit' ? 'Edit Subject' : 'Create New Subject'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Subject Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
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


// --- Main Subject Management Component ---
export default function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const token = getToken();

  const fetchSubjects = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get<ApiResponse>(
        "http://localhost:8080/content-service/subjects",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjects(res.data.content || []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleOpenModal = (mode: ModalMode, subject: Subject | null = null) => {
    setModalMode(mode);
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubject(null);
  };

  const handleSaveSubject = async (data: { name: string; description: string }, id?: number) => {
    if (!token) return;
    const url = id 
      ? `http://localhost:8080/content-service/subjects/${id}` 
      : "http://localhost:8080/content-service/subjects";
    const method = id ? 'put' : 'post';

    try {
      await axios[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
      handleCloseModal();
      fetchSubjects(); // Refresh data
    } catch (err) {
      console.error(`Error ${id ? 'updating' : 'creating'} subject:`, err);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/content-service/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubjects(); // Refresh data after delete
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý môn học</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal('create')}>+ Thêm môn học</button>
        </div>
        <div className="card-body">
          <table style={{ width: "100%", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th style={{ textAlign: "center" }}>Mã môn</th>
                <th style={{ textAlign: "center" }}>Tên môn học</th>
                <th style={{ textAlign: "center" }}>Mô tả</th>
                <th style={{ textAlign: "center" }}>Trạng thái</th>
                <th style={{ textAlign: "center" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length > 0 ? (
                subjects.sort((a, b) => a.id - b.id).map((subject) => (
                  <tr key={subject.id} style={{ textAlign: "center" }}>
                    <td>#{subject.id}</td>
                    <td>{subject.name}</td>
                    <td>{subject.description}</td>
                    <td><span className="badge badge-success">Active</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal('edit', subject)}>Sửa</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSubject(subject.id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Không có dữ liệu môn học.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SubjectModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSubject}
        subject={selectedSubject}
      />
    </div>
  );
}
