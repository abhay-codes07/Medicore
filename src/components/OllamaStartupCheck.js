import React, { useEffect, useState } from 'react';
import { checkOllamaServer } from '../utils/ollamaService';

const OllamaStartupCheck = () => {
  const [status, setStatus] = useState({ checking: true, running: false, error: null });

  useEffect(() => {
    const checkServer = async () => {
      const result = await checkOllamaServer();
      setStatus({ checking: false, ...result });

      if (!result.running) {
        const popup = window.open('', 'Ollama Status', 'width=500,height=400');
        popup.document.write(`
          <html>
            <head>
              <title>Ollama Server Status</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  padding: 2rem;
                  background: #f9fafb;
                  margin: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                }
                .alert {
                  background: #fee2e2;
                  border: 1px solid #ef4444;
                  color: #dc2626;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  margin: 1rem 0;
                }
                .steps {
                  background: white;
                  padding: 1.5rem;
                  border-radius: 0.5rem;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                code {
                  background: #f3f4f6;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.25rem;
                  font-family: monospace;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>⚠️ Ollama Server Not Running</h2>
                <div class="alert">
                  ${result.error}
                </div>
                <div class="steps">
                  <h3>Setup Steps:</h3>
                  <ol>
                    <li>Open PowerShell as Administrator</li>
                    <li>Run: <code>ollama serve</code></li>
                    <li>Run: <code>ollama pull llama2</code></li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            </body>
          </html>
        `);
      }
    };

    checkServer();
  }, []);

  return null; // This component doesn't render anything
};

export default OllamaStartupCheck;