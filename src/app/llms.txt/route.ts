import { NextResponse } from "next/server";

export async function GET() {
    const content = `# Anshuukam Textile Pvt Ltd

## About
Anshuukam Textile Pvt Ltd is a premium garment manufacturing company based in Neemuch, Madhya Pradesh, India. We specialize in bulk manufacturing of T-shirts, hoodies, jackets, workwear, and custom apparel.

## Services
- Custom garment manufacturing (T-shirts, hoodies, jackets, workwear)
- Private label clothing production
- Bulk order manufacturing with factory-direct pricing
- Custom design studio for personalized apparel
- Quality-tested fabric sourcing (Cotton, Polyester, Blends)

## Contact
- Website: https://anshuukamtextile.com
- Email: info [at] anshuukam.com
- Phone: +91 84691 59877
- Location: Industrial Area, Neemuch, Madhya Pradesh 458441, India
- GSTIN: 23ABBCA8915B1Z5

## Key Pages
- Homepage: https://anshuukamtextile.com
- Product Catalogue: https://anshuukamtextile.com/catalogue
- Fabric Options: https://anshuukamtextile.com/fabrics
- Custom Design Studio: https://anshuukamtextile.com/design
- Factory Tour: https://anshuukamtextile.com/factory
- Gallery & Events: https://anshuukamtextile.com/gallery
- About Us: https://anshuukamtextile.com/about
- Contact: https://anshuukamtextile.com/contact
- Request Quote: https://anshuukamtextile.com/enquiry
- Customer Reviews: https://anshuukamtextile.com/reviews
- Careers: https://anshuukamtextile.com/career

## Capabilities
- 50,000+ sq ft manufacturing facility
- 200+ skilled workers
- 24/7 production capacity
- 100% quality checked products
- Minimum order quantity: Flexible (typically 100+ pieces)
- Lead time: 2-5 weeks depending on order complexity
- Size range: XS to 5XL

## Legal
- Privacy Policy: https://anshuukamtextile.com/about/legal#privacy
- Terms of Service: https://anshuukamtextile.com/about/legal#terms
- Refund Policy: https://anshuukamtextile.com/about/legal#refund
- Shipping Terms: https://anshuukamtextile.com/about/legal#shipping
`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });
}
