"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Upload,
    Loader2,
    Check,
    ArrowLeft,
    Trash2,
    Type,
    Square,
    Circle as CircleIcon,
    Triangle,
    Undo,
    Redo,
    Download,
    Shirt,
    Move,
    Palette,
    Layers,
    ChevronRight,
    ChevronLeft,
    Star,
    Heart,
    Hexagon,
    Diamond,
    ArrowRight,
    Zap,
    Search,
    Image as ImageIcon,
    Pentagon,
    Octagon,
    Cloud,
} from "lucide-react";
import Link from "next/link";
import { Inter, Roboto, Oswald, Pacifico, Anton, Lobster } from 'next/font/google';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-roboto' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const pacifico = Pacifico({ subsets: ['latin'], weight: ['400'], variable: '--font-pacifico' });
const anton = Anton({ subsets: ['latin'], weight: ['400'], variable: '--font-anton' });
const lobster = Lobster({ subsets: ['latin'], weight: ['400'], variable: '--font-lobster' });

// Additional font imports for more variety
import {
    Dancing_Script,
    Playfair_Display,
    Bebas_Neue,
    Permanent_Marker,
    Satisfy,
    Righteous,
    Bangers,
    Caveat,
    Teko,
    Abril_Fatface,
    Press_Start_2P,
    Russo_One,
    Orbitron,
    Monoton,
    Bungee
} from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-dancing' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-playfair' });
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: ['400'], variable: '--font-bebas' });
const permanentMarker = Permanent_Marker({ subsets: ['latin'], weight: ['400'], variable: '--font-marker' });
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'], variable: '--font-satisfy' });
const righteous = Righteous({ subsets: ['latin'], weight: ['400'], variable: '--font-righteous' });
const bangers = Bangers({ subsets: ['latin'], weight: ['400'], variable: '--font-bangers' });
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-caveat' });
const teko = Teko({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-teko' });
const abrilFatface = Abril_Fatface({ subsets: ['latin'], weight: ['400'], variable: '--font-abril' });
const pressStart = Press_Start_2P({ subsets: ['latin'], weight: ['400'], variable: '--font-press' });
const russoOne = Russo_One({ subsets: ['latin'], weight: ['400'], variable: '--font-russo' });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-orbitron' });
const monoton = Monoton({ subsets: ['latin'], weight: ['400'], variable: '--font-monoton' });
const bungee = Bungee({ subsets: ['latin'], weight: ['400'], variable: '--font-bungee' });

const fontOptions = [
    // Sans-Serif
    { name: "Arial", value: "Arial" },
    { name: "Roboto", value: roboto.style.fontFamily },
    { name: "Oswald", value: oswald.style.fontFamily },
    { name: "Bebas Neue", value: bebasNeue.style.fontFamily },
    { name: "Teko", value: teko.style.fontFamily },
    { name: "Righteous", value: righteous.style.fontFamily },
    { name: "Russo One", value: russoOne.style.fontFamily },
    // Display & Bold
    { name: "Anton", value: anton.style.fontFamily },
    { name: "Bangers", value: bangers.style.fontFamily },
    { name: "Abril Fatface", value: abrilFatface.style.fontFamily },
    { name: "Bungee", value: bungee.style.fontFamily },
    // Script & Handwriting
    { name: "Lobster", value: lobster.style.fontFamily },
    { name: "Pacifico", value: pacifico.style.fontFamily },
    { name: "Dancing Script", value: dancingScript.style.fontFamily },
    { name: "Satisfy", value: satisfy.style.fontFamily },
    { name: "Caveat", value: caveat.style.fontFamily },
    { name: "Permanent Marker", value: permanentMarker.style.fontFamily },
    // Elegant & Serif
    { name: "Playfair Display", value: playfairDisplay.style.fontFamily },
    // Futuristic & Techy
    { name: "Orbitron", value: orbitron.style.fontFamily },
    { name: "Press Start 2P", value: pressStart.style.fontFamily },
    { name: "Monoton", value: monoton.style.fontFamily },
];

// Define types for our templates
interface CatalogueItemColor {
    id: string;
    name: string;
    hex: string;
    frontImageUrl: string;
    backImageUrl: string;
    sideImageUrl: string;
}

interface CatalogueItem {
    id: string;
    name: string;
    colors: CatalogueItemColor[];
    availableFabrics?: string[];
}

interface FabricItem {
    id: string;
    name: string;
}

const printTypes = [
    { value: "embroidery", label: "Embroidery" },
    { value: "printing", label: "Printing" },
];

const sizeRanges = [
    "S - XL",
    "XS - XXL",
    "XS - 3XL",
    "XS - 5XL",
    "One Size",
    "Custom Range",
];

// Fallback colors if no templates exist
const fallbackColors = [
    { name: "White", value: "#FFFFFF", textColor: "#000" },
    { name: "Black", value: "#1a1a1a", textColor: "#fff" },
    { name: "Navy", value: "#1e3a5f", textColor: "#fff" },
];



export default function DesignPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<any>(null); // Fabric canvas instance
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Data State
    const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
    const [fabrics, setFabrics] = useState<FabricItem[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // UI State
    const [step, setStep] = useState<1 | 2>(1); // 1: Design, 2: Details
    const [currentView, setCurrentView] = useState<"front" | "back" | "side">("front");
    const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
    const [selectedColor, setSelectedColor] = useState<CatalogueItemColor | null>(null);
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    // Design State
    const [canvasStates, setCanvasStates] = useState<{ [key: string]: any }>({
        front: null,
        back: null,
        side: null,
    });
    const [originalLogoUrls, setOriginalLogoUrls] = useState<string[]>([]);
    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [fillColor, setFillColor] = useState("#000000");

    // Clipart State
    const [isClipartOpen, setIsClipartOpen] = useState(false);
    const [clipartQuery, setClipartQuery] = useState("");
    const [clipartResults, setClipartResults] = useState<string[]>([]);
    const [isSearchingClipart, setIsSearchingClipart] = useState(false);

    // Product Picker Dialog State
    const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);



    // Form State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fabricId: "",
        printType: "",
        quantity: "",
        sizeRange: "",
        phoneNumber: "",
        email: "",
        companyName: "",
        contactPerson: "",
        notes: "",
    });

    // Fetch Initial Data
    useEffect(() => {
        async function fetchData() {
            try {
                const [fabricsRes, itemsRes] = await Promise.all([
                    fetch("/api/catalogue/fabrics", { cache: "no-store" }),
                    fetch("/api/catalogue/items?isCustomizable=true", { cache: "no-store" }),
                ]);

                const fabricsData = await fabricsRes.json();
                const itemsData = await itemsRes.json();

                if (fabricsData.success) setFabrics(fabricsData.data);
                if (itemsData.success && itemsData.data.length > 0) {
                    // Filter items that have colors
                    const validItems = itemsData.data.filter((item: any) => item.colors && item.colors.length > 0);
                    setCatalogueItems(validItems);

                    // Check if product ID is in URL params
                    const productId = searchParams.get('product');
                    let selectedProduct = validItems[0]; // Default to first

                    if (productId) {
                        const matchedProduct = validItems.find((item: any) => item.id === productId);
                        if (matchedProduct) {
                            selectedProduct = matchedProduct;
                        }
                    }

                    if (selectedProduct) {
                        setSelectedItem(selectedProduct);
                        setSelectedColor(selectedProduct.colors[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error("Failed to load design assets");
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchData();
    }, [searchParams]);

    // Initialize Fabric.js
    useEffect(() => {
        let fabricInstance: any;

        const initCanvas = async () => {
            if (!canvasRef.current || !containerRef.current || !selectedColor) return;

            // Dynamically import fabric to avoid SSR issues
            const fabricModule = await import("fabric");
            const { Canvas, Rect, Circle, Triangle, IText, Image: FabricImage } = fabricModule;

            // Calculate dimensions based on container
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            // Initialize canvas
            if (!fabricCanvasRef.current) {
                fabricInstance = new Canvas(canvasRef.current, {
                    width: width,
                    height: height,
                    backgroundColor: "transparent", // Transparent to show image behind
                    preserveObjectStacking: true,
                });
                fabricCanvasRef.current = fabricInstance;

                // Event listeners
                fabricInstance.on("selection:created", (e: any) => setSelectedObject(e.selected[0]));
                fabricInstance.on("selection:updated", (e: any) => setSelectedObject(e.selected[0]));
                fabricInstance.on("selection:cleared", () => setSelectedObject(null));

                setIsCanvasReady(true);
            } else {
                fabricInstance = fabricCanvasRef.current;
                fabricInstance.setDimensions({ width, height });
            }

            // Load state for current view if exists
            if (canvasStates[currentView]) {
                await fabricInstance.loadFromJSON(canvasStates[currentView]);
            } else {
                fabricInstance.clear();
                fabricInstance.backgroundColor = "transparent";
            }

            fabricInstance.renderAll();
        };

        if (!isLoadingData && selectedColor) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(initCanvas, 100);
            return () => clearTimeout(timer);
        }
    }, [isLoadingData, selectedColor, currentView]); // Re-init when view changes? No, handle view change separately

    // Handle View Change
    const handleViewChange = async (newView: "front" | "back" | "side") => {
        if (!fabricCanvasRef.current || !selectedColor) return;

        // Check if image exists for the new view
        let newImage = "";
        if (newView === "front") newImage = selectedColor.frontImageUrl;
        if (newView === "back") newImage = selectedColor.backImageUrl;
        if (newView === "side") newImage = selectedColor.sideImageUrl;

        if (!newImage) {
            toast.error(`${newView.charAt(0).toUpperCase() + newView.slice(1)} view is not available for this color.`);
            return;
        }

        // Save current state
        const json = fabricCanvasRef.current.toJSON();
        setCanvasStates((prev) => ({ ...prev, [currentView]: json }));

        // Switch view
        setCurrentView(newView);

        // Load new state (handled in useEffect or here)
        // We'll handle it here to be faster
        const newState = canvasStates[newView];
        if (newState) {
            await fabricCanvasRef.current.loadFromJSON(newState);
        } else {
            fabricCanvasRef.current.clear();
            fabricCanvasRef.current.backgroundColor = "transparent";
        }
        fabricCanvasRef.current.renderAll();
    };

    // Handle Color Change - Preserve canvas designs when switching colors
    const handleColorChange = (color: CatalogueItemColor) => {
        if (!fabricCanvasRef.current) return;

        // Save current canvas state before changing color
        const json = fabricCanvasRef.current.toJSON();
        setCanvasStates((prev) => ({ ...prev, [currentView]: json }));

        setSelectedColor(color);
    };

    const handleItemChange = (itemId: string) => {
        const item = catalogueItems.find(i => i.id === itemId);
        if (item && item.colors.length > 0) {
            // Clear all canvas states when changing product
            setCanvasStates({
                front: null,
                back: null,
                side: null,
            });

            // Clear the actual canvas
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.clear();
                fabricCanvasRef.current.backgroundColor = "transparent";
                fabricCanvasRef.current.renderAll();
            }

            setSelectedItem(item);
            setSelectedColor(item.colors[0]);
        }
    };

    // Tools
    const addText = async () => {
        if (!fabricCanvasRef.current) return;
        const { IText } = await import("fabric");
        const text = new IText("Your Text", {
            left: 100,
            top: 100,
            fontFamily: "Arial",
            fill: fillColor,
            fontSize: 40,
        });
        fabricCanvasRef.current.add(text);
        fabricCanvasRef.current.setActiveObject(text);
        fabricCanvasRef.current.renderAll();
    };

    const addShape = async (type: "rect" | "circle" | "triangle" | "star" | "heart" | "hexagon" | "diamond" | "arrow" | "zap" | "pentagon" | "octagon" | "cloud") => {
        if (!fabricCanvasRef.current) return;
        const fabricModule = await import("fabric");
        let shape;
        const commonProps = { left: 150, top: 150, fill: fillColor, width: 100, height: 100 };

        if (type === "rect") shape = new fabricModule.Rect(commonProps);
        if (type === "circle") shape = new fabricModule.Circle({ ...commonProps, radius: 50 });
        if (type === "triangle") shape = new fabricModule.Triangle(commonProps);

        if (type === "star") {
            const points = [
                { x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 },
                { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 },
                { x: 2, y: 35 }, { x: 39, y: 35 }
            ];
            shape = new fabricModule.Polygon(points, { ...commonProps, scaleX: 1, scaleY: 1 });
        }

        if (type === "hexagon") {
            const points = [
                { x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 43 }, { x: 75, y: 86 },
                { x: 25, y: 86 }, { x: 0, y: 43 }
            ];
            shape = new fabricModule.Polygon(points, { ...commonProps, scaleX: 1, scaleY: 1 });
        }

        if (type === "pentagon") {
            const points = [
                { x: 50, y: 0 }, { x: 100, y: 38 }, { x: 81, y: 100 },
                { x: 19, y: 100 }, { x: 0, y: 38 }
            ];
            shape = new fabricModule.Polygon(points, { ...commonProps, scaleX: 1, scaleY: 1 });
        }

        if (type === "octagon") {
            const points = [
                { x: 30, y: 0 }, { x: 70, y: 0 }, { x: 100, y: 30 }, { x: 100, y: 70 },
                { x: 70, y: 100 }, { x: 30, y: 100 }, { x: 0, y: 70 }, { x: 0, y: 30 }
            ];
            shape = new fabricModule.Polygon(points, { ...commonProps, scaleX: 1, scaleY: 1 });
        }

        if (type === "diamond") {
            shape = new fabricModule.Rect({ ...commonProps, angle: 45 });
        }

        if (type === "heart") {
            const path = "M 272.70141,238.71731 C 206.46141,238.71731 152.70141,292.47731 152.70141,358.71731 C 152.70141,493.71731 288.66541,573.71731 381.26341,621.82531 C 468.89841,575.61531 609.82541,492.44431 609.82541,358.71731 C 609.82541,292.47731 556.06541,238.71731 489.82541,238.71731 C 443.42941,238.71731 403.39041,264.53131 381.26341,302.28931 C 359.13641,264.53131 319.09741,238.71731 272.70141,238.71731 z";
            shape = new fabricModule.Path(path, { ...commonProps, scaleX: 0.2, scaleY: 0.2 });
        }

        if (type === "arrow") {
            const path = "M 0 50 L 50 0 L 50 25 L 100 25 L 100 75 L 50 75 L 50 100 z";
            shape = new fabricModule.Path(path, { ...commonProps, scaleX: 0.8, scaleY: 0.8 });
        }

        if (type === "zap") {
            const path = "M 55 0 L 0 60 L 40 60 L 25 100 L 80 40 L 40 40 z";
            shape = new fabricModule.Path(path, { ...commonProps, scaleX: 0.8, scaleY: 0.8 });
        }

        if (type === "cloud") {
            const path = "M 25 60 Q 0 60 0 45 Q 0 30 20 30 Q 20 10 45 10 Q 70 10 75 30 Q 100 30 100 50 Q 100 70 75 70 L 25 70 Q 0 70 0 55 z";
            shape = new fabricModule.Path(path, { ...commonProps, scaleX: 1, scaleY: 1 });
        }

        if (shape) {
            fabricCanvasRef.current.add(shape);
            fabricCanvasRef.current.setActiveObject(shape);
            fabricCanvasRef.current.renderAll();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !fabricCanvasRef.current) return;

        // Check file size (2MB limit) - Strict safety net
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size too large. Max limit is 2MB.");
            e.target.value = ""; // Reset input
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const originalDataUrl = event.target?.result as string;

            // Image Compression Logic
            const img = new window.Image();
            img.src = originalDataUrl;

            img.onload = async () => {
                let finalDataUrl = originalDataUrl;

                // Compress if larger than 500KB or dimensions > 1024px
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    if (width > height) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    } else {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                // Compress via Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    // Compress to JPEG with 0.7 quality
                    // Only compress if it actually saves space or if we resized
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                    // Simple heuristic: use compressed if we resized OR if original was huge
                    if (width < img.width || file.size > 500 * 1024) {
                        finalDataUrl = compressedDataUrl;
                        toast.success("Image optimized for performance");
                    }
                }

                // Add to array of original logos (using optimized version)
                setOriginalLogoUrls(prev => [...prev, finalDataUrl]);

                const { FabricImage } = await import("fabric");
                const imgInstance = new FabricImage(img, {
                    scaleX: 0.3, // Initial display scale
                    scaleY: 0.3,
                    left: 100,
                    top: 100,
                });

                // Update the source to the optimized one if we compressed it
                if (finalDataUrl !== originalDataUrl) {
                    await imgInstance.setSrc(finalDataUrl);
                    fabricCanvasRef.current?.renderAll();
                }

                fabricCanvasRef.current?.add(imgInstance);
                fabricCanvasRef.current?.setActiveObject(imgInstance);
                fabricCanvasRef.current?.renderAll();
            };
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const deleteSelected = () => {
        if (!fabricCanvasRef.current) return;
        const activeObj = fabricCanvasRef.current.getActiveObject();
        if (activeObj) {
            fabricCanvasRef.current.remove(activeObj);
            fabricCanvasRef.current.discardActiveObject();
            fabricCanvasRef.current.renderAll();
            setSelectedObject(null);
        }
    };

    const updateColor = (color: string) => {
        setFillColor(color);
        if (selectedObject) {
            selectedObject.set("fill", color);
            fabricCanvasRef.current.renderAll();
        }
    };

    const updateFont = (font: string) => {
        if (selectedObject && (selectedObject.type === "i-text" || selectedObject.type === "text")) {
            selectedObject.set("fontFamily", font);
            fabricCanvasRef.current.renderAll();
            // Force update to reflect change if needed, though fabric handles render
        }
    };

    // Clipart Functions
    const searchClipart = async () => {
        if (!clipartQuery.trim()) return;
        setIsSearchingClipart(true);
        try {
            const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(clipartQuery)}&limit=50`);
            const data = await res.json();
            if (data.icons) {
                setClipartResults(data.icons);
            } else {
                setClipartResults([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to search clipart");
        } finally {
            setIsSearchingClipart(false);
        }
    };

    const addClipartToCanvas = async (iconName: string) => {
        if (!fabricCanvasRef.current) return;

        const [prefix, name] = iconName.split(":");
        const url = `https://api.iconify.design/${prefix}/${name}.svg`;

        try {
            const fabricModule = await import("fabric");

            // Fetch SVG content
            const res = await fetch(url);
            const svgStr = await res.text();

            // Load SVG
            const { objects, options } = await fabricModule.loadSVGFromString(svgStr);
            const obj = fabricModule.util.groupSVGElements(objects.filter(o => o !== null), options);

            // Set properties
            obj.set({
                left: 150,
                top: 150,
                scaleX: 3, // Scale up a bit as icons are usually small (24px)
                scaleY: 3,
            });

            // If it's a simple path, we can set fill. If it's a group, it's harder.
            // We'll leave color as is for now.

            fabricCanvasRef.current.add(obj);
            fabricCanvasRef.current.setActiveObject(obj);
            fabricCanvasRef.current.renderAll();
            setIsClipartOpen(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load clipart");
        }
    };





    // Submit
    const handleSubmit = async () => {
        if (!formData.fabricId || !formData.printType || !formData.quantity || !formData.phoneNumber) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Save current view state first
            let updatedCanvasStates = { ...canvasStates };
            if (fabricCanvasRef.current) {
                const json = fabricCanvasRef.current.toJSON();
                updatedCanvasStates = { ...updatedCanvasStates, [currentView]: json };
                setCanvasStates(updatedCanvasStates);
            }

            const fabricModule = await import("fabric");

            // Helper function to generate composite image for a view
            const generateCompositeImage = async (view: "front" | "back", canvasState: any, backgroundUrl: string | undefined): Promise<string> => {
                if (!fabricCanvasRef.current || !backgroundUrl || !canvasState) return "";

                const canvas = fabricCanvasRef.current;

                // Load the canvas state for this view
                await canvas.loadFromJSON(canvasState);

                // Add background image
                try {
                    await new Promise<void>((resolve) => {
                        fabricModule.FabricImage.fromURL(backgroundUrl, { crossOrigin: 'anonymous' }).then((img) => {
                            const scaleX = canvas.width! / img.width!;
                            const scaleY = canvas.height! / img.height!;
                            const scale = Math.max(scaleX, scaleY);
                            img.scale(scale);
                            img.set({
                                originX: 'center',
                                originY: 'center',
                                left: canvas.width! / 2,
                                top: canvas.height! / 2
                            });
                            canvas.backgroundImage = img;
                            canvas.renderAll();
                            resolve();
                        }).catch(() => resolve());
                    });

                    const dataUrl = canvas.toDataURL({ format: 'jpeg', quality: 0.8 });

                    // Clear background
                    canvas.backgroundImage = null;
                    canvas.renderAll();

                    return dataUrl;
                } catch (e) {
                    console.error(`Error creating ${view} composite image`, e);
                    return canvas.toDataURL({ format: 'jpeg', quality: 0.8 });
                }
            };

            // Generate front design image
            let designImageUrl = "";
            if (selectedColor?.frontImageUrl && updatedCanvasStates.front) {
                designImageUrl = await generateCompositeImage("front", updatedCanvasStates.front, selectedColor.frontImageUrl);
            } else if (fabricCanvasRef.current && updatedCanvasStates.front) {
                await fabricCanvasRef.current.loadFromJSON(updatedCanvasStates.front);
                designImageUrl = fabricCanvasRef.current.toDataURL({ format: 'jpeg', quality: 0.8 });
            }

            // Generate back design image
            let backDesignImageUrl = "";
            if (selectedColor?.backImageUrl && updatedCanvasStates.back) {
                backDesignImageUrl = await generateCompositeImage("back", updatedCanvasStates.back, selectedColor.backImageUrl);
            } else if (fabricCanvasRef.current && updatedCanvasStates.back) {
                await fabricCanvasRef.current.loadFromJSON(updatedCanvasStates.back);
                backDesignImageUrl = fabricCanvasRef.current.toDataURL({ format: 'jpeg', quality: 0.8 });
            }

            // Generate side design image
            let sideDesignImageUrl = "";
            if (selectedColor?.sideImageUrl && updatedCanvasStates.side) {
                sideDesignImageUrl = await generateCompositeImage("side" as any, updatedCanvasStates.side, selectedColor.sideImageUrl);
            } else if (fabricCanvasRef.current && updatedCanvasStates.side) {
                await fabricCanvasRef.current.loadFromJSON(updatedCanvasStates.side);
                sideDesignImageUrl = fabricCanvasRef.current.toDataURL({ format: 'jpeg', quality: 0.8 });
            }

            // Helper to upload base64 image
            const uploadBase64Image = async (base64Data: string, prefix: string): Promise<string | null> => {
                if (!base64Data) return null;
                try {
                    // Convert base64 to blob
                    const res = await fetch(base64Data);
                    const blob = await res.blob();
                    const file = new File([blob], `${prefix}-${Date.now()}.jpg`, { type: "image/jpeg" });

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("bucket", "all_photos"); // Using existing bucket

                    const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });

                    const result = await uploadRes.json();
                    if (result.success) {
                        return result.data.url;
                    }
                    console.error("Upload failed", result.error);
                    return null;
                } catch (e) {
                    console.error("Error uploading image", e);
                    return null;
                }
            };

            // Upload generated images
            let uploadedDesignUrl = designImageUrl;
            if (designImageUrl.startsWith("data:")) {
                const url = await uploadBase64Image(designImageUrl, "design-front");
                if (url) uploadedDesignUrl = url;
            }

            let uploadedBackDesignUrl = backDesignImageUrl;
            if (backDesignImageUrl && backDesignImageUrl.startsWith("data:")) {
                const url = await uploadBase64Image(backDesignImageUrl, "design-back");
                if (url) uploadedBackDesignUrl = url;
            }

            let uploadedSideDesignUrl = sideDesignImageUrl;
            if (sideDesignImageUrl && sideDesignImageUrl.startsWith("data:")) {
                const url = await uploadBase64Image(sideDesignImageUrl, "design-side");
                if (url) uploadedSideDesignUrl = url;
            }

            // Upload original logos
            let uploadedOriginalLogos: string[] = [];
            if (originalLogoUrls.length > 0) {
                for (let i = 0; i < originalLogoUrls.length; i++) {
                    const logo = originalLogoUrls[i];
                    if (logo.startsWith("data:")) {
                        const url = await uploadBase64Image(logo, `logo-${i}`);
                        if (url) uploadedOriginalLogos.push(url);
                    } else {
                        uploadedOriginalLogos.push(logo);
                    }
                }
            }

            // Restore current view state
            if (fabricCanvasRef.current && updatedCanvasStates[currentView]) {
                await fabricCanvasRef.current.loadFromJSON(updatedCanvasStates[currentView]);
                fabricCanvasRef.current.renderAll();
            }

            const response = await fetch("/api/design-enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    designImageUrl: uploadedDesignUrl,
                    backDesignImageUrl: uploadedBackDesignUrl || undefined,
                    sideDesignImageUrl: uploadedSideDesignUrl || undefined,
                    originalLogoUrl: uploadedOriginalLogos.length > 0 ? JSON.stringify(uploadedOriginalLogos) : undefined,
                    fabricId: formData.fabricId,
                    printType: formData.printType,
                    quantity: parseInt(formData.quantity),
                    sizeRange: formData.sizeRange,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email || undefined,
                    companyName: formData.companyName || undefined,
                    contactPerson: formData.contactPerson || undefined,
                    notes: formData.notes || undefined,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setIsSubmitted(true);
                toast.success("Enquiry submitted successfully!");
            } else {
                if (result.details) {
                    const messages = result.details.map((d: any) => `${d.path.join('.')}: ${d.message}`).join('\n');
                    toast.error(`Validation failed:\n${messages}`);
                } else {
                    toast.error(result.error || "Failed to submit");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render Logic
    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blueprint relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="text-center max-w-md mx-auto p-8 bg-background/95 backdrop-blur rounded-sm shadow-2xl border border-white/10 relative z-10 card-factory">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20">
                        <Check className="h-10 w-10 text-accent" />
                    </div>
                    <div className="section-tag mb-4 justify-center">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        SUBMISSION_CONFIRMED
                    </div>
                    <h2 className="text-3xl font-bold mb-4 font-serif-display">Enquiry Sent!</h2>
                    <p className="text-muted-foreground mb-8 font-mono text-sm leading-relaxed">
                        We have received your design specifications. Our technical team will review the data and transmit a quote shortly.
                    </p>
                    <Button onClick={() => window.location.reload()} className="w-full btn-industrial">
                        Create Another Design
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blueprint">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <p className="font-mono text-xs text-accent animate-pulse">INITIALIZING_SYSTEM...</p>
                </div>
            </div>
        );
    }

    // Fallback if no items
    if (catalogueItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-blueprint relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="card-factory p-12 max-w-lg bg-background/95 backdrop-blur">
                    <Shirt className="h-16 w-16 text-muted-foreground mb-6 mx-auto opacity-50" />
                    <h1 className="text-2xl font-bold mb-2 font-serif-display">Design Tool Unavailable</h1>
                    <p className="text-muted-foreground max-w-md font-mono text-sm mb-8">
                        No design templates are currently available in the system. Please contact the administrator to add T-shirt templates.
                    </p>
                    <Button variant="outline" className="btn-industrial-outline" onClick={() => router.push("/")}>
                        Return Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-blueprint flex flex-col relative ${roboto.variable} ${oswald.variable} ${pacifico.variable} ${anton.variable} ${lobster.variable}`}>
            {/* Industrial Warning Stripe Top */}
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20 z-50" />

            {/* Header */}
            <header className="bg-background/95 backdrop-blur border-b border-white/10 sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link href="/" className="p-2 hover:bg-accent/10 rounded-full transition-colors text-muted-foreground hover:text-accent">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse hidden sm:block" />
                            <h1 className="font-bold text-lg sm:text-xl font-serif-display tracking-wide">Design Studio</h1>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {step === 1 ? (
                        <Button onClick={() => setStep(2)} className="btn-industrial gap-1 sm:gap-2 h-9" size="sm">
                            <span className="hidden sm:inline">Next Step</span>
                            <span className="sm:hidden">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setStep(1)} size="sm" className="hover:text-accent hover:bg-accent/5">Back</Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting} className="btn-industrial gap-1 sm:gap-2 h-9" size="sm">
                                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-4 w-4" />}
                                <span className="hidden sm:inline">Submit Enquiry</span>
                                <span className="sm:hidden">Submit</span>
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative z-10">
                {/* Left Sidebar - Tools (Only in Step 1) */}
                {step === 1 && (
                    <aside className="order-2 lg:order-1 w-full lg:w-80 bg-background/95 backdrop-blur border-t lg:border-t-0 lg:border-r border-white/10 flex flex-col lg:overflow-y-auto shrink-0 shadow-xl">
                        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                            {/* Product & Color Selection */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Select Product</Label>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsProductPickerOpen(true)}
                                        className="w-full justify-between border-white/10 bg-muted/20 hover:bg-muted/30 h-10"
                                    >
                                        <span className="flex items-center gap-2">
                                            {selectedItem ? (
                                                <>
                                                    {selectedColor?.frontImageUrl && (
                                                        <div className="w-6 h-6 rounded overflow-hidden border border-white/10">
                                                            <img
                                                                src={selectedColor.frontImageUrl}
                                                                alt={selectedItem.name}
                                                                width={24}
                                                                height={24}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                    )}
                                                    <span>{selectedItem.name}</span>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground">Choose a product...</span>
                                            )}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>

                                {/* Product Picker Dialog */}
                                <Dialog open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
                                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur border-white/10">
                                        <DialogHeader>
                                            <DialogTitle className="font-serif-display text-xl">Select Product</DialogTitle>
                                            <p className="text-sm text-muted-foreground">Choose a product to customize</p>
                                        </DialogHeader>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                            {catalogueItems.map(item => {
                                                const firstColor = item.colors[0];
                                                const isSelected = selectedItem?.id === item.id;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => {
                                                            handleItemChange(item.id);
                                                            setIsProductPickerOpen(false);
                                                        }}
                                                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02] ${isSelected ? 'border-accent ring-2 ring-accent/20' : 'border-white/10 hover:border-white/20'}`}
                                                    >
                                                        {firstColor?.frontImageUrl ? (
                                                            <img
                                                                src={firstColor.frontImageUrl}
                                                                alt={item.name}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                                <Shirt className="h-12 w-12 text-muted-foreground/50" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                                            <p className="text-white font-medium text-sm truncate">{item.name}</p>
                                                            <p className="text-white/60 text-xs">{item.colors.length} colors</p>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1">
                                                                <Check className="h-3 w-3" />
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                        <Palette className="h-3 w-3" /> Product Color
                                    </Label>
                                    <div className="grid grid-cols-5 gap-2 p-2 bg-muted/20 rounded-md border border-white/5">
                                        {selectedItem?.colors.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() => handleColorChange(color)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all relative group ${selectedColor?.id === color.id
                                                    ? "border-accent ring-2 ring-accent/20 scale-110"
                                                    : "border-transparent hover:scale-105"
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            >
                                                {selectedColor?.id === color.id && (
                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                        <Check className={`h-3 w-3 ${['#FFFFFF', '#fff', '#ffffff'].includes(color.hex.toLowerCase()) ? 'text-black' : 'text-white'}`} />
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-center font-mono text-accent">
                                        {selectedColor?.name.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-border/50" />

                            {/* Add Elements */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    <Layers className="h-3 w-3" /> Add Elements
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="card-factory h-20 flex flex-col gap-2 hover:border-accent hover:bg-accent/5 transition-all">
                                        <Upload className="h-5 w-5 text-accent" />
                                        <span className="text-[10px] font-mono uppercase">Upload Logo</span>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />

                                    <Button variant="outline" onClick={addText} className="card-factory h-20 flex flex-col gap-2 hover:border-accent hover:bg-accent/5 transition-all">
                                        <Type className="h-5 w-5 text-accent" />
                                        <span className="text-[10px] font-mono uppercase">Add Text</span>
                                    </Button>

                                    <Dialog open={isClipartOpen} onOpenChange={setIsClipartOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="card-factory h-auto py-3 flex flex-col gap-1 col-span-2 hover:border-accent hover:bg-accent/5 transition-all">
                                                <ImageIcon className="h-5 w-5 text-accent mb-1" />
                                                <span className="text-[10px] font-mono uppercase">Add Clipart Library</span>
                                                <span className="text-[9px] text-muted-foreground/70 font-normal normal-case tracking-tight">Some icons colours not changable</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col bg-background/95 backdrop-blur border-white/10">
                                            <DialogHeader>
                                                <DialogTitle className="font-serif-display text-xl">Search Clipart Library</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex gap-2 my-4">
                                                <Input
                                                    placeholder="Search icons (e.g. tiger, flower, skull)..."
                                                    value={clipartQuery}
                                                    onChange={(e) => setClipartQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && searchClipart()}
                                                    className="bg-muted/30 border-white/10"
                                                />
                                                <Button onClick={searchClipart} disabled={isSearchingClipart} className="btn-industrial">
                                                    {isSearchingClipart ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                                </Button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto grid grid-cols-5 sm:grid-cols-6 gap-4 p-2 border border-white/10 rounded-md bg-muted/10">
                                                {clipartResults.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        onClick={() => addClipartToCanvas(icon)}
                                                        className="aspect-square flex items-center justify-center p-2 border border-transparent rounded hover:bg-accent/10 hover:border-accent transition-colors"
                                                        title={icon}
                                                    >
                                                        <img
                                                            src={`https://api.iconify.design/${icon.split(":")[0]}/${icon.split(":")[1]}.svg`}
                                                            alt={icon}
                                                            className="w-full h-full object-contain"
                                                            loading="lazy"
                                                        />
                                                    </button>
                                                ))}
                                                {clipartResults.length === 0 && !isSearchingClipart && (
                                                    <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground h-40">
                                                        <Search className="h-8 w-8 mb-2 opacity-20" />
                                                        <p className="font-mono text-xs">NO_RESULTS_FOUND</p>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="flex flex-wrap gap-2 p-2 bg-muted/20 rounded-md border border-white/5">
                                    {[
                                        { icon: Square, type: "rect", label: "Rectangle" },
                                        { icon: CircleIcon, type: "circle", label: "Circle" },
                                        { icon: Triangle, type: "triangle", label: "Triangle" },
                                        { icon: Star, type: "star", label: "Star" },
                                        { icon: Heart, type: "heart", label: "Heart" },
                                        { icon: Pentagon, type: "pentagon", label: "Pentagon" },
                                        { icon: Hexagon, type: "hexagon", label: "Hexagon" },
                                        { icon: Octagon, type: "octagon", label: "Octagon" },
                                        { icon: Diamond, type: "diamond", label: "Diamond" },
                                        { icon: ArrowRight, type: "arrow", label: "Arrow" },
                                        { icon: Zap, type: "zap", label: "Lightning" },
                                        { icon: Cloud, type: "cloud", label: "Cloud" },
                                    ].map((shape) => (
                                        <Button
                                            key={shape.type}
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => addShape(shape.type as any)}
                                            title={shape.label}
                                            className="hover:bg-accent/10 hover:text-accent"
                                        >
                                            <shape.icon className="h-4 w-4" />
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Element Properties - Always visible, disabled when no element selected */}
                            <div className={`p-4 bg-muted/30 border rounded-lg space-y-3 relative overflow-hidden transition-opacity ${selectedObject ? 'border-accent/20' : 'border-white/5 opacity-60'}`}>
                                <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${selectedObject ? 'bg-accent/50' : 'bg-muted-foreground/20'}`} />

                                {/* Element Color */}
                                <div>
                                    <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Element Color</Label>
                                    <div className={`flex flex-wrap gap-2 mt-2 ${!selectedObject ? 'pointer-events-none' : ''}`}>
                                        {["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => updateColor(c)}
                                                disabled={!selectedObject}
                                                className={`w-6 h-6 rounded-full border border-white/10 shadow-sm transition-transform ${selectedObject ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={fillColor}
                                            onChange={(e) => updateColor(e.target.value)}
                                            disabled={!selectedObject}
                                            className={`w-6 h-6 p-0 border-0 rounded-full overflow-hidden ${selectedObject ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                        />
                                    </div>
                                </div>

                                {/* Typography - Always shown but disabled when not text */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Typography</Label>
                                    <Select
                                        onValueChange={updateFont}
                                        value={selectedObject?.fontFamily || ""}
                                        disabled={!selectedObject || (selectedObject?.type !== "i-text" && selectedObject?.type !== "text")}
                                    >
                                        <SelectTrigger className={`h-8 text-xs ${(!selectedObject || (selectedObject?.type !== "i-text" && selectedObject?.type !== "text")) ? 'opacity-50' : ''}`}>
                                            <SelectValue placeholder="Select text to change font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fontOptions.map(f => (
                                                <SelectItem key={f.name} value={f.value} style={{ fontFamily: f.value }}>
                                                    {f.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Remove Element */}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={deleteSelected}
                                    disabled={!selectedObject}
                                    className="w-full h-8 text-xs uppercase tracking-wider"
                                >
                                    <Trash2 className="h-3 w-3 mr-2" /> Remove Element
                                </Button>

                                {!selectedObject && (
                                    <p className="text-[10px] text-center text-muted-foreground">
                                        Select an element on canvas to edit
                                    </p>
                                )}
                            </div>
                        </div>
                    </aside>
                )}

                {/* Center - Canvas Area */}
                <div className={`order-1 lg:order-2 flex-1 relative bg-muted/5 flex flex-col min-h-[50vh] lg:min-h-0 shrink-0 lg:shrink ${step === 2 ? "hidden lg:flex" : ""}`}>
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                    {/* View Controls */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-background/90 backdrop-blur border border-white/10 rounded-full p-1 shadow-lg flex gap-1">
                        {(["front", "back", "side"] as const).map((view) => (
                            <button
                                key={view}
                                onClick={() => handleViewChange(view)}
                                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${currentView === view
                                    ? "bg-accent text-accent-foreground shadow-sm"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <span className="hidden sm:inline">{view} View</span>
                                <span className="sm:hidden">{view}</span>
                            </button>
                        ))}
                    </div>

                    {/* Canvas Container */}
                    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">

                        <div
                            ref={containerRef}
                            className="relative w-full max-w-[350px] sm:max-w-[500px] lg:max-w-[600px] aspect-[3/4] bg-white shadow-2xl rounded-sm overflow-hidden border-2 border-white/10"
                        >
                            {/* Technical Corner Overlays */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/50 z-30 m-2 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/50 z-30 m-2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/50 z-30 m-2 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/50 z-30 m-2 pointer-events-none" />

                            {/* Background Image (T-Shirt) */}
                            {selectedColor && (() => {
                                const currentSrc = currentView === "front" ? selectedColor.frontImageUrl :
                                    currentView === "back" ? selectedColor.backImageUrl :
                                        selectedColor.sideImageUrl;

                                if (!currentSrc) return null;

                                return (
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={currentSrc}
                                            alt="Product Template"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                );
                            })()}

                            {/* Fabric Canvas */}
                            <canvas ref={canvasRef} className="absolute inset-0 z-20" />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Enquiry Form (Only in Step 2) */}
                {step === 2 && (
                    <aside className="w-full lg:w-[500px] bg-background/95 backdrop-blur border-l border-white/10 overflow-y-auto p-4 sm:p-6 animate-in slide-in-from-right-8 shadow-xl relative z-20">
                        <div className="space-y-6 max-w-lg mx-auto lg:max-w-none">
                            <div className="border-b border-white/10 pb-4">
                                <div className="section-tag mb-2">
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    FINALIZATION
                                </div>
                                <h2 className="text-2xl font-bold font-serif-display">Order Details</h2>
                                <p className="text-muted-foreground text-sm font-mono mt-1">
                                    Complete the technical specifications for your order
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Fabric Type <span className="text-destructive">*</span></Label>
                                    <Select value={formData.fabricId} onValueChange={(v) => setFormData({ ...formData, fabricId: v })}>
                                        <SelectTrigger className="border-white/10 bg-muted/20 focus:ring-accent/20 h-11">
                                            <SelectValue placeholder="Select fabric material" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fabrics
                                                .filter(f => !selectedItem?.availableFabrics || selectedItem.availableFabrics.length === 0 || selectedItem.availableFabrics.includes(f.id))
                                                .map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Print Method <span className="text-destructive">*</span></Label>
                                    <Select value={formData.printType} onValueChange={(v) => setFormData({ ...formData, printType: v })}>
                                        <SelectTrigger className="border-white/10 bg-muted/20 focus:ring-accent/20 h-11">
                                            <SelectValue placeholder="Select application method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {printTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Quantity <span className="text-destructive">*</span></Label>
                                        <Input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="e.g. 50"
                                            className="border-white/10 bg-muted/20 focus:ring-accent/20 h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Size Range <span className="text-destructive">*</span></Label>
                                        <Select value={formData.sizeRange} onValueChange={(v) => setFormData({ ...formData, sizeRange: v })}>
                                            <SelectTrigger className="border-white/10 bg-muted/20 focus:ring-accent/20 h-11">
                                                <SelectValue placeholder="Select range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sizeRanges.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="h-px bg-border/50 my-6 border-dashed border-t border-white/20" />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold font-serif-display uppercase tracking-wide text-accent">Contact Information</h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Company Name</Label>
                                            <Input
                                                value={formData.companyName}
                                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                placeholder="Your company"
                                                className="border-white/10 bg-muted/20 focus:ring-accent/20 h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Contact Person</Label>
                                            <Input
                                                value={formData.contactPerson}
                                                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                                placeholder="Your name"
                                                className="border-white/10 bg-muted/20 focus:ring-accent/20 h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Phone Number <span className="text-destructive">*</span></Label>
                                            <Input
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                placeholder="+91..."
                                                className="border-white/10 bg-muted/20 focus:ring-accent/20 h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</Label>
                                            <Input
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="email@example.com"
                                                className="border-white/10 bg-muted/20 focus:ring-accent/20 h-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Additional Notes</Label>
                                        <Textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Any specific instructions, requirements, or questions..."
                                            className="border-white/10 bg-muted/20 focus:ring-accent/20 min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                )}
            </main>
        </div>
    );
}

