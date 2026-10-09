import React, { type ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Hypermarketplace — Hyperlocal Services Platform</p>
      </footer>
    </div>
  );
};
