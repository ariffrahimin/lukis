import { parseGIF, decompressFrames } from 'gifuct-js';

export interface DecodedGifFrame {
  dataUrl: string;
  delay: number; // ms
}

export interface DecodedGif {
  frames: DecodedGifFrame[];
  totalDuration: number; // ms
}

/**
 * Decode an animated GIF from a URL into individual frame data URLs.
 */
export async function decodeGif(url: string): Promise<DecodedGif> {
  // Only allow same-origin, data:, and blob: URLs to prevent SSRF
  if (!url.startsWith('data:') && !url.startsWith('blob:')) {
    const parsed = new URL(url, window.location.origin);
    if (parsed.origin !== window.location.origin) {
      throw new Error('Cannot decode GIF from cross-origin URL');
    }
  }

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const gif = parseGIF(buffer);
  const rawFrames = decompressFrames(gif, true);

  if (rawFrames.length === 0) {
    return { frames: [], totalDuration: 0 };
  }

  // Build a full-size canvas to composite frames (GIF frames can be partial patches)
  const width = gif.lsd.width;
  const height = gif.lsd.height;
  const compositeCanvas = document.createElement('canvas');
  compositeCanvas.width = width;
  compositeCanvas.height = height;
  const compositeCtx = compositeCanvas.getContext('2d')!;

  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = width;
  frameCanvas.height = height;
  const frameCtx = frameCanvas.getContext('2d')!;

  const frames: DecodedGifFrame[] = [];
  let totalDuration = 0;

  for (const raw of rawFrames) {
    // Handle disposal from previous frame
    const dims = raw.dims;

    // Create ImageData for this frame's patch
    const patchData = new ImageData(
      new Uint8ClampedArray(raw.patch),
      dims.width,
      dims.height,
    );

    // Draw the patch onto a temp canvas
    frameCtx.clearRect(0, 0, width, height);
    frameCtx.putImageData(patchData, 0, 0);

    // Composite onto the main canvas at the correct position
    compositeCtx.drawImage(frameCanvas, dims.left, dims.top);

    // Capture the composited frame
    const delay = raw.delay <= 0 ? 100 : raw.delay; // default 100ms for 0-delay frames
    frames.push({
      dataUrl: compositeCanvas.toDataURL('image/png'),
      delay,
    });
    totalDuration += delay;

    // Handle disposal method
    if (raw.disposalType === 2) {
      // Restore to background
      compositeCtx.clearRect(dims.left, dims.top, dims.width, dims.height);
    }
    // disposalType 3 (restore to previous) is rare and complex, skip for now
  }

  return { frames, totalDuration };
}

/**
 * Given a decoded GIF and a time offset (ms), return the correct frame index.
 */
export function getFrameAtTime(gif: DecodedGif, timeMs: number): number {
  if (gif.frames.length === 0) return 0;

  // Loop the time within the total duration
  const loopedTime = timeMs % gif.totalDuration;
  let elapsed = 0;

  for (let i = 0; i < gif.frames.length; i++) {
    elapsed += gif.frames[i].delay;
    if (loopedTime < elapsed) return i;
  }

  return gif.frames.length - 1;
}
