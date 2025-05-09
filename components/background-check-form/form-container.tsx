'use client';

import { useState, useEffect } from 'react';
import { FormData } from '@/types';
import { FormProgress } from './form-progress';
import { PersonalInfoStep } from './personal-info-step';
import { DocumentUploadStep } from './document-upload-step';
import { ConsentStep } from './consent-step';
import { ReviewStep } from './review-step';
import { SuccessStep } from './success-step';
import { PaymentStep } from './payment-step';
import { useToast } from '@/hooks/use-toast';
import { useSaveFormProgress } from '@/hooks/use-save-form-progress';
import { supabase } from '@/lib/supabase';

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
  paymentInfo: {
    paymentMethod: '',
    paymentStatus: '',
  },
  formProgress: 0,
};

export function FormContainer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...((prev[section] as Record<string, any>) || {}),
        [fieldName]: value,
      },
    }));
  };

  const goToNextStep = () => {
    if (step < 6) {
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
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!formData.consentInfo.consentGiven) {
        throw new Error('You must give consent to proceed');
      }

      // Process each document type separately to match your schema
      const processDocument = async (type: string, files: File[] | null) => {
        if (!files || files.length === 0) return null;
        
        const file = files[0]; // Assuming single file per type
        const filePath = `submissions/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        return {
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath,
        };
      };

      // Process all document types
      const goodConduct = await processDocument('goodConduct', formData.documentInfo.goodConduct);
      const driversLicense = await processDocument('driversLicense', formData.documentInfo.driversLicense);
      const logBook = await processDocument('logBook', formData.documentInfo.logBook);
      const insurance = await processDocument('insurance', formData.documentInfo.insurance);

      // Prepare submission data matching your schema
      const paymentInfo = formData.paymentInfo || { paymentMethod: '', paymentStatus: '' };

      const submissionData = {
        first_name: formData.personalInfo.firstName,
        second_name: formData.personalInfo.secondName,
        phone: formData.personalInfo.phone,
        email: formData.personalInfo.email,
        id_number: formData.personalInfo.idNumber,
        country: formData.personalInfo.country,
        county: formData.personalInfo.county,
        physical_address: formData.personalInfo.physicalAddress,
        good_conduct_file_name: goodConduct?.file_name || null,
        good_conduct_file_size: goodConduct?.file_size || null,
        good_conduct_file_type: goodConduct?.file_type || null,
        good_conduct_storage_path: goodConduct?.storage_path || null,
        drivers_license_file_name: driversLicense?.file_name || null,
        drivers_license_file_size: driversLicense?.file_size || null,
        drivers_license_file_type: driversLicense?.file_type || null,
        drivers_license_storage_path: driversLicense?.storage_path || null,
        log_book_file_name: logBook?.file_name || null,
        log_book_file_size: logBook?.file_size || null,
        log_book_file_type: logBook?.file_type || null,
        log_book_storage_path: logBook?.storage_path || null,
        insurance_file_name: insurance?.file_name || null,
        insurance_file_size: insurance?.file_size || null,
        insurance_file_type: insurance?.file_type || null,
        insurance_storage_path: insurance?.storage_path || null,
        consent_given: formData.consentInfo.consentGiven,
        consent_date: formData.consentInfo.consentDate || new Date().toISOString(),
        payment_phone_number: paymentInfo.phoneNumber || null,
        payment_transaction_code: paymentInfo.transactionCode || null,
      };

      // Insert into database
      const { error } = await supabase
        .from('form_submissions')
        .insert(submissionData);

      if (error) throw error;

      // Success
      goToNextStep();
      localStorage.removeItem('saaryFormData');
      toast({
        title: 'Form Submitted Successfully',
        description: 'Your application has been submitted for processing.',
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'There was an error submitting your form.',
      });
    } finally {
      setIsSubmitting(false);
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
        <PaymentStep
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          updateFormData={(field, value) => updateFormData(field, value, 'paymentInfo')}
        />
      )}

      {step === 5 && (
        <ReviewStep
          formData={formData}
          onSubmit={handleSubmit}
          onPrevious={goToPreviousStep}
        />
      )}

      {step === 6 && <SuccessStep />}
    </div>
  );
}