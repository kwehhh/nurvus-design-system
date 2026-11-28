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
  '2.1.1': { name: 'Keyboard', level: 'A', slug: 'keyboard' },
  '2.3.3': { name: 'Animation from Interactions', level: 'AAA', slug: 'animation-from-interactions' },
  '2.4.7': { name: 'Focus Visible', level: 'AA', slug: 'focus-visible' },
  '2.4.8': { name: 'Location', level: 'AAA', slug: 'location' },
  '2.5.8': { name: 'Target Size (Minimum)', level: 'AA', slug: 'target-size-minimum' },
  '4.1.2': { name: 'Name, Role, Value', level: 'A', slug: 'name-role-value' },
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
      '1.3.1': 'Its title is a real heading.',
      '1.4.3': TEXT_CONTRAST,
    },
    gaps: [
      'It is not marked as a dialog yet (role="dialog", aria-modal, a label), so screen readers don\'t announce it as one.',
      'Focus doesn\'t move into it when it opens, stay inside it, or go back when it closes; Esc doesn\'t close it.',
    ],
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
  Layout: {
    note: 'Spacing and alignment only. It adds no criteria of its own; what you put in it decides.',
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
      '1.3.1': 'A <nav> landmark of lists; each chevron is tied to its list (aria-controls).',
      '1.4.1': 'The current page is marked by a bar and bolder text, not by color alone.',
      '1.4.3': TEXT_CONTRAST,
      '2.1.1': 'Tab goes link by link; ↑ ↓ Home End move between rows; → and ← open and close sections.',
      '2.3.3': 'Sections open and close without animation when the system asks for less motion.',
      '2.4.7': 'A 2px accent ring on keyboard focus.',
      '2.4.8': 'The current page is marked, with aria-current="page": readers always know where they are.',
      '2.5.8': 'Every link and chevron is at least 24 by 24 pixels.',
      '4.1.2': 'Chevrons say "Show" or "Hide" and their section, and report expanded or collapsed.',
    },
  },
  Panel: {
    meets: {
      '1.3.1': 'Its title is a real heading (<h3>), so it shows up in a screen reader\'s list of headings.',
      '1.4.3': TEXT_CONTRAST,
    },
  },
  Progress: {
    gaps: [
      'Screen readers can\'t read it yet: it has no progressbar role, label or value (4.1.2).',
      'Its status (success, critical) is shown by color alone (1.4.1): say it in text next to the bar.',
    ],
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
