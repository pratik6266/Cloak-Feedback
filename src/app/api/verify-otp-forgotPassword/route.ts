import prisma from "@/config/db.config";

export async function POST(req: Request){
  const { email, otp }: { email: string, otp: string} = await req.json();

  try {
    const user = await prisma.user.findFirst({
      where:{
        email,
      }
    })

    if(!user){
      return Response.json({
        success: false,
        message: "User not found"
      }, {status: 404})
    }

    const isCodeValid = user.verifyCode === otp;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isCodeNotExpired){
      return Response.json({
        success: true,
        message: "OTP verified successfully"
      }, {status: 200})
    }

    return Response.json({
      success: false,
      message: "Invalid Otp, Try again"
    }, {status: 400})
  } 
  catch (error) {
    console.log("Failed to verify otp in forgot password", error);
    return Response.json({
      success: false,
      message: "Failed to verify opt in forgot passowrd"
    }, {status: 500})
  }
}