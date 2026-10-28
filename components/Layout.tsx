import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {useLocale} from '../i18n/locale';

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
  <Link to={path} className={`flex flex-col items-center gap-1 w-14 transition-colors ${isActive ? 'text-primary' : 'text-ink/40 hover:text-ink'}`}>
    <span className={`material-symbols-outlined text-[26px] ${isActive ? 'filled' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium font-body">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const location = useLocation();
  const {locale,setLocale,txt}=useLocale();

  return (
    <div className="bg-paper text-ink min-h-screen flex flex-col font-display antialiased selection:bg-primary selection:text-paper pb-24 max-w-md mx-auto border-x border-ink-border shadow-paper-lg relative">
      <div className="flex items-center justify-end gap-2 border-b border-ink-border px-5 py-2">
        <label htmlFor="site-locale" className="text-xs font-semibold">{txt('Language','表示言語')}</label>
        <select id="site-locale" value={locale} onChange={e=>setLocale(e.target.value==='ja'?'ja':'en')}
          className="rounded border border-ink-border bg-surface px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-primary">
          <option value="en">English</option><option value="ja">日本語</option>
        </select>
      </div>
      {/* Main Content */
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-paper/95 backdrop-blur-lg border-t border-ink/5 px-6 py-3 flex justify-between items-end z-50 safe-area-pb shadow-[0_-4px_10px_-4px_rgba(51,34,0,0.05)] max-w-md">
          <BottomNavItem icon="home" label={txt('Home','ホーム')} path="/" isActive={location.pathname === '/'} />
          <BottomNavItem icon="manage_search" label={txt('Browse','探す')} path="/browse" isActive={location.pathname === '/browse'} />
          <BottomNavItem icon="bookmarks" label={txt('Saved','保存')} path="/saved" isActive={location.pathname === '/saved'} />
          <BottomNavItem icon="copyright" label={txt('License','ライセンス')} path="/licenses" isActive={location.pathname === '/licenses'} />
        </div>
      )}
    </div>
  );
};

export default Layout;