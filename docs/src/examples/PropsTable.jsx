import React from 'react';
import { Table, Tag, Text } from '@nurvus/ui';
import { inlineMarkdown } from './markdown';

/** react-docgen's PropTypes type as a short readable string. */
export function formatType(type) {
  if (!type) return 'unknown';
  switch (type.name) {
    case 'enum':
      return Array.isArray(type.value) ? type.value.map((v) => v.value).join(' | ') : 'enum';
    case 'union':
      return Array.isArray(type.value) ? type.value.map(formatType).join(' | ') : 'union';
    case 'arrayOf':
      return `${formatType(type.value)}[]`;
    case 'shape':
    case 'exact':
      return `{ ${Object.keys(type.value || {}).join(', ')} }`;
    case 'instanceOf':
      return type.value;
    case 'elementType':
      return 'element type';
    default:
      return type.name;
  }
}

/**
 * react-docgen's TypeScript type as a short readable string. Unions are
 * expanded, so an alias like `Spacing` shows its values.
 */
export function formatTsType(t) {
  if (!t) return 'unknown';
  if (t.name === 'union' && Array.isArray(t.elements)) return t.elements.map(formatTsType).join(' | ');
  if (t.name === 'literal') return t.value;
  return t.raw || t.name;
}

/** The component's props, from react-docgen, in our own Table. */
export default function PropsTable({ props }) {
  const rows = Object.entries(props).map(([name, p]) => ({
    key: name,
    name,
    type: p.tsType ? formatTsType(p.tsType) : formatType(p.type),
    default: p.defaultValue ? p.defaultValue.value : '',
    required: p.required,
    description: p.description,
  }));
  if (!rows.length) return <Text as="p" variant="caption" tone="muted">This component documents no props.</Text>;

  return (
    <div className="dx-table-scroll">
      <Table
        className="dx-props"
        columns={ [
          { title: 'Prop', dataKey: 'name', render: (v, k, row) => <><Text variant="mono">{ v }</Text>{ row.required && <> <Tag tone="warning">required</Tag></> }</> },
          { title: 'Type', dataKey: 'type', render: (v) => <Text variant="mono">{ v }</Text> },
          { title: 'Default', dataKey: 'default', render: (v) => (v ? <Text variant="mono">{ v }</Text> : <Text tone="subtle">—</Text>) },
          // eslint-disable-next-line react/no-danger
          { title: 'Description', dataKey: 'description', render: (v) => <span dangerouslySetInnerHTML={ { __html: inlineMarkdown(v) } } /> },
        ] }
        data={ rows }
      />
    </div>
  );
}
