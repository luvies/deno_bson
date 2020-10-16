export interface SerializeOptions {
  /**
   * Whether to include all flags for a RegExp object in the BSON document.
   *
   * By default, only flags allowed in the spec are kept during serialisation,
   * which can cause the deserialised RegExp objects to behave differently. If
   * this is set to true, then all of the flags in the RegExp object are kept
   * during serialisation, including flags not supported by the spec, which
   * allows a deserialised RegExp to preserve the flags exactly.
   */
  fullRegexFlags?: boolean;
}

export interface ParseOptions {
  /**
   * Prevents the parser from throwing errors if a regex element has flags not
   * supported by the spec.
   * 
   * By default, the parser will throw errors if the given BSON document does
   * not follow the spec precisely. This means that documents serialised with
   * `fullRegexFlags` set to true, which are not exactly spec compliant, will
   * cause errors.
   * If this is set to true, then flags not supported by the spec are ignored,
   * and all flags supported by the RegExp object are used.
   * 
   * The spec also requires the flags be in alphabetical order. If this is true,
   * then this is not checked.
   */
  relaxedRegexFlags?: boolean;
}

export interface BsonType<TDefault> {
  readonly byteLength: number;
  deserialize(): TDefault;
}

export interface BsonStaticType<T extends BsonType<TDefault>, TDefault> {
  readonly marker: number;
  parse(buf: Uint8Array, byteOffset: number, options: ParseOptions): T;
}

export type RawTypes<T> = T extends BsonStaticType<any, infer R> ? R : never;
