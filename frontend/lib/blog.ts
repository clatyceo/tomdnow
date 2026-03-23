import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getBlogPosts(locale: string): BlogPost[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author || "tomdnow",
        tags: data.tags || [],
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(
  locale: string,
  slug: string
): BlogPost | null {
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, "");
  const filePath = path.join(CONTENT_DIR, locale, `${safeSlug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author || "tomdnow",
    tags: data.tags || [],
    content,
  };
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const allSlugs = new Set<string>();
  for (const locale of fs.readdirSync(CONTENT_DIR)) {
    const dir = path.join(CONTENT_DIR, locale);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".mdx")) allSlugs.add(f.replace(/\.mdx$/, ""));
    }
  }
  return Array.from(allSlugs);
}
