"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Loader2, Save, Plus, Trash2,
    Package, TrendingUp, Clock, Ruler, Layers, Award,
    Factory, Users, Globe, Target, Shield, Zap,
    Truck, Settings, Star, CheckCircle, Box, Shirt,
    Scissors, Palette, Sparkles, BadgeCheck, Timer, Calendar,
    type LucideIcon
} from "lucide-react";
import { AboutSettings } from "@/components/admin/settings/AboutSettings";
import { FactorySettings } from "@/components/admin/settings/FactorySettings";

interface CapacityStat {
    icon: string;
    value: string;
    label: string;
    description: string;
}

const defaultStats: CapacityStat[] = [
    { icon: "Package", value: "500", label: "Minimum Order Qty", description: "Units per style" },
    { icon: "TrendingUp", value: "100K+", label: "Monthly Capacity", description: "Units production" },
    { icon: "Clock", value: "3-6", label: "Lead Time", description: "Weeks to delivery" },
    { icon: "Ruler", value: "XS-5XL", label: "Size Range", description: "Full size coverage" },
    { icon: "Layers", value: "50+", label: "Fabric Options", description: "Premium materials" },
    { icon: "Award", value: "25+", label: "Years Experience", description: "In the industry" },
];

// Icon map for rendering
const iconMap: Record<string, LucideIcon> = {
    Package, TrendingUp, Clock, Ruler, Layers, Award,
    Factory, Users, Globe, Target, Shield, Zap,
    Truck, Settings, Star, CheckCircle, Box, Shirt,
    Scissors, Palette, Sparkles, BadgeCheck, Timer, Calendar,
};

const iconOptions = [
    { value: "Package", label: "Package" },
    { value: "TrendingUp", label: "Trending Up" },
    { value: "Clock", label: "Clock" },
    { value: "Timer", label: "Timer" },
    { value: "Calendar", label: "Calendar" },
    { value: "Ruler", label: "Ruler" },
    { value: "Layers", label: "Layers" },
    { value: "Award", label: "Award" },
    { value: "BadgeCheck", label: "Badge Check" },
    { value: "Star", label: "Star" },
    { value: "CheckCircle", label: "Check Circle" },
    { value: "Factory", label: "Factory" },
    { value: "Users", label: "Users" },
    { value: "Globe", label: "Globe" },
    { value: "Target", label: "Target" },
    { value: "Shield", label: "Shield" },
    { value: "Zap", label: "Zap (Lightning)" },
    { value: "Truck", label: "Truck" },
    { value: "Settings", label: "Settings" },
    { value: "Box", label: "Box" },
    { value: "Shirt", label: "Shirt" },
    { value: "Scissors", label: "Scissors" },
    { value: "Palette", label: "Palette" },
    { value: "Sparkles", label: "Sparkles" },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [capacityStats, setCapacityStats] = useState<CapacityStat[]>(defaultStats);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingStats, setIsSavingStats] = useState(false);

    const fetchData = async () => {
        try {
            const settingsRes = await fetch("/api/settings");
            const settingsData = await settingsRes.json();

            if (settingsData.success && settingsData.data) {
                setSettings(settingsData.data || {});
                if (settingsData.data.capacity_stats) {
                    setCapacityStats(settingsData.data.capacity_stats);
                }
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load settings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Settings saved successfully");
            } else {
                toast.error(result.error || "Failed to save settings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveCapacityStats = async () => {
        setIsSavingStats(true);
        try {
            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "capacity_stats",
                    value: capacityStats,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Production capabilities saved successfully");
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSavingStats(false);
        }
    };

    const updateStat = (index: number, field: keyof CapacityStat, value: string) => {
        setCapacityStats((prev) =>
            prev.map((stat, i) =>
                i === index ? { ...stat, [field]: value } : stat
            )
        );
    };

    const addStat = () => {
        setCapacityStats((prev) => [
            ...prev,
            { icon: "Package", value: "", label: "", description: "" },
        ]);
    };

    const removeStat = (index: number) => {
        setCapacityStats((prev) => prev.filter((_, i) => i !== index));
    };

    const renderIcon = (iconName: string, className?: string) => {
        const IconComponent = iconMap[iconName];
        if (!IconComponent) return null;
        return <IconComponent className={className || "h-5 w-5"} />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Site Settings</h1>
                <p className="text-muted-foreground">
                    Manage website contact information and content
                </p>
            </div>

            <Tabs defaultValue="contact" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="contact">Contact Details</TabsTrigger>
                    <TabsTrigger value="capacity">Production Capabilities</TabsTrigger>
                    <TabsTrigger value="about">About Page</TabsTrigger>
                    <TabsTrigger value="factory">Factory Page</TabsTrigger>
                </TabsList>

                {/* Contact Details Tab */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                                Email and phone displayed on the public Contact page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_email">Email Address</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={settings.contact_email || ""}
                                        onChange={(e) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                contact_email: e.target.value,
                                            }))
                                        }
                                        placeholder="info@company.com"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Displayed on the Contact page
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone">Phone Number</Label>
                                    <Input
                                        id="contact_phone"
                                        value={settings.contact_phone || ""}
                                        onChange={(e) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                contact_phone: e.target.value,
                                            }))
                                        }
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Displayed on the Contact page
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSaveSettings}
                                    disabled={isSaving}
                                    className="btn-industrial"
                                >
                                    {isSaving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Production Capabilities Tab */}
                <TabsContent value="capacity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Production Capabilities</CardTitle>
                            <CardDescription>
                                Edit the stats displayed on the homepage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {capacityStats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-border rounded-lg items-end"
                                >
                                    {/* Icon Preview */}
                                    <div className="space-y-2">
                                        <Label>Icon</Label>
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-accent/10 rounded-lg border border-border">
                                                {renderIcon(stat.icon, "h-6 w-6 text-accent")}
                                            </div>
                                            <Select
                                                value={stat.icon}
                                                onValueChange={(value) => updateStat(index, "icon", value)}
                                            >
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px]">
                                                    {iconOptions.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            <div className="flex items-center gap-2">
                                                                {renderIcon(opt.value, "h-4 w-4")}
                                                                <span>{opt.label}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Value</Label>
                                        <Input
                                            value={stat.value}
                                            onChange={(e) => updateStat(index, "value", e.target.value)}
                                            placeholder="e.g., 500+"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Label</Label>
                                        <Input
                                            value={stat.label}
                                            onChange={(e) => updateStat(index, "label", e.target.value)}
                                            placeholder="e.g., Minimum Order"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={stat.description}
                                            onChange={(e) =>
                                                updateStat(index, "description", e.target.value)
                                            }
                                            placeholder="e.g., Units per style"
                                        />
                                    </div>
                                    <div className="flex items-end justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeStat(index)}
                                            disabled={capacityStats.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={addStat}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Stat
                                </Button>
                                <Button
                                    onClick={handleSaveCapacityStats}
                                    disabled={isSavingStats}
                                    className="btn-industrial"
                                >
                                    {isSavingStats ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Capabilities
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* About Page Tab */}
                <TabsContent value="about">
                    <AboutSettings />
                </TabsContent>

                {/* Factory Page Tab */}
                <TabsContent value="factory">
                    <FactorySettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}
