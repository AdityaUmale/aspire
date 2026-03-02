export const MAX_LENGTHS = {
  title: 160,
  description: 2000,
  content: 100000,
  writerName: 120,
  enquiry: 4000,
  name: 120,
  email: 320,
  phone: 30,
  courseName: 180,
  courseOutlineItem: 220,
};

export const clampPagination = ({
  pageInput,
  limitInput,
  defaultLimit = 10,
  maxLimit = 20,
}: {
  pageInput: string | null;
  limitInput: string | null;
  defaultLimit?: number;
  maxLimit?: number;
}) => {
  const parsedPage = Number(pageInput);
  const parsedLimit = Number(limitInput);

  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const limitCandidate =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.floor(parsedLimit)
      : defaultLimit;
  const limit = Math.min(limitCandidate, maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const isValidLength = (value: unknown, maxLength: number) => {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
};

export const normalizeString = (value: unknown) => {
  return typeof value === "string" ? value.trim() : "";
};
