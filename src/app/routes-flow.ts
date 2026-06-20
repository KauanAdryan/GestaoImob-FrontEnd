import { createBrowserRouter, redirect } from 'react-router';
import { authService } from '../services/auth';
import PropertyFlowList from './pages/property-flow/PropertyFlowList';
import PropertyFlowDetail from './pages/property-flow/PropertyFlowDetail';
import LeilaoPage from './pages/property-flow/LeilaoPage';
import NegociacaoPage from './pages/property-flow/NegociacaoPage';
import ManutencaoPrecificacaoPage from './pages/property-flow/ManutencaoPrecificacaoPage';
import ComercialPage from './pages/property-flow/ComercialPage';
import VendaPage from './pages/property-flow/VendaPage';
import PosVendaPage from './pages/property-flow/PosVendaPage';
import CadastroImovelPage from './pages/property-flow/CadastroImovelPage';
import ClientesPage from './pages/clientes/ClientesPage';
import Login from './pages/Login';
import Register from './pages/Register';
import EsqueciSenha from './pages/EsqueciSenha';
import Root from './pages/Root';
import Dashboard from './pages/Dashboard';

function requireAuth() {
  if (!authService.isAuthenticated()) {
    return redirect('/login');
  }
  return null;
}

function redirectIfAuthenticated() {
  if (authService.isAuthenticated()) {
    return redirect('/dashboard');
  }
  return null;
}

export const router = createBrowserRouter([
  // Rota de login — sem layout/sidebar
  {
    path: '/login',
    Component: Login,
    loader: redirectIfAuthenticated,
  },

  // Rota de cadastro — sem layout/sidebar
  {
    path: '/cadastro',
    Component: Register,
    loader: redirectIfAuthenticated,
  },

  // Rota de recuperação de senha — sem layout/sidebar
  {
    path: '/esqueci-senha',
    Component: EsqueciSenha,
  },

  // Raiz: vai para o dashboard se já estiver logado, senão para o login
  {
    path: '/',
    loader: () => redirect(authService.isAuthenticated() ? '/dashboard' : '/login'),
  },

  // Rotas protegidas do sistema
  {
    Component: Root,
    loader: requireAuth,
    children: [
      { path: '/dashboard', Component: Dashboard },
      { path: '/clientes', Component: ClientesPage },
      {
        path: '/gestao-bens',
        children: [
          { index: true, Component: PropertyFlowList },
          { path: 'novo', Component: CadastroImovelPage },
          { path: ':id', Component: PropertyFlowDetail },
          { path: ':id/leilao', Component: LeilaoPage },
          { path: ':id/negociacao', Component: NegociacaoPage },
          { path: ':id/manutencao-precificacao', Component: ManutencaoPrecificacaoPage },
          { path: ':id/comercial', Component: ComercialPage },
          { path: ':id/venda', Component: VendaPage },
          { path: ':id/pos-venda', Component: PosVendaPage },
        ],
      },
    ],
  },
]);
