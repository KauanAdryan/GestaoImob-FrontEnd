import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, Eye, Building2, DollarSign, Layers, Home } from 'lucide-react';
import { imovelService, enderecoLabel, imovelLabel, etapaLabel, STATUS_CONFIG, type ImovelAPI, type ImovelStatus } from '../../../services/imovelService';
import { useTheme } from '../../../contexts/ThemeContext';

const styles = `
  @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .a-fade-up { animation: fadeInUp 0.4s ease both; }
  .table-row-animate { transition: background 0.15s ease, transform 0.15s ease; }
`;

const TIPOS = ['Apartamento', 'Casa', 'Comercial', 'Terreno', 'Galpao', 'Rural'];

export default function PropertyFlowList() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [imoveis, setImoveis]     = useState<ImovelAPI[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]           = useState('');
  const [filterTipo, setFilterTipo]   = useState('todos');
  const [filterStatus, setFilterStatus] = useState<ImovelStatus | 'todos'>('todos');

  useEffect(() => {
    imovelService.getAll()
      .then(setImoveis)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = imoveis.filter(i => {
    const addr    = enderecoLabel(i).toLowerCase();
    const matchS  = search === '' || addr.includes(search.toLowerCase()) || String(i.numeroMatricula).includes(search);
    const matchT  = filterTipo === 'todos' || i.tipoImovel === filterTipo;
    const matchSt = filterStatus === 'todos' || i.status === filterStatus;
    return matchS && matchT && matchSt;
  });

  const stats = [
    { label: 'Total',         value: imoveis.length,                                                              icon: Building2,  color: isDark ? '#4A9BBF' : '#165C7D', bg: 'var(--ailos-azul-50)' },
    { label: 'Valor total',   value: `R$ ${(imoveis.reduce((s,i)=>s+(i.valorAvaliacao??0),0)/1_000_000).toFixed(1)}M`, icon: DollarSign, color: isDark ? '#38BDF8' : '#0891b2', bg: 'var(--ailos-azul-100)' },
    { label: 'Área total',    value: `${imoveis.reduce((s,i)=>s+(i.area??0),0).toLocaleString('pt-BR')} m²`,      icon: Layers,     color: '#d97706', bg: 'var(--ailos-amarelo-50)' },
    { label: 'Tipos',         value: new Set(imoveis.map(i=>i.tipoImovel)).size,                                   icon: Home,       color: '#16a34a', bg: 'var(--ailos-verde-50)' },
  ];

  const hoverBg = isDark ? '#1e2535' : '#eef7fb';

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
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between a-fade-up">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Gestão de Bens</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {filtered.length} {filtered.length === 1 ? 'imóvel' : 'imóveis'} encontrado{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="rounded-2xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--ailos-cinza-500)' }} />
              <Input
                placeholder="Buscar por endereço ou matrícula..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {TIPOS.map(t => <SelectItem key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={v => setFilterStatus(v as ImovelStatus | 'todos')}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {(Object.keys(STATUS_CONFIG) as ImovelStatus[]).map(s => (
                  <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela */}
        {filtered.length > 0 ? (
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Table>
              <TableHeader>
                <TableRow style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Imóvel', 'Tipo', 'Área', 'Valor de Avaliação', 'Matrícula', ''].map(h => (
                    <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(imovel => (
                  <TableRow
                    key={imovel.id}
                    className="table-row-animate"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = hoverBg}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {imovel.fotosImovel?.[0] ? (
                          <div className="overflow-hidden rounded-xl border flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                            <img src={imovel.fotosImovel[0]} alt="foto" className="w-14 h-14 object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ailos-azul-50)' }}>
                            <Building2 className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{imovelLabel(imovel)}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{enderecoLabel(imovel)}</p>
                          <p className="text-xs" style={{ color: 'var(--ailos-cinza-500)' }}>
                            {imovel.quartos}q · {imovel.banheiros}b · {imovel.vagasGaragem} vaga{imovel.vagasGaragem !== 1 ? 's' : ''}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {imovel.etapa && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium border"
                                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                                {etapaLabel(imovel.etapa)}
                              </span>
                            )}
                            {imovel.status && (() => {
                              const s = STATUS_CONFIG[imovel.status!];
                              return (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold border"
                                  style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                  {s.label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--ailos-azul-50)', color: 'var(--primary)' }}>
                        {imovel.tipoImovel.charAt(0) + imovel.tipoImovel.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: 'var(--foreground)' }}>{imovel.area} m²</TableCell>
                    <TableCell className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      R$ {(imovel.valorAvaliacao ?? 0).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{imovel.numeroMatricula}</TableCell>
                    <TableCell>
                      <Link to={`/gestao-bens/${imovel.id}`}>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--primary)' }}>
                          <Eye className="h-3.5 w-3.5" /> Abrir
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-2xl border py-16 text-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <Building2 className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--ailos-cinza-400)' }} />
            <p style={{ color: 'var(--muted-foreground)' }}>
              {imoveis.length === 0 ? 'Nenhum imóvel cadastrado ainda.' : 'Nenhum imóvel encontrado com os filtros aplicados.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
