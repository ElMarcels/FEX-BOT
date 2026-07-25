import sanitizeHtml from "sanitize-html";

export function cleanText(value, max = 2000) {
  const text = String(value ?? "").trim().slice(0, max);
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
}

