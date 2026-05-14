import { api } from './api';

export interface NegociacaoAPI {
  id: string;
  imovelId: string;
  clienteId: string;
  valor: number;
  amigavel: boolean;
  imovel: null;
  cliente: null;
}

export interface NegociacaoPayload {
  imovelId: string;
  clienteId: string;
  valor: number;
  amigavel: boolean;
}

export const negociacaoService = {
  getByImovel: (imovelId: string) =>
    api.get<NegociacaoAPI[]>(`/negociacoes/imovel/${imovelId}`),
  create: (payload: NegociacaoPayload) =>
    api.post<NegociacaoAPI>('/negociacoes', payload),
  update: (id: string, payload: NegociacaoPayload) =>
    api.put<NegociacaoAPI>(`/negociacoes/${id}`, payload),
};
