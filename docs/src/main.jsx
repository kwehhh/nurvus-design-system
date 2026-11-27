import React from 'react';
import ReactDOM from 'react-dom';
// Fonts are self-hosted (bundled from @fontsource, served from this site):
// no request ever goes to Google. Inter 400-700 for text, JetBrains Mono for code.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import App from './App';
import './styles.scss';

ReactDOM.render(<App />, document.getElementById('root'));
