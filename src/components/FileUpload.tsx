import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onUpload: (fileName: string, content: string) => void;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'json', 'xlsx', 'xls'].includes(fileType || '')) {
      setError('Please upload a CSV, JSON, or Excel file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const content = await file.text();
      onUpload(file.name, content);
    } catch (err) {
      setError('Error reading file. Please try again.');
      console.error('File read error:', err);
    } finally {
      setIsLoading(false);
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
    multiple: false
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          transition-colors duration-200 ease-in-out
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          {isLoading ? (
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          ) : (
            <>
              <div className="mb-4">
                {isDragActive ? (
                  <Upload className="h-10 w-10 text-blue-500" />
                ) : (
                  <File className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <p className="mb-2 text-sm font-semibold text-gray-700">
                {isDragActive
                  ? 'Drop your file here'
                  : 'Drag & drop your file here'
                }
              </p>
              <p className="text-xs text-gray-500">
                or click to select a file
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Browse Files
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Supported formats: CSV, JSON, Excel
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}; 