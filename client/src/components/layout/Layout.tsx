import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // Sidebar should always be visible whenever the user is logged in
  const showSidebar = isAuthenticated;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        {showSidebar && <Sidebar />}
        <main style={{ flex: 1, padding: '2rem 1.5rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
