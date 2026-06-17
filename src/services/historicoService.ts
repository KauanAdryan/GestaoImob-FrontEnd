import { api } from './api';

export interface HistoricoDuracaoDTO {
  imovelId: string;
  etapa: string;
  startedAt: string | number[] | null;
  endedAt: string | number[] | null;
  days: number;
}

export interface HistoricoDuracoesResponseDTO {
  duracoes: HistoricoDuracaoDTO[];
  totalDays: number;
}

export const historicoService = {
  getDurations: (imovelId: string) =>
    api.get<HistoricoDuracoesResponseDTO>(`/imoveis/${imovelId}/historico/duracoes`),
};
