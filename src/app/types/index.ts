export type PropertyStatus = 'disponivel' | 'alugado' | 'manutencao';
export type PropertyType = 'apartamento' | 'casa' | 'comercial' | 'terreno';
export type PaymentStatus = 'pago' | 'pendente' | 'atrasado';

export interface Property {
  id: string;
  titulo: string;
  tipo: PropertyType;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  valor: number;
  area: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  status: PropertyStatus;
  descricao: string;
  foto: string;
  dataCadastro: Date;
}

export interface Tenant {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  dataNascimento: Date;
  profissao: string;
  rendaMensal: number;
  foto?: string;
}

export interface Contract {
  id: string;
  imovelId: string;
  inquilinoId: string;
  dataInicio: Date;
  dataFim: Date;
  valorAluguel: number;
  diaVencimento: number;
  ativo: boolean;
}

export interface Payment {
  id: string;
  contratoId: string;
  mesReferencia: Date;
  valorPrevisto: number;
  valorPago?: number;
  dataPagamento?: Date;
  status: PaymentStatus;
  observacoes?: string;
}

export interface DashboardStats {
  totalImoveis: number;
  imoveisDisponiveis: number;
  imoveisAlugados: number;
  receitaMensal: number;
  receitaAnual: number;
  inadimplencia: number;
}
