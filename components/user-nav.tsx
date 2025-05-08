'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function UserNav() {
  const [hasApplication, setHasApplication] = useState(false);
  
  // In a real implementation, this would check if the user has a saved application
  useEffect(() => {
    const savedFormData = localStorage.getItem('saaryFormData');
    if (savedFormData) {
      setHasApplication(true);
    }
  }, []);
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={cn(
        "relative h-8 w-8 rounded-full",
        hasApplication && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <UserIcon className="h-4 w-4" />
      {hasApplication && (
        <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary" />
      )}
    </Button>
  );
}