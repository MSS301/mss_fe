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
  options: RequestInit = {},
  timeoutMs: number | null = 30000
): Promise<Response> {
  const url = `${AI_SERVICE_BASE}${endpoint}`;
  console.log(`[aiService] Fetching: ${url}`);
  console.log(`[aiService] API_BASE: ${API_BASE}`);
  console.log(`[aiService] AI_SERVICE_BASE: ${AI_SERVICE_BASE}`);
  console.log(
    `[aiService] Token (first 20 chars): ${
      token ? token.substring(0, 20) + "..." : "NO TOKEN"
    }`
  );

  // Create AbortController for timeout only if timeoutMs is provided
  const hasTimeout = timeoutMs != null;
  const controller = hasTimeout ? new AbortController() : null;
  const timeoutId = hasTimeout
    ? setTimeout(() => controller!.abort(), timeoutMs!)
    : null;

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller?.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    console.log(`[aiService] Response status: ${response.status} for ${url}`);
    console.log(
      `[aiService] Response headers:`,
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[aiService] Error response:`, errorText);
      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response;
  } catch (error: any) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    console.error(`[aiService] Fetch error for ${url}:`, error);
    console.error(`[aiService] Error type:`, error.constructor.name);
    console.error(`[aiService] Error message:`, error.message);

    if (error.name === "AbortError" && timeoutMs !== null) {
      const timeoutSeconds = Math.floor(timeoutMs / 1000);
      throw new Error(
        `Request timeout: The request to ${url} took too long (>${timeoutSeconds}s). The service might be slow or unavailable.`
      );
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Network error: Cannot connect to ${url}. Please check if the API Gateway (${API_BASE}) is running and the AI Chatbot Service (port 8000) is accessible.`
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
  const response = await fetchWithAuth(
    `/ai_service/subjects/${subjectId}`,
    token
  );
  return response.json();
}

// Grades API
export async function getAllGrades(token: string): Promise<Grade[]> {
  const response = await fetchWithAuth("/ai_service/grades", token);
  return response.json();
}

export async function getGradeById(
  token: string,
  gradeId: string
): Promise<Grade> {
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
  gradeId: string,
  retries: number = 2
): Promise<Book[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(
          `[aiService] Retrying getBooksByGrade (attempt ${attempt + 1}/${
            retries + 1
          })...`
        );
        // Wait before retry: 1s, 2s, 3s...
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }

      const response = await fetchWithAuth(
        `/ai_service/grades/${gradeId}/books`,
        token
      );
      const data = await response.json();

      if (data.books && Array.isArray(data.books)) {
        console.log(
          `[aiService] Successfully loaded ${data.books.length} books for grade ${gradeId}`
        );
        return data.books;
      } else {
        console.warn(`[aiService] Unexpected response format for books:`, data);
        return [];
      }
    } catch (error: any) {
      lastError = error;
      console.error(
        `[aiService] Attempt ${attempt + 1} failed:`,
        error.message
      );

      // Don't retry on timeout or authentication errors
      if (
        error.message.includes("timeout") ||
        error.message.includes("Unauthorized") ||
        error.message.includes("Invalid token")
      ) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Failed to load books after retries");
}

export async function getBookById(
  token: string,
  bookId: string
): Promise<Book> {
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
  const response = await fetchWithAuth(
    `/ai_service/chapters/${chapterId}`,
    token
  );
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

export async function getLessonById(
  token: string,
  lessonId: string
): Promise<Lesson> {
  const response = await fetchWithAuth(
    `/ai_service/lessons/${lessonId}`,
    token
  );
  return response.json();
}

// RAG Query API
export interface RAGRequest {
  grade_id: string;
  book_id: string;
  chapter_id: string;
  lesson_id: string;
  content: string;
  subject_id: string;
  k?: number;
}

export interface RAGResponse {
  outline: any;
  sources?: any[];
  indices?: any[];
  distances?: any[];
  content_id: string;
  content_text: string;
}

export async function ragQuery(
  token: string,
  req: RAGRequest
): Promise<RAGResponse> {
  // No timeout - wait for response indefinitely
  const response = await fetchWithAuth(
    "/ai_service/rag/query",
    token,
    {
      method: "POST",
      body: JSON.stringify({
        grade_id: req.grade_id,
        book_id: req.book_id,
        chapter_id: req.chapter_id,
        lesson_id: req.lesson_id,
        content: req.content,
        subject_id: req.subject_id,
        k: req.k || 8,
      }),
    },
    null // No timeout - wait indefinitely for AI generation
  );
  return response.json();
}

// Revise Content API
export interface ReviseContentRequest {
  instruction: string;
}

export interface ReviseContentResponse {
  content_id: string;
  content_text: string;
}

export async function reviseContent(
  token: string,
  contentId: string,
  req: ReviseContentRequest
): Promise<ReviseContentResponse> {
  const response = await fetchWithAuth(
    `/ai_service/rag/content/${contentId}/revise`,
    token,
    {
      method: "POST",
      body: JSON.stringify(req),
    }
  );
  return response.json();
}

// Create Slide from Content API
export interface CreateSlideRequest {
  content_id: string;
  created_by?: string | null;
}

export interface CreateSlideResponse {
  id: string;
  embed?: string;
  download?: string;
}

export async function createSlideFromContent(
  token: string,
  req: CreateSlideRequest
): Promise<CreateSlideResponse> {
  const response = await fetchWithAuth("/ai_service/slide/gpt", token, {
    method: "POST",
    body: JSON.stringify(req),
  });
  return response.json();
}
