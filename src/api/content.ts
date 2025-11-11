const CONTENT_API_BASE =
  (process.env.REACT_APP_CONTENT_API_BASE &&
    process.env.REACT_APP_CONTENT_API_BASE.trim().replace(/\/$/, "")) ||
  "http://localhost:8080/content-service";

// ==================== Teacher Lesson Types ====================

export interface TeacherLessonResponse {
  id: number;
  teacherId: number;
  curriculumLessonId?: number;
  title: string;
  lessonStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  classId?: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  lessonFiles?: LessonFileResponse[];
}

export interface SelfTeacherLessonRequest {
  curriculumLessonId?: number;
  title: string;
  lessonStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  classId?: number;
}

export interface LessonFileResponse {
  id: number;
  lessonId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface LessonFileRequest {
  lessonId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

// ==================== Comment Types ====================

export interface LessonCommentResponse {
  id: number;
  lessonId: number;
  lessonTitle?: string;
  studentId: number;
  studentName?: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelfLessonCommentRequest {
  lessonId: number;
  comment: string;
}

// ==================== Rating Types ====================

export interface LessonRatingResponse {
  id: number;
  lessonId: number;
  lessonTitle?: string;
  studentId: number;
  studentName?: string;
  rating: number;
  createdAt: string;
}

export interface SelfLessonRatingRequest {
  lessonId: number;
  rating: number;
}

// ==================== Pagination ====================

export interface PaginatedResponse<T> {
  content: T[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  code: number;
  result: T;
}

// ==================== Teacher Lesson APIs ====================

export async function createSelfLesson(
  token: string,
  request: SelfTeacherLessonRequest
): Promise<TeacherLessonResponse> {
  const url = `${CONTENT_API_BASE}/teacher-lessons/me`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<TeacherLessonResponse> = await resp.json();
  return data.result;
}

export async function getMyLessons(
  token: string,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<TeacherLessonResponse>> {
  const url = `${CONTENT_API_BASE}/teacher-lessons/me?page=${page}&size=${size}&sort=createdAt,desc`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  return await resp.json();
}

export async function getLessonById(
  token: string,
  id: number
): Promise<TeacherLessonResponse> {
  const url = `${CONTENT_API_BASE}/teacher-lessons/${id}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<TeacherLessonResponse> = await resp.json();
  return data.result;
}

export async function getLessonsByClass(
  token: string,
  classId: number,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<TeacherLessonResponse>> {
  const url = `${CONTENT_API_BASE}/teacher-lessons/class/${classId}?page=${page}&size=${size}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  return await resp.json();
}

export async function updateLesson(
  token: string,
  id: number,
  request: Partial<SelfTeacherLessonRequest>
): Promise<TeacherLessonResponse> {
  const url = `${CONTENT_API_BASE}/teacher-lessons/${id}`;
  const resp = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<TeacherLessonResponse> = await resp.json();
  return data.result;
}

export async function deleteLesson(token: string, id: number): Promise<void> {
  const url = `${CONTENT_API_BASE}/teacher-lessons/${id}`;
  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
}

export async function incrementLessonView(
  token: string,
  id: number
): Promise<void> {
  const url = `${CONTENT_API_BASE}/teacher-lessons/${id}/view`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    console.warn("Failed to increment view count");
  }
}

// ==================== Lesson File APIs ====================

export async function createLessonFile(
  token: string,
  request: LessonFileRequest
): Promise<LessonFileResponse> {
  const url = `${CONTENT_API_BASE}/lesson-files`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<LessonFileResponse> = await resp.json();
  return data.result;
}

export async function getLessonFiles(
  token: string,
  lessonId: number
): Promise<LessonFileResponse[]> {
  const url = `${CONTENT_API_BASE}/lesson-files?lessonId=${lessonId}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<LessonFileResponse[]> = await resp.json();
  return data.result;
}

// ==================== Comment APIs ====================

export async function createSelfComment(
  token: string,
  request: SelfLessonCommentRequest
): Promise<LessonCommentResponse> {
  const url = `${CONTENT_API_BASE}/lesson-comments/me`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<LessonCommentResponse> = await resp.json();
  return data.result;
}

export async function getCommentsByLesson(
  token: string,
  lessonId: number,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<LessonCommentResponse>> {
  const url = `${CONTENT_API_BASE}/lesson-comments?lessonId=${lessonId}&page=${page}&size=${size}&sort=createdAt,desc`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  return await resp.json();
}

export async function updateComment(
  token: string,
  id: number,
  lessonId: number,
  studentId: number,
  comment: string
): Promise<LessonCommentResponse> {
  const url = `${CONTENT_API_BASE}/lesson-comments/${id}`;
  const resp = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      lessonId,
      studentId,
      comment 
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<LessonCommentResponse> = await resp.json();
  return data.result;
}

export async function deleteComment(token: string, id: number): Promise<void> {
  const url = `${CONTENT_API_BASE}/lesson-comments/${id}`;
  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
}

// ==================== Rating APIs ====================

export async function createSelfRating(
  token: string,
  request: SelfLessonRatingRequest
): Promise<LessonRatingResponse> {
  const url = `${CONTENT_API_BASE}/lesson-ratings/me`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<LessonRatingResponse> = await resp.json();
  return data.result;
}

export async function getRatingsByLesson(
  token: string,
  lessonId: number,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<LessonRatingResponse>> {
  const url = `${CONTENT_API_BASE}/lesson-ratings?lessonId=${lessonId}&page=${page}&size=${size}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  return await resp.json();
}

export async function updateRating(
  token: string,
  id: number,
  lessonId: number,
  studentId: number,
  rating: number
): Promise<LessonRatingResponse> {
  const url = `${CONTENT_API_BASE}/lesson-ratings/${id}`;
  const resp = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      lessonId,
      studentId,
      rating 
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<LessonRatingResponse> = await resp.json();
  return data.result;
}

export async function deleteRating(token: string, id: number): Promise<void> {
  const url = `${CONTENT_API_BASE}/lesson-ratings/${id}`;
  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
}
