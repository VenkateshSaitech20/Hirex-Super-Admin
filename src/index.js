import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StyleSheetManager } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import '../src/Style.css';
import { SessionStorageProvider } from 'context/SessionStorageContext';

const shouldForwardProp = (prop) => !/^sortActive$/.test(prop);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <SessionStorageProvider>
        <App />
      </SessionStorageProvider>
    </StyleSheetManager>,
  </React.StrictMode>
);
