"use client";

import { useState } from "react";
import { ToolConfig } from "@/lib/tools";
import { convertFile, convertUrl } from "@/lib/api";
import FileUploader from "./file-uploader";
import UrlInput from "./url-input";
import MarkdownPreview from "./markdown-preview";
import DownloadButton from "./download-button";

export default function ConverterPage({ tool }: { tool: ToolConfig }) {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError("");
    setMarkdown("");
    try {
      const result = await convertFile(file, tool.type);
      setMarkdown(result.markdown);
      setTitle(result.metadata.title);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrl = async (url: string) => {
    setIsLoading(true);
    setError("");
    setMarkdown("");
    try {
      const result = await convertUrl(url, tool.type);
      setMarkdown(result.markdown);
      setTitle(result.metadata.title);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setIsLoading(false);
    }
  };

  const sanitizedFilename = title
    ? title.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase()
    : tool.type;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
        {tool.h1}
      </h1>
      <p className="mt-3 text-gray-500 text-center">{tool.subtitle}</p>

      <div className="mt-10">
        {tool.inputMode === "file" ? (
          <FileUploader accept={tool.accept!} onFileSelect={handleFile} isLoading={isLoading} />
        ) : (
          <UrlInput placeholder={tool.placeholder!} onSubmit={handleUrl} isLoading={isLoading} />
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}

      {markdown && (
        <div className="mt-8 space-y-4">
          <MarkdownPreview markdown={markdown} title={title} />
          <DownloadButton markdown={markdown} filename={sanitizedFilename} />
        </div>
      )}
    </div>
  );
}
