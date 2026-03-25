import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Handshake } from 'lucide-react';

interface StepNegociacaoProps {
  type: 'amigavel' | 'nao-amigavel';
}

export function StepNegociacao({ type }: StepNegociacaoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-[var(--ailos-verde-50)] border-b border-[var(--ailos-verde-100)]">
          <CardTitle className="flex items-center gap-2 text-[var(--ailos-verde-700)]">
            <Handshake className="h-5 w-5" />
            {type === 'amigavel' ? 'Negociação Amigável' : 'Negociação Não Amigável'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-500">
            Módulo de negociação {type === 'amigavel' ? 'amigável' : 'não amigável'} em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
