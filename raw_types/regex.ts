import { cstringByteLength, extractCString } from "../cstring.ts";
import { decoder, encoder } from "../encoding.ts";
import { BsonStaticType, BsonType, ParseOptions } from "../types.ts";

const BSON_OPTIONS = new Set(encoder.encode("ilmsux"));
const REGEXP_OPTIONS = new Set("gimsuy");

export type BsonRegexStatic = BsonStaticType<BsonRegex, RegExp>;

export class BsonRegex implements BsonType<RegExp> {
  public static readonly marker = 0x0B;

  public static parse(
    buf: Uint8Array,
    regexByteOffset: number,
    options: ParseOptions,
  ): BsonRegex {
    // Extract the regex string length.
    const regexByteLength = cstringByteLength(buf, regexByteOffset);

    // Now get the flags string length.
    const flagsByteOffset = regexByteOffset + regexByteLength;
    const flagsByteLength = cstringByteLength(buf, flagsByteOffset);

    // If we haven't disabled enforced spec compliance, then enforce it here.
    if (!options.relaxedRegexFlags) {
      // The index of the null-terminator (i.e. the str length without it).
      const flagTerminalIndex = flagsByteOffset + flagsByteLength - 1;

      // Stores the previous flag to enforce order.
      let prev: number | undefined;

      // Ensure all flags are in order and are allowed.
      for (let i = flagsByteOffset; i < flagTerminalIndex; i++) {
        const flag = buf[i];

        if (typeof prev !== "undefined" && flag < prev) {
          throw new Error(
            `Regex at ${regexByteOffset} does not have flags in order`,
          );
        }

        if (!BSON_OPTIONS.has(flag)) {
          const strFlag = decoder.decode(new Uint8Array(buf, i, 1));
          throw new Error(
            `Regex at ${regexByteOffset} has invalid flag ${strFlag}`,
          );
        }

        prev = flag;
      }
    }

    return new BsonRegex(
      buf.buffer,
      regexByteOffset,
      regexByteLength,
      flagsByteOffset,
      flagsByteLength,
      regexByteLength + flagsByteLength,
    );
  }

  private constructor(
    private readonly _buf: ArrayBuffer,
    private readonly _regexByteOffset: number,
    private readonly _regexByteLength: number,
    private readonly _flagsByteOffset: number,
    private readonly _flagsByteLength: number,
    public readonly byteLength: number,
  ) {}

  public getRegexStr(): string {
    return extractCString(
      new Uint8Array(this._buf, this._regexByteOffset, this._regexByteLength),
    )[0];
  }

  public getFlagsStr(): string {
    return extractCString(
      new Uint8Array(this._buf, this._flagsByteOffset, this._flagsByteLength),
    )[0];
  }

  public getRegex(): RegExp {
    const re = this.getRegexStr();
    const flags = this.getFlagsStr().split("").filter((c) =>
      REGEXP_OPTIONS.has(c)
    ).join("");

    return new RegExp(re, flags);
  }

  public deserialize(): RegExp {
    return this.getRegex();
  }
}
