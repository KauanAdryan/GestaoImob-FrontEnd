import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { SLAStatus } from '../../types/property-flow';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SLABadgeProps {
  status: SLAStatus;
  data: Date;
  showIcon?: boolean;
  showDays?: boolean;
}

export function SLABadge({ status, data, showIcon = true, showDays = true }: SLABadgeProps) {
  const configs = {
    'no-prazo': {
      className: 'bg-[var(--ailos-verde-50)] text-[var(--ailos-verde-600)] border border-[var(--ailos-verde-100)]',
      icon: Clock,
      label: 'No Prazo'
    },
    'proximo-vencimento': {
      className: 'bg-[var(--ailos-amarelo-50)] text-[var(--ailos-amarelo-700)] border border-[var(--ailos-amarelo-100)]',
      icon: AlertTriangle,
      label: 'Próximo do Vencimento'
    },
    'vencido': {
      className: 'bg-[var(--ailos-vermelho-50)] text-[var(--ailos-vermelho-600)] border border-[var(--ailos-vermelho-100)]',
      icon: AlertCircle,
      label: 'Vencido'
    }
  };

  const config = configs[status];
  const Icon = config.icon;
  const diasRestantes = Math.ceil((data.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Badge className={`${config.className} gap-1.5 px-3 py-1`}>
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      <span className="text-xs font-medium">
        {config.label}
        {showDays && ` (${Math.abs(diasRestantes)}d)`}
      </span>
    </Badge>
  );
}