import FileUpload from '@/components/FileUpload';
import ChatInterface from '@/components/ChatInterface';

const Analysis = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Data Analysis
      </h1>
      <p className="text-gray-600 mb-8">
        Upload your dataset and ask questions to get insights, visualizations, and detailed analysis.
      </p>
      <FileUpload>
        {(uploadedFile, fileContent) => (
          <ChatInterface
            uploadedFile={uploadedFile}
            fileContent={fileContent}
          />
        )}
      </FileUpload>
    </div>
  );
};

export default Analysis; 