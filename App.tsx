import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Upcoming from './pages/Upcoming';
import UpcomingTools from './pages/UpcomingTools';
import Tools from './pages/Tools';
import ContrastTool from './pages/ContrastTool';
import TypographyTool from './pages/TypographyTool';
const DesignStyles = React.lazy(() => import('./pages/DesignStyles'));
const KnowledgeBase = React.lazy(() => import('./pages/KnowledgeBase'));
const KnowledgeDetail = React.lazy(() => import('./pages/KnowledgeDetail'));
const PatternDetail = React.lazy(() => import('./pages/AnimationDetail'));
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Licenses from './pages/Licenses';
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
import BestPractices from './pages/BestPractices';

const App: React.FC = () => {
  return (
    <HashRouter>
      <React.Suspense fallback={<p role="status" className="p-5 text-sm">ページを読み込んでいます…</p>}>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/browse" element={<Layout><Browse /></Layout>} />
        <Route path="/upcoming" element={<Layout><Upcoming /></Layout>} />
        <Route path="/tools/upcoming" element={<Layout><UpcomingTools /></Layout>} />
        <Route path="/tools" element={<Layout><Tools /></Layout>} />
        <Route path="/tools/contrast" element={<Layout><ContrastTool /></Layout>} />
        <Route path="/tools/typography" element={<Layout><TypographyTool /></Layout>} />
        <Route path="/styles" element={<Layout><DesignStyles /></Layout>} />
        <Route path="/knowledge" element={<Layout><KnowledgeBase /></Layout>} />
        <Route path="/knowledge/:id" element={<Layout><KnowledgeDetail /></Layout>} />
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
      </React.Suspense>
    </HashRouter>
  );
};

export default App;
