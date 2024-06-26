import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './db/db.tsx';
import './events/EventBus.tsx';
import './flex.css';
import './index.css';
import router from './router/Router.tsx';

const rootEl = document.getElementById('root');

const root = ReactDOM.createRoot(rootEl!, {
  onRecoverableError(error) {
    console.error(error);
  },
});

root.render(
  <>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </>
);
