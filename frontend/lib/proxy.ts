const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function proxyJsonPost(backendPath: string, request: Request) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}${backendPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function proxyGet(backendPath: string, request: Request) {
  const headers: Record<string, string> = {};
  const sessionToken = request.headers.get("x-session-token");
  if (sessionToken) headers["x-session-token"] = sessionToken;

  const res = await fetch(`${BACKEND_URL}${backendPath}`, { headers });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function proxySessionPost(backendPath: string, request: Request) {
  const headers: Record<string, string> = {};
  const sessionToken = request.headers.get("x-session-token");
  if (sessionToken) headers["x-session-token"] = sessionToken;

  const res = await fetch(`${BACKEND_URL}${backendPath}`, {
    method: "POST",
    headers,
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export { BACKEND_URL };
