import prisma from "@/config/db.config";
import { sendOtpEmail } from "@/helpers/sendOtpEmail";

export async function POST(req: Request){
  const { email }: { email: string } = await req.json();
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    })
  
    if(!user){
      return Response.json({
        success: false,
        message: "User not found",
      }, {status: 404});
    }

    if(!user.isVerified){
      return Response.json({
        success: false,
        message: "You are not a verified user"
      }, { status: 400 })
    }
  
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newCodeExpiry: Date = new Date(Date.now() + 3600000);
    const response = await sendOtpEmail(user.email, user.userName, verifyCode);
    if(!response.success){
      return Response.json({
        success: false,
        message: response.message
      }, {status: 500})
    }

    await prisma.user.updateMany({
      where: {
        email,
      },
      data:{
        verifyCode,
        verifyCodeExpiry: newCodeExpiry
      }
    })
  
    return Response.json({
      success: true,
      message: "OTP resend successfull",
    }, {status: 200})
  } 
  catch (error) {
    console.error("Error while sending opt again", error)
    return Response.json({
      success: false,
      message: "Something went wrong while otp resend"
    }, {status: 500})
  }
}