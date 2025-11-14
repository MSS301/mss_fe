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
  // No timeout - wait for response indefinitely (AI generation can take time)
  const response = await fetchWithAuth(
    "/ai_service/slides/gpt",
    token,
    {
      method: "POST",
      body: JSON.stringify(req),
    },
    null // No timeout - wait indefinitely for slide generation
  );
  return response.json();
}

// Template YAML API
export interface GenerateYAMLRequest {
  content_id: string;
  created_by?: string | null;
}

export interface GenerateYAMLResponse {
  content_yaml_id: string;
  yaml: string;
}

export async function generateYAMLFromContent(
  token: string,
  req: GenerateYAMLRequest
): Promise<GenerateYAMLResponse> {
  // No timeout - wait for response indefinitely (AI generation can take time)
  const response = await fetchWithAuth(
    "/ai_service/slides/template/yaml",
    token,
    {
      method: "POST",
      body: JSON.stringify(req),
    },
    null // No timeout - wait indefinitely for YAML generation
  );
  return response.json();
}

// Template API
export interface Template {
  template_id: string;
  name: string;
  filename: string;
  content_type: string;
  size?: number | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export async function listTemplates(token: string): Promise<Template[]> {
  const response = await fetchWithAuth("/ai_service/slides/templates", token);
  return response.json();
}

export async function getTemplate(
  token: string,
  templateId: string
): Promise<Template> {
  const response = await fetchWithAuth(
    `/ai_service/slides/templates/${templateId}`,
    token
  );
  return response.json();
}

export async function downloadTemplate(
  token: string,
  templateId: string
): Promise<Blob> {
  const response = await fetchWithAuth(
    `/ai_service/slides/templates/${templateId}/download`,
    token
  );
  return response.blob();
}

export async function getTemplatePreview(
  token: string,
  templateId: string
): Promise<string> {
  const response = await fetchWithAuth(
    `/ai_service/slides/templates/${templateId}/preview`,
    token
  );
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

// Template CRUD API
export interface TemplateUploadRequest {
  name: string;
  description?: string;
  file: File;
}

export async function uploadTemplate(
  token: string,
  req: TemplateUploadRequest
): Promise<Template> {
  const formData = new FormData();
  formData.append("name", req.name);
  if (req.description) {
    formData.append("description", req.description);
  }
  formData.append("file", req.file);

  const response = await fetchWithAuth("/ai_service/slides/templates", token, {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export async function updateTemplate(
  token: string,
  templateId: string,
  name: string,
  description?: string
): Promise<Template> {
  // Note: Backend may not have update endpoint, using PUT if available
  const response = await fetchWithAuth(
    `/ai_service/slides/templates/${templateId}`,
    token,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    }
  );
  return response.json();
}

export async function deleteTemplate(
  token: string,
  templateId: string
): Promise<void> {
  await fetchWithAuth(`/ai_service/slides/templates/${templateId}`, token, {
    method: "DELETE",
  });
}

// Books Management API
export interface IngestBookRequest {
  pdf_url: string;
  book_name: string;
  grade_id: string;
  force_reparse?: boolean;
  force_clear_cache?: boolean;
}

export interface IngestBookResponse {
  book_id: string;
  book_name: string;
  grade_id: string;
  status: string;
  chunks_count?: number;
  pages_count?: number;
}

export interface BookInfo {
  book_id: string;
  book_name: string;
  grade_id: string;
  structure?: any;
  chunks?: number;
  pages?: number[];
}

export interface BooksListResponse {
  books: Record<string, BookInfo>;
}

export interface BookStructureResponse {
  book_id: string;
  book_name: string;
  grade_id: string;
  structure: any;
}

export async function ingestBook(
  token: string,
  req: IngestBookRequest
): Promise<IngestBookResponse> {
  const response = await fetchWithAuth(
    "/ai_service/ingestion",
    token,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    },
    null // No timeout for ingest
  );
  return response.json();
}

export async function getAllIngestedBooks(
  token: string
): Promise<BooksListResponse> {
  const response = await fetchWithAuth("/ai_service/ingestion", token);
  return response.json();
}

export async function getIngestedBookById(
  token: string,
  bookId: string
): Promise<BookInfo> {
  const response = await fetchWithAuth(
    `/ai_service/ingestion/id/${bookId}`,
    token
  );
  return response.json();
}

export async function getBookStructure(
  token: string,
  bookId: string
): Promise<BookStructureResponse> {
  const response = await fetchWithAuth(
    `/ai_service/ingestion/id/${bookId}/structure`,
    token
  );
  return response.json();
}

export async function deleteBookById(
  token: string,
  bookId: string
): Promise<any> {
  const response = await fetchWithAuth(
    `/ai_service/ingestion/by-id/${bookId}`,
    token,
    {
      method: "DELETE",
    }
  );
  return response.json();
}

export async function deleteBookByName(
  token: string,
  bookName: string
): Promise<any> {
  const response = await fetchWithAuth(
    `/ai_service/ingestion/${encodeURIComponent(bookName)}`,
    token,
    {
      method: "DELETE",
    }
  );
  return response.json();
}

// Export PPTX API
export interface ExportPPTXRequest {
  content_yaml_id: string;
  template_id: string;
  filename?: string | null;
  overwrite_existing?: boolean | null;
}

export async function exportPPTX(
  token: string,
  req: ExportPPTXRequest
): Promise<Blob> {
  // No timeout - wait for response indefinitely (PPTX generation can take time)
  // Endpoint: /ai_service/slides/template/export (router prefix: /ai_service/slides, route: /template/export)
  const response = await fetchWithAuth(
    "/ai_service/slides/template/export",
    token,
    {
      method: "POST",
      body: JSON.stringify(req),
    },
    null // No timeout - wait indefinitely for PPTX export
  );
  return response.blob();
}

// List User's Generated Slides
export interface SlideListItem {
  content_id: string;
  content_text?: string | null;
  grade_id?: string | null;
  book_id?: string | null;
  chapter_id?: string | null;
  lesson_id?: string | null;
  subject_id?: string | null;
  slidesgpt?: {
    id?: string;
    embed?: string;
    download?: string;
    created_at?: string;
    created_by?: string;
  } | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SlidesListResponse {
  slides: SlideListItem[];
  total: number;
  limit: number;
  skip: number;
}

export async function listMySlides(
  token: string,
  limit: number = 20,
  skip: number = 0
): Promise<SlidesListResponse> {
  const response = await fetchWithAuth(
    `/ai_service/slides/my?limit=${limit}&skip=${skip}`,
    token,
    {
      method: "GET",
    }
  );
  return response.json();
}
