import React from 'react';
import ReactDOM from 'react-dom';
// Fonts are self-hosted (bundled from @fontsource, served from this site):
// no request ever goes to Google. Inter for text, as one variable font (every
// weight from 100 to 900 in one file, so weight can animate), JetBrains Mono for code.
import '@fontsource-variable/inter/wght.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
// The docs offer every theme, so they load all of them (an app loads only the ones it offers).
import '@nurvus/ui/themes/all.css';
import App from './App';
import './styles.scss';

ReactDOM.render(<App />, document.getElementById('root'));
