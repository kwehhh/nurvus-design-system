import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import { groupOptions, selectKey, matchOption, typeahead, isPrintable, SelectAction } from '../../select';
import './Select.scss';

export interface SelectOption {
  /** The value onChange reports. */
  value: string;
  /** What the option says. */
  label: React.ReactNode;
  /** A second, quieter line under the label. */
  description?: React.ReactNode;
  /** Options with the same group are listed together, under the group as a heading. */
  group?: string;
  /** Shown, but can't be picked. */
  disabled?: boolean;
  /** The text typing matches, when the label isn't plain text. Defaults to the label. */
  textValue?: string;
}

/** Where an option stands while the list is open. */
export interface SelectOptionState {
  /** It is the picked value. */
  selected: boolean;
  /** The keys or the pointer are on it. */
  active: boolean;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'placeholder'> {
  /** The options, in order (grouped ones are listed together under their group). */
  options: SelectOption[];
  /** The picked value. Pass it with onChange to control the select yourself. */
  value?: string;
  /** The value it starts with, when you don't pass value. */
  defaultValue?: string;
  /** Called when an option is picked (not when the same one is picked again). */
  onChange?: (value: string, option: SelectOption) => void;
  /** Accessible name (screen readers say it), e.g. "Theme". */
  label: string;
  /** Shown while nothing is picked. */
  placeholder?: React.ReactNode;
  /** Draws an option's content instead of its label and description. */
  renderOption?: (option: SelectOption, state: SelectOptionState) => React.ReactNode;
  /** Draws the picked option inside the button instead of its label. */
  renderValue?: (option: SelectOption | undefined) => React.ReactNode;
  /** Which edge of the button the list lines up with. */
  align?: 'start' | 'end';
  /** Can't be opened. */
  disabled?: boolean;
  /** Prefix for the ids that tie the button to its list and options. */
  id?: string;
  /** Custom class name. */
  className?: string;
}

/**
 * Pick one value from a list: a button that opens a list of options (the
 * WAI-ARIA select-only combobox). Focus stays on the button: ↓ ↑ move, Home
 * and End jump, typing finds an option by its first letters, Enter or Space
 * picks, Esc closes. Options can be grouped, and drawn your own way.
 */
export default function Select({
  options = [],
  value,
  defaultValue,
  onChange,
  label,
  placeholder = 'Choose…',
  renderOption,
  renderValue,
  align = 'start',
  disabled = false,
  id = 'select',
  className,
  ...restProps
}: SelectProps) {
  const { groups, ordered } = React.useMemo(() => groupOptions(options), [options]);
  const [inner, setInner] = React.useState(defaultValue);
  const chosen = value !== undefined ? value : inner;
  const selected = ordered.findIndex((o) => o.value === chosen);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const typed = React.useRef(typeahead());
  const list = React.useRef<HTMLDivElement>(null);
  const optionId = (index: number) => `${id}-option-${index}`;

  // Keep the active option in view as the keys move through a long list.
  React.useEffect(() => {
    if (!open || active < 0 || !list.current) return;
    const el = list.current.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const pick = (index: number) => {
    const option = ordered[index];
    if (!option || option.disabled) return;
    if (value === undefined) setInner(option.value);
    if (onChange && option.value !== chosen) onChange(option.value, option);
  };

  const apply = (action: SelectAction) => {
    if (action.type === 'open') { setOpen(true); setActive(action.active); }
    if (action.type === 'move') setActive(action.active);
    if (action.type === 'pick') { pick(action.active); setOpen(false); }
    if (action.type === 'close') setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const typing = isPrintable(event) && (event.key !== ' ' || typed.current.pending());
    const action = typing ? null : selectKey(event.key, event.altKey, { open, active, selected }, ordered);
    if (action) {
      if (event.key !== 'Tab') event.preventDefault();
      apply(action);
      return;
    }
    if (typing) {
      event.preventDefault();
      const found = matchOption(ordered, typed.current.add(event.key), open ? active : selected);
      if (found >= 0) { setOpen(true); setActive(found); }
    }
  };

  const toggle = () => {
    if (disabled) return;
    if (open) setOpen(false);
    else apply(selectKey('Enter', false, { open: false, active, selected }, ordered) as SelectAction);
  };

  const chosenOption = selected >= 0 ? ordered[selected] : undefined;
  const drawOption = (option: SelectOption, index: number) => {
    const state = { selected: index === selected, active: open && index === active };
    return (
      <div
        key={ `${option.value}-${index}` }
        className="select-option"
        role="option"
        id={ optionId(index) }
        data-index={ index }
        aria-selected={ state.selected }
        aria-disabled={ option.disabled || undefined }
        data-active={ state.active }
        onMouseMove={ () => { if (!option.disabled && active !== index) setActive(index); } }
        onClick={ () => { if (!option.disabled) apply({ type: 'pick', active: index }); } }
      >
        { renderOption ? renderOption(option, state) : (
          <span className="select-option-text">
            <span className="select-option-label">{ option.label }</span>
            { option.description !== undefined && <span className="select-option-description">{ option.description }</span> }
          </span>
        ) }
      </div>
    );
  };

  return (
    <div
      className={ classNames(className, 'select', CONSTANT.CLASS_PREFIX) }
      data-open={ open }
      data-align={ align }
      data-disabled={ disabled || undefined }
      { ...restProps }
    >
      <div
        className="select-trigger"
        role="combobox"
        id={ id }
        tabIndex={ disabled ? -1 : 0 }
        aria-label={ label }
        aria-haspopup="listbox"
        aria-expanded={ open }
        aria-controls={ `${id}-list` }
        aria-activedescendant={ open && active >= 0 ? optionId(active) : undefined }
        aria-disabled={ disabled || undefined }
        onClick={ toggle }
        onKeyDown={ handleKeyDown }
        onBlur={ () => setOpen(false) }
      >
        <span className="select-value" data-placeholder={ chosenOption ? undefined : true }>
          { chosenOption ? (renderValue ? renderValue(chosenOption) : chosenOption.label) : (renderValue ? renderValue(undefined) : placeholder) }
        </span>
        <span className="select-chevron" aria-hidden="true" />
      </div>
      { /* mousedown would move focus off the button and close the list before the click lands */ }
      <div className="select-list" role="listbox" id={ `${id}-list` } aria-label={ label } ref={ list } onMouseDown={ (e) => e.preventDefault() }>
        { groups.map((group, g) => (group.name ? (
          <div key={ group.name } className="select-group" role="group" aria-labelledby={ `${id}-group-${g}` }>
            <div className="select-group-label" id={ `${id}-group-${g}` } role="presentation">{ group.name }</div>
            { group.options.map(({ option, index }) => drawOption(option, index)) }
          </div>
        ) : group.options.map(({ option, index }) => drawOption(option, index)))) }
      </div>
    </div>
  );
}
