import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Scale } from 'lucide-react';

export function StepJuridico() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-red-50 border-b border-red-100">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Scale className="h-5 w-5" />
            Acompanhamento Jurídico
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-500">
            Módulo de acompanhamento jurídico e processos em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
