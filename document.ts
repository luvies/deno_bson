import { extractCString } from "./cstring.ts";
import type { BsonStaticValue, BsonValue } from "./raw_types/mod.ts";
import {
  BsonBinary,
  BsonBoolean,
  BsonDate,
  BsonDouble,
  BsonInt32,
  BsonInt64,
  BsonNull,
  BsonRegex,
  BsonString,
} from "./raw_types/mod.ts";
import type {
  BsonStaticType,
  BsonType,
  ParseOptions,
  RawTypes,
} from "./types.ts";
import { ensureLength } from "./utils.ts";

export type BsonElement = BsonDocument | BsonArray | BsonValue;

export type BsonValueType =
  | RawTypes<BsonStaticValue>
  | DocumentType
  | ArrayType;

interface DocumentType {
  [key: string]: BsonValueType;
}

interface ArrayType extends Array<BsonValueType> {}

type ReferenceContainer = Map<string, BsonElement>;

export class BsonDocument implements BsonType<DocumentType> {
  public static readonly marker = 0x03;

  private static readonly endMarker = 0x00;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    options: ParseOptions,
  ): BsonDocument {
    const [byteLength, byteLengthOffset] = BsonDocument._documentLength(
      buf,
      byteOffset,
      options,
    );

    return new BsonDocument(
      new Map(
        BsonDocument._scanElements(
          buf,
          byteOffset + byteLengthOffset,
          options,
        ),
      ),
      byteLength,
    );
  }

  public static _documentLength(
    buf: Uint8Array,
    byteOffset: number,
    options: ParseOptions,
  ): [byteLength: number, byteLengthOffset: number] {
    // Extract the byte length of the document.
    const byteLengthWrapper = BsonInt32.parse(buf, byteOffset, options);
    const byteLength = byteLengthWrapper.getNumber();
    ensureLength(buf, byteOffset, byteLength);

    return [byteLength, byteLengthWrapper.byteLength];
  }

  public static *_scanElements(
    buf: Uint8Array,
    byteOffset: number,
    options: ParseOptions,
  ): IterableIterator<[string, BsonElement]> {
    let i = byteOffset;
    while (buf[i] !== BsonDocument.endMarker) {
      const marker = buf[i];

      // Move to the start of the name and extract.
      i++;
      const [name, nameByteLength] = extractCString(buf, i);

      // Move to start of element and extract.
      i += nameByteLength;
      const ElementClass = parseMap.get(marker);

      if (!ElementClass) {
        throw new Error(
          `Element with type ${marker.toString(16)} is not valid`,
        );
      }

      const element = ElementClass.parse(buf, i, options);

      // Yield the current element.
      yield [name, element];

      // Move to next element.
      i += element.byteLength;
    }
  }

  protected constructor(
    protected _reference: ReferenceContainer,
    public byteLength: number,
  ) {}

  public entries(): IterableIterator<[string, BsonElement]> {
    return this._reference.entries();
  }

  public get(name: string): BsonElement | undefined {
    return this._reference.get(name);
  }

  public deserialize(): DocumentType {
    const obj: DocumentType = {};

    for (const [name, element] of this.entries()) {
      obj[name] = element.deserialize();
    }

    return obj;
  }
}

export class BsonArray implements BsonType<ArrayType> {
  public static readonly marker = 0x04;

  public static parse(
    buf: Uint8Array,
    byteOffset: number,
    options: ParseOptions,
  ): BsonArray {
    const [byteLength, byteLengthOffset] = BsonDocument._documentLength(
      buf,
      byteOffset,
      options,
    );

    const ref: Array<BsonElement> = [];

    for (
      const [name, element] of BsonDocument._scanElements(
        buf,
        byteOffset + byteLengthOffset,
        options,
      )
    ) {
      if (String(ref.length) !== name) {
        throw new Error(
          `Array starting at ${byteOffset} has invalid index names`,
        );
      }

      ref.push(element);
    }

    return new BsonArray(ref, byteLength);
  }

  public get array(): Array<BsonElement> {
    return this._reference;
  }

  private constructor(
    private readonly _reference: Array<BsonElement>,
    public readonly byteLength: number,
  ) {}

  public deserialize(): ArrayType {
    return this._reference.map((e) => e.deserialize());
  }
}

type BsonStaticElement =
  | BsonStaticType<BsonDocument, DocumentType>
  | BsonStaticType<BsonArray, ArrayType>
  | BsonStaticValue;

const parseMap = new Map<number, BsonStaticElement>([
  [BsonBinary.marker, BsonBinary],
  [BsonBoolean.marker, BsonBoolean],
  [BsonDate.marker, BsonDate],
  [BsonDouble.marker, BsonDouble],
  [BsonInt32.marker, BsonInt32],
  [BsonInt64.marker, BsonInt64],
  [BsonNull.marker, BsonNull],
  [BsonRegex.marker, BsonRegex],
  [BsonString.marker, BsonString],

  [BsonDocument.marker, BsonDocument],
  [BsonArray.marker, BsonArray],
]);
