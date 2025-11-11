import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getLessonsByClass, TeacherLessonResponse } from "../../api/content";
import "../../css/ClassLessons.css";

const ClassLessons: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const className = location.state?.className || "Class";
  const [lessons, setLessons] = useState<TeacherLessonResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const token = localStorage.getItem("token") || "";
  const pageSize = 12;

  useEffect(() => {
    if (classId) {
      loadLessons(currentPage);
    }
  }, [classId, currentPage]);

  const loadLessons = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLessonsByClass(token, parseInt(classId!), page, pageSize);
      setLessons(response.content);
      setTotalPages(response.pagination.totalPages);
      setTotalElements(response.pagination.totalElements);
    } catch (err: any) {
      setError(err.message || "Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const viewLesson = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };

  const goBack = () => {
    navigate("/user/classes");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="class-lessons-container">
      <div className="class-lessons-header">
        <button className="btn-back" onClick={goBack}>
          ← Back to My Classes
        </button>
        <h1>{className}</h1>
        <p>{totalElements} lesson{totalElements !== 1 ? 's' : ''} available</p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading lessons...</div>
      ) : lessons.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h2>No Lessons Yet</h2>
          <p>Your teacher hasn't added any lessons to this class yet.</p>
          <p>Check back later for updates!</p>
        </div>
      ) : (
        <>
          <div className="lessons-grid">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-card">
                <div className="lesson-card-header">
                  <h3>{lesson.title}</h3>
                  <span className={`lesson-status status-${lesson.lessonStatus.toLowerCase()}`}>
                    {lesson.lessonStatus}
                  </span>
                </div>
                <div className="lesson-card-body">
                  <div className="lesson-meta">
                    {lesson.curriculumLessonId && (
                      <p className="lesson-info">
                        📖 Curriculum Lesson #{lesson.curriculumLessonId}
                      </p>
                    )}
                    {lesson.viewCount !== undefined && (
                      <p className="lesson-info">
                        👁️ {lesson.viewCount} views
                      </p>
                    )}
                    {lesson.lessonFiles && lesson.lessonFiles.length > 0 && (
                      <p className="lesson-info">
                        📎 {lesson.lessonFiles.length} file{lesson.lessonFiles.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <p className="lesson-date">
                    Updated: {new Date(lesson.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="lesson-card-footer">
                  <button
                    className="btn-view-lesson"
                    onClick={() => viewLesson(lesson.id)}
                  >
                    View Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="pagination-btn"
              >
                « Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="pagination-btn"
              >
                Next »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClassLessons;
