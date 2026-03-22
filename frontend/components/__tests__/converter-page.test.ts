import { sanitizeFilename } from "../converter-page";

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
