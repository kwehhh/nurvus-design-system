import { marked } from 'marked';

/**
 * A component's .md (styleguidist format) as an ordered list of parts:
 * { type: 'prose', html } and { type: 'example', code, mode } where mode is
 * 'live' (```jsx), 'noeditor' (```jsx noeditor: preview only) or 'static'
 * (```jsx static: code only). The .md files are ours, so the HTML is trusted.
 */
export function parseExamples(markdown) {
  const parts = [];
  const fence = /```(jsx|js|javascript)?[ \t]*([a-z ]*)\n([\s\S]*?)\n```/g;
  let last = 0;
  let match;
  while ((match = fence.exec(markdown))) {
    const prose = markdown.slice(last, match.index).trim();
    if (prose) parts.push({ type: 'prose', html: marked.parse(prose) });
    const flags = match[2].trim().split(/\s+/);
    const mode = flags.includes('static') ? 'static' : flags.includes('noeditor') ? 'noeditor' : 'live';
    parts.push({ type: 'example', code: match[3], mode });
    last = fence.lastIndex;
  }
  const tail = markdown.slice(last).trim();
  if (tail) parts.push({ type: 'prose', html: marked.parse(tail) });
  return parts;
}

/** Markdown for short texts (component and prop descriptions). */
export const inlineMarkdown = (text) => marked.parseInline(text || '');
export const blockMarkdown = (text) => marked.parse(text || '');
