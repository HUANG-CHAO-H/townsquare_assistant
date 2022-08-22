import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const rootDiv = document.createElement('div');
rootDiv.id = 'root';
document.body.appendChild(rootDiv);

ReactDOM.createRoot(rootDiv).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
