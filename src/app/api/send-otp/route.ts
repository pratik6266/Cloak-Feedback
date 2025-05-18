import prisma from "@/config/db.config";
import { sendVerificationEmail } from "@/helpers/sendEmailVerification";

export async function POST(req: Request){
  const { userName }: { userName: string } = await req.json();
  try {
    const user = await prisma.user.findFirst({
      where: {
        userName,
      }
    })
  
    if(!user){
      return Response.json({
        success: false,
        message: "User not found",
      }, {status: 404});
    }
  
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newCodeExpiry: Date = new Date(Date.now() + 3600000);
    const response = await sendVerificationEmail(user.email, user.userName, verifyCode);
    if(!response.success){
      return Response.json({
        success: false,
        message: response.message
      }, {status: 500})
    }

    await prisma.user.updateMany({
      where: {
        userName,
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