"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ToolConfig } from "@/lib/tools";
import { convertOcr } from "@/lib/api";
import FileUploader from "./file-uploader";
import MarkdownPreview from "./markdown-preview";
import DownloadButton from "./download-button";
import { sanitizeFilename } from "./converter-page";

const OCR_LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "kor", label: "Korean" },
  { code: "jpn", label: "Japanese" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "deu", label: "German" },
  { code: "fra", label: "French" },
  { code: "spa", label: "Spanish" },
  { code: "por", label: "Portuguese" },
];

export default function OcrConverterPage({ tool }: { tool: ToolConfig }) {
  const t = useTranslations("common");
  const tTool = useTranslations(`tools.${tool.key}`);
  const tOcr = useTranslations("ocr");
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("eng");

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError("");
    setMarkdown("");
    try {
      const result = await convertOcr(file, lang);
      setMarkdown(result.markdown);
      setTitle(result.metadata.title);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("conversionFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
        {tTool("h1")}
      </h1>
      <p className="mt-3 text-gray-500 text-center">{tTool("subtitle")}</p>

      {/* Language selector */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <label htmlFor="ocr-lang" className="text-sm font-medium text-gray-700">
          {tOcr("selectLanguage")}
        </label>
        <select
          id="ocr-lang"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="w-64 px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4281A4] focus:border-[#4281A4]"
        >
          {OCR_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400">{tOcr("languageHint")}</p>
      </div>

      <div className="mt-8">
        <FileUploader
          accept={tool.accept!}
          onFileSelect={handleFileSelect}
          onError={setError}
          isLoading={isLoading}
        />
      </div>

      {error && (
        <p role="alert" aria-live="polite" className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}

      {markdown && (
        <div className="mt-8 space-y-4">
          <MarkdownPreview markdown={markdown} title={title} />
          <DownloadButton markdown={markdown} filename={sanitizeFilename(title, "ocr-result")} />
        </div>
      )}
    </div>
  );
}
