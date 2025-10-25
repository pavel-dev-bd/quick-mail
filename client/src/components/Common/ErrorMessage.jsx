import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message" style={{
      background: '#f8d7da',
      color: '#721c24',
      padding: '0.75rem',
      borderRadius: '5px',
      marginBottom: '1rem',
      border: '1px solid #f5c6cb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#721c24',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;