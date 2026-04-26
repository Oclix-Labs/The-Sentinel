import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-mono font-medium uppercase tracking-caps',
  {
    variants: {
      variant: {
        live: 'bg-primary text-on-primary',
        section: 'bg-surface-alt text-ink-secondary',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        muted: 'bg-slate-100 text-ink-secondary',
      },
    },
    defaultVariants: { variant: 'section' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
