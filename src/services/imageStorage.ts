import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export type ProgressCallback = (percent: number) => void;

/**
 * Optimizes/compresses client image before upload for smooth networking.
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImageIfNeeded(file: File): Promise<string> {
  const base64 = await fileToBase64(file);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxDim = 1200;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      } else {
        resolve(base64);
      }
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

/**
 * Upload an image to Firebase Storage with progress tracking.
 * Returns the permanent download URL.
 * If Firebase Storage is unavailable (e.g. project bucket not initialized in console),
 * falls back to the Google Cloud Firestore permanent storage backend.
 */
export async function uploadProductImageToStorage(
  file: File,
  adminToken?: string | null,
  onProgress?: ProgressCallback
): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `products/${Date.now()}_${cleanName}`;
  const storageRef = ref(storage, path);

  try {
    if (onProgress) onProgress(15);

    const downloadUrl = await new Promise<string>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type || 'image/jpeg',
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0 && onProgress) {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(Math.min(95, Math.max(15, percent)));
          }
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });

    return downloadUrl;
  } catch (storageError: any) {
    console.warn(
      'Firebase Storage direct upload notice:',
      storageError?.message || storageError,
      '-> utilizing Firestore cloud storage persistence'
    );

    if (onProgress) onProgress(50);

    // Fallback: save to Firestore uploadedImages collection on Google Cloud
    const base64Data = await compressImageIfNeeded(file);
    if (onProgress) onProgress(75);

    const token =
      adminToken ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('dm_admin_token') : null);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ image: base64Data, filename: file.name }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed: ${storageError?.message || 'Storage error'}`);
    }

    const data = await res.json();
    if (onProgress) onProgress(100);
    return data.url;
  }
}
