import React from 'react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '420px', margin: '2rem auto' }} className="card">
      <h2 className="card-title">Sign In</h2>
      <p className="card-subtitle">
        Enter your credentials to access your Hypermarketplace account.
      </p>
      <div className="banner banner-info" style={{ marginTop: '1rem' }}>
        <span>ℹ️</span>
        <span>Login form implementation will be wired up in the next auth stage.</span>
      </div>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};
