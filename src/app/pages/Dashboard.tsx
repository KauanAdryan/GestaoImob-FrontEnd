import { Building2, Home, TrendingUp, AlertCircle } from 'lucide-react';
import { mockProperties, mockContracts, mockPayments } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';

// ── KPI Card conforme design system Light / ──────────────────
// Variantes: default | success | alert | danger | info
type KpiVariant = 'default' | 'success' | 'alert' | 'danger' | 'info';

const kpiStyles: Record<KpiVariant, { bg: string; border: string; iconColor: string; valueColor: string }> = {
  default: {
    bg:         '#FFFFFF',
    border:     '#EFEFEF',
    iconColor:  '#8E8E8E',
    valueColor: '#1A1A1A',
  },
  success: {
    bg:         'linear-gradient(135deg, #E6F7ED 0%, #FFFFFF 100%)',
    border:     '#CCEFDB',
    iconColor:  '#00B140',
    valueColor: '#006829',
  },
  alert: {
    bg:         'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)',
    border:     '#FFE9CC',
    iconColor:  '#FFA300',
    valueColor: '#CC8300',
  },
  danger: {
    bg:         'linear-gradient(135deg, #FFEEF0 0%, #FFFFFF 100%)',
    border:     '#FFDDE0',
    iconColor:  '#E63946',
    valueColor: '#B30000',
  },
  info: {
    bg:         'linear-gradient(135deg, #E6F6FA 0%, #FFFFFF 100%)',
    border:     '#CCECF5',
    iconColor:  '#00A9CE',
    valueColor: '#00687D',
  },
};

function KpiCard({
  label,
  value,
  description,
  descriptionColor,
  icon: Icon,
  variant = 'default',
}: {
  label: string;
  value: string | number;
  description: string;
  descriptionColor?: string;
  icon: React.ElementType;
  variant?: KpiVariant;
}) {
  const s = kpiStyles[variant];
  return (
    <div
      className="rounded-xl p-6 transition-all duration-200"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: '#6A6A6A' }}>{label}</p>
        <Icon style={{ width: 20, height: 20, color: s.iconColor, flexShrink: 0 }} />
      </div>
      <p className="text-3xl font-bold" style={{ color: s.valueColor }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: descriptionColor ?? '#8E8E8E' }}>{description}</p>
    </div>
  );
}

// ── Cores do gráfico de pizza (design system) ───────────────────────────────
const PIE_COLORS = ['#165C7D', '#00B140', '#FFA300'];

export default function Dashboard() {
  const totalImoveis      = mockProperties.length;
  const imoveisAlugados   = mockProperties.filter(p => p.status === 'alugado').length;
  const imoveisDisponiveis = mockProperties.filter(p => p.status === 'disponivel').length;

  const receitaMensal = mockContracts
    .filter(c => c.ativo)
    .reduce((sum, c) => sum + c.valorAluguel, 0);

  const pagamentosAtrasados = mockPayments.filter(p => p.status === 'atrasado').length;

  const receitaMensalData = [
    { mes: 'Jan', valor: 8500 },
    { mes: 'Fev', valor: 14500 },
    { mes: 'Mar', valor: 8500 },
    { mes: 'Abr', valor: 8500 },
    { mes: 'Mai', valor: 14500 },
    { mes: 'Jun', valor: 14500 },
  ];

  const statusData = [
    { name: 'Alugados',    value: imoveisAlugados },
    { name: 'Disponíveis', value: imoveisDisponiveis },
    { name: 'Manutenção',  value: mockProperties.filter(p => p.status === 'manutencao').length },
  ];

  const tipoImovelData = [
    { tipo: 'Apartamento', quantidade: mockProperties.filter(p => p.tipo === 'apartamento').length },
    { tipo: 'Casa',        quantidade: mockProperties.filter(p => p.tipo === 'casa').length },
    { tipo: 'Comercial',   quantidade: mockProperties.filter(p => p.tipo === 'comercial').length },
    { tipo: 'Terreno',     quantidade: mockProperties.filter(p => p.tipo === 'terreno').length },
  ];

  const chartTooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #EFEFEF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: '#1A1A1A' }}>Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: '#6A6A6A' }}>Visão geral da gestão de imóveis</p>
      </div>

      {/* KPI Cards — variantes do design system */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total de Imóveis"
          value={totalImoveis}
          description="Cadastrados no sistema"
          icon={Building2}
          variant="default"
        />
        <KpiCard
          label="Imóveis Alugados"
          value={imoveisAlugados}
          description={`${((imoveisAlugados / totalImoveis) * 100).toFixed(0)}% de ocupação`}
          descriptionColor="#009033"
          icon={Home}
          variant="success"
        />
        <KpiCard
          label="Receita Mensal"
          value={`R$ ${receitaMensal.toLocaleString('pt-BR')}`}
          description="+12.5% em relação ao mês anterior"
          descriptionColor="#009033"
          icon={TrendingUp}
          variant="info"
        />
        <KpiCard
          label="Pagamentos Atrasados"
          value={pagamentosAtrasados}
          description="Requer atenção imediata"
          descriptionColor="#E63946"
          icon={AlertCircle}
          variant="danger"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Receita Mensal */}
        <div
          className="rounded-xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid #EFEFEF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="text-base font-semibold mb-4" style={{ color: '#1A1A1A' }}>Receita Mensal</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={receitaMensalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
              <XAxis dataKey="mes" stroke="#8E8E8E" tick={{ fontSize: 12 }} />
              <YAxis stroke="#8E8E8E" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                contentStyle={chartTooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#165C7D"
                strokeWidth={2}
                dot={{ fill: '#165C7D', r: 4 }}
                activeDot={{ r: 6, fill: '#124A65' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status dos Imóveis */}
        <div
          className="rounded-xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid #EFEFEF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="text-base font-semibold mb-4" style={{ color: '#1A1A1A' }}>Status dos Imóveis</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Imóveis por Tipo — full width */}
        <div
          className="lg:col-span-2 rounded-xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid #EFEFEF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <p className="text-base font-semibold mb-4" style={{ color: '#1A1A1A' }}>Imóveis por Tipo</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={tipoImovelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
              <XAxis dataKey="tipo" stroke="#8E8E8E" tick={{ fontSize: 12 }} />
              <YAxis stroke="#8E8E8E" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="quantidade" fill="#165C7D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div
        className="rounded-xl p-6"
        style={{ background: '#FFFFFF', border: '1px solid #EFEFEF', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <p className="text-base font-semibold mb-4" style={{ color: '#1A1A1A' }}>Atividades Recentes</p>
        <div className="space-y-4">
          {[
            { dot: '#00B140', title: 'Pagamento recebido',       sub: 'João Silva — Apartamento Centro — R$ 2.500',   time: 'Há 2 horas' },
            { dot: '#165C7D', title: 'Novo contrato assinado',   sub: 'Maria Santos — Sala Comercial Paulista',        time: 'Há 1 dia' },
            { dot: '#FFA300', title: 'Imóvel em manutenção',     sub: 'Cobertura Duplex — Pintura e reparos',          time: 'Há 2 dias' },
            { dot: '#00B140', title: 'Novo imóvel cadastrado',   sub: 'Casa com Piscina — Campinas/SP',                time: 'Há 3 dias' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 pb-4"
              style={{ borderBottom: i < 3 ? '1px solid #EFEFEF' : 'none' }}
            >
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ background: item.dot }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{item.title}</p>
                <p className="text-sm" style={{ color: '#6A6A6A' }}>{item.sub}</p>
                <p className="text-xs mt-1" style={{ color: '#8E8E8E' }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
