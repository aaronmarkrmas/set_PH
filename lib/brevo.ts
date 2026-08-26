import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export async function sendOTPEmail(
  email: string,
  otp: string
) {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.BREVO_SENDER_EMAIL!,
      name: process.env.BREVO_SENDER_NAME || "Your App",
    },
    to: [
      {
        email,
      },
    ],
    subject: "Verify your account",
    htmlContent: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your account</h2>

        <p>Thank you for creating an account.</p>

        <p>Your verification code is:</p>

        <h1>${otp}</h1>

        <p>This code will expire in 10 minutes.</p>

        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });
}