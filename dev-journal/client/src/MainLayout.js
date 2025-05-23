import React from 'react';
import './MainLayout.css';
import BottomNav from './BottomNav';

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <div className="main-content">{children}</div>
      <BottomNav />
    </div>
  );
}

export default MainLayout;
