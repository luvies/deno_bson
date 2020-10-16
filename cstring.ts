import { decoder, encoder } from "./encoding.ts";

export function toCString(str: string): Uint8Array {
  const conv = encoder.encode(str);

  // Move to new buffer that is 1 bigger.
  // Unfortunately, there is not a decent way of getting the full byte
  // length of a string without the encoder, so we have to resort to this copy.
  const buf = new Uint8Array(conv.length + 1);
  buf.set(conv);

  return buf;
}

export function cstringByteLength(
  buf: Uint8Array,
  byteOffset: number = 0,
): number {
  // Find the first terminal 0
  let terminalIndex: number | undefined;

  for (let i = byteOffset; i < buf.length; i++) {
    if (buf[i] === 0x00) {
      // We have found the terminal.
      terminalIndex = i;
      break;
    }
  }

  if (typeof terminalIndex === "undefined") {
    throw new Error("CString is not null-terminated");
  }

  // Converts from the 0-based index to the length.
  return terminalIndex - byteOffset + 1;
}

export function extractCString(
  buf: Uint8Array,
  byteOffset: number = 0,
): [value: string, byteLength: number] {
  const byteLength = cstringByteLength(buf, byteOffset);

  // The byte length includes the terminal, which we don't want during decoding.
  const view = buf.subarray(byteOffset, byteOffset + byteLength - 1);

  return [decoder.decode(view), byteLength];
}
