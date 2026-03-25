import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { DollarSign } from 'lucide-react';

export function StepVenda() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-green-50 border-b border-green-100">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <DollarSign className="h-5 w-5" />
            Formalização da Venda
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-500">
            Módulo de formalização de venda e checklist de entrega em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
