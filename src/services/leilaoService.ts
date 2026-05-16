import { api } from './api';

export type LeilaoStatus = 'AGENDADO' | 'REALIZADO' | 'DESERTO' | 'VENDIDO';

export const LEILAO_STATUS_CONFIG: Record<LeilaoStatus, { label: string; color: string; bg: string; border: string }> = {
  AGENDADO: { label: 'Agendado', color: '#165C7D', bg: 'var(--ailos-azul-50)',    border: 'var(--border)' },
  REALIZADO: { label: 'Realizado', color: '#16a34a', bg: '#E6F7ED',               border: '#CCEFDB' },
  DESERTO:   { label: 'Deserto',   color: '#CC8300', bg: 'var(--ailos-amarelo-50)', border: 'var(--ailos-amarelo-100)' },
  VENDIDO:   { label: 'Vendido',   color: '#7c3aed', bg: '#F5F3FF',               border: '#DDD6FE' },
};

export interface LeilaoAPI {
  id: string;
  imovelId: string;
  numero: number;
  data: string;
  valorMinimo: number;
  status: LeilaoStatus;
}

export interface LeilaoPayload {
  imovel: { id: string };
  numero: number;
  data: string;
  valorMinimo: number;
  status: LeilaoStatus;
}

export const leilaoService = {
  getByImovel: (imovelId: string) =>
    api.get<LeilaoAPI[]>(`/leiloes/imovel/${imovelId}`),
  create: (payload: LeilaoPayload) =>
    api.post<LeilaoAPI>('/leiloes', payload),
  update: (id: string, payload: LeilaoPayload) =>
    api.put<LeilaoAPI>(`/leiloes/${id}`, payload),
  delete: (id: string) =>
    api.delete<void>(`/leiloes/${id}`),
};
