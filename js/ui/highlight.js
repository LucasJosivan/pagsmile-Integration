const LEAF_LINE_RE = /^\s*"([A-Za-z0-9_]+)"\s*:\s*(.*?),?\s*$/;

function isUnfilled(rawValue) {
  const v = rawValue.trim();
  const unquoted = v.replace(/^"(.*)"$/, "$1");
  if (unquoted === "") return true;
  return /^<[^<>]+>$/.test(unquoted);
}

/**
 * Renders `text` into `preEl`, wrapping any line that assigns a required-but-
 * still-empty/placeholder JSON field in a highlighted span, so the merchant
 * can spot missing required parameters directly in the cURL/code preview.
 */
export function renderHighlightedCode(preEl, text, requiredLeafKeys = []) {
  const requiredSet = new Set(requiredLeafKeys);
  preEl.innerHTML = "";
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    const match = line.match(LEAF_LINE_RE);
    const isMissing = !!match && requiredSet.has(match[1]) && isUnfilled(match[2]);
    const lineEl = document.createElement("span");
    if (isMissing) lineEl.className = "code-line--missing";
    lineEl.textContent = line + (i < lines.length - 1 ? "\n" : "");
    preEl.appendChild(lineEl);
  });
}
