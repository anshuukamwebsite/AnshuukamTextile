import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Custom Design Studio",
    description: "Design your own custom garments with our interactive design studio. Upload your logo, choose fabrics, and create unique apparel for your brand with Anshuukam Textile.",
};

export default function DesignLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
