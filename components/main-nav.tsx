import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MainNavItem } from '@/types';

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
  className?: string;
}

export function MainNav({ items, children, className }: MainNavProps) {
  return (
    <div className={cn('flex gap-6 md:gap-10', className)}>
      <Link
        href="/"
        className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
      >
        <span>Home</span>
      </Link>
      {items?.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            'flex items-center text-sm font-medium transition-colors hover:text-primary',
            item.disabled && 'cursor-not-allowed opacity-60'
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}