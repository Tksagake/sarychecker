import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SectionHeader } from './section-header';

interface PaymentStepProps {
  onNext: () => void;
  onPrevious: () => void;
  updateFormData: (field: string, value: any, section: string) => void;
}

export function PaymentStep({ onNext, onPrevious, updateFormData }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!phoneNumber || !transactionCode) {
      alert('Please enter both the phone number and transaction code.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      updateFormData('paymentInfo', { phoneNumber, transactionCode }, 'paymentInfo');
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

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Mpesa Paybill: <strong>918059</strong></p>
            <p className="text-sm font-medium">Account: <strong>ID Number</strong></p>
            <p className="text-sm font-medium">Amount (KES): <strong>1,650.00</strong></p>
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number Used for Payment</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Transaction Code</label>
            <input
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter transaction code"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-6">
        <Button onClick={onPrevious} disabled={isProcessing}>
          Previous
        </Button>
        <Button onClick={handlePayment} isLoading={isProcessing}>
          Proceed to Review
        </Button>
      </CardFooter>
    </Card>
  );
}
