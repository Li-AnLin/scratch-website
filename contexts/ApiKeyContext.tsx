import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  hasKey: boolean;
  setApiKey: (key: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state only from environment variable (if available), otherwise empty.
  // We explicitly DO NOT read from localStorage so it resets on refresh.
  const [apiKey, setApiKeyState] = useState(() => {
    return process.env.API_KEY || '';
  });

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    // We explicitly DO NOT save to localStorage.
    // The key will be lost on page refresh.
  };

  const value = {
    apiKey,
    hasKey: !!apiKey,
    setApiKey
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