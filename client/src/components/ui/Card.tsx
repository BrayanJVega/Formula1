import { clsx } from 'clsx';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-f1-gray rounded-xl p-6 border border-f1-gray-light/20',
        hover && 'card-hover',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
