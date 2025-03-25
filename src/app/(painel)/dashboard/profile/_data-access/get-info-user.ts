"use server"

import prisma from "@/lib/prisma";

interface GetUserDataProps{
    user_id: string
}

export async function getUserData({user_id}: GetUserDataProps){
    try{

        if(!user_id){
            return null;
        }

        const user = await prisma.user.findFirst({
            where:{
                id: user_id
            },
            include:{
                subscription:true,
            }
        })

        if(!user){
            return null;
        }

        return user;

    }catch(err){
        console.log(err)
        return null
    }
}