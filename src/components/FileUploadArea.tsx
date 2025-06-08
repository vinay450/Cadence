
import { useState } from "react";
import { Upload, Database } from "lucide-react";

interface FileUploadAreaProps {
  uploadedFile: string | null;
  setUploadedFile: (file: string | null) => void;
}

const FileUploadArea = ({ uploadedFile, setUploadedFile }: FileUploadAreaProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0].name);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0].name);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
        isDragOver 
          ? 'border-blue-400 bg-blue-50' 
          : uploadedFile 
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".csv,.xlsx,.json"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-center">
        {uploadedFile ? (
          <div className="space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Database className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-medium text-green-700">Dataset Uploaded!</p>
            <p className="text-sm text-green-600">{uploadedFile}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-lg font-medium text-gray-700">
              Drop your dataset here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports CSV, Excel, JSON files up to 50MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadArea;
