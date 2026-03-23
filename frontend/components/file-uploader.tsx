"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { MAX_FILE_SIZE } from "@/lib/config";

interface FileUploaderProps {
  accept: string;
  onFileSelect: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  onError?: (msg: string) => void;
  isLoading: boolean;
  multiple?: boolean;
  maxFiles?: number;
}

export default function FileUploader({
  accept,
  onFileSelect,
  onFilesSelect,
  onError,
  isLoading,
  multiple = false,
  maxFiles = 5,
}: FileUploaderProps) {
  const t = useTranslations("common");
  const [isDragging, setIsDragging] = useState(false);

  const isAcceptedFile = useCallback(
    (file: File) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const accepted = accept.split(",").map((a) => a.trim().toLowerCase());
      return accepted.some((a) => ext === a || ext.endsWith(a));
    },
    [accept]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);

      if (!multiple) {
        if (droppedFiles.length > 1) {
          onError?.(t("oneFileOnly"));
          return;
        }
        const file = droppedFiles[0];
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
          onError?.(t("fileTooLarge"));
          return;
        }
        if (!isAcceptedFile(file)) {
          onError?.(t("unsupportedType"));
          return;
        }
        onFileSelect(file);
        return;
      }

      // Multiple mode
      if (droppedFiles.length > maxFiles) {
        onError?.(t("batchMaxFiles", { max: maxFiles }));
        return;
      }

      const validFiles: File[] = [];
      for (const file of droppedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          onError?.(t("fileTooLarge"));
          return;
        }
        if (!isAcceptedFile(file)) {
          onError?.(t("unsupportedType"));
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        onFilesSelect?.(validFiles);
      }
    },
    [onFileSelect, onFilesSelect, onError, accept, t, multiple, maxFiles, isAcceptedFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length === 0) return;

      if (!multiple) {
        const file = selectedFiles[0];
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
          onError?.(t("fileTooLarge"));
          return;
        }
        onFileSelect(file);
        return;
      }

      // Multiple mode
      if (selectedFiles.length > maxFiles) {
        onError?.(t("batchMaxFiles", { max: maxFiles }));
        return;
      }

      for (const file of selectedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          onError?.(t("fileTooLarge"));
          return;
        }
      }

      onFilesSelect?.(selectedFiles);
    },
    [onFileSelect, onFilesSelect, onError, t, multiple, maxFiles]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      role="button"
      aria-label={t("uploadArea")}
      className={`relative flex flex-col items-center justify-center w-full h-52 rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        aria-label={t("fileInputLabel")}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={isLoading}
        multiple={multiple}
      />
      {isLoading ? (
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <>
          <p className="text-gray-600 font-medium">
            {t("dragDrop")}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {multiple ? t("orBrowseMultiple") : t("orBrowse")}
          </p>
        </>
      )}
    </div>
  );
}
