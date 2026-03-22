export interface ToolConfig {
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  type: string;
  inputMode: "file" | "url";
  accept?: string;
  placeholder?: string;
  seo: {
    description: string;
    keywords: string[];
  };
  howTo: { step: string; desc: string }[];
  whyConvert: string[];
  faq: { q: string; a: string }[];
}

export const tools: Record<string, ToolConfig> = {
  pdf: {
    slug: "pdf-to-markdown",
    title: "PDF to Markdown — AllToMD",
    h1: "Convert PDF to Markdown",
    subtitle: "Transform your PDF documents into clean, readable Markdown files.",
    type: "pdf",
    inputMode: "file",
    accept: ".pdf",
    seo: {
      description: "Free online PDF to Markdown converter. Upload your PDF and get clean Markdown instantly.",
      keywords: ["pdf to markdown", "convert pdf to md", "pdf markdown converter"],
    },
    howTo: [
      { step: "Upload your PDF", desc: "Drag and drop or click to select your PDF file." },
      { step: "Convert", desc: "Our tool converts the PDF to clean Markdown automatically." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Edit PDF content in any text editor",
      "Use in documentation systems like GitHub, Notion, or Obsidian",
      "Feed into AI/LLM tools for analysis",
      "Version control your documents with Git",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, AllToMD is completely free with no sign-up required." },
      { q: "What is the maximum file size?", a: "You can upload PDF files up to 10MB." },
      { q: "Does it preserve formatting?", a: "We preserve headings, lists, tables, and links. Complex layouts may be simplified for readability." },
      { q: "Is my file stored on the server?", a: "No. Your file is processed in memory and immediately deleted after conversion." },
    ],
  },
  docx: {
    slug: "docx-to-markdown",
    title: "DOCX to Markdown — AllToMD",
    h1: "Convert Word to Markdown",
    subtitle: "Convert Microsoft Word documents to Markdown format instantly.",
    type: "docx",
    inputMode: "file",
    accept: ".docx",
    seo: {
      description: "Free online Word to Markdown converter. Upload DOCX files and get clean Markdown instantly.",
      keywords: ["docx to markdown", "word to markdown", "convert word to md"],
    },
    howTo: [
      { step: "Upload your DOCX", desc: "Drag and drop or click to select your Word document." },
      { step: "Convert", desc: "Our tool converts the DOCX to Markdown automatically." },
      { step: "Download", desc: "Preview the result and download your .md file." },
    ],
    whyConvert: [
      "Migrate Word docs to Markdown-based systems",
      "Use in static site generators like Jekyll or Hugo",
      "Collaborate using plain text in Git repositories",
      "Prepare content for AI and LLM processing",
    ],
    faq: [
      { q: "Is this tool free?", a: "Yes, AllToMD is completely free with no sign-up required." },
      { q: "Does it support .doc files?", a: "Currently we support .docx format. Save your .doc file as .docx first." },
      { q: "Are images preserved?", a: "Images are referenced in the Markdown output but not embedded. Text content is fully preserved." },
      { q: "Is my file stored on the server?", a: "No. Your file is processed in memory and immediately deleted after conversion." },
    ],
  },
  youtube: {
    slug: "youtube-to-markdown",
    title: "YouTube to Markdown — AllToMD",
    h1: "Convert YouTube to Markdown",
    subtitle: "Extract YouTube video transcripts as clean Markdown files.",
    type: "youtube",
    inputMode: "url",
    placeholder: "https://www.youtube.com/watch?v=...",
    seo: {
      description: "Free online YouTube to Markdown converter. Paste a URL and get the video transcript as Markdown.",
      keywords: ["youtube to markdown", "youtube transcript to markdown", "youtube transcript downloader"],
    },
    howTo: [
      { step: "Paste YouTube URL", desc: "Copy the video URL and paste it into the input field." },
      { step: "Convert", desc: "We extract the transcript and format it as Markdown." },
      { step: "Download", desc: "Preview the transcript and download your .md file." },
    ],
    whyConvert: [
      "Study video content in text form",
      "Create notes from educational videos",
      "Feed video transcripts into AI tools",
      "Archive video content as searchable text",
    ],
    faq: [
      { q: "Does every YouTube video work?", a: "Only videos with captions or auto-generated subtitles are supported." },
      { q: "Is this tool free?", a: "Yes, AllToMD is completely free with no sign-up required." },
      { q: "Does it include timestamps?", a: "Yes, the transcript includes timestamps for each segment." },
      { q: "Can I choose the language?", a: "Currently we extract the default transcript language available for the video." },
    ],
  },
};
