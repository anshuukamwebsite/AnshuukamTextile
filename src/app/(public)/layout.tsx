import { HeaderWrapper, Footer } from "@/components/public";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScrollProvider>
            <div className="min-h-screen flex flex-col">
                <HeaderWrapper />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster position="top-right" />
            </div>
        </SmoothScrollProvider>
    );
}
