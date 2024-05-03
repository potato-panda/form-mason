import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import FormEditor from '../views/form/FormEditor';
import { FormList } from '../views/form/FormList';
import { LiveForm } from '../views/form/LiveForm';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      ErrorBoundary: () => <p>Error</p>,
      children: [
        {
          path: '',
          element: <FormList />,
        },
        {
          path: 'formeditor',
          element: <FormEditor />,
        },
        {
          path: 'form/:id/edit',
          element: <FormEditor />,
          ErrorBoundary: () => <FormEditor.ErrorBoundary />,
          loader: FormEditor.loader,
        },
        {
          path: 'form/:id/live',
          element: <LiveForm />,
        },
      ],
    },
  ],
  {
    future: {
      v7_normalizeFormMethod: true,
    },
  }
);

export default router;
