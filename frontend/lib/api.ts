const API_BASE = "/api/convert";

export interface ConvertResult {
  markdown: string;
  metadata: { title: string; type: string; size: number };
}

const STATUS_MESSAGES: Record<number, string> = {
  413: "File is too large (max 10MB)",
  429: "Too many requests. Please wait a moment and try again.",
  504: "Conversion timed out. Please try a smaller file.",
};

async function handleErrorResponse(res: Response, fallbackPrefix = "Conversion"): Promise<never> {
  if (STATUS_MESSAGES[res.status]) {
    throw new Error(STATUS_MESSAGES[res.status]);
  }
  const body = await res.json().catch(() => null);
  const message = body?.error || body?.detail || `${fallbackPrefix} failed (${res.status})`;
  throw new Error(message);
}

async function handleResponse(res: Response): Promise<ConvertResult> {
  if (!res.ok) {
    await handleErrorResponse(res);
  }
  return res.json();
}

export async function convertFile(file: File, type: string): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  const res = await fetch(API_BASE, { method: "POST", body: formData });
  return handleResponse(res);
}

export async function convertUrl(url: string, type: string): Promise<ConvertResult> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, type }),
  });
  return handleResponse(res);
}

export interface BatchResult {
  results: (ConvertResult & { filename: string })[];
  errors: { filename: string; error: string }[];
  total: number;
}

export async function convertOcr(file: File, lang: string = "eng"): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);

  const res = await fetch(`${API_BASE}/ocr`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function convertBatch(files: File[]): Promise<BatchResult> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`${API_BASE}/batch`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Batch conversion");
  }

  return res.json();
}
