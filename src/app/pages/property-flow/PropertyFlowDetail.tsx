import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Tabs, TabsContent, TabsList } from '../../components/ui/tabs';
import { ArrowLeft, MapPin, DollarSign, FileText, Building2, Plus, Pencil, X, Save, Loader2, AlertCircle, Scale, Home, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { imovelService, enderecoLabel, imovelLabel, etapaToFlowStage, etapaLabel, STATUS_CONFIG, type ImovelAPI, type ImovelEtapa, type ImovelStatus } from '../../../services/imovelService';
import { negociacaoService, type NegociacaoAPI, type NegociacaoPayload } from '../../../services/negociacaoService';
import { clienteService, type ClienteAPI } from '../../../services/clienteService';
import { documentoService, TIPO_DOCUMENTO_LABELS, type DocumentoAPI, type TipoDocumento } from '../../../services/documentoService';
import { despesaService, type DespesaAPI, type DespesaPayload } from '../../../services/despesaService';
import { leilaoService, LEILAO_STATUS_CONFIG, type LeilaoAPI, type LeilaoPayload, type LeilaoStatus } from '../../../services/leilaoService';
import { ocorrenciaService, type OcorrenciaAPI } from '../../../services/ocorrenciaService';
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
  const [selectedFotoIdx, setSelectedFotoIdx] = useState(0);

  type LeilaoForm = { numero: string; data: string; valorMinimo: string; status: LeilaoStatus };
  const emptyLeilao: LeilaoForm = { numero: '', data: '', valorMinimo: '', status: '1º LEILÃO' };
  const [leiloes, setLeiloes]           = useState<LeilaoAPI[]>([]);
  const [leilaoLoading, setLeilaoLoading] = useState(false);
  const [showLeilaoForm, setShowLeilaoForm] = useState(false);
  const [leilaoEdit, setLeilaoEdit]     = useState<LeilaoAPI | null>(null);
  const [leilaoForm, setLeilaoForm]     = useState<LeilaoForm>(emptyLeilao);
  const [leilaoSaving, setLeilaoSaving] = useState(false);
  const [leilaoDeleting, setLeilaoDeleting] = useState<string | null>(null);
  const [leilaoError, setLeilaoError]   = useState('');

  const [documentos, setDocumentos]       = useState<DocumentoAPI[]>([]);
  const [docLoading, setDocLoading]       = useState(false);
  const [showDocForm, setShowDocForm]     = useState(false);
  const [docTipo, setDocTipo]             = useState<TipoDocumento>('MATRICULA_ATUALIZADA');
  const [docUploading, setDocUploading]   = useState(false);
  const [docDeleting, setDocDeleting]     = useState<string | null>(null);
  const [docError, setDocError]           = useState('');

  type DespesaForm = { categoria: string; data: string; valor: string; aprovado: boolean };
  const emptyDespesa: DespesaForm = { categoria: '', data: '', valor: '', aprovado: false };
  const [despesas, setDespesas]       = useState<DespesaAPI[]>([]);
  const [despLoading, setDespLoading] = useState(false);
  const [showDespForm, setShowDespForm] = useState(false);
  const [despEdit, setDespEdit]       = useState<DespesaAPI | null>(null);
  const [despForm, setDespForm]       = useState<DespesaForm>(emptyDespesa);
  const [despSaving, setDespSaving]   = useState(false);
  const [despDeleting, setDespDeleting]   = useState<string | null>(null);
  const [despToggling, setDespToggling]   = useState<string | null>(null);
  const [despError, setDespError]     = useState('');
  const [negociacoes, setNegociacoes] = useState<NegociacaoAPI[]>([]);
  const [clienteDoImovel, setClienteDoImovel] = useState<ClienteAPI | null>(null);
  const [negLoading, setNegLoading]           = useState(false);
  const [showNegForm, setShowNegForm] = useState(false);
  const [negEdit, setNegEdit]         = useState<NegociacaoAPI | null>(null);
  const [negForm, setNegForm]         = useState<NegFormState>(emptyNegForm);
  const [negSaving, setNegSaving]     = useState(false);
  const [negError, setNegError]       = useState('');

  const [showEtapaForm, setShowEtapaForm] = useState(false);
  const [etapaForm, setEtapaForm]         = useState<{ etapa: ImovelEtapa; status: ImovelStatus }>({ etapa: 'CADASTRO', status: 'DISPONIVEL' });
  const [etapaSaving, setEtapaSaving]     = useState(false);
  const [etapaError, setEtapaError]       = useState('');

  const [ocorrencias, setOcorrencias]         = useState<OcorrenciaAPI[]>([]);
  const [ocorrLoading, setOcorrLoading]       = useState(false);
  const [showOcorrForm, setShowOcorrForm]     = useState(false);
  const [ocorrEdit, setOcorrEdit]             = useState<OcorrenciaAPI | null>(null);
  const [ocorrText, setOcorrText]             = useState('');
  const [ocorrSaving, setOcorrSaving]         = useState(false);
  const [ocorrDeleting, setOcorrDeleting]     = useState<string | null>(null);
  const [ocorrError, setOcorrError]           = useState('');

  useEffect(() => {
    if (!id) return;
    imovelService.getById(id)
      .then(data => {
        setImovel(data);
        if (data.clienteId) {
          clienteService.getById(data.clienteId)
            .then(setClienteDoImovel)
            .catch(() => setClienteDoImovel(null));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLeilaoLoading(true);
    leilaoService.getByImovel(id)
      .then(data => setLeiloes(Array.isArray(data) ? data : []))
      .catch(() => setLeiloes([]))
      .finally(() => setLeilaoLoading(false));
  }, [id]);

  const openLeilaoCreate = () => {
    setLeilaoEdit(null);
    setLeilaoForm(emptyLeilao);
    setLeilaoError('');
    setShowLeilaoForm(true);
  };

  const openLeilaoEdit = (l: LeilaoAPI) => {
    setLeilaoEdit(l);
    setLeilaoForm({
      numero:      String(l.numero),
      data:        l.data.slice(0, 10),
      valorMinimo: l.valorMinimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      status:      l.status,
    });
    setLeilaoError('');
    setShowLeilaoForm(true);
  };

  const handleLeilaoValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) { setLeilaoForm(f => ({ ...f, valorMinimo: '' })); return; }
    const num = parseInt(digits, 10) / 100;
    setLeilaoForm(f => ({ ...f, valorMinimo: num.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }));
  };

  const handleLeilaoSubmit = async () => {
    setLeilaoError('');
    if (!leilaoForm.numero)      { setLeilaoError('Informe o número do leilão.'); return; }
    if (!leilaoForm.data)        { setLeilaoError('Informe a data.'); return; }
    if (!leilaoForm.valorMinimo) { setLeilaoError('Informe o valor mínimo.'); return; }
    const toNum = (v: string) => parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
    const payload: LeilaoPayload = {
      imovelId:    id!,
      numero:      parseInt(leilaoForm.numero, 10),
      data:        leilaoForm.data,
      valorMinimo: toNum(leilaoForm.valorMinimo),
      status:      leilaoForm.status,
    };
    setLeilaoSaving(true);
    try {
      if (leilaoEdit) {
        await leilaoService.update(leilaoEdit.id, payload);
      } else {
        await leilaoService.create(payload);
      }
      const fresh = await leilaoService.getByImovel(id!);
      setLeiloes(Array.isArray(fresh) ? fresh.sort((a, b) => a.numero - b.numero) : []);
      setShowLeilaoForm(false);
    } catch (err) {
      setLeilaoError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setLeilaoSaving(false);
    }
  };

  const handleLeilaoDelete = async (l: LeilaoAPI) => {
    if (!confirm(`Excluir o ${l.numero}º Leilão?`)) return;
    setLeilaoDeleting(l.id);
    try {
      await leilaoService.delete(l.id);
      setLeiloes(prev => prev.filter(x => x.id !== l.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    } finally {
      setLeilaoDeleting(null);
    }
  };

  useEffect(() => {
    if (!id) return;
    setDespLoading(true);
    despesaService.getByImovel(id)
      .then(data => setDespesas(Array.isArray(data) ? data : []))
      .catch(() => setDespesas([]))
      .finally(() => setDespLoading(false));
  }, [id]);

  const openDespCreate = () => {
    setDespEdit(null);
    setDespForm(emptyDespesa);
    setDespError('');
    setShowDespForm(true);
  };

  const openDespEdit = (d: DespesaAPI) => {
    setDespEdit(d);
    setDespForm({
      categoria: d.categoria,
      data:      d.data.slice(0, 10),
      valor:     d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      aprovado:  d.aprovado,
    });
    setDespError('');
    setShowDespForm(true);
  };

  const handleDespValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) { setDespForm(f => ({ ...f, valor: '' })); return; }
    const num = parseInt(digits, 10) / 100;
    setDespForm(f => ({ ...f, valor: num.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }));
  };

  const handleDespSubmit = async () => {
    setDespError('');
    if (!despForm.categoria.trim()) { setDespError('Informe a categoria.'); return; }
    if (!despForm.data)             { setDespError('Informe a data.'); return; }
    if (!despForm.valor)            { setDespError('Informe o valor.'); return; }
    const toNum = (v: string) => parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
    const payload: DespesaPayload = {
      imovelId:  id!,
      categoria: despForm.categoria.trim(),
      data:      despForm.data,
      valor:     toNum(despForm.valor),
      aprovado:  despForm.aprovado,
    };
    setDespSaving(true);
    try {
      if (despEdit) {
        const updated = await despesaService.update(despEdit.id, payload);
        setDespesas(prev => prev.map(d => d.id === updated.id ? updated : d));
      } else {
        const created = await despesaService.create(payload);
        setDespesas(prev => [created, ...prev]);
      }
      setShowDespForm(false);
    } catch (err) {
      setDespError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setDespSaving(false);
    }
  };

  const handleDespToggleAprovado = async (d: DespesaAPI) => {
    setDespToggling(d.id);
    try {
      const updated = await despesaService.update(d.id, {
        imovelId:  id!,
        categoria: d.categoria,
        data:      d.data,
        valor:     d.valor,
        aprovado:  !d.aprovado,
      });
      setDespesas(prev => prev.map(x => x.id === updated.id ? updated : x));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar despesa.');
    } finally {
      setDespToggling(null);
    }
  };

  const handleDespDelete = async (d: DespesaAPI) => {
    if (!confirm(`Excluir despesa "${d.categoria}"?`)) return;
    setDespDeleting(d.id);
    try {
      await despesaService.delete(d.id);
      setDespesas(prev => prev.filter(x => x.id !== d.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    } finally {
      setDespDeleting(null);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocError('');
    setDocUploading(true);
    try {
      const url = await documentoService.upload(file);
      const doc = await documentoService.create(id!, { tipo: docTipo, nomeArquivo: file.name, url });
      setDocumentos(prev => [doc, ...prev]);
      setShowDocForm(false);
    } catch (err) {
      setDocError(err instanceof Error ? err.message : 'Erro ao enviar documento.');
    } finally {
      setDocUploading(false);
      e.target.value = '';
    }
  };

  const handleDocDelete = async (doc: DocumentoAPI) => {
    if (!confirm(`Excluir o documento "${doc.nomeArquivo}"?`)) return;
    setDocDeleting(doc.id);
    try {
      await documentoService.delete(id!, doc.id);
      setDocumentos(prev => prev.filter(d => d.id !== doc.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    } finally {
      setDocDeleting(null);
    }
  };

  useEffect(() => {
    if (!id) return;
    setDocLoading(true);
    documentoService.getByImovel(id)
      .then(data => setDocumentos(Array.isArray(data) ? data : []))
      .catch(() => setDocumentos([]))
      .finally(() => setDocLoading(false));
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
    setNegForm({ ...emptyNegForm, clienteId: imovel?.clienteId ?? '' });
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

  useEffect(() => {
    if (!id) return;
    setOcorrLoading(true);
    ocorrenciaService.getByImovel(id)
      .then(data => setOcorrencias(Array.isArray(data) ? data : []))
      .catch(() => setOcorrencias([]))
      .finally(() => setOcorrLoading(false));
  }, [id]);

  const openOcorrCreate = () => {
    setOcorrEdit(null);
    setOcorrText('');
    setOcorrError('');
    setShowOcorrForm(true);
  };

  const openOcorrEdit = (o: OcorrenciaAPI) => {
    setOcorrEdit(o);
    setOcorrText(o.descricao);
    setOcorrError('');
    setShowOcorrForm(true);
  };

  const handleOcorrSubmit = async () => {
    setOcorrError('');
    if (!ocorrText.trim()) { setOcorrError('Informe a descrição.'); return; }
    setOcorrSaving(true);
    try {
      const payload = { imovelId: id!, descricao: ocorrText.trim() };
      if (ocorrEdit) {
        const updated = await ocorrenciaService.update(ocorrEdit.id, payload);
        setOcorrencias(prev => prev.map(o => o.id === updated.id ? updated : o));
      } else {
        const created = await ocorrenciaService.create(payload);
        setOcorrencias(prev => [created, ...prev]);
      }
      setShowOcorrForm(false);
    } catch (err) {
      setOcorrError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setOcorrSaving(false);
    }
  };

  const handleOcorrDelete = async (o: OcorrenciaAPI) => {
    if (!confirm('Excluir esta ocorrência?')) return;
    setOcorrDeleting(o.id);
    try {
      await ocorrenciaService.delete(o.id);
      setOcorrencias(prev => prev.filter(x => x.id !== o.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    } finally {
      setOcorrDeleting(null);
    }
  };

  const openEtapaForm = () => {
    setEtapaForm({
      etapa:  imovel?.etapa  ?? 'CADASTRO',
      status: imovel?.status ?? 'DISPONIVEL',
    });
    setEtapaError('');
    setShowEtapaForm(true);
  };

  const handleEtapaSubmit = async () => {
    setEtapaError('');
    setEtapaSaving(true);
    try {
      const updated = await imovelService.updateEtapaStatus(id!, etapaForm);
      setImovel(updated);
      setShowEtapaForm(false);
    } catch (err) {
      setEtapaError(err instanceof Error ? err.message : 'Erro ao atualizar.');
    } finally {
      setEtapaSaving(false);
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
  const fotos = imovel?.fotosImovel ?? [];
  const selectedFoto = fotos[selectedFotoIdx] ?? null;
  const e = imovel?.enderecoDTO;

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
              <div className="lg:w-72 flex-shrink-0 flex flex-col">
                {/* Foto principal */}
                <div className="relative h-56 lg:h-64 overflow-hidden bg-gray-100 flex-shrink-0">
                  {selectedFoto ? (
                    <img src={selectedFoto} alt={`Foto ${selectedFotoIdx + 1}`} className="hero-img w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--ailos-azul-50)' }}>
                      <Building2 className="w-16 h-16" style={{ color: 'var(--primary)' }} />
                    </div>
                  )}
                  {fotos.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedFotoIdx(i => (i - 1 + fotos.length) % fotos.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setSelectedFotoIdx(i => (i + 1) % fotos.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                        {selectedFotoIdx + 1}/{fotos.length}
                      </span>
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                {fotos.length > 1 && (
                  <div className="flex gap-1.5 p-2 overflow-x-auto border-t" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
                    {fotos.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFotoIdx(i)}
                        className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all"
                        style={{ borderColor: i === selectedFotoIdx ? 'var(--primary)' : 'transparent', opacity: i === selectedFotoIdx ? 1 : 0.6 }}
                      >
                        <img src={f} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
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
                  { value: 'leiloes',       label: 'Leilões' },
                  { value: 'negociacoes',   label: 'Negociações' },
                  { value: 'documentos',    label: 'Documentos' },
                  { value: 'despesas',      label: 'Despesas' },
                  { value: 'ocorrencias',   label: 'Ocorrências' },
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

                {/* ── Linha 1: Etapa Atual | Próximos Passos | Alertas ── */}
                {(() => {
                  const despesasTotal = despesas.reduce((s, d) => s + d.valor, 0);
                  const liquido       = (imovel.valorAvaliacao ?? 0) - despesasTotal;

                  return (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Etapa Atual */}
                        <div className="rounded-2xl border p-5" style={cardStyle}>
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Etapa Atual</p>
                            {!showEtapaForm && (
                              <button onClick={openEtapaForm}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                                style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                                <Pencil className="h-3 w-3" /> Alterar
                              </button>
                            )}
                          </div>

                          {showEtapaForm ? (
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--muted-foreground)' }}>Etapa</label>
                                <select
                                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                  value={etapaForm.etapa}
                                  onChange={e => setEtapaForm(f => ({ ...f, etapa: e.target.value as ImovelEtapa }))}>
                                  {([
                                    ['CADASTRO',                'Cadastro'],
                                    ['LEILAO',                  'Leilão'],
                                    ['NEGOCIACAO_AMIGAVEL',     'Neg. Amigável'],
                                    ['NEGOCIACAO_NAO_AMIGAVEL', 'Neg. Não Amigável'],
                                    ['JURIDICO',                'Jurídico'],
                                    ['COMERCIAL',               'Comercial'],
                                    ['VENDA',                   'Venda'],
                                    ['POS_VENDA',               'Pós-Venda'],
                                  ] as [ImovelEtapa, string][]).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--muted-foreground)' }}>Status</label>
                                <select
                                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                                  style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                  value={etapaForm.status}
                                  onChange={e => setEtapaForm(f => ({ ...f, status: e.target.value as ImovelStatus }))}>
                                  {(Object.keys(STATUS_CONFIG) as ImovelStatus[]).map(s => (
                                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                                  ))}
                                </select>
                              </div>
                              {etapaError && (
                                <div className="flex items-start gap-2 rounded-xl px-3 py-2 border"
                                  style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                                  <p className="text-xs" style={{ color: 'var(--ailos-vermelho-500)' }}>{etapaError}</p>
                                </div>
                              )}
                              <div className="flex gap-2 pt-1">
                                <button onClick={() => setShowEtapaForm(false)}
                                  className="flex-1 py-2 rounded-xl border text-xs font-semibold"
                                  style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'var(--card)' }}>
                                  Cancelar
                                </button>
                                <button onClick={handleEtapaSubmit} disabled={etapaSaving}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white"
                                  style={{ background: 'var(--primary)', opacity: etapaSaving ? 0.7 : 1, cursor: etapaSaving ? 'not-allowed' : 'pointer' }}>
                                  {etapaSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                  Salvar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Etapa</p>
                                <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--primary)' }}>
                                  {imovel.etapa ? etapaLabel(imovel.etapa) : '—'}
                                </p>
                              </div>
                              <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Status</p>
                                {imovel.status
                                  ? <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border"
                                      style={{ background: STATUS_CONFIG[imovel.status].bg, color: STATUS_CONFIG[imovel.status].color, borderColor: STATUS_CONFIG[imovel.status].border }}>
                                      {STATUS_CONFIG[imovel.status].label}
                                    </span>
                                  : <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--foreground)' }}>—</p>
                                }
                              </div>
                              <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Data de Avaliação</p>
                                <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--foreground)' }}>
                                  {imovel.dataAvaliacao
                                    ? new Date(imovel.dataAvaliacao).toLocaleDateString('pt-BR')
                                    : '—'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Leilões em Andamento */}
                        <div className="rounded-2xl border p-5" style={cardStyle}>
                          <div className="flex items-center gap-2 mb-4">
                            <Scale className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                            <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Leilões em Andamento</p>
                          </div>
                          {leiloes.filter(l => l.status === '1º LEILÃO' || l.status === '2º LEILÃO').length > 0 ? (
                            <div className="space-y-3">
                              {leiloes.filter(l => l.status === '1º LEILÃO' || l.status === '2º LEILÃO').map(l => {
                                const cfg = LEILAO_STATUS_CONFIG[l.status] ?? { label: l.status, color: '#165C7D', bg: 'var(--ailos-azul-50)', border: 'var(--border)' };
                                return (
                                  <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl border"
                                    style={{ background: cfg.bg, borderColor: cfg.border }}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                                      style={{ background: 'var(--card)', color: cfg.color, border: `1px solid ${cfg.border}` }}>
                                      {l.numero}º
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                        {l.numero}º Leilão — {cfg.label}
                                      </p>
                                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                                        {new Date(l.data).toLocaleDateString('pt-BR')} · Mín. R$ {l.valorMinimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                              Nenhum leilão agendado.
                            </p>
                          )}
                        </div>

                        {/* Alertas */}
                        <div className="rounded-2xl border p-5" style={cardStyle}>
                          <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5" style={{ color: '#f97316' }} />
                            <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Alertas</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nenhum alerta ativo.</p>
                          </div>
                        </div>
                      </div>

                      {/* Resumo Financeiro */}
                      <div className="rounded-2xl border p-5" style={cardStyle}>
                        <div className="flex items-center gap-2 mb-5">
                          <DollarSign className="h-5 w-5" style={{ color: '#16a34a' }} />
                          <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Resumo Financeiro</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Valor de Avaliação</p>
                            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>
                              R$ {(imovel.valorAvaliacao ?? 0).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Despesas Acumuladas</p>
                            <p className="text-2xl font-bold mt-1" style={{ color: despesasTotal > 0 ? '#ef4444' : 'var(--foreground)' }}>
                              R$ {despesasTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Valor Líquido Estimado</p>
                            <p className="text-2xl font-bold mt-1" style={{ color: liquido >= 0 ? '#16a34a' : '#ef4444' }}>
                              R$ {liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}

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

              {/* Leilões */}
              <TabsContent value="leiloes" className="tab-content-enter space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {leiloes.length} leilão{leiloes.length !== 1 ? 'ões' : ''} registrado{leiloes.length !== 1 ? 's' : ''}
                  </p>
                  <button onClick={openLeilaoCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--primary)' }}>
                    <Plus className="h-4 w-4" /> Novo Leilão
                  </button>
                </div>

                {/* Formulário */}
                {showLeilaoForm && (
                  <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={sectionHdr}>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                        {leilaoEdit ? `Editar ${leilaoEdit.numero}º Leilão` : 'Novo Leilão'}
                      </p>
                      <button onClick={() => setShowLeilaoForm(false)} style={{ color: 'var(--muted-foreground)' }}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                            Nº do Leilão <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input type="number" min={1} max={3}
                            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            placeholder="Ex: 1"
                            value={leilaoForm.numero}
                            onChange={e => setLeilaoForm(f => ({ ...f, numero: e.target.value }))}
                            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                            Data <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input type="date"
                            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            value={leilaoForm.data}
                            onChange={e => setLeilaoForm(f => ({ ...f, data: e.target.value }))}
                            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                            Valor Mínimo (R$) <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input type="text" inputMode="numeric"
                            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            placeholder="0,00"
                            value={leilaoForm.valorMinimo}
                            onChange={handleLeilaoValor}
                            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                            Status <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(LEILAO_STATUS_CONFIG) as LeilaoStatus[]).map(s => {
                              const cfg    = LEILAO_STATUS_CONFIG[s];
                              const active = leilaoForm.status === s;
                              return (
                                <button key={s} type="button"
                                  onClick={() => setLeilaoForm(f => ({ ...f, status: s }))}
                                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all"
                                  style={{
                                    background:  active ? cfg.bg    : 'var(--card)',
                                    color:       active ? cfg.color : 'var(--muted-foreground)',
                                    borderColor: active ? cfg.border : 'var(--border)',
                                  }}>
                                  {cfg.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {leilaoError && (
                        <div className="flex items-start gap-2 rounded-xl px-4 py-3 border"
                          style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                          <p className="text-sm" style={{ color: 'var(--ailos-vermelho-500)' }}>{leilaoError}</p>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-1">
                        <button onClick={() => setShowLeilaoForm(false)}
                          className="px-4 py-2 rounded-xl border text-sm font-semibold"
                          style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'var(--card)' }}>
                          Cancelar
                        </button>
                        <button onClick={handleLeilaoSubmit} disabled={leilaoSaving}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{ background: 'var(--primary)', opacity: leilaoSaving ? 0.7 : 1, cursor: leilaoSaving ? 'not-allowed' : 'pointer' }}>
                          {leilaoSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {leilaoSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista */}
                {leilaoLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                  </div>
                ) : leiloes.length === 0 ? (
                  <div className="rounded-2xl border py-12 text-center" style={cardStyle}>
                    <Scale className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ailos-cinza-400)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Nenhum leilão registrado</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Clique em "Novo Leilão" para começar.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leiloes.map(l => {
                      const cfg = LEILAO_STATUS_CONFIG[l.status] ?? { label: l.status, color: '#165C7D', bg: 'var(--ailos-azul-50)', border: 'var(--border)' };
                      return (
                        <div key={l.id} className="rounded-2xl border p-4 flex items-center justify-between gap-4" style={cardStyle}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                              {l.numero}º
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                  {l.numero}º Leilão
                                </p>
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold border"
                                  style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                                  {cfg.label}
                                </span>
                              </div>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                                {new Date(l.data).toLocaleDateString('pt-BR')}
                                {' · Valor mínimo: '}
                                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                  R$ {l.valorMinimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => openLeilaoEdit(l)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                              style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                              <Pencil className="h-3.5 w-3.5" /> Editar
                            </button>
                            <button onClick={() => handleLeilaoDelete(l)} disabled={leilaoDeleting === l.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                              style={{ color: 'var(--ailos-vermelho-500)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s', opacity: leilaoDeleting === l.id ? 0.6 : 1 }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-vermelho-50)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                              {leilaoDeleting === l.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              Excluir
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
                      {/* Cliente */}
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                          Cliente <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        {clienteDoImovel ? (
                          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
                            style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: 'var(--primary)' }}>
                              {clienteDoImovel.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                {clienteDoImovel.nome}
                              </p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                Ag. {String(clienteDoImovel.agencia).padStart(4, '0')} · Cc. {clienteDoImovel.conta}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
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
                              Nenhum cliente vinculado ao imóvel. Informe o ID manualmente.
                            </p>
                          </>
                        )}
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
                              Cliente: <span className="font-semibold">
                                {clienteDoImovel ? clienteDoImovel.nome : neg.clienteId}
                              </span>
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

              {/* Documentos */}
              <TabsContent value="documentos" className="tab-content-enter space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {documentos.length} documento{documentos.length !== 1 ? 's' : ''} anexado{documentos.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={() => { setShowDocForm(v => !v); setDocError(''); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--primary)' }}
                  >
                    <Plus className="h-4 w-4" /> Adicionar Documento
                  </button>
                </div>

                {showDocForm && (
                  <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={sectionHdr}>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Novo Documento</p>
                      <button onClick={() => setShowDocForm(false)} style={{ color: 'var(--muted-foreground)' }}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                          Tipo do Documento <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          value={docTipo}
                          onChange={e => setDocTipo(e.target.value as TipoDocumento)}
                        >
                          {(Object.keys(TIPO_DOCUMENTO_LABELS) as TipoDocumento[]).map(t => (
                            <option key={t} value={t}>{TIPO_DOCUMENTO_LABELS[t]}</option>
                          ))}
                        </select>
                      </div>

                      {docError && (
                        <div className="flex items-start gap-2 rounded-xl px-4 py-3 border"
                          style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                          <p className="text-sm" style={{ color: 'var(--ailos-vermelho-500)' }}>{docError}</p>
                        </div>
                      )}

                      <label
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed text-sm font-medium cursor-pointer transition-all"
                        style={{
                          borderColor: docUploading ? 'var(--primary)' : 'var(--border)',
                          color: 'var(--primary)',
                          background: docUploading ? 'var(--ailos-azul-50)' : 'transparent',
                          cursor: docUploading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {docUploading
                          ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                          : <><FileText className="h-4 w-4" /> Selecionar arquivo</>}
                        <input
                          type="file"
                          className="hidden"
                          disabled={docUploading}
                          onChange={handleDocUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {docLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                  </div>
                ) : documentos.length === 0 ? (
                  <div className="rounded-2xl border py-14 text-center" style={cardStyle}>
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--ailos-azul-50)' }}>
                      <FileText className="w-7 h-7" style={{ color: 'var(--primary)' }} />
                    </div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Nenhum documento anexado</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--ailos-cinza-500)' }}>Clique em "Adicionar Documento" para enviar.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documentos.map(doc => (
                      <div key={doc.id} className="rounded-2xl border p-4 flex items-center justify-between gap-4" style={cardStyle}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ailos-azul-50)' }}>
                            <FileText className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{doc.nomeArquivo}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                              {TIPO_DOCUMENTO_LABELS[doc.tipo] ?? doc.tipo}
                              {doc.uploadedAt && ` · ${new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a href={doc.url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                            style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                            Abrir
                          </a>
                          <button onClick={() => handleDocDelete(doc)} disabled={docDeleting === doc.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                            style={{ color: 'var(--ailos-vermelho-500)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s', opacity: docDeleting === doc.id ? 0.6 : 1 }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-vermelho-50)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                            {docDeleting === doc.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Despesas */}
              <TabsContent value="despesas" className="tab-content-enter space-y-4">
                {/* Cabeçalho + total */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {despesas.length} despesa{despesas.length !== 1 ? 's' : ''}
                    </p>
                    {despesas.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Total: R$ {despesas.reduce((s, d) => s + d.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        {' · '}
                        Aprovado: R$ {despesas.filter(d => d.aprovado).reduce((s, d) => s + d.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={openDespCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--primary)' }}
                  >
                    <Plus className="h-4 w-4" /> Nova Despesa
                  </button>
                </div>

                {/* Formulário inline */}
                {showDespForm && (
                  <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={sectionHdr}>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                        {despEdit ? 'Editar Despesa' : 'Nova Despesa'}
                      </p>
                      <button onClick={() => setShowDespForm(false)} style={{ color: 'var(--muted-foreground)' }}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                            Categoria <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            placeholder="Ex: Manutenção, IPTU..."
                            value={despForm.categoria}
                            onChange={e => setDespForm(f => ({ ...f, categoria: e.target.value }))}
                            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                            Data <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            value={despForm.data}
                            onChange={e => setDespForm(f => ({ ...f, data: e.target.value }))}
                            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                            Valor (R$) <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text" inputMode="numeric"
                            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            placeholder="0,00"
                            value={despForm.valor}
                            onChange={handleDespValor}
                            onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                          />
                        </div>
                      </div>

                      {/* Toggle aprovado */}
                      <label className="flex items-center gap-3 cursor-pointer w-fit">
                        <div
                          className="relative w-10 h-6 rounded-full transition-colors duration-200"
                          style={{ background: despForm.aprovado ? '#16a34a' : 'var(--border)' }}
                          onClick={() => setDespForm(f => ({ ...f, aprovado: !f.aprovado }))}
                        >
                          <div
                            className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                            style={{ left: despForm.aprovado ? '22px' : '4px' }}
                          />
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          {despForm.aprovado ? 'Aprovada' : 'Pendente de aprovação'}
                        </span>
                      </label>

                      {despError && (
                        <div className="flex items-start gap-2 rounded-xl px-4 py-3 border"
                          style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                          <p className="text-sm" style={{ color: 'var(--ailos-vermelho-500)' }}>{despError}</p>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-1">
                        <button onClick={() => setShowDespForm(false)}
                          className="px-4 py-2 rounded-xl border text-sm font-semibold"
                          style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'var(--card)' }}>
                          Cancelar
                        </button>
                        <button onClick={handleDespSubmit} disabled={despSaving}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{ background: '#16a34a', opacity: despSaving ? 0.7 : 1, cursor: despSaving ? 'not-allowed' : 'pointer' }}>
                          {despSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {despSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista */}
                {despLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                  </div>
                ) : despesas.length === 0 ? (
                  <div className="rounded-2xl border py-12 text-center" style={cardStyle}>
                    <DollarSign className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ailos-cinza-400)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Nenhuma despesa registrada</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Clique em "Nova Despesa" para começar.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {despesas.map(d => (
                      <div key={d.id} className="rounded-2xl border p-4 flex items-center justify-between gap-4" style={cardStyle}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: d.aprovado ? '#E6F7ED' : 'var(--ailos-amarelo-50)' }}>
                            <DollarSign className="w-4 h-4" style={{ color: d.aprovado ? '#006829' : '#CC8300' }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{d.categoria}</p>
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold border"
                                style={d.aprovado
                                  ? { background: '#E6F7ED', color: '#006829', borderColor: '#CCEFDB' }
                                  : { background: 'var(--ailos-amarelo-50)', color: '#CC8300', borderColor: 'var(--ailos-amarelo-100)' }}>
                                {d.aprovado ? 'Aprovada' : 'Pendente'}
                              </span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                              {new Date(d.data).toLocaleDateString('pt-BR')}
                              {' · '}
                              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                R$ {d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Toggle aprovado */}
                          <button
                            onClick={() => handleDespToggleAprovado(d)}
                            disabled={despToggling === d.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                            style={{
                              color:       d.aprovado ? '#16a34a' : '#CC8300',
                              borderColor: d.aprovado ? '#CCEFDB' : 'var(--ailos-amarelo-100)',
                              background:  d.aprovado ? '#E6F7ED'  : 'var(--ailos-amarelo-50)',
                              opacity:     despToggling === d.id ? 0.6 : 1,
                              cursor:      despToggling === d.id ? 'not-allowed' : 'pointer',
                              transition:  'all 0.15s',
                            }}
                          >
                            {despToggling === d.id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <span>{d.aprovado ? '✓ Aprovada' : '⏳ Pendente'}</span>}
                          </button>

                          <button onClick={() => openDespEdit(d)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                            style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </button>
                          <button onClick={() => handleDespDelete(d)} disabled={despDeleting === d.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                            style={{ color: 'var(--ailos-vermelho-500)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s', opacity: despDeleting === d.id ? 0.6 : 1 }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-vermelho-50)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                            {despDeleting === d.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Ocorrências */}
              <TabsContent value="ocorrencias" className="tab-content-enter space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    {ocorrencias.length} ocorrência{ocorrencias.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={openOcorrCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--primary)' }}
                  >
                    <Plus className="h-4 w-4" /> Nova Ocorrência
                  </button>
                </div>

                {showOcorrForm && (
                  <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={sectionHdr}>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                        {ocorrEdit ? 'Editar Ocorrência' : 'Nova Ocorrência'}
                      </p>
                      <button onClick={() => setShowOcorrForm(false)} style={{ color: 'var(--muted-foreground)' }}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                          Descrição <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none"
                          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          placeholder="Descreva a ocorrência..."
                          value={ocorrText}
                          onChange={e => setOcorrText(e.target.value)}
                          onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                          onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
                        />
                      </div>

                      {ocorrError && (
                        <div className="flex items-start gap-2 rounded-xl px-4 py-3 border"
                          style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                          <p className="text-sm" style={{ color: 'var(--ailos-vermelho-500)' }}>{ocorrError}</p>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-1">
                        <button onClick={() => setShowOcorrForm(false)}
                          className="px-4 py-2 rounded-xl border text-sm font-semibold"
                          style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'var(--card)' }}>
                          Cancelar
                        </button>
                        <button onClick={handleOcorrSubmit} disabled={ocorrSaving}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{ background: 'var(--primary)', opacity: ocorrSaving ? 0.7 : 1, cursor: ocorrSaving ? 'not-allowed' : 'pointer' }}>
                          {ocorrSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {ocorrSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {ocorrLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                  </div>
                ) : ocorrencias.length === 0 ? (
                  <div className="rounded-2xl border py-12 text-center" style={cardStyle}>
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ailos-cinza-400)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Nenhuma ocorrência registrada</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Clique em "Nova Ocorrência" para registrar.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ocorrencias.map(o => (
                      <div key={o.id} className="rounded-2xl border p-4" style={cardStyle}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: 'var(--ailos-amarelo-50)' }}>
                              <AlertCircle className="w-4 h-4" style={{ color: '#CC8300' }} />
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{o.descricao}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => openOcorrEdit(o)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                              style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                              <Pencil className="h-3.5 w-3.5" /> Editar
                            </button>
                            <button onClick={() => handleOcorrDelete(o)} disabled={ocorrDeleting === o.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                              style={{ color: 'var(--ailos-vermelho-500)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s', opacity: ocorrDeleting === o.id ? 0.6 : 1 }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-vermelho-50)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}>
                              {ocorrDeleting === o.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
