"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AdminTheme = "legacy";

interface AdminThemeContextType {
    theme: AdminTheme;
    setTheme: (theme: AdminTheme) => void;
    toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

const STORAGE_KEY = "admin-theme-preference";

export function AdminThemeProvider({ children }: { children: ReactNode }) {
    const theme: AdminTheme = "legacy";

    const setTheme = () => { };
    const toggleTheme = () => { };

    return (
        <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export function useAdminTheme() {
    const context = useContext(AdminThemeContext);
    if (context === undefined) {
        return {
            theme: "legacy" as AdminTheme,
            setTheme: () => { },
            toggleTheme: () => { },
        };
    }
    return context;
}
