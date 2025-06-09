import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { analyzeDataset } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface DataCategory {
  title: string;
  icon: string;
  content: string | null;
  isLoading: boolean;
}

interface DataAnalysisDashboardProps {
  uploadedFile: string | null;
  fileContent?: string;
}

const DataAnalysisDashboard = ({ uploadedFile, fileContent }: DataAnalysisDashboardProps) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [categories, setCategories] = useState<DataCategory[]>([
    {
      title: 'Dataset Overview',
      icon: '📊',
      content: null,
      isLoading: false
    },
    {
      title: 'Statistical Summary',
      icon: '📈',
      content: null,
      isLoading: false
    },
    {
      title: 'Pattern Recognition',
      icon: '🔍',
      content: null,
      isLoading: false
    },
    {
      title: 'Data Quality',
      icon: '✨',
      content: null,
      isLoading: false
    },
    {
      title: 'Key Insights',
      icon: '💡',
      content: null,
      isLoading: false
    },
    {
      title: 'Recommendations',
      icon: '🎯',
      content: null,
      isLoading: false
    }
  ]);

  const handleAnalysis = async () => {
    if (!fileContent || !uploadedFile) {
      toast({
        title: 'Error',
        description: 'Please upload a file first',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setCategories(prev => prev.map(cat => ({ ...cat, isLoading: true })));

    try {
      const fileType = uploadedFile.split('.').pop() || 'csv';
      const response = await analyzeDataset({
        dataContent: fileContent,
        fileType: fileType as 'csv' | 'json' | 'excel',
        question: "Provide a comprehensive analysis with clear sections for overview, statistics, patterns, quality, insights, and recommendations."
      });

      // Parse the response into sections
      const sections = response.textAnalysis.split('\n\n');
      const updatedCategories = [...categories];
      
      sections.forEach(section => {
        if (section.includes('Dataset Overview')) {
          updatedCategories[0].content = section.replace('Dataset Overview:', '').trim();
        } else if (section.includes('Statistical Summary')) {
          updatedCategories[1].content = section.replace('Statistical Summary:', '').trim();
        } else if (section.includes('Pattern Recognition')) {
          updatedCategories[2].content = section.replace('Pattern Recognition:', '').trim();
        } else if (section.includes('Data Quality')) {
          updatedCategories[3].content = section.replace('Data Quality:', '').trim();
        } else if (section.includes('Key Insights')) {
          updatedCategories[4].content = section.replace('Key Insights:', '').trim();
        } else if (section.includes('Recommendations')) {
          updatedCategories[5].content = section.replace('Recommendations:', '').trim();
        }
      });

      setCategories(updatedCategories.map(cat => ({ ...cat, isLoading: false })));
    } catch (error) {
      toast({
        title: 'Analysis Error',
        description: error instanceof Error ? error.message : 'An error occurred during analysis',
        variant: 'destructive',
      });
      setCategories(prev => prev.map(cat => ({ ...cat, isLoading: false })));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Status and Analysis Button */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {uploadedFile ? 'File Ready for Analysis' : 'Upload a File'}
            </h2>
            <p className="text-sm text-gray-500">
              {uploadedFile 
                ? `Selected file: ${uploadedFile}`
                : 'Upload a CSV, JSON, or Excel file to begin analysis'
              }
            </p>
          </div>
          <Button
            onClick={handleAnalysis}
            disabled={!uploadedFile || isAnalyzing}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Begin Research'
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
              </div>
              <div className="h-[200px] overflow-y-auto">
                {category.isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : category.content ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap">{category.content}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataAnalysisDashboard; 