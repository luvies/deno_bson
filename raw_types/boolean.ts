import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";
import { ensureLength } from "../utils.ts";

export type BsonBooleanStatic = BsonStaticType<BsonBoolean, boolean>;

export class BsonBoolean implements BsonType<boolean> {
  public static readonly marker = 0x08;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    _options: ParseOptions,
  ): BsonBoolean {
    ensureLength(buf, byteOffset, 1);

    return new BsonBoolean(buf[byteOffset] === 0x01);
  }

  public readonly byteLength = 1;

  private constructor(
    private readonly _value: boolean,
  ) {}

  public get value(): boolean {
    return this._value;
  }

  public deserialize(): boolean {
    return this.value;
  }
}
