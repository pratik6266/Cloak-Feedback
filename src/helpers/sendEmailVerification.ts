import transporter from "@/config/nodeMailer.config";
import { ApiResponse } from "@/types/apiResponse";
import { Verification_Email_Template } from "../../emails/verification";

export const sendVerificationEmail = async (
  email: string,
  userName: string,
  verifycode: string,
): Promise<ApiResponse> => {
  try {
    const info = await transporter.sendMail({
      from: `"Cloak Feedback" <${process.env.SENDER_GMAIL}>`,
      to: `${userName}, ${email}`,
      subject: "Cloak Feedback Verification",
      text: "Verify Your Email", 
      html: Verification_Email_Template.replace("{verificationCode}",verifycode), 
    });

    console.log("Message sent:", info);
    return {success: true, message: "OTP send successfully"};
  } 
  catch (error) {
    console.error("Failed to send verification email", error);
    return {success: false, message: "Failed to send verification email"};
  }
}