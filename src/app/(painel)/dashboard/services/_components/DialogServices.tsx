"use client";

import { useState } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogServiceFormData, useDialogServiceForm } from "./dialog-service-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { convertRealToCents } from "@/utils/convertCurrency";
import { CreatNewService } from "../_actions/create-service";
import { toast } from "sonner";

interface DialogServiceProps{
    closeModal: () => void;
}

export default function DialogServices({closeModal}: DialogServiceProps) {

    const [loading, setLoading] = useState(false);

    const form = useDialogServiceForm();
    
  async function onsubmit(values:DialogServiceFormData){
    setLoading(true);
    const priceInCents = convertRealToCents(values.price)
    const hours = parseInt(values.hours) || 0;
    const minutes = parseInt(values.minutes) || 0;

    //converter as horas em minutos para duracao total em minutos

    const duration = (hours * 60) + minutes;

    const response = await CreatNewService({
        name: values.name,
        price: priceInCents,
        duration: duration,
    })
    
    setLoading(false);

    if(response.error){
        toast(response.error)
        return;
    }

    toast.success("Servico cadastrado com sucesso");
    handleCloseModal();
    

  }

  function handleCloseModal(){
    form.reset();
    closeModal();
  }

 

  function formatCurrency(event: React.ChangeEvent<HTMLInputElement>){
        let {value} = event.target;

        value = value.replace(/\D/g, ""); 

        if(value){
            value = (parseInt(value ,10) / 100).toFixed(2);
            value = value.replace('.' , ',');
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g ,'.');
            // encontrar grupo de 3 digitos que estejam seguido por outro  grupo de 3 digitos. garantindo que os ponstos sejam inserido entre os milhares
        }

        event.target.value = value;
        form.setValue("price" , value);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="self-start">Novo Servico</DialogTitle>
        <DialogDescription className="self-start">
          Adicione um novo servico
        </DialogDescription>
      </DialogHeader>
    
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onsubmit)}
            className="space-y-2">
                <div className="flex flex-col">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem className="my-2">
                            <FormLabel className="font-bold">Nome do Servico</FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder="Digite o nome do servico..."
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="price"
                    render={({field}) => (
                        <FormItem className="my-2">
                            <FormLabel className="font-bold">Valor do servico</FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder="ex: 120,00"
                                onChange={formatCurrency}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                        <p className="font-semibold">Tempo de duracao do servico</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                    <FormField
                    control={form.control}
                    name="hours"
                    render={({field}) => (
                        <FormItem className="my-2">
                            <FormLabel className="font-bold">Horas</FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder="1"
                                min="0"
                                type="number"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                     <FormField
                    control={form.control}
                    name="minutes"
                    render={({field}) => (
                        <FormItem className="my-2">
                            <FormLabel className="font-bold">Minutes</FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder="0"
                                min="0"
                                type="number"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    </div>
                </div>

                <Button
                type="submit"
                className="w-full font-semibold text-white"
                disabled={loading}
                >
                   {loading ? "Cadastrando..." : "Adicionar servico"}
                </Button>
            </form>
        </Form>
    </>
  );
}
