import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import { ErrorBoundary } from 'react-error-boundary';
import styles from './App.module.css';

function ErrorFallback({ error }) {
  return (
    <div style={{ 
      padding: '20px', 
      color: 'red', 
      backgroundColor: 'white',
      margin: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <pre style={{ 
        overflow: 'auto',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>{error.stack}</pre>
    </div>
  );
}

function App() {
  return (
    <div className={styles.appWrapper}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/home" element={<HomePage/>}/>
          </Routes>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;