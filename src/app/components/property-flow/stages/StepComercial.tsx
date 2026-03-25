import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Briefcase } from 'lucide-react';

export function StepComercial() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-[var(--ailos-azul-50)] border-b border-[var(--ailos-azul-100)]">
          <CardTitle className="flex items-center gap-2 text-[var(--ailos-azul-700)]">
            <Briefcase className="h-5 w-5" />
            Gestão Comercial e Propostas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-500">
            Módulo de gestão comercial e propostas em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
