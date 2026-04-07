const RESEND_API_BASE_URL = "https://api.resend.com";

const getResendApiKey = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  return apiKey;
};

const getResendFromEmail = () => {
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();

  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL environment variable is not set");
  }

  return fromEmail;
};

type ResendSendEmailResponse = {
  id?: string;
};

type ResendErrorResponse = {
  message?: string;
  name?: string;
  statusCode?: number;
};

export const sendWriterOtpEmail = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const response = await fetch(`${RESEND_API_BASE_URL}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getResendApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getResendFromEmail(),
      to: [email],
      subject: "Your Aspire verification code",
      text: `Your Aspire verification code is ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
          <p style="margin: 0 0 12px;">Use this verification code to continue your article submission:</p>
          <p style="margin: 0 0 16px; font-size: 28px; font-weight: 700; letter-spacing: 6px;">${code}</p>
          <p style="margin: 0; color: #6b7280;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
        </div>
      `,
      tags: [{ name: "category", value: "writer_otp" }],
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as
    | ResendSendEmailResponse
    | ResendErrorResponse;

  if (!response.ok) {
    const errorPayload = payload as ResendErrorResponse;
    throw new Error(
      errorPayload.message ||
        `Failed to send OTP email (Resend status ${response.status})`
    );
  }

  return payload as ResendSendEmailResponse;
};
