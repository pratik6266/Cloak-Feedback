import prisma from "@/config/db.config";

export async function DELETE (req: Request){
  const { id } = await req.json();
  
  try {
    const message =  await prisma.message.findUnique({
      where:{
        id,
      }
    })
    if(!message){
      return Response.json({
        success: false,
        message: "Message don't exist"
      }, { status: 400 });
    }
  
    await prisma.message.delete({
      where:{
        id,
      }
    })
    return Response.json({
      success: true,
      message: "Deleted Successfully"
    }, {status: 200})
  } catch (error) {
    console.error("Error while deleting message", error);
    return Response.json({
      success: false,
      message: "Error while deleting message"
    }, { status: 500 });
  }
}