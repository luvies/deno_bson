const MIN_BUF_SIZE = 2 << 4;

export class ResizableBuffer {
  public get buffer(): Uint8Array {
    if (
      typeof this._arrayCache === "undefined" ||
      // If the length changes, remake the buffer.
      this._arrayCache.length !== this._length
    ) {
      // Provide a view over the buffer with the current length.
      this._arrayCache = this._raw.subarray(0, this._length);
    }

    return this._arrayCache;
  }

  private _raw = new Uint8Array(
    typeof this._length === "undefined" || this._length < MIN_BUF_SIZE
      ? MIN_BUF_SIZE
      : this._length,
  );
  private _arrayCache?: Uint8Array;

  public constructor(
    private _length: number = 0,
  ) {}

  public expandBy(size: number): void {
    if (size <= 0) {
      return;
    }

    this._length += size;
    const spare = this._raw.length - this._length;

    if (spare < 0) {
      // We are expanding the byte view beyond the total buffer length.

      // We increase the allocated buffer size by x2.
      const expanded = new Uint8Array(this._raw.length << 1);
      expanded.set(this.buffer);

      this._raw = expanded;
    }
  }

  public shrinkBy(size: number): void {
    if (size > this._length) {
      throw new Error("Cannot shrink buffer to negative number");
    }

    this._length -= size;
  }
}
