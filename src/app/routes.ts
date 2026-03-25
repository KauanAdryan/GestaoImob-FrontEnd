import { createBrowserRouter } from 'react-router';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Contracts from './pages/Contracts';
import Financial from './pages/Financial';
import Root from './pages/Root';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: 'imoveis', Component: Properties },
      { path: 'inquilinos', Component: Tenants },
      { path: 'contratos', Component: Contracts },
      { path: 'financeiro', Component: Financial },
    ],
  },
]);
