import React from 'react';
import { Button } from '@nurvus/ui';

const KEY = 'nurvus-theme';

/**
 * Flips the whole design system between the light default and the
 * Tokyo Night dark theme by toggling `data-theme="dark"` on <html>.
 * The token pipeline (build-tokens.js) emits a `:root[data-theme="dark"]`
 * block, and SCSS `$--` vars resolve to runtime `var(--…)`, so every
 * token-driven component re-themes live. Choice persists in localStorage.
 */
class ThemeToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { theme: 'light' };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    let saved = 'light';
    try { saved = localStorage.getItem(KEY) || 'light'; } catch (e) { /* no storage */ }
    this.apply(saved);
    this.setState({ theme: saved });
  }

  apply(next) {
    const root = document.documentElement;
    if (next === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  toggle() {
    const next = this.state.theme === 'dark' ? 'light' : 'dark';
    this.apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* no storage */ }
    this.setState({ theme: next });
  }

  render() {
    const dark = this.state.theme === 'dark';
    return (
      <Button size="small" onClick={ this.toggle }>
        { dark ? '☀ Light' : '☾ Dark' }
      </Button>
    );
  }
}

export default ThemeToggle;
