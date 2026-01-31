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
  <Link to={path} className={`flex flex-col items-center gap-1 w-14 transition-colors ${isActive ? 'text-primary' : 'text-ink/40 hover:text-ink'}`}>
    <span className={`material-symbols-outlined text-[26px] ${isActive ? 'filled' : ''}`}>{icon}</span>
    <span className="text-[10px] font-medium font-body">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const location = useLocation();

  return (
    <div className="bg-paper text-ink min-h-screen flex flex-col font-display antialiased selection:bg-primary selection:text-paper pb-24 max-w-md mx-auto border-x border-ink-border shadow-paper-lg relative">
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-paper/95 backdrop-blur-lg border-t border-ink/5 px-6 py-3 flex justify-between items-end z-50 safe-area-pb shadow-[0_-4px_10px_-4px_rgba(51,34,0,0.05)] max-w-md">
          <BottomNavItem icon="home" label="Home" path="/" isActive={location.pathname === '/'} />
          <BottomNavItem icon="manage_search" label="Browse" path="/browse" isActive={location.pathname === '/browse'} />
          <BottomNavItem icon="bookmarks" label="Saved" path="/saved" isActive={location.pathname === '/saved'} />
          <BottomNavItem icon="copyright" label="License" path="/licenses" isActive={location.pathname === '/licenses'} />
        </div>
      )}
    </div>
  );
};

export default Layout;