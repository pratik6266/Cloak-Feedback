import prisma from "@/config/db.config";

export async function POST(req: Request) {
  const { old, newName }: { old: string, newName: string } = await req.json();
  try {
    const user = await prisma.user.findFirst({
      where: {
        userName: old,
      }
    })

    if(!user){
      return Response.json({
        success: false,
        message: "User not found"
      }, {status: 400})
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data:{
        userName:newName,
      }
    })

    return Response.json({
      success: true,
      message: "UserName updated successfully"
    }, { status: 200 })
  } 
  catch (error) {
    console.error("Error while updating userName", error)
    return Response.json({
      success: false,
      message: "Error while updating userName"
    }, { status: 500 })
  }
}