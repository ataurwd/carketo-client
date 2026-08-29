import axios from 'axios';
import { SITE_CONFIG } from '@/lib/constants';

export interface UploadResult {
  publicUrl: string;
  key: string;
  fileName: string;
  fileSize: number;
}

// Dedicated axios instance that DOES NOT set Content-Type
// so the browser can set multipart/form-data with the correct boundary automatically.
const uploadAxios = axios.create({
  baseURL: SITE_CONFIG.apiUrl,
  withCredentials: true,
  timeout: 60000, // 60 seconds for large file uploads
});

uploadAxios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

uploadAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    const message = errorData?.message || error.message || 'Upload failed';
    const customError: any = new Error(message);
    customError.statusCode = error.response?.status;
    return Promise.reject(customError);
  }
);

export const uploadService = {
  /**
   * Upload a single file to Cloudflare R2 via backend multipart upload.
   * Uses FormData — no CORS, no base64, no presigned URL complexity.
   */
  async uploadFileToR2(
    file: File,
    folder: 'cars' | 'avatars' | 'documents' = 'cars',
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res: any = await uploadAxios.post('/uploads/file', formData, {
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      },
    });

    return res.data;
  },

  /**
   * Upload multiple files to Cloudflare R2 with per-file progress.
   */
  async uploadMultipleFilesToR2(
    files: File[],
    folder: 'cars' | 'avatars' | 'documents' = 'cars',
    onFileProgress?: (index: number, progress: number) => void
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file, idx) =>
      this.uploadFileToR2(file, folder, (percent) => {
        if (onFileProgress) onFileProgress(idx, percent);
      })
    );
    return Promise.all(uploadPromises);
  },

  /**
   * Delete an image from Cloudflare R2 by key or URL.
   */
  async deleteFile(keyOrUrl?: string): Promise<void> {
    if (!keyOrUrl) return;
    try {
      await uploadAxios.delete('/uploads/file', {
        data: {
          key: keyOrUrl.startsWith('http') ? undefined : keyOrUrl,
          url: keyOrUrl.startsWith('http') ? keyOrUrl : undefined,
        },
      });
    } catch {
      // Graceful ignore on delete failure
    }
  },
};
