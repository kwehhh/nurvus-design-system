import React from 'react';
import { Table, Tag, Text } from '@nurvus/ui';
import Example from '../examples/Example';
import { href } from '../router';
import './Guides.scss';
import './Typography.scss';

const ROLES = ['display', 'title', 'body', 'caption', 'mono'];
const USE = {
  display: 'The one big headline on a page.',
  title: 'Section headings and panel titles.',
  body: 'Running text: paragraphs, descriptions.',
  caption: 'Labels, captions, table cells, notes.',
  mono: 'Values: hex codes, tokens, numbers, code.',
};

/** A CSS custom property's value on <html>. */
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const WHICH = `<>
  <Title level={ 2 }>Billing</Title>

  <Text as="p" variant="body">
    A paragraph is Text rendered as a p: body size, body line height.
  </Text>

  <Text as="p" variant="caption" tone="muted">
    A note under it, smaller and quieter.
  </Text>
</>`;

const EMPHASIS = `<>
  <Text as="p" variant="body">
    Your plan renews on <strong>1 December</strong>. You can
    <em> change it any time</em> in <Link href="#">Billing</Link>.
    The old price was <s>$49</s>; it's now $39. Your
    account id is <code>acct_42</code>.
  </Text>

  <Text as="p" variant="body" weight="semibold">
    A whole line in semibold, for a label that has to stand out.
  </Text>
</>`;

/** Foundations: the typefaces, the type roles, the scale, and how to write with them. */
export default function Typography() {
  const roles = ROLES.map((role) => ({
    key: role,
    role,
    size: cssVar(`--nv-type-${role}-size`),
    line: cssVar(`--nv-type-${role}-line`),
    weight: cssVar(`--nv-type-${role}-weight`),
    use: USE[role],
  }));

  return (
    <div className="dx-page gd ty">
      <h1 className="dx-page-title">Typography</h1>
      <p className="dx-lede">
        Two typefaces, five type roles, one scale. Sizes come from tokens (<code>--nv-type-*</code>), so every page that
        uses them matches.
      </p>

      <h2 className="gd-h2">The typefaces</h2>
      <div className="ty-faces">
        <div className="ty-face">
          <span className="ty-face-sample">Aa</span>
          <h3>Inter</h3>
          <p>
            For everything you read. Made for screens by Rasmus Andersson (first released 2017), open source (SIL Open
            Font License). Tall lowercase letters stay clear at small sizes, and its numbers can line up in columns.
          </p>
          <p className="ty-alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz 0123456789</p>
        </div>
        <div className="ty-face ty-face-mono">
          <span className="ty-face-sample">{ '{}' }</span>
          <h3>JetBrains Mono</h3>
          <p>
            For code and values: hex colors, tokens, ids. Every character is the same width, so code lines up. Open
            source (SIL Open Font License), from JetBrains (2020). Ligatures are off, so <code>{ '<!--' }</code> and{ ' ' }
            <code>{ '->' }</code> look exactly as typed.
          </p>
          <p className="ty-alphabet">#245CC7 --nv-accent 0O 1lI {'{ } ( ) => !== <!--'}</p>
        </div>
      </div>
      <p className="gd-note">
        This site serves both fonts itself; nothing loads from Google. The package names them in{ ' ' }
        <code>--nv-font-sans</code> and <code>--nv-font-mono</code> but doesn't ship the files: load them in your app
        (e.g. <code>@fontsource/inter</code>), or the system UI font is used instead.
      </p>

      <h2 className="gd-h2">The five type roles</h2>
      <p className="gd-p">Use them with <code>Text</code>: <code>{ '<Text variant="caption">' }</code>.</p>
      <div className="ty-roles">
        { roles.map((r) => (
          <div key={ r.role } className="ty-role">
            <div className="ty-role-meta">
              <Tag tone={ r.role === 'body' ? 'accent' : 'neutral' }>{ r.role }</Tag>
              <span>{ r.size } / { r.line } · { r.weight }</span>
            </div>
            <Text as="p" variant={ r.role } className="ty-role-sample">
              { r.role === 'mono' ? '#245CC7 --nv-accent-fill' : 'Build the interface once.' }
            </Text>
            <span className="ty-role-use">{ r.use }</span>
          </div>
        )) }
      </div>

      <h2 className="gd-h2">What is 13px?</h2>
      <p className="gd-p">
        The code and value size. JetBrains Mono's letters are wider than Inter's, so code set one pixel smaller looks
        the same size as 14px caption text next to it. 13 isn't a multiple of 4, and font sizes don't need to be: what
        sits on the grid is the 20px line under it.
      </p>
      <div className="ty-compare">
        <div><span className="ty-compare-label">Inter 14px (caption)</span><span className="ty-14">Rows per page</span></div>
        <div><span className="ty-compare-label">JetBrains Mono 13px (mono)</span><span className="ty-13">rows_per_page</span></div>
        <div><span className="ty-compare-label">JetBrains Mono 14px, for comparison</span><span className="ty-13 ty-13-as-14">rows_per_page</span></div>
      </div>

      <h2 className="gd-h2">Lines on the grid</h2>
      <p className="gd-p">
        Every line height is a multiple of 4: title 28, body 24, caption and mono 20. So a block of text is always a
        whole number of grid steps tall, and spacing below it stays on the grid. The faint lines are every 4px.
      </p>
      <div className="ty-grid">
        <Text as="p" variant="body">
          A paragraph in the body role: 16px type on a 24px line. Six grid steps per line, however many lines it runs to,
          so whatever comes after it starts on the grid too.
        </Text>
      </div>

      <h2 className="gd-h2">Text, Title or a paragraph?</h2>
      <Table
        className="gd-api"
        columns={ [
          { dataKey: 'use', title: 'For' },
          { dataKey: 'how', title: 'Use', render: (v) => <code>{ v }</code> },
        ] }
        data={ [
          { key: 1, use: 'A heading in the page outline (h1 to h6)', how: '<Title level={2}>' },
          { key: 2, use: 'A paragraph', how: '<Text as="p" variant="body">' },
          { key: 3, use: 'A label, note or table cell', how: '<Text variant="caption" tone="muted">' },
          { key: 4, use: 'A value: color, id, token', how: '<Text variant="mono">' },
          { key: 5, use: 'The one big headline', how: '<Text as="h1" variant="display">' },
          { key: 6, use: 'Words inside a line', how: '<Text> (a span), or just text' },
        ] }
      />
      <Example owner="Guide" code={ WHICH } />

      <h2 className="gd-h2">Bold, italic, underline</h2>
      <ul className="gd-list">
        <li><strong>Bold:</strong> <code>{ '<strong>' }</code> for words that matter (screen readers know). For a label's look, <code>weight="semibold"</code>.</li>
        <li><em>Italic:</em> <code>{ '<em>' }</code> for stress, sparingly. Not for whole paragraphs: long italic is hard to read.</li>
        <li><strong>Underline:</strong> only links. People read an underline as "I can click this", so don't underline anything else.</li>
        <li><s>Strikethrough:</s> <code>{ '<s>' }</code> for something replaced, like an old price.</li>
        <li><strong>Code:</strong> <code>{ '<code>' }</code> inside a line; <code>{ '<Text variant="mono">' }</code> for a value on its own.</li>
        <li><strong>Links:</strong> the <a href={ href('Components', 'Link') }>Link</a> component.</li>
      </ul>
      <Example owner="Guide" code={ EMPHASIS } />
    </div>
  );
}
