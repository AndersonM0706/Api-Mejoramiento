import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Puedes tener estilos globales aquí

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);