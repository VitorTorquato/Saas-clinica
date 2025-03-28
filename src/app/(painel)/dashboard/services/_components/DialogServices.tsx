"use client";

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

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

export default function DialogServices() {
  const form = useDialogServiceForm();

  function onsubmit(values:DialogServiceFormData){

    const priceInCents = convertRealToCents(values.price)

    console.log(priceInCents)


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
                >
                    Adicionar Servico
                </Button>
            </form>
        </Form>
    </>
  );
}
