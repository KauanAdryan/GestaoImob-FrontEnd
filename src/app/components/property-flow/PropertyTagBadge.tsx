import { Badge } from '../ui/badge';
import { Scale, FileWarning, CreditCard, Home } from 'lucide-react';
import { PropertyTag } from '../../types/property-flow';

interface PropertyTagBadgeProps {
  tag: PropertyTag;
  showIcon?: boolean;
}

export function PropertyTagBadge({ tag, showIcon = true }: PropertyTagBadgeProps) {
  const config = {
    liminar: {
      className: 'bg-[var(--ailos-turquesa-50)] text-[var(--ailos-turquesa-600)] border border-[var(--ailos-turquesa-100)]',
      icon: Scale,
    },
    'pendencia-fiscal': {
      className: 'bg-[var(--ailos-azul-claro-50)] text-[var(--ailos-azul-claro-600)] border border-[var(--ailos-azul-claro-100)]',
      icon: FileWarning,
    },
    'venda-parcelada': {
      className: 'bg-[var(--ailos-verde-50)] text-[var(--ailos-verde-600)] border border-[var(--ailos-verde-100)]',
      icon: CreditCard,
    },
    'desocupacao': {
      className: 'bg-[var(--ailos-amarelo-50)] text-[var(--ailos-amarelo-700)] border border-[var(--ailos-amarelo-100)]',
      icon: Home,
    },
  };

  const { className, icon: Icon } = config[tag.tipo];

  return (
    <Badge className={`${className} gap-1.5 px-2.5 py-0.5`}>
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      <span className="text-xs font-medium">{tag.label}</span>
    </Badge>
  );
}