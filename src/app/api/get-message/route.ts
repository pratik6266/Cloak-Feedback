import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import prisma from "@/config/db.config";
import { User } from "next-auth";

export async function GET (){
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if(!session || !user){
    return Response.json({
      success: false,
      message: "User not found"
    }, {status: 404})
  }

  const userId = user.id;
  try {
    const userWithMessages = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if(!userWithMessages) {
      return Response.json({
        success: false,
        message: "User not found"
      }, {status: 400})
    }

    return Response.json({
      success: true,
      messages: userWithMessages.messages
    }, {status: 200})
  } 
  catch (error) {
    console.error("Error while gettig messages", error);
    return Response.json({
      success: false,
      message: "Error while getting messages"
    }, {status: 500})
  }
}