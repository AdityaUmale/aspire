import assert from "node:assert/strict";
import test from "node:test";
import { waitForPromiseOrTimeout } from "./promise-timeout.ts";

test("reports settled when the pending work completes", async () => {
  const result = await waitForPromiseOrTimeout(Promise.resolve(), 20);

  assert.equal(result, "settled");
});

test("reports timed_out when the pending work never completes", async () => {
  const neverSettles = new Promise<void>(() => {});
  const result = await waitForPromiseOrTimeout(neverSettles, 5);

  assert.equal(result, "timed_out");
});
