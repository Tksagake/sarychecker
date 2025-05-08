'use client';

import { useState, useEffect } from 'react';
import { FormData } from '@/types';
import { FormProgress } from './form-progress';
import { PersonalInfoStep } from './personal-info-step';
import { DocumentUploadStep } from './document-upload-step';
import { ConsentStep } from './consent-step';
import { ReviewStep } from './review-step';
import { SuccessStep } from './success-step';
import { useToast } from '@/hooks/use-toast';
import { useSaveFormProgress } from '@/hooks/use-save-form-progress';
import { insertFormData } from '@/lib/supabase';

const initialFormData: FormData = {
  personalInfo: {
    firstName: '',
    secondName: '',
    phone: '',
    email: '',
    idNumber: '',
    country: '',
    county: '',
    physicalAddress: '',
  },
  documentInfo: {
    goodConduct: null,
    driversLicense: null,
    logBook: null,
    insurance: null,
  },
  consentInfo: {
    consentGiven: false,
  },
  formProgress: 0,
};

export function FormContainer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();
  const { saveProgress, loadProgress } = useSaveFormProgress();

  // Load saved progress on initial render
  useEffect(() => {
    const savedData = loadProgress();
    if (savedData) {
      setFormData(savedData);
      // Set the step based on the saved progress
      if (savedData.formProgress) {
        setStep(savedData.formProgress);
      }
      toast({
        title: "Progress Restored",
        description: "Your previously saved form data has been restored.",
      });
    }
  }, [loadProgress, toast]);

  // Save progress whenever form data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProgress({ ...formData, formProgress: step });
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, step, saveProgress]);

  const updateFormData = (fieldName: string, value: any, section: keyof FormData) => {
    setFormData((prev) => {
      const sectionData = prev[section] || {};
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [fieldName]: value,
        },
      };
    });
  };

  const goToNextStep = () => {
    if (step < 5) {
      setStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      // Insert form data into Supabase
      await insertFormData('form_data', formData);

      // Move to success step
      goToNextStep();

      // Clear local storage after successful submission
      localStorage.removeItem('saaryFormData');

      toast({
        title: "Form Submitted Successfully",
        description: "Your application has been submitted for background verification.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <FormProgress currentStep={step} />
      
      {step === 1 && (
        <PersonalInfoStep 
          formData={formData.personalInfo} 
          updateFormData={(field, value) => updateFormData(field, value, 'personalInfo')}
          onNext={goToNextStep}
        />
      )}
      
      {step === 2 && (
        <DocumentUploadStep 
          formData={formData.documentInfo}
          updateFormData={(field, value) => updateFormData(field, value, 'documentInfo')}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
        />
      )}
      
      {step === 3 && (
        <ConsentStep 
          formData={formData.consentInfo}
          updateFormData={(field, value) => updateFormData(field, value, 'consentInfo')}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
        />
      )}
      
      {step === 4 && (
        <ReviewStep 
          formData={formData}
          onSubmit={handleSubmit}
          onPrevious={goToPreviousStep}
        />
      )}
      
      {step === 5 && (
        <SuccessStep />
      )}
    </div>
  );
}