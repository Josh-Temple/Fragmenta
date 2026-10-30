import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLocale } from '../i18n/locale';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean; // Control visibility of bottom navigation
}

const BottomNavItem: React.FC<{
  icon: string;
  label: string;
  path: string;
  isActive: boolean;
}> = ({ icon, label, path, isActive }) => (
  <Link to={path} aria-current={isActive ? 'page' : undefined} className={`flex min-h-11 flex-col items-center gap-1 w-14 rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${isActive ? 'text-ink font-bold' : 'text-ink/70 hover:text-ink'}`}>
    <span aria-hidden="true" className={`material-symbols-outlined text-[26px] ${isActive ? 'filled' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium font-body">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const location = useLocation();
  const { locale, setLocale, txt } = useLocale();
  const wide = location.pathname.startsWith('/tools') || location.pathname === '/search' || location.pathname === '/styles';

  return (
    <div className={`bg-paper text-ink min-h-screen flex flex-col font-display antialiased selection:bg-primary selection:text-paper pb-24 ${wide ? 'max-w-3xl' : 'max-w-md'} mx-auto border-x border-ink-border shadow-paper-lg relative`}>
      <div className="flex min-h-11 items-center justify-end gap-2 border-b border-ink-border px-5 py-2">
        <label htmlFor="site-locale" className="text-xs font-semibold">{txt('Display language', '表示言語')}</label>
        <select id="site-locale" value={locale} onChange={event => setLocale(event.target.value === 'ja' ? 'ja' : 'en')}
          className="min-h-11 rounded border border-ink-border bg-surface px-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          <option value="en">English</option><option value="ja">日本語</option>
        </select>
      </div>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <nav aria-label={txt('Main navigation','主なナビゲーション')} className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-paper/95 backdrop-blur-lg border-t border-ink/5 px-4 py-3 flex justify-between items-end z-50 safe-area-pb shadow-[0_-4px_10px_-4px_rgba(51,34,0,0.05)] ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
          <BottomNavItem icon="home" label={txt('Home','ホーム')} path="/" isActive={location.pathname === '/'} />
          <BottomNavItem icon="manage_search" label={txt('Browse','探す')} path="/browse" isActive={location.pathname === '/browse'} />
          <BottomNavItem icon="palette" label={txt('Styles','スタイル')} path="/styles" isActive={location.pathname === '/styles'} />
          <BottomNavItem icon="tune" label={txt('Tools','ツール')} path="/tools" isActive={location.pathname.startsWith('/tools')} />
          <BottomNavItem icon="copyright" label={txt('License','利用条件')} path="/licenses" isActive={location.pathname === '/licenses'} />
        </nav>
      )}
    </div>
  );
};

export default Layout;
