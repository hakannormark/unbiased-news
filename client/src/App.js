import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import ArticlePage from './ArticlePage';

function DebugLocation() {
  const location = useLocation();
  console.log('Navigated to:', location.pathname);
  return null;
}

function App() {
  return (
    <Router>
      <DebugLocation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:url" element={<ArticlePage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;