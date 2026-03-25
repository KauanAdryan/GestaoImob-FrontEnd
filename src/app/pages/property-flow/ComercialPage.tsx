import { mockProperties, mockPropostas } from '../../data/property-flow-updated';
import { Link, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Building2, FileText, MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Imobiliaria {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  dataInicio: Date;
  dataFim?: Date;
  ativo: boolean;
}

export default function ComercialPage() {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === id);
  const propostas = mockPropostas.filter(p => p.imovelId === id);
  
  const [imobiliarias, setImobiliarias] = useState<Imobiliaria[]>([
    {
      id: '1',
      nome: 'Imobiliária Prime',
      cnpj: '12.345.678/0001-90',
      contato: '(11) 3456-7890',
      dataInicio: new Date('2026-01-15'),
      dataFim: new Date('2026-02-15'),
      ativo: false,
    },
    {
      id: '2',
      nome: 'Imóveis & Negócios',
      cnpj: '98.765.432/0001-10',
      contato: '(11) 9876-5432',
      dataInicio: new Date('2026-02-16'),
      ativo: true,
    },
  ]);

  const [showPropostaForm, setShowPropostaForm] = useState(false);

  if (!property) {
    return <p className="text-center text-gray-500">Imóvel não encontrado</p>;
  }

  const getStatusBadge = (status: string) => {
    const config = {
      'aprovada': { className: 'bg-green-100 text-green-800', label: 'Aprovada', icon: ThumbsUp },
      'rejeitada': { className: 'bg-red-100 text-red-800', label: 'Rejeitada', icon: ThumbsDown },
      'pendente': { className: 'bg-yellow-100 text-yellow-800', label: 'Pendente', icon: Clock },
      'contra-proposta': { className: 'bg-blue-100 text-blue-800', label: 'Contra-proposta', icon: MessageSquare },
    };
    const { className, label, icon: Icon } = config[status as keyof typeof config];
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to={`/gestao-bens/${id}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Detalhes
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Comercial - {property.codigo}</h1>
        <p className="text-sm text-gray-600 mt-1">{property.endereco}</p>
      </div>

      {/* Histórico de Imobiliárias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Histórico de Imobiliárias</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Imobiliárias responsáveis pela comercialização</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Imobiliária
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {imobiliarias.map((imobiliaria) => (
            <Card key={imobiliaria.id} className={imobiliaria.ativo ? 'border-green-500 border-2' : ''}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{imobiliaria.nome}</h4>
                        {imobiliaria.ativo && (
                          <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">CNPJ: {imobiliaria.cnpj}</p>
                      <p className="text-sm text-gray-600">Contato: {imobiliaria.contato}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Início: {format(imobiliaria.dataInicio, 'dd/MM/yyyy', { locale: ptBR })}
                        {imobiliaria.dataFim && ` • Fim: ${format(imobiliaria.dataFim, 'dd/MM/yyyy', { locale: ptBR })}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Storyline de Negociação - Propostas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Propostas Recebidas</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Timeline de propostas e negociações</p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowPropostaForm(!showPropostaForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar Proposta
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário de Nova Proposta */}
          {showPropostaForm && (
            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numeroProposta">Número da Proposta</Label>
                    <Input id="numeroProposta" placeholder="PROP-2024-XXX" />
                  </div>
                  <div>
                    <Label htmlFor="clienteProposta">Nome do Cliente</Label>
                    <Input id="clienteProposta" placeholder="Nome completo ou razão social" />
                  </div>
                  <div>
                    <Label htmlFor="valorProposta">Valor da Proposta</Label>
                    <Input id="valorProposta" type="number" placeholder="0,00" />
                  </div>
                  <div>
                    <Label htmlFor="dataProposta">Data da Proposta</Label>
                    <Input id="dataProposta" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="observacoesProposta">Observações</Label>
                  <Textarea 
                    id="observacoesProposta"
                    placeholder="Condições, observações, detalhes da proposta..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowPropostaForm(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Salvar Proposta
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Propostas */}
          <div className="space-y-4">
            {propostas.map((proposta, index) => (
              <Card key={proposta.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header da Proposta */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono">
                            {proposta.numero}
                          </Badge>
                          {getStatusBadge(proposta.status)}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{proposta.cliente}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(proposta.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          R$ {proposta.valor.toLocaleString('pt-BR')}
                        </p>
                        {property.valor && (
                          <p className="text-sm text-gray-600 mt-1">
                            {((proposta.valor / property.valor) * 100).toFixed(1)}% do valor pedido
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Observações */}
                    {proposta.observacoes && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{proposta.observacoes}</p>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-2" />
                        Comentários ({proposta.comentarios.length})
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="h-3 w-3 mr-2" />
                        Ver Documentos
                      </Button>
                      {proposta.status === 'pendente' && (
                        <>
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <ThumbsUp className="h-3 w-3 mr-2" />
                            Aprovar
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                            <ThumbsDown className="h-3 w-3 mr-2" />
                            Rejeitar
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Timeline de Comentários */}
                    {proposta.comentarios.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <CommentFeed comments={proposta.comentarios} readOnly />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {propostas.length === 0 && !showPropostaForm && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">Nenhuma proposta registrada ainda</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowPropostaForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Primeira Proposta
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar PDF de Proposta
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Aceitar Proposta e Avançar para Venda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}