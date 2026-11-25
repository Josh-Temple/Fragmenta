import React, { useLayoutEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigationType } from 'react-router-dom';

const sections = [
  { path: '/', label: 'ホーム' },
  { path: '/composition?view=atlas', label: '構図' },
  { path: '/styles', label: 'スタイル' },
  { path: '/browse', label: 'パターン' },
  { path: '/tools', label: 'ツール' },
  { path: '/licenses', label: '利用条件' },
];

const Layout: React.FC<{ children: React.ReactNode; showNav?: boolean }> = ({ children, showNav = true }) => {
  const location = useLocation();
  const path = location.pathname;
  const action = useNavigationType();
  const previousPath = useRef<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const changedPage = previousPath.current !== path;
    previousPath.current = path;
    if (changedPage && action === 'PUSH') {
      window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
    }
  }, [path, action]);

  const gallery = ['/', '/composition', '/browse', '/styles'].includes(path);
  const wide = path.startsWith('/tools') || path === '/search' || path.startsWith('/knowledge');
  return (
    <div className={'site-shell font-display antialiased' + (showNav ? ' with-navigation' : '')}>
      <a className="site-skip" href="#main-content" onClick={event => {
        event.preventDefault();
        mainRef.current?.focus();
      }}>本文へ移動</a>
      <header className="site-masthead">
        <div className="masthead-inner">
          <Link to="/" className="site-brand" aria-label="Fragmenta ホーム">
            <span className="brand-mark" aria-hidden="true" /><span lang="en">Fragmenta</span>
          </Link>
          {showNav && <nav className="site-nav" aria-label="メインナビゲーション">
            {sections.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'}>{item.label}</NavLink>)}
          </nav>}
        </div>
      </header>
      <main id="main-content" ref={mainRef} tabIndex={-1} key={location.pathname}
        className={'page-enter site-main ' + (gallery ? 'gallery-width' : wide ? 'reference-width' : 'reading-width')}>
        {children}
      </main>
    </div>
  );
};
export default Layout;
