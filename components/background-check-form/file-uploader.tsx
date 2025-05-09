'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  label: string;
  description: string;
  files: File[] | null;
  onChange: (files: File[] | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export function FileUploader({ label, description, files, onChange }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    processFiles(selectedFiles);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (selectedFiles: File[]) => {
    const invalidFiles = selectedFiles.filter(
      file => !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Invalid file(s)",
        description: `Some files were not added. Please ensure files are PDF, JPG, or PNG and under 5MB.`,
      });
    }

    const validFiles = selectedFiles.filter(
      file => ALLOWED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length > 0) {
      const newFiles = files ? [...files, ...validFiles] : validFiles;
      onChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    if (files) {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      onChange(newFiles.length > 0 ? newFiles : null);
    }
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <div className="font-medium text-sm">{label}</div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          files && files.length > 0 ? "border-primary/50" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2 py-4">
          <UploadIcon className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-center">
            <p className="font-medium">Drag and drop files here</p>
            <p className="text-muted-foreground">or click to select files</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <Button
            
            
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            Select Files
          </Button>
        </div>
      </div>
      
      {files && files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <Card key={`${file.name}-${index}`} className="flex items-center p-2">
              <div className="flex flex-1 items-center overflow-hidden">
                <FileIcon className="h-5 w-5 mr-2 shrink-0 text-muted-foreground" />
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                
                className="h-7 w-7 rounded-full"
                onClick={() => removeFile(index)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}