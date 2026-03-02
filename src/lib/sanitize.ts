const ALLOWED_TAGS = new Set([
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
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel", "title", "class"]),
  img: new Set(["src", "alt", "title", "width", "height", "class", "style", "data-align"]),
  span: new Set(["class", "style"]),
  p: new Set(["class", "style"]),
  h1: new Set(["class"]),
  h2: new Set(["class"]),
  h3: new Set(["class"]),
  h4: new Set(["class"]),
  h5: new Set(["class"]),
  h6: new Set(["class"]),
  ul: new Set(["class"]),
  ol: new Set(["class"]),
  li: new Set(["class"]),
  blockquote: new Set(["class"]),
  code: new Set(["class"]),
  pre: new Set(["class"]),
  strong: new Set(["class"]),
  em: new Set(["class"]),
  u: new Set(["class"]),
  s: new Set(["class"]),
  br: new Set(),
};

const GLOBAL_ALLOWED_ATTRS = new Set(["class"]);

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
  "margin-left",
  "margin-right",
]);

const isSafeStyleValue = (property: string, value: string): boolean => {
  const normalizedValue = value.trim().toLowerCase();

  if (property === "display") {
    return normalizedValue === "block" || normalizedValue === "inline-block";
  }

  if (property === "height") {
    return normalizedValue === "auto" || /^(\d+(\.\d+)?)(px|%)$/.test(normalizedValue);
  }

  if (property === "margin-left" || property === "margin-right") {
    return normalizedValue === "auto" || /^(\d+(\.\d+)?)(px|%)$/.test(normalizedValue) || normalizedValue === "0";
  }

  if (property === "width" || property === "max-width") {
    return /^(\d+(\.\d+)?)(px|%)$/.test(normalizedValue);
  }

  return true;
};

const escapeAttributeValue = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const sanitizeUrl = (rawValue: string): string | null => {
  const value = rawValue.trim();
  const lower = value.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:text/html")
  ) {
    return null;
  }
  return value;
};

const sanitizeStyle = (styleValue: string): string | null => {
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

    const unsafeValue = /url\s*\(|expression\s*\(|javascript:|@import/i.test(value);
    if (!SAFE_STYLE_PROPERTIES.has(property) || unsafeValue || !isSafeStyleValue(property, value)) {
      continue;
    }

    safeDeclarations.push(`${property}: ${value}`);
  }

  return safeDeclarations.length > 0 ? safeDeclarations.join("; ") : null;
};

export const sanitizeRichTextHtml = (input: string): string => {
  if (!input || typeof input !== "string") {
    return "";
  }

  let html = input;
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(
    /<\/?(script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option|svg|math)[^>]*>/gi,
    ""
  );

  html = html.replace(/<([^>]+)>/g, (fullMatch, tagContent: string) => {
    const isClosingTag = /^\s*\//.test(tagContent);
    const tagNameMatch = tagContent.match(/^\/?\s*([a-zA-Z0-9-]+)/);
    if (!tagNameMatch) {
      return "";
    }

    const tagName = tagNameMatch[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) {
      return "";
    }

    if (isClosingTag) {
      return `</${tagName}>`;
    }

    const attrMatches = [
      ...tagContent.matchAll(
        /([^\s"'=<>`\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
      ),
    ];

    const allowedForTag = ALLOWED_ATTRS[tagName] ?? new Set<string>();
    const sanitizedAttrs: string[] = [];

    for (const attrMatch of attrMatches) {
      const rawName = attrMatch[1];
      if (!rawName) {
        continue;
      }

      const attrName = rawName.toLowerCase();
      if (attrName === tagName || attrName.startsWith("on")) {
        continue;
      }

      const isAllowed =
        allowedForTag.has(attrName) || GLOBAL_ALLOWED_ATTRS.has(attrName);
      if (!isAllowed) {
        continue;
      }

      const rawValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";
      let value = rawValue.trim();

      if (attrName === "href" || attrName === "src") {
        const sanitizedUrl = sanitizeUrl(value);
        if (!sanitizedUrl) {
          continue;
        }
        value = sanitizedUrl;
      }

      if (attrName === "style") {
        const sanitizedStyle = sanitizeStyle(value);
        if (!sanitizedStyle) {
          continue;
        }
        value = sanitizedStyle;
      }

      if (attrName === "target" && value === "_blank") {
        sanitizedAttrs.push(`target="${escapeAttributeValue(value)}"`);
        sanitizedAttrs.push(`rel="noopener noreferrer"`);
        continue;
      }

      if (value === "" && attrName !== "alt") {
        continue;
      }

      sanitizedAttrs.push(`${attrName}="${escapeAttributeValue(value)}"`);
    }

    const attrText = sanitizedAttrs.length > 0 ? ` ${sanitizedAttrs.join(" ")}` : "";
    return `<${tagName}${attrText}>`;
  });

  return html;
};
