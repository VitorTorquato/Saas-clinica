"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {z} from 'zod';

import { revalidatePath } from 'next/cache'

const formSchema = z.object({
    name: z.string().min(1 , {message: "O nome do servico e obrigatorio"}),
    price: z.number().min(1, {message: "Preco e obrigatorio"}),
    duration: z.number(),
})

type FormSchema = z.infer<typeof formSchema>

export async function CreatNewService(formData: FormSchema){
    const session = await auth();

    if(!session?.user?.id){
        return{
            error: "Falha ao cadastrar servico"
        }       
    }

    const schema = formSchema.safeParse(formData);

    if(!schema.success){
        return{
            error: schema.error.issues[0].message
        }
    }


    try{   
        const newService = await prisma.service.create({
            data:{
                name: formData.name,
                price: formData.price,
                duration: formData.duration,
                user_id: session?.user?.id
            }
        })

        revalidatePath("/dashboard/services");
        
        return {
            data: newService
        }

    }catch(err){
        console.error("Something went wrong" , err)
        return{
            error: "Falha ao cadastrar servico"
        } 
    }
}