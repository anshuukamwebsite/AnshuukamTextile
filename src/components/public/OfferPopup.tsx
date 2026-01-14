"use client";

import { useState, useEffect } from "react";
import { X, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Offer {
    isActive: boolean;
    title: string;
    description: string;
    linkUrl?: string;
    linkText?: string;
}

export function OfferPopup() {
    const [offer, setOffer] = useState<Offer | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await fetch("/api/settings?key=current_offer");
                const data = await res.json();

                if (data.success && data.data) {
                    const offerData = data.data as Offer;

                    // Check if offer is active and user hasn't dismissed it in this session
                    if (offerData.isActive && offerData.title) {
                        const dismissedOfferKey = `offer_dismissed_${offerData.title}`;
                        const hasDismissed = sessionStorage.getItem(dismissedOfferKey);

                        if (!hasDismissed) {
                            setOffer(offerData);
                            // Small delay before showing popup for better UX
                            setTimeout(() => setIsVisible(true), 1000);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch offer:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffer();
    }, []);

    const handleClose = () => {
        setIsVisible(false);

        // Mark this offer as dismissed for the session
        if (offer?.title) {
            sessionStorage.setItem(`offer_dismissed_${offer.title}`, "true");
        }
    };

    if (isLoading || !offer || !isVisible) {
        return null;
    }

    // Check if linkUrl exists and is not empty
    const hasLink = offer.linkUrl && offer.linkUrl.trim().length > 0;

    return (
        <div
            style={{
                position: 'fixed',
                top: '74px', // Just below the header (header is ~64px + 10px gap)
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 99999,
                width: '100%',
                maxWidth: '600px',
                padding: '0 16px',
            }}
        >
            <div
                className="relative bg-gradient-to-r from-accent to-accent/90 text-white rounded-lg shadow-2xl p-4 animate-in slide-in-from-top duration-500"
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Close offer"
                >
                    <X className="h-4 w-4 text-white" />
                </button>

                {/* Offer content */}
                <div className="flex items-center gap-4 pr-8">
                    {/* Icon */}
                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/20 items-center justify-center flex-shrink-0">
                        <Tag className="h-5 w-5 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base truncate">{offer.title}</h3>
                        <p className="text-white/90 text-xs sm:text-sm truncate">{offer.description}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {hasLink && (
                            <Link
                                href={offer.linkUrl!}
                                onClick={handleClose}
                                className="flex items-center gap-1 bg-white text-accent px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
                            >
                                {offer.linkText || "View Offer"}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                        <button
                            onClick={handleClose}
                            className="text-white/80 hover:text-white text-xs sm:text-sm font-medium px-2 py-1.5 hover:bg-white/10 rounded-md transition-colors whitespace-nowrap"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
