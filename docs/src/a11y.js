// Which WCAG 2.2 success criteria each component is built and tested to
// support, how, and what is still missing. Every "meets" here is checked by a
// test (.ai-assist/tools/nurvus-themes-playwright/probeA11y.js): contrast in
// all seven themes, keyboard, focus rings and target sizes on the live
// examples. Conformance itself belongs to whole pages, not components: these
// say what a component brings to a page that conforms.

/** The criteria the tags name: number -> name, level, and its W3C "Understanding" page. */
export const CRITERIA = {
  '1.1.1': { name: 'Non-text Content', level: 'A', slug: 'non-text-content' },
  '1.3.1': { name: 'Info and Relationships', level: 'A', slug: 'info-and-relationships' },
  '1.4.1': { name: 'Use of Color', level: 'A', slug: 'use-of-color' },
  '1.4.3': { name: 'Contrast (Minimum)', level: 'AA', slug: 'contrast-minimum' },
  '1.4.11': { name: 'Non-text Contrast', level: 'AA', slug: 'non-text-contrast' },
  '1.4.4': { name: 'Resize Text', level: 'AA', slug: 'resize-text' },
  '2.1.1': { name: 'Keyboard', level: 'A', slug: 'keyboard' },
  '2.1.2': { name: 'No Keyboard Trap', level: 'A', slug: 'no-keyboard-trap' },
  '2.2.2': { name: 'Pause, Stop, Hide', level: 'A', slug: 'pause-stop-hide' },
  '2.3.3': { name: 'Animation from Interactions', level: 'AAA', slug: 'animation-from-interactions' },
  '2.4.3': { name: 'Focus Order', level: 'A', slug: 'focus-order' },
  '2.4.7': { name: 'Focus Visible', level: 'AA', slug: 'focus-visible' },
  '2.4.8': { name: 'Location', level: 'AAA', slug: 'location' },
  '2.5.8': { name: 'Target Size (Minimum)', level: 'AA', slug: 'target-size-minimum' },
  '4.1.2': { name: 'Name, Role, Value', level: 'A', slug: 'name-role-value' },
  '4.1.3': { name: 'Status Messages', level: 'AA', slug: 'status-messages' },
};

export const understanding = (id) => `https://www.w3.org/WAI/WCAG22/Understanding/${CRITERIA[id].slug}`;

const TEXT_CONTRAST = 'Its text colors are theme roles the build checks: 4.5:1 or more in every theme.';

/**
 * Per component: `meets` (criterion -> how), `gaps` (what is missing, plainly),
 * `note` (when the component has no criteria of its own).
 */
export const COMPONENT_A11Y = {
  Button: {
    meets: {
      '1.4.3': TEXT_CONTRAST,
      '2.1.1': 'A native <button>: Tab reaches it, Enter and Space press it.',
      '2.4.7': 'The browser\'s focus ring shows on keyboard focus.',
      '2.5.8': 'Every size is at least 24 by 24 pixels (mini is 24 tall).',
      '4.1.2': 'A real button: screen readers say its text and "button", and "dimmed" when disabled.',
    },
  },
  ButtonGroup: {
    note: 'A row of Buttons. It adds no criteria of its own; each Button brings its own.',
  },
  FullPageModal: {
    meets: {
      '1.3.1': 'Its title is a real heading, and it names the dialog.',
      '1.4.3': TEXT_CONTRAST,
      '2.1.1': 'Esc calls onClose; everything in it works by keyboard.',
      '2.1.2': 'Tab is kept inside while it is open (a modal must), and Esc or its own Close button always lets people out.',
      '2.4.3': 'Opening it moves focus into it; closing it gives focus back to the button that opened it.',
      '4.1.2': 'A modal dialog (role="dialog", aria-modal="true") named by its title: screen readers say "Settings, dialog".',
    },
  },
  Icon: {
    meets: {
      '1.1.1': 'Without a label an icon is decorative and hidden from screen readers (the words beside it say it); with a label it is an image with that name.',
      '1.4.11': 'Drawn in the text color (currentColor): 4.5:1 or more in every theme, above the 3:1 an icon needs.',
    },
  },
  HistoryList: {
    meets: {
      '1.3.1': 'An ordered list (<ol>): screen readers say "list, 5 items" and each step\'s place.',
      '1.4.3': TEXT_CONTRAST,
      '2.1.1': 'Each step is a <button>: Tab reaches it, Enter jumps to it.',
      '2.4.7': 'A 2px accent ring on keyboard focus.',
      '4.1.2': 'The current step carries aria-current="step".',
    },
  },
  Grid: {
    meets: {
      '1.4.4': 'Gaps are rem and the breakpoints em, so with bigger text the columns get fewer and wider instead of overflowing.',
    },
    note: 'Columns only: what you put in them decides the rest. Keep the reading order in the code the order people see (CSS grid can show it differently).',
  },
  Layout: {
    note: 'Spacing and alignment only. It adds no criteria of its own; what you put in it decides.',
  },
  Loader: {
    meets: {
      '1.1.1': 'The mark is decorative (hidden from screen readers); the label says what is happening.',
      '2.2.2': 'A loading animation is essential: it shows the page isn\'t stuck. It only changes brightness, nothing moves, so it keeps going with reduced motion.',
      '4.1.3': 'A status (role="status"): screen readers say its label, "Loading", without moving focus.',
    },
  },
  Link: {
    meets: {
      '1.4.3': TEXT_CONTRAST,
      '2.1.1': 'A native <a href>: Tab reaches it, Enter follows it.',
      '2.4.7': 'A 2px accent ring on keyboard focus.',
      '4.1.2': 'A real link: screen readers say its text and "link".',
    },
  },
  Menu: {
    meets: {
      '1.3.1': 'What it is, from its items: links make a <nav> landmark of lists (each chevron tied to its list), actions a menu with groups named by their headings, a tree a WAI-ARIA tree.',
      '1.4.1': 'The current page is marked by a bar and bolder text, not by color alone.',
      '1.4.3': TEXT_CONTRAST,
      '2.1.1': '↑ ↓ Home End move between items in every kind. Links: Tab goes link by link, → and ← open and close sections. Actions: one Tab stop, type a letter to jump, Enter or Space runs it.',
      '2.3.3': 'Sections open and close without animation when the system asks for less motion.',
      '2.4.7': 'A 2px accent ring on keyboard focus.',
      '2.4.8': 'The current page is marked, with aria-current="page": readers always know where they are.',
      '2.5.8': 'Every link and chevron is at least 24 by 24 pixels.',
      '4.1.2': 'Each item is what it does: a link, a button, a menu item or a tree item. Chevrons say "Show" or "Hide" and their section, and report expanded or collapsed; a disabled action says "dimmed".',
    },
  },
  Panel: {
    meets: {
      '1.3.1': 'Its title is a real heading (<h3>), so it shows up in a screen reader\'s list of headings.',
      '1.4.3': TEXT_CONTRAST,
    },
  },
  Progress: {
    meets: {
      '1.4.1': 'With showValue the status is an icon and a word too (Done, Needs attention, Failed), not color alone.',
      '1.4.3': TEXT_CONTRAST,
      '1.4.11': 'The filled bar is 3:1 or more against its track in every theme, so the amount reads clearly (the track also has a hairline edge).',
      '4.1.2': 'A progressbar with its label and value: "Uploading, progress bar, 40%", and the status in words ("100%, Done").',
    },
    gaps: ['Without a label or showValue the status is color only: give it one where the status matters.'],
  },
  Select: {
    meets: {
      '1.3.1': 'Grouped options are real groups, named by their heading.',
      '1.4.1': 'The picked option has a check mark, not only a tint.',
      '1.4.3': TEXT_CONTRAST,
      '2.1.1': 'The WAI-ARIA select-only combobox keys: ↓ ↑ Home End, typing to find, Enter or Space to pick, Esc to close.',
      '2.3.3': 'The list opens without animation when the system asks for less motion.',
      '2.4.7': 'A 2px accent ring on the button, and an accent bar on the option the keys are on.',
      '2.5.8': 'The button and every option are at least 24 pixels tall.',
      '4.1.2': 'A combobox with its label, expanded or collapsed, the active option, and the picked one (aria-selected).',
    },
  },
  Stack: {
    meets: {
      '1.4.4': 'Gaps are rem and the breakpoints em, so a row that would overflow with bigger text becomes a column sooner, and wrapped rows keep their spacing.',
    },
    note: 'Spacing and direction only: what you put in it decides the rest.',
  },
  Table: {
    meets: {
      '1.3.1': 'Real table markup: header cells (<th>) name each column for screen readers.',
      '1.4.3': TEXT_CONTRAST,
    },
  },
  Tag: {
    meets: {
      '1.4.1': 'The tag\'s words say its meaning; the color only supports them.',
      '1.4.3': 'Each tone\'s text is a theme role checked at 4.5:1, and the test measures it on the tag\'s own tinted fill.',
    },
  },
  Text: {
    meets: {
      '1.4.3': 'The default and muted tones are 4.5:1 or more in every theme. The subtle tone is 3:1: keep it for large text and hints.',
    },
  },
  Title: {
    meets: {
      '1.3.1': 'Real headings (<h1> to <h6>), so the page\'s outline is there for screen readers.',
      '1.4.3': TEXT_CONTRAST,
    },
  },
  Tree: {
    meets: {
      '1.3.1': 'A WAI-ARIA tree: each row says its level and its place among its siblings.',
      '1.4.3': TEXT_CONTRAST,
      '2.1.1': 'One Tab stop; ↑ ↓ Home End move, → and ← go to child and parent rows, Enter or Space picks.',
      '2.4.7': 'A 2px accent ring on keyboard focus.',
      '2.5.8': 'Every row is at least 24 pixels tall.',
      '4.1.2': 'Rows are tree items with aria-selected on the active one.',
    },
  },
};
