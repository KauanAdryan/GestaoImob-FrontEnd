import { api } from './api';

export type TipoDocumento =
  | 'MATRICULA_ATUALIZADA'
  | 'LAUDO_AVALIACAO'
  | 'TERMO_CONSOLIDACAO_PROPRIEDADE'
  | 'CERTIDAO_DEBITOS_MUNICIPAIS_IPTU'
  | 'CERTIDAO_DEBITOS_ESTADUAIS'
  | 'CERTIDAO_ONUS_REAIS';

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  MATRICULA_ATUALIZADA:             'Matrícula Atualizada',
  LAUDO_AVALIACAO:                  'Laudo de Avaliação',
  TERMO_CONSOLIDACAO_PROPRIEDADE:   'Termo de Consolidação',
  CERTIDAO_DEBITOS_MUNICIPAIS_IPTU: 'Certidão IPTU',
  CERTIDAO_DEBITOS_ESTADUAIS:       'Certidão Estadual',
  CERTIDAO_ONUS_REAIS:              'Certidão de Ônus Reais',
};

export interface DocumentoAPI {
  id: string;
  tipo: TipoDocumento;
  nomeArquivo: string;
  url: string;
  uploadedAt: string;
}

export interface DocumentoPayload {
  tipo: TipoDocumento;
  nomeArquivo: string;
  url: string;
}

const BASE_URL = (import.meta as { env: { VITE_API_BASE_URL?: string } }).env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const documentoService = {
  getByImovel: (imovelId: string) =>
    api.get<DocumentoAPI[]>(`/imoveis/${imovelId}/documentos`),

  create: (imovelId: string, payload: DocumentoPayload) =>
    api.post<DocumentoAPI>(`/imoveis/${imovelId}/documentos`, payload),

  delete: (imovelId: string, documentoId: string) =>
    api.delete<void>(`/imoveis/${imovelId}/documentos/${documentoId}`),

  upload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Falha no upload do arquivo');
    }

    const data = await response.json() as { url: string };
    return data.url;
  },
};
