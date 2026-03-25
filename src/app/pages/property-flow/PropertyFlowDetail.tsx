import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, User, MapPin, Edit, DollarSign, FileText, AlertCircle, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { mockProperties, mockComments, mockDespesas, mockOcorrenciasFiscais, flowStagesConfig } from '../../data/property-flow-updated';
import { SLABadge } from '../../components/property-flow/SLABadge';
import { PropertyTagBadge } from '../../components/property-flow/PropertyTagBadge';
import { FlowStepper } from '../../components/property-flow/FlowStepper';
import { CommentFeed } from '../../components/property-flow/CommentFeed';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(14px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }

  .a-fade-up   { animation: fadeInUp 0.4s ease both; }
  .a-fade      { animation: fadeIn 0.3s ease both; }
  .a-slide-r   { animation: slideInRight 0.4s ease both; }
  .a-scale     { animation: scaleIn 0.35s ease both; }

  .detail-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .detail-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px -6px rgba(22,92,125,0.14);
  }

  .btn-back {
    transition: transform 0.15s ease, color 0.15s ease, background 0.15s ease;
  }
  .btn-back:hover {
    transform: translateX(-3px);
    background: #eef7fb;
    color: #165c7d;
  }

  .tab-content-enter {
    animation: scaleIn 0.3s ease both;
  }

  .expense-row {
    transition: background 0.15s ease, transform 0.15s ease;
  }
  .expense-row:hover {
    background: #f8fbfd;
    transform: translateX(3px);
  }

  .hero-img {
    transition: transform 0.4s ease;
  }
  .hero-img:hover {
    transform: scale(1.03);
  }

  .pill-badge {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .pill-badge:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px -2px rgba(22,92,125,0.2);
  }
`;

export default function PropertyFlowDetail() {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('resumo');

  if (!property) {
    return (
      <div className="flex items-center justify-center h-96">
        <p style={{ color: '#8baebb' }}>Imóvel não encontrado</p>
      </div>
    );
  }

  const propertyComments = mockComments.filter(() => true);
  const propertyDespesas = mockDespesas.filter(d => d.imovelId === id);
  const propertyOcorrencias = mockOcorrenciasFiscais.filter(o => o.imovelId === id);
  const totalDespesas = propertyDespesas.reduce((sum, d) => sum + d.valor, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #f8fbfd 0%, #f0f7fb 100%)' }}>
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Back button */}
          <Link to="/gestao-bens">
            <button
              className="btn-back flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium a-fade"
              style={{ color: '#4a7a8e' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Lista
            </button>
          </Link>

          {/* Hero Header */}
          <div
            className="rounded-2xl overflow-hidden a-fade-up"
            style={{
              background: 'white',
              border: '1px solid #e8f2f7',
              boxShadow: '0 4px 20px -6px rgba(22,92,125,0.12)',
              animationDelay: '40ms',
            }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Imagem */}
              <div className="lg:w-64 h-52 lg:h-auto overflow-hidden flex-shrink-0">
                <img
                  src={property.foto}
                  alt={property.codigo}
                  className="hero-img w-full h-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="flex-1 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold" style={{ color: '#0f3d52' }}>{property.codigo}</h1>
                    <div className="flex items-center gap-2 mt-2" style={{ color: '#6b8fa0' }}>
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{property.endereco}, {property.cidade} - {property.estado}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {[property.tipo, `${property.area}m²`, `R$ ${property.valor.toLocaleString('pt-BR')}`].map(label => (
                        <span
                          key={label}
                          className="pill-badge inline-block px-3 py-1 rounded-full text-xs font-semibold border"
                          style={{ background: '#eef7fb', color: '#165c7d', borderColor: '#cde8f4' }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    {property.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {property.tags.map((tag, i) => <PropertyTagBadge key={i} tag={tag} />)}
                      </div>
                    )}
                  </div>
                  <div
                    className="flex flex-col gap-3 p-4 rounded-xl a-slide-r"
                    style={{ background: '#f8fbfd', border: '1px solid #e8f2f7', animationDelay: '120ms' }}
                  >
                    <SLABadge status={property.slaStatus} data={property.slaData} />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: '#165c7d' }}
                      >
                        {property.responsavel.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#8baebb' }}>Responsável</p>
                        <p className="text-sm font-semibold" style={{ color: '#0f3d52' }}>{property.responsavel}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#8baebb' }}>Última atualização</p>
                      <p className="text-sm font-medium" style={{ color: '#374151' }}>
                        {format(property.ultimaAtualizacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="a-fade-up" style={{ animationDelay: '100ms' }}>
            <FlowStepper currentStage={property.etapaAtual} subStage={property.subEtapa} />
          </div>

          {/* Tabs */}
          <div className="a-fade-up" style={{ animationDelay: '140ms' }}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className="flex w-full rounded-2xl p-1 gap-1 mb-6"
                style={{ background: 'white', border: '1px solid #e8f2f7' }}
              >
                {[
                  { value: 'resumo', label: 'Resumo' },
                  { value: 'etapas', label: 'Etapas' },
                  { value: 'negociacao', label: 'Negociação' },
                  { value: 'juridico', label: 'Jurídico' },
                  { value: 'despesas', label: 'Despesas' },
                  { value: 'documentos', label: 'Documentos' },
                  { value: 'ocorrencias', label: 'Ocorrências' },
                ].map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className="flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: activeTab === tab.value ? '#165c7d' : 'transparent',
                      color: activeTab === tab.value ? 'white' : '#6b8fa0',
                      boxShadow: activeTab === tab.value ? '0 2px 8px -2px rgba(22,92,125,0.4)' : 'none',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </TabsList>

              {/* Resumo */}
              <TabsContent value="resumo" className="tab-content-enter space-y-5">
                {/* Cards de resumo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Etapa Atual */}
                  <div className="detail-card rounded-2xl p-5 border" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8baebb' }}>Etapa Atual</p>
                    <p className="text-xl font-bold" style={{ color: '#0f3d52' }}>
                      {property.etapaAtual.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    {property.subEtapa && (
                      <p className="text-sm mt-1" style={{ color: '#6b8fa0' }}>
                        {property.subEtapa.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    )}
                  </div>
                  {/* Próximos Passos */}
                  <div className="detail-card rounded-2xl p-5 border" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8baebb' }}>Próximos Passos</p>
                    <ul className="space-y-2">
                      {['Aguardar data do 2º leilão', 'Publicar edital no site oficial', 'Resolver pendência fiscal de IPTU'].map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#165c7d' }} />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Alertas */}
                  <div className="detail-card rounded-2xl p-5 border" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8baebb' }}>Alertas</p>
                    <div className="space-y-2">
                      {propertyOcorrencias.length > 0 && (
                        <div className="p-3 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                          <p className="text-sm font-semibold" style={{ color: '#92400e' }}>Pendências Fiscais</p>
                          <p className="text-xs mt-0.5" style={{ color: '#b45309' }}>{propertyOcorrencias.length} ocorrência(s) em aberto</p>
                        </div>
                      )}
                      {property.tags.some(t => t.tipo === 'liminar') && (
                        <div className="p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                          <p className="text-sm font-semibold" style={{ color: '#991b1b' }}>Em Liminar</p>
                          <p className="text-xs mt-0.5" style={{ color: '#b91c1c' }}>Desocupação suspensa por decisão judicial</p>
                        </div>
                      )}
                      {property.slaStatus === 'vencido' && (
                        <div className="p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                          <p className="text-sm font-semibold" style={{ color: '#991b1b' }}>SLA Vencido</p>
                          <p className="text-xs mt-0.5" style={{ color: '#b91c1c' }}>Prazo excedido - ação imediata necessária</p>
                        </div>
                      )}
                      {propertyOcorrencias.length === 0 && !property.tags.some(t => t.tipo === 'liminar') && property.slaStatus !== 'vencido' && (
                        <p className="text-sm" style={{ color: '#22a45d' }}>✓ Nenhum alerta ativo</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resumo financeiro */}
                <div
                  className="detail-card rounded-2xl p-6 border"
                  style={{ background: 'white', borderColor: '#e8f2f7' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#8baebb' }}>Resumo Financeiro</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Valor de Avaliação', value: `R$ ${property.valor.toLocaleString('pt-BR')}`, color: '#0f3d52', icon: DollarSign, bg: '#eef7fb' },
                      { label: 'Despesas Acumuladas', value: `R$ ${totalDespesas.toLocaleString('pt-BR')}`, color: '#dc2626', icon: TrendingDown, bg: '#fef2f2' },
                      { label: 'Valor Líquido Estimado', value: `R$ ${(property.valor - totalDespesas).toLocaleString('pt-BR')}`, color: '#16a34a', icon: TrendingUp, bg: '#f0fdf4' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                          <item.icon className="w-6 h-6" style={{ color: item.color }} />
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: '#8baebb' }}>{item.label}</p>
                          <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documentos Pendentes */}
                <div className="detail-card rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: '#f0f7fb', background: '#f8fbfd' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8baebb' }}>Documentos Pendentes</p>
                  </div>
                  <div className="p-4 space-y-2">
                    {['Comprovante de quitação do leilão', 'Ata do 1º leilão'].map(doc => (
                      <div key={doc} className="expense-row flex items-center justify-between p-3 rounded-xl" style={{ border: '1px solid #fde68a', background: '#fffbeb' }}>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#374151' }}>{doc}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#8baebb' }}>Obrigatório para etapa atual</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#fef3c7', color: '#92400e' }}>Pendente</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Etapas */}
              <TabsContent value="etapas" className="tab-content-enter">
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: '#f0f7fb', background: '#f8fbfd' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8baebb' }}>Timeline de Etapas</p>
                  </div>
                  <div className="p-6">
                    <CommentFeed comments={propertyComments} />
                  </div>
                </div>
              </TabsContent>

              {/* Negociação / Jurídico */}
              {['negociacao', 'juridico'].map(tab => (
                <TabsContent key={tab} value={tab} className="tab-content-enter">
                  <div className="rounded-2xl border p-12 text-center" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#eef7fb' }}>
                      <FileText className="w-8 h-8" style={{ color: '#165c7d' }} />
                    </div>
                    <p className="font-semibold" style={{ color: '#0f3d52' }}>Em desenvolvimento</p>
                    <p className="text-sm mt-1" style={{ color: '#8baebb' }}>Conteúdo de {tab} em breve</p>
                  </div>
                </TabsContent>
              ))}

              {/* Despesas */}
              <TabsContent value="despesas" className="tab-content-enter">
                <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                  <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#f0f7fb', background: '#f8fbfd' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8baebb' }}>Despesas do Imóvel</p>
                    <button
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: '#165c7d', transition: 'opacity 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    >
                      <Plus className="h-4 w-4" /> Adicionar Despesa
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {propertyDespesas.map(despesa => (
                      <div key={despesa.id} className="expense-row flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: '#e8f2f7' }}>
                        <div className="flex-1">
                          <p className="font-medium text-sm" style={{ color: '#0f3d52' }}>{despesa.descricao}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#8baebb' }}>
                            {despesa.categoria} • {format(despesa.data, 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold" style={{ color: '#0f3d52' }}>R$ {despesa.valor.toLocaleString('pt-BR')}</p>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={despesa.aprovado
                              ? { background: '#dcfce7', color: '#166534' }
                              : { background: '#fef3c7', color: '#92400e' }
                            }
                          >
                            {despesa.aprovado ? 'Aprovado' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {propertyDespesas.length === 0 && (
                      <div className="py-12 text-center">
                        <DollarSign className="w-10 h-10 mx-auto mb-3" style={{ color: '#c5dde8' }} />
                        <p style={{ color: '#8baebb' }}>Nenhuma despesa registrada</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Documentos */}
              <TabsContent value="documentos" className="tab-content-enter">
                <div className="rounded-2xl border p-12 text-center" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#eef7fb' }}>
                    <FileText className="w-8 h-8" style={{ color: '#165c7d' }} />
                  </div>
                  <p className="font-semibold" style={{ color: '#0f3d52' }}>Em desenvolvimento</p>
                  <p className="text-sm mt-1" style={{ color: '#8baebb' }}>Gerenciamento de documentos em breve</p>
                </div>
              </TabsContent>

              {/* Ocorrências */}
              <TabsContent value="ocorrencias" className="tab-content-enter space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: '#0f3d52' }}>Ocorrências Fiscais e Reavaliações</h3>
                    <p className="text-sm mt-0.5" style={{ color: '#8baebb' }}>Solicitações enviadas ao setor fiscal</p>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: '#d97706', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  >
                    <Plus className="h-4 w-4" /> Solicitar Ocorrência
                  </button>
                </div>
                {propertyOcorrencias.map(ocorrencia => (
                  <div key={ocorrencia.id} className="detail-card rounded-2xl border p-5" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold border" style={{ color: '#165c7d', borderColor: '#cde8f4', background: '#eef7fb' }}>
                            {ocorrencia.tipo.toUpperCase()}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={
                              ocorrencia.status === 'concluido'
                                ? { background: '#dcfce7', color: '#166534' }
                                : ocorrencia.status === 'em-andamento'
                                  ? { background: '#eef7fb', color: '#165c7d' }
                                  : { background: '#fef3c7', color: '#92400e' }
                            }
                          >
                            {ocorrencia.status}
                          </span>
                        </div>
                        <p className="font-medium" style={{ color: '#0f3d52' }}>{ocorrencia.descricao}</p>
                        <p className="text-sm mt-1" style={{ color: '#8baebb' }}>
                          Por {ocorrencia.solicitadoPor} em {format(ocorrencia.dataSolicitacao, 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                        {ocorrencia.observacoes && (
                          <p className="text-sm mt-2 p-3 rounded-xl" style={{ background: '#f8fbfd', color: '#374151' }}>
                            {ocorrencia.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {propertyOcorrencias.length === 0 && (
                  <div className="rounded-2xl border py-12 text-center" style={{ background: 'white', borderColor: '#e8f2f7' }}>
                    <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#c5dde8' }} />
                    <p style={{ color: '#8baebb' }}>Nenhuma ocorrência fiscal registrada</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}