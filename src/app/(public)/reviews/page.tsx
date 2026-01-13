import { getPublicReviews } from "@/lib/services/reviews";
import { Star, Quote, User, Building2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewForm } from "@/components/public/ReviewForm";

export const metadata = {
    title: "Customer Reviews | Anshuukam Textile",
    description: "Read what our clients say about their experience working with Anshuukam Textile.",
};

export default async function ReviewsPage() {
    const reviews = await getPublicReviews();

    return (
        <div className="min-h-screen bg-blueprint relative">
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />

            {/* Page Header */}
            <section className="relative bg-primary text-primary-foreground py-16 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-fabric-pattern opacity-10" />
                <div className="absolute inset-0 bg-steel-plate opacity-5 mix-blend-overlay" />

                <div className="container-industrial relative z-10 text-center">
                    <div className="section-tag mb-4 text-white/80 border-white/20 inline-block">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        TESTIMONIALS
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 font-serif-display tracking-wide">
                        Client Experiences
                    </h1>
                    <p className="text-lg text-primary-foreground/70 font-light max-w-2xl mx-auto leading-relaxed font-mono">
                        Discover why businesses trust Anshuukam Textile for their manufacturing needs.
                    </p>
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="section-industrial">
                <div className="container-industrial">
                    {reviews.length === 0 ? (
                        <div className="text-center py-12 bg-background/50 rounded-lg border border-dashed border-border">
                            <Quote className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Be the First to Review</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                We haven't published any reviews yet. Share your experience and help others choose quality.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            {reviews.map((review) => (
                                <Card key={review.id} className="card-factory bg-background h-full flex flex-col">
                                    <CardContent className="p-6 flex-1 flex flex-col">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating
                                                            ? "text-accent fill-accent"
                                                            : "text-muted-foreground/30"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="relative flex-1">
                                            <Quote className="absolute -top-2 -left-2 h-8 w-8 text-accent/10 rotate-180" />
                                            <p className="text-muted-foreground leading-relaxed relative z-10 pl-4">
                                                "{review.message}"
                                            </p>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{review.name}</p>
                                                {review.company && (
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />
                                                        {review.company}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Submission Form Section */}
            <section className="bg-muted/30 py-16 border-t border-border" id="submit-review">
                <div className="container-industrial">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif-display">Share Your Experience</h2>
                            <p className="text-muted-foreground">
                                Your feedback helps us improve and helps others make informed decisions.
                            </p>
                        </div>

                        <div className="card-factory bg-background p-8">
                            <ReviewForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
