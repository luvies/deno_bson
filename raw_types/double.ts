import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";
import { ensureLength } from "../utils.ts";

const BYTE_LENGTH = 8;

export type BsonDoubleStatic = BsonStaticType<BsonDouble, number>;

export class BsonDouble implements BsonType<number> {
  public static readonly marker = 0x01;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    _options: ParseOptions,
  ): BsonDouble {
    ensureLength(buf, byteOffset, BYTE_LENGTH);

    return new BsonDouble(buf.buffer, byteOffset);
  }

  public readonly byteLength = BYTE_LENGTH;

  private constructor(
    private readonly _buf: ArrayBuffer,
    private readonly _byteOffset: number,
  ) {}

  public getNumber(): number {
    const view = new Uint8Array(this._buf, this._byteOffset, BYTE_LENGTH)
      .slice();
    const buf = new Float64Array(view);
    return buf[0];
  }

  public deserialize(): number {
    return this.getNumber();
  }
}
