import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, useLocation } from 'react-router-dom';
import App from './App.jsx';
import { StoreProvider } from './state/store.jsx';
import './styles.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Staff address: hosts that only pass a plain #name (no slash) can still open the console via #reviewer.
if (window.location.hash === '#reviewer') window.location.replace('#/reviewer');

// HashRouter so the built app works on any static host without rewrite rules.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <StoreProvider>
        <ScrollToTop />
        <App />
      </StoreProvider>
    </HashRouter>
  </StrictMode>
);
