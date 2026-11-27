import classNames from 'classnames';
import CONSTANT from '../constants';
import { groupOptions, selectKey, matchOption, typeahead, isPrintable, SelectAction } from '../select';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Select/Select.scss';

export interface SelectOption {
  /** The value onChange reports. */
  value: string;
  /** What the option says. */
  label: Child;
  /** A second, quieter line under the label. */
  description?: Child;
  /** Options with the same group are listed together, under the group as a heading. */
  group?: string;
  /** Shown, but can't be picked. */
  disabled?: boolean;
  /** The text typing matches, when the label isn't plain text. Defaults to the label. */
  textValue?: string;
}

/** Where an option stands when it is drawn. */
export interface SelectOptionState {
  /** It is the picked value. */
  selected: boolean;
  /** The keys or the pointer are on it. */
  active: boolean;
}

export interface SelectProps extends ElementProps {
  /** The options, in order (grouped ones are listed together under their group). */
  options: SelectOption[];
  /** The picked value. */
  value?: string;
  /** The value it starts with (the same as value here: the element keeps its own value). */
  defaultValue?: string;
  /** Called when an option is picked (not when the same one is picked again), after it is shown as picked. */
  onChange?: (value: string, option: SelectOption) => void;
  /** Accessible name (screen readers say it), e.g. "Theme". */
  label: string;
  /** Shown while nothing is picked. */
  placeholder?: Child;
  /** Draws an option's content instead of its label and description (once, when the element is built). */
  renderOption?: (option: SelectOption, state: SelectOptionState) => Child;
  /** Draws the picked option inside the button instead of its label. */
  renderValue?: (option: SelectOption | undefined) => Child;
  /** Which edge of the button the list lines up with. */
  align?: 'start' | 'end';
  /** Can't be opened. */
  disabled?: boolean;
  /** Prefix for the ids that tie the button to its list and options. */
  id?: string;
}

/**
 * Pick one value from a list: a button that opens a list of options (the
 * WAI-ARIA select-only combobox), with the same keys as the React Select.
 * Opening, moving and picking change the element in place; picking calls
 * onChange(value, option). To set the value from code: select.update({ value }).
 */
export default function Select(props: SelectProps): NurvusElement<HTMLDivElement, SelectProps> {
  return updatable(({
    options = [], value, defaultValue, onChange, label, placeholder = 'Choose…', renderOption, renderValue,
    align = 'start', disabled = false, id = 'select', className, ...rest
  }: SelectProps, keep) => {
    const { groups, ordered } = groupOptions(options);
    let chosen = value !== undefined ? value : defaultValue;
    let selected = ordered.findIndex((o) => o.value === chosen);
    let open = false;
    let active = -1;
    const typed = typeahead();
    const optionId = (index: number) => `${id}-option-${index}`;
    const optionEls: HTMLElement[] = [];

    const drawValue = () => {
      const option = selected >= 0 ? ordered[selected] : undefined;
      return spawn({
        tag: 'span',
        className: 'select-value',
        'data-placeholder': option ? undefined : true,
        children: option ? (renderValue ? renderValue(option) : option.label) : (renderValue ? renderValue(undefined) : placeholder),
      });
    };

    const setActive = (index: number) => {
      active = index;
      optionEls.forEach((el, i) => el.setAttribute('data-active', String(open && i === active)));
      if (open && active >= 0) {
        trigger.setAttribute('aria-activedescendant', optionId(active));
        const el = optionEls[active];
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
      } else trigger.removeAttribute('aria-activedescendant');
    };
    const setOpen = (next: boolean) => {
      open = next;
      root.setAttribute('data-open', String(open));
      trigger.setAttribute('aria-expanded', String(open));
      setActive(active);
    };
    const pick = (index: number) => {
      const option = ordered[index];
      if (!option || option.disabled) return;
      const changed = option.value !== chosen;
      chosen = option.value;
      selected = index;
      keep({ value: chosen });
      optionEls.forEach((el, i) => el.setAttribute('aria-selected', String(i === selected)));
      valueEl.replaceWith(valueEl = drawValue());
      if (onChange && changed) onChange(option.value, option);
    };
    const apply = (action: SelectAction) => {
      if (action.type === 'open') { active = action.active; setOpen(true); }
      if (action.type === 'move') setActive(action.active);
      if (action.type === 'pick') { pick(action.active); setOpen(false); }
      if (action.type === 'close') setOpen(false);
    };

    const drawOption = (option: SelectOption, index: number) => {
      const el = spawn({
        className: 'select-option',
        role: 'option',
        id: optionId(index),
        'data-index': index,
        'aria-selected': index === selected,
        'aria-disabled': option.disabled || undefined,
        'data-active': false,
        events: {
          mousemove: () => { if (!option.disabled && active !== index) setActive(index); },
          click: () => { if (!option.disabled) apply({ type: 'pick', active: index }); },
        },
        children: renderOption ? renderOption(option, { selected: index === selected, active: false }) : spawn({
          tag: 'span',
          className: 'select-option-text',
          children: [
            spawn({ tag: 'span', className: 'select-option-label', children: option.label }),
            option.description !== undefined ? spawn({ tag: 'span', className: 'select-option-description', children: option.description }) : null,
          ],
        }),
      });
      optionEls[index] = el;
      return el;
    };

    let valueEl = drawValue();
    const trigger: HTMLElement = spawn({
      className: 'select-trigger',
      role: 'combobox',
      id,
      tabIndex: disabled ? -1 : 0,
      'aria-label': label,
      'aria-haspopup': 'listbox',
      'aria-expanded': false,
      'aria-controls': `${id}-list`,
      'aria-disabled': disabled || undefined,
      events: {
        click: () => {
          if (disabled) return;
          if (open) setOpen(false);
          else apply(selectKey('Enter', false, { open: false, active, selected }, ordered) as SelectAction);
        },
        keydown: (event: KeyboardEvent) => {
          if (disabled) return;
          const typing = isPrintable(event) && (event.key !== ' ' || typed.pending());
          const action = typing ? null : selectKey(event.key, event.altKey, { open, active, selected }, ordered);
          if (action) {
            if (event.key !== 'Tab') event.preventDefault();
            apply(action);
            return;
          }
          if (typing) {
            event.preventDefault();
            const found = matchOption(ordered, typed.add(event.key), open ? active : selected);
            if (found >= 0) { active = found; setOpen(true); }
          }
        },
        blur: () => { if (open) setOpen(false); },
      },
      children: [valueEl, spawn({ tag: 'span', className: 'select-chevron', 'aria-hidden': true })],
    });

    const root: HTMLDivElement = spawn<HTMLDivElement>({
      className: classNames(className, 'select', CONSTANT.CLASS_PREFIX),
      'data-open': false,
      'data-align': align,
      'data-disabled': disabled || undefined,
      ...rest,
      tag: 'div',
      children: [
        trigger,
        spawn({
          className: 'select-list',
          role: 'listbox',
          id: `${id}-list`,
          'aria-label': label,
          // mousedown would move focus off the button and close the list before the click lands
          events: { mousedown: (event: MouseEvent) => event.preventDefault() },
          children: groups.map((group, g) => (group.name ? spawn({
            className: 'select-group',
            role: 'group',
            'aria-labelledby': `${id}-group-${g}`,
            children: [
              spawn({ className: 'select-group-label', id: `${id}-group-${g}`, role: 'presentation', children: group.name }),
              ...group.options.map(({ option, index }) => drawOption(option, index)),
            ],
          }) : group.options.map(({ option, index }) => drawOption(option, index)))),
        }),
      ],
    });
    return root;
  }, props);
}
