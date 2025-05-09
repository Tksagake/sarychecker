'use client';

import { cn } from '@/lib/utils';
import { CheckIcon, UserIcon, FileIcon, ShieldIcon, FileCheckIcon, DollarSignIcon } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
}

export function FormProgress({ currentStep }: FormProgressProps) {
  const steps = [
    { id: 1, name: 'Personal Information', icon: UserIcon },
    { id: 2, name: 'Documents', icon: FileIcon },
    { id: 3, name: 'Payment', icon: DollarSignIcon },
    { id: 4, name: 'Consent', icon: ShieldIcon },
    { id: 5, name: 'Review', icon: FileCheckIcon },
  ];

  return (
    <div className="py-4 sm:py-8">
      <nav aria-label="Progress">
        <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={cn(
                  'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
                  currentStep > step.id
                    ? 'border-primary'
                    : currentStep === step.id
                    ? 'border-primary'
                    : 'border-muted-foreground/30'
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-center text-sm font-medium',
                    currentStep > step.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : currentStep === step.id
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <span
                  className={cn(
                    'mt-2 text-sm font-medium',
                    currentStep > step.id
                      ? 'text-primary'
                      : currentStep === step.id
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}