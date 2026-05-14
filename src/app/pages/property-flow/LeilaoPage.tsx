import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { imovelService, enderecoLabel, type ImovelAPI } from '../../../services/imovelService';

export default function LeilaoPage() {
  const { id } = useParams();
  const [imovel, setImovel] = useState<ImovelAPI | null>(null);
  const [vendidoLeilao, setVendidoLeilao] = useState(false);

  useEffect(() => {
    if (id) imovelService.getById(id).then(setImovel).catch(console.error);
  }, [id]);

  if (!imovel) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} /></div>;
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
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Leilão — {imovel.tipoImovel}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{enderecoLabel(imovel)}</p>
      </div>

      {/* Seção: Leilões Obrigatórios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Leilões Obrigatórios</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Novo Leilão
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {([] as never[]).map((leilao: never) => (
            <Card key={leilao.id} className={leilao.status === 'vendido' ? 'border-green-500 border-2' : ''}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna 1 */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-700">Número do Leilão</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className="text-lg bg-blue-100 text-blue-800">
                          {leilao.numero}º Leilão
                        </Badge>
                        <Badge className={
                          leilao.status === 'vendido' 
                            ? 'bg-green-100 text-green-800'
                            : leilao.status === 'deserto'
                              ? 'bg-red-100 text-red-800'
                              : leilao.status === 'realizado'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }>
                          {leilao.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`leiloeiro-${leilao.id}`}>Leiloeiro</Label>
                      <Input 
                        id={`leiloeiro-${leilao.id}`}
                        defaultValue={leilao.leiloeiro}
                        placeholder="Nome do leiloeiro oficial"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`data-${leilao.id}`}>Data do Leilão</Label>
                      <Input 
                        id={`data-${leilao.id}`}
                        type="date"
                        defaultValue={format(leilao.data, 'yyyy-MM-dd')}
                      />
                    </div>
                  </div>

                  {/* Coluna 2 */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`avaliacao-${leilao.id}`}>Valor de Avaliação</Label>
                      <Input 
                        id={`avaliacao-${leilao.id}`}
                        type="number"
                        defaultValue={leilao.valorAvaliacao}
                        placeholder="0,00"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`minimo-${leilao.id}`}>Valor Mínimo</Label>
                      <Input 
                        id={`minimo-${leilao.id}`}
                        type="number"
                        defaultValue={leilao.valorMinimo}
                        placeholder="0,00"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {((leilao.valorMinimo / leilao.valorAvaliacao) * 100).toFixed(0)}% do valor de avaliação
                      </p>
                    </div>

                    {leilao.valorVenda && (
                      <div>
                        <Label>Valor de Venda</Label>
                        <div className="mt-1">
                          <p className="text-2xl font-bold text-green-600">
                            R$ {leilao.valorVenda.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documentos do Leilão */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Documentos do Leilão</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Edital de Leilão
                      <Upload className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Ata do Leilão
                      <Upload className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Comprovante de Publicação
                      <Upload className="h-3 w-3 ml-auto" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Opção: Vendido em Leilão */}
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Imóvel vendido em leilão?
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Marcar esta opção irá pular as etapas de negociação e manutenção, indo direto para o processo de venda.
                  </p>
                </div>
                <Button 
                  onClick={() => setVendidoLeilao(!vendidoLeilao)}
                  variant={vendidoLeilao ? 'default' : 'outline'}
                  className={vendidoLeilao ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {vendidoLeilao ? 'Vendido em Leilão ✓' : 'Marcar como Vendido'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Seção: Finalizar Leilões Obrigatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Finalizar Etapa de Leilões Obrigatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataQuitacao">Data de Quitação</Label>
              <Input id="dataQuitacao" type="date" />
            </div>
            <div>
              <Label htmlFor="valorQuitacao">Valor de Quitação</Label>
              <Input id="valorQuitacao" type="number" placeholder="0,00" />
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea 
              id="observacoes"
              placeholder="Adicione observações sobre o processo de leilão..."
              rows={3}
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Anexos Obrigatórios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3">
                <div className="flex items-center gap-3 w-full">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">Extratos Bancários (Antes)</p>
                    <p className="text-xs text-gray-500">Comprovante anterior ao leilão</p>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3">
                <div className="flex items-center gap-3 w-full">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">Extratos Bancários (Depois)</p>
                    <p className="text-xs text-gray-500">Comprovante posterior ao leilão</p>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3">
                <div className="flex items-center gap-3 w-full">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">Termo de Arrematação</p>
                    <p className="text-xs text-gray-500">Se aplicável</p>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3">
                <div className="flex items-center gap-3 w-full">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">Termo de Não Comparecimento</p>
                    <p className="text-xs text-gray-500">Se leilão deserto</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Finalizar Leilões Obrigatórios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção: Averbação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Averbação de Leilão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Etapa de Averbação</p>
              <p className="text-sm text-blue-700 mt-1">
                Após finalizar os leilões obrigatórios, é necessário averbar o resultado na matrícula do imóvel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataAverbacao">Data da Averbação</Label>
              <Input id="dataAverbacao" type="date" />
            </div>
            <div>
              <Label htmlFor="numeroAverbacao">Número da Averbação</Label>
              <Input id="numeroAverbacao" placeholder="Ex: AV-123456" />
            </div>
          </div>

          <div>
            <Label htmlFor="observacoesAverbacao">Observações</Label>
            <Textarea 
              id="observacoesAverbacao"
              placeholder="Observações sobre a averbação..."
              rows={2}
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Matrícula Atualizada (Obrigatório)</h4>
            <Button variant="outline" className="w-full justify-start h-auto py-4">
              <div className="flex items-center gap-3 w-full">
                <Upload className="h-5 w-5 text-gray-400" />
                <div className="text-left flex-1">
                  <p className="font-medium">Upload da Matrícula Atualizada</p>
                  <p className="text-sm text-gray-500">Com averbação do resultado do leilão</p>
                </div>
              </div>
            </Button>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Concluir Averbação
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção: Atribuir Imóvel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atribuir Responsável</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="responsavel">Atribuir imóvel para usuário</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maria">Maria Silva</SelectItem>
                <SelectItem value="joao">João Santos</SelectItem>
                <SelectItem value="carlos">Carlos Oliveira</SelectItem>
                <SelectItem value="ana">Ana Costa</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-2">
              Apenas usuários do perfil Gestão de Bens podem ser atribuídos
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="outline">
              Atribuir Responsável
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}