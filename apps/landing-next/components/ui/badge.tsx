import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider',
  {
    variants: {
      variant: {
        primary: 'bg-primary/5 text-primary border border-primary/10',
        success: 'bg-success-500/10 text-success-500 border border-success-500/20',
        amber: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
        muted: 'bg-slate-100 text-slate-500',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
