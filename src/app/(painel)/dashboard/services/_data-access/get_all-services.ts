"use server"

import prisma from "@/lib/prisma";


export async function getAllServices({user_id}: {user_id:string}){
    
    if(!user_id){
        return{
            error:"Falha ao buscar seus servicos"
        }
    }

    try{

        const services = await prisma.service.findMany({
            where:{
                user_id:user_id,
                status:true
            }
        })

        return {
            data:services
        }

    }catch(err){
        console.log(err)
        return{
            error:"Falha ao buscar seus servicos"
        }
    }
}