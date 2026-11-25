import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const destinations = [
  { path: '/', label: 'ホーム', icon: 'home' },
  { path: '/browse', label: 'パターン', icon: 'manage_search' },
  { path: '/styles', label: 'スタイル', icon: 'palette' },
  { path: '/tools', label: 'ツール', icon: 'tune' },
  { path: '/licenses', label: '利用条件', icon: 'copyright' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const section = /^\/(p|a|guide|collections|upcoming)(\/|$)/.test(location.pathname)
    ? '/browse' : '/' + location.pathname.split('/')[1];

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col border-x border-ink-border bg-paper pb-[calc(6rem+env(safe-area-inset-bottom))] font-display text-ink antialiased shadow-paper-lg selection:bg-primary selection:text-paper md:pb-6">
      <nav aria-label="メインナビゲーション" className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-3xl items-stretch border-t border-ink-border bg-paper/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:sticky md:top-0 md:bottom-auto md:border-t-0 md:border-b md:px-5 md:py-2">
        {destinations.map(({ path, label, icon }) => (
          <Link key={path} to={path} aria-current={section === path ? 'page' : undefined}
            className="motion-control flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded px-1 text-center text-xs text-ink/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[current=page]:font-bold aria-[current=page]:text-ink forced-colors:aria-[current=page]:underline md:flex-row md:gap-2 md:text-sm">
            <span aria-hidden="true" className={`material-symbols-outlined text-[24px] ${section === path ? 'filled' : ''}`}>{icon}</span>
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
