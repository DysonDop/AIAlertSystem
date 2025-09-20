import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation.jsx';

const Layout = () => {
  return (
    <div className="page">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
