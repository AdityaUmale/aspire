export type PromiseWaitResult = "settled" | "timed_out";

export const waitForPromiseOrTimeout = async (
  promise: Promise<unknown>,
  timeoutMs: number
): Promise<PromiseWaitResult> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise.then(() => "settled" as const),
      new Promise<"timed_out">((resolve) => {
        timeoutId = setTimeout(() => resolve("timed_out"), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};
