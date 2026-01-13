import { StitchingLoader } from "@/components/ui/StitchingLoader";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <StitchingLoader />
        </div>
    );
}
