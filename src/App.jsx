import React, { useEffect } from 'react';
import './App.scss';
import Dialog from './views/Dialog/Dialog';

function App() {
  useEffect(() => {
    window.addEventListener('load', () => {
      const textarea = document.querySelector('textarea');
      textarea.placeholder = 'Press / to focus. Press Ctrl + / to call helper.';
    });
    function handleKeyDown(event) {
      const textarea = document.querySelector('textarea');
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && event.target !== textarea) {
        event.preventDefault();
        textarea.focus();
      }
    }

    window.addEventListener('keypress', handleKeyDown);
    return () => {
      window.removeEventListener('keypress', handleKeyDown);
    };
  }, []);

  return (
    <Dialog />
  );
}

export default App;
