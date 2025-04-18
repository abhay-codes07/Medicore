import React from 'react';

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <style jsx>{`
      .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;