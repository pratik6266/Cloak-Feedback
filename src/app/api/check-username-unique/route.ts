import { z } from 'zod';
import prisma from '@/config/db.config';
import { userNameValidation } from '@/schema/signUpSchema';

const userNameQuerySchema = z.object({
  userName: userNameValidation
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const queryParam = {
      userName: searchParams.get('userName')
    }
    const result = userNameQuerySchema.safeParse(queryParam);

    if(!result.success){
      const userNameError = result.error.format().userName?._errors || []
      return Response.json({
        success: false,
        message: userNameError.length > 0 ? userNameError.join(', ') : "Invalid query parameters"
      }, {status: 400})
    }

    const { userName } = result.data

    const user = await prisma.user.findFirst({
      where: {
        userName: userName,
        isVerified: true,
      }
    })

    if(user){
      return Response.json({
        success: false,
        message: "UserName is already taken"
      }, {status: 400})
    }

    return Response.json({
      success: true,
      message: "UserName is aviable"
    }, {status: 200})

  } catch (error) {
    console.error("Error checking username", error);
    return Response.json({
      success: false,
      message: "Error checking username"
    }, {status: 500})
  }
}