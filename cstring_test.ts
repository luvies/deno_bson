import { assertEquals } from "https://nghbeaead2s4n5znqogrk627qxhfdfterapmd3orofnyqlfusora.arweave.net/aY4SAIAepcb3LYONFXtfhc5RlmSIHsHt0XFbiCy0k6I/testing/asserts.ts";
import { cstringByteLength, extractCString, toCString } from "./cstring.ts";
import { test } from "./test_deps.ts";

test({
  name: "string to c-string",
  fn() {
    assertEquals(
      toCString("hello world"),
      new Uint8Array(
        [
          0x68,
          0x65,
          0x6C,
          0x6C,
          0x6F,
          0x20,
          0x77,
          0x6F,
          0x72,
          0x6C,
          0x64,
          0x00,
        ],
      ),
    );
  },
});

test({
  name: "c-string to string",
  fn() {
    const bytes = new Uint8Array(
      [
        0x68,
        0x65,
        0x6C,
        0x6C,
        0x6F,
        0x20,
        0x77,
        0x6F,
        0x72,
        0x6C,
        0x64,
        0x00,
      ],
    );

    assertEquals(cstringByteLength(bytes), 12);
    assertEquals(
      extractCString(bytes),
      ["hello world", 12],
    );

    const paddedBytes = new Uint8Array(
      [
        0x00,
        0x00,
        0x00,
        0x00,
        0x68,
        0x65,
        0x6C,
        0x6C,
        0x6F,
        0x20,
        0x77,
        0x6F,
        0x72,
        0x6C,
        0x64,
        0x00,
      ],
    );

    assertEquals(cstringByteLength(paddedBytes, 4), 12);
    assertEquals(
      extractCString(paddedBytes, 4),
      ["hello world", 12],
    );
  },
});
