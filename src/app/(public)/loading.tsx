import { StitchingLoader } from "@/components/ui/StitchingLoader";

export default function Loading() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-blueprint relative">
            <div className="absolute top-0 left-0 right-0 h-1 industrial-stripe opacity-20" />
            <StitchingLoader />
        </div>
    );
}
