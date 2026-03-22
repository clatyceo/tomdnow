import { convertFile, convertUrl } from "../api";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("convertFile", () => {
  test("sends FormData with file and type", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ markdown: "# Test", metadata: { title: "test", type: "pdf", size: 100 } }),
    });

    const file = new File(["hello"], "test.pdf", { type: "application/pdf" });
    await convertFile(file, "pdf");

    expect(mockFetch).toHaveBeenCalledWith("/api/convert", expect.objectContaining({ method: "POST" }));
    const body = mockFetch.mock.calls[0][1].body;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("type")).toBe("pdf");
  });

  test("uses status-specific message for 413", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 413,
      json: () => Promise.resolve({ error: "ignored" }),
    });
    const file = new File(["hello"], "test.pdf");
    await expect(convertFile(file, "pdf")).rejects.toThrow("File is too large");
  });

  test("uses status-specific message for 429", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({}),
    });
    const file = new File(["hello"], "test.pdf");
    await expect(convertFile(file, "pdf")).rejects.toThrow("Too many requests");
  });

  test("reads error key from new response format", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Custom backend error", code: "UnsupportedTypeError" }),
    });
    const file = new File(["hello"], "test.pdf");
    await expect(convertFile(file, "pdf")).rejects.toThrow("Custom backend error");
  });

  test("reads detail key from legacy response format", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: "File too large" }),
    });

    const file = new File(["hello"], "test.pdf");
    await expect(convertFile(file, "pdf")).rejects.toThrow("File too large");
  });

  test("throws fallback message with status code when JSON fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("parse error")),
    });

    const file = new File(["hello"], "test.pdf");
    await expect(convertFile(file, "pdf")).rejects.toThrow("Conversion failed (500)");
  });
});

describe("convertUrl", () => {
  test("sends JSON body with url and type", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ markdown: "# Test", metadata: { title: "url", type: "youtube", size: 50 } }),
    });

    await convertUrl("https://youtube.com/watch?v=test", "youtube");

    expect(mockFetch).toHaveBeenCalledWith("/api/convert", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.url).toBe("https://youtube.com/watch?v=test");
    expect(body.type).toBe("youtube");
  });

  test("throws on error response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: "Invalid URL" }),
    });

    await expect(convertUrl("bad", "youtube")).rejects.toThrow("Invalid URL");
  });
});
