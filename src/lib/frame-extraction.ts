const MAX_FRAME_WIDTH = 1092;
const MAX_FRAME_HEIGHT = 1092;
const THUMBNAIL_WIDTH = 200;
const THUMBNAIL_HEIGHT = 150;
const JPEG_QUALITY = 0.85;
const THUMBNAIL_QUALITY = 0.6;

export async function extractFrameAtTime(
  video: HTMLVideoElement,
  timestamp: number
): Promise<{ imageBase64: string; thumbnailBase64: string }> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Frame extraction timed out")), 5000);

    video.currentTime = timestamp;

    const onSeeked = () => {
      clearTimeout(timeout);
      video.removeEventListener("seeked", onSeeked);

      try {
        const imageBase64 = captureFrame(video, MAX_FRAME_WIDTH, MAX_FRAME_HEIGHT, JPEG_QUALITY);
        const thumbnailBase64 = captureFrame(video, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, THUMBNAIL_QUALITY);
        resolve({ imageBase64, thumbnailBase64 });
      } catch (err) {
        reject(err);
      }
    };

    video.addEventListener("seeked", onSeeked);
  });
}

function captureFrame(
  video: HTMLVideoElement,
  maxWidth: number,
  maxHeight: number,
  quality: number
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  let width = video.videoWidth;
  let height = video.videoHeight;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(video, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return dataUrl.replace(/^data:image\/jpeg;base64,/, "");
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Could not load video metadata"));
    };

    video.src = URL.createObjectURL(file);
  });
}
