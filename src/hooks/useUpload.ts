"use client";

import { useState } from "react";
import api from "@/lib/api";
import type { ApiResponse, UploadResponse } from "@/types";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File,
    type: "audio" | "image",
  ): Promise<UploadResponse> => {
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await api.post<ApiResponse<UploadResponse>>(
        "/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
          },
        },
      );
      return res.data.result!;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, progress };
}
