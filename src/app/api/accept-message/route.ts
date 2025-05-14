import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import prisma from "@/config/db.config";
import { User } from "next-auth";

export async function POST (req: Request){
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if(!session || !user){
    return Response.json({
      success: false,
      message: "User not found"
    }, {status: 400})
  }

  const userId = user.id;
  const { acceptMsg } = await req.json();

  try {
    const fetchedUser = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    if(!fetchedUser){
      return Response.json({
        success: false,
        message: "User not found"
      }, {status: 404})
    }

    await prisma.user.update({
      where:{
        id: userId
      },
      data:{
        isAcceptingMessage: acceptMsg
      }
    })

    return Response.json({
      success: true,
      message: "User accept message status updated successfully"
    }, { status: 200 })

  } 
  catch (error) {
    console.error("Failed to update user accept msg status", error);
    return Response.json({
      success: false,
      message: "Failed to update user accpet msg status"
    }, {status: 500})
  }
}

export async function GET (){
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if(!session || !user){
    return Response.json({
      success: false,
      message: "User not found"
    }, {status: 400})
  }

  const userId = user.id; 
  try {
    const getUser = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })
  
    if(!getUser){
      return Response.json({
        success: false,
        message: "Failed to found the user"
      }, {status: 404})
    }
  
    const userStatus = getUser.isAcceptingMessage;
    return Response.json({
      success: true,
      isAcceptingMessage: userStatus
    }, {status: 200})

  } 
  catch (error) {
    console.error("Error while fetching user accept msg status", error);
    return Response.json({
      success: false,
      message: "Error while fetching user accpet msg status"
    }, {status: 500})
  }
}