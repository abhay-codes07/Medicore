import React, { useState } from 'react';
import { checkOllamaStatus } from '../utils/ollamaCheck';

const OllamaStatusButton = () => {
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const status = await checkOllamaStatus();
      
      const popup = window.open('', 'Ollama Status', 'width=400,height=300');
      popup.document.write(`
        <html>
          <head>
            <title>Ollama Server Status</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                padding: 1.5rem;
                background: #f9fafb;
                margin: 0;
              }
              .status-card {
                background: white;
                padding: 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .status-indicator {
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                font-weight: 600;
                text-align: center;
                margin-bottom: 1rem;
              }
              .status-online {
                background: #d1fae5;
                color: #065f46;
              }
              .status-offline {
                background: #fee2e2;
                color: #991b1b;
              }
              .models-list {
                margin-top: 1rem;
                padding: 1rem;
                background: #f3f4f6;
                border-radius: 0.25rem;
              }
            </style>
          </head>
          <body>
            <div class="status-card">
              <h2>Ollama Server Status</h2>
              <div class="status-indicator ${status.running ? 'status-online' : 'status-offline'}">
                ${status.running ? '🟢 Server Online' : '🔴 Server Offline'}
              </div>
              ${status.running 
                ? `<div>
                    <h3>Available Models:</h3>
                    <div class="models-list">
                      <pre>${JSON.stringify(status.models, null, 2)}</pre>
                    </div>
                  </div>`
                : `<div style="color: #991b1b">
                    ${status.error}
                    <p>To start Ollama:</p>
                    <ol>
                      <li>Open PowerShell as Administrator</li>
                      <li>Run: <code>ollama serve</code></li>
                    </ol>
                  </div>`
              }
              <div style="margin-top: 1rem; color: #6b7280; font-size: 0.875rem;">
                Last checked: ${new Date().toLocaleString()}
              </div>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error checking Ollama status:', error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <button
      onClick={handleCheckStatus}
      disabled={checking}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: checking ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        transition: 'transform 0.2s',
        opacity: checking ? 0.7 : 1
      }}
      onMouseOver={(e) => !checking && (e.currentTarget.style.transform = 'translateX(-50%) scale(1.02)')}
      onMouseOut={(e) => !checking && (e.currentTarget.style.transform = 'translateX(-50%) scale(1)')}
    >
      {checking ? (
        <>
          <span className="animate-spin">⌛</span>
          Checking...
        </>
      ) : (
        <>
          <span>🔄</span>
          Check Ollama Status
        </>
      )}
    </button>
  );
};

export default OllamaStatusButton;