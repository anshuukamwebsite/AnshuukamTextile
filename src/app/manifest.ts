import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Anshuukam Textile Pvt Ltd",
        short_name: "Anshuukam",
        description: "Premium garment manufacturing from Neemuch, Madhya Pradesh. T-shirts, hoodies, jackets, workwear and more.",
        start_url: "/",
        display: "standalone",
        background_color: "#fafafa",
        theme_color: "#1a1a2e",
        icons: [
            {
                src: "/logo.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
