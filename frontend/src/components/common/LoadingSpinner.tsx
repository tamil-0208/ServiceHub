import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>
        ⏳
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
};
