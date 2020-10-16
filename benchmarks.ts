import { BsonDocument } from "./document.ts";
import { complexDocument } from "./test/complex_document.ts";
import { bench, runBenchmarks } from "./test_deps.ts";

bench({
  name: "parse",
  runs: 1_000_000,
  func(b) {
    b.start();
    BsonDocument.parse(complexDocument, 0, {});
    b.stop();
  },
});

bench({
  name: "deserialise",
  runs: 1_000_000,
  func(b) {
    b.start();
    BsonDocument.parse(complexDocument, 0, {}).deserialize();
    b.stop();
  },
});

const json = `
{
  "dbl": 154,
  "str": "string",
  "doc": { "this": "is", "a": "nested", "doc": "ument" },
  "buf": [4, 3, 2, 1]
}
`;

bench({
  name: "json parse",
  runs: 1_000_000,
  func(b) {
    b.start();
    JSON.parse(json);
    b.stop();
  },
});

runBenchmarks();
