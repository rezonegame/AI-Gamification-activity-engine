import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.tsx';
import { LanguageProvider } from './src/contexts/LanguageContext.tsx';
import { initializeI18n } from './src/i18n.ts';

// Make the startup function synchronous as i18n is now loaded statically
function startApp() {
  const rootElement = document.getElementById('root');

  // Initialize the i18n system directly. No await needed.
  initializeI18n();

  // Only mount the app if the root element actually exists.
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </React.StrictMode>
    );
  } else {
    // If loaded on a page without a #root div (e.g., marketing pages),
    // just log a warning for developers, don't throw an error.
    console.warn("React script loaded, but no #root element found to mount to. This is expected on non-app pages.");
  }
}

// Start the app
startApp();