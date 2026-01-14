import { getCachedNavigationData } from "@/lib/services/cached-data";
import { getContactSettings } from "@/lib/services/settings";
import { Header } from "./Header";

export async function HeaderWrapper() {
    const navigationData = await getCachedNavigationData();
    const contactSettings = await getContactSettings();
    return <Header navigationData={navigationData} contactSettings={contactSettings} />;
}
