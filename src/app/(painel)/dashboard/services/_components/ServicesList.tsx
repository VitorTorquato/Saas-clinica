"use client"
import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle
 } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, X } from "lucide-react";
import DialogServices from "./DialogServices";
import { Service } from "@prisma/client";
import {formatCurrency} from '@/utils/fromatCurrency'
import { deleteService } from "../_actions/delete-service";
import { toast } from "sonner";


interface ServiceListProps{
    services: Service[]
}

export function ServicesList({services}:ServiceListProps) {

    const [isDialogOpen,setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<null | Service>(null);

    async function handleDeleteService(id:string){
           const response = await deleteService({serviceId: id})

           if(response.error){
            toast(response.error)
            return
           }

           toast.success(response.data)
    }

    async function handleEditService(service: Service){
            setEditingService(service);
            setIsDialogOpen(true);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <section className="mx-auto">
                <Card>
                    <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl md:text-2xl font-bold">Servicos</CardTitle>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4"/>
                            </Button>
                        </DialogTrigger>

                        <DialogContent 
                        onInteractOutside={(e) => {
                            e.preventDefault()
                            setIsDialogOpen(false);
                            setEditingService(null);
                        }}
                        >
                            <DialogServices
                            closeModal={() => {
                                setIsDialogOpen(false);
                                setEditingService(null)
                            }}
                            serviceId={editingService ? editingService.id : undefined}
                            initialValues={editingService ? {
                                name: editingService.name,
                                price: (editingService.price / 100).toFixed(2).replace("." , ","),
                                hours: Math.floor(editingService.duration / 60).toString(),
                                minutes: (editingService.duration % 60).toString()
                            } : undefined}
                            />
                        </DialogContent>
                    </CardHeader>

                    <CardContent>
                        <section className="space-y-4 mt-4">
                            {services.map((service) => (
                                <article  
                                className="flex items-center justify-between"
                                key={service.id}>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">{service.name}</span>
                                        <span className="text-gray-500">-</span>
                                        <span className="text-gray-500">{formatCurrency((service.price / 100))}</span>
                                    </div>


                                    <div>
                                        <Button 
                                        onClick={() => handleEditService(service)}
                                        variant="ghost" size="icon">
                                            <Pencil className="w-4 h-4"/>
                                        </Button>

                                        <Button
                                        onClick={() => handleDeleteService(service.id)}
                                        variant="ghost" size="icon">
                                            <X className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </section>
                    </CardContent>
                </Card>
            </section>  
        </Dialog>
      
  )
}
