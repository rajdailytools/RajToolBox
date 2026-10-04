declare module 'pako' {
  export function inflate(data: Uint8Array | ArrayBuffer, options?: any): Uint8Array;
  export function deflate(data: Uint8Array | ArrayBuffer | string, options?: any): Uint8Array;
}
