import { useEffect, useState } from 'react';
import { Search, Plus, X, Save, Loader2, AlertCircle, Users, Pencil, Trash2 } from 'lucide-react';
import { clienteService, type ClienteAPI, type ClientePayload } from '../../../services/clienteService';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

const styles = `
  @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
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
  .table-row { transition: background 0.15s ease; }
`;

const labelCls = 'text-sm font-semibold mb-1.5 block';
const req      = <span style={{ color: '#ef4444' }}>*</span>;

type FormState = { nome: string; agencia: string; conta: string };
const emptyForm: FormState = { nome: '', agencia: '', conta: '' };

export default function ClientesPage() {
  const [clientes, setClientes]     = useState<ClienteAPI[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState<ClienteAPI | null>(null);
  const [form, setForm]             = useState<FormState>(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    clienteService.getAll()
      .then(setClientes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = clientes.filter(c => {
    const q = search.toLowerCase();
    return !q
      || c.nome.toLowerCase().includes(q)
      || String(c.agencia).includes(q)
      || String(c.conta).includes(q);
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (c: ClienteAPI) => {
    setEditTarget(c);
    setForm({ nome: c.nome, agencia: String(c.agencia), conta: String(c.conta) });
    setError('');
    setShowForm(true);
  };

  const handleDelete = async (cliente: ClienteAPI) => {
    if (!confirm(`Excluir o cliente "${cliente.nome}"?`)) return;
    setDeletingId(cliente.id);
    try {
      await clienteService.delete(cliente.id);
      setClientes(prev => prev.filter(c => c.id !== cliente.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir cliente.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.nome.trim())    { setError('Informe o nome do cliente.'); return; }
    if (!form.agencia.trim()) { setError('Informe a agência.'); return; }
    if (!form.conta.trim())   { setError('Informe a conta.'); return; }

    const payload: ClientePayload = {
      nome:    form.nome.trim(),
      agencia: parseInt(form.agencia, 10),
      conta:   parseInt(form.conta, 10),
    };

    if (isNaN(payload.agencia)) { setError('Agência deve ser um número.'); return; }
    if (isNaN(payload.conta))   { setError('Conta deve ser um número.'); return; }

    setSaving(true);
    try {
      if (editTarget) {
        const updated = await clienteService.update(editTarget.id, payload);
        setClientes(prev => prev.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await clienteService.create(payload);
        setClientes(prev => [created, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cliente.');
    } finally {
      setSaving(false);
    }
  };

  const cardStyle  = { background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
  const sectionHdr = { borderColor: 'var(--border)', background: 'var(--muted)' };

  return (
    <>
      <style>{styles}</style>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between a-fade-up">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Clientes</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(22,92,125,0.25)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <Plus className="h-4 w-4" /> Novo Cliente
          </button>
        </div>

        {/* Formulário inline */}
        {showForm && (
          <div className="rounded-2xl border overflow-hidden a-fade-up" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={sectionHdr}>
              <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>
                {editTarget ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ color: 'var(--muted-foreground)' }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <label className={labelCls} style={{ color: 'var(--foreground)' }}>Nome {req}</label>
                  <input
                    className="field-input"
                    placeholder="Nome do cliente"
                    value={form.nome}
                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--foreground)' }}>Agência {req}</label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="Ex: 0001"
                    value={form.agencia}
                    onChange={e => setForm(f => ({ ...f, agencia: e.target.value }))}
                    min={0}
                  />
                </div>
                <div>
                  <label className={labelCls} style={{ color: 'var(--foreground)' }}>Conta {req}</label>
                  <input
                    type="number"
                    className="field-input"
                    placeholder="Ex: 123456"
                    value={form.conta}
                    onChange={e => setForm(f => ({ ...f, conta: e.target.value }))}
                    min={0}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 border"
                  style={{ background: 'var(--ailos-vermelho-50)', borderColor: 'var(--ailos-vermelho-100)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ailos-vermelho-500)' }} />
                  <p className="text-sm" style={{ color: 'var(--ailos-vermelho-500)' }}>{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
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

        {/* Busca */}
        <div className="rounded-2xl border p-4 a-fade-up" style={cardStyle}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--ailos-cinza-500)' }} />
            <Input
              placeholder="Buscar por nome, agência ou conta..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border py-16 text-center a-fade-up" style={cardStyle}>
            <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--ailos-cinza-400)' }} />
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
              {clientes.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              {clientes.length === 0
                ? 'Clique em "Novo Cliente" para cadastrar.'
                : 'Tente buscar por outro termo.'}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden a-fade-up"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Table>
              <TableHeader>
                <TableRow style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Nome', 'Agência', 'Conta', '', ''].map((h, i) => (
                    <TableHead key={i} className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--muted-foreground)' }}>
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(cliente => (
                  <TableRow
                    key={cliente.id}
                    className="table-row"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--accent)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: 'var(--primary)' }}
                        >
                          {cliente.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                          {cliente.nome}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm font-mono" style={{ color: 'var(--muted-foreground)' }}>
                      {String(cliente.agencia).padStart(4, '0')}
                    </TableCell>

                    <TableCell className="text-sm font-mono" style={{ color: 'var(--muted-foreground)' }}>
                      {String(cliente.conta)}
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => openEdit(cliente)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                        style={{ color: 'var(--primary)', borderColor: 'var(--border)', background: 'var(--card)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--ailos-azul-50)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Editar
                      </button>
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => handleDelete(cliente)}
                        disabled={deletingId === cliente.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold"
                        style={{
                          color: 'var(--ailos-vermelho-500)',
                          borderColor: 'var(--border)',
                          background: 'var(--card)',
                          transition: 'background 0.15s',
                          opacity: deletingId === cliente.id ? 0.6 : 1,
                          cursor: deletingId === cliente.id ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={e => { if (deletingId !== cliente.id) (e.currentTarget as HTMLElement).style.background = 'var(--ailos-vermelho-50)'; }}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}
                      >
                        {deletingId === cliente.id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <Trash2 className="h-3.5 w-3.5" />}
                        Excluir
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
