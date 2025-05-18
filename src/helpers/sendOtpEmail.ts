import transporter from "@/config/nodeMailer.config";
import { ApiResponse } from "@/types/apiResponse";
import { Forgot_Password_Verification } from "../../emails/otp";

export const sendOtpEmail = async (
  email: string,
  userName: string,
  verifycode: string,
): Promise<ApiResponse> => {
  try {
    const info = await transporter.sendMail({
      from: `"Cloak Feedback" <${process.env.SENDER_GMAIL}>`,
      to: `${userName}, ${email}`,
      subject: "Verify Your Eamil",
      text: "Verify Your Email", 
      html: Forgot_Password_Verification.replace("{verificationCode}",verifycode), 
    });

    console.log("Message sent:", info.messageId);
    return {success: true, message: "OTP send successfully"};
  } 
  catch (error) {
    console.error("Failed to send verification email", error);
    return {success: false, message: "Failed to send verification email"};
  }
}