import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  children: (uploadedFile: string | null, fileContent: string | undefined) => ReactNode;
}

const FileUpload = ({ children }: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'json', 'xlsx', 'xls'].includes(fileType || '')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV, JSON, or Excel file.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const content = await file.text();
      setUploadedFile(file.name);
      setFileContent(content);
      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been uploaded and is ready for analysis.`,
      });
    } catch (error) {
      toast({
        title: 'Error uploading file',
        description: 'There was an error reading your file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileContent(undefined);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Upload Your Dataset</CardTitle>
      </CardHeader>
      <CardContent>
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
        )}
      </CardContent>
      {children(uploadedFile, fileContent)}
    </Card>
  );
};

export default FileUpload; 