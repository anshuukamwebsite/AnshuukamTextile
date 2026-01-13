"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

export function FactorySettings() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/settings/factory");
            const result = await response.json();
            if (result.success) {
                setSettings(result.data);
            } else {
                toast.error("Failed to load settings");
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("An error occurred while loading settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/settings/factory", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Settings updated successfully");
            } else {
                toast.error(result.error || "Failed to update settings");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("An error occurred while saving");
        } finally {
            setIsSaving(false);
        }
    };

    const updateSection = (section: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateNestedArray = (section: string, arrayName: string, index: number, field: string | null, value: any) => {
        setSettings((prev: any) => {
            const newArray = [...prev[section][arrayName]];
            if (field) {
                newArray[index] = { ...newArray[index], [field]: value };
            } else {
                newArray[index] = value;
            }
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [arrayName]: newArray
                }
            };
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!settings) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium">Factory Page Content</h2>
                    <p className="text-sm text-muted-foreground">Manage content sections for the Factory page</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery Text</TabsTrigger>
                </TabsList>

                {/* Hero Section */}
                <TabsContent value="hero" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Section</CardTitle>
                            <CardDescription>The main banner content at the top of the page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={settings.hero.title}
                                    onChange={(e) => updateSection("hero", "title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={settings.hero.description}
                                    onChange={(e) => updateSection("hero", "description", e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Stats Section */}
                <TabsContent value="stats" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Factory Stats</CardTitle>
                            <CardDescription>Key statistics displayed on the factory page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Statistics Cards</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newStat = { value: "", label: "", id: `STAT-${Date.now()}` };
                                            setSettings((prev: any) => ({
                                                ...prev,
                                                stats: [...prev.stats, newStat]
                                            }));
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Stat
                                    </Button>
                                </div>
                                {settings.stats.map((stat: any, index: number) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20 relative">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Value</Label>
                                            <Input
                                                value={stat.value}
                                                onChange={(e) => {
                                                    const newStats = [...settings.stats];
                                                    newStats[index] = { ...newStats[index], value: e.target.value };
                                                    setSettings({ ...settings, stats: newStats });
                                                }}
                                                placeholder="e.g. 50,000+"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Label</Label>
                                            <Input
                                                value={stat.label}
                                                onChange={(e) => {
                                                    const newStats = [...settings.stats];
                                                    newStats[index] = { ...newStats[index], label: e.target.value };
                                                    setSettings({ ...settings, stats: newStats });
                                                }}
                                                placeholder="e.g. Sq Ft Facility"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">ID (for styling)</Label>
                                            <Input
                                                value={stat.id}
                                                onChange={(e) => {
                                                    const newStats = [...settings.stats];
                                                    newStats[index] = { ...newStats[index], id: e.target.value };
                                                    setSettings({ ...settings, stats: newStats });
                                                }}
                                                placeholder="e.g. AREA"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-destructive hover:text-destructive/90"
                                            onClick={() => {
                                                const newStats = settings.stats.filter((_: any, i: number) => i !== index);
                                                setSettings({ ...settings, stats: newStats });
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Gallery Text Section */}
                <TabsContent value="gallery" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gallery Section Text</CardTitle>
                            <CardDescription>The title and description above the photo gallery</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={settings.gallery.title}
                                    onChange={(e) => updateSection("gallery", "title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={settings.gallery.description}
                                    onChange={(e) => updateSection("gallery", "description", e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
