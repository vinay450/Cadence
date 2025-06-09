import { createContext, useContext, useEffect, useState } from 'react';
import { getApiKey } from '@/services/apiKeyService';
import { useAuth } from './AuthContext';

interface ApiKeyContextType {
  apiKey: string | null;
  isLoading: boolean;
  error: string | null;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApiKey = async () => {
      if (!user) {
        setApiKey(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const key = await getApiKey();
        setApiKey(key);
      } catch (err) {
        setError('Failed to fetch API key');
        console.error('Error fetching API key:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, [user]);

  return (
    <ApiKeyContext.Provider value={{ apiKey, isLoading, error }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}; 