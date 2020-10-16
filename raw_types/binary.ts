import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";
import { ensureLength } from "../utils.ts";
import { BsonInt32 } from "./int32.ts";

export enum BsonBinaryType {
  Generic = 0x00,
  Function = 0x01,
  OldBinary = 0x02,
  OldUUID = 0x03,
  UUID = 0x04,
  MD5 = 0x05,
  EncryptedBson = 0x06,
  UserDefined = 0x80,
}

const VALID_TYPES = new Set(Object.values(BsonBinaryType));

function isValidBinaryType(val: unknown): val is BsonBinaryType {
  return VALID_TYPES.has(val as any);
}

export type BsonBinaryStatic = BsonStaticType<BsonBinary, Uint8Array>;

export class BsonBinary implements BsonType<Uint8Array> {
  public static readonly marker = 0x05;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    options: ParseOptions,
  ): BsonBinary {
    const lengthWrapper = BsonInt32.parse(
      buf,
      byteOffset,
      options,
    );

    const bufStart = byteOffset + lengthWrapper.byteLength + 1;
    const length = lengthWrapper.getNumber();
    ensureLength(buf, bufStart, length);

    // Subtype comes the byte before the start of the binary data.
    const subtype = buf[byteOffset + lengthWrapper.byteLength];

    if (!isValidBinaryType(subtype)) {
      throw new Error(
        `Binary element starting at ${byteOffset} has invalid subtype (${subtype})`,
      );
    }

    return new BsonBinary(buf.buffer, bufStart, length, subtype);
  }

  private constructor(
    private readonly _buf: ArrayBuffer,
    private readonly _byteOffset: number,
    public readonly byteLength: number,
    private readonly _subtype: BsonBinaryType,
  ) {}

  public get subtype(): BsonBinaryType {
    return this._subtype;
  }

  public getBuffer(): Uint8Array {
    return new Uint8Array(this._buf, this._byteOffset, this.byteLength);
  }

  public deserialize(): Uint8Array {
    return this.getBuffer();
  }
}
