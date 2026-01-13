"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Loader2, ImageIcon, Plus } from "lucide-react";

interface ImageUploadProps {
    currentImages?: string[]; // Changed to array
    currentImage?: string | null; // Backward compatibility
    onImagesChange?: (urls: string[]) => void; // New callback
    onImageUploaded?: (url: string) => void; // Backward compatibility
    onImageRemoved?: () => void; // Backward compatibility
    className?: string;
    maxFiles?: number;
    multiple?: boolean;
}

const DEFAULT_IMAGES: string[] = [];

export function ImageUpload({
    currentImages = DEFAULT_IMAGES,
    currentImage,
    onImagesChange,
    onImageUploaded,
    onImageRemoved,
    className = "",
    maxFiles = 1,
    multiple = false,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [shouldCompress, setShouldCompress] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const newImages = currentImages.length > 0
            ? currentImages
            : currentImage
                ? [currentImage]
                : [];

        setImages(prev => {
            if (JSON.stringify(prev) === JSON.stringify(newImages)) {
                return prev;
            }
            return newImages;
        });
    }, [currentImages, currentImage]);

    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image(); // Use window.Image to avoid conflict with next/image
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                        if (width > height) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        } else {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error("Failed to get canvas context"));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error("Compression failed"));
                            return;
                        }
                        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.7);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setError(null);

        // Check limits
        if (images.length + files.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} images`);
            return;
        }

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                // Validate file type
                if (!file.type.startsWith("image/")) {
                    throw new Error(`File ${file.name} is not an image`);
                }

                // Validate file size (2MB max)
                if (file.size > 2 * 1024 * 1024) {
                    throw new Error(`File ${file.name} exceeds the 2MB limit`);
                }

                let fileToUpload = file;
                if (shouldCompress) {
                    try {
                        fileToUpload = await compressImage(file);
                    } catch (err) {
                        console.error("Compression failed, uploading original", err);
                    }
                }

                const formData = new FormData();
                formData.append("file", fileToUpload);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || `Failed to upload ${file.name}`);
                }

                return result.data.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            newUrls.push(...uploadedUrls);

            const updatedImages = [...images, ...newUrls];
            setImages(updatedImages);

            if (onImagesChange) {
                onImagesChange(updatedImages);
            }
            if (onImageUploaded && newUrls.length > 0) {
                onImageUploaded(newUrls[0]);
            }

            toast.success(`Successfully uploaded ${newUrls.length} image(s)`);
        } catch (error: any) {
            console.error("Upload error:", error);
            setError(error.message || "Failed to upload images");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = async (indexToRemove: number) => {
        const imageToRemove = images[indexToRemove];
        const updatedImages = images.filter((_, index) => index !== indexToRemove);

        setImages(updatedImages);

        if (onImagesChange) {
            onImagesChange(updatedImages);
        }

        if (updatedImages.length === 0 && onImageRemoved) {
            onImageRemoved();
        } else if (onImageUploaded && updatedImages.length > 0) {
            if (maxFiles === 1) {
                onImageRemoved?.();
            }
        }

        try {
            await fetch("/api/upload", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: imageToRemove }),
            });
        } catch (error) {
            console.error("Failed to delete image:", error);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Compression Toggle */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="compress-toggle"
                    checked={shouldCompress}
                    onChange={(e) => setShouldCompress(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="compress-toggle" className="text-xs text-muted-foreground cursor-pointer select-none">
                    Compress image (Recommended)
                </label>
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className={`grid gap-4 ${multiple ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {images.map((url, index) => (
                        <div key={url + index} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted group shadow-sm">
                            <Image
                                src={url}
                                alt={`Image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleRemove(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {multiple && index === 0 && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-sm">
                                    Main
                                </div>
                            )}
                        </div>
                    ))}

                    {multiple && images.length < maxFiles && (
                        <div
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center aspect-[4/3] w-full rounded-lg border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted transition-colors"
                        >
                            {isUploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <>
                                    <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                                    <span className="text-xs text-muted-foreground">Add Image</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {images.length === 0 && (
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center aspect-video w-full rounded-lg border-2 border-dashed ${error ? 'border-red-500 bg-red-50' : 'border-border bg-muted/50'} cursor-pointer hover:bg-muted transition-colors`}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <ImageIcon className={`h-8 w-8 ${error ? 'text-red-500' : 'text-muted-foreground'} mb-2`} />
                            <p className={`text-sm ${error ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                                {error ? "Upload Failed" : `Click to upload ${multiple ? "images" : "image"}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Max 2MB per file
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Inline Error Message */}
            {error && (
                <div className="text-red-500 text-xs font-medium mt-2 animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            {multiple && (
                <p className="text-xs text-muted-foreground text-right">
                    {images.length} / {maxFiles} images
                </p>
            )}
        </div>
    );
}
