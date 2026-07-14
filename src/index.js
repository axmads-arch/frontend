import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Service Worker ro'yxatga olish
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW error:', err));
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
