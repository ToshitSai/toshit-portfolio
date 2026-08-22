import {
  isRateLimited,
  validateAndSanitizeContactInput,
} from "./security.js";

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

  // Honeypot Protection: suppress bot submission without sending email.
  if (validation.isSpamBot) {
    console.info(`[Spam Guard] Suppressed honeypot submission from IP: ${clientIp}`);
    return {
      status: 200,
      data: { success: false, error: "Unable to send message" },
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
  const web3FormsAccessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();

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

  if (!web3FormsAccessKey) {
    console.error("[Contact Configuration Error]: WEB3FORMS_ACCESS_KEY is not configured.");
    return {
      status: 503,
      data: {
        success: false,
        error: "Contact delivery is not configured. Please try again later.",
      },
    };
  }

  // 3. Email Delivery via Web3Forms API
  try {
    const emailSubject = subject || `New Portfolio Message from ${name}`;
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: web3FormsAccessKey,
        name,
        email,
        replyto: email,
        subject: emailSubject,
        message: [
          "New Portfolio Contact Inquiry",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${emailSubject}`,
          "",
          "Message:",
          message,
        ].join("\n"),
        from_name: "Portfolio Contact Form",
        botcheck: "",
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;

    if (!response.ok || !data?.success) {
      console.error("[Web3Forms Error]:", data?.message || `HTTP ${response.status}`);
      return {
        status: 502,
        data: {
          success: false,
          error: "Unable to send message",
        },
      };
    }

    console.log("[Web3Forms Email Sent Successfully]");
    return {
      status: 200,
      data: {
        success: true,
        message: "Message sent successfully",
      },
    };
  } catch (err: unknown) {
    console.error("[Web3Forms Exception]:", err instanceof Error ? err.message : err);
    return {
      status: 502,
      data: {
        success: false,
        error: "Unable to send message",
      },
    };
  }
}
