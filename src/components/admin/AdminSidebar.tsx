"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
    Factory,
    LayoutDashboard,
    Package,
    Layers,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Image as ImageIcon,
    Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAdminTheme } from "@/contexts/admin-theme-context";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Catagories", href: "/admin/catalogue", icon: Package },
    { name: "Fabrics", href: "/admin/fabrics", icon: Layers },
    { name: "Factory Photos", href: "/admin/factory", icon: ImageIcon },
    { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { name: "Design Enquiries", href: "/admin/design-enquiries", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { theme, toggleTheme } = useAdminTheme();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const activeIndex = navigation.findIndex((item) => isActive(item.href));

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className={`border-b border-border ${theme === "enterprise" ? "p-3 bg-primary" : "p-6"}`}>
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="relative h-10 w-32">
                        <img
                            src="/logo.png"
                            alt="Admin Panel"
                            className={`object-contain object-left w-full h-full ${theme === "enterprise" ? "brightness-0 invert" : ""}`}
                        />
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 relative ${theme === "enterprise" ? "p-0" : "p-4"}`}>
                {/* Sliding Active Background - only in legacy mode */}
                {theme === "legacy" && (
                    <div
                        className="absolute left-4 right-4 bg-accent rounded-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        style={{
                            height: '44px',
                            top: '16px',
                            transform: `translateY(${activeIndex * 48}px)`,
                            opacity: activeIndex === -1 ? 0 : 1,
                            zIndex: 0
                        }}
                    />
                )}

                <div className={`relative z-10 ${theme === "enterprise" ? "" : "space-y-1"}`}>
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={
                                    theme === "enterprise"
                                        ? `flex items-center gap-3 px-4 py-2.5 text-sm font-medium border-b border-border transition-colors ${active
                                            ? "bg-blue-50 text-primary border-l-4 border-l-primary"
                                            : "text-gray-600 hover:bg-gray-50 border-l-4 border-l-transparent"
                                        }`
                                        : `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${active
                                            ? "text-accent-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`
                                }
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <span>{theme === "enterprise" ? "Enterprise" : "Legacy"} UI</span>
                    </span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-background rounded">
                        {theme === "enterprise" ? "New" : "Classic"}
                    </span>
                </button>

                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    View Website →
                </Link>
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2">
                    <Factory className="h-6 w-6 text-accent" />
                    <span className="font-bold">Admin</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    {isMobileOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </Button>
            </div>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
                    <div className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border flex flex-col pt-16">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background border-r border-border">
                <SidebarContent />
            </aside>
        </>
    );
}
