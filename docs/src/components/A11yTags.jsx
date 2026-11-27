import React from 'react';
import { Tag } from '@nurvus/ui';
import { CRITERIA, COMPONENT_A11Y, understanding } from '../a11y';

/**
 * A component's accessibility up front: a tag per WCAG 2.2 success criterion
 * it supports (each links to the W3C's explanation), how it does it, and any
 * known gaps, said plainly.
 */
export default function A11yTags({ name }) {
  const info = COMPONENT_A11Y[name];
  if (!info) return null;
  const meets = Object.entries(info.meets || {});
  return (
    <section className="dx-a11y" aria-labelledby={ `a11y-${name}` }>
      <h2 className="dx-a11y-title" id={ `a11y-${name}` }>Accessibility</h2>
      { meets.length > 0 && (
        <ul className="dx-a11y-tags" aria-label="WCAG 2.2 success criteria it supports">
          { meets.map(([id]) => (
            <li key={ id }>
              <a href={ understanding(id) } target="_blank" rel="noopener noreferrer" title={ `WCAG 2.2 success criterion ${id}, level ${CRITERIA[id].level} (opens the W3C's explanation)` }>
                <Tag tone="success">{ `${id} ${CRITERIA[id].name}` }<span className="dx-a11y-level">{ CRITERIA[id].level }</span></Tag>
              </a>
            </li>
          )) }
          { (info.gaps || []).length > 0 && <li><Tag tone="warning">{ `${info.gaps.length} known gap${info.gaps.length > 1 ? 's' : ''}` }</Tag></li> }
        </ul>
      ) }
      { info.note && <p className="dx-a11y-note">{ info.note }</p> }
      { (meets.length > 0 || info.gaps) && (
        <details className="dx-a11y-details">
          <summary>How{ info.gaps ? ', and what is missing' : '' }</summary>
          { meets.length > 0 && (
            <dl>
              { meets.map(([id, how]) => (
                <div key={ id }>
                  <dt>{ id } { CRITERIA[id].name } <span className="dx-a11y-level">{ CRITERIA[id].level }</span></dt>
                  <dd>{ how }</dd>
                </div>
              )) }
            </dl>
          ) }
          { info.gaps && (
            <>
              <p className="dx-a11y-gaps-title">Known gaps</p>
              <ul className="dx-a11y-gaps">{ info.gaps.map((g) => <li key={ g }>{ g }</li>) }</ul>
            </>
          ) }
          <p className="dx-a11y-note">
            WCAG conformance is claimed for whole pages, not parts: these are what this component brings to a page that
            conforms. Each one is checked by a test, in all seven themes.
          </p>
        </details>
      ) }
    </section>
  );
}
