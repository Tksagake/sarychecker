'use client';

import { useCallback } from 'react';
import { FormData } from '@/types';

export function useSaveFormProgress() {
  const saveProgress = useCallback((formData: FormData) => {
    try {
      // Convert File objects to an array of file metadata for storage
      // Note: This doesn't actually save the files, just their metadata
      const storedFormData = {
        ...formData,
        documentInfo: {
          goodConduct: formData.documentInfo.goodConduct?.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })) || null,
          driversLicense: formData.documentInfo.driversLicense?.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })) || null,
          logBook: formData.documentInfo.logBook?.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })) || null,
          insurance: formData.documentInfo.insurance?.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })) || null,
        },
        lastSaved: new Date(),
      };
      
      localStorage.setItem('saaryFormData', JSON.stringify(storedFormData));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, []);
  
  const loadProgress = useCallback(() => {
    try {
      const savedData = localStorage.getItem('saaryFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Convert date strings back to Date objects
        if (parsedData.consentInfo?.consentDate) {
          parsedData.consentInfo.consentDate = new Date(parsedData.consentInfo.consentDate);
        }
        
        if (parsedData.lastSaved) {
          parsedData.lastSaved = new Date(parsedData.lastSaved);
        }
        
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error('Error loading form data:', error);
      return null;
    }
  }, []);
  
  return { saveProgress, loadProgress };
}