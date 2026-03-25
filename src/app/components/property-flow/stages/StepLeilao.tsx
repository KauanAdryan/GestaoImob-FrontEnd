import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Gavel } from 'lucide-react';

export function StepLeilao() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-[var(--ailos-laranja-50)] border-b border-[var(--ailos-laranja-100)]">
          <CardTitle className="flex items-center gap-2 text-[var(--ailos-laranja-700)]">
            <Gavel className="h-5 w-5" />
            Leilões Obrigatórios
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Informação</p>
              <p className="text-sm text-blue-700 mt-1">
                São obrigatórios 2 leilões conforme legislação vigente. Após os leilões obrigatórios, 
                o imóvel segue para averbação na matrícula.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">1º Leilão</h3>
                  <Badge className="bg-green-100 text-green-800">Realizado</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Leiloeiro</Label>
                  <Input defaultValue="João Leiloeiro Ltda" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Data do Leilão</Label>
                  <Input type="date" defaultValue="2026-02-15" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Resultado</Label>
                  <Input defaultValue="Deserto" disabled />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">2º Leilão</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">Agendado</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Leiloeiro</Label>
                  <Input placeholder="Nome do leiloeiro" />
                </div>
                <div className="space-y-2">
                  <Label>Data Prevista</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Valor Mínimo (R$)</Label>
                  <Input type="number" placeholder="Valor mínimo para lance" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea placeholder="Observações sobre os leilões" rows={4} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Necessários</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              'Notificação de leilão',
              'Termo quitação dívida',
              'Aviso desocupação / imissão na posse',
              'Requerimento averbação leilão na matrícula',
              'Edital leilões',
              'Imagens publicações/notificações'
            ].map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">{doc}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
