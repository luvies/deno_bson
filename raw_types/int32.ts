import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";
import { ensureLength } from "../utils.ts";

const BYTE_LENGTH = 4;

export type BsonInt32Static = BsonStaticType<BsonInt32, number>;

export class BsonInt32 implements BsonType<number> {
  public static readonly marker = 0x10;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    _options: ParseOptions,
  ): BsonInt32 {
    ensureLength(buf, byteOffset, BYTE_LENGTH);

    return new BsonInt32(buf.buffer, byteOffset);
  }

  public readonly byteLength = BYTE_LENGTH;

  private constructor(
    private readonly _buf: ArrayBuffer,
    private readonly _byteOffset: number,
  ) {}

  public getNumber(): number {
    const view = new Uint8Array(this._buf, this._byteOffset, BYTE_LENGTH)
      .slice();
    const buf = new Int32Array(view.buffer);
    return buf[0];
  }

  public deserialize(): number {
    return this.getNumber();
  }
}
