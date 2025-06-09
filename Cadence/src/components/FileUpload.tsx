import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DomainSelector } from './DomainSelector';
import { DataDomain } from '@/lib/types/dataTypes';

interface FileUploadProps {
  children: (uploadedFile: string | null, fileContent: string | undefined, dataDomain: DataDomain) => React.ReactNode;
}

const FileUpload = ({ children }: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>();
  const [selectedDomain, setSelectedDomain] = useState<DataDomain>('auto_detect');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
    setUploadedFile(file.name);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileContent(undefined);
    setSelectedDomain('auto_detect');
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Upload Your Dataset</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!uploadedFile ? (
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <Upload className="w-8 h-8 text-blue-500" />
                <span className="mt-2 text-base">Select a file</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.json,.xlsx,.xls"
                  onChange={handleFileUpload}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: CSV, JSON, Excel
                </p>
              </label>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {uploadedFile}
                    </p>
                    <p className="text-sm text-gray-500">Ready for analysis</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Data Domain (Optional)
                </h4>
                <DomainSelector
                  selectedDomain={selectedDomain}
                  onDomainChange={setSelectedDomain}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
      {children(uploadedFile, fileContent, selectedDomain)}
    </Card>
  );
};

export default FileUpload; 