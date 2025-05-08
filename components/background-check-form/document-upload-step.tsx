'use client';

import { useState } from 'react';
import { DocumentInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SectionHeader } from './section-header';
import { FileUploader } from './file-uploader';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadStepProps {
  formData: DocumentInfo;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function DocumentUploadStep({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrevious 
}: DocumentUploadStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFilesChange = (fieldName: string, files: File[] | null) => {
    updateFormData(fieldName, files);
  };
  
  const handleNext = () => {
    // Check if all required documents are uploaded
    if (!formData.goodConduct || 
        !formData.driversLicense || 
        !formData.logBook || 
        !formData.insurance) {
      toast({
        variant: "destructive",
        title: "Missing documents",
        description: "Please upload all required documents to continue.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate uploading files to server/storage
    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 1000);
  };
  
  return (
    <Card className="mt-6 border-0 shadow-md">
      <CardContent className="pt-6">
        <SectionHeader
          title="Document Upload"
          description="Please upload the required documents for background verification. Accepted formats: PDF, JPG, PNG (Max 5MB per file)."
        />
        
        <div className="space-y-6">
          <FileUploader
            label="Good Conduct Certificate/Receipt"
            description="Upload your certificate of good conduct or payment receipt"
            files={formData.goodConduct}
            onChange={(files) => handleFilesChange('goodConduct', files)}
          />
          
          <FileUploader
            label="Driver's License"
            description="Upload your driver's license (front and back)"
            files={formData.driversLicense}
            onChange={(files) => handleFilesChange('driversLicense', files)}
          />
          
          <FileUploader
            label="Log Book"
            description="Upload your vehicle log book"
            files={formData.logBook}
            onChange={(files) => handleFilesChange('logBook', files)}
          />
          
          <FileUploader
            label="Insurance"
            description="Upload your valid insurance certificate"
            files={formData.insurance}
            onChange={(files) => handleFilesChange('insurance', files)}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isLoading}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Continue to Consent
        </Button>
      </CardFooter>
    </Card>
  );
}