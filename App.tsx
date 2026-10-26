import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Upcoming from './pages/Upcoming';
import UpcomingTools from './pages/UpcomingTools';
import PatternDetail from './pages/AnimationDetail';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Licenses from './pages/Licenses';
import SearchResults from './pages/SearchResults';
import BestPractices from './pages/BestPractices';

const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-ink/60">This section is coming soon.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/browse" element={<Layout><Browse /></Layout>} />
        <Route path="/upcoming" element={<Layout><Upcoming /></Layout>} />
        <Route path="/tools/upcoming" element={<Layout><UpcomingTools /></Layout>} />
        <Route path="/search" element={<Layout><SearchResults /></Layout>} />
        <Route path="/p/:id" element={<Layout showNav={false}><PatternDetail /></Layout>} />
        <Route path="/a/:id" element={<Layout showNav={false}><PatternDetail /></Layout>} />
        <Route path="/collections" element={<Layout><Collections /></Layout>} />
        <Route path="/collections/:id" element={<Layout showNav={false}><CollectionDetail /></Layout>} />
        <Route path="/saved" element={<Layout><Placeholder title="Saved Items" /></Layout>} />
        <Route path="/licenses" element={<Layout><Licenses /></Layout>} />
        <Route path="/guide" element={<Layout showNav={false}><BestPractices /></Layout>} />
        <Route path="/settings" element={<Layout><Placeholder title="Settings" /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
