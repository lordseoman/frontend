// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// If these are already in your project, keep your import paths:
import ErrorBoundary from '@/components/ui/ErrorBoundary.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <ToastContainer position="top-right" newestOnTop />
    </ErrorBoundary>
  </React.StrictMode>
);
