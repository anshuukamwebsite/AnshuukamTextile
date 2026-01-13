"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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
import { Plus, Pencil, Trash2, Loader2, ImageIcon, X, ArrowLeft } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Category {
    id: string;
    name: string;
}

interface Fabric {
    id: string;
    name: string;
}

interface CatalogueImage {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
}

interface CatalogueItem {
    id: string;
    clothingTypeId: string;
    name: string;
    slug: string;
    description: string | null;
    minOrderQuantity: number | null;
    leadTime: string | null;
    sizeRange: string | null;
    displayOrder: number | null;
    isActive: boolean | null;
    availableFabrics?: string[];
    images?: CatalogueImage[];
    isCustomizable?: boolean;
    colors?: CatalogueItemColor[];
}

interface CatalogueItemColor {
    id?: string;
    name: string;
    hex: string;
    frontImageUrl: string;
    backImageUrl: string;
    sideImageUrl: string;
}

export default function CategoryProductsPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.id as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [items, setItems] = useState<CatalogueItem[]>([]);
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CatalogueItem | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        images: [] as string[],
        minOrderQuantity: 100,
        leadTime: "3-4 Weeks",
        sizeRange: "XS-5XL",
        displayOrder: 0,
        isActive: true,
        isCustomizable: false,
        availableFabrics: [] as string[],
        colors: [] as CatalogueItemColor[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchItems = async () => {
        try {
            const itemsResponse = await fetch(`/api/catalogue/items?clothingTypeId=${categoryId}&includeInactive=true`);
            const itemsResult = await itemsResponse.json();
            if (itemsResult.success) {
                setItems(itemsResult.data);
            }
        } catch (error) {
            console.error("Failed to fetch items:", error);
        }
    };

    const fetchFabrics = async () => {
        try {
            const response = await fetch("/api/catalogue/fabrics");
            const result = await response.json();
            if (result.success) {
                setFabrics(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch fabrics:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch category details
                const catResponse = await fetch(`/api/catalogue/types/${categoryId}`);
                const catResult = await catResponse.json();
                if (catResult.success) {
                    setCategory(catResult.data);
                } else {
                    toast.error("Category not found");
                    router.push("/admin/catalogue");
                    return;
                }

                await fetchItems();
                await fetchFabrics();
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        if (categoryId) {
            fetchData();
        }
    }, [categoryId, router]);

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
            slug: editingItem ? prev.slug : generateSlug(name),
        }));
    };

    const openCreateDialog = () => {
        setEditingItem(null);
        setFormData({
            name: "",
            slug: "",
            description: "",
            images: [],
            minOrderQuantity: 100,
            leadTime: "3-4 Weeks",
            sizeRange: "XS-5XL",
            displayOrder: items.length,
            isActive: true,
            isCustomizable: false,
            availableFabrics: [],
            colors: [],
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: CatalogueItem) => {
        setEditingItem(item);

        // Extract image URLs from item.images relation
        const imageUrls = item.images
            ? item.images.map(img => img.imageUrl)
            : [];

        setFormData({
            name: item.name,
            slug: item.slug,
            description: item.description || "",
            images: imageUrls,
            minOrderQuantity: item.minOrderQuantity || 100,
            leadTime: item.leadTime || "3-4 Weeks",
            sizeRange: item.sizeRange || "XS-5XL",
            displayOrder: item.displayOrder || 0,
            isActive: item.isActive ?? true,
            isCustomizable: item.isCustomizable ?? false,
            availableFabrics: item.availableFabrics || [],
            colors: item.colors || [],
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingItem
                ? `/api/catalogue/items/${editingItem.id}`
                : "/api/catalogue/items";
            const method = editingItem ? "PUT" : "POST";

            const payload = {
                ...formData,
                clothingTypeId: categoryId,
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(
                    editingItem
                        ? "Product updated successfully"
                        : "Product created successfully"
                );
                setIsDialogOpen(false);
                fetchItems();
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
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`/api/catalogue/items/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Product deleted successfully");
                fetchItems();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Link href="/admin/catalogue" className="hover:text-foreground transition-colors flex items-center gap-1 text-sm">
                            <ArrowLeft className="h-3 w-3" />
                            Back to Categories
                        </Link>
                        <span className="text-border">/</span>
                        <span className="text-foreground font-medium">{category?.name}</span>
                    </div>
                    <h1 className="text-2xl font-bold">Manage Products</h1>
                    <p className="text-muted-foreground">
                        Add and edit products for {category?.name}
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog} className="btn-industrial">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[95vw] w-[95vw] max-h-[95vh] overflow-y-auto p-0 gap-0">
                        <DialogHeader className="bg-primary px-6 py-4 border-b border-border flex flex-row items-center justify-between space-y-0">
                            <DialogTitle className="text-white uppercase tracking-wider text-base">
                                {editingItem ? "Edit Product" : "Add New Product"}
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
                                            <Label className="uppercase text-xs font-bold text-muted-foreground mb-3 block">Product Images</Label>
                                            <ImageUpload
                                                currentImages={formData.images}
                                                onImagesChange={(urls) =>
                                                    setFormData((prev) => ({ ...prev, images: urls }))
                                                }
                                                multiple={true}
                                                maxFiles={6}
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-2">
                                                Upload up to 6 images. First image is the main thumbnail.
                                                <br />
                                                Recommended size: 800x1000px.
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
                                                    <Label htmlFor="name" className="text-xs uppercase text-muted-foreground">Product Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => handleNameChange(e.target.value)}
                                                        placeholder="e.g., Slim Fit Cotton Kurti"
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
                                                        placeholder="e.g., slim-fit-cotton-kurti"
                                                        required
                                                        className="h-9 font-mono text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 space-y-1.5">
                                                <Label htmlFor="description" className="text-xs uppercase text-muted-foreground">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            description: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Detailed product description..."
                                                    rows={4}
                                                    className="resize-none max-h-[120px] overflow-y-auto"
                                                />
                                            </div>
                                        </div>

                                        {/* Specs Section */}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-primary border-b border-border pb-2 mb-4">Manufacturing Specs</h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="minOrderQuantity" className="text-xs uppercase text-muted-foreground">MOQ</Label>
                                                    <Input
                                                        id="minOrderQuantity"
                                                        type="number"
                                                        value={formData.minOrderQuantity}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                minOrderQuantity: parseInt(e.target.value) || 0,
                                                            }))
                                                        }
                                                        placeholder="100"
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="leadTime" className="text-xs uppercase text-muted-foreground">Lead Time</Label>
                                                    <Input
                                                        id="leadTime"
                                                        value={formData.leadTime}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                leadTime: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="3-4 Weeks"
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="sizeRange" className="text-xs uppercase text-muted-foreground">Size Range</Label>
                                                    <Input
                                                        id="sizeRange"
                                                        value={formData.sizeRange}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                sizeRange: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="XS-5XL"
                                                        className="h-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>

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

                                        {/* Fabrics Section */}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-primary border-b border-border pb-2 mb-4">Available Fabrics</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto p-2 border border-border rounded bg-muted/5">
                                                {fabrics.map((fabric) => (
                                                    <div key={fabric.id} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`fabric-${fabric.id}`}
                                                            checked={formData.availableFabrics.includes(fabric.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        availableFabrics: [...prev.availableFabrics, fabric.id]
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        availableFabrics: prev.availableFabrics.filter(id => id !== fabric.id)
                                                                    }));
                                                                }
                                                            }}
                                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        />
                                                        <Label htmlFor={`fabric-${fabric.id}`} className="text-sm font-normal cursor-pointer">
                                                            {fabric.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-2">
                                                Select fabrics available for this product. If none selected, all fabrics may be considered available.
                                            </p>
                                        </div>

                                        {/* Customization Section */}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase text-primary border-b border-border pb-2 mb-4">Customization & Variants</h4>

                                            <div className="flex items-center space-x-2 mb-6 p-3 bg-muted/20 rounded border border-border">
                                                <input
                                                    type="checkbox"
                                                    id="isCustomizable"
                                                    checked={formData.isCustomizable}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isCustomizable: e.target.checked }))}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="isCustomizable" className="text-sm font-medium cursor-pointer block">
                                                        Enable Design Tool Customization
                                                    </Label>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        If enabled, this product will appear in the public Design Studio.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 bg-muted/10 p-4 border border-border rounded">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs uppercase text-muted-foreground">Product Colors & Views</Label>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            const newColor: CatalogueItemColor = {
                                                                name: "New Color",
                                                                hex: "#000000",
                                                                frontImageUrl: "",
                                                                backImageUrl: "",
                                                                sideImageUrl: ""
                                                            };
                                                            setFormData(prev => ({ ...prev, colors: [...prev.colors, newColor] }));
                                                        }}
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" /> Add Color
                                                    </Button>
                                                </div>

                                                <div className="space-y-4">
                                                    {formData.colors.map((color, index) => (
                                                        <div key={index} className="bg-background p-3 rounded border border-border space-y-3">
                                                            <div className="flex gap-3">
                                                                <div className="flex-1 space-y-1">
                                                                    <Label className="text-[10px] uppercase">Color Name</Label>
                                                                    <Input
                                                                        value={color.name}
                                                                        onChange={(e) => {
                                                                            const newColors = [...formData.colors];
                                                                            newColors[index].name = e.target.value;
                                                                            setFormData(prev => ({ ...prev, colors: newColors }));
                                                                        }}
                                                                        className="h-8 text-xs"
                                                                        placeholder="e.g. Navy Blue"
                                                                    />
                                                                </div>
                                                                <div className="w-24 space-y-1">
                                                                    <Label className="text-[10px] uppercase">Hex Code</Label>
                                                                    <div className="flex gap-1">
                                                                        <Input
                                                                            type="color"
                                                                            value={color.hex}
                                                                            onChange={(e) => {
                                                                                const newColors = [...formData.colors];
                                                                                newColors[index].hex = e.target.value;
                                                                                setFormData(prev => ({ ...prev, colors: newColors }));
                                                                            }}
                                                                            className="h-8 w-8 p-0 border-0"
                                                                        />
                                                                        <Input
                                                                            value={color.hex}
                                                                            onChange={(e) => {
                                                                                const newColors = [...formData.colors];
                                                                                newColors[index].hex = e.target.value;
                                                                                setFormData(prev => ({ ...prev, colors: newColors }));
                                                                            }}
                                                                            className="h-8 text-xs flex-1"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-destructive mt-6"
                                                                    onClick={() => {
                                                                        const newColors = formData.colors.filter((_, i) => i !== index);
                                                                        setFormData(prev => ({ ...prev, colors: newColors }));
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase">Front View</Label>
                                                                    <ImageUpload
                                                                        currentImages={color.frontImageUrl ? [color.frontImageUrl] : []}
                                                                        onImagesChange={(urls) => {
                                                                            const newColors = [...formData.colors];
                                                                            newColors[index].frontImageUrl = urls[0] || "";
                                                                            setFormData(prev => ({ ...prev, colors: newColors }));
                                                                        }}
                                                                        multiple={false}
                                                                        maxFiles={1}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase">Back View</Label>
                                                                    <ImageUpload
                                                                        currentImages={color.backImageUrl ? [color.backImageUrl] : []}
                                                                        onImagesChange={(urls) => {
                                                                            const newColors = [...formData.colors];
                                                                            newColors[index].backImageUrl = urls[0] || "";
                                                                            setFormData(prev => ({ ...prev, colors: newColors }));
                                                                        }}
                                                                        multiple={false}
                                                                        maxFiles={1}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase">Side View</Label>
                                                                    <ImageUpload
                                                                        currentImages={color.sideImageUrl ? [color.sideImageUrl] : []}
                                                                        onImagesChange={(urls) => {
                                                                            const newColors = [...formData.colors];
                                                                            newColors[index].sideImageUrl = urls[0] || "";
                                                                            setFormData(prev => ({ ...prev, colors: newColors }));
                                                                        }}
                                                                        multiple={false}
                                                                        maxFiles={1}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {formData.colors.length === 0 && (
                                                        <div className="text-center py-4 text-muted-foreground text-xs italic">
                                                            No colors added yet. Add colors to enable customization for this product.
                                                        </div>
                                                    )}
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
                                    {editingItem ? "Save Changes" : "Create Product"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No products yet</p>
                            <p className="text-sm">
                                Click &quot;Add Product&quot; to get started
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>MOQ</TableHead>
                                    <TableHead>Lead Time</TableHead>
                                    <TableHead>Sizes</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => {
                                    const primaryImage = item.images?.find(img => img.isPrimary)?.imageUrl || item.images?.[0]?.imageUrl;
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {primaryImage ? (
                                                    <div className="relative h-10 w-14 rounded overflow-hidden bg-muted group">
                                                        <img
                                                            src={primaryImage}
                                                            alt={item.name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                        {item.images && item.images.length > 1 && (
                                                            <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1">
                                                                +{item.images.length - 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.minOrderQuantity || 100}+</TableCell>
                                            <TableCell>{item.leadTime || "3-4 Weeks"}</TableCell>
                                            <TableCell>{item.sizeRange || "XS-5XL"}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.isActive ? "default" : "secondary"}>
                                                    {item.isActive ? "Active" : "Hidden"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditDialog(item)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
