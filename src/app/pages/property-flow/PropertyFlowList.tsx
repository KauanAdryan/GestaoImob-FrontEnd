import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, Eye, Building2, AlertTriangle, Scale, AlertCircle, ListFilter } from 'lucide-react';
import {
  imovelService, enderecoLabel, imovelLabel, etapaLabel,
  STATUS_CONFIG, type ImovelAPI, type ImovelStatus, type ImovelEtapa,
} from '../../../services/imovelService';
import { historicoService, diasNaEtapaAtual, type HistoricoDuracaoDTO } from '../../../services/historicoService';
import { useTheme } from '../../../contexts/ThemeContext';

const styles = `
  @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .a-fade-up { animation: fadeInUp 0.4s ease both; }
  .table-row-animate { transition: background 0.15s ease; }
  .tag-btn { transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
`;

const ETAPAS: ImovelEtapa[] = [
  'CADASTRO','LEILAO','NEGOCIACAO_AMIGAVEL','NEGOCIACAO_NAO_AMIGAVEL',
  'JURIDICO','COMERCIAL','VENDA','POS_VENDA',
];

const SLA_DIAS: Record<string, number> = {
  CADASTRO: 30, LEILAO: 180, AVERBACAO: 60,
  NEGOCIACAO_AMIGAVEL: 90, NEGOCIACAO_NAO_AMIGAVEL: 120,
  JURIDICO: 180, MANUTENCAO_PRECIFICACAO: 45, COMERCIAL: 90, VENDA: 60, POS_VENDA: 30,
};
type SLABadgeStatus = 'no-prazo' | 'proximo-vencimento' | 'vencido';
const SLA_BADGE_CFG: Record<SLABadgeStatus, { label: string; color: string; bg: string; border: string }> = {
  'no-prazo':           { label: 'Em Dia',  color: '#006829', bg: '#E6F7ED', border: '#CCEFDB' },
  'proximo-vencimento': { label: 'Atenção', color: '#CC8300', bg: '#FFF4E6', border: '#FFE9CC' },
  'vencido':            { label: 'Vencido', color: '#dc2626', bg: '#FEF2F2', border: '#FECACA' },
};
function calcSLA(imovel: ImovelAPI, duracoes: HistoricoDuracaoDTO[]): { dias: number; limite: number; status: SLABadgeStatus } {
  const etapa  = imovel.etapa ?? 'CADASTRO';
  const limite = SLA_DIAS[etapa] ?? 60;
  const dias   = Math.round(diasNaEtapaAtual(etapa, duracoes, imovel.createdAt ? new Date(imovel.createdAt) : null));
  const pct    = limite > 0 ? dias / limite : 0;
  const status: SLABadgeStatus = pct >= 1 ? 'vencido' : pct >= 0.75 ? 'proximo-vencimento' : 'no-prazo';
  return { dias, limite, status };
}

export default function PropertyFlowList() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [imoveis, setImoveis]   = useState<ImovelAPI[]>([]);
  const [loading, setLoading]   = useState(true);
  const [historicos, setHistoricos] = useState<HistoricoDuracaoDTO[]>([]);
  const [slaLoading, setSlaLoading] = useState(true);
  const [search, setSearch]     = useState('');
  const [filterEtapa, setFilterEtapa]   = useState<ImovelEtapa | 'todas'>('todas');
  const [filterStatus, setFilterStatus] = useState<ImovelStatus | 'todos'>('todos');
  const [filterLiminar, setFilterLiminar]           = useState(false);
  const [filterFiscal, setFilterFiscal]             = useState(false);
  const [filterConta, setFilterConta]               = useState('');
  const [filterNomeCooperado, setFilterNomeCooperado] = useState('');
  const [filterPA, setFilterPA]                     = useState('');
  const [filterCidade, setFilterCidade]             = useState('');

  useEffect(() => {
    imovelService.getAll()
      .then(setImoveis)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (imoveis.length === 0) { setSlaLoading(false); return; }
    setSlaLoading(true);
    Promise.all(imoveis.map(i => historicoService.getDurations(i.id).catch(() => ({ duracoes: [], totalDays: 0 }))))
      .then(results => setHistoricos(results.flatMap(r => r.duracoes)))
      .finally(() => setSlaLoading(false));
  }, [imoveis]);

  const historicoPorImovel = new Map<string, HistoricoDuracaoDTO[]>();
  for (const h of historicos) {
    const arr = historicoPorImovel.get(h.imovelId) ?? [];
    arr.push(h);
    historicoPorImovel.set(h.imovelId, arr);
  }

  const filtered = imoveis.filter(i => {
    const addr    = enderecoLabel(i).toLowerCase();
    const cidade  = (i.enderecoDTO?.cidadeNome ?? '').toLowerCase();
    const matchS  = search === '' || addr.includes(search.toLowerCase()) || String(i.numeroMatricula).includes(search);
    const matchE  = filterEtapa  === 'todas' || i.etapa  === filterEtapa;
    const matchSt = filterStatus === 'todos'  || i.status === filterStatus;
    const matchConta  = filterConta  === '' || String(i.numeroMatricula).includes(filterConta);
    const matchNome   = filterNomeCooperado === '' || imovelLabel(i).toLowerCase().includes(filterNomeCooperado.toLowerCase());
    const matchPA     = filterPA    === '' || String(i.numeroMatricula).includes(filterPA);
    const matchCidade = filterCidade === '' || cidade.includes(filterCidade.toLowerCase());
    return matchS && matchE && matchSt && matchConta && matchNome && matchPA && matchCidade;
  });

  const cardStyle = { background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' };
  const hoverBg   = isDark ? '#1e2535' : '#eef7fb';

  const stats = [
    {
      label: 'Total de Imóveis',
      value: imoveis.length,
      icon:  Building2,
      color: isDark ? '#4A9BBF' : '#165C7D',
      bg:    'var(--ailos-azul-50)',
    },
    {
      label: 'SLA Vencido',
      value: slaLoading ? '—' : imoveis.filter(i => calcSLA(i, historicoPorImovel.get(i.id) ?? []).status === 'vencido').length,
      icon:  AlertTriangle,
      color: '#ef4444',
      bg:    '#FEF2F2',
    },
    {
      label: 'Em Liminar',
      value: 0,
      icon:  Scale,
      color: isDark ? '#4A9BBF' : '#165C7D',
      bg:    'var(--ailos-azul-50)',
    },
    {
      label: 'Pendências Fiscais',
      value: 0,
      icon:  AlertCircle,
      color: isDark ? '#4A9BBF' : '#165C7D',
      bg:    'var(--ailos-azul-50)',
    },
  ];

  const tagBtnStyle = (active: boolean) => ({
    display:     'flex' as const,
    alignItems:  'center' as const,
    gap:         '6px',
    padding:     '8px 16px',
    borderRadius: '10px',
    border:      `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    background:  active ? 'var(--ailos-azul-50)' : 'var(--card)',
    color:       active ? 'var(--primary)' : 'var(--muted-foreground)',
    fontSize:    '14px',
    fontWeight:  600,
    cursor:      'pointer',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between a-fade-up">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Gestão de Bens</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {filtered.length} {filtered.length === 1 ? 'imóvel' : 'imóveis'} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stats — 4 cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 a-fade-up">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-5 border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="rounded-2xl border a-fade-up" style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {/* Linha 1: busca + dropdowns */}
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--ailos-cinza-400)' }} />
              <Input
                placeholder="Buscar por código ou endereço..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 rounded-full border"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            <Select value={filterEtapa} onValueChange={v => setFilterEtapa(v as ImovelEtapa | 'todas')}>
              <SelectTrigger className="w-52 rounded-xl font-semibold" style={{ borderColor: 'var(--border)' }}>
                <SelectValue placeholder="Todas as Etapas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Etapas</SelectItem>
                {ETAPAS.map(e => (
                  <SelectItem key={e} value={e}>{etapaLabel(e)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={v => setFilterStatus(v as ImovelStatus | 'todos')}>
              <SelectTrigger className="w-48 rounded-xl font-semibold" style={{ borderColor: 'var(--border)' }}>
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                {(Object.keys(STATUS_CONFIG) as ImovelStatus[]).map(s => (
                  <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Linha 2: inputs de coluna + botões de tag */}
          <div className="flex items-center justify-between px-5 py-2.5 gap-3">
            <div className="flex items-center gap-2 flex-1">
              {[
                { placeholder: 'Conta',           value: filterConta,           set: setFilterConta },
                { placeholder: 'Nome Cooperado',  value: filterNomeCooperado,   set: setFilterNomeCooperado },
                { placeholder: 'PA',              value: filterPA,              set: setFilterPA },
                { placeholder: 'Cidade',          value: filterCidade,          set: setFilterCidade },
              ].map(f => (
                <input
                  key={f.placeholder}
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-lg border outline-none transition-all"
                  style={{
                    background:   'var(--card)',
                    borderColor:  'var(--border)',
                    color:        'var(--foreground)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="tag-btn"
                style={tagBtnStyle(filterLiminar)}
                onClick={() => setFilterLiminar(v => !v)}
              >
                <ListFilter className="h-3.5 w-3.5" /> Liminar
              </button>
              <button
                className="tag-btn"
                style={tagBtnStyle(filterFiscal)}
                onClick={() => setFilterFiscal(v => !v)}
              >
                <ListFilter className="h-3.5 w-3.5" /> Fiscal
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        {filtered.length > 0 ? (
          <div className="rounded-2xl border overflow-hidden a-fade-up" style={cardStyle}>
            <Table>
              <TableHeader>
                <TableRow style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Imóvel', 'Tipo', 'Etapa', 'SLA', 'Valor de Avaliação', 'Matrícula', ''].map((h, i) => (
                    <TableHead key={i} className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--muted-foreground)' }}>
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(imovel => (
                  <TableRow
                    key={imovel.id}
                    className="table-row-animate"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = hoverBg}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {imovel.fotosImovel?.[0] ? (
                          <div className="overflow-hidden rounded-xl border flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                            <img src={imovel.fotosImovel[0]} alt="foto" className="w-20 h-20 object-cover" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ailos-azul-50)' }}>
                            <Building2 className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{imovelLabel(imovel)}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{enderecoLabel(imovel)}</p>
                          <p className="text-xs" style={{ color: 'var(--ailos-cinza-500)' }}>
                            {imovel.quartos}q · {imovel.banheiros}b · {imovel.vagasGaragem} vaga{imovel.vagasGaragem !== 1 ? 's' : ''}
                          </p>
                          {imovel.status && (() => {
                            const s = STATUS_CONFIG[imovel.status!];
                            return (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border"
                                style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                {s.label}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'var(--ailos-azul-50)', color: 'var(--primary)' }}>
                        {imovel.tipoImovel}
                      </span>
                    </TableCell>

                    <TableCell>
                      {imovel.etapa ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium border"
                          style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                          {etapaLabel(imovel.etapa)}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--ailos-cinza-400)' }}>—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {slaLoading ? (
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Calculando...</span>
                      ) : (() => {
                        const { dias, limite, status } = calcSLA(imovel, historicoPorImovel.get(imovel.id) ?? []);
                        const cfg = SLA_BADGE_CFG[status];
                        const diasRestantes = limite - dias;
                        return (
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold border"
                              style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                              {cfg.label}
                            </span>
                            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                              {diasRestantes < 0
                                ? `${Math.abs(diasRestantes)}d vencido`
                                : `${diasRestantes}d restantes`}
                            </p>
                          </div>
                        );
                      })()}
                    </TableCell>

                    <TableCell className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      R$ {(imovel.valorAvaliacao ?? 0).toLocaleString('pt-BR')}
                    </TableCell>

                    <TableCell className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {imovel.numeroMatricula}
                    </TableCell>

                    <TableCell>
                      <Link to={`/gestao-bens/${imovel.id}`}>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                          style={{ background: 'var(--primary)' }}>
                          <Eye className="h-3.5 w-3.5" /> Abrir
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-2xl border py-16 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--ailos-cinza-400)' }} />
            <p style={{ color: 'var(--muted-foreground)' }}>
              {imoveis.length === 0 ? 'Nenhum imóvel cadastrado ainda.' : 'Nenhum imóvel encontrado com os filtros aplicados.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
