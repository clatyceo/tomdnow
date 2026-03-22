import { tools, toolsByCategory } from "../tools";
import type { ToolConfig } from "../tools";

describe("tools", () => {
  test("all tools have required fields", () => {
    const requiredFields: (keyof ToolConfig)[] = [
      "slug", "title", "h1", "displayName", "subtitle",
      "type", "inputMode", "category", "icon", "color", "seo", "howTo", "whyConvert", "faq",
    ];
    for (const [key, tool] of Object.entries(tools)) {
      for (const field of requiredFields) {
        expect(tool[field]).toBeDefined();
      }
    }
  });

  test("all slugs are unique", () => {
    const slugs = Object.values(tools).map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("toolsByCategory contains 3 categories", () => {
    expect(toolsByCategory).toHaveLength(3);
    const names = toolsByCategory.map((c) => c.name);
    expect(names).toContain("Documents");
    expect(names).toContain("Data");
    expect(names).toContain("Media");
  });

  test("all tools are assigned to a category", () => {
    const categorizedTools = toolsByCategory.flatMap((c) => c.tools);
    expect(categorizedTools.length).toBe(Object.keys(tools).length);
  });
});
