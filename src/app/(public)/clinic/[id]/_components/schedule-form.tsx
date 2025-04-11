"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod';
import { useForm } from "react-hook-form";

const formSchema = z.object({
    name: z.string().min(1 , {message: "Nome e obrigatorio"}),
    email: z.string().min(1 , {message: "O email obrigatorio"}),
    phone: z.string().min(1 , {message: "O telefone e obrigatorio"}),
    date: z.date(),
    serviceId: z.string().min(1, "O servico e obrigatorio"),
})



export type AppointmentFormData = z.infer<typeof formSchema>

export function useAppoitnmentForm(){
    return useForm<AppointmentFormData>({
        resolver: zodResolver(formSchema),
        defaultValues:{
                name: "",
                email: "",
                phone: "",
                serviceId: "",
                date: new Date(),
        }
    })
}