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
import { insertFormData, supabase } from '@/lib/supabase';

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
    consentDate: undefined,
  },
  formProgress: 0,
};

export function FormContainer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();
  const { saveProgress, loadProgress } = useSaveFormProgress();

  useEffect(() => {
    const savedData = loadProgress();
    if (savedData) {
      setFormData(savedData);
      if (savedData.formProgress) {
        setStep(savedData.formProgress);
      }
      toast({
        title: "Progress Restored",
        description: "Your previously saved form data has been restored.",
      });
    }
  }, [loadProgress, toast]);

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
      if (!formData.personalInfo || !formData.documentInfo || !formData.consentInfo) {
        throw new Error('Invalid form data structure');
      }

      const documentMetadata = Object.entries(formData.documentInfo).flatMap(([type, files]) => {
        if (!files) return [];
        return (files as File[]).map((file) => ({
          type,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: `submissions/${file.name}`,
          file,
        }));
      });

      for (const doc of documentMetadata) {
        const { error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(doc.storage_path, doc.file, {
            cacheControl: '3600',
            upsert: true,
          });
        if (uploadError) {
          console.error(`Failed to upload file: ${doc.file_name}`, uploadError);
          throw new Error(`Failed to upload file: ${doc.file_name}`);
        }
      }

      const submissionData = {
        first_name: formData.personalInfo.firstName,
        second_name: formData.personalInfo.secondName,
        phone: formData.personalInfo.phone,
        email: formData.personalInfo.email,
        id_number: formData.personalInfo.idNumber,
        country: formData.personalInfo.country,
        county: formData.personalInfo.county,
        physical_address: formData.personalInfo.physicalAddress,
        good_conduct_file_name: documentMetadata.find(doc => doc.type === 'goodConduct')?.file_name,
        good_conduct_file_size: documentMetadata.find(doc => doc.type === 'goodConduct')?.file_size,
        good_conduct_file_type: documentMetadata.find(doc => doc.type === 'goodConduct')?.file_type,
        good_conduct_storage_path: documentMetadata.find(doc => doc.type === 'goodConduct')?.storage_path,
        drivers_license_file_name: documentMetadata.find(doc => doc.type === 'driversLicense')?.file_name,
        drivers_license_file_size: documentMetadata.find(doc => doc.type === 'driversLicense')?.file_size,
        drivers_license_file_type: documentMetadata.find(doc => doc.type === 'driversLicense')?.file_type,
        drivers_license_storage_path: documentMetadata.find(doc => doc.type === 'driversLicense')?.storage_path,
        log_book_file_name: documentMetadata.find(doc => doc.type === 'logBook')?.file_name,
        log_book_file_size: documentMetadata.find(doc => doc.type === 'logBook')?.file_size,
        log_book_file_type: documentMetadata.find(doc => doc.type === 'logBook')?.file_type,
        log_book_storage_path: documentMetadata.find(doc => doc.type === 'logBook')?.storage_path,
        insurance_file_name: documentMetadata.find(doc => doc.type === 'insurance')?.file_name,
        insurance_file_size: documentMetadata.find(doc => doc.type === 'insurance')?.file_size,
        insurance_file_type: documentMetadata.find(doc => doc.type === 'insurance')?.file_type,
        insurance_storage_path: documentMetadata.find(doc => doc.type === 'insurance')?.storage_path,
        consent_given: formData.consentInfo.consentGiven,
        consent_date: formData.consentInfo.consentDate,
      };

      const { error } = await supabase.from('form_submissions').insert(submissionData);
      if (error) {
        throw new Error('Failed to insert submission data');
      }

      goToNextStep();
      localStorage.removeItem('saaryFormData');

      toast({
        title: 'Form Submitted Successfully',
        description: 'Your application has been submitted for background verification.',
      });
    } catch (error) {
      console.error('Error during submission:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was an error submitting your form. Please try again.',
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
          onSubmit={() => handleSubmit()}
          onPrevious={goToPreviousStep}
        />
      )}

      {step === 5 && (
        <SuccessStep />
      )}
    </div>
  );
}
