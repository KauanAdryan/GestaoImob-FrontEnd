import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { mockPayments, mockContracts, mockProperties, mockTenants } from '../data/mockData';
import { Payment, PaymentStatus } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Financial() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterMonth, setFilterMonth] = useState<string>('todos');

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'todos' || payment.status === filterStatus;
    const matchesMonth = filterMonth === 'todos' || 
      format(payment.mesReferencia, 'MM/yyyy') === filterMonth;
    return matchesStatus && matchesMonth;
  });

  const getContractDetails = (contratoId: string) => {
    const contract = mockContracts.find(c => c.id === contratoId);
    if (!contract) return { property: 'N/A', tenant: 'N/A' };
    
    const property = mockProperties.find(p => p.id === contract.imovelId);
    const tenant = mockTenants.find(t => t.id === contract.inquilinoId);
    
    return {
      property: property?.titulo || 'N/A',
      tenant: tenant?.nome || 'N/A',
    };
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      pago: { label: 'Pago', className: 'bg-green-100 text-green-800' },
      pendente: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      atrasado: { label: 'Atrasado', className: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Cálculos
  const totalRecebido = payments
    .filter(p => p.status === 'pago' && p.valorPago)
    .reduce((sum, p) => sum + (p.valorPago || 0), 0);

  const totalPendente = payments
    .filter(p => p.status === 'pendente')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const totalAtrasado = payments
    .filter(p => p.status === 'atrasado')
    .reduce((sum, p) => sum + p.valorPrevisto, 0);

  const taxaRecebimento = ((payments.filter(p => p.status === 'pago').length / payments.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Financeiro</h1>
        <p className="mt-1 text-sm text-gray-500">Controle de pagamentos e receitas</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Recebido</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {totalRecebido.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-green-600 mt-1">{taxaRecebimento}% de taxa de recebimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendente</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {totalPendente.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {payments.filter(p => p.status === 'pendente').length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Atrasado</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {totalAtrasado.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-red-600 mt-1">
              {payments.filter(p => p.status === 'atrasado').length} pagamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Prevista</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {(totalRecebido + totalPendente + totalAtrasado).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total do período</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Meses</SelectItem>
                <SelectItem value="01/2024">Janeiro 2024</SelectItem>
                <SelectItem value="02/2024">Fevereiro 2024</SelectItem>
                <SelectItem value="03/2024">Março 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pagamentos - Desktop */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Inquilino</TableHead>
                <TableHead>Mês Referência</TableHead>
                <TableHead>Valor Previsto</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const { property, tenant } = getContractDetails(payment.contratoId);
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-gray-900">{property}</TableCell>
                    <TableCell className="text-gray-700">{tenant}</TableCell>
                    <TableCell className="text-gray-600">
                      {format(payment.mesReferencia, 'MMMM yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      R$ {payment.valorPrevisto.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {payment.valorPago ? `R$ ${payment.valorPago.toLocaleString('pt-BR')}` : '-'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {payment.dataPagamento
                        ? format(payment.dataPagamento, 'dd/MM/yyyy', { locale: ptBR })
                        : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lista de Pagamentos - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredPayments.map((payment) => {
          const { property, tenant } = getContractDetails(payment.contratoId);
          return (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{property}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tenant}</p>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mês Referência</span>
                      <span className="text-gray-900 font-medium">
                        {format(payment.mesReferencia, 'MMM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valor Previsto</span>
                      <span className="text-gray-900 font-medium">
                        R$ {payment.valorPrevisto.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    {payment.valorPago && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Valor Pago</span>
                        <span className="text-green-600 font-medium">
                          R$ {payment.valorPago.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                    {payment.dataPagamento && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data Pagamento</span>
                        <span className="text-gray-900 font-medium">
                          {format(payment.dataPagamento, 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum pagamento encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
