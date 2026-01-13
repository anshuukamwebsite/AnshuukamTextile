"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AdminTheme = "legacy" | "enterprise";

interface AdminThemeContextType {
    theme: AdminTheme;
    setTheme: (theme: AdminTheme) => void;
    toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

const STORAGE_KEY = "admin-theme-preference";

export function AdminThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<AdminTheme>("enterprise");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY) as AdminTheme | null;
        if (stored === "enterprise" || stored === "legacy") {
            setThemeState(stored);
        }
    }, []);

    const setTheme = (newTheme: AdminTheme) => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
    };

    const toggleTheme = () => {
        setTheme(theme === "legacy" ? "enterprise" : "legacy");
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export function useAdminTheme() {
    const context = useContext(AdminThemeContext);
    // Return default values for SSG - actual values come from client-side provider
    if (context === undefined) {
        return {
            theme: "enterprise" as AdminTheme,
            setTheme: () => { },
            toggleTheme: () => { },
        };
    }
    return context;
}
