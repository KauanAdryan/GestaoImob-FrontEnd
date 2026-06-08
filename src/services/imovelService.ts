import { api } from './api';
import type { FlowStage } from '../app/types/property-flow';

export interface ImovelEnderecoDTOAPI {
  id: string;
  cep: string;
  ruaId: string;
  ruaNome: string;
  numero: string;
  complemento: string | null;
  bairroId: string;
  bairroDescricao: string;
  cidadeId: string;
  cidadeNome: string;
  estadoId: string;
  estadoSigla: string;
}

export type ImovelEtapa =
  | 'CADASTRO'
  | 'LEILAO'
  | 'AVERBACAO'
  | 'NEGOCIACAO_AMIGAVEL'
  | 'NEGOCIACAO_NAO_AMIGAVEL'
  | 'JURIDICO'
  | 'MANUTENCAO_PRECIFICACAO'
  | 'COMERCIAL'
  | 'VENDA'
  | 'POS_VENDA';

export type ImovelStatus = 'DISPONIVEL' | 'EM_NEGOCIACAO' | 'VENDIDO' | 'INDISPONIVEL';

export interface ImovelAPI {
  id: string;
  tipoImovel: string;
  area: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  valorAvaliacao: number;
  dataAvaliacao: string;
  numeroMatricula: number;
  cartorioRegistro: string;
  descricao: string | null;
  fotosImovel: string[];
  endereco: null;
  enderecoDTO: ImovelEnderecoDTOAPI | null;
  etapa: ImovelEtapa | null;
  responsavelId: string | null;
  clienteId: string | null;
  status: ImovelStatus | null;
}

const ETAPA_TO_STAGE: Record<ImovelEtapa, FlowStage> = {
  CADASTRO:                'cadastro',
  LEILAO:                  'leilao',
  AVERBACAO:               'averbacao',
  NEGOCIACAO_AMIGAVEL:     'negociacao-amigavel',
  NEGOCIACAO_NAO_AMIGAVEL: 'negociacao-nao-amigavel',
  JURIDICO:                'juridico',
  MANUTENCAO_PRECIFICACAO: 'manutencao-precificacao',
  COMERCIAL:               'comercial',
  VENDA:                   'venda',
  POS_VENDA:               'pos-venda',
};

const ETAPA_LABELS: Record<ImovelEtapa, string> = {
  CADASTRO:                'Cadastro',
  LEILAO:                  'Leilão',
  AVERBACAO:               'Averbação',
  NEGOCIACAO_AMIGAVEL:     'Neg. Amigável',
  NEGOCIACAO_NAO_AMIGAVEL: 'Neg. Não Amigável',
  JURIDICO:                'Jurídico',
  MANUTENCAO_PRECIFICACAO: 'Manutenção/Precif.',
  COMERCIAL:               'Comercial',
  VENDA:                   'Venda',
  POS_VENDA:               'Pós-Venda',
};

export const STATUS_CONFIG: Record<ImovelStatus, { label: string; color: string; bg: string; border: string }> = {
  DISPONIVEL:    { label: 'Disponível',    color: '#006829', bg: '#E6F7ED',               border: '#CCEFDB' },
  EM_NEGOCIACAO: { label: 'Em Negociação', color: '#CC8300', bg: '#FFF4E6',               border: '#FFE9CC' },
  VENDIDO:       { label: 'Vendido',       color: '#165C7D', bg: 'var(--ailos-azul-50)',  border: 'var(--border)' },
  INDISPONIVEL:  { label: 'Indisponível',  color: '#7c3aed', bg: '#F5F3FF',               border: '#DDD6FE' },
};

export function etapaToFlowStage(etapa: ImovelEtapa | null): FlowStage {
  return etapa ? ETAPA_TO_STAGE[etapa] : 'cadastro';
}

export function etapaLabel(etapa: ImovelEtapa | null): string {
  return etapa ? ETAPA_LABELS[etapa] : '—';
}

export function imovelLabel(imovel: ImovelAPI): string {
  const tipo = imovel.tipoImovel.charAt(0) + imovel.tipoImovel.slice(1).toLowerCase();
  return `${tipo} - ${imovel.numeroMatricula}`;
}

export function enderecoLabel(imovel: ImovelAPI): string {
  const e = imovel?.enderecoDTO;
  if (!e) return '—';

  const partes: string[] = [];

  if (e.ruaNome && e.numero) partes.push(`${e.ruaNome}, ${e.numero}`);
  else if (e.ruaNome)        partes.push(e.ruaNome);
  else if (e.numero)         partes.push(e.numero);

  if (e.cidadeNome && e.estadoSigla) partes.push(`${e.cidadeNome}/${e.estadoSigla}`);
  else if (e.cidadeNome)             partes.push(e.cidadeNome);
  else if (e.estadoSigla)            partes.push(e.estadoSigla);

  return partes.length > 0 ? partes.join(' — ') : '—';
}

type PageResponse<T>   = { content: T[] };
type CustomResponse<T> = { imoveis: T[] };

function toArray<T>(data: T[] | PageResponse<T> | CustomResponse<T>): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as PageResponse<T>).content))   return (data as PageResponse<T>).content;
  if (data && Array.isArray((data as CustomResponse<T>).imoveis)) return (data as CustomResponse<T>).imoveis;
  return [];
}

export interface EtapaStatusPayload {
  etapa:  ImovelEtapa;
  status: ImovelStatus;
}

export const imovelService = {
  getAll:            ()                                    => api.get<ImovelAPI[] | PageResponse<ImovelAPI>>(`/imoveis`).then(toArray),
  getById:           (id: string)                          => api.get<ImovelAPI>(`/imoveis/${id}`),
  updateEtapaStatus: (id: string, payload: EtapaStatusPayload) => api.patch<ImovelAPI>(`/imoveis/${id}/etapa-status`, payload),
};
