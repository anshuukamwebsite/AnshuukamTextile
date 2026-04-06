import { Area } from "react-easy-crop";

/**
 * Creates a cropped image from a source image using the Canvas API.
 * @param imageSrc - The source image URL (data URL or blob URL)
 * @param pixelCrop - The crop area in pixels from react-easy-crop
 * @returns A Promise that resolves to a Blob of the cropped image
 */
export async function getCroppedImage(
    imageSrc: string,
    pixelCrop: Area
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Canvas toBlob failed"));
                    return;
                }
                resolve(blob);
            },
            "image/jpeg",
            0.92
        );
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.crossOrigin = "anonymous";
        image.src = url;
    });
}
