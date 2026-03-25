import { createBrowserRouter, redirect } from 'react-router';
import PropertyFlowList from './pages/property-flow/PropertyFlowList';
import PropertyFlowDetail from './pages/property-flow/PropertyFlowDetail';
import LeilaoPage from './pages/property-flow/LeilaoPage';
import NegociacaoPage from './pages/property-flow/NegociacaoPage';
import ManutencaoPrecificacaoPage from './pages/property-flow/ManutencaoPrecificacaoPage';
import ComercialPage from './pages/property-flow/ComercialPage';
import VendaPage from './pages/property-flow/VendaPage';
import PosVendaPage from './pages/property-flow/PosVendaPage';
import CadastroImovelPage from './pages/property-flow/CadastroImovelPage';
import Login from './pages/Login';

export const router = createBrowserRouter([
  // Rota de login — sem layout/sidebar
  {
    path: '/login',
    Component: Login,
  },

  // Redireciona a raiz para /login
  {
    path: '/',
    loader: () => redirect('/login'),
  },

  // Rotas protegidas do sistema
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
]);