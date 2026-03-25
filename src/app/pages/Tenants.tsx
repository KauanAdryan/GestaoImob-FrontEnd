import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Search, Mail, Phone, Briefcase } from 'lucide-react';
import { mockTenants } from '../data/mockData';
import { Tenant } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTenants = tenants.filter(tenant =>
    tenant.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.cpf.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Inquilinos</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie os inquilinos dos seus imóveis</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Inquilino
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Inquilino</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Ex: João Silva" />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" />
                </div>
                <div>
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input id="dataNascimento" type="date" />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(00) 00000-0000" />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input id="profissao" placeholder="Ex: Engenheiro" />
                </div>
                <div>
                  <Label htmlFor="rendaMensal">Renda Mensal (R$)</Label>
                  <Input id="rendaMensal" type="number" placeholder="0,00" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Salvar Inquilino</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, e-mail ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Inquilinos - Desktop */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Profissão</TableHead>
                <TableHead>Renda Mensal</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{tenant.nome}</p>
                      <p className="text-sm text-gray-500">
                        {format(tenant.dataNascimento, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{tenant.cpf}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{tenant.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{tenant.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{tenant.profissao}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    R$ {tenant.rendaMensal.toLocaleString('pt-BR')}
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

      {/* Lista de Inquilinos - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{tenant.nome}</h3>
                  <p className="text-sm text-gray-500">{tenant.cpf}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{tenant.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{tenant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span>{tenant.profissao}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Renda Mensal</p>
                    <p className="font-semibold text-gray-900">
                      R$ {tenant.rendaMensal.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum inquilino encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
