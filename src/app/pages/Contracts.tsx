import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, FileText, Calendar } from 'lucide-react';
import { mockContracts, mockProperties, mockTenants } from '../data/mockData';
import { Contract } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getPropertyName = (imovelId: string) => {
    const property = mockProperties.find(p => p.id === imovelId);
    return property?.titulo || 'Imóvel não encontrado';
  };

  const getTenantName = (inquilinoId: string) => {
    const tenant = mockTenants.find(t => t.id === inquilinoId);
    return tenant?.nome || 'Inquilino não encontrado';
  };

  const getContractStatus = (contract: Contract) => {
    const now = new Date();
    const isExpiringSoon = contract.dataFim.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000;
    
    if (!contract.ativo) {
      return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
    } else if (isExpiringSoon) {
      return <Badge className="bg-yellow-100 text-yellow-800">Vence em breve</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Contratos</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie os contratos de locação</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Contrato</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="imovel">Imóvel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProperties.filter(p => p.status === 'disponivel').map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.titulo} - {property.cidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="inquilino">Inquilino</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o inquilino" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTenants.map(tenant => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.nome} - {tenant.cpf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input id="dataInicio" type="date" />
                </div>
                <div>
                  <Label htmlFor="dataFim">Data de Término</Label>
                  <Input id="dataFim" type="date" />
                </div>
                <div>
                  <Label htmlFor="valorAluguel">Valor do Aluguel (R$)</Label>
                  <Input id="valorAluguel" type="number" placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="diaVencimento">Dia de Vencimento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>
                          Dia {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Salvar Contrato</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {contracts.filter(c => c.ativo).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  R$ {contracts.filter(c => c.ativo).reduce((sum, c) => sum + c.valorAluguel, 0).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-semibold">R$</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencem em 30 dias</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {contracts.filter(c => {
                    const diff = c.dataFim.getTime() - new Date().getTime();
                    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Contratos - Desktop */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Inquilino</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium text-gray-900">
                    {getPropertyName(contract.imovelId)}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {getTenantName(contract.inquilinoId)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="space-y-1">
                      <p className="text-sm">
                        {format(contract.dataInicio, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      <p className="text-sm">
                        {format(contract.dataFim, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    Dia {contract.diaVencimento}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    R$ {contract.valorAluguel.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {getContractStatus(contract)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lista de Contratos - Mobile */}
      <div className="md:hidden space-y-4">
        {contracts.map((contract) => (
          <Card key={contract.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{getPropertyName(contract.imovelId)}</h3>
                    <p className="text-sm text-gray-600 mt-1">{getTenantName(contract.inquilinoId)}</p>
                  </div>
                  {getContractStatus(contract)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Início</p>
                    <p className="text-gray-900 font-medium">
                      {format(contract.dataInicio, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Término</p>
                    <p className="text-gray-900 font-medium">
                      {format(contract.dataFim, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vencimento</p>
                    <p className="text-gray-900 font-medium">Dia {contract.diaVencimento}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valor</p>
                    <p className="text-gray-900 font-medium">
                      R$ {contract.valorAluguel.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">Ver Detalhes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contracts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum contrato cadastrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
