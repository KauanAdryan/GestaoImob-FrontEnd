import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  ArrowLeft, Save, Upload, X, Home, MapPin, FileText,
  AlertCircle, ChevronRight, Check, Loader2, Users,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { api } from '../../../services/api';
import { clienteService, type ClienteAPI } from '../../../services/clienteService';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIconUrl, iconRetinaUrl: markerIcon2xUrl, shadowUrl: markerShadowUrl });

function LocationPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMapEvents({});
  useEffect(() => { map.setView(center, zoom, { animate: true }); }, [map, center, zoom]);
  return null;
}

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .a-fade-up { animation: fadeInUp 0.4s ease both; }
  .a-slide   { animation: slideIn 0.35s ease both; }

  .field-input {
    border: 1px solid var(--border) !important;
    border-radius: 12px !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    background: var(--card) !important;
    color: var(--foreground) !important;
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
  }
  .field-input:focus {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 3px var(--ailos-azul-100) !important;
  }
  .field-input::placeholder { color: var(--ailos-cinza-400); }

  .step-circle.active { box-shadow: 0 0 0 4px var(--ailos-azul-100); transform: scale(1.08); }

  .btn-next { transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -4px rgba(22,92,125,0.35); }

  .doc-row { transition: background 0.15s ease, transform 0.15s ease; }
  .doc-row:hover { transform: translateX(3px); }

  .photo-thumb { transition: transform 0.2s ease; }
  .photo-thumb:hover { transform: scale(1.04); }

  .upload-area {
    border: 2px dashed var(--border);
    border-radius: 12px;
    transition: border-color 0.2s ease, background 0.2s ease;
    color: var(--primary);
  }
  .upload-area:hover { border-color: var(--primary); background: var(--ailos-azul-50); }
`;

const labelCls = "text-sm font-semibold mb-1.5 block";
const req = <span style={{ color: '#ef4444' }}>*</span>;

type FormData = {
  tipoImovel: string;
  area: string;
  quartos: string;
  banheiros: string;
  vagasGaragem: string;
  valorAvaliacao: string;
  dataAvaliacao: string;
  numeroMatricula: string;
  cartorioRegistro: string;
  descricao: string;
  fotosImovel: string[];
  cep: string;
  ruaNome: string;
  numero: string;
  complemento: string;
  bairroDescricao: string;
  cidadeNome: string;
  estadoSigla: string;
  latitude: number | null;
  longitude: number | null;
};

const initialForm: FormData = {
  tipoImovel: '', area: '', quartos: '', banheiros: '', vagasGaragem: '',
  valorAvaliacao: '', dataAvaliacao: '', numeroMatricula: '', cartorioRegistro: '',
  descricao: '', fotosImovel: [],
  cep: '', ruaNome: '', numero: '', complemento: '',
  bairroDescricao: '', cidadeNome: '', estadoSigla: '',
  latitude: null, longitude: null,
};

export default function CadastroImovelPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [clientes, setClientes] = useState<ClienteAPI[]>([]);
  const [clienteId, setClienteId] = useState<string>('');

  useEffect(() => {
    clienteService.getAll().then(setClientes).catch(console.error);
  }, []);

  const [fotoFiles, setFotoFiles] = useState<File[]>([]);

  const [mapCenter, setMapCenter] = useState<[number, number]>([-15.13, -53.19]);
  const [mapZoom, setMapZoom]     = useState(4);

  useEffect(() => {
    const cidade = form.cidadeNome.trim();
    const estado = form.estadoSigla.trim();
    if (!cidade || !estado) return;
    const timer = setTimeout(async () => {
      try {
        const rua = form.ruaNome.trim();
        const q = encodeURIComponent(rua ? `${rua}, ${cidade}, ${estado}, Brasil` : `${cidade}, ${estado}, Brasil`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`, {
          headers: { 'Accept-Language': 'pt-BR' },
        });
        const data = await res.json() as { lat: string; lon: string }[];
        if (data.length > 0) {
          setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setMapZoom(rua ? 15 : 13);
        }
      } catch { /* ignore */ }
    }, 800);
    return () => clearTimeout(timer);
  }, [form.cidadeNome, form.estadoSigla, form.ruaNome]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;
    for (const file of files) {
      const previewUrl = URL.createObjectURL(file);
      setForm(f => ({ ...f, fotosImovel: [...f.fotosImovel, previewUrl] }));
      setFotoFiles(prev => [...prev, file]);
    }
  };
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const buscarCep = async (cep: string) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    setCepLoading(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) { setCepError('CEP não encontrado. Preencha o endereço manualmente.'); return; }
      setForm(f => ({
        ...f,
        ruaNome:         data.logradouro ?? f.ruaNome,
        bairroDescricao: data.bairro     ?? f.bairroDescricao,
        cidadeNome:      data.localidade ?? f.cidadeNome,
        estadoSigla:     data.uf         ?? f.estadoSigla,
      }));
    } catch {
      setCepError('Não foi possível buscar o CEP. Preencha o endereço manualmente.');
    } finally {
      setCepLoading(false);
    }
  };

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    const masked = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setForm(f => ({ ...f, cep: masked }));
    buscarCep(masked);
  };

  const handleValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) { setForm(f => ({ ...f, valorAvaliacao: '' })); return; }
    const num = parseInt(digits, 10) / 100;
    const masked = num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    setForm(f => ({ ...f, valorAvaliacao: masked }));
  };

  const removerFoto = (i: number) => {
    URL.revokeObjectURL(form.fotosImovel[i]);
    setForm(f => ({ ...f, fotosImovel: f.fotosImovel.filter((_, idx) => idx !== i) }));
    setFotoFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    setError('');

    // Validação dos campos obrigatórios
    const missing: string[] = [];
    if (!form.tipoImovel)       missing.push('Tipo de Imóvel');
    if (!form.area)             missing.push('Área');
    if (!form.valorAvaliacao)   missing.push('Valor de Avaliação');
    if (!form.dataAvaliacao)    missing.push('Data da Avaliação');
    if (!form.numeroMatricula)  missing.push('Número da Matrícula');
    if (!form.cartorioRegistro) missing.push('Cartório de Registro');
    if (!form.cep)              missing.push('CEP');
    if (!form.ruaNome)          missing.push('Logradouro');
    if (!form.numero)           missing.push('Número');
    if (!form.bairroDescricao)  missing.push('Bairro');
    if (!form.cidadeNome)       missing.push('Cidade');
    if (!form.estadoSigla)      missing.push('Estado');
    if (missing.length > 0) {
      setError(`Preencha os campos obrigatórios: ${missing.join(', ')}.`);
      return;
    }

    setLoading(true);
    try {
      const toInt = (v: string) => parseInt(v.replace(/\D/g, ''), 10) || 0;
      const toNum = (v: string) => parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;

      // Upload das fotos pendentes antes de salvar
      const BASE_URL = (import.meta as { env: { VITE_API_BASE_URL?: string } }).env.VITE_API_BASE_URL ?? 'http://localhost:8080';
      const token = localStorage.getItem('auth_token');
      const fotoUrls: string[] = [];
      for (const file of fotoFiles) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(errBody.error ?? `Erro ao enviar foto: ${res.status}`);
        }
        const data = await res.json() as { url?: string; path?: string; fileName?: string };
        fotoUrls.push(data.url ?? data.path ?? data.fileName ?? '');
      }

      const payload = {
        tipoImovel:       form.tipoImovel,
        area:             toNum(form.area),
        quartos:          toInt(form.quartos),
        banheiros:        toInt(form.banheiros),
        vagasGaragem:     toInt(form.vagasGaragem),
        valorAvaliacao:   toNum(form.valorAvaliacao),
        dataAvaliacao:    form.dataAvaliacao,
        numeroMatricula:  toInt(form.numeroMatricula),
        cartorioRegistro: form.cartorioRegistro,
        descricao:        form.descricao || null,
        fotosImovel:      fotoUrls,
        latitude:         form.latitude,
        longitude:        form.longitude,
        etapa:            'CADASTRO',
        status:           'DISPONIVEL',
        clienteId:        clienteId || null,
        responsavelId:    null,
        endereco: {
          cep:             form.cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2'),
          ruaNome:         form.ruaNome,
          numero:          form.numero,
          complemento:     form.complemento || null,
          bairroDescricao: form.bairroDescricao,
          cidadeNome:      form.cidadeNome,
          estadoSigla:     form.estadoSigla,
        },
      };
      await api.post('/imoveis', payload);
      navigate('/gestao-bens');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar imóvel.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Dados Básicos', icon: Home },
    { num: 2, label: 'Localização',   icon: MapPin },
    { num: 3, label: 'Documentos',    icon: FileText },
  ];

  const cardStyle = { background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' };
  const sectionHeaderStyle = { borderColor: 'var(--border)', background: 'var(--muted)' };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen p-6" style={{ background: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="a-fade-up">
            <Link to="/gestao-bens">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium mb-4"
                style={{ color: 'var(--muted-foreground)', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; }}
              >
                <ArrowLeft className="h-4 w-4" /> Voltar para Lista
              </button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Cadastro de Imóvel</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Preencha as informações para iniciar o fluxo</p>
              </div>
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'var(--ailos-azul-50)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                Etapa {etapa} de 3
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="rounded-2xl p-6 border a-fade-up" style={{ ...cardStyle, animationDelay: '60ms' }}>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5" style={{ background: 'var(--border)' }}>
                <div className="h-full transition-all duration-500 ease-out" style={{ width: `${((etapa - 1) / 2) * 100}%`, background: 'var(--primary)' }} />
              </div>
              <div className="relative flex justify-between">
                {steps.map(step => {
                  const done = step.num < etapa;
                  const current = step.num === etapa;
                  return (
                    <div key={step.num} className="flex flex-col items-center" style={{ width: '33.33%' }}>
                      <div
                        className={`step-circle ${current ? 'active' : ''} w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300`}
                        style={{
                          background:  done ? 'var(--primary)' : 'var(--card)',
                          borderColor: done || current ? 'var(--primary)' : 'var(--border)',
                          color:       done ? 'white' : current ? 'var(--primary)' : 'var(--ailos-cinza-400)',
                        }}
                      >
                        {done ? <Check className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                      </div>
                      <p className="text-xs mt-2 font-medium" style={{ color: current ? 'var(--primary)' : done ? 'var(--muted-foreground)' : 'var(--ailos-cinza-400)' }}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Etapa 1: Dados Básicos ─── */}
          {etapa === 1 && (
            <div className="space-y-5 a-slide" style={{ animationDelay: '80ms' }}>
              <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={sectionHeaderStyle}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--ailos-azul-50)' }}>
                    <Home className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>Informações Básicas</h2>
                </div>
                <div className="p-6 space-y-5">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Tipo de Imóvel {req}</label>
                      <Select value={form.tipoImovel} onValueChange={v => setForm(f => ({ ...f, tipoImovel: v }))}>
                        <SelectTrigger className="field-input" style={{ height: '42px' }}>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            ['Apartamento',      'Apartamento'],
                            ['Casa',             'Casa'],
                            ['Comercial/sala',   'Comercial / Sala'],
                            ['Terreno',          'Terreno'],
                            ['Galpão/Armazém',   'Galpão / Armazém'],
                            ['Propriedade Rural','Propriedade Rural'],
                          ].map(([v,l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Área (m²) {req}</label>
                      <input type="number" className="field-input" placeholder="0" value={form.area} onChange={set('area')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Quartos</label>
                      <input type="number" className="field-input" placeholder="0" value={form.quartos} onChange={set('quartos')} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Banheiros</label>
                      <input type="number" className="field-input" placeholder="0" value={form.banheiros} onChange={set('banheiros')} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Vagas de Garagem</label>
                      <input type="number" className="field-input" placeholder="0" value={form.vagasGaragem} onChange={set('vagasGaragem')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Valor de Avaliação (R$) {req}</label>
                      <input type="text" inputMode="numeric" className="field-input" placeholder="0,00" value={form.valorAvaliacao} onChange={handleValor} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Data da Avaliação {req}</label>
                      <input type="date" className="field-input" value={form.dataAvaliacao} onChange={set('dataAvaliacao')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Número da Matrícula {req}</label>
                      <input type="number" className="field-input" placeholder="Ex: 12345" value={form.numeroMatricula} onChange={set('numeroMatricula')} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Cartório de Registro {req}</label>
                      <input className="field-input" placeholder="Ex: 1º RI de São Paulo" value={form.cartorioRegistro} onChange={set('cartorioRegistro')} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} style={{ color: 'var(--foreground)' }}>Descrição do Imóvel</label>
                    <textarea rows={4} className="field-input" placeholder="Descreva as características principais do imóvel..." style={{ resize: 'vertical' }} value={form.descricao} onChange={set('descricao')} />
                  </div>

                  <div>
                    <label className={labelCls} style={{ color: 'var(--foreground)' }}>Fotos do Imóvel</label>
                    <div className="space-y-3 mt-1">

                      {/* Input oculto para arquivo */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                      />

                      {/* Botão de arquivo */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="upload-area w-full flex items-center justify-center gap-2 py-4 text-sm font-medium"
                      >
                        <Upload className="h-4 w-4" /> Selecionar arquivo do computador
                      </button>

                      {/* Preview das fotos */}
                      {form.fotosImovel.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {form.fotosImovel.map((foto, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={foto}
                                alt={`Foto ${i + 1}`}
                                className="photo-thumb w-full h-32 object-cover rounded-xl border"
                                style={{ borderColor: 'var(--border)' }}
                                onError={e => { (e.currentTarget as HTMLImageElement).src = ''; (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                              <button
                                type="button"
                                onClick={() => removerFoto(i)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {i === 0 && (
                                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: 'var(--primary)' }}>
                                  Principal
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs" style={{ color: 'var(--ailos-cinza-500)' }}>
                        A primeira foto será usada como principal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="btn-next flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: 'var(--primary)' }} onClick={() => setEtapa(2)}>
                  Próxima Etapa: Localização <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Etapa 2: Localização ─── */}
          {etapa === 2 && (
            <div className="space-y-5 a-slide" style={{ animationDelay: '80ms' }}>
              <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={sectionHeaderStyle}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--ailos-azul-50)' }}>
                    <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>Localização e Endereço</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>CEP {req}</label>
                      <div className="relative">
                        <input
                          className="field-input"
                          placeholder="00000-000"
                          value={form.cep}
                          onChange={handleCep}
                          onBlur={() => buscarCep(form.cep)}
                        />
                        {cepLoading && (
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--primary)' }} />
                          </div>
                        )}
                      </div>
                      {cepError && (
                        <p className="text-xs mt-1" style={{ color: 'var(--ailos-vermelho-500)' }}>{cepError}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Logradouro {req}</label>
                      <input className="field-input" placeholder="Rua, Avenida, etc." value={form.ruaNome} onChange={set('ruaNome')} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Número {req}</label>
                      <input className="field-input" placeholder="Ex: 100" value={form.numero} onChange={set('numero')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Complemento</label>
                      <input className="field-input" placeholder="Ex: Apto 501, Bloco B" value={form.complemento} onChange={set('complemento')} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Bairro {req}</label>
                      <input className="field-input" placeholder="Ex: Centro" value={form.bairroDescricao} onChange={set('bairroDescricao')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Cidade {req}</label>
                      <input className="field-input" placeholder="Ex: Blumenau" value={form.cidadeNome} onChange={set('cidadeNome')} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'var(--foreground)' }}>Estado {req}</label>
                      <Select value={form.estadoSigla} onValueChange={v => setForm(f => ({ ...f, estadoSigla: v }))}>
                        <SelectTrigger className="field-input" style={{ height: '42px' }}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {[['AC','Acre'],['AL','Alagoas'],['AP','Amapá'],['AM','Amazonas'],['BA','Bahia'],['CE','Ceará'],['DF','Distrito Federal'],['ES','Espírito Santo'],['GO','Goiás'],['MA','Maranhão'],['MT','Mato Grosso'],['MS','Mato Grosso do Sul'],['MG','Minas Gerais'],['PA','Pará'],['PB','Paraíba'],['PR','Paraná'],['PE','Pernambuco'],['PI','Piauí'],['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],['RS','Rio Grande do Sul'],['RO','Rondônia'],['RR','Roraima'],['SC','Santa Catarina'],['SP','São Paulo'],['SE','Sergipe'],['TO','Tocantins']].map(([v,l]) => (
                            <SelectItem key={v} value={v}>{v} — {l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{ background: 'var(--ailos-azul-50)', border: '1px solid var(--border)' }}>
                    <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--foreground)' }}>ℹ️ Informações de Localização</h4>
                    {['Verifique se o endereço está completo e correto','O CEP será usado para consultas de IPTU e certidões','Certifique-se que o número está de acordo com a matrícula'].map(tip => (
                      <p key={tip} className="text-sm flex items-start gap-2 mt-1" style={{ color: 'var(--primary)' }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--primary)', display: 'inline-block' }} />
                        {tip}
                      </p>
                    ))}
                  </div>

                  {/* Mapa de localização */}
                  <div>
                    <label className={labelCls} style={{ color: 'var(--foreground)' }}>
                      Ponto no mapa
                      <span className="ml-2 text-xs font-normal" style={{ color: 'var(--ailos-cinza-500)' }}>
                        (clique no mapa para marcar a localização exata do imóvel)
                      </span>
                    </label>
                    {form.latitude && form.longitude && (
                      <p className="text-xs mb-2 font-medium" style={{ color: 'var(--primary)' }}>
                        Marcado: {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
                        <button
                          type="button"
                          className="ml-2 underline"
                          style={{ color: '#ef4444' }}
                          onClick={() => setForm(f => ({ ...f, latitude: null, longitude: null }))}
                        >
                          remover
                        </button>
                      </p>
                    )}
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                      <MapContainer center={[-15.13, -53.19]} zoom={4} style={{ height: '320px', width: '100%' }} scrollWheelZoom>
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <MapRecenter center={mapCenter} zoom={mapZoom} />
                        <LocationPicker onPick={(lat, lng) => setForm(f => ({ ...f, latitude: lat, longitude: lng }))} />
                        {form.latitude && form.longitude && (
                          <Marker position={[form.latitude, form.longitude]} />
                        )}
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border text-sm" style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'var(--card)' }} onClick={() => setEtapa(1)}>
                  <ArrowLeft className="h-4 w-4" /> Etapa Anterior
                </button>
                <button className="btn-next flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: 'var(--primary)' }} onClick={() => setEtapa(3)}>
                  Próxima Etapa: Documentos <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Etapa 3: Documentos ─── */}
          {etapa === 3 && (
            <div className="space-y-5 a-slide" style={{ animationDelay: '80ms' }}>
              <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={sectionHeaderStyle}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--ailos-azul-50)' }}>
                    <FileText className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>Documentos Iniciais</h2>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Documentos Obrigatórios</p>
                  {[
                    { id: 1, nome: 'Matrícula Atualizada do Imóvel',        obrigatorio: true },
                    { id: 2, nome: 'Laudo de Avaliação',                    obrigatorio: true },
                    { id: 3, nome: 'Termo de Consolidação de Propriedade',  obrigatorio: true },
                    { id: 4, nome: 'Certidão de Débitos Municipais (IPTU)', obrigatorio: false },
                    { id: 5, nome: 'Certidão de Débitos Estaduais',         obrigatorio: false },
                    { id: 6, nome: 'Certidão de Ônus Reais',                obrigatorio: false },
                  ].map(doc => (
                    <div key={doc.id} className="doc-row flex items-center justify-between p-4 rounded-xl border"
                      style={{
                        background:  doc.obrigatorio ? 'var(--ailos-amarelo-50)' : 'var(--card)',
                        borderColor: doc.obrigatorio ? 'var(--ailos-amarelo-100)' : 'var(--border)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: doc.obrigatorio ? 'var(--ailos-amarelo-100)' : 'var(--ailos-azul-50)' }}>
                          <FileText className="w-4 h-4" style={{ color: doc.obrigatorio ? '#d97706' : 'var(--primary)' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{doc.nome}</p>
                          {doc.obrigatorio && <span className="text-xs font-semibold" style={{ color: '#d97706' }}>Obrigatório</span>}
                        </div>
                      </div>
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                        style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cliente responsável */}
              <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={sectionHeaderStyle}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--ailos-azul-50)' }}>
                    <Users className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>Cliente Responsável</h2>
                </div>
                <div className="p-6">
                  <label className="text-sm font-semibold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                    Selecione o cliente
                  </label>
                  <Select value={clienteId} onValueChange={setClienteId}>
                    <SelectTrigger className="field-input" style={{ height: '42px' }}>
                      <SelectValue placeholder={clientes.length === 0 ? 'Nenhum cliente cadastrado' : 'Selecione um cliente'} />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome} — Ag. {String(c.agencia).padStart(4, '0')} / Cc. {c.conta}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {clientes.length === 0 && (
                    <p className="text-xs mt-2" style={{ color: 'var(--ailos-cinza-500)' }}>
                      Cadastre clientes na tela de Clientes antes de associar.
                    </p>
                  )}
                </div>
              </div>

              {/* Resumo do cadastro */}
              <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
                <div className="px-6 py-4 border-b" style={sectionHeaderStyle}>
                  <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>Resumo do Cadastro</h2>
                </div>
                <div className="p-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ['Tipo',         form.tipoImovel || '—'],
                      ['Área',         form.area ? `${form.area} m²` : '—'],
                      ['Avaliação',    form.valorAvaliacao ? `R$ ${form.valorAvaliacao}` : '—'],
                      ['Matrícula',    form.numeroMatricula || '—'],
                      ['Cartório',     form.cartorioRegistro || '—'],
                      ['Endereço',     form.cidadeNome ? `${form.cidadeNome} - ${form.estadoSigla}` : '—'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p style={{ color: 'var(--ailos-cinza-500)' }}>{k}</p>
                        <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl mt-2" style={{ background: 'var(--ailos-azul-50)', border: '1px solid var(--border)' }}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Ao cadastrar, o imóvel entrará automaticamente na etapa de <strong>Leilão</strong>. Você poderá registrar os leilões na sequência.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 border" style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                      <p className="text-sm" style={{ color: 'var(--ailos-vermelho-500)' }}>{error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border text-sm"
                  style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'var(--card)' }}
                  onClick={() => setEtapa(2)}
                >
                  <ArrowLeft className="h-4 w-4" /> Etapa Anterior
                </button>
                <button
                  className="btn-next flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
                  style={{ background: '#16a34a', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {loading ? 'Cadastrando...' : 'Cadastrar Imóvel'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
