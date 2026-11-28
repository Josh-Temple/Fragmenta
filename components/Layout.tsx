import React from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';

const destinations = [
  { path: '/', label: 'ホーム', icon: 'M3 10.5 12 3l9 7.5M5 9v12h5v-7h4v7h5V9' },
  { path: '/browse', label: 'パターン', icon: 'M3 5h15M3 10h5M3 15h4M19 18l3 3M20 14a5 5 0 1 1-10 0 5 5 0 1 1 10 0Z' },
  { path: '/styles', label: 'スタイル', icon: 'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.4-3.4 1.7 1.7 0 0 1 1.2-2.9H18a3 3 0 0 0 3-3C21 7 17 3 12 3ZM7 11h.1M10 7.5h.1M15 8h.1' },
  { path: '/tools', label: 'ツール', icon: 'M3 7h18M8 4v6M3 17h18M16 14v6' },
  { path: '/licenses', label: '利用条件', icon: 'M21 12a9 9 0 1 1-18 0 9 9 0 1 1 18 0ZM15.2 8.8a4.5 4.5 0 1 0 0 6.4' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPath = React.useRef<string | null>(null);
  React.useLayoutEffect(() => {
    if (navigationType === 'PUSH' && previousPath.current !== location.pathname && !location.hash) {
      window.scrollTo(0, 0);
    }
    previousPath.current = location.pathname;
  }, [location.pathname, location.hash, navigationType]);

  const section = /^\/(p|a|guide|collections|upcoming)(\/|$)/.test(location.pathname)
    ? '/browse' : '/' + location.pathname.split('/')[1];

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col border-x border-ink-border bg-paper pb-[calc(6rem+env(safe-area-inset-bottom))] font-display text-ink antialiased shadow-paper-lg selection:bg-primary selection:text-paper md:pb-6">
      <nav aria-label="メインナビゲーション" className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-3xl items-stretch border-t border-ink-border bg-paper/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:sticky md:top-0 md:bottom-auto md:border-t-0 md:border-b md:px-5 md:py-2">
        {destinations.map(({ path, label, icon }) => (
          <Link key={path} to={path} aria-current={section === path ? 'page' : undefined}
            className="motion-control flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded px-1 text-center text-xs text-ink/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[current=page]:font-bold aria-[current=page]:text-ink forced-colors:aria-[current=page]:underline md:flex-row md:gap-2 md:text-sm">
            <svg aria-hidden="true" focusable="false" className="size-6 shrink-0" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={section === path ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d={icon} />
            </svg>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <main key={location.pathname} className="page-enter flex min-w-0 flex-1 flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;
