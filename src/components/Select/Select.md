Click it, or Tab to it and use the keys: ↓ ↑ open the list and move, Home and End jump, typing finds an option by its first letters, Enter or Space picks, Esc closes.
```jsx
import { Layout, Select, Text } from '@nurvus/ui';

const Region = () => {
  const [region, setRegion] = React.useState('eu-west');
  return (
    <Layout display="flex" alignItems="center" itemSpacing={ 12 }>
      <Select
        id="region"
        label="Region"
        value={ region }
        onChange={ setRegion }
        options={ [
          { value: 'us-east', label: 'US East', description: 'Virginia' },
          { value: 'us-west', label: 'US West', description: 'Oregon' },
          { value: 'eu-west', label: 'EU West', description: 'Ireland' },
          { value: 'ap-south', label: 'Asia Pacific', description: 'Mumbai', disabled: true },
        ] }
      />
      <Text tone="muted">Deploying to { region }</Text>
    </Layout>
  );
};
<Region />
```

Groups, and options drawn your own way: here a swatch beside each theme, in the theme's own colors. `renderValue` draws the picked one inside the button.
```jsx
import { Select, themes } from '@nurvus/ui';

const Swatch = ({ theme }) => (
  <span style={ { width: 16, height: 16, borderRadius: 4, flex: 'none', background: theme.colors.bg, border: `2px solid ${theme.colors['accent-fill']}` } } />
);

const ThemePicker = () => {
  const [id, setId] = React.useState('tokyo-neon');
  const byId = (value) => themes.find((t) => t.id === value);
  return (
    <Select
      id="theme-example"
      label="Theme"
      value={ id }
      onChange={ setId }
      options={ themes.map((t) => ({ value: t.id, label: t.name, description: t.keywords, group: t.mode === 'light' ? 'Light' : 'Dark' })) }
      renderValue={ (option) => <><Swatch theme={ byId(option.value) } />{ option.label }</> }
      renderOption={ (option) => (
        <>
          <Swatch theme={ byId(option.value) } />
          <span className="select-option-text">
            <span>{ option.label }</span>
            <span className="select-option-description">{ option.description }</span>
          </span>
        </>
      ) }
    />
  );
};
<ThemePicker />
```

Nothing picked yet: the placeholder shows until a value is chosen.
```jsx
import { Select } from '@nurvus/ui';

<Select
  id="size"
  label="Size"
  placeholder="Pick a size"
  options={ [{ value: 's', label: 'Small' }, { value: 'm', label: 'Medium' }, { value: 'l', label: 'Large' }] }
/>
```
