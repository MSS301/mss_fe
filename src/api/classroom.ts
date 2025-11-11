const API_BASE =
  (process.env.REACT_APP_API_BASE &&
    process.env.REACT_APP_API_BASE.trim().replace(/\/$/, "")) ||
  "http://localhost:8080";

// ==================== Classroom Types ====================

export interface ClassroomResponse {
  id: number;
  name: string;
  description?: string;
  teacherId: number;
  teacherName?: string;
  schoolId?: number;
  schoolName?: string;
  grade?: number;
  capacity?: number;
  studentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassroomRequest {
  name: string;
  schoolId: number;
  grade?: number;
  password?: string;
}

export interface UpdateClassroomRequest {
  name?: string;
  description?: string;
  capacity?: number;
}

export interface EnrollmentRequest {
  classId: number;
  password: string;
}

export interface ClassStudentResponse {
  id: number;
  classId: number;
  className: string;
  studentId: number;
  studentName: string;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// ==================== Classroom APIs ====================

export async function getMyClassrooms(
  token: string,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<ClassroomResponse>> {
  const url = `${API_BASE}/auth-service/classes/me?page=${page}&size=${size}&sort=id,desc`;
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

export async function createClassroom(
  token: string,
  request: CreateClassroomRequest
): Promise<ClassroomResponse> {
  const url = `${API_BASE}/auth-service/classes/me`;
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

  const data: ApiResponse<ClassroomResponse> = await resp.json();
  return data.result;
}

export async function getClassroomById(
  token: string,
  id: number
): Promise<ClassroomResponse> {
  const url = `${API_BASE}/auth-service/classes/${id}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<ClassroomResponse> = await resp.json();
  return data.result;
}

export async function updateClassroom(
  token: string,
  id: number,
  request: UpdateClassroomRequest
): Promise<ClassroomResponse> {
  const url = `${API_BASE}/auth-service/classes/${id}`;
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

  const data: ApiResponse<ClassroomResponse> = await resp.json();
  return data.result;
}

export async function deleteClassroom(token: string, id: number): Promise<void> {
  const url = `${API_BASE}/auth-service/classes/${id}`;
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

// ==================== Class Enrollment APIs ====================

/**
 * Search classes in the user's school by name
 */
export async function searchMySchoolClasses(
  token: string,
  name: string
): Promise<ClassroomResponse[]> {
  const url = `${API_BASE}/auth-service/classes/search/me?name=${encodeURIComponent(name)}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<ClassroomResponse[]> = await resp.json();
  return data.result;
}

/**
 * Student enrolls in a class with password
 */
export async function enrollInClass(
  token: string,
  request: EnrollmentRequest
): Promise<ClassStudentResponse> {
  const url = `${API_BASE}/auth-service/class-students/enroll`;
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

  const data: ApiResponse<ClassStudentResponse> = await resp.json();
  return data.result;
}

/**
 * Get all classes the current student is enrolled in
 */
export async function getMyEnrollments(
  token: string
): Promise<ClassStudentResponse[]> {
  const url = `${API_BASE}/auth-service/class-students/me`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data: ApiResponse<ClassStudentResponse[]> = await resp.json();
  return data.result;
}

/**
 * Student unenrolls from a class
 */
export async function unenrollFromClass(
  token: string,
  classId: number
): Promise<void> {
  const url = `${API_BASE}/auth-service/class-students/me/unenroll?classId=${classId}`;
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
