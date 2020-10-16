import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";
import { BsonInt64 } from "./int64.ts";

export type BsonDateStatic = BsonStaticType<BsonDate, Date>;

export class BsonDate implements BsonType<Date> {
  public static readonly marker = 0x09;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    options: ParseOptions,
  ): BsonDate {
    const wrapper = BsonInt64.parse(buf, byteOffset, options);

    return new BsonDate(wrapper);
  }

  public get byteLength(): number {
    return this._wrapper.byteLength;
  }

  private constructor(
    private readonly _wrapper: BsonInt64,
  ) {}

  public getDate(): Date {
    const unix = Number(this.getUnixTime());

    return new Date(unix);
  }

  public getUnixTime(): bigint {
    return this._wrapper.getBigInt();
  }

  public deserialize(): Date {
    return this.getDate();
  }
}
