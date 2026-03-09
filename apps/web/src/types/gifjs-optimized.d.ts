declare module 'gif.js.optimized' {
  export interface GifOptions {
    workers?: number;
    quality?: number;
    workerScript?: string;
    repeat?: number;
    background?: string;
    transparent?: string | number;
    width?: number;
    height?: number;
  }

  export interface AddFrameOptions {
    delay?: number;
    copy?: boolean;
  }

  export default class GIF {
    constructor(options?: GifOptions);
    addFrame(image: CanvasImageSource | CanvasRenderingContext2D, options?: AddFrameOptions): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: 'abort', callback: () => void): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    render(): void;
    abort(): void;
  }
}
