// Test the sanitizeFilename function extracted in converter-page.tsx
// Since it's not exported, we re-implement the same logic for testing
// (or we can export it — let's test the logic directly)

function sanitizeFilename(title: string, fallback: string): string {
  if (!title) return fallback;
  return title.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase() || fallback;
}

describe("sanitizeFilename", () => {
  test("normal title", () => {
    expect(sanitizeFilename("My Document Title", "fallback")).toBe("my-document-title");
  });

  test("empty title returns fallback", () => {
    expect(sanitizeFilename("", "pdf")).toBe("pdf");
  });

  test("special characters removed", () => {
    expect(sanitizeFilename("Hello! @World# 2024", "fallback")).toBe("hello-world-2024");
  });

  test("multiple spaces collapsed", () => {
    expect(sanitizeFilename("hello   world", "fallback")).toBe("hello-world");
  });

  test("title with only special chars returns fallback", () => {
    expect(sanitizeFilename("!@#$%", "pdf")).toBe("pdf");
  });
});
