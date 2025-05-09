'use client';

import { ConsentInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SectionHeader } from './section-header';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ConsentStepProps {
  formData: ConsentInfo;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ConsentStep({
  formData,
  updateFormData,
  onNext,
  onPrevious
}: ConsentStepProps) {
  const { toast } = useToast();

  const handleConsentChange = (checked: boolean) => {
    const now = new Date();
    updateFormData('consentGiven', checked);
    if (checked) {
      updateFormData('consentDate', now);
    } else {
      updateFormData('consentDate', undefined);
    }
  };

  const handleNext = () => {
    if (!formData.consentGiven) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "You must provide consent to proceed with the background check.",
      });
      return;
    }

    onNext();
  };

  return (
    <Card className="mt-6 border-0 shadow-md">
      <CardContent className="pt-6">
        <SectionHeader
          title="Consent for Background Check"
          description="Please review and provide your consent for the background verification process."
        />

        <div className="space-y-6">
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="text-lg font-medium mb-4">Privacy Policy and Terms</h3>
            <div className="space-y-4 text-sm">
              <p>
                Sary Network International is committed to protecting your privacy and ensuring
                the security of your personal information. The information collected will be used
                solely for the purpose of conducting a background verification check.
              </p>
              <p>
                By providing consent, you authorize Sary Network International to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Verify your employment history, educational qualifications, and credentials.</li>
                <li>Check criminal records and other public records relevant to the background check.</li>
                <li>Contact references and previous employers to confirm details provided.</li>
                <li>Share your personal data with third-party verification agencies when necessary.</li>
                <li>Store your information securely in accordance with data protection regulations.</li>
              </ul>
              <p>
                Your information will be retained for the period necessary to complete the background
                check and as required by applicable laws and regulations.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-4">
            <Checkbox
              id="consent"
              checked={formData.consentGiven}
              onCheckedChange={handleConsentChange}
              className="mt-1"
            />
            <div className="space-y-1 leading-none">
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Consent Agreement
              </label>
              <p className="text-sm text-muted-foreground">
                I, the undersigned, hereby authorize Sary Network International to obtain a
                background screening report on me in order to verify my provided details for
                the purpose of my application/employment. I confirm that I have read and understood
                the Company's Data Privacy and Privacy Policy. I give my consent to share my personal
                data with third-party entities for background verification purposes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-6">
        <Button
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
