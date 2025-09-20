import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import MapPage from './pages/MapPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
