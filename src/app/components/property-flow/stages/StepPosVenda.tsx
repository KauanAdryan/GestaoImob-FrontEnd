import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { CheckCircle2 } from 'lucide-react';

export function StepPosVenda() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-[var(--ailos-verde-50)] border-b border-[var(--ailos-verde-100)]">
          <CardTitle className="flex items-center gap-2 text-[var(--ailos-verde-700)]">
            <CheckCircle2 className="h-5 w-5" />
            Pós-Venda
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-500">
            Módulo de acompanhamento pós-venda e parcelamento em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
