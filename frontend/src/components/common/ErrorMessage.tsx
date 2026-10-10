import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="banner banner-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <strong>{title}:</strong> {message}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline btn-sm" style={{ borderColor: '#fca5a5' }}>
          Retry
        </button>
      )}
    </div>
  );
};
