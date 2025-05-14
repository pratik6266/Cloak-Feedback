import { resend } from "@/config/resend";
import VerificationEmail from "../../emails/verification";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifycode: string,
): Promise<ApiResponse>
{
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verification Code',
      react: VerificationEmail({userName, otp: verifycode})
    });

    return {success: true, message: "verification email send successfully"};
  } catch (error) {
    console.error("Error sending verification email", error);
    return {success: false, message: "Failed to send verification email"};
  }
}