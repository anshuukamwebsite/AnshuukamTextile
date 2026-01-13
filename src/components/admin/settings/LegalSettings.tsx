"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Shield, FileText, Truck, RefreshCcw, Copyright } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface LegalSection {
    heading: string;
    text: string;
}

interface LegalCategory {
    title: string;
    lastUpdated: string;
    sections: LegalSection[];
}

interface LegalContent {
    privacy: LegalCategory;
    terms: LegalCategory;
    refund: LegalCategory;
    shipping: LegalCategory;
    ip: LegalCategory;
}

const categoryConfig = {
    privacy: { label: "Privacy Policy", icon: Shield, description: "Data collection, usage, and user rights" },
    terms: { label: "Terms of Service", icon: FileText, description: "Website and service usage terms" },
    refund: { label: "Refund & Cancellation", icon: RefreshCcw, description: "Order cancellation and refund policies" },
    shipping: { label: "Shipping & Delivery", icon: Truck, description: "Lead times, shipping costs, and delivery" },
    ip: { label: "Intellectual Property", icon: Copyright, description: "Copyright, trademarks, and design rights" },
};

export function LegalSettings() {
    const [content, setContent] = useState<LegalContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings/legal");
            const data = await res.json();
            if (data.success) {
                setContent(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch legal settings:", error);
            toast.error("Failed to load legal settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content) return;

        setIsSaving(true);
        try {
            const res = await fetch("/api/settings/legal", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Legal settings saved successfully!");
            } else {
                toast.error(data.error || "Failed to save");
            }
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const updateCategoryField = (category: keyof LegalContent, field: "title" | "lastUpdated", value: string) => {
        if (!content) return;
        setContent({
            ...content,
            [category]: {
                ...content[category],
                [field]: value,
            },
        });
    };

    const updateSection = (category: keyof LegalContent, index: number, field: "heading" | "text", value: string) => {
        if (!content) return;
        const newSections = [...content[category].sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setContent({
            ...content,
            [category]: {
                ...content[category],
                sections: newSections,
            },
        });
    };

    const addSection = (category: keyof LegalContent) => {
        if (!content) return;
        setContent({
            ...content,
            [category]: {
                ...content[category],
                sections: [...content[category].sections, { heading: "New Section", text: "" }],
            },
        });
    };

    const removeSection = (category: keyof LegalContent, index: number) => {
        if (!content) return;
        const newSections = content[category].sections.filter((_, i) => i !== index);
        setContent({
            ...content,
            [category]: {
                ...content[category],
                sections: newSections,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!content) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                Failed to load legal settings
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Legal Settings</h2>
                    <p className="text-muted-foreground">Manage legal pages content (Privacy, Terms, etc.)</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="btn-industrial">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save All Changes
                </Button>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
                {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((key) => {
                    const config = categoryConfig[key];
                    const category = content[key];
                    const Icon = config.icon;

                    return (
                        <AccordionItem key={key} value={key} className="border rounded-lg bg-background">
                            <AccordionTrigger className="px-6 hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-accent/10 rounded-lg">
                                        <Icon className="h-5 w-5 text-accent" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold">{config.label}</p>
                                        <p className="text-sm text-muted-foreground font-normal">{config.description}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <div className="space-y-6 pt-4">
                                    {/* Category Title & Last Updated */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Section Title</Label>
                                            <Input
                                                value={category.title}
                                                onChange={(e) => updateCategoryField(key, "title", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Last Updated</Label>
                                            <Input
                                                value={category.lastUpdated}
                                                onChange={(e) => updateCategoryField(key, "lastUpdated", e.target.value)}
                                                placeholder="e.g., January 2026"
                                            />
                                        </div>
                                    </div>

                                    {/* Sections */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-semibold">Content Sections</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addSection(key)}
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add Section
                                            </Button>
                                        </div>

                                        {category.sections.map((section, index) => (
                                            <Card key={index} className="border-dashed">
                                                <CardContent className="pt-4 space-y-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 space-y-2">
                                                            <Label>Heading</Label>
                                                            <Input
                                                                value={section.heading}
                                                                onChange={(e) => updateSection(key, index, "heading", e.target.value)}
                                                                placeholder="Section heading"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive mt-6"
                                                            onClick={() => removeSection(key, index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Content</Label>
                                                        <Textarea
                                                            value={section.text}
                                                            onChange={(e) => updateSection(key, index, "text", e.target.value)}
                                                            placeholder="Section content..."
                                                            rows={4}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>

            <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSave} disabled={isSaving} className="btn-industrial">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save All Changes
                </Button>
            </div>
        </div>
    );
}
