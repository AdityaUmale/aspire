# Blog / Article Flow Review

Review of the end-to-end blog/article writing experience: the rich text editor, submission flow, data layer, and public rendering. No code was changed as part of this review.

## How it works today (quick map)

There are two parallel systems sharing the same editor and renderer:

- **Founder articles**: admin writes in `/admin/articles` → `Article` model → public at `/articles` and `/articles/[id]`
- **Student articles**: writer verifies email via OTP on `/publish-article` → `StudentArticle` model (status `PENDING`) → admin reviews in `/admin/review-articles` → public at `/student-articles/[id]`, writer tracks status at `/my-articles`

The editor is TipTap 2 (`src/components/RichTextEditor.tsx`), content is stored as sanitized HTML in MongoDB, images go to Vercel Blob via `/api/upload-image`, and rendering is `dangerouslySetInnerHTML` through a custom regex sanitizer (`src/lib/sanitize.ts`).

**What's already good:** the OTP auth is genuinely well built (hashed codes, rate limiting by email and IP, session refresh, enumeration-safe responses in `request-otp/route.ts`), sanitization happens at write time, image drag-drop/paste upload works, and the image controls (resize, align, float-wrap, alt text) are more capable than most homegrown editors.

---

## 🔴 Critical issues

### 1. Zero SEO — the blog is invisible to search engines and social shares

Every article page is a client component (`'use client'` + `fetch` in `useEffect`). This means:

- No `generateMetadata` anywhere — grepped `articles/`, `student-articles/`, `publish-article/`: zero matches. Every article shares the site's default `<title>` and description; sharing a link on WhatsApp/LinkedIn/Twitter shows no article title, no description, no image.
- Search engines get an empty shell with skeletons; content only exists after client JS runs and fetches.
- `src/app/sitemap.ts` lists only static routes — individual articles are never in the sitemap.
- URLs are raw ObjectIds (`/student-articles/665f9c...`) instead of slugs.

For a publication this is the single biggest problem. The fix is converting `articles/[id]/page.tsx` and `student-articles/[id]/page.tsx` to **server components** that fetch from MongoDB directly, export `generateMetadata` (title, description, OG image), use slugs, and add published articles to the sitemap. This also eliminates the fetch waterfall and skeleton flash entirely.

### 2. No draft persistence — one refresh loses the entire article

There is no autosave, no `localStorage` backup, no `beforeunload` warning (grep confirmed: nothing in `publish-article/` or the editor). A student who writes 2,000 words and accidentally refreshes, closes the tab, or hits a network error loses everything. Medium/Substack autosave every few seconds — this is the #1 thing that makes them feel "safe" to write in. Minimum viable fix: debounced save of `{title, description, content}` to `localStorage` keyed per user, restored on mount, plus a `beforeunload` guard while dirty. Proper fix: a `DRAFT` status server-side with a debounced upsert.

### 3. `/api/upload-image` is completely unauthenticated

`src/app/api/upload-image/route.ts:10` has no session or admin check — anyone on the internet can POST 4.5MB files into your Vercel Blob store in a loop (storage/bandwidth cost abuse, plus hosting arbitrary images under your domain). Everything else in the flow is auth-gated; this one was missed. It should require `getOrRefreshWriterSession(req)` or an admin, and ideally a per-writer rate limit.

### 4. List endpoints ship full article bodies to render 3-line cards

`/api/student-article?published=true` and `/api/article` list handlers (`api/student-article/route.ts:194-200`, `api/article/route.ts:102-118`) return the **entire `content` field** (up to 100KB each, ×10–20 per page) — and run the regex sanitizer over each one per request. The client uses `content` for exactly one thing: the "X min read" label (`student-articles/page.tsx:68`). Fix: `.select('-content')` in the list queries and either store `readingTimeMinutes`/`wordCount` on the document at write time or compute it server-side. This shrinks the list payload by ~99% and removes per-request sanitization CPU.

---

## 🟠 Editor performance (`RichTextEditor.tsx`)

The editor will feel fine for short posts but degrade noticeably on long articles:

1. **Full re-render on every keystroke, multiple times over.** The `transaction` + `selectionUpdate` handlers bump `editorRevision` state (`RichTextEditor.tsx:406-425`), re-rendering the entire component (the whole ~40-button toolbar JSX) on every keypress and cursor move. TipTap's `useEditor` already re-renders on transactions by default in v2, so this is doubled.
2. **`editor.getHTML()` serializes the whole document on every keystroke** (`RichTextEditor.tsx:392-394`), and `onChange(html)` sets state in the parent — so the entire `publish-article` page (hero, decorative images, three-step cards, OTP section) reconciles on every keypress too. Medium-smooth typing wants: keep content inside the editor, and either debounce the `onChange` extraction (~500ms) or only extract HTML on submit/autosave.
3. **`hasImageNode` walks the full document tree on every render** (`RichTextEditor.tsx:441-456`) — i.e., every keystroke — just to decide whether to show a pro-tip banner.
4. **Fake counters**: character count is `doc.content.size - 2`, which counts ProseMirror node boundaries, not characters; "Words" is `characters / 5` (`RichTextEditor.tsx:884`). Both drift badly on structured docs. TipTap's official `@tiptap/extension-character-count` gives real numbers for free.
5. **No code splitting**: TipTap + ProseMirror + 7 extensions load in the initial bundle of `/publish-article` even though the user can't type until they scroll past the hero and verify email. A `next/dynamic` import of `RichTextEditor` (there are currently zero dynamic imports in the repo) would cut the page's initial JS substantially.
6. **Sequential multi-image upload** (`RichTextEditor.tsx:266-295`): files upload one at a time while a full-screen overlay ("Optimizing & Uploading…" — nothing actually optimizes) blocks the editor. No client-side downscaling/compression before hitting the 4.5MB server limit, and the limit isn't communicated until the server rejects.

## 🟠 Editor UX vs. Medium/Substack

This is where the gap to "Medium-like" is widest — mostly missing affordances, not missing tech:

1. **No headings in the toolbar.** The renderer styles `h1–h3` beautifully, the sanitizer allows `h1–h6`, StarterKit supports them — but there's no H button. Users literally cannot structure their article unless they happen to know the `##` markdown shortcut. Same for **blockquote** and **divider/hr**. This is the most impactful toolbar fix.
2. **No way to insert a text link.** The `Link` extension is configured (`RichTextEditor.tsx:336`) but no toolbar button uses it — the `Link2` icon inserts an *image by URL* instead. Writers cannot hyperlink text at all.
3. **No undo/redo buttons** (StarterKit history exists, but only via Ctrl+Z — students on tablets/touch devices have nothing).
4. **`window.prompt()` for image URLs and alt text** (`RichTextEditor.tsx:463, 802`) — jarring, unstylable, and blocked in some embedded browsers.
5. **No bubble/floating menu.** The Medium signature interaction — select text → floating format bar, empty line → `+` menu for images/embeds — is available out-of-the-box in TipTap (`BubbleMenu`, `FloatingMenu`) and unused. Adopting these and slimming the top toolbar would transform the feel of the editor more than anything else on this list.
6. **Font-size and color pickers hurt more than help.** Medium/Substack deliberately don't offer them — opinionated typography is what makes published pages look professional. Worse, there's a WYSIWYG trap: the editor body renders at 16px (`prose`, `lg:prose-lg` only ≥1024px) while the published page forces `prose-p:text-[18px]` — so the "Large" (18px) option looks bigger in the editor but **renders identical to normal text once published**. Consider replacing font-size/color with headings/quote/link/divider.
7. **No preview step.** Editor styles (`prose prose-indigo`) and published styles (custom 18px/1.8 prose in `student-articles/[id]/page.tsx:211-226`) differ, and there's no "preview as reader" before submitting to review.
8. **Validation is invisible until failure**: title (160), description (2000), content (100KB) limits from `lib/validation.ts` are never shown in the UI — no counters, and the server error is a generic combined message. Also `extractPlainText` (`publish-article/page.tsx:35`) rejects an article whose content is only images with a misleading "Content is required" error.
9. **Errors render at the top of the form** while the submit button is at the bottom of a very long page — on failure nothing scrolls into view, so it can look like the button silently did nothing.

## 🟡 Reading experience & rendering

1. **Content images are raw `<img>` tags with no `loading="lazy"`, no `decoding="async"`, no width/height** → layout shift and full-size blob downloads (up to 4.5MB) even below the fold. Since HTML passes through the sanitizer on write, the cheapest fix is having the sanitizer (or the editor's `renderHTML`) stamp `loading="lazy" decoding="async"` on every img. Longer-term, resize/convert to WebP at upload.
2. **Triple sanitization of the same content.** Sanitized on write (`api/student-article/route.ts:95`), again on every GET (`:48`), and *again* on the client before `dangerouslySetInnerHTML` (`student-articles/[id]/page.tsx:227`). The client pass ships the whole sanitizer to the browser to re-process already-clean HTML. Sanitize-on-write plus one defensive pass is plenty; pick one place.
3. **Custom regex-based HTML sanitizer** (`lib/sanitize.ts`). It's more thoughtful than most (style whitelisting, `on*` stripping, `javascript:` blocking), but regex HTML parsing is a known-fragile approach with a long history of bypass classes. Since it guards `dangerouslySetInnerHTML` on public pages, consider swapping it for a battle-tested library (`sanitize-html` server-side or `isomorphic-dompurify`) and keeping the existing allowlists as its config.
4. **Reading progress bar re-renders the whole article page on every scroll event** (`student-articles/[id]/page.tsx:71-82` sets React state per scroll). Use a `ref` + direct style mutation or a CSS scroll-driven animation.
5. **The two detail pages are ~230-line near-duplicates** (same skeletons, same prose classes, same helpers). `getReadingTime`/`formatDate` are copy-pasted in 4+ files. Extract a shared `<ArticleReader>` component — this also means future typography fixes happen once.
6. **No caching anywhere**: every public article view is a MongoDB round-trip through a serverless function. Published articles are immutable-ish — ideal for ISR (`revalidate`) or `revalidateTag` fired from the admin publish action.

## 🟡 Data layer / API details

- `StudentArticle.ts:65-67` deletes and recompiles the mongoose model on every module load — a hot-reload workaround left in production code; the standard `mongoose.models.X || mongoose.model(...)` pattern is safer.
- No schema indexes for the actual query patterns: `{ reviewStatus, createdAt }` for the public list, `{ writer }` / `{ submitterEmail }` for `/api/writer-articles`. Fine now, degrades silently as the collection grows.
- The admin list handler runs its queries sequentially (`find` → `countDocuments` → `countDocuments` at `api/student-article/route.ts:194-221`) — trivially parallelizable with `Promise.all`.
- `my-articles` shows "Live on the Student Articles page" for published pieces but the button links to the *list*, not the writer's own article — writers can't jump to (or share) their published story. There's also no edit/withdraw for pending, and no rejection reason for rejected — worth roadmapping since "rejected, no explanation, no recourse" is a rough author experience.

---

## Prioritized recommendation

**Quick wins (hours):**
1. Auth-gate `/api/upload-image`.
2. `.select('-content')` on list endpoints + server-computed reading time.
3. Toolbar: add H2/H3, blockquote, divider, text-link, undo/redo; remove font-size/color.
4. `localStorage` draft backup + `beforeunload` guard.
5. `loading="lazy"` on content images; drop the client-side re-sanitize.
6. Debounce `onChange`/`getHTML`, remove the per-keystroke `editorRevision` bump (compute image-selection state via `useEditorState`).

**Medium (days):**
7. Server components + `generateMetadata` + slugs + dynamic sitemap for both detail pages — biggest business impact.
8. Shared `<ArticleReader>` with unified editor/published typography, plus a preview mode.
9. TipTap `BubbleMenu`/`FloatingMenu` for the Medium-style interaction; replace `window.prompt`s.
10. Replace the regex sanitizer with `sanitize-html`/DOMPurify.

**Larger (roadmap):**
11. Server-side drafts with autosave; edit/withdraw pending submissions; rejection feedback; image resizing/WebP at upload; ISR caching.
