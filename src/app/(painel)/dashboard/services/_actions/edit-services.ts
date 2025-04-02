"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {z} from 'zod';

import { revalidatePath } from 'next/cache'

const formSchema = z.object({
    serviceId: z.string().min(1,{message:"O id do servico e obrigatorio"}),
    name: z.string().min(1 , {message: "O nome do servico e obrigatorio"}),
    price: z.number().min(1, {message: "Preco e obrigatorio"}),
    duration: z.number(),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateService(formData: FormSchema){
      const session = await auth();
    
        if(!session?.user?.id){
            return{
                error: "Falha ao editar o servico"
            }       
        }
    
        const schema = formSchema.safeParse(formData);
    
        if(!schema.success){
            return{
                error: schema.error.issues[0].message
            }
        }

        try{

                await prisma.service.update({
                where:{
                    id: formData.serviceId,
                    user_id: session?.user?.id
                },
                data:{
                    name:formData.name,
                    price: formData.price,
                    duration : formData.duration < 30 ? 30 : formData.duration
                }
            })

            revalidatePath("/dashboard/services")

            return{
                data: "Servico atualizado com sucesso!"
            }

        }catch(err){
            console.error("Something went wrong" ,err)
            return{
                error: "Falha ao atualizar o servico"
            }  
        }
}

