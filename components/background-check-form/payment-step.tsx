'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SectionHeader } from './section-header';

const paymentSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number is required' }),
  transactionCode: z.string().min(5, { message: 'Transaction code is required' }),
});

interface PaymentStepProps {
  onNext: () => void;
  onPrevious: () => void;
  updateFormData: (field: string, value: any, section: string) => void;
}

export function PaymentStep({ onNext, onPrevious, updateFormData }: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      phoneNumber: '',
      transactionCode: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    setIsProcessing(true);
    setTimeout(() => {
      updateFormData('paymentInfo', values, 'paymentInfo');
      setIsProcessing(false);
      onNext();
    }, 2000);
  };

  return (
    <Card className="mt-6 border-0 shadow-md">
      <CardContent className="pt-6">
        <SectionHeader
          title="Payment Information"
          description="Please complete your payment using the details below and provide the required information."
        />

        <div className="mb-6 space-y-1 text-sm font-medium">
          <p>Mpesa Paybill: <strong>918059</strong></p>
          <p>Account: <strong>ID Number</strong></p>
          <p>Amount (KES): <strong>1,650.00</strong></p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number Used for Payment</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 0712345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. QWERTY1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="button" onClick={onPrevious} disabled={isProcessing}>
                Previous
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Proceed to Review'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
