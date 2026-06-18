import { useEffect, useRef, useState } from 'react';
import { Building2, TrendingUp, DollarSign, Clock, Gavel, Receipt, FileDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { imovelService, type ImovelAPI } from '../../services/imovelService';
import { despesaService, type DespesaAPI } from '../../services/despesaService';
import { leilaoService, type LeilaoAPI } from '../../services/leilaoService';
import { negociacaoService, type NegociacaoAPI } from '../../services/negociacaoService';
import { historicoService, parseHistDate, diasNaEtapaAtual, type HistoricoDuracaoDTO } from '../../services/historicoService';
import { gerarRelatorioPDF } from '../../services/pdfReportService';
import ImovelMap from '../components/ImovelMap';
import { Slider } from '../components/ui/slider';

const SLA_DIAS_DASH: Record<string, number> = {
  CADASTRO: 30, LEILAO: 180, AVERBACAO: 60,
  NEGOCIACAO_AMIGAVEL: 90, NEGOCIACAO_NAO_AMIGAVEL: 120,
  JURIDICO: 180, MANUTENCAO_PRECIFICACAO: 45, COMERCIAL: 90, VENDA: 60, POS_VENDA: 30,
};

const ETAPAS_ORDEM_DASH = [
  'CADASTRO', 'LEILAO', 'AVERBACAO', 'NEGOCIACAO_AMIGAVEL', 'NEGOCIACAO_NAO_AMIGAVEL',
  'JURIDICO', 'MANUTENCAO_PRECIFICACAO', 'COMERCIAL', 'VENDA', 'POS_VENDA',
];
const ETAPA_LABELS_DASH: Record<string, string> = {
  CADASTRO: 'Cadastro', LEILAO: 'Leilão', AVERBACAO: 'Averbação',
  NEGOCIACAO_AMIGAVEL: 'Neg. Amigável', NEGOCIACAO_NAO_AMIGAVEL: 'Neg. Não Amigável',
  JURIDICO: 'Jurídico', MANUTENCAO_PRECIFICACAO: 'Manutenção/Precif.',
  COMERCIAL: 'Comercial', VENDA: 'Venda', POS_VENDA: 'Pós-Venda',
};

type KpiVariant = 'default' | 'success' | 'info' | 'alert';

function kpiStyles(isDark: boolean): Record<KpiVariant, { bg: string; border: string; iconColor: string; valueColor: string }> {
  return {
    default: { bg: 'var(--card)',              border: 'var(--border)',              iconColor: 'var(--ailos-cinza-500)',  valueColor: 'var(--foreground)' },
    success: { bg: isDark ? 'linear-gradient(135deg, #0D2B18 0%, var(--card) 100%)' : 'linear-gradient(135deg, #E6F7ED 0%, #FFFFFF 100%)', border: isDark ? '#1A4A2E' : '#CCEFDB', iconColor: '#00B140', valueColor: isDark ? '#4ADE80' : '#006829' },
    info:    { bg: isDark ? 'linear-gradient(135deg, #0A1F2E 0%, var(--card) 100%)' : 'linear-gradient(135deg, #E6F6FA 0%, #FFFFFF 100%)', border: isDark ? '#163344' : '#CCECF5', iconColor: '#00A9CE', valueColor: isDark ? '#38BDF8' : '#00687D' },
    alert:   { bg: isDark ? 'linear-gradient(135deg, #2E1F00 0%, var(--card) 100%)' : 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)', border: isDark ? '#4A3300' : '#FFE9CC', iconColor: '#FFA300', valueColor: isDark ? '#FFB938' : '#CC8300' },
  };
}

function KpiCard({ label, value, description, icon: Icon, variant = 'default', isDark }: {
  label: string; value: string | number; description: string;
  icon: React.ElementType; variant?: KpiVariant; isDark: boolean;
}) {
  const s = kpiStyles(isDark)[variant];
  return (
    <div className="rounded-xl p-6 transition-all duration-200" style={{ background: s.bg, border: `1px solid ${s.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
        <Icon style={{ width: 20, height: 20, color: s.iconColor, flexShrink: 0 }} />
      </div>
      <p className="text-3xl font-bold" style={{ color: s.valueColor }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--ailos-cinza-500)' }}>{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [imoveis, setImoveis] = useState<ImovelAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const [despesas, setDespesas]       = useState<DespesaAPI[]>([]);
  const [leiloes, setLeiloes]         = useState<LeilaoAPI[]>([]);
  const [negociacoes, setNegociacoes] = useState<NegociacaoAPI[]>([]);
  const [historicos, setHistoricos]   = useState<HistoricoDuracaoDTO[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  // Map filters
  const [mapEstado,    setMapEstado]    = useState('');
  const [mapCidade,    setMapCidade]    = useState('');
  const [mapValorRange, setMapValorRange] = useState<[number, number]>([0, 0]);
  const [mapDataDe,    setMapDataDe]    = useState('');
  const [mapDataAte,   setMapDataAte]   = useState('');
  const rangeInited = useRef(false);

  // Relatórios filters
  const [relEstado, setRelEstado] = useState('');
  const [relCidade, setRelCidade] = useState('');

  useEffect(() => {
    imovelService.getAll()
      .then(setImoveis)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (imoveis.length === 0) { setReportsLoading(false); return; }
    setReportsLoading(true);
    Promise.all([
      Promise.all(imoveis.map(i => despesaService.getByImovel(i.id).catch(() => []))),
      Promise.all(imoveis.map(i => leilaoService.getByImovel(i.id).catch(() => []))),
      Promise.all(imoveis.map(i => negociacaoService.getByImovel(i.id).catch(() => []))),
      Promise.all(imoveis.map(i => historicoService.getDurations(i.id).catch(() => ({ duracoes: [], totalDays: 0 })))),
    ]).then(([despesasArr, leiloesArr, negociacoesArr, historicosArr]) => {
      setDespesas(despesasArr.flat());
      setLeiloes(leiloesArr.flat());
      setNegociacoes(negociacoesArr.flat());
      setHistoricos(historicosArr.flatMap(h => h.duracoes));
    }).finally(() => setReportsLoading(false));
  }, [imoveis]);

  const sliderMax = imoveis.length > 0
    ? Math.ceil(Math.max(...imoveis.map(i => i.valorAvaliacao ?? 0)) / 50000) * 50000
    : 0;

  useEffect(() => {
    if (!rangeInited.current && sliderMax > 0) {
      setMapValorRange([0, sliderMax]);
      rangeInited.current = true;
    }
  }, [sliderMax]);

  const estados  = [...new Set(imoveis.map(i => i.enderecoDTO?.estadoSigla).filter(Boolean))].sort() as string[];
  const cidades  = [...new Set(
    imoveis
      .filter(i => !mapEstado || i.enderecoDTO?.estadoSigla === mapEstado)
      .map(i => i.enderecoDTO?.cidadeNome)
      .filter(Boolean)
  )].sort() as string[];

  const imoveisParaMapa = imoveis.filter(i => {
    if (mapEstado && i.enderecoDTO?.estadoSigla !== mapEstado) return false;
    if (mapCidade && i.enderecoDTO?.cidadeNome  !== mapCidade)  return false;
    if (sliderMax > 0) {
      if ((i.valorAvaliacao ?? 0) < mapValorRange[0]) return false;
      if ((i.valorAvaliacao ?? 0) > mapValorRange[1]) return false;
    }
    if (mapDataDe  && i.dataAvaliacao && i.dataAvaliacao < mapDataDe)  return false;
    if (mapDataAte && i.dataAvaliacao && i.dataAvaliacao > mapDataAte) return false;
    return true;
  });

  const isValorFiltered = sliderMax > 0 && (mapValorRange[0] > 0 || mapValorRange[1] < sliderMax);

  const relCidades = [...new Set(
    imoveis
      .filter(i => !relEstado || i.enderecoDTO?.estadoSigla === relEstado)
      .map(i => i.enderecoDTO?.cidadeNome)
      .filter(Boolean)
  )].sort() as string[];

  const imoveisRelatorio = imoveis.filter(i => {
    if (relEstado && i.enderecoDTO?.estadoSigla !== relEstado) return false;
    if (relCidade && i.enderecoDTO?.cidadeNome  !== relCidade) return false;
    return true;
  });
  const imoveisRelatorioIds = new Set(imoveisRelatorio.map(i => i.id));
  const historicosRelatorio   = historicos.filter(h => imoveisRelatorioIds.has(h.imovelId));
  const despesasRelatorio     = despesas.filter(d => imoveisRelatorioIds.has(d.imovelId));
  const negociacoesRelatorio  = negociacoes.filter(n => imoveisRelatorioIds.has(n.imovelId));
  const leiloesRelatorio      = leiloes.filter(l => imoveisRelatorioIds.has(l.imovelId));

  const total          = imoveis.length;
  const valorTotal     = imoveis.reduce((s, i) => s + (i.valorAvaliacao ?? 0), 0);
  const mediaValor     = total > 0 ? valorTotal / total : 0;

  const tipoData = ['Apartamento', 'Casa', 'Comercial/sala', 'Terreno', 'Galpão/Armazém', 'Propriedade Rural'].map(tipo => ({
    tipo,
    quantidade: imoveis.filter(i => i.tipoImovel === tipo).length,
  })).filter(d => d.quantidade > 0);

  const axisColor    = isDark ? '#6B7280' : '#8E8E8E';
  const gridColor    = isDark ? '#2D3348' : '#EFEFEF';
  const chartPrimary = isDark ? '#4A9BBF' : '#165C7D';
  const cardStyle    = { background: 'var(--card)', border: `1px solid var(--border)`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };

  const chartTooltipStyle = {
    backgroundColor: isDark ? '#1A1F2E' : '#FFFFFF',
    border: `1px solid ${isDark ? '#2D3348' : '#EFEFEF'}`,
    borderRadius: '8px',
    color: isDark ? '#E2E8F0' : '#1A1A1A',
  };

  // ── Tempo Médio por Etapa ──
  const etapaDurMap = new Map<string, number[]>();
  for (const h of historicosRelatorio) {
    if (h.days == null) continue;
    const arr = etapaDurMap.get(h.etapa) ?? [];
    arr.push(h.days);
    etapaDurMap.set(h.etapa, arr);
  }
  const tempoMedioData = ETAPAS_ORDEM_DASH
    .filter(e => etapaDurMap.has(e))
    .map(e => {
      const arr = etapaDurMap.get(e)!;
      const media = arr.reduce((s, v) => s + v, 0) / arr.length;
      return { etapa: ETAPA_LABELS_DASH[e] ?? e, dias: Math.round(media * 10) / 10 };
    });
  const etapaMaisLenta = tempoMedioData.length > 0
    ? tempoMedioData.reduce((max, d) => (d.dias > max.dias ? d : max), tempoMedioData[0])
    : null;

  // ── Financeiro: despesas ──
  const despesasPorCategoriaMap = new Map<string, number>();
  for (const d of despesasRelatorio) {
    despesasPorCategoriaMap.set(d.categoria, (despesasPorCategoriaMap.get(d.categoria) ?? 0) + d.valor);
  }
  const despesasPorCategoria = [...despesasPorCategoriaMap.entries()]
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);
  const despesasAprovadas = despesasRelatorio.filter(d => d.aprovado).reduce((s, d) => s + d.valor, 0);
  const despesasPendentes = despesasRelatorio.filter(d => !d.aprovado).reduce((s, d) => s + d.valor, 0);

  // ── Financeiro: negociações ──
  const negAmigavel    = negociacoesRelatorio.filter(n => n.amigavel).length;
  const negNaoAmigavel = negociacoesRelatorio.filter(n => !n.amigavel).length;
  const negTotal       = negociacoesRelatorio.length;
  const valorNegociadoTotal = negociacoesRelatorio.reduce((s, n) => s + n.valor, 0);
  const imoveisNegociadosIds = new Set(negociacoesRelatorio.map(n => n.imovelId));
  const valorAvaliacaoNegociados = imoveisRelatorio
    .filter(i => imoveisNegociadosIds.has(i.id))
    .reduce((s, i) => s + (i.valorAvaliacao ?? 0), 0);
  const diffNegociacaoPct = valorAvaliacaoNegociados > 0
    ? ((valorNegociadoTotal - valorAvaliacaoNegociados) / valorAvaliacaoNegociados) * 100
    : 0;

  // ── Leilões: taxa de sucesso por número ──
  const leilaoPorNumero = [1, 2, 3].map(num => {
    const doNumero = leiloesRelatorio.filter(l => l.numero === num);
    const concluidos = doNumero.filter(l => l.status === 'COMERCIALIZAÇÃO').length;
    return {
      numero: `${num}º Leilão`,
      total: doNumero.length,
      concluidos,
      taxa: doNumero.length > 0 ? Math.round((concluidos / doNumero.length) * 100) : 0,
    };
  }).filter(d => d.total > 0);

  // ── Evolução Temporal: cadastros vs vendas (últimos 6 meses) ──
  const hoje = new Date();
  const meses: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    meses.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    });
  }
  const cadastrosPorMes = new Map<string, number>();
  for (const i of imoveisRelatorio) {
    if (!i.createdAt) continue;
    const d = new Date(i.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    cadastrosPorMes.set(key, (cadastrosPorMes.get(key) ?? 0) + 1);
  }
  const vendasPorMes = new Map<string, number>();
  for (const h of historicosRelatorio) {
    if (h.etapa !== 'VENDA') continue;
    const d = parseHistDate(h.startedAt);
    if (!d) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    vendasPorMes.set(key, (vendasPorMes.get(key) ?? 0) + 1);
  }
  const evolucaoTemporalData = meses.map(m => ({
    mes: m.label,
    cadastros: cadastrosPorMes.get(m.key) ?? 0,
    vendas: vendasPorMes.get(m.key) ?? 0,
  }));

  // ── SLA distribution ──
  const historicoPorImovel = new Map<string, HistoricoDuracaoDTO[]>();
  for (const h of historicos) {
    const arr = historicoPorImovel.get(h.imovelId) ?? [];
    arr.push(h);
    historicoPorImovel.set(h.imovelId, arr);
  }
  const slaCounts = { prazo: 0, atencao: 0, vencido: 0 };
  for (const i of imoveis) {
    const etapa  = i.etapa ?? 'CADASTRO';
    const limite = SLA_DIAS_DASH[etapa] ?? 60;
    const dias   = diasNaEtapaAtual(etapa, historicoPorImovel.get(i.id) ?? [], i.createdAt ? new Date(i.createdAt) : null);
    const pct    = limite > 0 ? dias / limite : 0;
    if (pct >= 1)         slaCounts.vencido++;
    else if (pct >= 0.75) slaCounts.atencao++;
    else                  slaCounts.prazo++;
  }

  const handleExportPDF = () => {
    gerarRelatorioPDF({
      total, valorTotal, mediaValor, slaCounts,
      tempoMedioData, despesasPorCategoria, despesasAprovadas, despesasPendentes,
      negAmigavel, negNaoAmigavel, valorNegociadoTotal, valorAvaliacaoNegociados, diffNegociacaoPct,
      leilaoPorNumero, evolucaoTemporalData,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Visão geral da gestão de imóveis</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Total de Imóveis"        value={total}                                                           description="Cadastrados no sistema"                   icon={Building2}    variant="default" isDark={isDark} />
        <KpiCard label="Valor Total em Carteira"  value={`R$ ${(valorTotal / 1_000_000).toFixed(1)}M`}                   description="Soma dos valores de avaliação"            icon={DollarSign}   variant="info"    isDark={isDark} />
        <KpiCard label="Valor Médio por Imóvel"   value={`R$ ${mediaValor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} description="Média dos valores de avaliação"  icon={TrendingUp}   variant="success" isDark={isDark} />
      </div>

      {/* SLA Distribution */}
      {total > 0 && reportsLoading && (
        <div className="rounded-xl p-10 flex items-center justify-center" style={cardStyle}>
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
        </div>
      )}
      {total > 0 && !reportsLoading && (
        <div className="rounded-xl p-6" style={cardStyle}>
          <p className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Status de SLA</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Em Dia',  count: slaCounts.prazo,   color: '#006829', bg: '#E6F7ED', border: '#CCEFDB' },
              { label: 'Atenção', count: slaCounts.atencao,  color: '#CC8300', bg: '#FFF4E6', border: '#FFE9CC' },
              { label: 'Vencido', count: slaCounts.vencido,  color: '#dc2626', bg: '#FEF2F2', border: '#FECACA' },
            ].map(({ label, count, color, bg, border }) => (
              <div key={label} className="rounded-xl p-4 border text-center"
                style={{ background: bg, borderColor: border }}>
                <p className="text-2xl font-bold" style={{ color }}>{count}</p>
                <p className="text-sm font-medium mt-0.5" style={{ color }}>{label}</p>
              </div>
            ))}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: 'var(--muted)' }}>
            <div style={{ width: `${(slaCounts.prazo / total) * 100}%`, background: '#16a34a', transition: 'width 0.5s' }} />
            <div style={{ width: `${(slaCounts.atencao / total) * 100}%`, background: '#EAB308', transition: 'width 0.5s' }} />
            <div style={{ width: `${(slaCounts.vencido / total) * 100}%`, background: '#dc2626', transition: 'width 0.5s' }} />
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
            <span>Em Dia</span>
            <span>Vencido</span>
          </div>
        </div>
      )}

      {/* Gráfico: Imóveis por Tipo */}
      {tipoData.length > 0 && (
        <div className="rounded-xl p-6" style={cardStyle}>
          <p className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Imóveis por Tipo</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={tipoData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="tipo" stroke={axisColor} tick={{ fontSize: 12 }} />
              <YAxis stroke={axisColor} tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
              />
              <Bar dataKey="quantidade" fill={chartPrimary} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mapa de imóveis + filtros */}
      {imoveis.length > 0 && (
        <div className="rounded-xl p-6" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Localização dos Imóveis</p>
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--ailos-azul-50)', color: 'var(--primary)' }}>
              {imoveisParaMapa.filter(i => i.latitude != null).length} no mapa
            </span>
          </div>

          <div className="flex gap-4 items-start">
            {/* Filtros */}
            <div className="flex-shrink-0 space-y-3" style={{ width: 220 }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Filtros</p>

              {/* Estado */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--foreground)' }}>Estado</label>
                <select
                  value={mapEstado}
                  onChange={e => { setMapEstado(e.target.value); setMapCidade(''); }}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="">Todos</option>
                  {estados.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Cidade */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--foreground)' }}>Cidade</label>
                <select
                  value={mapCidade}
                  onChange={e => setMapCidade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="">Todas</option>
                  {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Valor */}
              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--foreground)' }}>Valor de Avaliação</label>
                {sliderMax > 0 ? (
                  <>
                    <Slider
                      min={0}
                      max={sliderMax}
                      step={10000}
                      value={mapValorRange}
                      onValueChange={v => setMapValorRange([v[0], v[1]])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>R$ {mapValorRange[0].toLocaleString('pt-BR')}</span>
                      <span>R$ {mapValorRange[1].toLocaleString('pt-BR')}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>—</p>
                )}
              </div>

              {/* Data */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--foreground)' }}>Data de Avaliação</label>
                <div className="space-y-1.5">
                  <input
                    type="date"
                    value={mapDataDe}
                    onChange={e => setMapDataDe(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border text-xs outline-none"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                  <input
                    type="date"
                    value={mapDataAte}
                    onChange={e => setMapDataAte(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border text-xs outline-none"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>

              {/* Limpar filtros */}
              {(mapEstado || mapCidade || isValorFiltered || mapDataDe || mapDataAte) && (
                <button
                  onClick={() => { setMapEstado(''); setMapCidade(''); setMapValorRange([0, sliderMax]); setMapDataDe(''); setMapDataAte(''); }}
                  className="w-full py-1.5 rounded-lg border text-xs font-semibold"
                  style={{ color: 'var(--ailos-vermelho-500)', borderColor: 'var(--ailos-vermelho-100)', background: 'var(--ailos-vermelho-50)' }}
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Mapa */}
            <div className="flex-1 min-w-0">
              <ImovelMap imoveis={imoveisParaMapa} isDark={isDark} height={640} />
            </div>
          </div>
        </div>
      )}

      {/* ───────────── Relatórios ───────────── */}
      {total > 0 && (
        <>
          <div className="pt-2 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Relatórios</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Indicadores financeiros, operacionais e de leilões</p>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={reportsLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--primary)', opacity: reportsLoading ? 0.6 : 1, cursor: reportsLoading ? 'not-allowed' : 'pointer' }}
            >
              <FileDown className="h-4 w-4" /> Exportar PDF
            </button>
          </div>

          {/* Filtro por estado/cidade */}
          <div className="flex items-center gap-3">
            <select
              value={relEstado}
              onChange={e => { setRelEstado(e.target.value); setRelCidade(''); }}
              className="px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <option value="">Todos os estados</option>
              {estados.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={relCidade}
              onChange={e => setRelCidade(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <option value="">Todas as cidades</option>
              {relCidades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {(relEstado || relCidade) && (
              <button
                onClick={() => { setRelEstado(''); setRelCidade(''); }}
                className="px-3 py-2 rounded-lg border text-xs font-semibold"
                style={{ color: 'var(--ailos-vermelho-500)', borderColor: 'var(--ailos-vermelho-100)', background: 'var(--ailos-vermelho-50)' }}
              >
                Limpar filtro
              </button>
            )}
          </div>

          {reportsLoading ? (
            <div className="rounded-xl p-10 flex items-center justify-center" style={cardStyle}>
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <>
              {/* Tempo Médio por Etapa */}
              {tempoMedioData.length > 0 && (
                <div className="rounded-xl p-6" style={cardStyle}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Tempo Médio por Etapa</p>
                  </div>
                  {etapaMaisLenta && (
                    <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
                      Etapa mais lenta no geral: <strong style={{ color: '#CC8300' }}>{etapaMaisLenta.etapa}</strong> ({etapaMaisLenta.dias} dias em média)
                    </p>
                  )}
                  <ResponsiveContainer width="100%" height={Math.max(220, tempoMedioData.length * 42)}>
                    <BarChart data={tempoMedioData} layout="vertical" margin={{ left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis type="number" stroke={axisColor} tick={{ fontSize: 12 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="etapa" stroke={axisColor} tick={{ fontSize: 12 }} width={140} />
                      <Tooltip
                        contentStyle={chartTooltipStyle}
                        cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                        formatter={(v: number) => [`${v} dias`, 'Tempo médio']}
                      />
                      <Bar dataKey="dias" fill={chartPrimary} radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Financeiro */}
              <div className="rounded-xl p-6" style={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Financeiro</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Despesas por categoria */}
                  <div>
                    <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Despesas por Categoria</p>
                    {despesasPorCategoria.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={despesasPorCategoria}>
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                          <XAxis dataKey="categoria" stroke={axisColor} tick={{ fontSize: 11 }} />
                          <YAxis stroke={axisColor} tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Valor']} />
                          <Bar dataKey="valor" fill="#CC8300" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhuma despesa registrada.</p>
                    )}
                    <div className="flex justify-between text-sm mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: '#16a34a' }}>Aprovadas: R$ {despesasAprovadas.toLocaleString('pt-BR')}</span>
                      <span style={{ color: '#CC8300' }}>Pendentes: R$ {despesasPendentes.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Negociações */}
                  <div>
                    <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Negociações</p>
                    {negTotal > 0 ? (
                      <>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="rounded-xl p-3 border text-center" style={{ background: '#E6F7ED', borderColor: '#CCEFDB' }}>
                            <p className="text-xl font-bold" style={{ color: '#006829' }}>{negAmigavel}</p>
                            <p className="text-xs" style={{ color: '#006829' }}>Amigáveis</p>
                          </div>
                          <div className="rounded-xl p-3 border text-center" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                            <p className="text-xl font-bold" style={{ color: '#dc2626' }}>{negNaoAmigavel}</p>
                            <p className="text-xs" style={{ color: '#dc2626' }}>Não Amigáveis</p>
                          </div>
                        </div>
                        <div className="text-sm space-y-1.5">
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--muted-foreground)' }}>Valor Negociado</span>
                            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>R$ {valorNegociadoTotal.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--muted-foreground)' }}>Valor de Avaliação (mesmos imóveis)</span>
                            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>R$ {valorAvaliacaoNegociados.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
                            <span style={{ color: 'var(--muted-foreground)' }}>Diferença</span>
                            <span className="font-semibold" style={{ color: diffNegociacaoPct >= 0 ? '#16a34a' : '#dc2626' }}>
                              {diffNegociacaoPct >= 0 ? '+' : ''}{diffNegociacaoPct.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhuma negociação registrada.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Leilões */}
              <div className="rounded-xl p-6" style={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <Gavel className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Taxa de Sucesso por Leilão</p>
                </div>
                {leilaoPorNumero.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {leilaoPorNumero.map(l => (
                      <div key={l.numero} className="rounded-xl p-4 border" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{l.numero}</p>
                        <p className="text-2xl font-bold" style={{ color: chartPrimary }}>{l.taxa}%</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{l.concluidos} de {l.total} concluídos</p>
                        <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: 'var(--border)' }}>
                          <div className="h-full rounded-full" style={{ width: `${l.taxa}%`, background: chartPrimary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhum leilão registrado.</p>
                )}
              </div>

              {/* Evolução Temporal */}
              <div className="rounded-xl p-6" style={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Evolução Temporal — Cadastros vs Vendas</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={evolucaoTemporalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="mes" stroke={axisColor} tick={{ fontSize: 12 }} />
                    <YAxis stroke={axisColor} tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="cadastros" name="Cadastros" fill={chartPrimary} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="vendas" name="Vendas" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </>
      )}

      {total === 0 && (
        <div className="rounded-xl p-12 text-center" style={cardStyle}>
          <Building2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--ailos-cinza-400)' }} />
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Nenhum imóvel cadastrado</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Cadastre o primeiro imóvel para ver as estatísticas.</p>
        </div>
      )}
    </div>
  );
}
