"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, Sparkles, Shield, Users, Target, Globe, Award, Zap, Heart, Star, CheckCircle } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

// Icon map for rendering
const iconMap: Record<string, LucideIcon> = {
    Sparkles, Shield, Users, Target, Globe, Award, Zap, Heart, Star, CheckCircle
};

const iconOptions = [
    { value: "Sparkles", label: "Sparkles" },
    { value: "Shield", label: "Shield" },
    { value: "Users", label: "Users" },
    { value: "Target", label: "Target" },
    { value: "Globe", label: "Globe" },
    { value: "Award", label: "Award" },
    { value: "Zap", label: "Zap" },
    { value: "Heart", label: "Heart" },
    { value: "Star", label: "Star" },
    { value: "CheckCircle", label: "Check Circle" },
];

export function AboutSettings() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/settings/about");
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
            const response = await fetch("/api/settings/about", {
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

    const renderIcon = (iconName: string, className?: string) => {
        const IconComponent = iconMap[iconName];
        if (!IconComponent) return null;
        return <IconComponent className={className || "h-5 w-5"} />;
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
                    <h2 className="text-lg font-medium">About Page Content</h2>
                    <p className="text-sm text-muted-foreground">Manage content sections for the About Us page</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="mission">Mission</TabsTrigger>
                    <TabsTrigger value="story">Story</TabsTrigger>
                    <TabsTrigger value="values">Values</TabsTrigger>
                    <TabsTrigger value="company">Company</TabsTrigger>
                    <TabsTrigger value="cta">CTA</TabsTrigger>
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

                {/* Mission Section */}
                <TabsContent value="mission" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mission Statement</CardTitle>
                            <CardDescription>The quote and mission text below the hero</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Quote</Label>
                                <Textarea
                                    value={settings.mission.quote}
                                    onChange={(e) => updateSection("mission", "quote", e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={settings.mission.description}
                                    onChange={(e) => updateSection("mission", "description", e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Story Section */}
                <TabsContent value="story" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Our Story & Founders</CardTitle>
                            <CardDescription>The founders section and company history</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Section Title</Label>
                                <Input
                                    value={settings.story.title}
                                    onChange={(e) => updateSection("story", "title", e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Story Paragraphs</Label>
                                {settings.story.content.map((paragraph: string, index: number) => (
                                    <div key={index} className="flex gap-2">
                                        <Textarea
                                            value={paragraph}
                                            onChange={(e) => updateNestedArray("story", "content", index, null, e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <Label>Founders</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newFounder = { name: "", role: "", id: Date.now().toString(), imageUrl: "" };
                                            setSettings((prev: any) => ({
                                                ...prev,
                                                story: {
                                                    ...prev.story,
                                                    founders: [...prev.story.founders, newFounder]
                                                }
                                            }));
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Founder
                                    </Button>
                                </div>
                                {settings.story.founders.map((founder: any, index: number) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20 relative">
                                        <div className="md:col-span-1">
                                            <Label className="text-xs mb-2 block">Photo</Label>
                                            <ImageUpload
                                                currentImage={founder.imageUrl}
                                                onImageUploaded={(url) => updateNestedArray("story", "founders", index, "imageUrl", url)}
                                                onImageRemoved={() => updateNestedArray("story", "founders", index, "imageUrl", "")}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Name</Label>
                                                <Input
                                                    value={founder.name}
                                                    onChange={(e) => updateNestedArray("story", "founders", index, "name", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs">Role</Label>
                                                <Input
                                                    value={founder.role}
                                                    onChange={(e) => updateNestedArray("story", "founders", index, "role", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-destructive hover:text-destructive/90"
                                            onClick={() => {
                                                setSettings((prev: any) => ({
                                                    ...prev,
                                                    story: {
                                                        ...prev.story,
                                                        founders: prev.story.founders.filter((_: any, i: number) => i !== index)
                                                    }
                                                }));
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

                {/* Values Section */}
                <TabsContent value="values" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Core Values</CardTitle>
                            <CardDescription>The core values displayed in the grid</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Section Title</Label>
                                <Input
                                    value={settings.values.title}
                                    onChange={(e) => updateSection("values", "title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Section Description</Label>
                                <Textarea
                                    value={settings.values.description}
                                    onChange={(e) => updateSection("values", "description", e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <Label>Value Items</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newValue = {
                                                id: `VAL-${Date.now()}`,
                                                title: "",
                                                description: "",
                                                icon: "Sparkles"
                                            };
                                            setSettings((prev: any) => ({
                                                ...prev,
                                                values: {
                                                    ...prev.values,
                                                    items: [...prev.values.items, newValue]
                                                }
                                            }));
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Value
                                    </Button>
                                </div>
                                {settings.values.items.map((item: any, index: number) => (
                                    <div key={index} className="space-y-3 p-4 border rounded-md bg-muted/20 relative">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-1 space-y-2">
                                                <Label className="text-xs">Icon</Label>
                                                <Select
                                                    value={item.icon || "Sparkles"}
                                                    onValueChange={(value) => updateNestedArray("values", "items", index, "icon", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
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
                                            <div className="md:col-span-3 space-y-2">
                                                <Label className="text-xs">Title</Label>
                                                <Input
                                                    value={item.title}
                                                    onChange={(e) => updateNestedArray("values", "items", index, "title", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Description</Label>
                                            <Textarea
                                                value={item.description}
                                                onChange={(e) => updateNestedArray("values", "items", index, "description", e.target.value)}
                                                rows={2}
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-destructive hover:text-destructive/90"
                                            onClick={() => {
                                                setSettings((prev: any) => ({
                                                    ...prev,
                                                    values: {
                                                        ...prev.values,
                                                        items: prev.values.items.filter((_: any, i: number) => i !== index)
                                                    }
                                                }));
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

                {/* Company Info Section */}
                <TabsContent value="company" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>Details displayed in the footer strip of the about page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input
                                    value={settings.company_info.name}
                                    onChange={(e) => updateSection("company_info", "name", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={settings.company_info.location}
                                    onChange={(e) => updateSection("company_info", "location", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>GSTIN</Label>
                                <Input
                                    value={settings.company_info.gstin}
                                    onChange={(e) => updateSection("company_info", "gstin", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CTA Section */}
                <TabsContent value="cta" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Call to Action</CardTitle>
                            <CardDescription>The bottom section prompting users to contact</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={settings.cta.title}
                                    onChange={(e) => updateSection("cta", "title", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={settings.cta.description}
                                    onChange={(e) => updateSection("cta", "description", e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
