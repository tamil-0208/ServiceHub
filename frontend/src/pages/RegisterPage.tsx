import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }} className="card">
      <h2 className="card-title">Create an Account</h2>
      <p className="card-subtitle">
        Join Hypermarketplace as a Customer or Service Provider.
      </p>
      <div className="banner banner-info" style={{ marginTop: '1rem' }}>
        <span>ℹ️</span>
        <span>Registration form implementation will be wired up in the next auth stage.</span>
      </div>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
};
