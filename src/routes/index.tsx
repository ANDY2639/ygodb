import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import Home from '@/views/Home';
import Detail from '@/views/Detail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'detail/:id', element: <Detail /> },
    ],
  },
]);

export default router;
