// "use server"

// import { auth } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import {z} from 'zod';

// import { revalidatePath } from 'next/cache'

// const formSchema = z.object({
//     serviceId: z.string().min(1,{message:"O id do servico e obrigatorio"})
// })

// type FormSchema = z.infer<typeof formSchema>

// export async function deleteService(formData: FormSchema){
//       const session = await auth();
    
//         if(!session?.user?.id){
//             return{
//                 error: "Falha ao editar o servico"
//             }       
//         }
    
//         const schema = formSchema.safeParse(formData);
    
//         if(!schema.success){
//             return{
//                 error: schema.error.issues[0].message
//             }
//         }

//         try{

//             await prisma.service.update({
//                 where:{
//                     id: formData.serviceId,
//                     user_id: session?.user?.id
//                 },
//                 data:{
//                     name:
//                 }
//             })

//             revalidatePath("/dashboard/services")

//             return{
//                 data: "Servico editado com sucesso!"
//             }
//         }catch(err){
//             console.error("Something went wrong" ,err)
//             return{
//                 error: "Falha editar o servico"
//             }  
//         }
// }

