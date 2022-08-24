import React from 'react'
import ReactDOM from 'react-dom/client'

const rootDiv = document.createElement('div');
rootDiv.id = 'root';
document.body.appendChild(rootDiv);

ReactDOM.createRoot(rootDiv).render(
  <React.StrictMode>
      <div>hello world</div>
  </React.StrictMode>
)
