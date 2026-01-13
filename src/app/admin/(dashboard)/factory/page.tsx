"use client";

import { useState, useEffect, useRef } from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface FactoryPhoto {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    category: string | null;
    displayOrder: number | null;
    isActive: boolean | null;
}

const categories = [
    { value: "production", label: "Production Floor" },
    { value: "warehouse", label: "Warehouse" },
    { value: "quality-control", label: "Quality Control" },
    { value: "machinery", label: "Machinery" },
    { value: "office", label: "Office" },
    { value: "exterior", label: "Exterior" },
    { value: "team", label: "Our Team" },
    { value: "other", label: "Other" },
];

export default function FactoryPhotosPage() {
    const [photos, setPhotos] = useState<FactoryPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<FactoryPhoto | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        category: "production",
    });

    const fetchPhotos = async () => {
        try {
            const response = await fetch("/api/factory-photos?includeInactive=true");
            const result = await response.json();
            if (result.success) {
                setPhotos(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch photos:", error);
            toast.error("Failed to load photos");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleOpenDialog = (photo?: FactoryPhoto) => {
        if (photo) {
            setEditingPhoto(photo);
            setFormData({
                title: photo.title,
                description: photo.description || "",
                imageUrl: photo.imageUrl,
                category: photo.category || "production",
            });
        } else {
            setEditingPhoto(null);
            setFormData({
                title: "",
                description: "",
                imageUrl: "",
                category: "production",
            });
        }
        setIsDialogOpen(true);
    };



    const handleSave = async () => {
        if (!formData.title || !formData.imageUrl) {
            toast.error("Title and Image are required");
            return;
        }

        setIsSaving(true);
        try {
            const url = "/api/factory-photos";
            const method = editingPhoto ? "PUT" : "POST";
            const body = editingPhoto
                ? { ...formData, id: editingPhoto.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(editingPhoto ? "Photo updated!" : "Photo added!");
                setIsDialogOpen(false);
                fetchPhotos();
            } else {
                toast.error(result.error || "Failed to save");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this photo?")) return;

        try {
            const response = await fetch(`/api/factory-photos?id=${id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Photo deleted");
                fetchPhotos();
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleToggleActive = async (photo: FactoryPhoto) => {
        const previousState = photo.isActive;
        const newState = !photo.isActive;

        // Optimistic update - update UI immediately
        setPhotos((prevPhotos) =>
            prevPhotos.map((p) =>
                p.id === photo.id ? { ...p, isActive: newState } : p
            )
        );

        try {
            const response = await fetch("/api/factory-photos", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: photo.id,
                    isActive: newState,
                }),
            });
            const result = await response.json();

            if (result.success) {
                toast.success(newState ? "Photo visible" : "Photo hidden");
            } else {
                // Revert on failure
                setPhotos((prevPhotos) =>
                    prevPhotos.map((p) =>
                        p.id === photo.id ? { ...p, isActive: previousState } : p
                    )
                );
                toast.error("Failed to update");
            }
        } catch (error) {
            // Revert on error
            setPhotos((prevPhotos) =>
                prevPhotos.map((p) =>
                    p.id === photo.id ? { ...p, isActive: previousState } : p
                )
            );
            toast.error("An error occurred");
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Factory Photos</h1>
                    <p className="text-muted-foreground">
                        Manage photos displayed on the Our Factory page
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="btn-industrial" onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Photo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingPhoto ? "Edit Photo" : "Add New Photo"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    placeholder="e.g., Main Production Floor"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Image *</Label>
                                <ImageUpload
                                    currentImage={formData.imageUrl}
                                    onImageUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                    onImageRemoved={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                                    maxFiles={1}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, category: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Brief description of the photo..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || isUploading}
                                    className="btn-industrial"
                                >
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingPhoto ? "Update" : "Add Photo"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Photos Grid */}
            {photos.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-2">No photos yet</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Add photos to showcase your factory
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Photo
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((photo) => (
                        <Card
                            key={photo.id}
                            className={`overflow-hidden ${!photo.isActive ? "opacity-60" : ""}`}
                        >
                            <div className="relative h-48">
                                <img
                                    src={photo.imageUrl}
                                    alt={photo.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Image+Error";
                                    }}
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8"
                                        onClick={() => handleOpenDialog(photo)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="h-8 w-8"
                                        onClick={() => handleDelete(photo.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {photo.category && (
                                    <div className="absolute bottom-2 left-2">
                                        <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            {categories.find((c) => c.value === photo.category)?.label || photo.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold truncate">{photo.title}</h3>
                                    <Switch
                                        checked={photo.isActive ?? true}
                                        onCheckedChange={() => handleToggleActive(photo)}
                                    />
                                </div>
                                {photo.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {photo.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
