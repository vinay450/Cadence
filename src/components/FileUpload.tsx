import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  loading: boolean;
}

export default function FileUpload({ onUpload, loading }: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: loading
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        {loading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Analyzing your data...</p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag and drop your data file here, or click to select'}
            </p>
            <p className="text-xs text-gray-400">
              Supports CSV, JSON, and Excel files
            </p>
          </>
        )}
      </div>
    </Card>
  );
} 