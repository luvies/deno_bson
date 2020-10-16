import { decoder } from "../encoding.ts";
import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";
import { BsonInt32 } from "./int32.ts";

export type BsonStringStatic = BsonStaticType<BsonString, string>;

export class BsonString implements BsonType<string> {
  public static readonly marker = 0x02;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    options: ParseOptions,
  ): BsonString {
    const byteLengthWrapper = BsonInt32.parse(buf, byteOffset, options);
    const byteLength = byteLengthWrapper.getNumber();

    return new BsonString(
      buf.buffer,
      byteOffset + byteLengthWrapper.byteLength,
      byteLength - 1,
      byteLength + byteLengthWrapper.byteLength,
    );
  }

  private constructor(
    private readonly _buf: ArrayBuffer,
    private readonly _byteOffset: number,
    private readonly _strLength: number,
    public readonly byteLength: number,
  ) {}

  public getString(): string {
    return decoder.decode(
      new Uint8Array(this._buf, this._byteOffset, this._strLength),
    );
  }

  public deserialize(): string {
    return this.getString();
  }
}
