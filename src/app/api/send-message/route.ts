import prisma from "@/config/db.config";

export async function POST(req: Request){
  const {userName, content}: {userName: string, content: string} = await req.json();

  try {
    const user = await prisma.user.findFirst({
      where:{
        userName,
      }
    })

    if(!user){
      return Response.json({
        success: false,
        message: "User not found"
      }, { status: 400})
    }

    if(!user.isAcceptingMessage){
      return Response.json({
        success: true,
        message: "User is not accepting feedback"
      }, { status: 200 })
    }

    const newMsg = await prisma.message.create({
      data: {
        content,
        authorId: user.id
      }
    })

    return Response.json({
      success: true,
      message: "Feedback sent successfully",
      newMsg: newMsg
    }, { status: 200 })
  } 
  catch (error) {
    console.log("Error while sending message", error);
    return Response.json({
      success: false,
      message: "Error while seindng message"
    }, {status: 500})
  }
}