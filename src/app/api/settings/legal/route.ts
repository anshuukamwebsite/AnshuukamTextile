import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

const SETTING_KEY = "legal_page";

// Default content structure for Legal Page
const defaultContent = {
    privacy: {
        title: "Privacy Policy",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Information We Collect",
                text: "We collect information you provide directly to us, such as when you submit an enquiry, request a quote, or contact us. This may include your name, email address, phone number, company name, and details about your product requirements."
            },
            {
                heading: "How We Use Your Information",
                text: "We use the information we collect to: respond to your enquiries and provide customer support; process and fulfill your orders; send you updates about your orders and our services; improve our website and services; comply with legal obligations."
            },
            {
                heading: "Information Sharing",
                text: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or serving you, so long as those parties agree to keep this information confidential."
            },
            {
                heading: "Data Security",
                text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
            },
            {
                heading: "Cookies",
                text: "Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality of the website."
            },
            {
                heading: "Your Rights",
                text: "You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at the details provided on our Contact page."
            }
        ]
    },
    terms: {
        title: "Terms of Service",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Acceptance of Terms",
                text: "By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website."
            },
            {
                heading: "Business-to-Business (B2B) Services",
                text: "Anshuukam Textile Private Limited operates as a B2B garment manufacturing company. Our services are intended for businesses, retailers, and bulk buyers. Minimum order quantities apply to all orders."
            },
            {
                heading: "Quotes and Orders",
                text: "All quotes provided are valid for 15 days unless otherwise specified. Prices are subject to change based on fabric costs, order volume, and customization requirements. Orders are confirmed only upon receipt of advance payment as per agreed terms."
            },
            {
                heading: "Intellectual Property",
                text: "All content on this website, including text, graphics, logos, and images, is the property of Anshuukam Textile Private Limited and is protected by applicable intellectual property laws."
            },
            {
                heading: "Limitation of Liability",
                text: "Anshuukam Textile shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or products. Our total liability shall not exceed the amount paid for the specific order in question."
            },
            {
                heading: "Governing Law",
                text: "These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Neemuch, Madhya Pradesh."
            }
        ]
    },
    refund: {
        title: "Refund & Cancellation Policy",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Order Cancellation",
                text: "Orders may be cancelled within 24 hours of confirmation without any charges. After production has commenced, cancellation may incur charges for materials already procured and work completed."
            },
            {
                heading: "Custom Orders",
                text: "As a B2B manufacturer, most of our orders are custom-made to client specifications. Custom orders are non-refundable once production has begun, as materials are specifically procured for each order."
            },
            {
                heading: "Quality Issues",
                text: "If you receive products that do not meet the agreed-upon specifications or have manufacturing defects, please notify us within 7 days of delivery. We will inspect the products and offer replacement or credit at our discretion."
            },
            {
                heading: "Refund Process",
                text: "Approved refunds will be processed within 15-30 business days. Refunds will be credited to the original payment method used for the order. Shipping costs are non-refundable unless the return is due to our error."
            },
            {
                heading: "Advance Payments",
                text: "Advance payments are adjusted against the final order value. In case of order cancellation after advance payment, refunds will be made after deducting applicable charges for work already completed."
            }
        ]
    },
    shipping: {
        title: "Shipping & Delivery Terms",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Production Lead Time",
                text: "Standard production lead time is 3-5 weeks from order confirmation and receipt of advance payment. Lead times may vary based on order complexity, volume, and current production capacity."
            },
            {
                heading: "Shipping Methods",
                text: "We ship via reputable logistics partners across India. International shipping is available for bulk orders. Shipping method and carrier will be confirmed at the time of dispatch."
            },
            {
                heading: "Shipping Costs",
                text: "Shipping costs are calculated based on order volume, weight, and destination. Costs will be communicated and agreed upon before order confirmation. For bulk orders above certain thresholds, we may offer subsidized or free shipping."
            },
            {
                heading: "Risk of Loss",
                text: "Risk of loss and title for products pass to the buyer upon delivery to the carrier. We recommend purchasing shipping insurance for high-value orders."
            },
            {
                heading: "Delivery Confirmation",
                text: "Tracking information will be provided once the order is dispatched. Please inspect packages upon delivery and report any visible damage to the carrier immediately."
            },
            {
                heading: "Delayed Deliveries",
                text: "While we strive to meet all delivery timelines, delays may occur due to factors beyond our control. We will communicate any significant delays promptly and work to minimize impact on your business."
            }
        ]
    },
    ip: {
        title: "Intellectual Property Notice",
        lastUpdated: "January 2026",
        sections: [
            {
                heading: "Website Content",
                text: "All content on the Anshuukam Textile website, including but not limited to text, graphics, logos, images, and software, is the property of Anshuukam Textile Private Limited and is protected by Indian and international copyright laws."
            },
            {
                heading: "Client Designs",
                text: "Designs, logos, and artwork provided by clients for manufacturing remain the intellectual property of the respective clients. We do not claim any rights over client-provided materials and maintain strict confidentiality."
            },
            {
                heading: "Custom Design Work",
                text: "For designs created by Anshuukam Textile as part of a custom order, intellectual property rights may be transferred to the client upon full payment and mutual agreement. Such transfers will be documented in writing."
            },
            {
                heading: "Prohibited Use",
                text: "You may not reproduce, distribute, modify, or create derivative works from any content on this website without prior written permission from Anshuukam Textile Private Limited."
            },
            {
                heading: "Trademark",
                text: "'Anshuukam Textile' and associated logos are trademarks of Anshuukam Textile Private Limited. Use of these trademarks without authorization is strictly prohibited."
            }
        ]
    }
};

export async function GET() {
    try {
        const setting = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.key, SETTING_KEY),
        });

        if (!setting) {
            return NextResponse.json({ success: true, data: defaultContent });
        }

        return NextResponse.json({ success: true, data: setting.value });
    } catch (error) {
        console.error("Failed to fetch legal page settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const existingSetting = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.key, SETTING_KEY),
        });

        if (existingSetting) {
            await db
                .update(siteSettings)
                .set({
                    value: body,
                    updatedAt: new Date()
                })
                .where(eq(siteSettings.key, SETTING_KEY));
        } else {
            await db.insert(siteSettings).values({
                key: SETTING_KEY,
                value: body,
                description: "Content for the Legal & Policies page",
            });
        }

        // Revalidate the cache for the legal page
        revalidateTag("legal-page", "max");

        return NextResponse.json({ success: true, message: "Settings updated successfully" });
    } catch (error) {
        console.error("Failed to update legal page settings:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
