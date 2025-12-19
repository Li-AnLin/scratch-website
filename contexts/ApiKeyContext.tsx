import React, { createContext, useContext, ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  hasKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Directly use process.env.API_KEY as per guidelines
  const apiKey = process.env.API_KEY || '';

  const value = {
    apiKey,
    hasKey: !!apiKey
  };

  return (
    <ApiKeyContext.Provider value={value}>
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