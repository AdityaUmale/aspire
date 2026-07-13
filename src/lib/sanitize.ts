import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "blockquote",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "span",
  "img",
  "code",
  "pre",
  "hr",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "target", "rel", "title", "class"],
  img: [
    "src",
    "alt",
    "title",
    "width",
    "height",
    "class",
    "style",
    "data-align",
    "loading",
    "decoding",
  ],
  span: ["class", "style"],
  p: ["class", "style"],
  h1: ["class"],
  h2: ["class"],
  h3: ["class"],
  h4: ["class"],
  h5: ["class"],
  h6: ["class"],
  ul: ["class"],
  ol: ["class"],
  li: ["class"],
  blockquote: ["class"],
  code: ["class"],
  pre: ["class"],
  strong: ["class"],
  em: ["class"],
  u: ["class"],
  s: ["class"],
  hr: ["class"],
  "*": ["class"],
};

const SAFE_STYLE_PROPERTIES = new Set([
  "color",
  "background-color",
  "text-align",
  "font-size",
  "font-weight",
  "font-style",
  "text-decoration",
  "width",
  "max-width",
  "height",
  "display",
  "float",
  "clear",
  "margin-top",
  "margin-bottom",
  "margin-left",
  "margin-right",
]);

const isSafeStyleValue = (property: string, value: string): boolean => {
  const normalizedValue = value.trim().toLowerCase();

  const isSafeSpacingValue = (input: string) =>
    input === "auto" || input === "0" || /^(\d+(\.\d+)?)(px|%)$/.test(input);

  if (property === "display") {
    return normalizedValue === "block" || normalizedValue === "inline-block";
  }

  if (property === "float") {
    return (
      normalizedValue === "left" ||
      normalizedValue === "right" ||
      normalizedValue === "none"
    );
  }

  if (property === "clear") {
    return (
      normalizedValue === "none" ||
      normalizedValue === "both" ||
      normalizedValue === "left" ||
      normalizedValue === "right"
    );
  }

  if (property === "height") {
    return normalizedValue === "auto" || isSafeSpacingValue(normalizedValue);
  }

  if (
    property === "margin-left" ||
    property === "margin-right" ||
    property === "margin-top" ||
    property === "margin-bottom"
  ) {
    return isSafeSpacingValue(normalizedValue);
  }

  if (property === "width" || property === "max-width") {
    return /^(\d+(\.\d+)?)(px|%)$/.test(normalizedValue);
  }

  return true;
};

const sanitizeStyleValue = (styleValue: string): string => {
  const declarations = styleValue
    .split(";")
    .map((decl) => decl.trim())
    .filter(Boolean);

  const safeDeclarations: string[] = [];
  for (const declaration of declarations) {
    const separatorIndex = declaration.indexOf(":");
    if (separatorIndex <= 0) {
      continue;
    }

    const property = declaration.slice(0, separatorIndex).trim().toLowerCase();
    const value = declaration.slice(separatorIndex + 1).trim();

    const unsafeValue = /url\s*\(|expression\s*\(|javascript:|@import/i.test(
      value
    );
    if (
      !SAFE_STYLE_PROPERTIES.has(property) ||
      unsafeValue ||
      !isSafeStyleValue(property, value)
    ) {
      continue;
    }

    safeDeclarations.push(`${property}: ${value}`);
  }

  return safeDeclarations.join("; ");
};

const isSafeUrl = (value: string): boolean => {
  const lower = value.trim().toLowerCase();
  return !(
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:text/html")
  );
};

/**
 * Sanitize rich-text HTML for storage and rendering.
 * Uses sanitize-html with the same allowlists as the previous custom sanitizer.
 */
export const sanitizeRichTextHtml = (input: string): string => {
  if (!input || typeof input !== "string") {
    return "";
  }

  return sanitizeHtml(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
      a: ["http", "https", "mailto"],
    },
    allowProtocolRelative: false,
    // Relative paths like /uploads/... for images
    allowVulnerableTags: false,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        if (href && !isSafeUrl(href) && !href.startsWith("/")) {
          return { tagName, attribs: {} };
        }

        const next = { ...attribs };
        if (next.target === "_blank") {
          next.rel = "noopener noreferrer";
        }
        return { tagName, attribs: next };
      },
      img: (tagName, attribs) => {
        const src = attribs.src || "";
        if (src && !isSafeUrl(src) && !src.startsWith("/")) {
          return { tagName: "span", attribs: {} };
        }

        const next = { ...attribs };
        if (!next.loading) {
          next.loading = "lazy";
        }
        if (!next.decoding) {
          next.decoding = "async";
        }
        if (next.style) {
          const cleaned = sanitizeStyleValue(next.style);
          if (cleaned) {
            next.style = cleaned;
          } else {
            delete next.style;
          }
        }
        return { tagName, attribs: next };
      },
      span: (tagName, attribs) => {
        const next = { ...attribs };
        if (next.style) {
          const cleaned = sanitizeStyleValue(next.style);
          if (cleaned) {
            next.style = cleaned;
          } else {
            delete next.style;
          }
        }
        return { tagName, attribs: next };
      },
      p: (tagName, attribs) => {
        const next = { ...attribs };
        if (next.style) {
          const cleaned = sanitizeStyleValue(next.style);
          if (cleaned) {
            next.style = cleaned;
          } else {
            delete next.style;
          }
        }
        return { tagName, attribs: next };
      },
    },
  });
};
