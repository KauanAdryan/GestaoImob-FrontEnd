import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  ArrowLeft, Save, Upload, X, Home, MapPin, FileText,
  AlertCircle, ChevronRight, Check,
} from 'lucide-react';

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
    border: 1px solid #d1e9f4 !important;
    border-radius: 12px !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    background: white !important;
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
    color: #0f3d52;
    outline: none;
  }
  .field-input:focus {
    border-color: #165c7d !important;
    box-shadow: 0 0 0 3px rgba(22,92,125,0.12) !important;
  }
  .field-input::placeholder { color: #a0bfcc; }

  .step-circle.active { box-shadow: 0 0 0 4px rgba(22,92,125,0.15); transform: scale(1.08); }

  .btn-next { transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -4px rgba(22,92,125,0.35); }

  .doc-row { transition: background 0.15s ease, transform 0.15s ease; }
  .doc-row:hover { transform: translateX(3px); }

  .photo-thumb { transition: transform 0.2s ease; }
  .photo-thumb:hover { transform: scale(1.04); }

  .upload-area {
    border: 2px dashed #c5dde8;
    border-radius: 12px;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .upload-area:hover { border-color: #165c7d; background: #f0f7fb; }
`;

const labelCls = "text-sm font-semibold mb-1.5 block";

export default function CadastroImovelPage() {
  const navigate = useNavigate();
  const [fotos, setFotos] = useState<string[]>([]);
  const [etapa, setEtapa] = useState(1);

  const adicionarFoto = () => {
    const novaFoto = `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1560448204-603' : '1512917774080'}?w=400`;
    setFotos([...fotos, novaFoto]);
  };
  const removerFoto = (index: number) => setFotos(fotos.filter((_, i) => i !== index));

  const steps = [
    { num: 1, label: 'Dados Básicos', icon: Home },
    { num: 2, label: 'Localização', icon: MapPin },
    { num: 3, label: 'Documentos', icon: FileText },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #f8fbfd 0%, #f0f7fb 100%)' }}>
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="a-fade-up">
            <Link to="/gestao-bens">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium mb-4"
                style={{ color: '#4a7a8e', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#eef7fb'; (e.currentTarget as HTMLElement).style.color = '#165c7d'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#4a7a8e'; }}
              >
                <ArrowLeft className="h-4 w-4" /> Voltar para Lista
              </button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#0f3d52' }}>Cadastro de Imóvel</h1>
                <p className="text-sm mt-1" style={{ color: '#6b8fa0' }}>Preencha as informações para iniciar o fluxo</p>
              </div>
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: '#eef7fb', color: '#165c7d', border: '1px solid #cde8f4' }}>
                Etapa {etapa} de 3
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="rounded-2xl p-6 border a-fade-up" style={{ background: 'white', borderColor: '#e8f2f7', boxShadow: '0 2px 12px -4px rgba(22,92,125,0.08)', animationDelay: '60ms' }}>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5" style={{ background: '#e8f2f7' }}>
                <div className="h-full transition-all duration-500 ease-out" style={{ width: `${((etapa - 1) / 2) * 100}%`, background: '#165c7d' }} />
              </div>
              <div className="relative flex justify-between">
                {steps.map(step => {
                  const done = step.num < etapa;
                  const current = step.num === etapa;
                  return (
                    <div key={step.num} className="flex flex-col items-center" style={{ width: '33.33%' }}>
                      <div
                        className={`step-circle ${current ? 'active' : ''} w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300`}
                        style={{ background: done ? '#165c7d' : 'white', borderColor: done || current ? '#165c7d' : '#e8f2f7', color: done ? 'white' : current ? '#165c7d' : '#c5dde8' }}
                      >
                        {done ? <Check className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                      </div>
                      <p className="text-xs mt-2 font-medium transition-colors duration-300" style={{ color: current ? '#165c7d' : done ? '#4a7a8e' : '#c5dde8' }}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Etapa 1 ─── */}
          {etapa === 1 && (
            <div className="space-y-5 a-slide" style={{ animationDelay: '80ms' }}>
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#e8f2f7', boxShadow: '0 2px 12px -4px rgba(22,92,125,0.08)' }}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: '#f0f7fb', background: '#f8fbfd' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#eef7fb' }}>
                    <Home className="w-4 h-4" style={{ color: '#165c7d' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: '#0f3d52' }}>Informações Básicas</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Código do Imóvel <span style={{ color: '#ef4444' }}>*</span></label>
                      <input className="field-input" placeholder="IMV-2024-XXX" defaultValue="IMV-2024-" />
                      <p className="text-xs mt-1" style={{ color: '#8baebb' }}>Código único de identificação</p>
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Tipo de Imóvel <span style={{ color: '#ef4444' }}>*</span></label>
                      <Select>
                        <SelectTrigger className="field-input" style={{ height: '42px' }}>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {[['apartamento','Apartamento'],['casa','Casa'],['comercial','Comercial / Sala'],['terreno','Terreno'],['galpao','Galpão'],['rural','Propriedade Rural']].map(([v,l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[['area','Área (m²)',true],['quartos','Quartos',false],['banheiros','Banheiros',false],['vagas','Vagas',false]].map(([id, label, req]) => (
                      <div key={id as string}>
                        <label className={labelCls} style={{ color: '#374151' }}>{label as string} {req && <span style={{ color: '#ef4444' }}>*</span>}</label>
                        <input type="number" className="field-input" placeholder="0" defaultValue={req ? undefined : '0'} />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Valor de Avaliação (R$) <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="number" className="field-input" placeholder="0,00" />
                      <p className="text-xs mt-1" style={{ color: '#8baebb' }}>Valor conforme laudo de avaliação</p>
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Data da Avaliação <span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="date" className="field-input" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Número da Matrícula <span style={{ color: '#ef4444' }}>*</span></label>
                      <input className="field-input" placeholder="Ex: 12345" />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Cartório de Registro <span style={{ color: '#ef4444' }}>*</span></label>
                      <input className="field-input" placeholder="Ex: 1º RI de São Paulo" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls} style={{ color: '#374151' }}>Descrição do Imóvel</label>
                    <textarea rows={4} className="field-input" placeholder="Descreva as características principais do imóvel..." style={{ resize: 'vertical' }} />
                  </div>

                  <div>
                    <label className={labelCls} style={{ color: '#374151' }}>Fotos do Imóvel</label>
                    <div className="space-y-3 mt-1">
                      {fotos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {fotos.map((foto, i) => (
                            <div key={i} className="relative group">
                              <img src={foto} alt={`Foto ${i + 1}`} className="photo-thumb w-full h-32 object-cover rounded-xl border" style={{ borderColor: '#e8f2f7' }} />
                              <button onClick={() => removerFoto(i)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="h-3 w-3" />
                              </button>
                              {i === 0 && <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: '#165c7d' }}>Principal</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      <button onClick={adicionarFoto} className="upload-area w-full flex items-center justify-center gap-2 py-4 text-sm font-medium" style={{ color: '#165c7d' }}>
                        <Upload className="h-4 w-4" /> Adicionar Foto
                      </button>
                      <p className="text-xs" style={{ color: '#8baebb' }}>A primeira foto será usada como principal.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="btn-next flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: '#165c7d' }} onClick={() => setEtapa(2)}>
                  Próxima Etapa: Localização <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Etapa 2 ─── */}
          {etapa === 2 && (
            <div className="space-y-5 a-slide" style={{ animationDelay: '80ms' }}>
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#e8f2f7', boxShadow: '0 2px 12px -4px rgba(22,92,125,0.08)' }}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: '#f0f7fb', background: '#f8fbfd' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#eef7fb' }}>
                    <MapPin className="w-4 h-4" style={{ color: '#165c7d' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: '#0f3d52' }}>Localização e Endereço</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>CEP <span style={{ color: '#ef4444' }}>*</span></label>
                      <input className="field-input" placeholder="00000-000" />
                      <button className="text-xs mt-1 font-semibold" style={{ color: '#165c7d' }}>Buscar CEP →</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <label className={labelCls} style={{ color: '#374151' }}>Logradouro <span style={{ color: '#ef4444' }}>*</span></label>
                      <input className="field-input" placeholder="Rua, Avenida, etc." />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Número <span style={{ color: '#ef4444' }}>*</span></label>
                      <input className="field-input" placeholder="Ex: 1234" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Complemento</label>
                      <input className="field-input" placeholder="Ex: Apto 501, Bloco B" />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Bairro <span style={{ color: '#ef4444' }}>*</span></label>
                      <input className="field-input" placeholder="Ex: Jardins" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Cidade <span style={{ color: '#ef4444' }}>*</span></label>
                      <input className="field-input" placeholder="Ex: São Paulo" />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Estado <span style={{ color: '#ef4444' }}>*</span></label>
                      <Select>
                        <SelectTrigger className="field-input" style={{ height: '42px' }}>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {[['SP','São Paulo'],['RJ','Rio de Janeiro'],['MG','Minas Gerais'],['RS','Rio Grande do Sul'],['PR','Paraná'],['SC','Santa Catarina']].map(([v,l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#eef7fb', border: '1px solid #cde8f4' }}>
                    <h4 className="font-semibold text-sm mb-2" style={{ color: '#0f3d52' }}>ℹ️ Informações de Localização</h4>
                    {['Verifique se o endereço está completo e correto','O CEP será usado para consultas de IPTU e certidões','Certifique-se que o número está de acordo com a matrícula'].map(tip => (
                      <p key={tip} className="text-sm flex items-start gap-2 mt-1" style={{ color: '#165c7d' }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#165c7d', display: 'inline-block' }} />
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border text-sm" style={{ color: '#4a7a8e', borderColor: '#e8f2f7', background: 'white' }} onClick={() => setEtapa(1)}>
                  <ArrowLeft className="h-4 w-4" /> Etapa Anterior
                </button>
                <button className="btn-next flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: '#165c7d' }} onClick={() => setEtapa(3)}>
                  Próxima Etapa: Documentos <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Etapa 3 ─── */}
          {etapa === 3 && (
            <div className="space-y-5 a-slide" style={{ animationDelay: '80ms' }}>
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#e8f2f7', boxShadow: '0 2px 12px -4px rgba(22,92,125,0.08)' }}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: '#f0f7fb', background: '#f8fbfd' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#eef7fb' }}>
                    <FileText className="w-4 h-4" style={{ color: '#165c7d' }} />
                  </div>
                  <h2 className="font-bold" style={{ color: '#0f3d52' }}>Documentos Iniciais</h2>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm font-semibold" style={{ color: '#374151' }}>Documentos Obrigatórios</p>
                  {[
                    { id: 1, nome: 'Matrícula Atualizada do Imóvel', obrigatorio: true },
                    { id: 2, nome: 'Laudo de Avaliação', obrigatorio: true },
                    { id: 3, nome: 'Termo de Consolidação de Propriedade', obrigatorio: true },
                    { id: 4, nome: 'Certidão de Débitos Municipais (IPTU)', obrigatorio: false },
                    { id: 5, nome: 'Certidão de Débitos Estaduais', obrigatorio: false },
                    { id: 6, nome: 'Certidão de Ônus Reais', obrigatorio: false },
                  ].map(doc => (
                    <div key={doc.id} className="doc-row flex items-center justify-between p-4 rounded-xl border" style={{ background: doc.obrigatorio ? '#fffbeb' : '#f8fbfd', borderColor: doc.obrigatorio ? '#fde68a' : '#e8f2f7' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: doc.obrigatorio ? '#fef3c7' : '#eef7fb' }}>
                          <FileText className="w-4 h-4" style={{ color: doc.obrigatorio ? '#d97706' : '#165c7d' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#0f3d52' }}>{doc.nome}</p>
                          {doc.obrigatorio && <span className="text-xs font-semibold" style={{ color: '#d97706' }}>Obrigatório</span>}
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold" style={{ color: '#165c7d', borderColor: '#cde8f4', background: 'white', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#eef7fb'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'white'}
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload
                      </button>
                    </div>
                  ))}
                  <div className="pt-2">
                    <label className={labelCls} style={{ color: '#374151' }}>Observações sobre Documentação</label>
                    <textarea rows={3} className="field-input" placeholder="Adicione observações sobre os documentos, pendências conhecidas, etc." style={{ resize: 'vertical' }} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#e8f2f7', boxShadow: '0 2px 12px -4px rgba(22,92,125,0.08)' }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: '#f0f7fb', background: '#f8fbfd' }}>
                  <h2 className="font-bold" style={{ color: '#0f3d52' }}>Iniciar Fluxo</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Responsável pelo Imóvel <span style={{ color: '#ef4444' }}>*</span></label>
                      <Select>
                        <SelectTrigger className="field-input" style={{ height: '42px' }}>
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          {[['maria','Maria Silva'],['joao','João Santos'],['carlos','Carlos Oliveira'],['ana','Ana Costa']].map(([v,l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs mt-1" style={{ color: '#8baebb' }}>Usuário responsável pela gestão do imóvel</p>
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: '#374151' }}>Etapa Inicial do Fluxo</label>
                      <Select defaultValue="leilao">
                        <SelectTrigger className="field-input" style={{ height: '42px' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leilao">Leilão</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs mt-1" style={{ color: '#8baebb' }}>Imóvel iniciará na etapa de Leilão</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#eef7fb', border: '1px solid #cde8f4' }}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#165c7d' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0f3d52' }}>Importante</p>
                      <p className="text-sm mt-0.5" style={{ color: '#4a7a8e' }}>
                        Ao cadastrar, o imóvel entrará automaticamente na etapa de "Leilão - Leilões Obrigatórios". Você deverá cadastrar os leilões (1º e 2º) na sequência.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border text-sm" style={{ color: '#4a7a8e', borderColor: '#e8f2f7', background: 'white' }} onClick={() => setEtapa(2)}>
                  <ArrowLeft className="h-4 w-4" /> Etapa Anterior
                </button>
                <button className="btn-next flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: '#16a34a' }} onClick={() => navigate('/gestao-bens')}>
                  <Save className="h-4 w-4" /> Cadastrar Imóvel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}