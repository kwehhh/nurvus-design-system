Undo history, newest first. Click a row to jump to it: the rows above it fade (undone, one click redoes), and the bottom row returns to the start.
```jsx
import { HistoryList } from '@nurvus/ui';

const now = Date.now();
const steps = [
  { id: 1, label: 'Hide layer', detail: 'triforce', time: now - 9000 },
  { id: 2, label: 'Delete layer', detail: 'zelda_dark_shadow', time: now - 6000 },
  { id: 3, label: 'Rename layer', detail: 'cloud', time: now - 3000 },
  { id: 4, label: 'Edit class', detail: '.me404', time: now }
];

const MyApp = () => {
  const [index, setIndex] = React.useState(steps.length);

  return (
    <div style={ { maxWidth: 320 } }>
      <HistoryList steps={ steps } index={ index } onJump={ setIndex } />
    </div>
  );
}
<MyApp />
```

Nothing to show yet: with no steps it renders nothing, so the host can show its own empty message.
```jsx
import { HistoryList } from '@nurvus/ui';

<HistoryList steps={ [] } index={ 0 } />
```
