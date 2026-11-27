import React from 'react';
import { themes } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { useRoute, href } from './router';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import AddComponent from './pages/AddComponent';
import ApplyingTheme from './pages/ApplyingTheme';
import Spacing from './pages/Spacing';
import ComponentsIndex from './pages/ComponentsIndex';
import ComponentPage, { IsolatedExample } from './pages/ComponentPage';
import ThemesOverview from './pages/ThemesOverview';
import ThemePage from './pages/ThemePage';

/**
 * Which page a route shows. Each theme and component page has its own key, so
 * moving between them builds a fresh page (no state or color transitions
 * carried over from the previous one).
 */
function resolve(route) {
  const [section, name, kind, index] = route;
  if (!section) return { page: <Home />, title: 'Overview', current: href() };
  if (section === 'Guides' && name === 'Applying a theme' && !kind) return { page: <ApplyingTheme />, title: name, current: href('Guides', name) };
  if (section === 'Foundations' && name === 'Spacing' && !kind) return { page: <Spacing />, title: name, current: href('Foundations', name) };
  // Contributing (for people building the library). #/Guides/Add a component was its first address.
  if ((section === 'Contributing' || section === 'Guides') && name === 'Add a component' && !kind) {
    return { page: <AddComponent />, title: name, current: href('Contributing', name) };
  }
  if (section === 'Themes' && !name) return { page: <ThemesOverview />, title: 'Themes', current: href('Themes') };
  if (section === 'Themes' && name && !kind) {
    const theme = themes.find((t) => t.name === name);
    if (theme) return { page: <ThemePage key={ theme.id } id={ theme.id } />, title: theme.name, current: href('Themes', name) };
  }
  if (section === 'Components' && !name) return { page: <ComponentsIndex />, title: 'Components', current: href('Components') };
  if (section === 'Components' && name) {
    const component = components.find((c) => c.name === name);
    if (component && !kind) return { page: <ComponentPage key={ component.name } component={ component } />, title: name, current: href('Components', name) };
    if (component && kind === 'example' && index !== undefined) return { isolated: <IsolatedExample component={ component } index={ Number(index) } />, title: `${name} example ${index}` };
  }
  return { page: <NotFound path={ route } />, title: 'Not found', current: null };
}

export default function App() {
  const route = useRoute();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { page, isolated, title, current } = resolve(route);

  React.useEffect(() => {
    document.title = `${title} · NURVUS UI`;
    window.scrollTo(0, 0);
  }, [title]);

  // "Open isolated": one example alone, no header or sidebar.
  if (isolated) return <main className="dx-isolated">{ isolated }</main>;

  return (
    <>
      <Header menuOpen={ menuOpen } onMenu={ () => setMenuOpen((open) => !open) } />
      <div className="dx-layout">
        <Sidebar current={ current } open={ menuOpen } onNavigate={ () => setMenuOpen(false) } />
        <div className="dx-scrim" data-open={ menuOpen } onClick={ () => setMenuOpen(false) } />
        <main className="dx-main">{ page }</main>
      </div>
    </>
  );
}
