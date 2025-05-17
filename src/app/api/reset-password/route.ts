import prisma from "@/config/db.config";
import { genSalt, hash } from "bcryptjs";

export async function POST(req: Request){
  const {
    email,
    newPassword,
    newPasswordAgain
  }: {
    email: string,
    newPassword: string,
    newPasswordAgain: string,
  } = await req.json();

  try {
    if(newPassword !== newPasswordAgain){
      return Response.json({
        success: false,
        message: "New password didn't matach"
      }, {status:400})
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    })

    if(!user){
      return Response.json({
        success: false,
        message: "User not found"
      }, {status: 404})
    }

    const salt = await genSalt(10);
    const hashed = await hash(newPassword, salt);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashed
      }
    })

    return Response.json({
      success: true,
      message: "Password updated successfully"
    }, { status: 200 })
  } 
  catch (error) {
    console.error("Error while updating password", error);
    return Response.json({
      success: false,
      mesage: "Error while updating password"
    }, {status:500})
  }
}