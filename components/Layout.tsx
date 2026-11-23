import React from 'react';
import { useLocation, Link } from 'react-router-dom';

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
  <Link to={path} aria-current={isActive ? 'page' : undefined} className={`motion-control flex min-h-11 flex-col items-center gap-1 w-14 rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${isActive ? 'text-ink font-bold' : 'text-ink/70 hover:text-ink'}`}>
    <span aria-hidden="true" className={`material-symbols-outlined text-[26px] ${isActive ? 'filled' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium font-body">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const location = useLocation();
  const wide = location.pathname.startsWith('/tools') || location.pathname === '/composition' || location.pathname === '/search' || location.pathname.startsWith('/knowledge');

  return (
    <div className={`bg-paper text-ink min-h-screen flex flex-col font-display antialiased selection:bg-primary selection:text-paper pb-24 ${wide ? 'max-w-3xl' : 'max-w-md'} mx-auto border-x border-ink-border shadow-paper-lg relative`}>
      {/* Main Content */}
      <main key={location.pathname} className="page-enter flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <nav aria-label="メインナビゲーション" className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-paper/95 backdrop-blur-lg border-t border-ink/5 px-4 py-3 flex justify-between items-end z-50 safe-area-pb shadow-[0_-4px_10px_-4px_rgba(51,34,0,0.05)] ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
          <BottomNavItem icon="home" label="ホーム" path="/" isActive={location.pathname === '/'} />
          <BottomNavItem icon="manage_search" label="パターン" path="/browse" isActive={location.pathname === '/browse'} />
          <BottomNavItem icon="palette" label="スタイル" path="/styles" isActive={location.pathname === '/styles'} />
          <BottomNavItem icon="tune" label="ツール" path="/tools" isActive={location.pathname.startsWith('/tools')} />
          <BottomNavItem icon="copyright" label="利用条件" path="/licenses" isActive={location.pathname === '/licenses'} />
        </nav>
      )}
    </div>
  );
};

export default Layout;
