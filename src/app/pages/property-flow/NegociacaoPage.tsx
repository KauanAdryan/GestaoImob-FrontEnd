import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Plus, Pencil, X, Save, Loader2, AlertCircle, Scale, Home, DollarSign } from 'lucide-react';
import { imovelService, enderecoLabel, imovelLabel, type ImovelAPI } from '../../../services/imovelService';
import { negociacaoService, type NegociacaoAPI, type NegociacaoPayload } from '../../../services/negociacaoService';

const styles = `
  @keyframes fadeInUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  .a-fade-up { animation: fadeInUp 0.4s ease both; }
  .field-input {
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--card);
    color: var(--foreground);
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--ailos-azul-100);
  }
  .field-input::placeholder { color: var(--ailos-cinza-400); }
`;

const labelCls = 'text-sm font-semibold mb-1.5 block';
const req = <span style={{ color: '#ef4444' }}>*</span>;

type FormState = {
  clienteId: string;
  valor: string;
  amigavel: boolean;
};

const emptyForm: FormState = { clienteId: '', valor: '', amigavel: true };

export default function NegociacaoPage() {
  const { id: imovelId } = useParams<{ id: string }>();

  const [imovel, setImovel]             = useState<ImovelAPI | null>(null);
  const [negociacoes, setNegociacoes]   = useState<NegociacaoAPI[]>([]);
  const [loading, setLoading]           = useState(true);

  const [showForm, setShowForm]         = useState(false);
  const [editTarget, setEditTarget]     = useState<NegociacaoAPI | null>(null);
  const [form, setForm]                 = useState<FormState>(emptyForm);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    if (!imovelId) return;
    Promise.all([
      imovelService.getById(imovelId),
      negociacaoService.getByImovel(imovelId),
    ])
      .then(([imovelData, negData]) => {
        setImovel(imovelData);
        setNegociacoes(Array.isArray(negData) ? negData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [imovelId]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (neg: NegociacaoAPI) => {
    setEditTarget(neg);
    setForm({
      clienteId: neg.clienteId,
      valor: neg.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      amigavel: neg.amigavel,
    });
    setError('');
    setShowForm(true);
  };

  const handleValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) { setForm(f => ({ ...f, valor: '' })); return; }
    const num = parseInt(digits, 10) / 100;
    setForm(f => ({ ...f, valor: num.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.clienteId.trim()) { setError('Informe o ID do cliente.'); return; }
    if (!form.valor)             { setError('Informe o valor da negociação.'); return; }

    const toNum = (v: string) => parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
    const payload: NegociacaoPayload = {
      imovelId: imovelId!,
      clienteId: form.clienteId.trim(),
      valor: toNum(form.valor),
      amigavel: form.amigavel,
    };

    setSaving(true);
    try {
      if (editTarget) {
        const updated = await negociacaoService.update(editTarget.id, payload);
        setNegociacoes(prev => prev.map(n => n.id === updated.id ? updated : n));
      } else {
        const created = await negociacaoService.create(payload);
        setNegociacoes(prev => [created, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar negociação.');
    } finally {
      setSaving(false);
    }
  };

  const cardStyle   = { background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
  const sectionHdr  = { borderColor: 'var(--border)', background: 'var(--muted)' };

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
      <div className="min-h-screen p-6" style={{ background: 'var(--background)' }}>
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Voltar */}
          <div className="a-fade-up">
            <Link to={`/gestao-bens/${imovelId}`}>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium mb-4"
                style={{ color: 'var(--muted-foreground)', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'; }}
              >
                <ArrowLeft className="h-4 w-4" /> Voltar para Detalhes
              </button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  Negociações
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  {imovel ? `${imovelLabel(imovel)} — ${enderecoLabel(imovel)}` : ''}
                </p>
              </div>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                <Plus className="h-4 w-4" /> Nova Negociação
              </button>
            </div>
          </div>

          {/* Formulário criar / editar */}
          {showForm && (
            <div className="rounded-2xl border overflow-hidden a-fade-up" style={cardStyle}>
              <div className="flex items-center justify-between px-6 py-4 border-b" style={sectionHdr}>
                <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>
                  {editTarget ? 'Editar Negociação' : 'Nova Negociação'}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--muted-foreground)' }}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">

                {/* Tipo */}
                <div>
                  <label className={labelCls} style={{ color: 'var(--foreground)' }}>Tipo de Negociação {req}</label>
                  <div className="flex gap-3 mt-1">
                    {[
                      { value: true,  label: 'Amigável',     icon: Home },
                      { value: false, label: 'Não Amigável', icon: Scale },
                    ].map(opt => {
                      const active = form.amigavel === opt.value;
                      return (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, amigavel: opt.value }))}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold flex-1 justify-center transition-all"
                          style={{
                            background:   active ? 'var(--primary)' : 'var(--card)',
                            color:        active ? 'white' : 'var(--muted-foreground)',
                            borderColor:  active ? 'var(--primary)' : 'var(--border)',
                          }}
                        >
                          <opt.icon className="h-4 w-4" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Valor */}
                <div>
                  <label className={labelCls} style={{ color: 'var(--foreground)' }}>Valor da Negociação (R$) {req}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="field-input"
                    placeholder="0,00"
                    value={form.valor}
                    onChange={handleValor}
                  />
                </div>

                {/* Cliente ID */}
                <div>
                  <label className={labelCls} style={{ color: 'var(--foreground)' }}>ID do Cliente {req}</label>
                  <input
                    className="field-input"
                    placeholder="UUID do cliente"
                    value={form.clienteId}
                    onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--ailos-cinza-500)' }}>
                    Busca de cliente por nome estará disponível em breve.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 border"
                    style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                    <p className="text-sm" style={{ color: 'var(--ailos-vermelho-500)' }}>{error}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl border text-sm font-semibold"
                    style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)', background: 'var(--card)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: '#16a34a', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de negociações */}
          {negociacoes.length === 0 ? (
            <div className="rounded-2xl border py-16 text-center a-fade-up" style={cardStyle}>
              <Scale className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--ailos-cinza-400)' }} />
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Nenhuma negociação registrada</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Clique em "Nova Negociação" para registrar.
              </p>
            </div>
          ) : (
            <div className="space-y-3 a-fade-up">
              {negociacoes.map(neg => (
                <div
                  key={neg.id}
                  className="rounded-2xl border p-5"
                  style={cardStyle}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: neg.amigavel ? '#E6F7ED' : '#FFF4E6' }}
                      >
                        {neg.amigavel
                          ? <Home className="w-5 h-5" style={{ color: '#006829' }} />
                          : <Scale className="w-5 h-5" style={{ color: '#CC8300' }} />
                        }
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                            style={neg.amigavel
                              ? { background: '#E6F7ED', color: '#006829', borderColor: '#CCEFDB' }
                              : { background: '#FFF4E6', color: '#CC8300', borderColor: '#FFE9CC' }
                            }
                          >
                            {neg.amigavel ? 'Amigável' : 'Não Amigável'}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--ailos-cinza-500)' }}>
                            #{neg.id.slice(0, 8)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--primary)' }} />
                          <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                            R$ {neg.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          Cliente: <span className="font-mono">{neg.clienteId}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openEdit(neg)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold flex-shrink-0"
                      style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
