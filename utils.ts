export function ensureLength(
  buf: Uint8Array,
  byteOffset: number,
  byteLength: number,
): void | never {
  if (buf.length < byteOffset + byteLength) {
    throw new Error("Buffer end exceeded");
  }
}
