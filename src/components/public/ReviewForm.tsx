"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function ReviewForm() {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            company: formData.get("company"),
            email: formData.get("email"),
            message: formData.get("message"),
            rating: rating,
        };

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.success) {
                setIsSuccess(true);
                toast.success("Review submitted successfully!");
            } else {
                toast.error(result.error || "Failed to submit review");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-12 space-y-4">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Thank You!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We appreciate you taking the time to share your feedback with us.
                </p>
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsSuccess(false);
                        setRating(5);
                    }}
                    className="mt-6"
                >
                    Submit Another Review
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`h-8 w-8 ${star <= (hoverRating || rating)
                                    ? "text-accent fill-accent"
                                    : "text-muted-foreground/30"
                                    } transition-colors duration-200`}
                            />
                        </button>
                    ))}
                </div>
                <input type="hidden" name="rating" value={rating} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" name="company" placeholder="Acme Corp" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                <p className="text-xs text-muted-foreground">We won't publish your email address.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Your Review *</Label>
                <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Share your experience working with us..."
                    rows={5}
                />
            </div>

            <Button type="submit" className="w-full btn-industrial" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Review
                    </>
                )}
            </Button>
        </form>
    );
}
