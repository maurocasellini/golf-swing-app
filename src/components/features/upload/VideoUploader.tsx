"use client";

import { useCallback, useState } from "react";

interface VideoUploaderProps {
  onVideoSelected: (file: File, objectUrl: string) => void;
}

const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_SIZE_MB = 200;

export default function VideoUploader({ onVideoSelected }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(mp4|webm|mov)$/i)) {
        setError("Please upload an MP4, WebM, or MOV video file.");
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      onVideoSelected(file, objectUrl);
    },
    [onVideoSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed
          p-12 transition-all cursor-pointer
          ${isDragging
            ? "border-golf-600 bg-golf-50"
            : "border-gray-300 bg-white hover:border-golf-400 hover:bg-golf-50/50"
          }
        `}
        onClick={() => document.getElementById("video-input")?.click()}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-golf-100 text-golf-700">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-700">
          Drag & drop your swing video here
        </p>
        <p className="mt-1 text-sm text-gray-500">or click to browse</p>
        <p className="mt-3 text-xs text-gray-400">
          Supported: MP4, WebM, MOV (max {MAX_SIZE_MB}MB)
        </p>
        <input
          id="video-input"
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
