"use client";

import { useCallback, useEffect, useRef } from "react";

export type ArticleDraftPayload = {
  title: string;
  description: string;
  writerName?: string;
  content: string;
  coverImage?: string | null;
  savedAt: number;
};

export const ANON_DRAFT_KEY = "aspire:article-draft:anon";

export const getWriterDraftKey = (writerId: string) =>
  `aspire:article-draft:writer:${writerId}`;

const isBrowser = () => typeof window !== "undefined";

export const readArticleDraft = (
  key: string
): ArticleDraftPayload | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as ArticleDraftPayload;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      description:
        typeof parsed.description === "string" ? parsed.description : "",
      writerName:
        typeof parsed.writerName === "string" ? parsed.writerName : "",
      content: typeof parsed.content === "string" ? parsed.content : "",
      coverImage:
        typeof parsed.coverImage === "string" ? parsed.coverImage : null,
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
};

export const writeArticleDraft = (
  key: string,
  draft: Omit<ArticleDraftPayload, "savedAt">
) => {
  if (!isBrowser()) {
    return;
  }

  const payload: ArticleDraftPayload = {
    ...draft,
    savedAt: Date.now(),
  };

  window.localStorage.setItem(key, JSON.stringify(payload));
};

export const clearArticleDraft = (key: string) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(key);
};

/**
 * Migrate anonymous draft → writer key once the user verifies email.
 * Prefers an existing writer draft if both exist.
 */
export const migrateAnonymousDraftToWriter = (writerId: string) => {
  if (!isBrowser()) {
    return readArticleDraft(getWriterDraftKey(writerId));
  }

  const writerKey = getWriterDraftKey(writerId);
  const writerDraft = readArticleDraft(writerKey);
  const anonDraft = readArticleDraft(ANON_DRAFT_KEY);

  if (writerDraft) {
    if (anonDraft) {
      clearArticleDraft(ANON_DRAFT_KEY);
    }
    return writerDraft;
  }

  if (anonDraft) {
    writeArticleDraft(writerKey, {
      title: anonDraft.title,
      description: anonDraft.description,
      writerName: anonDraft.writerName,
      content: anonDraft.content,
      coverImage: anonDraft.coverImage ?? null,
    });
    clearArticleDraft(ANON_DRAFT_KEY);
    return readArticleDraft(writerKey);
  }

  return null;
};

const isDraftDirty = ({
  title,
  description,
  writerName,
  content,
  coverImage,
}: {
  title: string;
  description: string;
  writerName?: string;
  content: string;
  coverImage?: string | null;
}) =>
  title.trim().length > 0 ||
  description.trim().length > 0 ||
  (writerName?.trim().length ?? 0) > 0 ||
  content.replace(/<[^>]*>/g, "").trim().length > 0 ||
  Boolean(coverImage);

export const useArticleDraft = ({
  writerId,
  title,
  description,
  writerName,
  content,
  coverImage,
  enabled = true,
  debounceMs = 600,
}: {
  writerId?: string | null;
  title: string;
  description: string;
  writerName?: string;
  content: string;
  coverImage?: string | null;
  enabled?: boolean;
  debounceMs?: number;
}) => {
  const draftKey = writerId ? getWriterDraftKey(writerId) : ANON_DRAFT_KEY;
  const isDirty = isDraftDirty({
    title,
    description,
    writerName,
    content,
    coverImage,
  });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !isDirty) {
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      writeArticleDraft(draftKey, {
        title,
        description,
        writerName: writerName ?? "",
        content,
        coverImage: coverImage ?? null,
      });
    }, debounceMs);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [
    content,
    coverImage,
    debounceMs,
    description,
    draftKey,
    enabled,
    isDirty,
    title,
    writerName,
  ]);

  useEffect(() => {
    if (!enabled || !isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, isDirty]);

  const clearDraft = useCallback(() => {
    clearArticleDraft(draftKey);
    if (writerId) {
      clearArticleDraft(ANON_DRAFT_KEY);
    }
  }, [draftKey, writerId]);

  return {
    draftKey,
    isDirty,
    clearDraft,
  };
};
