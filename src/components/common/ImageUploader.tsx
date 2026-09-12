'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (url?: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageChange,
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid format. Please select a JPG, PNG, or WEBP image.');
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_SIZE_MB}MB limit. Please choose a smaller image.`);
      return;
    }

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(15);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;

      // Simulate step progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            setIsUploading(false);
            setPreview(result);
            onImageChange(result);
            return 100;
          }
          return prev + 25;
        });
      }, 70);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setError('Failed to read image file. Please try another one.');
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    setError(null);
    setUploadProgress(0);
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        Banner / Attachment Image (Optional)
      </label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Notice banner preview"
            className="w-full h-44 object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            error
              ? 'border-red-300 bg-red-50/50 hover:bg-red-50'
              : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />

          <div className="flex flex-col items-center justify-center">
            <div className="p-3 bg-white rounded-full shadow-xs border border-slate-200 text-blue-600 mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Click to browse or drag and drop image
            </p>
            <p className="text-xs text-slate-400">
              Supported formats: JPG, PNG, WEBP (Max: {MAX_SIZE_MB}MB)
            </p>
          </div>
        </div>
      )}

      {/* Simulated Upload Progress */}
      {isUploading && (
        <div className="mt-2.5">
          <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
            <span>Processing image...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Inline Error */}
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
