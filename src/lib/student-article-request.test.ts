import assert from "node:assert/strict";
import test from "node:test";
import { isWriterArticleMutation } from "./student-article-request.ts";

test("writer submission intent takes precedence over an admin session", () => {
  assert.equal(isWriterArticleMutation({ action: "submit" }), true);
  assert.equal(isWriterArticleMutation({ action: "resubmit" }), true);
  assert.equal(isWriterArticleMutation({ action: "withdraw" }), true);
  assert.equal(isWriterArticleMutation({ saveOnly: true }), true);
});

test("admin moderation payloads remain admin mutations", () => {
  assert.equal(isWriterArticleMutation({ reviewStatus: "PUBLISHED" }), false);
  assert.equal(isWriterArticleMutation({ reviewStatus: "REJECTED" }), false);
  assert.equal(isWriterArticleMutation({}), false);
});
