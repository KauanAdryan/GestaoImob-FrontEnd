export type FlowStage = 
  | 'notificacao'
  | 'consolidacao'
  | 'leilao'
  | 'negociacao-amigavel'
  | 'negociacao-nao-amigavel'
  | 'manutencao-precificacao'
  | 'comercial'
  | 'venda'
  | 'pos-venda';

export type LeilaoSubStage = 'leiloes-obrigatorios' | 'averbacao' | 'terceiro-leilao';

export type SLAStatus = 'no-prazo' | 'proximo-vencimento' | 'vencido';

export type PropertyStatus = 
  | 'em-andamento'
  | 'aguardando-aprovacao'
  | 'pendente'
  | 'concluido'
  | 'em-liminar'
  | 'com-pendencia-fiscal';

export interface PropertyFlow {
  id: string;
  codigo: string;
  endereco: string;
  cidade: string;
  estado: string;
  tipo: 'apartamento' | 'casa' | 'comercial' | 'terreno';
  etapaAtual: FlowStage;
  subEtapa?: string;
  slaStatus: SLAStatus;
  slaData: Date;
  responsavel: string;
  tags: PropertyTag[];
  ultimaAtualizacao: Date;
  valor: number;
  area: number;
  foto?: string;
}

export interface PropertyTag {
  tipo: 'liminar' | 'pendencia-fiscal' | 'venda-parcelada' | 'desocupacao';
  label: string;
  color: string;
}

export interface Comment {
  id: string;
  autor: string;
  data: Date;
  texto: string;
  etapa: FlowStage;
  anexos?: Attachment[];
}

export interface Attachment {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  dataUpload: Date;
  uploadPor: string;
  obrigatorio?: boolean;
}

export interface Leilao {
  id: string;
  imovelId: string;
  numero: number; // 1º, 2º, 3º leilão
  leiloeiro: string;
  data: Date;
  valorAvaliacao: number;
  valorMinimo: number;
  status: 'agendado' | 'realizado' | 'vendido' | 'deserto';
  valorVenda?: number;
  anexos: Attachment[];
}

export interface Averbacao {
  id: string;
  imovelId: string;
  dataAverbacao: Date;
  matriculaAtualizada: Attachment;
  observacoes: string;
}

export interface Precificacao {
  id: string;
  imovelId: string;
  amostras: Amostra[];
  valorSugerido: number;
  status: 'em-analise' | 'aprovado' | 'reprovado';
  dataCriacao: Date;
  dataAprovacao?: Date;
  aprovadoPor?: string;
  pdfGerado?: Attachment;
}

export interface Amostra {
  id: string;
  link: string;
  valor: number;
  area: number;
  data: Date;
  print?: Attachment;
  observacoes: string;
}

export interface Proposta {
  id: string;
  imovelId: string;
  numero: string;
  cliente: string;
  valor: number;
  data: Date;
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'contra-proposta';
  observacoes: string;
  comentarios: Comment[];
}

export interface Imobiliaria {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  email: string;
  dataInicio: Date;
  dataFim?: Date;
}

export interface ChecklistItem {
  id: string;
  label: string;
  obrigatorio: boolean;
  concluido: boolean;
  anexo?: Attachment;
  dataConclusao?: Date;
  concluidoPor?: string;
}

export interface Venda {
  id: string;
  imovelId: string;
  comprador: string;
  cpfCnpj: string;
  valor: number;
  dataVenda: Date;
  formaPagamento: 'vista' | 'parcelado' | 'financiamento';
  checklist: ChecklistItem[];
  observacoes: string;
}

export interface VendaParcelada {
  id: string;
  vendaId: string;
  numeroParcelas: number;
  valorParcela: number;
  diaVencimento: number;
  parcelas: Parcela[];
}

export interface Parcela {
  numero: number;
  valor: number;
  vencimento: Date;
  paga: boolean;
  dataPagamento?: Date;
  comprovante?: Attachment;
}

export interface OcorrenciaFiscal {
  id: string;
  imovelId: string;
  tipo: 'iptu' | 'itbi' | 'reavaliacao' | 'outro';
  descricao: string;
  status: 'solicitado' | 'em-andamento' | 'concluido';
  solicitadoPor: string;
  dataSolicitacao: Date;
  dataConclusao?: Date;
  observacoes: string;
}

export interface Despesa {
  id: string;
  imovelId: string;
  etapa: FlowStage;
  categoria: string;
  descricao: string;
  valor: number;
  data: Date;
  comprovante?: Attachment;
  aprovado: boolean;
}

export interface JuridicoPost {
  id: string;
  imovelId: string;
  titulo: string;
  conteudo: string;
  autor: string;
  data: Date;
  tipo: 'liminar' | 'processo' | 'parecer' | 'outro';
  comentarios: Comment[];
  anexos: Attachment[];
}

export interface Negociacao {
  id: string;
  imovelId: string;
  tipo: 'amigavel' | 'nao-amigavel';
  topicos: TopicoNegociacao[];
  status: 'em-andamento' | 'concluido' | 'sem-acordo';
  dataInicio: Date;
  dataConclusao?: Date;
}

export interface TopicoNegociacao {
  id: string;
  titulo: string;
  obrigatorio: boolean;
  aberto: boolean;
  ordem: number;
  conteudo: string;
  comentarios: Comment[];
  dataConclusao?: Date;
}

export interface StageConfig {
  id: FlowStage;
  label: string;
  ordem: number;
  descricao: string;
  subEtapas?: { id: string; label: string }[];
  documentosObrigatorios: string[];
}
