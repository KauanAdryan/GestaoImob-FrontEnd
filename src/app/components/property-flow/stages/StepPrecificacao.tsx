import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { FileDown, Plus, X } from 'lucide-react';
import { generatePrecificacaoPDF } from '../../../services/pdfGenerator';
import { toast } from 'sonner';

export function StepPrecificacao() {
  const [amostras, setAmostras] = useState([
    { id: 1, link: 'https://exemplo.com/imovel1', valor: 450000, area: 85 }
  ]);

  const handleGerarPDF = () => {
    const dadosPrecificacao = {
      imovelCodigo: 'IMV-2026-001',
      endereco: 'Rua das Palmeiras, 1234',
      dataVisita: '01/03/2026',
      avarias: 'Pintura descascando na fachada, infiltração no banheiro.',
      manutencoes: 'Necessário: repintura externa, reparo de infiltração, revisão elétrica.',
      valorSugerido: 420000,
      valorMinimo: 380000,
      avaliacoesMercado: [
        {
          fornecedor: 'Avaliações XYZ',
          data: '15/02/2026',
          valorMercado: 450000,
          valorVendaForcada: 400000,
        },
      ],
      amostras: amostras.map(a => ({
        link: a.link,
        dataAcesso: '01/03/2026',
        valorMercado: a.valor,
        area: a.area,
        valorM2: Math.round(a.valor / a.area),
      })),
      responsavel: 'Maria Silva',
    };

    generatePrecificacaoPDF(dadosPrecificacao);
    toast.success('PDF gerado com sucesso!');
  };

  const adicionarAmostra = () => {
    setAmostras([...amostras, { 
      id: amostras.length + 1, 
      link: '', 
      valor: 0, 
      area: 0 
    }]);
  };

  const removerAmostra = (id: number) => {
    setAmostras(amostras.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-purple-50 border-b border-purple-100">
          <CardTitle className="text-purple-700">Vistoria do Imóvel</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data da Visita</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Responsável pela Vistoria</Label>
              <Input placeholder="Nome do responsável" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Avarias Identificadas</Label>
            <Textarea 
              placeholder="Descreva as avarias encontradas no imóvel" 
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Manutenções Necessárias</Label>
            <Textarea 
              placeholder="Liste as manutenções recomendadas" 
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-purple-50 border-b border-purple-100">
          <CardTitle className="text-purple-700">Precificação</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor Sugerido de Venda (R$)</Label>
              <Input type="number" placeholder="420.000,00" />
            </div>
            <div className="space-y-2">
              <Label>Valor Mínimo Aceitável (R$)</Label>
              <Input type="number" placeholder="380.000,00" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Amostras Comparativas (mínimo 5)</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={adicionarAmostra}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Amostra
              </Button>
            </div>

            {amostras.map((amostra, index) => (
              <div key={amostra.id} className="flex items-end gap-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs">Link/Referência</Label>
                  <Input 
                    placeholder="https://exemplo.com/imovel" 
                    value={amostra.link}
                    onChange={(e) => {
                      const newAmostras = [...amostras];
                      newAmostras[index].link = e.target.value;
                      setAmostras(newAmostras);
                    }}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label className="text-xs">Valor (R$)</Label>
                  <Input 
                    type="number" 
                    placeholder="450.000"
                    value={amostra.valor || ''}
                    onChange={(e) => {
                      const newAmostras = [...amostras];
                      newAmostras[index].valor = Number(e.target.value);
                      setAmostras(newAmostras);
                    }}
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label className="text-xs">Área (m²)</Label>
                  <Input 
                    type="number" 
                    placeholder="85"
                    value={amostra.area || ''}
                    onChange={(e) => {
                      const newAmostras = [...amostras];
                      newAmostras[index].area = Number(e.target.value);
                      setAmostras(newAmostras);
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removerAmostra(amostra.id)}
                  disabled={amostras.length <= 1}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}

            {amostras.length < 5 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Atenção: São necessárias no mínimo 5 amostras para gerar o laudo de precificação.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Laudo de Precificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Laudo PDF</p>
              <p className="text-sm text-gray-600 mt-1">
                Gera um documento PDF com vistoria, avaliações e amostras comparativas
              </p>
            </div>
            <Button 
              onClick={handleGerarPDF}
              disabled={amostras.length < 5}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
