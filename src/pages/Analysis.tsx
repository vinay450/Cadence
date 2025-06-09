import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import DataAnalysisDashboard from '@/components/DataAnalysisDashboard';

const Analysis = () => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | undefined>();

  const handleFileUpload = (fileName: string, content: string) => {
    setUploadedFile(fileName);
    setFileContent(content);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Medical Data Analysis
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Upload your dataset to get comprehensive insights and analysis
          </p>
        </div>

        {/* File Upload Area */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <FileUpload onUpload={handleFileUpload} />
        </div>

        {/* Analysis Dashboard */}
        <DataAnalysisDashboard
          uploadedFile={uploadedFile}
          fileContent={fileContent}
        />
      </div>
    </div>
  );
};

export default Analysis; 