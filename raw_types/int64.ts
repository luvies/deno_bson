import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";
import { ensureLength } from "../utils.ts";

const BYTE_LENGTH = 8;

export type BsonInt64Static = BsonStaticType<BsonInt64, bigint>;

export class BsonInt64 implements BsonType<bigint> {
  public static readonly marker = 0x12;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    _options: ParseOptions,
  ): BsonInt64 {
    ensureLength(buf, byteOffset, BYTE_LENGTH);

    return new BsonInt64(buf.buffer, byteOffset);
  }

  public readonly byteLength = BYTE_LENGTH;

  private constructor(
    private readonly _buf: ArrayBuffer,
    private readonly _byteOffset: number,
  ) {}

  public getBigInt(): bigint {
    const view = new Uint8Array(this._buf, this._byteOffset, BYTE_LENGTH)
      .slice();
    const buf = new BigInt64Array(view);
    return buf[0];
  }

  public deserialize(): bigint {
    return this.getBigInt();
  }
}
