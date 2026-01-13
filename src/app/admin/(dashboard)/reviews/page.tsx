"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Loader2,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff,
    Trash2,
    Star,
    MessageSquare,
    Filter,
    Quote,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import { format } from "date-fns";

interface Review {
    id: string;
    name: string;
    company: string | null;
    email: string | null;
    rating: number;
    message: string;
    status: "pending" | "approved" | "rejected";
    isVisible: boolean;
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalPages = Math.ceil(totalReviews / pageSize);

    useEffect(() => {
        fetchReviews();
    }, [currentPage, pageSize, filter]);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                admin: "true",
                page: currentPage.toString(),
                limit: pageSize.toString(),
            });

            if (filter !== "all") {
                params.append("status", filter);
            }

            const res = await fetch(`/api/reviews?${params}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
                setTotalReviews(data.pagination?.total || 0);
            } else {
                toast.error("Failed to fetch reviews");
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Error loading reviews");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
        try {
            const res = await fetch(`/api/reviews/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Review ${status} successfully`);
                fetchReviews();
                if (selectedReview?.id === id) {
                    setSelectedReview(prev => prev ? { ...prev, status } : null);
                }
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const handleVisibilityToggle = async (id: string, currentVisibility: boolean) => {
        try {
            const res = await fetch(`/api/reviews/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVisible: !currentVisibility }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Review is now ${!currentVisibility ? "visible" : "hidden"}`);
                fetchReviews();
                if (selectedReview?.id === id) {
                    setSelectedReview(prev => prev ? { ...prev, isVisible: !currentVisibility } : null);
                }
            } else {
                toast.error("Failed to update visibility");
            }
        } catch (error) {
            toast.error("Error updating visibility");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/reviews/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Review deleted successfully");
                fetchReviews();
                setIsDetailsOpen(false);
            } else {
                toast.error("Failed to delete review");
            }
        } catch (error) {
            toast.error("Error deleting review");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Reviews</h1>
                    <p className="text-muted-foreground">Manage and moderate customer testimonials.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="bg-background border border-input rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value as any);
                            setCurrentPage(1); // Reset to first page when filter changes
                        }}
                    >
                        <option value="all">All Reviews</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="border rounded-lg bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Reviewer</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="max-w-[300px]">Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell className="whitespace-nowrap font-mono text-xs">
                                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{review.name}</div>
                                        {review.company && (
                                            <div className="text-xs text-muted-foreground">{review.company}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-accent text-accent" />
                                            <span className="font-medium">{review.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <p className="truncate text-muted-foreground text-sm" title={review.message}>
                                            {review.message}
                                        </p>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                                    <TableCell>
                                        {review.isVisible ? (
                                            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Visible</Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-muted text-muted-foreground">Hidden</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedReview(review);
                                                    setIsDetailsOpen(true);
                                                }}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {review.status !== "approved" && (
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(review.id, "approved")}>
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Approve
                                                    </DropdownMenuItem>
                                                )}
                                                {review.status !== "rejected" && (
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(review.id, "rejected")}>
                                                        <XCircle className="mr-2 h-4 w-4 text-red-600" /> Reject
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => handleVisibilityToggle(review.id, review.isVisible)}>
                                                    {review.isVisible ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4" /> Hide from Site
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" /> Show on Site
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(review.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 py-4">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {reviews.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} to {Math.min(currentPage * pageSize, totalReviews)} of {totalReviews} reviews
                    </div>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1 || isLoading}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                        Page {currentPage} of {totalPages || 1}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages || isLoading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage >= totalPages || isLoading}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Review Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                        <DialogDescription>
                            Submitted on {selectedReview && format(new Date(selectedReview.createdAt), "PPP 'at' p")}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedReview && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">{selectedReview.name}</h3>
                                    {selectedReview.company && (
                                        <p className="text-muted-foreground flex items-center gap-2">
                                            <Building2 className="h-4 w-4" /> {selectedReview.company}
                                        </p>
                                    )}
                                    {selectedReview.email && (
                                        <p className="text-muted-foreground text-sm">{selectedReview.email}</p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {getStatusBadge(selectedReview.status)}
                                    <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                                        <Star className="h-4 w-4 fill-accent text-accent" />
                                        <span className="font-bold text-accent">{selectedReview.rating}/5</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border border-border">
                                <Quote className="h-6 w-6 text-muted-foreground/30 mb-2" />
                                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                    {selectedReview.message}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Visibility:</span>
                                    {selectedReview.isVisible ? (
                                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Visible on Site</Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-muted text-muted-foreground">Hidden</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        {selectedReview && (
                            <>
                                <div className="flex gap-2 mr-auto">
                                    {selectedReview.status !== "approved" && (
                                        <Button
                                            variant="outline"
                                            className="border-green-200 hover:bg-green-50 text-green-700"
                                            onClick={() => handleStatusUpdate(selectedReview.id, "approved")}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                    )}
                                    {selectedReview.status !== "rejected" && (
                                        <Button
                                            variant="outline"
                                            className="border-red-200 hover:bg-red-50 text-red-700"
                                            onClick={() => handleStatusUpdate(selectedReview.id, "rejected")}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    )}
                                </div>
                                <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>
                                    Close
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function Building2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    )
}
