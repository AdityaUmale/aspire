const WRITER_ARTICLE_ACTIONS = new Set([
  "submit",
  "resubmit",
  "withdraw",
]);

type StudentArticleMutationBody = {
  action?: unknown;
  saveOnly?: unknown;
};

export function isWriterArticleMutation(
  body: StudentArticleMutationBody
): boolean {
  return (
    body.saveOnly === true ||
    (typeof body.action === "string" &&
      WRITER_ARTICLE_ACTIONS.has(body.action))
  );
}
