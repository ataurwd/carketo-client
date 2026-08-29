import React from 'react';
import { Image as ImageIcon, UploadCloud, Loader2, X } from 'lucide-react';

export interface UploadedPhoto {
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  r2Url?: string;
  r2Key?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

interface ImageDropzoneSectionProps {
  uploadedPhotos: UploadedPhoto[];
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
}

export function ImageDropzoneSection({
  uploadedPhotos,
  isDragging,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemovePhoto,
}: ImageDropzoneSectionProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-black" />
          <h2 className="text-base font-black text-black">Vehicle Photos (Max 3 Images)</h2>
        </div>
        <span className="text-xs font-bold text-zinc-500">
          {uploadedPhotos.length}/3 Uploaded
        </span>
      </div>

      {/* Dropzone Area with Live Drag and Drop */}
      {uploadedPhotos.length < 3 && (
        <label
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center group ${
            isDragging
              ? 'border-black bg-black/5 ring-4 ring-black/10 scale-[1.01]'
              : 'border-zinc-300 hover:border-black bg-zinc-50/50 hover:bg-zinc-50'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            onChange={onFileChange}
            className="hidden"
          />
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-sm mb-3 ${
              isDragging
                ? 'bg-black text-white scale-110 animate-bounce'
                : 'bg-white border border-zinc-200 text-zinc-700 group-hover:scale-110'
            }`}
          >
            <UploadCloud className={`w-6 h-6 ${isDragging ? 'text-white' : 'text-black'}`} />
          </div>
          <p className="text-xs font-extrabold text-black">
            {isDragging ? 'Release to upload photos!' : 'Click to select or drag & drop car photos'}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">
            Upload up to {3 - uploadedPhotos.length} more images • Max file size: <strong>5MB</strong> each (JPEG, PNG, WebP)
          </p>
        </label>
      )}

      {/* Image Previews Grid */}
      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {uploadedPhotos.map((photo, idx) => (
            <div
              key={idx}
              className="relative group rounded-2xl border border-zinc-200 bg-zinc-50 p-2 overflow-hidden shadow-sm space-y-2"
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-200 border border-zinc-100">
                <img
                  src={photo.r2Url || photo.previewUrl}
                  alt={photo.name}
                  className="h-full w-full object-cover"
                />

                {/* Uploading Overlay */}
                {photo.isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-white space-y-2">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-300 rounded-full"
                        style={{ width: `${photo.uploadProgress || 10}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Uploading to R2 {photo.uploadProgress}%
                    </span>
                  </div>
                )}

                {/* Delete Button */}
                {!photo.isUploading && (
                  <button
                    type="button"
                    onClick={() => onRemovePhoto(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-sm transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {idx === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-black uppercase tracking-wider">
                    Cover Photo
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-500">
                <span className="truncate max-w-[120px]">{photo.name}</span>
                <span>{(photo.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
