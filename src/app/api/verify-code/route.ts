import prisma from "@/config/db.config";

export async function POST (req: Request){
  try {
    const { userName, code } = await req.json();
    const decodedUserName = decodeURIComponent(userName);
    const user = await prisma.user.findFirst({
      where:{
        userName: decodedUserName,
      }
    })

    if(!user){
      return Response.json({
        success: false,
        message: "User not found"
      }, {status: 404})
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isCodeNotExpired){
      //* This is how you update things in prisma
      await prisma.user.update({
        where:{
          id: user.id
        },
        data:{
          isVerified: true,
        }
      })

      return Response.json({
        success: true,
        message: "Account verified successfully"
      }, {status: 200})
    }

    return Response.json({
      success: false,
      message: "Invalid Otp, Try again"
    }, {status: 400})

  } catch (error) {
    console.error("Error while verifying code", error)
    return Response.json({
      success: false,
      message: "Error while verifying code"
    }, {status: 500})
  }
}