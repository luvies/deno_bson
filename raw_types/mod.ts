import { BsonBinary, BsonBinaryStatic, BsonBinaryType } from "./binary.ts";
import { BsonBoolean, BsonBooleanStatic } from "./boolean.ts";
import { BsonDate, BsonDateStatic } from "./date.ts";
import { BsonDouble, BsonDoubleStatic } from "./double.ts";
import { BsonInt32, BsonInt32Static } from "./int32.ts";
import { BsonInt64, BsonInt64Static } from "./int64.ts";
import { BsonNull, BsonNullStatic } from "./null.ts";
import { BsonRegex, BsonRegexStatic } from "./regex.ts";
import { BsonString, BsonStringStatic } from "./string.ts";

export {
  BsonBinary,
  BsonBinaryType,
  BsonBoolean,
  BsonDate,
  BsonDouble,
  BsonInt32,
  BsonInt64,
  BsonNull,
  BsonRegex,
  BsonString,
};

export type BsonValue =
  | BsonBinary
  | BsonBoolean
  | BsonDate
  | BsonDouble
  | BsonInt32
  | BsonInt64
  | BsonNull
  | BsonRegex
  | BsonString;

export type BsonStaticValue =
  | BsonBinaryStatic
  | BsonBooleanStatic
  | BsonDateStatic
  | BsonDoubleStatic
  | BsonInt32Static
  | BsonInt64Static
  | BsonNullStatic
  | BsonRegexStatic
  | BsonStringStatic;
