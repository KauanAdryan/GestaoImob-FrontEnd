import { api } from './api';

export type LeilaoStatus = '1º LEILÃO' | '2º LEILÃO' | 'COMERCIALIZAÇÃO';

export const LEILAO_STATUS_CONFIG: Record<LeilaoStatus, { label: string; color: string; bg: string; border: string }> = {
  '1º LEILÃO':      { label: '1º Leilão',      color: '#165C7D', bg: 'var(--ailos-azul-50)',       border: 'var(--border)' },
  '2º LEILÃO':      { label: '2º Leilão',      color: '#CC8300', bg: 'var(--ailos-amarelo-50)',    border: 'var(--ailos-amarelo-100)' },
  'COMERCIALIZAÇÃO': { label: 'Comercialização', color: '#16a34a', bg: '#E6F7ED',                    border: '#CCEFDB' },
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
  imovelId: string;
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
