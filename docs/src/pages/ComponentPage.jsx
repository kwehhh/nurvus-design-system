import React from 'react';
import { Text } from '@nurvus/ui';

// Phase 2 placeholder: live examples and the API table arrive in phase 3.
export default function ComponentPage({ component }) {
  return (
    <div className="dx-page">
      <h1 className="dx-page-title">{ component.name }</h1>
      <Text as="p" variant="body" tone="muted">{ component.description }</Text>
    </div>
  );
}

export function IsolatedExample({ component, index }) {
  return <p>{ component.name } example { index }</p>;
}
