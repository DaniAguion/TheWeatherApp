import React, { createContext, useContext, useMemo } from "react";
import { Dependencies, UseCases, Services, createDepedencies } from "./container";

const DependenciesContext = createContext<Dependencies | null>(null);

export const DependenciesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const deps = useMemo(() => createDepedencies(), []);
  return (
    <DependenciesContext.Provider value={deps}>
      {children}
    </DependenciesContext.Provider>
  );
};

export function useDeps() {
  const ctx = useContext(DependenciesContext);
  if (!ctx) throw new Error("DependenciesProvider missing");
  return ctx;
}

export function useUseCases() : UseCases {
  return useDeps().useCases;
}

export function useServices() : Services {
  return useDeps().services;
}


