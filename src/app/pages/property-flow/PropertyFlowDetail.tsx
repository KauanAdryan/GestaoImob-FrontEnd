import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Tabs, TabsContent, TabsList } from '../../components/ui/tabs';
import { ArrowLeft, MapPin, DollarSign, FileText, Building2, Plus, Pencil, X, Save, Loader2, AlertCircle, Scale, Home } from 'lucide-react';
import { imovelService, enderecoLabel, imovelLabel, etapaToFlowStage, etapaLabel, STATUS_CONFIG, type ImovelAPI } from '../../../services/imovelService';
import { negociacaoService, type NegociacaoAPI, type NegociacaoPayload } from '../../../services/negociacaoService';
import { FlowStepper } from '../../components/property-flow/FlowStepper';

const styles = `
  @keyframes fadeInUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  .a-fade-up  { animation: fadeInUp 0.4s ease both; }
  .a-fade     { animation: fadeInUp 0.3s ease both; }
  .hero-img   { transition: transform 0.4s ease; }
  .hero-img:hover { transform: scale(1.03); }
  .pill-badge { transition: transform 0.15s ease; }
  .pill-badge:hover { transform: scale(1.05); }
  .tab-content-enter { animation: fadeInUp 0.3s ease both; }
`;

type NegFormState = { clienteId: string; valor: string; amigavel: boolean };
const emptyNegForm: NegFormState = { clienteId: '', valor: '', amigavel: true };

export default function PropertyFlowDetail() {
  const { id } = useParams();
  const [imovel, setImovel]           = useState<ImovelAPI | null>(null);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('resumo');

  const [negociacoes, setNegociacoes] = useState<NegociacaoAPI[]>([]);
  const [negLoading, setNegLoading]   = useState(false);
  const [showNegForm, setShowNegForm] = useState(false);
  const [negEdit, setNegEdit]         = useState<NegociacaoAPI | null>(null);
  const [negForm, setNegForm]         = useState<NegFormState>(emptyNegForm);
  const [negSaving, setNegSaving]     = useState(false);
  const [negError, setNegError]       = useState('');

  useEffect(() => {
    if (!id) return;
    imovelService.getById(id)
      .then(setImovel)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setNegLoading(true);
    negociacaoService.getByImovel(id)
      .then(data => setNegociacoes(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setNegLoading(false));
  }, [id]);

  const openNegCreate = () => {
    setNegEdit(null);
    setNegForm(emptyNegForm);
    setNegError('');
    setShowNegForm(true);
  };

  const openNegEdit = (neg: NegociacaoAPI) => {
    setNegEdit(neg);
    setNegForm({
      clienteId: neg.clienteId,
      valor: neg.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      amigavel: neg.amigavel,
    });
    setNegError('');
    setShowNegForm(true);
  };

  const handleNegValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) { setNegForm(f => ({ ...f, valor: '' })); return; }
    const num = parseInt(digits, 10) / 100;
    setNegForm(f => ({ ...f, valor: num.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }));
  };

  const handleNegSubmit = async () => {
    setNegError('');
    if (!negForm.clienteId.trim()) { setNegError('Informe o ID do cliente.'); return; }
    if (!negForm.valor)             { setNegError('Informe o valor da negociação.'); return; }
    const toNum = (v: string) => parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
    const payload: NegociacaoPayload = {
      imovelId:  id!,
      clienteId: negForm.clienteId.trim(),
      valor:     toNum(negForm.valor),
      amigavel:  negForm.amigavel,
    };
    setNegSaving(true);
    try {
      if (negEdit) {
        const updated = await negociacaoService.update(negEdit.id, payload);
        setNegociacoes(prev => prev.map(n => n.id === updated.id ? updated : n));
      } else {
        const created = await negociacaoService.create(payload);
        setNegociacoes(prev => [created, ...prev]);
      }
      setShowNegForm(false);
    } catch (err) {
      setNegError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setNegSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="flex items-center justify-center h-96">
        <p style={{ color: 'var(--muted-foreground)' }}>Imóvel não encontrado</p>
      </div>
    );
  }

  const cardStyle = { background: 'var(--card)', borderColor: 'var(--border)' };
  const sectionHdr = { borderColor: 'var(--border)', background: 'var(--muted)' };
  const foto = imovel.fotosImovel?.[0] ?? null;
  const e = imovel.enderecoDTO;

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen p-6" style={{ background: 'var(--background)' }}>
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Voltar */}
          <Link to="/gestao-bens">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium a-fade"
              style={{ color: 'var(--muted-foreground)', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; }}>
              <ArrowLeft className="h-4 w-4" /> Voltar para Lista
            </button>
          </Link>

          {/* Hero */}
          <div className="rounded-2xl overflow-hidden a-fade-up border" style={{ ...cardStyle, boxShadow: '0 4px 20px -6px rgba(0,0,0,0.1)' }}>
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-64 h-52 lg:h-auto overflow-hidden flex-shrink-0 bg-gray-100">
                {foto ? (
                  <img src={foto} alt="foto" className="hero-img w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--ailos-azul-50)' }}>
                    <Building2 className="w-16 h-16" style={{ color: 'var(--primary)' }} />
                  </div>
                )}
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      {imovelLabel(imovel)}
                    </h1>
                    {e && (
                      <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--muted-foreground)' }}>
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{enderecoLabel(imovel)}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {[
                        `${imovel.area} m²`,
                        `${imovel.quartos} quartos`,
                        `${imovel.banheiros} banheiros`,
                        `${imovel.vagasGaragem} vaga${imovel.vagasGaragem !== 1 ? 's' : ''}`,
                      ].map(label => (
                        <span key={label} className="pill-badge inline-block px-3 py-1 rounded-full text-xs font-semibold border"
                          style={{ background: 'var(--ailos-azul-50)', color: 'var(--primary)', borderColor: 'var(--border)' }}>
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {imovel.etapa && (
                        <span className="pill-badge inline-block px-3 py-1 rounded-full text-xs font-semibold border"
                          style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                          Etapa: {etapaLabel(imovel.etapa)}
                        </span>
                      )}
                      {imovel.status && (() => {
                        const s = STATUS_CONFIG[imovel.status!];
                        return (
                          <span className="pill-badge inline-block px-3 py-1 rounded-full text-xs font-semibold border"
                            style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                            {s.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 p-4 rounded-xl border" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                      <div>
                        <p className="text-xs" style={{ color: 'var(--ailos-cinza-500)' }}>Valor de Avaliação</p>
                        <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                          R$ {(imovel.valorAvaliacao ?? 0).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--ailos-cinza-500)' }}>Data da Avaliação</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        {imovel.dataAvaliacao ? new Date(imovel.dataAvaliacao).toLocaleDateString('pt-BR') : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--ailos-cinza-500)' }}>Cartório</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{imovel.cartorioRegistro}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper — etapa inicial */}
          <div className="a-fade-up">
            <FlowStepper currentStage={etapaToFlowStage(imovel.etapa)} />
          </div>

          {/* Tabs */}
          <div className="a-fade-up">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex w-full rounded-2xl p-1 gap-1 mb-6 border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                {[
                  { value: 'resumo',        label: 'Resumo' },
                  { value: 'negociacoes',   label: 'Negociações' },
                  { value: 'documentos',    label: 'Documentos' },
                  { value: 'despesas',      label: 'Despesas' },
                ].map(tab => (
                  <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                    className="flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: activeTab === tab.value ? 'var(--primary)' : 'transparent',
                      color:      activeTab === tab.value ? 'white' : 'var(--muted-foreground)',
                    }}>
                    {tab.label}
                  </button>
                ))}
              </TabsList>

              {/* Resumo */}
              <TabsContent value="resumo" className="tab-content-enter space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Dados do imóvel */}
                  <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                    <div className="px-6 py-4 border-b" style={sectionHdr}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ailos-cinza-500)' }}>Dados do Imóvel</p>
                    </div>
                    <div className="p-6 space-y-3">
                      {[
                        ['Tipo',        imovel.tipoImovel],
                        ['Área',        `${imovel.area} m²`],
                        ['Quartos',     String(imovel.quartos)],
                        ['Banheiros',   String(imovel.banheiros)],
                        ['Vagas',       String(imovel.vagasGaragem)],
                        ['Matrícula',   String(imovel.numeroMatricula)],
                        ['Cartório',    imovel.cartorioRegistro],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span style={{ color: 'var(--muted-foreground)' }}>{k}</span>
                          <span className="font-medium" style={{ color: 'var(--foreground)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Endereço */}
                  {e && (
                    <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                      <div className="px-6 py-4 border-b" style={sectionHdr}>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ailos-cinza-500)' }}>Endereço</p>
                      </div>
                      <div className="p-6 space-y-3">
                        {[
                          ['Logradouro',  e.ruaNome ?? '—'],
                          ['Número',      e.numero ?? '—'],
                          ['Complemento', e.complemento ?? '—'],
                          ['Bairro',      e.bairroDescricao ?? '—'],
                          ['Cidade',      e.cidadeNome ?? '—'],
                          ['Estado',      e.estadoSigla ?? '—'],
                          ['CEP',         e.cep ?? '—'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between text-sm">
                            <span style={{ color: 'var(--muted-foreground)' }}>{k}</span>
                            <span className="font-medium" style={{ color: 'var(--foreground)' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {imovel.descricao && (
                  <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                    <div className="px-6 py-4 border-b" style={sectionHdr}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ailos-cinza-500)' }}>Descrição</p>
                    </div>
                    <div className="p-6">
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>{imovel.descricao}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Negociações */}
              <TabsContent value="negociacoes" className="tab-content-enter space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {negociacoes.length} negociação{negociacoes.length !== 1 ? 'ões' : ''} registrada{negociacoes.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={openNegCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--primary)' }}
                  >
                    <Plus className="h-4 w-4" /> Nova Negociação
                  </button>
                </div>

                {/* Formulário inline */}
                {showNegForm && (
                  <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={sectionHdr}>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                        {negEdit ? 'Editar Negociação' : 'Nova Negociação'}
                      </p>
                      <button onClick={() => setShowNegForm(false)} style={{ color: 'var(--muted-foreground)' }}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Tipo */}
                      <div className="flex gap-3">
                        {([true, false] as const).map(val => {
                          const active = negForm.amigavel === val;
                          const Icon   = val ? Home : Scale;
                          const label  = val ? 'Amigável' : 'Não Amigável';
                          return (
                            <button key={String(val)} type="button"
                              onClick={() => setNegForm(f => ({ ...f, amigavel: val }))}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold flex-1 justify-center transition-all"
                              style={{
                                background:  active ? 'var(--primary)' : 'var(--card)',
                                color:       active ? 'white' : 'var(--muted-foreground)',
                                borderColor: active ? 'var(--primary)' : 'var(--border)',
                              }}>
                              <Icon className="h-4 w-4" />{label}
                            </button>
                          );
                        })}
                      </div>
                      {/* Valor */}
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                          Valor (R$) <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text" inputMode="numeric"
                          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          placeholder="0,00"
                          value={negForm.valor}
                          onChange={handleNegValor}
                          onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                          onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                        />
                      </div>
                      {/* Cliente ID */}
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                          ID do Cliente <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          placeholder="UUID do cliente"
                          value={negForm.clienteId}
                          onChange={e => setNegForm(f => ({ ...f, clienteId: e.target.value }))}
                          onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                          onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                        />
                        <p className="text-xs mt-1" style={{ color: 'var(--ailos-cinza-500)' }}>
                          Busca por nome disponível em breve.
                        </p>
                      </div>
                      {negError && (
                        <div className="flex items-start gap-2 rounded-xl px-4 py-3 border"
                          style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                          <p className="text-sm" style={{ color: 'var(--ailos-vermelho-500)' }}>{negError}</p>
                        </div>
                      )}
                      <div className="flex justify-end gap-3 pt-1">
                        <button onClick={() => setShowNegForm(false)}
                          className="px-4 py-2 rounded-xl border text-sm font-semibold"
                          style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'var(--card)' }}>
                          Cancelar
                        </button>
                        <button onClick={handleNegSubmit} disabled={negSaving}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{ background: '#16a34a', opacity: negSaving ? 0.7 : 1, cursor: negSaving ? 'not-allowed' : 'pointer' }}>
                          {negSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {negSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista */}
                {negLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                  </div>
                ) : negociacoes.length === 0 ? (
                  <div className="rounded-2xl border py-12 text-center" style={cardStyle}>
                    <Scale className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ailos-cinza-400)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Nenhuma negociação registrada</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Clique em "Nova Negociação" para começar.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {negociacoes.map(neg => (
                      <div key={neg.id} className="rounded-2xl border p-4 flex items-center justify-between gap-4" style={cardStyle}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: neg.amigavel ? '#E6F7ED' : '#FFF4E6' }}>
                            {neg.amigavel
                              ? <Home  className="w-4 h-4" style={{ color: '#006829' }} />
                              : <Scale className="w-4 h-4" style={{ color: '#CC8300' }} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold border"
                                style={neg.amigavel
                                  ? { background: '#E6F7ED', color: '#006829', borderColor: '#CCEFDB' }
                                  : { background: '#FFF4E6', color: '#CC8300', borderColor: '#FFE9CC' }}>
                                {neg.amigavel ? 'Amigável' : 'Não Amigável'}
                              </span>
                              <span className="text-xs font-mono" style={{ color: 'var(--ailos-cinza-500)' }}>#{neg.id.slice(0, 8)}</span>
                            </div>
                            <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--foreground)' }}>
                              R$ {neg.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Cliente: <span className="font-mono">{neg.clienteId}</span>
                            </p>
                          </div>
                        </div>
                        <button onClick={() => openNegEdit(neg)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold flex-shrink-0"
                          style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Documentos / Despesas — em desenvolvimento */}
              {['documentos', 'despesas'].map(tab => (
                <TabsContent key={tab} value={tab} className="tab-content-enter">
                  <div className="rounded-2xl border p-12 text-center" style={cardStyle}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--ailos-azul-50)' }}>
                      <FileText className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    </div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Em desenvolvimento</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--ailos-cinza-500)' }}>Funcionalidade disponível em breve.</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
