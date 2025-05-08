'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircleIcon } from 'lucide-react';

export function SuccessStep() {
  return (
    <Card className="mt-6 border-0 shadow-md">
      <CardContent className="pt-6 flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <CheckCircleIcon className="h-10 w-10 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Thank you for submitting your background check application. Our team will review your 
          information and begin the verification process. You will receive updates via email.
        </p>
        
        <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto text-sm">
          <p className="font-medium mb-2">What happens next?</p>
          <ol className="list-decimal pl-5 text-left space-y-1">
            <li>Our team will review your submitted information and documents.</li>
            <li>Background verification will begin within 1-2 business days.</li>
            <li>You may be contacted if additional information is required.</li>
            <li>You will receive email notifications about the status of your verification.</li>
          </ol>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center pt-0 pb-8">
        <Link href="/" passHref>
          <Button>Return to Home</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}