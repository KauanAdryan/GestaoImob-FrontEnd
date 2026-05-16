import { useEffect, useState } from 'react';
import { Building2, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { imovelService, type ImovelAPI } from '../../services/imovelService';

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

  useEffect(() => {
    imovelService.getAll()
      .then(setImoveis)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total          = imoveis.length;
  const valorTotal     = imoveis.reduce((s, i) => s + (i.valorAvaliacao ?? 0), 0);
  const mediaValor     = total > 0 ? valorTotal / total : 0;

  const tipoData = ['Apartamento', 'Casa', 'Comercial', 'Terreno', 'Galpao', 'Rural'].map(tipo => ({
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

      {/* Lista recente */}
      {imoveis.length > 0 && (
        <div className="rounded-xl p-6" style={cardStyle}>
          <p className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Imóveis Cadastrados</p>
          <div className="space-y-3">
            {imoveis.slice(0, 5).map(imovel => (
              <div key={imovel.id} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {imovel.tipoImovel} — {imovel.enderecoDTO?.cidadeNome ?? '—'}/{imovel.enderecoDTO?.estadoSigla ?? '—'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {imovel.area} m² · {imovel.quartos} quartos · Matrícula {imovel.numeroMatricula}
                  </p>
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                  R$ {(imovel.valorAvaliacao ?? 0).toLocaleString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>
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
