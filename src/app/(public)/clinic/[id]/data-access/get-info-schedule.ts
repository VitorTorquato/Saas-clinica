"use server"

import prisma from "@/lib/prisma";

export async function getSchedule({user_id} : {user_id: string}){
    try{
        if(!user_id){
            return null;
        }


        const user = await prisma.user.findFirst({
            where:{
                id: user_id
            },
            include:{
                subscription: true,
                services: {
                    where:{
                        status: true
                    }
                }
            }
        })
    
        if(!user){
            return null;
        }

        return user;

    }catch(err){
        console.error(err)

    }



}