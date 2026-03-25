import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Home, TrendingUp, AlertCircle } from 'lucide-react';
import { mockProperties, mockContracts, mockPayments } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  // Calcular estatísticas
  const totalImoveis = mockProperties.length;
  const imoveisAlugados = mockProperties.filter(p => p.status === 'alugado').length;
  const imoveisDisponiveis = mockProperties.filter(p => p.status === 'disponivel').length;
  
  const receitaMensal = mockContracts
    .filter(c => c.ativo)
    .reduce((sum, c) => sum + c.valorAluguel, 0);

  const pagamentosAtrasados = mockPayments.filter(p => p.status === 'atrasado').length;

  // Dados para gráficos
  const receitaMensalData = [
    { mes: 'Jan', valor: 8500 },
    { mes: 'Fev', valor: 14500 },
    { mes: 'Mar', valor: 8500 },
    { mes: 'Abr', valor: 8500 },
    { mes: 'Mai', valor: 14500 },
    { mes: 'Jun', valor: 14500 },
  ];

  const statusData = [
    { name: 'Alugados', value: imoveisAlugados },
    { name: 'Disponíveis', value: imoveisDisponiveis },
    { name: 'Manutenção', value: mockProperties.filter(p => p.status === 'manutencao').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  const tipoImovelData = [
    { tipo: 'Apartamento', quantidade: mockProperties.filter(p => p.tipo === 'apartamento').length },
    { tipo: 'Casa', quantidade: mockProperties.filter(p => p.tipo === 'casa').length },
    { tipo: 'Comercial', quantidade: mockProperties.filter(p => p.tipo === 'comercial').length },
    { tipo: 'Terreno', quantidade: mockProperties.filter(p => p.tipo === 'terreno').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Visão geral da sua gestão de imóveis</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Imóveis</CardTitle>
            <Building2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalImoveis}</div>
            <p className="text-xs text-gray-500 mt-1">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Imóveis Alugados</CardTitle>
            <Home className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{imoveisAlugados}</div>
            <p className="text-xs text-green-600 mt-1">
              {((imoveisAlugados / totalImoveis) * 100).toFixed(0)}% de ocupação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {receitaMensal.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-green-600 mt-1">+12.5% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pagamentos Atrasados</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pagamentosAtrasados}</div>
            <p className="text-xs text-red-600 mt-1">Requer atenção imediata</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={receitaMensalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Imóveis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Imóveis por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tipoImovelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="tipo" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="quantidade" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Pagamento recebido</p>
                <p className="text-sm text-gray-500">João Silva - Apartamento Centro - R$ 2.500</p>
                <p className="text-xs text-gray-400 mt-1">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Novo contrato assinado</p>
                <p className="text-sm text-gray-500">Maria Santos - Sala Comercial Paulista</p>
                <p className="text-xs text-gray-400 mt-1">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Imóvel em manutenção</p>
                <p className="text-sm text-gray-500">Cobertura Duplex - Pintura e reparos</p>
                <p className="text-xs text-gray-400 mt-1">Há 2 dias</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Novo imóvel cadastrado</p>
                <p className="text-sm text-gray-500">Casa com Piscina - Campinas/SP</p>
                <p className="text-xs text-gray-400 mt-1">Há 3 dias</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
