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

export function parseHistDate(value: string | number[] | null): Date | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    const [y, m, d, h = 0, mi = 0] = value;
    return new Date(y, m - 1, d, h, mi);
  }
  return new Date(value);
}

export function diasNaEtapaAtual(
  etapaAtual: string,
  duracoes: HistoricoDuracaoDTO[],
  fallbackInicio: Date | null,
): number {
  const entradas = duracoes.filter(d => d.etapa === etapaAtual);
  if (entradas.length > 0) {
    const maisRecente = entradas.reduce((a, b) => {
      const da = parseHistDate(a.startedAt)?.getTime() ?? 0;
      const db = parseHistDate(b.startedAt)?.getTime() ?? 0;
      return db > da ? b : a;
    });
    return maisRecente.days ?? 0;
  }
  const ref = fallbackInicio ?? new Date();
  return Math.max(0, (Date.now() - ref.getTime()) / 86400000);
}
