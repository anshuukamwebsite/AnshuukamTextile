"use client";

import { useAdminTheme } from "@/contexts/admin-theme-context";

export function AdminThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useAdminTheme();

    return (
        <div className={`min-h-screen bg-muted ${theme === "enterprise" ? "admin-enterprise" : ""}`}>
            {children}
        </div>
    );
}
