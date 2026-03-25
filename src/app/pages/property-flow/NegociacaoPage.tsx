import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, CheckCircle2, Clock, Phone, Mail, User, Home, Scale, FileText, AlertCircle } from 'lucide-react';
import { mockProperties } from '../../data/property-flow-updated';
import { CommentFeed } from '../../components/property-flow/CommentFeed';
import { SLABadge } from '../../components/property-flow/SLABadge';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TopicoNegociacao {
  id: string;
  titulo: string;
  descricao: string;
  obrigatorio: boolean;
  ordem: number;
  aberto: boolean;
  slaData: Date;
  slaStatus: 'no-prazo' | 'proximo-vencimento' | 'vencido';
  dataConclusao?: Date;
  concluidoPor?: string;
}

interface TentativaContato {
  id: string;
  data: Date;
  tipo: 'telefone' | 'email' | 'presencial' | 'carta';
  resultado: 'sucesso' | 'sem-resposta' | 'nao-localizado' | 'recusou';
  observacoes: string;
  responsavel: string;
}

export default function NegociacaoPage() {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === id);
  const [tipoNegociacao, setTipoNegociacao] = useState<'amigavel' | 'nao-amigavel'>('amigavel');
  
  const [topicosAmigavel, setTopicosAmigavel] = useState<TopicoNegociacao[]>([
    {
      id: '1',
      titulo: 'Prazo Inicial de Desocupação Voluntária',
      descricao: 'Notificar ocupante sobre consolidação e oferecer prazo de 30 dias para desocupação voluntária',
      obrigatorio: true,
      ordem: 1,
      aberto: true,
      slaData: addDays(new Date(), 30),
      slaStatus: 'no-prazo',
    },
    {
      id: '2',
      titulo: 'Tentativas de Contato com Ocupante',
      descricao: 'Registrar ao menos 3 tentativas de contato antes de prosseguir',
      obrigatorio: true,
      ordem: 2,
      aberto: false,
      slaData: addDays(new Date(), 45),
      slaStatus: 'no-prazo',
    },
    {
      id: '3',
      titulo: 'Avaliação de Proposta de Recompra',
      descricao: 'Analisar viabilidade de proposta de recompra do imóvel pelo ocupante',
      obrigatorio: false,
      ordem: 3,
      aberto: false,
      slaData: addDays(new Date(), 60),
      slaStatus: 'no-prazo',
    },
    {
      id: '4',
      titulo: 'Negociação de Acordo de Desocupação',
      descricao: 'Definir termos do acordo, indenizações e prazo final',
      obrigatorio: true,
      ordem: 4,
      aberto: false,
      slaData: addDays(new Date(), 75),
      slaStatus: 'no-prazo',
    },
  ]);

  const [topicosNaoAmigavel, setTopicosNaoAmigavel] = useState<TopicoNegociacao[]>([
    {
      id: '1',
      titulo: '3º Leilão (em avaliação)',
      descricao: 'Analisar necessidade e viabilidade de realização do 3º leilão',
      obrigatorio: true,
      ordem: 1,
      aberto: true,
      slaData: addDays(new Date(), 15),
      slaStatus: 'no-prazo',
    },
    {
      id: '2',
      titulo: 'Preparação para Reintegração de Posse',
      descricao: 'Consolidar documentação e solicitar mandado de reintegração',
      obrigatorio: true,
      ordem: 2,
      aberto: false,
      slaData: addDays(new Date(), 30),
      slaStatus: 'no-prazo',
    },
    {
      id: '3',
      titulo: 'Execução da Reintegração',
      descricao: 'Coordenar com oficial de justiça e equipe de apoio',
      obrigatorio: true,
      ordem: 3,
      aberto: false,
      slaData: addDays(new Date(), 45),
      slaStatus: 'no-prazo',
    },
  ]);

  const [tentativasContato, setTentativasContato] = useState<TentativaContato[]>([
    {
      id: '1',
      data: new Date('2026-02-19T10:00:00'),
      tipo: 'telefone',
      resultado: 'sem-resposta',
      observacoes: 'Ligação não atendida. Deixada mensagem na caixa postal.',
      responsavel: 'Ana Costa',
    },
    {
      id: '2',
      data: new Date('2026-02-20T14:30:00'),
      tipo: 'email',
      resultado: 'sem-resposta',
      observacoes: 'E-mail enviado. Aguardando retorno em 48h.',
      responsavel: 'Ana Costa',
    },
    {
      id: '3',
      data: new Date('2026-02-21T16:00:00'),
      tipo: 'presencial',
      resultado: 'nao-localizado',
      observacoes: 'Visita ao imóvel. Porteiro informou que ocupante viaja com frequência.',
      responsavel: 'Carlos Oliveira',
    },
  ]);

  if (!property) {
    return <p className="text-center text-gray-500">Imóvel não encontrado</p>;
  }

  const topicos = tipoNegociacao === 'amigavel' ? topicosAmigavel : topicosNaoAmigavel;
  const topicoAberto = topicos.find(t => t.aberto);
  const progressoTopicos = topicos.filter(t => t.dataConclusao).length;

  const getTipoIcone = (tipo: string) => {
    const icons = {
      telefone: Phone,
      email: Mail,
      presencial: User,
      carta: FileText,
    };
    return icons[tipo as keyof typeof icons] || Phone;
  };

  const getResultadoBadge = (resultado: string) => {
    const config = {
      'sucesso': { className: 'bg-green-100 text-green-800', label: 'Sucesso' },
      'sem-resposta': { className: 'bg-yellow-100 text-yellow-800', label: 'Sem Resposta' },
      'nao-localizado': { className: 'bg-orange-100 text-orange-800', label: 'Não Localizado' },
      'recusou': { className: 'bg-red-100 text-red-800', label: 'Recusou Contato' },
    };
    const { className, label } = config[resultado as keyof typeof config];
    return <Badge className={className}>{label}</Badge>;
  };

  const concluirTopico = (topicoId: string) => {
    const setter = tipoNegociacao === 'amigavel' ? setTopicosAmigavel : setTopicosNaoAmigavel;
    setter(topicos.map(t => {
      if (t.id === topicoId) {
        return {
          ...t,
          aberto: false,
          dataConclusao: new Date(),
          concluidoPor: 'Usuário Atual',
        };
      }
      // Abrir próximo tópico se for obrigatório
      if (t.ordem === (topicos.find(x => x.id === topicoId)?.ordem || 0) + 1 && t.obrigatorio) {
        return { ...t, aberto: true };
      }
      return t;
    }));
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
        <h1 className="text-2xl font-semibold text-gray-900">Negociação - {property.codigo}</h1>
        <p className="text-sm text-gray-600 mt-1">{property.endereco}</p>
      </div>

      {/* Seletor de Tipo de Negociação */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium text-gray-700">Tipo de Negociação:</Label>
            <div className="flex gap-2">
              <Button
                variant={tipoNegociacao === 'amigavel' ? 'default' : 'outline'}
                onClick={() => setTipoNegociacao('amigavel')}
                className={tipoNegociacao === 'amigavel' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                <Home className="h-4 w-4 mr-2" />
                Negociação Amigável
              </Button>
              <Button
                variant={tipoNegociacao === 'nao-amigavel' ? 'default' : 'outline'}
                onClick={() => setTipoNegociacao('nao-amigavel')}
                className={tipoNegociacao === 'nao-amigavel' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                <Scale className="h-4 w-4 mr-2" />
                Negociação Não Amigável
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="planner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planner">Planner de Tópicos</TabsTrigger>
          <TabsTrigger value="contatos">Tentativas de Contato</TabsTrigger>
          <TabsTrigger value="documentos">Documentos e Acordos</TabsTrigger>
        </TabsList>

        {/* Tab: Planner */}
        <TabsContent value="planner" className="space-y-6">
          {/* Progresso Geral */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Progresso da Negociação</h4>
                  <span className="text-sm font-semibold text-gray-600">
                    {progressoTopicos}/{topicos.length} tópicos concluídos
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(progressoTopicos / topicos.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tópicos */}
          <div className="space-y-4">
            {topicos.map((topico, index) => (
              <Card 
                key={topico.id}
                className={`
                  ${topico.aberto ? 'border-blue-500 border-2 shadow-lg' : ''}
                  ${topico.dataConclusao ? 'bg-green-50 border-green-200' : ''}
                `}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold
                          ${topico.dataConclusao 
                            ? 'bg-green-600 text-white' 
                            : topico.aberto 
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-300 text-gray-700'
                          }
                        `}>
                          {topico.dataConclusao ? <CheckCircle2 className="h-5 w-5" /> : topico.ordem}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{topico.titulo}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{topico.descricao}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {topico.obrigatorio && !topico.dataConclusao && (
                        <Badge className="bg-orange-100 text-orange-800">Obrigatório</Badge>
                      )}
                      {topico.dataConclusao && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Concluído
                        </Badge>
                      )}
                      {topico.aberto && (
                        <Badge className="bg-blue-100 text-blue-800 animate-pulse">
                          Em Andamento
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* SLA do Tópico */}
                  {!topico.dataConclusao && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Prazo:</span>
                        <SLABadge 
                          status={topico.slaStatus} 
                          data={topico.slaData}
                          showDays={true}
                        />
                      </div>
                    </div>
                  )}

                  {/* Informações de Conclusão */}
                  {topico.dataConclusao && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        Concluído por <span className="font-medium">{topico.concluidoPor}</span> em{' '}
                        {format(topico.dataConclusao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  )}

                  {/* Área de Trabalho do Tópico Aberto */}
                  {topico.aberto && (
                    <div className="space-y-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Área de Trabalho do Tópico</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`responsavel-${topico.id}`}>Responsável</Label>
                          <Select defaultValue="ana">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ana">Ana Costa</SelectItem>
                              <SelectItem value="carlos">Carlos Oliveira</SelectItem>
                              <SelectItem value="maria">Maria Silva</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`prazo-${topico.id}`}>Prazo</Label>
                          <Input 
                            id={`prazo-${topico.id}`}
                            type="date"
                            defaultValue={format(topico.slaData, 'yyyy-MM-dd')}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`observacoes-${topico.id}`}>Observações e Andamento</Label>
                        <Textarea 
                          id={`observacoes-${topico.id}`}
                          placeholder="Registre as ações realizadas, decisões tomadas, próximos passos..."
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t border-blue-200">
                        <Button variant="outline">
                          Salvar Progresso
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => concluirTopico(topico.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Concluir Tópico
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Feed de Comentários (sempre visível) */}
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-3">Registro de Comentários</h5>
                    <CommentFeed 
                      comments={[]} 
                      onAddComment={topico.aberto ? (text) => console.log(text) : undefined}
                      readOnly={!topico.aberto}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Tentativas de Contato */}
        <TabsContent value="contatos" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Registro de Tentativas de Contato</h3>
              <p className="text-sm text-gray-600 mt-1">
                Mínimo de 3 tentativas documentadas antes de prosseguir
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Registrar Nova Tentativa
            </Button>
          </div>

          {/* Alerta de Quantidade */}
          {tentativasContato.length < 3 && (
            <Card className="border-orange-500 border-2 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">
                      Atenção: {3 - tentativasContato.length} tentativa(s) adicional(is) necessária(s)
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      É obrigatório registrar ao menos 3 tentativas de contato antes de avançar para negociação não amigável.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Tentativas */}
          <div className="space-y-3">
            {tentativasContato.map((tentativa, index) => {
              const IconeTipo = getTipoIcone(tentativa.tipo);
              return (
                <Card key={tentativa.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconeTipo className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono">
                                Tentativa #{index + 1}
                              </Badge>
                              <Badge variant="outline">
                                {tentativa.tipo.charAt(0).toUpperCase() + tentativa.tipo.slice(1)}
                              </Badge>
                              {getResultadoBadge(tentativa.resultado)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {format(tentativa.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded">
                          {tentativa.observacoes}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          Responsável: <span className="font-medium">{tentativa.responsavel}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab: Documentos */}
        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle>Documentos e Acordos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Gerenciamento de documentos de negociação em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
