import { getCachedNavigationData } from "@/lib/services/cached-data";
import { Header } from "./Header";

export async function HeaderWrapper() {
    const navigationData = await getCachedNavigationData();
    return <Header navigationData={navigationData} />;
}
