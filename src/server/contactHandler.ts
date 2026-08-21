import { Resend } from "resend";
import nodemailer from "nodemailer";
import {
  isRateLimited,
  validateAndSanitizeContactInput,
  escapeHtml,
} from "./security";

export interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // Honeypot field
}

export interface ContactApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function processContactSubmission(
  body: ContactRequestBody,
  clientIp: string = "127.0.0.1"
): Promise<{ status: number; data: ContactApiResponse }> {
  // 1. Rate Limiting Guard (5 requests per IP per 15 minutes via Upstash Redis or Memory Fallback)
  if (await isRateLimited(clientIp)) {
    return {
      status: 429,
      data: {
        success: false,
        error: "Too many submission attempts. Please wait 15 minutes before sending another message.",
      },
    };
  }

  // 2. Server-side Validation, Sanitization, Length & Honeypot Checks
  const validation = validateAndSanitizeContactInput(body);

  // Honeypot Protection: Silently accept bot submission without sending email
  if (validation.isSpamBot) {
    console.info(`[Spam Guard] Suppressed honeypot submission from IP: ${clientIp}`);
    return {
      status: 200,
      data: { success: true, message: "Message processed." },
    };
  }

  if (!validation.isValid || !validation.data) {
    return {
      status: 400,
      data: { success: false, error: validation.error || "Invalid form submission." },
    };
  }

  const { name, email, subject, message } = validation.data;
  const recipientEmail = process.env.CONTACT_EMAIL?.trim();
  const resendApiKey = process.env.RESEND_API_KEY;
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;
  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;

  if (!recipientEmail) {
    console.error("[Contact Configuration Error]: CONTACT_EMAIL is not configured.");
    return {
      status: 503,
      data: {
        success: false,
        error: "Contact delivery is not configured. Please try again later.",
      },
    };
  }

  // 3. Formspree Delivery Option
  if (formspreeEndpoint && formspreeEndpoint.trim() !== "") {
    try {
      const response = await fetch(formspreeEndpoint.trim(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || `New Portfolio Message from ${name}`,
          message,
        }),
      });

      if (response.ok) {
        console.log("[Formspree Email Sent Successfully]");
        return {
          status: 200,
          data: { success: true, message: "Message sent successfully" },
        };
      }
    } catch (fsErr: unknown) {
      console.error("[Formspree Exception]:", fsErr instanceof Error ? fsErr.message : fsErr);
    }
  }

  // 4. Web3Forms Email Delivery Option
  if (web3FormsKey && web3FormsKey.trim() !== "") {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsKey.trim(),
          name,
          email,
          subject: subject || `New Portfolio Message from ${name}`,
          message,
          from_name: "Portfolio Contact Form",
        }),
      });

      const data = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;

      if (response.ok && data?.success) {
        console.log("[Web3Forms Email Dispatched]:", data?.message);
        return {
          status: 200,
          data: {
            success: true,
            message: "Message sent successfully",
          },
        };
      } else {
        console.error("[Web3Forms Error]:", data?.message || "Unknown error");
      }
    } catch (w3Err: unknown) {
      console.error("[Web3Forms Exception]:", w3Err instanceof Error ? w3Err.message : w3Err);
    }
  }

  // 5. Email Delivery via Resend API
  if (resendApiKey && resendApiKey.trim() !== "") {
    try {
      const resend = new Resend(resendApiKey.trim());
      const emailSubject = subject || `New Portfolio Message from ${name}`;

      const { data, error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: recipientEmail,
        replyTo: email,
        subject: emailSubject,
        html: `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #1B1B18; border-bottom: 3px solid #D9A62C; padding-bottom: 10px; margin-top: 0;">New Portfolio Contact Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 120px;">Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;"><a href="mailto:${escapeHtml(email)}" style="color: #2563eb;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Subject:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${escapeHtml(emailSubject)}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <h4 style="color: #1B1B18; margin-bottom: 8px;">Message:</h4>
            <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #D9A62C; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${escapeHtml(message)}</div>
          </div>
        `,
      });

      if (error) {
        console.error("[Resend Error]:", error.message);
        return {
          status: 500,
          data: {
            success: false,
            error: "Unable to send your message right now. Please try again later.",
          },
        };
      }

      console.log("[Resend Email Sent Successfully]: ID", data?.id);
      return {
        status: 200,
        data: {
          success: true,
          message: "Message sent successfully",
        },
      };
    } catch (err: unknown) {
      console.error("[Resend Exception]:", err instanceof Error ? err.message : err);
      return {
        status: 500,
        data: {
          success: false,
          error: "An unexpected error occurred while processing your request.",
        },
      };
    }
  }

  // 6. Fallback: SMTP / Nodemailer
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Boolean(process.env.SMTP_SECURE),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: email,
        subject: subject || `New Portfolio Message from ${name}`,
        text: `From: ${name} (${email})\n\nMessage:\n${message}`,
      });

      return {
        status: 200,
        data: {
          success: true,
          message: "Message sent successfully",
        },
      };
    } catch (smtpErr: unknown) {
      console.error("[SMTP Error]:", smtpErr instanceof Error ? smtpErr.message : smtpErr);
    }
  }

  // 7. Missing Keys Warning
  return {
    status: 503,
    data: {
      success: false,
      error: "Contact delivery is not configured. Please try again later.",
    },
  };
}
