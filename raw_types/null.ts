import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";

export type BsonNullStatic = BsonStaticType<BsonNull, null>;

export class BsonNull implements BsonType<null> {
  public static readonly marker = 0x0A;

  public static parse(
    _buf: Uint8Array,
    _byteOffset: number,
    _options: ParseOptions,
  ): BsonNull {
    return new BsonNull();
  }

  public readonly byteLength = 0;

  private constructor() {}

  public deserialize(): null {
    return null;
  }
}
