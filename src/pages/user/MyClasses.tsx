import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchMySchoolClasses,
  enrollInClass,
  getMyEnrollments,
  unenrollFromClass,
  ClassStudentResponse,
  ClassroomResponse,
  EnrollmentRequest,
} from "../../api/classroom";
import "../../css/MyClasses.css";

const MyClasses: React.FC = () => {
  const navigate = useNavigate();
  const [enrolledClasses, setEnrolledClasses] = useState<ClassStudentResponse[]>([]);
  const [searchResults, setSearchResults] = useState<ClassroomResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state for enrollment
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassroomResponse | null>(null);
  const [classPassword, setClassPassword] = useState("");

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    loadEnrolledClasses();
  }, []);

  const loadEnrolledClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const classes = await getMyEnrollments(token);
      setEnrolledClasses(classes);
    } catch (err: any) {
      setError(err.message || "Failed to load enrolled classes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a class name to search");
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const results = await searchMySchoolClasses(token, searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError("No classes found matching your search");
      }
    } catch (err: any) {
      setError(err.message || "Failed to search classes");
    } finally {
      setIsSearching(false);
    }
  };

  const openEnrollModal = (classRoom: ClassroomResponse) => {
    setSelectedClass(classRoom);
    setClassPassword("");
    setShowEnrollModal(true);
    setError(null);
  };

  const closeEnrollModal = () => {
    setShowEnrollModal(false);
    setSelectedClass(null);
    setClassPassword("");
  };

  const handleEnroll = async () => {
    if (!selectedClass) return;

    if (!classPassword.trim()) {
      setError("Please enter the class password");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const request: EnrollmentRequest = {
        classId: selectedClass.id,
        password: classPassword,
      };

      await enrollInClass(token, request);
      setSuccessMessage(`Successfully enrolled in ${selectedClass.name}!`);
      closeEnrollModal();
      
      // Refresh enrolled classes
      await loadEnrolledClasses();
      
      // Remove from search results
      setSearchResults(searchResults.filter(c => c.id !== selectedClass.id));

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to enroll in class");
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (classId: number, className: string) => {
    if (!window.confirm(`Are you sure you want to leave ${className}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await unenrollFromClass(token, classId);
      setSuccessMessage(`Successfully left ${className}`);
      await loadEnrolledClasses();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to leave class");
    } finally {
      setLoading(false);
    }
  };

  const viewClassLessons = (classId: number, className: string) => {
    navigate(`/user/classes/${classId}/lessons`, { state: { className } });
  };

  const isAlreadyEnrolled = (classId: number) => {
    return enrolledClasses.some(ec => ec.classId === classId);
  };

  return (
    <div className="my-classes-container">
      <div className="my-classes-header">
        <h1>My Classes</h1>
        <p>Join classes and access course materials</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span>✓ {successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Search Section */}
      <div className="search-section">
        <h2>🔍 Find Classes to Join</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search classes in your school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results ({searchResults.length})</h3>
            <div className="classes-grid">
              {searchResults.map((classRoom) => (
                <div key={classRoom.id} className="class-card search-result">
                  <div className="class-card-header">
                    <h3>{classRoom.name}</h3>
                    {classRoom.description && (
                      <p className="class-description">{classRoom.description}</p>
                    )}
                  </div>
                  <div className="class-card-body">
                    {classRoom.schoolName && (
                      <p className="class-info">🏫 {classRoom.schoolName}</p>
                    )}
                    {classRoom.grade && (
                      <p className="class-info">📚 Khối {classRoom.grade}</p>
                    )}
                    <p className="class-info">
                      👥 {classRoom.studentCount || 0}
                      {classRoom.capacity ? ` / ${classRoom.capacity}` : ""} học sinh
                    </p>
                  </div>
                  <div className="class-card-footer">
                    {isAlreadyEnrolled(classRoom.id) ? (
                      <span className="already-enrolled">✓ Already Enrolled</span>
                    ) : (
                      <button
                        className="btn-enroll"
                        onClick={() => openEnrollModal(classRoom)}
                        disabled={loading}
                      >
                        Join Class
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enrolled Classes Section */}
      <div className="enrolled-section">
        <h2>📚 My Enrolled Classes ({enrolledClasses.length})</h2>
        
        {loading && enrolledClasses.length === 0 ? (
          <div className="loading">Loading your classes...</div>
        ) : enrolledClasses.length === 0 ? (
          <div className="empty-state">
            <p>You haven't joined any classes yet.</p>
            <p>Use the search above to find and join classes in your school.</p>
          </div>
        ) : (
          <div className="classes-grid">
            {enrolledClasses.map((enrollment) => (
              <div key={enrollment.id} className="class-card enrolled">
                <div className="class-card-header">
                  <h3>{enrollment.className}</h3>
                </div>
                <div className="class-card-body">
                  <p className="class-info">📋 Class ID: {enrollment.classId}</p>
                </div>
                <div className="class-card-footer">
                  <button
                    className="btn-primary"
                    onClick={() => viewClassLessons(enrollment.classId, enrollment.className)}
                  >
                    View Lessons
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleUnenroll(enrollment.classId, enrollment.className)}
                    disabled={loading}
                  >
                    Leave Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && selectedClass && (
        <div className="modal-overlay" onClick={closeEnrollModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Join Class</h2>
              <button className="modal-close" onClick={closeEnrollModal}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-class-name">{selectedClass.name}</p>
              {selectedClass.description && (
                <p className="modal-description">{selectedClass.description}</p>
              )}
              
              <div className="form-group">
                <label htmlFor="classPassword">Class Password</label>
                <input
                  id="classPassword"
                  type="password"
                  placeholder="Enter class password"
                  value={classPassword}
                  onChange={(e) => setClassPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleEnroll()}
                  autoFocus
                />
                <p className="form-help">Ask your teacher for the class password</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeEnrollModal}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleEnroll}
                disabled={loading || !classPassword.trim()}
              >
                {loading ? "Enrolling..." : "Join Class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClasses;
