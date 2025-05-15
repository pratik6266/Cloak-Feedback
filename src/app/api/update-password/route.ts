import prisma from "@/config/db.config";
import bcrypt, { genSalt, hash } from "bcryptjs";

export async function POST(req: Request){
  const {
    email,
    currPassword,
    newPassword,
    newPasswordAgain
  }: {
    email: string,
    currPassword: string,
    newPassword: string,
    newPasswordAgain: string,
  } = await req.json();

  try {
    console.log(email);
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

    const result = await bcrypt.compare(currPassword, user.password);
    
    if(!result){
      return Response.json({
        success: false,
        message: "Incorrect current password"
      }, {status: 400})
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