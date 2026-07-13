# Blog / Article Flow Fix Plan

Plan derived from [`BLOG_FLOW_REVIEW.md`](./BLOG_FLOW_REVIEW.md). Exploration confirmed **all four critical issues and essentially every medium/low finding are still open** — nothing has been partially fixed.

---

## Context

### Architecture today

There are two parallel systems sharing the same editor and renderer:

| Track | Write | Model | Public URLs |
|-------|-------|-------|-------------|
| Founder | Admin only (`/admin/articles`) | `Article` | `/articles`, `/articles/[id]` |
| Student | OTP writer → admin review | `StudentArticle` | `/student-articles`, `/student-articles/[id]`, `/my-articles` |

```
Write path:
  /admin/articles          → POST /api/article
  /publish-article + OTP   → POST /api/student-article
  RichTextEditor           → POST /api/upload-image  (UNAUTHENTICATED)

Public read (all client fetch today):
  Article          → /articles cards + /articles/ObjectId
  StudentArticle   → /student-articles cards + /student-articles/ObjectId
```

**Already solid (leave alone):** writer OTP (hashed codes, rate limits, session refresh, enumeration-safe responses), write-time sanitization, image paste/drop/resize/align in TipTap, admin review gate for student posts.

---

## Goals

1. **Security first** — stop open blob uploads.
2. **Publication-grade SEO** — crawlers and social shares see real article title/description/OG.
3. **Writers never lose work** — draft backup at minimum; server drafts as follow-up.
4. **Fast lists + smooth editor** — no 100KB bodies for cards; no full-page re-render per keystroke.
5. **Medium-ish authoring** — headings, links, quote, divider; opinionated typography; optional bubble menu later.
6. **One reader path** — shared component, shared helpers, one sanitize strategy, lazy images.

---

## Design decisions

### 1. SEO: Server Components + `generateMetadata` (not client fetch)

Convert both detail routes to **async Server Components** that query MongoDB in-process (reuse models via `connectDB`), export `generateMetadata`, and render HTML on the server.

- Keep client islands only where needed: reading progress bar, Navbar/Footer (already client).
- List pages can stay client-fetched short-term, but should consume slim list payloads; optional later upgrade to RSC + pagination.

### 2. Slugs with ObjectId fallback (no broken links)

Add unique `slug` on both models. Generate on create:

```
slugify(title) + "-" + last 6 chars of ObjectId
// e.g. "how-i-found-my-voice-a1b2c3"
```

- Public routes: keep folder names but resolve param as **slug OR ObjectId**.
- Prefer canonical slug URLs in links, sitemap, and `alternates.canonical`.
- Old `/articles/<objectId>` links continue to work (lookup by `_id` when param is a valid ObjectId).

### 3. Reading time stored at write time

Add `readingTimeMinutes: number` (and optionally `wordCount`) computed when content is saved/updated. List APIs use `.select('-content')` and return `readingTimeMinutes`. No client HTML stripping.

### 4. Drafts: localStorage first, server drafts later

| Phase | Approach |
|-------|----------|
| P1 | Debounced `localStorage` draft keyed by writer id/email + `beforeunload` while dirty |
| P4 | `DRAFT` status + `PUT` autosave API (optional roadmap) |

LocalStorage is enough to stop catastrophic loss without schema/API surface growth.

### 5. Sanitize once on write; defensive once on read (server)

- **Keep write-time sanitize** as source of truth.
- **Server detail pages:** sanitize once when preparing HTML for `dangerouslySetInnerHTML` (or trust stored HTML after library swap — still one defensive pass is fine).
- **Drop client import of `sanitize.ts`** on public pages so the regex engine is not shipped to the browser.
- **List endpoints:** stop sanitizing content (they stop returning it).
- **Library swap** (`sanitize-html` or `isomorphic-dompurify`) in P3 — keep current allowlists as config so behavior stays equivalent.

### 6. Upload auth: writer session OR admin + rate limit

Mirror article POST rules:

```ts
const writer = await getOrRefreshWriterSession(req);
const admin = writer ? null : await getAdminFromRequest(req);
if (!writer && !admin) → 401
```

Plus `checkRateLimit` per writer/admin id and IP (reuse the existing in-memory `checkRateLimit` from `lib/rate-limit.ts`; note the OTP flow uses Mongo-backed counting via `WriterOtpChallenge`, not this helper — in-memory is fine here since auth is the primary gate).

### 7. Editor direction: structural tools over decorative

Toolbar becomes: **undo/redo · H2/H3 · bold/italic · link · lists · blockquote · HR · image · align**. Remove font-size and color pickers (align editor body to published `18px` prose). Bubble/Floating menus in P3.

### 8. Caching

Published articles are effectively immutable until re-review. After RSC migration:

- `export const revalidate = 3600` (or similar) on detail pages, **or**
- `revalidateTag('article-{id}')` / `student-article-{id}` from admin publish/reject/delete.

Start with ISR `revalidate` + on-demand tag invalidation on admin `PATCH`/`DELETE`/`POST`.

---

## Implementation phases (ship as stacked PRs)

### PR 1 — Security & payload (critical, ~half day)

**No UX redesign — pure backend correctness.**

| Change | Files |
|--------|-------|
| Auth-gate image upload (writer session **or** admin) + rate limit | `src/app/api/upload-image/route.ts` |
| List queries exclude `content`; return `readingTimeMinutes` | `src/app/api/article/route.ts`, `src/app/api/student-article/route.ts` |
| Compute & store `readingTimeMinutes` on create/update | `Article.ts`, `StudentArticle.ts`, both POST handlers |
| Shared `getReadingTimeFromHtml` / plain-text helpers | new `src/lib/article-utils.ts` |
| List UIs use `readingTimeMinutes` | `articles/page.tsx`, `student-articles/page.tsx` |
| Stamp `loading="lazy" decoding="async"` on `<img>` in sanitizer | `src/lib/sanitize.ts` |
| Parallelize admin list counts with `Promise.all` | `student-article/route.ts` GET |
| Fix mongoose model registration (`models.X \|\| model(...)`) | both model files |
| Indexes: StudentArticle `{ reviewStatus, createdAt }`, `{ writer, createdAt }`, `{ submitterEmail }`; Article `{ createdAt }` / `{ slug }` when added. Note: the published-list filter is an `$or` with a legacy branch (`reviewStatus $exists:false, isPublished:true` in `student-article-status.ts`) that the compound index won't cover — run a one-off backfill setting `reviewStatus` on legacy docs so the `$or` can be dropped | both models |

**Success criteria**

- Unauthenticated `POST /api/upload-image` → 401.
- List JSON payload has no `content` field; cards still show correct min-read.
- Existing published content still loads (backfill reading time on read if missing: `?? compute(...)` once).

---

### PR 2 — Editor UX + draft safety (high writer impact, ~1 day)

| Change | Files |
|--------|-------|
| Toolbar: H2/H3, blockquote, HR, text link, undo/redo | `RichTextEditor.tsx` |
| Remove font-size + color UI and extensions if unused | same; drop deps later if clean |
| Debounce `onChange` HTML extraction (~400–500ms); keep live content only inside TipTap | `RichTextEditor.tsx` |
| Replace `editorRevision` + full-doc `hasImageNode` walk with `useEditorState` / selection attrs | same |
| Real word/char counts via `@tiptap/extension-character-count` | same + package.json |
| `next/dynamic` import of editor (`ssr: false` — valid only while both consumers stay **client components**; Next 15 rejects `ssr: false` inside Server Components — do not move this import during PR 3 RSC work) | `publish-article/page.tsx`, `admin/articles/page.tsx` |
| localStorage draft restore + clear on successful submit; `beforeunload` when dirty | `publish-article/page.tsx` (admin optional same helper) |
| Live counters against `MAX_LENGTHS`; scroll error into view on submit fail | publish + admin article forms |
| Fix image-only validation message | publish-article |

**Draft key sketch**

```ts
// key: aspire:article-draft:writer:{writerId}
//      (fallback key "aspire:article-draft:anon" before email verification —
//       writers can start typing before verifying; migrate to the writer key on verify)
// value: { title, description, writerName, content, savedAt }
```

**Success criteria**

- Refresh mid-write restores draft; successful submit clears it.
- Typing long posts does not re-render hero/OTP sections every key (debounce verified).
- Writers can add H2, blockquote, HR, and hyperlinks without markdown knowledge.

---

### PR 3 — Reader SEO + shared UI (biggest business impact, ~1–2 days)

| Change | Files |
|--------|-------|
| Server Components for detail pages + `generateMetadata` (title, description, openGraph, twitter) | `articles/[id]/page.tsx`, `student-articles/[id]/page.tsx` |
| Shared `<ArticleReader>` + progress bar via ref/style (no React state per scroll) | new `src/components/ArticleReader.tsx`, `ReadingProgress.tsx` |
| Extract `formatDate` / author label helpers into `article-utils` | list + detail + my-articles |
| Add `slug` field; generate on create; dual lookup slug/ObjectId | models + create handlers + link sites |
| Dynamic sitemap entries for published articles | `src/app/sitemap.ts` (async DB) |
| Canonical absolute URLs via `SITE_URL` | `lib/site.ts` already exists |
| Drop client re-sanitize; single server sanitize before HTML inject | detail pages |
| my-articles “View live” → `/student-articles/{slug\|id}` | `my-articles/page.tsx` |
| ISR / `revalidateTag` on publish & delete | student-article `[id]` PATCH/DELETE, article POST/DELETE |

**Metadata shape**

```ts
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params; // Next 15: params is a Promise
  const article = await getPublishedArticle(id);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.description.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: `${SITE_URL}/student-articles/${article.slug}`,
      // first content image if present, else site default
    },
  };
}
```

**Success criteria**

- View-source / disable-JS shows full article HTML and correct `<title>`.
- WhatsApp/LinkedIn debugger shows article title + description.
- Sitemap includes individual article URLs.
- Old ObjectId URLs still resolve.

---

### PR 4 — Medium polish & data-layer product (roadmap, multi-day)

Prioritize as capacity allows; each item is independently shippable:

1. **TipTap `BubbleMenu` + `FloatingMenu`** — selection format bar + empty-line insert menu; slim top toolbar.
2. **Replace `window.prompt`** — small controlled dialogs for image URL / alt text / link href.
3. **Swap regex sanitizer** for `sanitize-html` (Node) with existing allowlists; keep same public API `sanitizeRichTextHtml`.
4. **Server drafts** — `DRAFT` status, debounced `PUT /api/student-article/draft`, resume from `/publish-article?draft=…`.
5. **Author workflow** — withdraw pending; edit pending (re-queue); `rejectionReason` field set by admin, shown on `/my-articles`.
6. **Upload pipeline** — client canvas resize before upload; server sharp → WebP; surface 4.5MB limit in UI.
7. **List pages as RSC** (optional) for further SEO on listing meta.

---

### PR 5 — Cover image (thumbnail) + remove inline images (NEW, decided 2026-07-09, not yet implemented)

**Decision:** each article gets one dedicated **cover image**; writers can no longer insert images inside the article body. Rationale: student articles are essay-shaped (inline images in amateur essays hurt more than help), a cover field fixes the text-only cards and gives `generateMetadata` a real `og:image` without scraping content HTML, and it deletes the most complex/fragile half of the editor (custom image node, resize/align/float/move controls, upload overlay).

| Change | Files |
|--------|-------|
| Add `coverImage: string \| null` (blob URL) to both models | `Article.ts`, `StudentArticle.ts` |
| Cover upload field on publish + admin forms (single image; reuse `/api/upload-image` + existing `client-image-resize`) | `publish-article/page.tsx`, `admin/articles/page.tsx` |
| Accept + validate `coverImage` in create/draft handlers (must be a URL from our blob host or empty) | `api/article` POST, `api/student-article` POST, draft route |
| Remove inline-image insertion from the editor: `ArticleImage` extension, image toolbar buttons, image bubble-menu controls, paste/drop image handlers, upload overlay | `RichTextEditor.tsx` (keep behind an `allowInlineImages` prop only if the founder track still wants them — default off) |
| Optionally reject `<img>` in NEW student submission content server-side | `api/student-article` POST |
| Render cover: below title in `ArticleReader`, thumbnail on list cards, `og:image` = `coverImage ?? site default` | `ArticleReader.tsx`, both list pages, both `generateMetadata` |
| Include `coverImage` in list projections and draft payload/localStorage value | `article-queries.ts`, `useArticleDraft.ts`, draft route |

**Back-compat rules (do not break old posts):**

- The sanitizer must **keep allowing `<img>` on read** — already-published articles with inline images continue to render (with `loading="lazy"`).
- Optional one-off backfill: set `coverImage` from `extractFirstImageSrc(content)` for existing published articles so old posts get card thumbnails too.
- Cover is **optional**; cards without one keep the current text-only layout (no broken-image placeholders).

**Success criteria**

- New submissions can attach a cover; it shows on card, article header, and social-share preview.
- Editor exposes no way to insert body images (toolbar, paste, drag-drop all inert for images on the student track).
- An old published article containing inline images still renders identically.

---

## Shared utilities to introduce early

| File | Responsibility |
|------|----------------|
| `src/lib/article-utils.ts` | `formatArticleDate`, `computeReadingTimeMinutes`, `slugify`, `buildArticleSlug`, `extractPlainText`, `extractFirstImageSrc` |
| `src/lib/article-queries.ts` | `getArticleByParam`, `getStudentArticleByParam`, list projections — used by RSC pages + sitemap + APIs |
| `src/components/ArticleReader.tsx` | Unified prose classes + header meta + content HTML |
| `src/components/ReadingProgress.tsx` | Client island, ref-based width |
| `src/hooks/useArticleDraft.ts` | localStorage draft + beforeunload (publish + optionally admin) |

Unified published prose classes live in **one** place so editor preview (later) and reader never drift again.

---

## Suggested execution order

```
PR1 Security + list payload + indexes
  ├─→ PR2 Editor + local drafts
  │     └─→ PR4 Bubble menus / dialogs
  └─→ PR3 RSC SEO + ArticleReader + slugs + sitemap
        ├─→ PR4 sanitize-html
        └─→ PR4 server drafts + rejection UX

PR1 also unblocks:
  └─→ PR4 image pipeline

PR5 Cover image + remove inline images
  (depends on: PR1 upload auth, PR3 ArticleReader/metadata; supersedes the
   image-polish parts of PR2/PR4 — image bubble-menu controls, image dialogs,
   and most of the body-image upload pipeline become deletions instead)
```

- **P1 unblocks** safe production traffic and makes list performance real.
- **P2 and P3 can largely parallelize** after P1.
- Prefer **slug field in P3** with reading-time in P1 to keep P1 small and security-focused.

---

## Testing / verification plan

| Area | How |
|------|-----|
| Upload auth | curl without cookie → 401; with writer session / admin → 200 |
| List payload | Network tab: list responses lack `content`; size drop |
| Drafts | Write 500 words → refresh → restore; submit → storage cleared |
| SEO | `curl` article URL HTML contains title + body; metadata tags present |
| Sitemap | `/sitemap.xml` lists article URLs |
| ObjectId back-compat | Hit old id URL after slug migration |
| Editor | Toolbar inserts H2/link/quote/hr; no font-size controls |
| Sanitizer | Existing XSS cases still blocked (`script`, `onerror`, `javascript:` href) |
| Cover image (PR 5) | Submit with cover → card thumbnail + article header + `og:image`; submit without → clean text-only card; old post with inline images still renders |
| Build | `npm run build` clean; lint on touched files |

No automated test suite today — manual + curl is the bar unless we add a few unit tests for `slugify` / `computeReadingTimeMinutes` / sanitizer allowlist (recommended cheap wins in P1).

---

## Out of scope

- Redesigning the publish-article marketing hero / OTP UX beyond draft + validation.
- Merging founder and student models into one collection.
- Comments, reactions, or multi-author collaboration.
- Migrating off TipTap or MongoDB.
- Full CMS admin redesign.

---

## Risk notes

| Risk | Mitigation |
|------|------------|
| RSC pages need server DB in edge/serverless | Keep `runtime = 'nodejs'`; use existing `connectDB` |
| Navbar is client-only | Import as client child of server page (supported) |
| In-memory rate limit (`lib/rate-limit.ts`) resets per serverless instance | Best-effort only — auth on the upload route is the real gate; OTP limiting is already Mongo-backed and unaffected. Move uploads to Mongo/Redis counting only if abuse is observed |
| Slug collisions | Suffix with short id; unique index |
| Existing articles without readingTime/slug | Lazy compute/backfill on first read or one-off script |
| Removing color/font-size may leave legacy inline styles in old posts | Sanitizer still allows them; new posts won't create them; optional strip later |

---

## Recommended first implementation slice

Start with **PR 1 + PR 2 toolbar/draft pieces**, then **PR 3 SEO**. That sequence closes every critical item from the review and the most painful writer UX gaps within a few focused PRs.

### Mapping to review priorities

| Review item | Phase |
|-------------|-------|
| Auth-gate `/api/upload-image` | PR 1 |
| `.select('-content')` + reading time | PR 1 |
| Toolbar H2/H3, quote, divider, link, undo/redo; remove font-size/color | PR 2 |
| localStorage draft + `beforeunload` | PR 2 |
| `loading="lazy"` on images; drop client re-sanitize | PR 1 + PR 3 |
| Debounce `onChange` / remove `editorRevision` thrash | PR 2 |
| Server components + `generateMetadata` + slugs + sitemap | PR 3 |
| Shared `<ArticleReader>` + unified typography | PR 3 |
| BubbleMenu / FloatingMenu; replace `window.prompt` | PR 4 |
| Replace regex sanitizer | PR 4 |
| Server drafts; edit/withdraw; rejection feedback; WebP; ISR | PR 4 |
| Cover image (thumbnail) + remove inline body images | PR 5 |
