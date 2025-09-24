import React, { createContext, useContext, PropsWithChildren, useMemo } from "react";
import { createServices, Services } from "./container";

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({ children }: PropsWithChildren) {
    const services = useMemo(() => createServices(), []);
    return (
        <ServicesContext.Provider value={services}>
            {children}
        </ServicesContext.Provider>
    );
}

export function useServices(): Services {
    const ctx = useContext(ServicesContext);
    if (!ctx) throw new Error("useServices must be used within ServicesProvider");
    return ctx;
}

