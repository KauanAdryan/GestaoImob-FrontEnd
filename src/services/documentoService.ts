import { api } from './api';

export interface DocumentoAPI {
  id: string;
  imovelId: string;
  nome: string;
  tipo: string;
  url: string;
  dataUpload: string;
  uploadPor: string | null;
}

export const documentoService = {
  getByImovel: (imovelId: string) =>
    api.get<DocumentoAPI[]>(`/documentos/imovel/${imovelId}`),
};
