import { mockProperties } from '../../data/property-flow-updated';
import { Link, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Trash2, ExternalLink, FileText, Send, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Amostra {
  id: string;
  link: string;
  valor: number;
  area: number;
  data: Date;
  observacoes: string;
}

export default function ManutencaoPrecificacaoPage() {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === id);
  
  const [amostras, setAmostras] = useState<Amostra[]>([
    {
      id: '1',
      link: 'https://exemplo.com/imovel1',
      valor: 460000,
      area: 88,
      data: new Date('2026-02-20'),
      observacoes: 'Mesmo bairro, acabamento similar',
    },
    {
      id: '2',
      link: 'https://exemplo.com/imovel2',
      valor: 440000,
      area: 82,
      data: new Date('2026-02-18'),
      observacoes: 'Prédio mais antigo',
    },
    {
      id: '3',
      link: 'https://exemplo.com/imovel3',
      valor: 475000,
      area: 90,
      data: new Date('2026-02-15'),
      observacoes: 'Com vaga coberta',
    },
  ]);

  const [statusAprovacao, setStatusAprovacao] = useState<'em-analise' | 'aprovado' | 'reprovado'>('em-analise');

  const mediaValor = amostras.length > 0 
    ? amostras.reduce((sum, a) => sum + a.valor, 0) / amostras.length 
    : 0;

  const mediaValorM2 = amostras.length > 0
    ? amostras.reduce((sum, a) => sum + (a.valor / a.area), 0) / amostras.length
    : 0;

  if (!property) {
    return <p className="text-center text-gray-500">Imóvel não encontrado</p>;
  }

  const valorSugeridoM2 = property.area * mediaValorM2;

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
        <h1 className="text-2xl font-semibold text-gray-900">Manutenção e Precificação - {property.codigo}</h1>
        <p className="text-sm text-gray-600 mt-1">{property.endereco}</p>
      </div>

      {/* Status da Aprovação */}
      <Card className={
        statusAprovacao === 'aprovado' 
          ? 'border-green-500 border-2 bg-green-50'
          : statusAprovacao === 'reprovado'
            ? 'border-red-500 border-2 bg-red-50'
            : 'border-yellow-500 border-2 bg-yellow-50'
      }>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {statusAprovacao === 'aprovado' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <FileText className="h-6 w-6 text-yellow-600" />
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {statusAprovacao === 'aprovado' 
                    ? 'Precificação Aprovada'
                    : statusAprovacao === 'reprovado'
                      ? 'Precificação Reprovada'
                      : 'Aguardando Aprovação'
                  }
                </p>
                <p className="text-sm text-gray-600">
                  {statusAprovacao === 'em-analise' && 'Envie para aprovação após concluir a análise'}
                </p>
              </div>
            </div>
            <Badge className={
              statusAprovacao === 'aprovado'
                ? 'bg-green-100 text-green-800'
                : statusAprovacao === 'reprovado'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }>
              {statusAprovacao}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Amostras de Mercado */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Amostras de Mercado</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Mínimo de 5 amostras necessárias</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Amostra
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progresso */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso</span>
              <span className="text-sm font-semibold text-gray-900">{amostras.length}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${amostras.length >= 5 ? 'bg-green-600' : 'bg-blue-600'}`}
                style={{ width: `${Math.min((amostras.length / 5) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Lista de Amostras */}
          <div className="space-y-3">
            {amostras.map((amostra, index) => (
              <Card key={amostra.id} className="border-2">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-xs text-gray-600">Link do Anúncio</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input 
                            defaultValue={amostra.link}
                            placeholder="https://..."
                            className="text-sm"
                          />
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600">Valor</Label>
                        <Input 
                          type="number"
                          defaultValue={amostra.valor}
                          placeholder="0,00"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600">Área (m²)</Label>
                        <Input 
                          type="number"
                          defaultValue={amostra.area}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600">R$/m²</Label>
                        <div className="mt-1 px-3 py-2 bg-gray-100 rounded-md">
                          <span className="font-semibold text-gray-900">
                            {(amostra.valor / amostra.area).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-4">
                        <Label className="text-xs text-gray-600">Observações</Label>
                        <Textarea 
                          defaultValue={amostra.observacoes}
                          placeholder="Características e comparações..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="h-3 w-3 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {amostras.length < 5 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-sm text-yellow-800">
                Adicione mais {5 - amostras.length} amostra(s) para completar a análise
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Análise e Precificação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análise e Valor Sugerido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">Média de Valor</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                R$ {mediaValor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">Média de Valor/m²</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                R$ {mediaValorM2.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Valor Sugerido</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                R$ {valorSugeridoM2.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Baseado em {property.area}m²
              </p>
            </div>
          </div>

          {/* Valor Final */}
          <div>
            <Label htmlFor="valorFinal">Valor Final de Comercialização</Label>
            <Input 
              id="valorFinal"
              type="number"
              defaultValue={valorSugeridoM2}
              placeholder="0,00"
              className="text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ajuste o valor conforme necessário baseado na análise
            </p>
          </div>

          {/* Justificativa */}
          <div>
            <Label htmlFor="justificativa">Justificativa da Precificação</Label>
            <Textarea 
              id="justificativa"
              placeholder="Explique os critérios utilizados para definir o valor..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" disabled={amostras.length < 5}>
              <FileText className="h-4 w-4 mr-2" />
              Gerar PDF de Precificação
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={amostras.length < 5}
              onClick={() => setStatusAprovacao('em-analise')}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar para Aprovação
            </Button>
          </div>
          {amostras.length < 5 && (
            <p className="text-sm text-gray-500 text-right mt-2">
              Complete as 5 amostras para enviar para aprovação
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}