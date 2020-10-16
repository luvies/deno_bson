function isBigEndian(): boolean {
  const buf = Uint16Array.from([0x1234]);
  const view = new Uint8Array(buf.buffer);

  return view[0] === 0x12;
}

export const IS_BIG_ENDIAN = isBigEndian();
