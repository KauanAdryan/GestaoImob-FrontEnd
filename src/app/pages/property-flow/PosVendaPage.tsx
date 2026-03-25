import { mockProperties } from '../../data/property-flow-updated';
import { Link, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, CheckCircle2, CreditCard, AlertTriangle } from 'lucide-react';
import { DocumentChecklist } from '../../components/property-flow/DocumentChecklist';
import { ChecklistItem, Parcela } from '../../types/property-flow';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PosVendaPage() {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === id);
  
  const [vendaParcelada, setVendaParcelada] = useState(false);
  const [parcelas, setParcelas] = useState<Parcela[]>([
    {
      numero: 1,
      valor: 45000,
      vencimento: new Date('2026-03-10'),
      paga: true,
      dataPagamento: new Date('2026-03-09'),
    },
    {
      numero: 2,
      valor: 45000,
      vencimento: new Date('2026-04-10'),
      paga: false,
    },
    {
      numero: 3,
      valor: 45000,
      vencimento: new Date('2026-05-10'),
      paga: false,
    },
  ]);

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      label: 'Entrega de chaves ao comprador',
      obrigatorio: true,
      concluido: true,
      dataConclusao: new Date('2026-02-20'),
      concluidoPor: 'Maria Silva',
    },
    {
      id: '2',
      label: 'Termo de entrega assinado',
      obrigatorio: true,
      concluido: true,
      dataConclusao: new Date('2026-02-20'),
      concluidoPor: 'Maria Silva',
    },
    {
      id: '3',
      label: 'Baixa de débitos pendentes (IPTU, condomínio)',
      obrigatorio: true,
      concluido: false,
    },
    {
      id: '4',
      label: 'Transferência de titularidade nas concessionárias',
      obrigatorio: false,
      concluido: false,
    },
    {
      id: '5',
      label: 'Arquivo físico organizado e arquivado',
      obrigatorio: true,
      concluido: false,
    },
  ]);

  const handleToggle = (itemId: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, concluido: !item.concluido, dataConclusao: !item.concluido ? new Date() : undefined, concluidoPor: !item.concluido ? 'Usuário Atual' : undefined }
          : item
      )
    );
  };

  const handleMarcarPagamento = (numeroP: number) => {
    setParcelas(parcelas.map(p => 
      p.numero === numeroP 
        ? { ...p, paga: !p.paga, dataPagamento: !p.paga ? new Date() : undefined }
        : p
    ));
  };

  if (!property) {
    return <p className="text-center text-gray-500">Imóvel não encontrado</p>;
  }

  const parcelasPagas = parcelas.filter(p => p.paga).length;
  const totalPago = parcelas.filter(p => p.paga).reduce((sum, p) => sum + p.valor, 0);
  const totalAPagar = parcelas.filter(p => !p.paga).reduce((sum, p) => sum + p.valor, 0);

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
        <h1 className="text-2xl font-semibold text-gray-900">Pós-Venda - {property.codigo}</h1>
        <p className="text-sm text-gray-600 mt-1">{property.endereco}</p>
      </div>

      {/* Venda Parcelada */}
      <Card className={vendaParcelada ? 'border-blue-500 border-2' : ''}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <CardTitle className="text-lg">Venda Parcelada</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Configuração e controle de parcelas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="vendaParcelada" className="text-sm font-normal cursor-pointer">
                Venda parcelada?
              </Label>
              <Checkbox 
                id="vendaParcelada"
                checked={vendaParcelada}
                onCheckedChange={(checked) => setVendaParcelada(checked as boolean)}
              />
            </div>
          </div>
        </CardHeader>
        
        {vendaParcelada && (
          <CardContent className="space-y-6">
            {/* Informação sobre ocorrência fiscal */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">Atenção: Ocorrência Fiscal Automática</p>
                <p className="text-sm text-orange-700 mt-1">
                  Para vendas parceladas, ao marcar cada pagamento mensal será gerada automaticamente uma pendência contábil (solicitação ao setor fiscal).
                </p>
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">Total Pago</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  R$ {totalPago.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {parcelasPagas} de {parcelas.length} parcelas
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">A Receber</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  R$ {totalAPagar.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {parcelas.length - parcelasPagas} parcelas restantes
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">Progresso</p>
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(parcelasPagas / parcelas.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    {((parcelasPagas / parcelas.length) * 100).toFixed(0)}% concluído
                  </p>
                </div>
              </div>
            </div>

            {/* Configuração de Parcelas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Controle de Parcelas</h4>
                <Button variant="outline" size="sm">
                  Editar Configuração
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm text-gray-600">Número de Parcelas</Label>
                  <p className="font-medium text-gray-900 mt-1">{parcelas.length}x</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Valor da Parcela</Label>
                  <p className="font-medium text-gray-900 mt-1">
                    R$ {parcelas[0].valor.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Dia de Vencimento</Label>
                  <p className="font-medium text-gray-900 mt-1">
                    Todo dia {format(parcelas[0].vencimento, 'dd')}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de Parcelas */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Parcelas</h4>
              {parcelas.map((parcela) => (
                <Card key={parcela.numero} className={parcela.paga ? 'bg-green-50 border-green-200' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={parcela.paga}
                        onCheckedChange={() => handleMarcarPagamento(parcela.numero)}
                      />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <p className="text-sm text-gray-600">Parcela</p>
                          <p className="font-semibold text-gray-900">
                            {parcela.numero}/{parcelas.length}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Vencimento</p>
                          <p className="font-medium text-gray-900">
                            {format(parcela.vencimento, 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Valor</p>
                          <p className="font-semibold text-gray-900">
                            R$ {parcela.valor.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          {parcela.paga ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Pago em {format(parcela.dataPagamento!, 'dd/MM/yyyy', { locale: ptBR })}
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Pendente
                            </Badge>
                          )}
                        </div>
                      </div>

                      {parcela.paga && (
                        <Button variant="outline" size="sm">
                          Ver Comprovante
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Checklist Pós-Venda */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist de Pós-Venda</h3>
        <DocumentChecklist 
          items={checklistItems}
          onToggle={handleToggle}
        />
      </div>

      {/* Ações Finais */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline">
              Salvar Progresso
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              disabled={checklistItems.filter(i => i.obrigatorio && !i.concluido).length > 0 || (vendaParcelada && parcelas.some(p => !p.paga))}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Finalizar Processo do Imóvel
            </Button>
          </div>
          {(checklistItems.filter(i => i.obrigatorio && !i.concluido).length > 0 || (vendaParcelada && parcelas.some(p => !p.paga))) && (
            <p className="text-sm text-orange-600 text-right mt-2">
              {vendaParcelada && parcelas.some(p => !p.paga)
                ? 'Todas as parcelas devem estar pagas para finalizar'
                : 'Complete todos os itens obrigatórios para finalizar'
              }
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}