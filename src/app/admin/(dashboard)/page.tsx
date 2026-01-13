"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    Layers,
    MessageSquare,
    TrendingUp,
    Clock,
    ArrowRight,
    Loader2,
} from "lucide-react";

interface Stats {
    totalEnquiries: number;
    pendingEnquiries: number;
    catalogueItems: number;
    fabrics: number;
}

interface Enquiry {
    id: string;
    companyName: string | null;
    clothingTypeName?: string | null; // For standard enquiries
    fabricName?: string | null; // For design enquiries
    quantity: number;
    status: string | null;
    createdAt: string;
    type: "standard" | "design";
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalEnquiries: 0,
        pendingEnquiries: 0,
        catalogueItems: 0,
        fabrics: 0,
    });
    const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            try {
                const [typesRes, fabricsRes, enquiriesRes, designEnquiriesRes] = await Promise.all([
                    fetch("/api/catalogue/types?includeInactive=true"),
                    fetch("/api/catalogue/fabrics?includeInactive=true"),
                    fetch("/api/enquiries"),
                    fetch("/api/design-enquiries"),
                ]);

                const typesData = await typesRes.json();
                const fabricsData = await fabricsRes.json();
                const enquiriesData = await enquiriesRes.json();
                const designEnquiriesData = await designEnquiriesRes.json();

                const standardEnquiries = enquiriesData.success ? enquiriesData.data.map((e: any) => ({ ...e, type: "standard" })) : [];
                const designEnquiries = designEnquiriesData.success ? designEnquiriesData.data.map((e: any) => ({ ...e, type: "design" })) : [];

                const allEnquiries = [...standardEnquiries, ...designEnquiries].sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                const pendingCount = allEnquiries.filter((e: Enquiry) => e.status === "pending").length;

                setStats({
                    totalEnquiries: allEnquiries.length,
                    pendingEnquiries: pendingCount,
                    catalogueItems: typesData.success ? typesData.data.length : 0,
                    fabrics: fabricsData.success ? fabricsData.data.length : 0,
                });

                // Get recent 5 enquiries
                setRecentEnquiries(allEnquiries.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const statsCards = [
        {
            title: "Total Enquiries",
            value: stats.totalEnquiries.toString(),
            change: stats.totalEnquiries === 0 ? "No enquiries yet" : "All time",
            icon: MessageSquare,
        },
        {
            title: "Pending",
            value: stats.pendingEnquiries.toString(),
            change: "Awaiting response",
            icon: Clock,
        },
        {
            title: "Catalogue Items",
            value: stats.catalogueItems.toString(),
            change: "Clothing types",
            icon: Package,
        },
        {
            title: "Fabrics",
            value: stats.fabrics.toString(),
            change: "Materials available",
            icon: Layers,
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your manufacturing website
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-280px)] min-h-[400px]">
                {/* Recent Enquiries - Takes up 2/3 width */}
                <Card className="lg:col-span-2 flex flex-col overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-border bg-muted/20">
                        <div>
                            <CardTitle className="text-base">Recent Enquiries</CardTitle>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/admin/enquiries">
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                    Enquiries
                                </Button>
                            </Link>
                            <Link href="/admin/design-enquiries">
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                    Designs
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-0">
                        {recentEnquiries.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No enquiries yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {recentEnquiries.map((enquiry) => (
                                    <div
                                        key={enquiry.id}
                                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                {enquiry.companyName || "Unknown Company"}
                                                {enquiry.type === "design" && <Badge variant="outline" className="ml-2 text-[10px] h-4">Design</Badge>}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {enquiry.type === "design" ? (enquiry.fabricName || "Custom Design") : (enquiry.clothingTypeName || "Product")} · {enquiry.quantity.toLocaleString()} units
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                variant={enquiry.status === "pending" ? "default" : "secondary"}
                                                className="text-[10px] px-1.5 py-0 h-5"
                                            >
                                                {enquiry.status || "pending"}
                                            </Badge>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {new Date(enquiry.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions - Takes up 1/3 width */}
                <div className="space-y-4">
                    <Card className="hover:border-accent transition-colors cursor-pointer h-full">
                        <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <Link href="/admin/catalogue" className="block">
                                <div className="flex items-center gap-3 p-3 border border-border rounded hover:bg-muted transition-colors">
                                    <div className="p-2 bg-accent/10 rounded">
                                        <Package className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">Manage Catalogue</h3>
                                        <p className="text-xs text-muted-foreground">Add/edit products</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin/enquiries" className="block">
                                <div className="flex items-center gap-3 p-3 border border-border rounded hover:bg-muted transition-colors">
                                    <div className="p-2 bg-accent/10 rounded">
                                        <MessageSquare className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">View Enquiries</h3>
                                        <p className="text-xs text-muted-foreground">Respond to requests</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin/settings" className="block">
                                <div className="flex items-center gap-3 p-3 border border-border rounded hover:bg-muted transition-colors">
                                    <div className="p-2 bg-accent/10 rounded">
                                        <TrendingUp className="h-4 w-4 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">Site Settings</h3>
                                        <p className="text-xs text-muted-foreground">Customize content</p>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
