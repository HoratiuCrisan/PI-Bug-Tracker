import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  activeComponent: string | null
  setActiveComponent: (component: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null)

  return (
    <AppContext.Provider value={{ activeComponent, setActiveComponent }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context;
}

