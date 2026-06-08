import { api } from './api';

export interface OcorrenciaAPI {
  id: string;
  imovelId: string;
  descricao: string;
}

export interface OcorrenciaPayload {
  imovelId: string;
  descricao: string;
}

export const ocorrenciaService = {
  getByImovel: (imovelId: string) =>
    api.get<OcorrenciaAPI[]>(`/ocorrencias/imovel/${imovelId}`),
  create: (payload: OcorrenciaPayload) =>
    api.post<OcorrenciaAPI>('/ocorrencias', payload),
  update: (id: string, payload: OcorrenciaPayload) =>
    api.put<OcorrenciaAPI>(`/ocorrencias/${id}`, payload),
  delete: (id: string) =>
    api.delete<void>(`/ocorrencias/${id}`),
};
