"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Tag } from "lucide-react";

interface Offer {
    isActive: boolean;
    title: string;
    description: string;
    linkUrl: string;
    linkText: string;
}

const defaultOffer: Offer = {
    isActive: false,
    title: "",
    description: "",
    linkUrl: "",
    linkText: "",
};

export default function OffersPage() {
    const [offer, setOffer] = useState<Offer>(defaultOffer);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await fetch("/api/settings?key=current_offer");
                const data = await res.json();

                if (data.success && data.data) {
                    setOffer(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch offer:", error);
                toast.error("Failed to load offer settings");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffer();
    }, []);

    const handleSaveOffer = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "current_offer",
                    value: offer,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Offer saved successfully");
            } else {
                toast.error(result.error || "Failed to save offer");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
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
                <h1 className="text-2xl font-bold">Offers & Promotions</h1>
                <p className="text-muted-foreground">
                    Create popup offers that visitors will see when they visit the site
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Current Offer
                    </CardTitle>
                    <CardDescription>
                        Configure the popup offer that visitors will see once per session
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                        <div>
                            <Label htmlFor="offer_active" className="text-base font-medium">Offer Active</Label>
                            <p className="text-sm text-muted-foreground">
                                When enabled, visitors will see this offer popup once per session
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="offer_active"
                                checked={offer.isActive}
                                onChange={(e) => setOffer((prev) => ({ ...prev, isActive: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                    </div>

                    {/* Status Indicator */}
                    <div className={`p-3 rounded-lg border ${offer.isActive ? "bg-green-50 border-green-200 text-green-800" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${offer.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                            <span className="text-sm font-medium">
                                {offer.isActive ? "Offer is live and visible to visitors" : "Offer is currently disabled"}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="offer_title">Offer Title *</Label>
                            <Input
                                id="offer_title"
                                value={offer.title}
                                onChange={(e) => setOffer((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., 20% Off on Bulk Orders!"
                            />
                            <p className="text-xs text-muted-foreground">
                                The main headline of your offer
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="offer_description">Offer Description *</Label>
                            <Input
                                id="offer_description"
                                value={offer.description}
                                onChange={(e) => setOffer((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="e.g., Order 1000+ pieces and get 20% discount on your first order. Limited time offer!"
                            />
                            <p className="text-xs text-muted-foreground">
                                Details about the offer
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="offer_link">Link URL (Optional)</Label>
                                <Input
                                    id="offer_link"
                                    value={offer.linkUrl}
                                    onChange={(e) => setOffer((prev) => ({ ...prev, linkUrl: e.target.value }))}
                                    placeholder="e.g., /enquiry or /catalogue"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Page to redirect when user clicks the offer button
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="offer_link_text">Button Text (Optional)</Label>
                                <Input
                                    id="offer_link_text"
                                    value={offer.linkText}
                                    onChange={(e) => setOffer((prev) => ({ ...prev, linkText: e.target.value }))}
                                    placeholder="e.g., Claim Offer"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Text for the call-to-action button (default: &quot;View Offer&quot;)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                        <Button
                            onClick={handleSaveOffer}
                            disabled={isSaving || !offer.title || !offer.description}
                            className="btn-industrial"
                        >
                            {isSaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Offer
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Card */}
            {offer.title && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Preview</CardTitle>
                        <CardDescription>
                            This is how the offer will appear to visitors
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gradient-to-r from-accent to-accent/90 text-white rounded-lg p-4 max-w-xl">
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/20 items-center justify-center flex-shrink-0">
                                    <Tag className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm sm:text-base truncate">{offer.title}</h3>
                                    <p className="text-white/90 text-xs sm:text-sm truncate">{offer.description}</p>
                                </div>
                                {offer.linkUrl && (
                                    <span className="flex-shrink-0 flex items-center gap-1 bg-white text-accent px-3 py-1.5 rounded-md text-sm font-medium">
                                        {offer.linkText || "View Offer"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
