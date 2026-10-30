import React from 'react';
import { LocaleProvider } from './i18n/locale';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Upcoming from './pages/Upcoming';
import UpcomingTools from './pages/UpcomingTools';
import Tools from './pages/Tools';
import ContrastTool from './pages/ContrastTool';
import TypographyTool from './pages/TypographyTool';
import DesignStyles from './pages/DesignStyles';
import PatternDetail from './pages/AnimationDetail';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Licenses from './pages/Licenses';
import SearchResults from './pages/SearchResults';
import BestPractices from './pages/BestPractices';

const App: React.FC = () => {
  return (
    <LocaleProvider><HashRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/browse" element={<Layout><Browse /></Layout>} />
        <Route path="/upcoming" element={<Layout><Upcoming /></Layout>} />
        <Route path="/tools/upcoming" element={<Layout><UpcomingTools /></Layout>} />
        <Route path="/tools" element={<Layout><Tools /></Layout>} />
        <Route path="/tools/contrast" element={<Layout><ContrastTool /></Layout>} />
        <Route path="/tools/typography" element={<Layout><TypographyTool /></Layout>} />
        <Route path="/styles" element={<Layout><DesignStyles /></Layout>} />
        <Route path="/search" element={<Layout><SearchResults /></Layout>} />
        <Route path="/p/:id" element={<Layout showNav={false}><PatternDetail /></Layout>} />
        <Route path="/a/:id" element={<Layout showNav={false}><PatternDetail /></Layout>} />
        <Route path="/collections" element={<Layout><Collections /></Layout>} />
        <Route path="/collections/:id" element={<Layout showNav={false}><CollectionDetail /></Layout>} />
        <Route path="/saved" element={<Navigate to="/collections" replace />} />
        <Route path="/licenses" element={<Layout><Licenses /></Layout>} />
        <Route path="/guide" element={<Layout showNav={false}><BestPractices /></Layout>} />
        <Route path="/settings" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter></LocaleProvider>
  );
};

export default App;
