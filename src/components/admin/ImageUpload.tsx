"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Loader2, ImageIcon, Plus, Crop, ZoomIn } from "lucide-react";
import { getCroppedImage } from "@/lib/utils/cropUtils";

interface ImageUploadProps {
    currentImages?: string[]; // Changed to array
    currentImage?: string | null; // Backward compatibility
    onImagesChange?: (urls: string[]) => void; // New callback
    onImageUploaded?: (url: string) => void; // Backward compatibility
    onImageRemoved?: () => void; // Backward compatibility
    className?: string;
    maxFiles?: number;
    multiple?: boolean;
    cropAspect?: number; // Aspect ratio for crop (default 4/3)
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
    cropAspect = 3 / 4,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [shouldCompress, setShouldCompress] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Crop state
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [cropFileName, setCropFileName] = useState<string>("cropped.jpg");
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    // Queue for multiple files
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);

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

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image();
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

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
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

        const fileArray = Array.from(files);

        // Validate all files first
        for (const file of fileArray) {
            if (!file.type.startsWith("image/")) {
                setError(`File ${file.name} is not an image`);
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setError(`File ${file.name} exceeds the 2MB limit`);
                return;
            }
        }

        // Store remaining files in queue, open crop for the first one
        setPendingFiles(fileArray.slice(1));
        await openCropModal(fileArray[0]);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openCropModal = async (file: File) => {
        try {
            const dataUrl = await readFileAsDataURL(file);
            setCropImageSrc(dataUrl);
            setCropFileName(file.name);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setCropModalOpen(true);
        } catch (err) {
            console.error("Failed to read file:", err);
            setError("Failed to read image file");
        }
    };

    const handleCropConfirm = async () => {
        if (!cropImageSrc || !croppedAreaPixels) return;

        setCropModalOpen(false);

        setIsUploading(true);

        try {
            // Crop the image
            const croppedBlob = await getCroppedImage(cropImageSrc, croppedAreaPixels);
            let fileToUpload = new File(
                [croppedBlob],
                cropFileName.replace(/\.[^/.]+$/, "") + ".jpg",
                { type: "image/jpeg", lastModified: Date.now() }
            );

            // Compress if enabled
            if (shouldCompress) {
                try {
                    fileToUpload = await compressImage(fileToUpload);
                } catch (err) {
                    console.error("Compression failed, uploading cropped original", err);
                }
            }

            // Upload
            const formData = new FormData();
            formData.append("file", fileToUpload);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to upload image");
            }

            const uploadedUrl = result.data.url;
            const updatedImages = [...images, uploadedUrl];
            setImages(updatedImages);

            if (onImagesChange) {
                onImagesChange(updatedImages);
            }
            if (onImageUploaded) {
                onImageUploaded(uploadedUrl);
            }

            toast.success("Image cropped & uploaded successfully");
        } catch (error: any) {
            console.error("Upload error:", error);
            setError(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
            setCropImageSrc(null);
        }

        // Process next file in queue
        if (pendingFiles.length > 0) {
            const [nextFile, ...rest] = pendingFiles;
            setPendingFiles(rest);
            await openCropModal(nextFile);
        }
    };

    const handleCropCancel = () => {
        setCropModalOpen(false);
        setCropImageSrc(null);
        setCroppedAreaPixels(null);
        setPendingFiles([]);
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
                            <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="object-cover w-full h-full absolute inset-0"
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

            {/* ========== CROP MODAL ========== */}
            {cropModalOpen && cropImageSrc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-xl shadow-2xl w-[95vw] max-w-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-2">
                                <Crop className="h-5 w-5 text-accent" />
                                <h3 className="font-bold text-lg">Preview & Crop</h3>
                            </div>
                            <button
                                onClick={handleCropCancel}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Crop Area */}
                        <div className="relative w-full h-[50vh] min-h-[300px] bg-black">
                            <Cropper
                                image={cropImageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={cropAspect}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                style={{
                                    containerStyle: { width: "100%", height: "100%" },
                                }}
                            />
                        </div>

                        {/* Zoom Control */}
                        <div className="px-6 py-4 border-t border-border">
                            <div className="flex items-center gap-4">
                                <ZoomIn className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.05}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                                />
                                <span className="text-xs text-muted-foreground font-mono w-10 text-right">
                                    {zoom.toFixed(1)}x
                                </span>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCropCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCropConfirm}
                                className="btn-industrial"
                                disabled={!croppedAreaPixels}
                            >
                                <Crop className="h-4 w-4 mr-2" />
                                Confirm & Upload
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
