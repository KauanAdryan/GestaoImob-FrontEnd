import { mockProperties } from '../../data/property-flow-updated';
import { Link, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DocumentChecklist } from '../../components/property-flow/DocumentChecklist';
import { ChecklistItem } from '../../types/property-flow';

export default function VendaPage() {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === id);
  
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      label: 'Contrato de Compra e Venda assinado',
      obrigatorio: true,
      concluido: false,
    },
    {
      id: '2',
      label: 'Comprovante de pagamento ou termo de quitação',
      obrigatorio: true,
      concluido: false,
    },
    {
      id: '3',
      label: 'Escritura pública lavrada',
      obrigatorio: true,
      concluido: false,
    },
    {
      id: '4',
      label: 'Certidões negativas (federal, estadual, municipal)',
      obrigatorio: true,
      concluido: false,
    },
    {
      id: '5',
      label: 'Matrícula atualizada do imóvel',
      obrigatorio: true,
      concluido: false,
    },
    {
      id: '6',
      label: 'ITBI recolhido',
      obrigatorio: true,
      concluido: false,
    },
    {
      id: '7',
      label: 'Registro da venda no cartório',
      obrigatorio: true,
      concluido: false,
    },
    {
      id: '8',
      label: 'Comprovante de quitação de débitos condominiais',
      obrigatorio: false,
      concluido: false,
    },
    {
      id: '9',
      label: 'Laudo de vistoria final',
      obrigatorio: false,
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

  if (!property) {
    return <p className="text-center text-gray-500">Imóvel não encontrado</p>;
  }

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
        <h1 className="text-2xl font-semibold text-gray-900">Venda - {property.codigo}</h1>
        <p className="text-sm text-gray-600 mt-1">{property.endereco}</p>
      </div>

      {/* Dados da Venda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dados da Venda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="comprador">Nome do Comprador</Label>
              <Input id="comprador" placeholder="Nome completo ou razão social" />
            </div>

            <div>
              <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
              <Input id="cpfCnpj" placeholder="000.000.000-00" />
            </div>

            <div>
              <Label htmlFor="dataVenda">Data da Venda</Label>
              <Input id="dataVenda" type="date" />
            </div>

            <div>
              <Label htmlFor="valorVenda">Valor da Venda</Label>
              <Input id="valorVenda" type="number" placeholder="0,00" />
            </div>

            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vista">À Vista</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                  <SelectItem value="financiamento">Financiamento Bancário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observacoesVenda">Observações</Label>
              <Textarea 
                id="observacoesVenda"
                placeholder="Informações adicionais sobre a venda..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist de Venda */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist de Documentos e Etapas</h3>
        <DocumentChecklist 
          items={checklistItems}
          onToggle={handleToggle}
        />
      </div>

      {/* Informações Importantes */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Próximas Etapas</h4>
              <p className="text-sm text-blue-800 mt-1">
                Após concluir todos os itens obrigatórios do checklist, o imóvel será automaticamente movido para a etapa de Pós-Venda, onde será feito o acompanhamento final e, se aplicável, o controle de parcelas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline">
              Salvar Rascunho
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={checklistItems.filter(i => i.obrigatorio && !i.concluido).length > 0}
            >
              Concluir Venda e Avançar para Pós-Venda
            </Button>
          </div>
          {checklistItems.filter(i => i.obrigatorio && !i.concluido).length > 0 && (
            <p className="text-sm text-orange-600 text-right mt-2">
              Complete todos os itens obrigatórios para avançar
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}