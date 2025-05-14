import prisma from "@/config/db.config";

export async function DELETE (req: Request){
  const { id } = await req.json();
  
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
}