import React, { useState, useEffect, Suspense } from 'react';
import './App.css';
import ErrorBoundary            from '@/components/ui/ErrorBoundary';
import { API_DASHBOARD_TITLE }  from '@/config'
import { ToastContainer }       from 'react-toastify';


function App() {  
  return (
    <ErrorBoundary>
      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
      />
      <div className="frontend">
        <header className="frontend-header grid grid-cols-3 items-center">
          <div />
          <h1 className="frontend-title text-center">{API_DASHBOARD_TITLE}</h1>
          <div className="frontend-icons flex justify-end space-x-3">
            <button><i className="fas fa-cog" /></button>
            <button><i className="fas fa-bell" /></button>
          </div>
        </header>
        <main className="frontend-main justify-center">
          <div className="card-grid">
            {cards.map(renderCard)}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
