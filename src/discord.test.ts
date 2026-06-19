import { test } from "node:test";
import assert from "node:assert/strict";
import { splitMessage } from "./discord";

test("returns a single chunk when under the limit", () => {
  assert.deepEqual(splitMessage("hello"), ["hello"]);
});

test("splits text that exceeds the limit", () => {
  const text = "a".repeat(2500);
  const chunks = splitMessage(text);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((c) => c.length <= 2000));
  assert.equal(chunks.join(""), text);
});

test("prefers breaking on newlines", () => {
  const text = "x".repeat(1990) + "\n" + "y".repeat(50);
  const chunks = splitMessage(text);
  assert.equal(chunks[0], "x".repeat(1990));
  assert.equal(chunks[1], "y".repeat(50));
});
