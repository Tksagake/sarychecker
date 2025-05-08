'use client';

import { useState } from 'react';
import { FormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SectionHeader } from './section-header';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ReviewStepProps {
  formData: FormData;
  onSubmit: () => void;
  onPrevious: () => void;
}

export function ReviewStep({ formData, onSubmit, onPrevious }: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    onSubmit();
  };
  
  // Format the consent date if it exists
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };
  
  return (
    <Card className="mt-6 border-0 shadow-md">
      <CardContent className="pt-6">
        <SectionHeader
          title="Review Your Application"
          description="Please review your application details before final submission."
        />
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">First Name</p>
                <p className="font-medium">{formData.personalInfo.firstName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Second Name</p>
                <p className="font-medium">{formData.personalInfo.secondName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Phone Number</p>
                <p className="font-medium">{formData.personalInfo.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{formData.personalInfo.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">ID Number</p>
                <p className="font-medium">{formData.personalInfo.idNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Country</p>
                <p className="font-medium">{formData.personalInfo.country}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">County/State</p>
                <p className="font-medium">{formData.personalInfo.county}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-muted-foreground">Physical Address</p>
                <p className="font-medium">{formData.personalInfo.physicalAddress}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Good Conduct Certificate/Receipt</p>
                <p className="font-medium">
                  {formData.documentInfo.goodConduct ? 
                    `${formData.documentInfo.goodConduct.length} file(s) uploaded` : 
                    'No files uploaded'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Driver's License</p>
                <p className="font-medium">
                  {formData.documentInfo.driversLicense ? 
                    `${formData.documentInfo.driversLicense.length} file(s) uploaded` : 
                    'No files uploaded'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Log Book</p>
                <p className="font-medium">
                  {formData.documentInfo.logBook ? 
                    `${formData.documentInfo.logBook.length} file(s) uploaded` : 
                    'No files uploaded'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Insurance</p>
                <p className="font-medium">
                  {formData.documentInfo.insurance ? 
                    `${formData.documentInfo.insurance.length} file(s) uploaded` : 
                    'No files uploaded'}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2">Consent Information</h3>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">Consent Status</p>
              <p className="font-medium">
                {formData.consentInfo.consentGiven ? 'Consent Given' : 'Consent Not Given'}
              </p>
              
              {formData.consentInfo.consentDate && (
                <>
                  <p className="text-muted-foreground mt-2">Consent Date and Time</p>
                  <p className="font-medium">{formatDate(formData.consentInfo.consentDate)}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Previous
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isSubmitting}>Submit Application</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit your application? Once submitted, you will not be able to make changes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}