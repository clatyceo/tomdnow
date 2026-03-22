const API_BASE = "/api/convert";

export async function convertFile(file: File, type: string): Promise<{ markdown: string; metadata: { title: string; type: string; size: number } }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch(API_BASE, { method: "POST", body: formData });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Conversion failed" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }

  return res.json();
}

export async function convertUrl(url: string, type: string): Promise<{ markdown: string; metadata: { title: string; type: string; size: number } }> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, type }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Conversion failed" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }

  return res.json();
}
