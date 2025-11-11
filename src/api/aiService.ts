const API_BASE =
  (process.env.REACT_APP_API_BASE &&
    process.env.REACT_APP_API_BASE.trim().replace(/\/$/, "")) ||
  "http://localhost:8080";

const AI_SERVICE_BASE = `${API_BASE}/ai-chatbot-service`;

export interface Subject {
  subject_id: string;
  subject_code: string;
  subject_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Grade {
  grade_id: string;
  grade_number: number;
  grade_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Book {
  book_id: string;
  book_name: string;
  grade_id: string;
  subject_id?: string;
  structure?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Chapter {
  chapter_id: string;
  book_id: string;
  title: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  lesson_id: string;
  chapter_id: string;
  book_id: string;
  title: string;
  page?: number;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

async function fetchWithAuth(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${AI_SERVICE_BASE}${endpoint}`;
  console.log(`[aiService] Fetching: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    console.log(`[aiService] Response status: ${response.status} for ${url}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[aiService] Error response:`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response;
  } catch (error: any) {
    console.error(`[aiService] Fetch error for ${url}:`, error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Cannot connect to ${url}. Please check if the API Gateway (${API_BASE}) is running.`
      );
    }
    throw error;
  }
}

// Subjects API
export async function getAllSubjects(token: string): Promise<Subject[]> {
  const response = await fetchWithAuth("/ai_service/subjects", token);
  return response.json();
}

export async function getSubjectById(
  token: string,
  subjectId: string
): Promise<Subject> {
  const response = await fetchWithAuth(`/ai_service/subjects/${subjectId}`, token);
  return response.json();
}

// Grades API
export async function getAllGrades(token: string): Promise<Grade[]> {
  const response = await fetchWithAuth("/ai_service/grades", token);
  return response.json();
}

export async function getGradeById(token: string, gradeId: string): Promise<Grade> {
  const response = await fetchWithAuth(`/ai_service/grades/${gradeId}`, token);
  return response.json();
}

// Books API
export async function getAllBooks(token: string): Promise<Book[]> {
  const response = await fetchWithAuth("/ai_service/books", token);
  return response.json();
}

export async function getBooksByGrade(
  token: string,
  gradeId: string
): Promise<Book[]> {
  const response = await fetchWithAuth(`/ai_service/grades/${gradeId}/books`, token);
  const data = await response.json();
  return data.books || [];
}

export async function getBookById(token: string, bookId: string): Promise<Book> {
  const response = await fetchWithAuth(`/ai_service/books/${bookId}`, token);
  return response.json();
}

// Chapters API
export async function getAllChapters(
  token: string,
  bookId?: string
): Promise<Chapter[]> {
  const url = bookId
    ? `/ai_service/chapters?book_id=${bookId}`
    : "/ai_service/chapters";
  const response = await fetchWithAuth(url, token);
  return response.json();
}

export async function getChaptersByBook(
  token: string,
  bookId: string
): Promise<Chapter[]> {
  return getAllChapters(token, bookId);
}

export async function getChapterById(
  token: string,
  chapterId: string
): Promise<Chapter> {
  const response = await fetchWithAuth(`/ai_service/chapters/${chapterId}`, token);
  return response.json();
}

// Lessons API
export async function getAllLessons(
  token: string,
  chapterId?: string,
  bookId?: string
): Promise<Lesson[]> {
  let url = "/ai_service/lessons";
  const params = new URLSearchParams();
  if (chapterId) params.append("chapter_id", chapterId);
  if (bookId) params.append("book_id", bookId);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetchWithAuth(url, token);
  return response.json();
}

export async function getLessonsByChapter(
  token: string,
  chapterId: string
): Promise<Lesson[]> {
  return getAllLessons(token, chapterId);
}

export async function getLessonById(token: string, lessonId: string): Promise<Lesson> {
  const response = await fetchWithAuth(`/ai_service/lessons/${lessonId}`, token);
  return response.json();
}

