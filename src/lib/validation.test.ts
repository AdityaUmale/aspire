import assert from "node:assert/strict";
import test from "node:test";
import { isValidLength, isValidOptionalLength } from "./validation.ts";

test("required strings must contain text", () => {
  assert.equal(isValidLength("", 20), false);
  assert.equal(isValidLength("   ", 20), false);
  assert.equal(isValidLength("A title", 20), true);
});

test("optional strings may be blank but still respect their maximum length", () => {
  assert.equal(isValidOptionalLength("", 20), true);
  assert.equal(isValidOptionalLength("   ", 20), true);
  assert.equal(isValidOptionalLength("A subtitle", 20), true);
  assert.equal(isValidOptionalLength("x".repeat(21), 20), false);
  assert.equal(isValidOptionalLength(null, 20), false);
});
