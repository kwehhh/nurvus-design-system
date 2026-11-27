import React from 'react';
import { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// Code colors come from the active theme (--nv-syntax-*), like every other
// code pane in NURVUS.
const highlight = HighlightStyle.define([
  { tag: t.comment, color: 'var(--nv-syntax-comment)' },
  { tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.definitionKeyword, t.operatorKeyword], color: 'var(--nv-syntax-keyword)' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.typeName, t.className], color: 'var(--nv-syntax-function)' },
  { tag: [t.tagName, t.angleBracket], color: 'var(--nv-syntax-tag)' },
  { tag: [t.attributeName, t.propertyName], color: 'var(--nv-syntax-attr)' },
  { tag: [t.string, t.special(t.string), t.attributeValue], color: 'var(--nv-syntax-string)' },
  { tag: [t.number, t.bool, t.null, t.atom], color: 'var(--nv-syntax-number)' },
  { tag: [t.punctuation, t.bracket, t.operator, t.separator], color: 'var(--nv-text-muted)' },
]);

const look = EditorView.theme({
  '&': { backgroundColor: 'var(--nv-bg)', color: 'var(--nv-text)', fontSize: '13px' },
  '.cm-content': { fontFamily: 'var(--nv-font-mono)', caretColor: 'var(--nv-cursor)', padding: '10px 0' },
  '.cm-scroller': { fontFamily: 'var(--nv-font-mono)', lineHeight: '1.6' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--nv-cursor)', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: 'var(--nv-selection)' },
  '.cm-gutters': { backgroundColor: 'var(--nv-bg-alt)', color: 'var(--nv-text-subtle)', border: 'none', borderRight: '1px solid var(--nv-border)' },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--nv-text) 5%, transparent)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--nv-text-muted)' },
  '&.cm-focused': { outline: '2px solid var(--nv-accent)', outlineOffset: '-2px' },
});

/**
 * A CodeMirror 6 editor for JSX. `value` is the starting text (and what a
 * Reset puts back); `onChange` gets every edit. readOnly shows code only.
 * `lang`: "jsx" (colored) or "text" (plain).
 */
export default function CodeEditor({ value, onChange, readOnly = false, label = 'Example code', lang = 'jsx' }) {
  const host = React.useRef(null);
  const view = React.useRef(null);
  const changed = React.useRef(onChange);
  changed.current = onChange;

  React.useEffect(() => {
    view.current = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          history(),
          drawSelection(),
          highlightActiveLine(),
          // lang="text" (Markdown, SCSS): plain text, no JavaScript colors.
          ...(lang === 'jsx' ? [javascript({ jsx: true }), syntaxHighlighting(highlight)] : []),
          look,
          EditorView.lineWrapping,
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          EditorState.readOnly.of(readOnly),
          EditorView.editable.of(!readOnly),
          EditorView.contentAttributes.of({ 'aria-label': readOnly ? label : `${label} (editable; Esc then Tab leaves the editor)` }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && changed.current) changed.current(update.state.doc.toString());
          }),
        ],
      }),
    });
    // The code font may load after the editor: measure again once it has,
    // or the line numbers drift from their lines.
    if (document.fonts) document.fonts.ready.then(() => { if (view.current) view.current.requestMeasure(); });
    return () => view.current.destroy();
  }, [readOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset: an outside value replaces the text.
  React.useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  return <div className="dx-editor" ref={ host } />;
}
