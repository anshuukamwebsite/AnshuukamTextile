import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not configured");
      return null;
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

interface EnquiryEmailData {
  clothingType: string;
  fabric: string;
  quantity: number;
  sizeRange: string;
  phoneNumber: string;
  email?: string;
  companyName?: string;
  contactPerson?: string;
  notes?: string;
}

interface DesignEnquiryEmailData extends EnquiryEmailData {
  printType: string;
}

// Corporate email template base
const emailBase = (content: string, footerNote: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                      Anshukkam Textile
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
                      Manufacturing Co.
                    </p>
                  </td>
                  <td align="right">
                    <!-- PT Logo Removed -->
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                ${footerNote}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      © ${new Date().getFullYear()} Anshukkam Textile
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      B2B Garment Manufacturing
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function sendEnquiryNotification(data: EnquiryEmailData) {
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (!emailTo) {
    console.warn("EMAIL_TO not configured, skipping email notification");
    return null;
  }

  const content = `
    <!-- Alert Badge -->
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 0 4px 4px 0;">
      <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
        🔔 New Enquiry Received
      </p>
      <p style="margin: 4px 0 0 0; color: #a16207; font-size: 13px;">
        A new enquiry has been submitted through the website.
      </p>
    </div>

    <!-- Contact Information Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; display: inline-block;">
        Contact Information
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0;">
            <span style="color: #64748b; font-size: 13px;">Phone</span>
          </td>
          <td style="padding: 8px 0;" align="right">
            <strong style="color: #1e293b; font-size: 14px;">${data.phoneNumber}</strong>
          </td>
        </tr>
        ${data.email ? `
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 13px;">Email</span>
          </td>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;" align="right">
            <a href="mailto:${data.email}" style="color: #2563eb; font-size: 14px; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        ` : ""}
        ${data.companyName ? `
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 13px;">Company</span>
          </td>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;" align="right">
            <strong style="color: #1e293b; font-size: 14px;">${data.companyName}</strong>
          </td>
        </tr>
        ` : ""}
        ${data.contactPerson ? `
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 13px;">Contact Person</span>
          </td>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;" align="right">
            <strong style="color: #1e293b; font-size: 14px;">${data.contactPerson}</strong>
          </td>
        </tr>
        ` : ""}
      </table>
    </div>

    <!-- Order Details Card -->
    <div style="background-color: #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 16px 0; color: #f59e0b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
        Order Details
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding: 16px; background-color: #334155; border-radius: 6px 0 0 0;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Product Type</span>
            <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700;">${data.clothingType}</p>
          </td>
          <td width="50%" style="padding: 16px; background-color: #334155; border-radius: 0 6px 0 0; border-left: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Fabric</span>
            <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700;">${data.fabric}</p>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding: 16px; background-color: #334155; border-radius: 0 0 0 6px; border-top: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Quantity</span>
            <p style="margin: 8px 0 0 0; color: #f59e0b; font-size: 28px; font-weight: 800;">${data.quantity.toLocaleString()}</p>
            <span style="color: #94a3b8; font-size: 13px;">units</span>
          </td>
          <td width="50%" style="padding: 16px; background-color: #334155; border-radius: 0 0 6px 0; border-top: 1px solid #475569; border-left: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Size Range</span>
            <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700;">${data.sizeRange}</p>
          </td>
        </tr>
      </table>
    </div>

    ${data.notes ? `
    <!-- Notes Section -->
    <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 12px 0; color: #475569; font-size: 14px; font-weight: 600;">
        Additional Notes
      </h2>
      <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">
        ${data.notes}
      </p>
    </div>
    ` : ""}

    <!-- Action Button -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-top: 16px;">
          <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
            Please respond to this enquiry within 24 hours.
          </p>
        </td>
      </tr>
    </table>
  `;

  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend not configured, skipping email notification");
    return null;
  }

  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: [emailTo],
      subject: `📦 New Enquiry: ${data.clothingType} - ${data.quantity.toLocaleString()} units`,
      html: emailBase(content, "This is an internal notification. Please follow up with the customer promptly."),
    });

    return result;
  } catch (error) {
    console.error("Failed to send enquiry notification:", error);
    throw error;
  }
}

export async function sendDesignEnquiryNotification(data: DesignEnquiryEmailData) {
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (!emailTo) {
    console.warn("EMAIL_TO not configured, skipping email notification");
    return null;
  }

  const content = `
    <!-- Alert Badge -->
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 0 4px 4px 0;">
      <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
        🎨 New Design Enquiry Received
      </p>
      <p style="margin: 4px 0 0 0; color: #a16207; font-size: 13px;">
        A new custom design enquiry has been submitted. View the design in the admin panel.
      </p>
    </div>

    <!-- Contact Information Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; display: inline-block;">
        Contact Information
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0;">
            <span style="color: #64748b; font-size: 13px;">Phone</span>
          </td>
          <td style="padding: 8px 0;" align="right">
            <strong style="color: #1e293b; font-size: 14px;">${data.phoneNumber}</strong>
          </td>
        </tr>
        ${data.email ? `
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 13px;">Email</span>
          </td>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;" align="right">
            <a href="mailto:${data.email}" style="color: #2563eb; font-size: 14px; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        ` : ""}
        ${data.companyName ? `
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 13px;">Company</span>
          </td>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;" align="right">
            <strong style="color: #1e293b; font-size: 14px;">${data.companyName}</strong>
          </td>
        </tr>
        ` : ""}
        ${data.contactPerson ? `
        <tr>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 13px;">Contact Person</span>
          </td>
          <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;" align="right">
            <strong style="color: #1e293b; font-size: 14px;">${data.contactPerson}</strong>
          </td>
        </tr>
        ` : ""}
      </table>
    </div>

    <!-- Order Details Card -->
    <div style="background-color: #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 16px 0; color: #f59e0b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
        Order Details
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding: 16px; background-color: #334155; border-radius: 6px 0 0 0;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Print Type</span>
            <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700;">${data.printType}</p>
          </td>
          <td width="50%" style="padding: 16px; background-color: #334155; border-radius: 0 6px 0 0; border-left: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Fabric</span>
            <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700;">${data.fabric}</p>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding: 16px; background-color: #334155; border-radius: 0 0 0 6px; border-top: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Quantity</span>
            <p style="margin: 8px 0 0 0; color: #f59e0b; font-size: 28px; font-weight: 800;">${data.quantity.toLocaleString()}</p>
            <span style="color: #94a3b8; font-size: 13px;">units</span>
          </td>
          <td width="50%" style="padding: 16px; background-color: #334155; border-radius: 0 0 6px 0; border-top: 1px solid #475569; border-left: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Size Range</span>
            <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700;">${data.sizeRange}</p>
          </td>
        </tr>
      </table>
    </div>

    ${data.notes ? `
    <!-- Notes Section -->
    <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h2 style="margin: 0 0 12px 0; color: #475569; font-size: 14px; font-weight: 600;">
        Additional Notes
      </h2>
      <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">
        ${data.notes}
      </p>
    </div>
    ` : ""}

    <!-- Action Note -->
    <div style="text-align: center; padding-top: 16px;">
      <p style="margin: 0; color: #64748b; font-size: 13px;">
        View the design images in the Admin Panel → Design Enquiries
      </p>
    </div>
  `;

  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend not configured, skipping email notification");
    return null;
  }

  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: [emailTo],
      subject: `🎨 New Design Enquiry: ${data.quantity.toLocaleString()} units`,
      html: emailBase(content, "This is an internal notification."),
    });

    return result;
  } catch (error) {
    console.error("Failed to send design enquiry notification:", error);
    throw error;
  }
}

export async function sendEnquiryConfirmation(
  email: string,
  data: EnquiryEmailData
) {
  const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const companyName = "Anshukkam Textile";

  const content = `
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; background-color: #dcfce7; border-radius: 50%; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 28px;">✓</span>
      </div>
      <h1 style="margin: 0 0 8px 0; color: #1e293b; font-size: 24px; font-weight: 700;">
        Thank You for Your Enquiry
      </h1>
      <p style="margin: 0; color: #64748b; font-size: 15px;">
        We've received your request and will be in touch shortly.
      </p>
    </div>

    <!-- Greeting -->
    <p style="margin: 0 0 24px 0; color: #334155; font-size: 15px; line-height: 1.6;">
      Dear <strong>${data.contactPerson || "Valued Customer"}</strong>,
    </p>
    <p style="margin: 0 0 24px 0; color: #334155; font-size: 15px; line-height: 1.6;">
      Thank you for reaching out to ${companyName}. Our team is reviewing your enquiry and 
      you can expect to hear from us within <strong>24 business hours</strong>.
    </p>

    <!-- Order Summary Card -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h2 style="margin: 0 0 20px 0; color: #f59e0b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">
        Your Enquiry Summary
      </h2>
      
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Product</span>
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #475569;" align="right">
            <strong style="color: #ffffff; font-size: 18px;">${data.clothingType}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Fabric</span>
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #475569;" align="right">
            <strong style="color: #ffffff; font-size: 18px;">${data.fabric}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #475569;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Quantity</span>
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #475569;" align="right">
            <strong style="color: #f59e0b; font-size: 24px;">${data.quantity.toLocaleString()} units</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 0;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Size Range</span>
          </td>
          <td style="padding: 16px 0;" align="right">
            <strong style="color: #ffffff; font-size: 18px;">${data.sizeRange}</strong>
          </td>
        </tr>
      </table>
    </div>

    <!-- What's Next -->
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 15px; font-weight: 600;">
        What happens next?
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="32" valign="top" style="padding-bottom: 12px;">
            <div style="width: 24px; height: 24px; background-color: #1e293b; border-radius: 50%; text-align: center; line-height: 24px; color: #f59e0b; font-size: 12px; font-weight: bold;">1</div>
          </td>
          <td style="padding-left: 12px; padding-bottom: 12px;">
            <p style="margin: 0; color: #334155; font-size: 14px;">Our team reviews your requirements</p>
          </td>
        </tr>
        <tr>
          <td width="32" valign="top" style="padding-bottom: 12px;">
            <div style="width: 24px; height: 24px; background-color: #1e293b; border-radius: 50%; text-align: center; line-height: 24px; color: #f59e0b; font-size: 12px; font-weight: bold;">2</div>
          </td>
          <td style="padding-left: 12px; padding-bottom: 12px;">
            <p style="margin: 0; color: #334155; font-size: 14px;">We prepare a customized quote for you</p>
          </td>
        </tr>
        <tr>
          <td width="32" valign="top">
            <div style="width: 24px; height: 24px; background-color: #1e293b; border-radius: 50%; text-align: center; line-height: 24px; color: #f59e0b; font-size: 12px; font-weight: bold;">3</div>
          </td>
          <td style="padding-left: 12px;">
            <p style="margin: 0; color: #334155; font-size: 14px;">A sales representative will contact you</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Closing -->
    <p style="margin: 0 0 8px 0; color: #334155; font-size: 15px; line-height: 1.6;">
      If you have any urgent questions, please don't hesitate to contact us directly.
    </p>
    <p style="margin: 24px 0 0 0; color: #334155; font-size: 15px;">
      Best regards,<br />
      <strong style="color: #1e293b;">The ${companyName} Team</strong>
    </p>
  `;

  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend not configured, skipping confirmation email");
    return null;
  }

  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject: `✅ Enquiry Received - ${companyName}`,
      html: emailBase(content, "You received this email because you submitted an enquiry on our website."),
    });

    return result;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return null;
  }
}
