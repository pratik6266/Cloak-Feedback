import prisma from "@/config/db.config";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendEmailVerification";

export async function POST(req: Request){
  try {
    const {userName, email, password} =  await req.json();
    const existingUserByUserName = await prisma.user.findFirst({
      where: {
        userName,
        isVerified: true,
      }
    })

    if(existingUserByUserName){
      return Response.json(
        {
          success: false,
          message: "userName is not aviable",
        },
        {
          status: 400
        }
      )
    }

    const existingUserByEmail = await prisma.user.findFirst({
      where: {
        email,
      }
    })
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        return Response.json({
          success: false,
          message: "User already exists with this emial"
        }, {status: 400})
      }
      else{
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
      }
    }
    else{
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser = await prisma.user.create({
        data: {
          userName,
          email,
          password: hashPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
        }
      })
      console.log(newUser);
    }

    const emailResponse = await sendVerificationEmail(email, userName, verifyCode);
    if(!emailResponse.success){
      return Response.json({
        success: false,
        message: emailResponse.message
      }, {status: 500})
    }
    return Response.json({
      success: true,
      message: "User registered successfully",
    }, {status: 200})

  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error resgistering user"
      },
      {
        status: 500
      }
    )
  }
}