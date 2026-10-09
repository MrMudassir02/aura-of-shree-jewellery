import nodemailer from "nodemailer";

type OtpPurpose = "email_verification" | "password_reset";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(
  email: string,
  otp: string,
  purpose: OtpPurpose,
) {
  const from = process.env.EMAIL_FROM;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !from) {
    throw new Error("Email service is not configured");
  }

  const isVerification = purpose === "email_verification";

  const heading = isVerification
    ? "Verify your email address"
    : "Reset your password";

  const message = isVerification
    ? "Use the verification code below to verify your email address."
    : "Use the code below to reset your password.";

  const subject = isVerification
    ? "Verify your Aura of Shree account"
    : "Reset your Aura of Shree password";

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject,
      text: `${heading}\n\n${message}\n\nYour OTP is: ${otp}\n\nThis code expires in 10 minutes. If you did not request this, you can ignore this email.`,
      html: `
        <div style="background:#2A1112;padding:32px;font-family:Arial,sans-serif;color:#F8EEE2;">
          <div style="max-width:480px;margin:auto;border:1px solid #C99A52;border-radius:16px;padding:32px;text-align:center;">
            <p style="color:#D6AA61;letter-spacing:5px;font-size:12px;">AURA OF SHREE</p>
            <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:normal;">${heading}</h1>
            <p style="color:#D5C3B5;line-height:1.6;">${message}</p>
            <div style="background:#3A1A1B;border:1px solid #C99A52;border-radius:10px;padding:20px;margin:28px 0;">
              <p style="font-size:32px;letter-spacing:8px;color:#E1B765;margin:0;">${otp}</p>
            </div>
            <p style="font-size:13px;color:#C8B5A7;">This code expires in 10 minutes.</p>
            <p style="font-size:12px;color:#9D8278;margin-top:24px;">If you did not request this email, you can safely ignore it.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("OTP email delivery failed:", error);
    throw new Error("Unable to send OTP email");
  }
}
