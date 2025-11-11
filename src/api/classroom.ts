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
  schoolId?: number;
  schoolName?: string;
  capacity?: number;
  enrollmentCount?: number;
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
