import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary';
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext';

function ErrorFallback({ error }) {
  return (
    <div style={{ 
      padding: '20px', 
      color: 'red', 
      backgroundColor: 'white',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px'
    }}>
      <h1>Something went wrong</h1>
      <p style={{ whiteSpace: 'pre-wrap' }}>{error.message}</p>
      <p>Error Stack: {error.stack}</p>
    </div>
  );
}

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found!');
    document.body.innerHTML = '<div style="color: red; padding: 20px;">Root element not found!</div>';
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ErrorBoundary>
      </StrictMode>,
    )
  }
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    Error rendering app: ${error.message}
  </div>`;
}
