import { api } from './api';

export interface DespesaAPI {
  id: string;
  imovelId: string;
  categoria: string;
  data: string;
  valor: number;
  aprovado: boolean;
}

export interface DespesaPayload {
  imovelId: string;
  categoria: string;
  data: string;
  valor: number;
  aprovado: boolean;
}

export const despesaService = {
  getByImovel: (imovelId: string) =>
    api.get<DespesaAPI[]>(`/despesas/imovel/${imovelId}`),
  create: (payload: DespesaPayload) =>
    api.post<DespesaAPI>('/despesas', payload),
  update: (id: string, payload: DespesaPayload) =>
    api.put<DespesaAPI>(`/despesas/${id}`, payload),
  delete: (id: string) =>
    api.delete<void>(`/despesas/${id}`),
};
