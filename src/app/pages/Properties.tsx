import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Plus, Search, MapPin, Bed, Bath, Car, Ruler } from 'lucide-react';
import { mockProperties } from '../data/mockData';
import { Property, PropertyType, PropertyStatus } from '../types';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PropertyStatus) => {
    const statusConfig = {
      disponivel: { label: 'Disponível', className: 'bg-green-100 text-green-800' },
      alugado: { label: 'Alugado', className: 'bg-blue-100 text-blue-800' },
      manutencao: { label: 'Manutenção', className: 'bg-yellow-100 text-yellow-800' },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTipoBadge = (tipo: PropertyType) => {
    const tipoConfig = {
      apartamento: { label: 'Apartamento' },
      casa: { label: 'Casa' },
      comercial: { label: 'Comercial' },
      terreno: { label: 'Terreno' },
    };
    return <Badge variant="outline">{tipoConfig[tipo].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Imóveis</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie seu portfólio de imóveis</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Imóvel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Imóvel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input id="titulo" placeholder="Ex: Apartamento Moderno no Centro" />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                      <SelectItem value="alugado">Alugado</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" placeholder="Rua, número" />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" placeholder="Ex: São Paulo" />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input id="estado" placeholder="Ex: SP" />
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" />
                </div>
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input id="valor" type="number" placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="area">Área (m²)</Label>
                  <Input id="area" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="quartos">Quartos</Label>
                  <Input id="quartos" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="banheiros">Banheiros</Label>
                  <Input id="banheiros" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="vagas">Vagas</Label>
                  <Input id="vagas" type="number" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea id="descricao" placeholder="Descreva as características do imóvel" rows={3} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Salvar Imóvel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título, endereço ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="alugado">Alugado</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Imóveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video w-full overflow-hidden bg-gray-200">
              <img
                src={property.foto}
                alt={property.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{property.titulo}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="line-clamp-1">{property.cidade}, {property.estado}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mb-3">
                {getStatusBadge(property.status)}
                {getTipoBadge(property.tipo)}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                {property.quartos > 0 && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.quartos}</span>
                  </div>
                )}
                {property.banheiros > 0 && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.banheiros}</span>
                  </div>
                )}
                {property.vagas > 0 && (
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    <span>{property.vagas}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  <span>{property.area}m²</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Valor</p>
                  <p className="text-xl font-bold text-gray-900">
                    R$ {property.valor.toLocaleString('pt-BR')}
                  </p>
                </div>
                <Button variant="outline" size="sm">Ver Detalhes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum imóvel encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
