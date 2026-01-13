"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ImageIcon, X, Package } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ClothingType {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    images: string[] | null;
    minOrderQuantity: number | null;
    leadTime: string | null;
    sizeRange: string | null;
    displayOrder: number | null;
    isActive: boolean | null;
}

export default function CataloguePage() {
    const [types, setTypes] = useState<ClothingType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingType, setEditingType] = useState<ClothingType | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        images: [] as string[],
        minOrderQuantity: 500,
        leadTime: "3-5 Weeks",
        sizeRange: "XS-5XL",
        displayOrder: 0,
        isActive: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTypes = async () => {
        try {
            const response = await fetch("/api/catalogue/types?includeInactive=true");
            const result = await response.json();
            if (result.success) {
                setTypes(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch types:", error);
            toast.error("Failed to load catalogue types");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (name: string) => {
        setFormData((prev) => ({
            ...prev,
            name,
            slug: editingType ? prev.slug : generateSlug(name),
        }));
    };

    const openCreateDialog = () => {
        setEditingType(null);
        setFormData({
            name: "",
            slug: "",
            description: "",
            imageUrl: "",
            images: [],
            minOrderQuantity: 500,
            leadTime: "3-5 Weeks",
            sizeRange: "XS-5XL",
            displayOrder: types.length,
            isActive: true,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (type: ClothingType) => {
        setEditingType(type);

        // Handle migration logic for images
        let initialImages: string[] = [];
        if (type.images && type.images.length > 0) {
            initialImages = type.images;
        } else if (type.imageUrl) {
            initialImages = [type.imageUrl];
        }

        setFormData({
            name: type.name,
            slug: type.slug,
            description: type.description || "",
            imageUrl: type.imageUrl || "",
            images: initialImages,
            minOrderQuantity: type.minOrderQuantity || 500,
            leadTime: type.leadTime || "3-5 Weeks",
            sizeRange: type.sizeRange || "XS-5XL",
            displayOrder: type.displayOrder || 0,
            isActive: type.isActive ?? true,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingType
                ? `/api/catalogue/types/${editingType.id}`
                : "/api/catalogue/types";
            const method = editingType ? "PUT" : "POST";

            // Sync imageUrl with the first image of images array for backward compatibility
            const payload = {
                ...formData,
                imageUrl: formData.images.length > 0 ? formData.images[0] : null,
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(
                    editingType
                        ? "Type updated successfully"
                        : "Type created successfully"
                );
                setIsDialogOpen(false);
                fetchTypes();
            } else {
                toast.error(result.error || "Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this type?")) return;

        try {
            const response = await fetch(`/api/catalogue/types/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Type deleted successfully");
                fetchTypes();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Category Management</h1>
                    <p className="text-muted-foreground">
                        Manage product categories and manufacturing specifications
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog} className="btn-industrial">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                        <DialogHeader className="bg-primary px-6 py-4 border-b border-border flex flex-row items-center justify-between space-y-0">
                            <DialogTitle className="text-white uppercase tracking-wider text-base">
                                {editingType ? "Edit Category" : "Add New Category"}
                            </DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDialogOpen(false)}
                                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-none"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left Column - Image Upload (4 cols) */}
                                    <div className="lg:col-span-4 space-y-4">
                                        <div className="bg-muted/10 p-3 border border-border rounded-none">
                                            <Label className="uppercase text-xs font-bold text-muted-foreground mb-3 block">Category Image</Label>
                                            <ImageUpload
                                                currentImages={formData.images}
                                                onImagesChange={(urls) =>
                                                    setFormData((prev) => ({ ...prev, images: urls }))
                                                }
                                                multiple={false}
                                                maxFiles={1}
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-2">
                                                Upload category thumbnail.
                                                <br />
                                                Recommended size: 800x800px.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column - Form Fields (8 cols) */}
                                    <div className="lg:col-span-8 space-y-6">
                                        {/* Basic Info Section */}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-primary border-b border-border pb-2 mb-4">Basic Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="name" className="text-xs uppercase text-muted-foreground">Category Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => handleNameChange(e.target.value)}
                                                        placeholder="e.g., T-Shirts & Polos"
                                                        required
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="slug" className="text-xs uppercase text-muted-foreground">URL Slug *</Label>
                                                    <Input
                                                        id="slug"
                                                        value={formData.slug}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({ ...prev, slug: e.target.value }))
                                                        }
                                                        placeholder="e.g., t-shirts-polos"
                                                        required
                                                        className="h-9 font-mono text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 space-y-1.5">
                                                <Label htmlFor="description" className="text-xs uppercase text-muted-foreground">Category Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            description: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Detailed category description..."
                                                    rows={4}
                                                    className="resize-none max-h-[120px] overflow-y-auto"
                                                />
                                            </div>
                                        </div>

                                        {/* Specs Section */}


                                        {/* Visibility Section */}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-primary border-b border-border pb-2 mb-4">Visibility & Ordering</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="displayOrder" className="text-xs uppercase text-muted-foreground">Display Order</Label>
                                                    <Input
                                                        id="displayOrder"
                                                        type="number"
                                                        value={formData.displayOrder}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                displayOrder: parseInt(e.target.value) || 0,
                                                            }))
                                                        }
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs uppercase text-muted-foreground block">Status</Label>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant={formData.isActive ? "default" : "outline"}
                                                            onClick={() =>
                                                                setFormData((prev) => ({ ...prev, isActive: true }))
                                                            }
                                                            className="flex-1 h-9"
                                                        >
                                                            Active
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant={!formData.isActive ? "default" : "outline"}
                                                            onClick={() =>
                                                                setFormData((prev) => ({ ...prev, isActive: false }))
                                                            }
                                                            className="flex-1 h-9"
                                                        >
                                                            Hidden
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/20 px-6 py-4 border-t border-border flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-industrial min-w-[120px]"
                                >
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {editingType ? "Save Category" : "Create Category"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Clothing Types Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : types.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No categories yet</p>
                            <p className="text-sm">
                                Click &quot;Add Category&quot; to get started
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead>Name</TableHead>

                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {types.map((type) => (
                                    <TableRow key={type.id}>
                                        <TableCell>
                                            {type.imageUrl ? (
                                                <div className="relative h-10 w-14 rounded overflow-hidden bg-muted group">
                                                    <Image
                                                        src={type.imageUrl}
                                                        alt={type.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {type.images && type.images.length > 1 && (
                                                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1">
                                                            +{type.images.length - 1}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{type.name}</TableCell>

                                        <TableCell>
                                            <Badge variant={type.isActive ? "default" : "secondary"}>
                                                {type.isActive ? "Active" : "Hidden"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/catalogue/${type.id}`}>
                                                    <Button variant="ghost" size="icon" title="Manage Products">
                                                        <Package className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(type)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(type.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
