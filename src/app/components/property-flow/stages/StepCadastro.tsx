import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { DocumentChecklist } from '../DocumentChecklist';
import { Building2 } from 'lucide-react';

export function StepCadastro() {
  const documentosObrigatorios = [
    'Avaliação concessão',
    'Avaliação consolidação/dação',
    'Matrícula',
    'Contrato',
    'Guia ITBI paga',
    'Certidão de Decurso',
    'CND Municipal',
    'Comprovante de recebimento',
    'Foto inicial / foto de registro'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-[var(--ailos-azul-50)] border-b border-[var(--ailos-azul-100)]">
          <CardTitle className="flex items-center gap-2 text-[var(--ailos-azul-700)]">
            <Building2 className="h-5 w-5" />
            Dados Cadastrais do Imóvel
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input id="matricula" placeholder="Número da matrícula" className="border border-gray-300 focus-visible:border-[#165c7d] focus-visible:ring-[#165c7d]/20" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Imóvel</Label>
              <Select>
                <SelectTrigger className="border border-gray-300 focus:border-[#165c7d] focus:ring-[#165c7d]/20">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input id="endereco" placeholder="Rua, número, complemento" className="border border-gray-300 focus-visible:border-[#165c7d] focus-visible:ring-[#165c7d]/20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" placeholder="Cidade" className="border border-gray-300 focus-visible:border-[#165c7d] focus-visible:ring-[#165c7d]/20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select>
                <SelectTrigger className="border border-gray-300 focus:border-[#165c7d] focus:ring-[#165c7d]/20">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input id="area" type="number" placeholder="Área total" className="border border-gray-300 focus-visible:border-[#165c7d] focus-visible:ring-[#165c7d]/20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor de Avaliação (R$)</Label>
              <Input id="valor" type="number" placeholder="Valor estimado" className="border border-gray-300 focus-visible:border-[#165c7d] focus-visible:ring-[#165c7d]/20" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" placeholder="Observações gerais sobre o imóvel" rows={4} className="border border-gray-300 focus-visible:border-[#165c7d] focus-visible:ring-[#165c7d]/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Obrigatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentChecklist 
            items={documentosObrigatorios.map((doc, idx) => ({
              id: `doc-${idx}`,
              label: doc,
              obrigatorio: true,
              concluido: false,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}