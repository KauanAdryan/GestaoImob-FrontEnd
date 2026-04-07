import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Filter, MessageSquare, DollarSign, Eye, FileWarning, Building2, AlertTriangle, TrendingUp, Scale } from 'lucide-react';
import { mockProperties, flowStagesConfig } from '../../data/property-flow-updated';
import { PropertyFlow } from '../../types/property-flow';
import { SLABadge } from '../../components/property-flow/SLABadge';
import { PropertyTagBadge } from '../../components/property-flow/PropertyTagBadge';
import { QuickUpdateModal } from '../../components/property-flow/QuickUpdateModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in-up  { animation: fadeInUp 0.4s ease both; }
  .animate-fade-in     { animation: fadeIn 0.3s ease both; }
  .animate-slide-left  { animation: slideInLeft 0.35s ease both; }
  .animate-count       { animation: countUp 0.5s cubic-bezier(.34,1.56,.64,1) both; }

  .stat-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px -8px rgba(0, 154, 68, 0.18);
  }

  .table-row-animate {
    transition: background 0.15s ease, transform 0.15s ease;
  }
  .table-row-animate:hover {
    background: #eef7fb !important;
    transform: translateX(2px);
  }

  .action-btn {
    transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
  }
  .action-btn:hover {
    transform: scale(1.12);
  }

  .filter-card {
    transition: box-shadow 0.2s ease;
  }
  .filter-card:focus-within {
    box-shadow: 0 0 0 3px rgba(0, 154, 68, 0.1);
  }

  .btn-primary {
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px -4px rgba(0, 154, 68, 0.4);
  }
  .btn-primary:active {
    transform: translateY(0);
  }

  .property-img {
    transition: transform 0.3s ease;
  }
  .table-row-animate:hover .property-img {
    transform: scale(1.06);
  }
`;

export default function PropertyFlowList() {
  const [properties, setProperties] = useState<PropertyFlow[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConta, setFilterConta] = useState('');
  const [filterNome, setFilterNome] = useState('');
  const [filterPA, setFilterPA] = useState('');
  const [filterCidade, setFilterCidade] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterEtapa, setFilterEtapa] = useState('todas');
  const [filterSLA, setFilterSLA] = useState('todos');
  const [filterLiminar, setFilterLiminar] = useState(false);
  const [filterPendenciaFiscal, setFilterPendenciaFiscal] = useState(false);
  const [showQuickUpdateModal, setShowQuickUpdateModal] = useState(false);

  const filteredProperties = properties
    .filter(property => {
      const matchesSearch =
        property.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.cidade.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEtapa = filterEtapa === 'todas' || property.etapaAtual === filterEtapa;
      const matchesSLA = filterSLA === 'todos' || property.slaStatus === filterSLA;
      const matchesLiminar = !filterLiminar || property.tags.some(t => t.tipo === 'liminar');
      const matchesPendenciaFiscal = !filterPendenciaFiscal || property.tags.some(t => t.tipo === 'pendencia-fiscal');
      const matchesCidade = !filterCidade || property.cidade.toLowerCase().includes(filterCidade.toLowerCase());
      return matchesSearch && matchesEtapa && matchesSLA && matchesLiminar && matchesPendenciaFiscal && matchesCidade;
    })
    .sort((a, b) => {
      const slaOrder = { 'vencido': 0, 'proximo-vencimento': 1, 'no-prazo': 2 };
      return slaOrder[a.slaStatus] - slaOrder[b.slaStatus];
    });

  const getEtapaLabel = (etapa: string) =>
    flowStagesConfig.find(s => s.id === etapa)?.label || etapa;

  const stats = [
    {
      label: 'Total de Imóveis',
      value: properties.length,
      icon: Building2,
      color: '#165C7D',
      bg: '#eef7fb',
      delay: '0ms',
    },
    {
      label: 'SLA Vencido',
      value: properties.filter(p => p.slaStatus === 'vencido').length,
      icon: AlertTriangle,
      color: '#dc2626',
      bg: '#fef2f2',
      delay: '60ms',
    },
    {
      label: 'Em Liminar',
      value: properties.filter(p => p.tags.some(t => t.tipo === 'liminar')).length,
      icon: Scale,
      color: '#d97706',
      bg: '#fffbeb',
      delay: '120ms',
    },
    {
      label: 'Pendências Fiscais',
      value: properties.filter(p => p.tags.some(t => t.tipo === 'pendencia-fiscal')).length,
      icon: TrendingUp,
      color: '#0891b2',
      bg: '#ecfeff',
      delay: '180ms',
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #f8fbfd 0%, #eef7fb 100%)' }}>
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Header */}
          <div
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up"
            style={{ animationDelay: '0ms' }}
          >
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#0f3d52' }}>
                Gestão de Bens
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#4a7a8e' }}>
                Fluxo de imóveis a partir do Leilão •{' '}
                <span className="font-semibold" style={{ color: '#165C7D' }}>
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel' : 'imóveis'}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/gestao-bens/novo">
                <Button
                  className="btn-primary text-white font-semibold px-5 rounded-xl"
                  style={{ background: '#22a45d', border: 'none' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Imóvel
                </Button>
              </Link>
              <Button
                className="btn-primary text-white font-semibold px-5 rounded-xl"
                style={{ background: '#165C7D', border: 'none' }}
                onClick={() => setShowQuickUpdateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Atualização
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="stat-card rounded-2xl p-5 border animate-fade-in-up"
                style={{
                  background: 'white',
                  borderColor: '#e8f2f7',
                  animationDelay: stat.delay,
                  boxShadow: '0 2px 12px -4px rgba(22,92,125,0.08)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: stat.bg }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <p
                  className="text-3xl font-bold animate-count"
                  style={{ color: stat.color, animationDelay: stat.delay }}
                >
                  {stat.value}
                </p>
                <p className="text-sm mt-1" style={{ color: '#4a7a8e' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div
            className="filter-card rounded-2xl p-5 border animate-fade-in-up"
            style={{
              background: 'white',
              borderColor: '#e8f2f7',
              boxShadow: '0 2px 12px -4px rgba(22,92,125,0.08)',
              animationDelay: '100ms',
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#8baebb' }} />
                  <Input
                    placeholder="Buscar por código ou endereço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-gray-200 focus-visible:border-[#165C7D] focus-visible:ring-[#165C7D]/20"
                  />
                </div>
                <Select value={filterEtapa} onValueChange={setFilterEtapa}>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-[#165C7D]">
                    <SelectValue placeholder="Todas as Etapas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Etapas</SelectItem>
                    {flowStagesConfig.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>{stage.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterSLA} onValueChange={setFilterSLA}>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-[#165C7D]">
                    <SelectValue placeholder="Todos os SLAs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os SLAs</SelectItem>
                    <SelectItem value="no-prazo">No Prazo</SelectItem>
                    <SelectItem value="proximo-vencimento">Próximo do Vencimento</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <Input placeholder="Conta" value={filterConta} onChange={(e) => setFilterConta(e.target.value)} className="rounded-xl border-gray-200" />
                <Input placeholder="Nome Cooperado" value={filterNome} onChange={(e) => setFilterNome(e.target.value)} className="rounded-xl border-gray-200" />
                <Input placeholder="PA" value={filterPA} onChange={(e) => setFilterPA(e.target.value)} className="rounded-xl border-gray-200" />
                <Input placeholder="Cidade" value={filterCidade} onChange={(e) => setFilterCidade(e.target.value)} className="rounded-xl border-gray-200" />
                <button
                  onClick={() => setFilterLiminar(!filterLiminar)}
                  className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200"
                  style={{
                    background: filterLiminar ? '#dc2626' : 'white',
                    color: filterLiminar ? 'white' : '#374151',
                    borderColor: filterLiminar ? '#dc2626' : '#e5e7eb',
                    transform: filterLiminar ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <Filter className="h-4 w-4" /> Liminar
                </button>
                <button
                  onClick={() => setFilterPendenciaFiscal(!filterPendenciaFiscal)}
                  className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200"
                  style={{
                    background: filterPendenciaFiscal ? '#d97706' : 'white',
                    color: filterPendenciaFiscal ? 'white' : '#374151',
                    borderColor: filterPendenciaFiscal ? '#d97706' : '#e5e7eb',
                    transform: filterPendenciaFiscal ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <Filter className="h-4 w-4" /> Fiscal
                </button>
              </div>
            </div>
          </div>

          {/* Tabela Desktop */}
          <div
            className="hidden lg:block rounded-2xl border overflow-hidden animate-fade-in-up"
            style={{
              background: 'white',
              borderColor: '#e8f2f7',
              boxShadow: '0 2px 16px -6px rgba(22,92,125,0.1)',
              animationDelay: '160ms',
            }}
          >
            <Table>
              <TableHeader>
                <TableRow style={{ background: '#F7F7F7', borderBottom: '1px solid #E0E0E0' }}>
                  {['Imóvel', 'Etapa Atual', 'SLA', 'Responsável', 'Alertas', 'Última Atualização', ''].map(h => (
                    <TableHead key={h} className="font-semibold text-xs uppercase tracking-wider" style={{ color: '#4a7a8e' }}>
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property, i) => (
                  <TableRow
                    key={property.id}
                    className="table-row-animate"
                    style={{
                      borderBottom: '1px solid #eef7fb',
                      animation: `fadeInUp 0.35s ease both`,
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="overflow-hidden rounded-xl border" style={{ borderColor: '#e8f2f7' }}>
                          <img
                            src={property.foto}
                            alt={property.codigo}
                            className="property-img w-16 h-16 object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#0f3d52' }}>{property.codigo}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#4a7a8e' }}>{property.endereco}</p>
                          <p className="text-xs" style={{ color: '#8baebb' }}>{property.cidade}, {property.estado}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: '#eef7fb', color: '#165C7D' }}
                      >
                        {getEtapaLabel(property.etapaAtual)}
                      </span>
                      {property.subEtapa && (
                        <p className="text-xs mt-1" style={{ color: '#8baebb' }}>
                          {flowStagesConfig
                            .find(s => s.id === property.etapaAtual)
                            ?.subEtapas?.find(sub => sub.id === property.subEtapa)
                            ?.label}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <SLABadge status={property.slaStatus} data={property.slaData} showDays={false} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: '#165C7D' }}
                        >
                          {property.responsavel.charAt(0)}
                        </div>
                        <span className="text-sm" style={{ color: '#374151' }}>{property.responsavel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {property.tags.map((tag, index) => (
                          <PropertyTagBadge key={index} tag={tag} showIcon={false} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: '#4a7a8e' }}>
                      {format(property.ultimaAtualizacao, 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {[
                          { icon: MessageSquare, title: 'Comentário' },
                          { icon: FileWarning, title: 'Ocorrência' },
                          { icon: DollarSign, title: 'Despesas' },
                        ].map(({ icon: Icon, title }) => (
                          <button
                            key={title}
                            title={title}
                            className="action-btn w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ color: '#8baebb', background: 'transparent' }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.background = '#eef7fb';
                              (e.currentTarget as HTMLElement).style.color = '#165C7D';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                              (e.currentTarget as HTMLElement).style.color = '#8baebb';
                            }}
                          >
                            <Icon className="h-4 w-4" />
                          </button>
                        ))}
                        <Link to={`/gestao-bens/${property.id}`}>
                          <button
                            className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white ml-1"
                            style={{ background: '#165C7D' }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Abrir
                          </button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Cards Mobile */}
          <div className="lg:hidden space-y-3">
            {filteredProperties.map((property, i) => (
              <div
                key={property.id}
                className="rounded-2xl border p-4 animate-fade-in-up"
                style={{
                  background: 'white',
                  borderColor: '#e8f2f7',
                  boxShadow: '0 2px 8px -2px rgba(22,92,125,0.08)',
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <div className="flex gap-3">
                  <div className="overflow-hidden rounded-xl border" style={{ borderColor: '#e8f2f7' }}>
                    <img src={property.foto} alt={property.codigo} className="w-20 h-20 object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: '#0f3d52' }}>{property.codigo}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#4a7a8e' }}>{property.endereco}</p>
                    <p className="text-xs" style={{ color: '#8baebb' }}>{property.cidade}, {property.estado}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#eef7fb', color: '#165C7D' }}>
                        {getEtapaLabel(property.etapaAtual)}
                      </span>
                      <SLABadge status={property.slaStatus} data={property.slaData} showIcon={false} showDays={false} />
                    </div>
                  </div>
                </div>
                {property.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {property.tags.map((tag, index) => <PropertyTagBadge key={index} tag={tag} />)}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #eef7fb' }}>
                  <span className="text-xs" style={{ color: '#8baebb' }}>
                    {format(property.ultimaAtualizacao, 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                  <Link to={`/gestao-bens/${property.id}`}>
                    <button className="btn-primary flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#165C7D' }}>
                      <Eye className="h-3.5 w-3.5" /> Ver Detalhes
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div
              className="rounded-2xl border py-16 text-center animate-fade-in"
              style={{ background: 'white', borderColor: '#e8f2f7' }}
            >
              <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#c5dde8' }} />
              <p style={{ color: '#8baebb' }}>Nenhum imóvel encontrado com os filtros aplicados</p>
            </div>
          )}
        </div>

        <QuickUpdateModal open={showQuickUpdateModal} onOpenChange={setShowQuickUpdateModal} />
      </div>
    </>
  );
}