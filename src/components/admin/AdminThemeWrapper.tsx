"use client";

import { useAdminTheme } from "@/contexts/admin-theme-context";

export function AdminThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-muted">
            {children}
        </div>
    );
}
