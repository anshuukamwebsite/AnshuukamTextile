import { StitchingLoader } from "@/components/ui/StitchingLoader";

export default function Loading() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-muted/30">
            <StitchingLoader />
        </div>
    );
}
