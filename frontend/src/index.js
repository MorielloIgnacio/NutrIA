import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';  // Asegúrate de que apunte a la ubicación correcta
import App from './App';  // Asegúrate de que el App.js se importe aquí

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Asegúrate de que el elemento "root" esté en tu index.html
);
