import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match only admin routes to reduce edge function invocations.
         * Public routes don't need session checks for this application.
         */
        "/admin/:path*",
    ],
};
