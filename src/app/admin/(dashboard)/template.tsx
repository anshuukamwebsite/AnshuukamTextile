"use client";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-fade-slide-up">
            {children}
            <style jsx global>{`
                @keyframes fade-slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-slide-up {
                    animation: fade-slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
