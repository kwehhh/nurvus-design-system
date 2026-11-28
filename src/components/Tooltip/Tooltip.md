A short label for a control, most useful on icon-only buttons; with `shortcut`, its keyboard shortcut as key caps. Point at a button and rest, or Tab to it: the tooltip shows. Press Esc to hide it; move the pointer onto it and it stays.

```jsx
import { Button, Icon, Layout, Tooltip } from '@nurvus/ui';

<Layout display="flex" itemSpacing={ 16 } style={ { padding: '8px 0 48px' } }>
  <Tooltip id="tip-save" content="Save" shortcut={ ['⌘', 'S'] }>
    <Button size="small" type="secondary" aria-label="Save"><Icon name="download" /></Button>
  </Tooltip>
  <Tooltip id="tip-share" content="Share a link">
    <Button size="small" type="secondary" aria-label="Share"><Icon name="share" /></Button>
  </Tooltip>
  <Tooltip id="tip-settings" content="Settings" shortcut={ ['⌘', ','] } placement="bottom" align="start">
    <Button size="small" type="secondary" aria-label="Settings"><Icon name="settings" /></Button>
  </Tooltip>
</Layout>
```

The tooltip describes the control (`aria-describedby`): screen readers say the control's own name first ("Save, button"), then the tooltip. So a tooltip never replaces a name: an icon-only button still needs its `aria-label`. Keep tooltips to a few words, and never put links or buttons in them: nothing inside a tooltip can be reached by keyboard.
