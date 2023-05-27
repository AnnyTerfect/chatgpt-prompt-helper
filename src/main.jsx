import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'virtual:windi.css';

ReactDOM.createRoot(
  (() => {
    const app = document.createElement('div');
    app.id = 'root';
    document.body.append(app);
    return app;
  })(),
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
