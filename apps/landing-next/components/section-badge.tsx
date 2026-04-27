import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SectionBadge({
  children,
  className,
  variant = 'section',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'section' | 'live';
}) {
  return (
    <Badge variant={variant} className={cn('mb-3', className)}>
      {children}
    </Badge>
  );
}
