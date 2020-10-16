import { BsonDocument } from "./document.ts";
import { complexDocument } from "./test/complex_document.ts";
import { test } from "./test_deps.ts";

test({
  name: "Complex document parsing",
  fn() {
    const buf = complexDocument;

    console.log(BsonDocument.parse(buf, 0, {}).deserialize());
  },
});
