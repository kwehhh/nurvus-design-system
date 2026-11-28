import React from 'react';
import { themes } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { useRoute, href } from './router';
import { useFramework, setFramework } from './framework';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import AddComponent from './pages/AddComponent';
import ApplyingTheme from './pages/ApplyingTheme';
import Spacing from './pages/Spacing';
import Typography from './pages/Typography';
import AnimatedType from './pages/AnimatedType';
import Brand from './pages/Brand';
import Icons from './pages/Icons';
import ThemeStudio from './pages/ThemeStudio';
import AccessibilityReport from './pages/AccessibilityReport';
import RespawnGuide from './pages/RespawnGuide';
import ReactGuide from './pages/ReactGuide';
import Review from './pages/Review';
import RespawnComponent from './pages/RespawnComponent';
import SupportedLibraries from './pages/SupportedLibraries';
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
  // Guides that live under Themes. #/Guides/Applying a theme was the first address.
  if ((section === 'Themes' || section === 'Guides') && name === 'Applying a theme' && !kind) return { page: <ApplyingTheme />, title: name, current: href('Themes', name) };
  if (section === 'Themes' && name === 'Theme Studio' && !kind) return { page: <ThemeStudio />, title: name, current: href('Themes', name) };
  if (section === 'Themes' && name === 'Accessibility report' && !kind) return { page: <AccessibilityReport />, title: name, current: href('Themes', name) };
  if (section === 'Foundations' && name === 'Spacing' && !kind) return { page: <Spacing />, title: name, current: href('Foundations', name) };
  if (section === 'Foundations' && name === 'Typography' && !kind) return { page: <Typography />, title: name, current: href('Foundations', name) };
  if (section === 'Foundations' && name === 'Icons' && !kind) return { page: <Icons />, title: name, current: href('Foundations', name) };
  if (section === 'Foundations' && name === 'Brand' && !kind) return { page: <Brand />, title: name, current: href('Foundations', name) };
  if (section === 'Foundations' && name === 'Animated type' && !kind) return { page: <AnimatedType />, title: name, current: href('Foundations', name) };
  // Choices for the owner to review (round 8); not in the sidebar.
  if (section === 'Review' && !name) return { page: <Review />, title: 'Review', current: null };
  if (section === 'Guides' && name === 'React' && !kind) return { page: <ReactGuide />, title: 'React', current: href('Guides', 'React') };
  if (section === 'Guides' && name === 'Supported libraries' && !kind) return { page: <SupportedLibraries />, title: name, current: href('Guides', name) };
  // Respawn: the guide, then one page per component. #/Guides/Respawn was its first address.
  if ((section === 'Respawn' && !name) || (section === 'Guides' && name === 'Respawn' && !kind)) return { page: <RespawnGuide />, title: 'Respawn', current: href('Respawn') };
  if (section === 'Respawn' && name && !kind) {
    const component = components.find((c) => c.name === name);
    if (component) return { page: <RespawnComponent key={ `respawn-${name}` } component={ component } />, title: `${name} (Respawn)`, current: href('Respawn', name), framework: 'respawn' };
  }
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
    if (component && !kind) return { page: <ComponentPage key={ component.name } component={ component } />, title: name, current: href('Components', name), framework: 'react' };
    if (component && kind === 'example' && index !== undefined) return { isolated: <IsolatedExample component={ component } index={ Number(index) } />, title: `${name} example ${index}` };
  }
  return { page: <NotFound path={ route } />, title: 'Not found', current: null };
}

const PHONE = '(max-width: 760px)';
const NAV_KEY = 'nurvus.docs.nav';

/** True while the window is phone-width (the sidebar is a drawer). */
function usePhone() {
  const [phone, setPhone] = React.useState(() => window.matchMedia(PHONE).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const onChange = () => setPhone(mq.matches);
    mq.addListener(onChange); // addListener: Safari < 14 has no addEventListener here
    return () => mq.removeListener(onChange);
  }, []);
  return phone;
}

export default function App() {
  const route = useRoute();
  const phone = usePhone();
  const [menuOpen, setMenuOpen] = React.useState(false);
  // Desktop: the sidebar can be collapsed so the page gets the full width. Remembered.
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return window.localStorage.getItem(NAV_KEY) === 'collapsed'; } catch (e) { return false; }
  });
  const toggleNav = () => {
    if (phone) { setMenuOpen((open) => !open); return; }
    setCollapsed((was) => {
      try { window.localStorage.setItem(NAV_KEY, was ? 'shown' : 'collapsed'); } catch (e) { /* storage blocked */ }
      return !was;
    });
  };
  const { page, isolated, title, current, framework: pageFramework } = resolve(route);
  // A component page in one framework makes it the reader's choice; the sidebar follows.
  const chosen = useFramework();
  const framework = pageFramework || chosen;
  React.useEffect(() => { if (pageFramework) setFramework(pageFramework); }, [pageFramework]);

  React.useEffect(() => {
    document.title = `${title} · NURVUS UI`;
    window.scrollTo(0, 0);
  }, [title]);

  // "Open isolated": one example alone, no header or sidebar.
  if (isolated) return <main className="dx-isolated">{ isolated }</main>;

  return (
    <>
      <Header navShown={ phone ? menuOpen : !collapsed } phone={ phone } onMenu={ toggleNav } />
      <div className="dx-layout" data-nav={ collapsed ? 'collapsed' : 'shown' }>
        <Sidebar current={ current } framework={ framework } open={ menuOpen } onNavigate={ () => setMenuOpen(false) } />
        <div className="dx-scrim" data-open={ menuOpen } onClick={ () => setMenuOpen(false) } />
        <main className="dx-main">{ page }</main>
      </div>
    </>
  );
}
