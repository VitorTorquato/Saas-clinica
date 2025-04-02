"use client"
import imgUser from '../../../../../../public/images/foto1.png';

import {signOut , useSession} from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { ProfileFormData, useProfileForm } from "./profile-form" 
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle
 } from "@/components/ui/card";
 import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form";

 import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
 import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
 } from '@/components/ui/select'

 import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import Image from "next/image";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
 
import {Prisma} from '@prisma/client';
import { updateProfile } from '../_actions/update-profile';

import { toast } from "sonner";
import {formatPhone, extractPhoneNumber }  from '@/utils/formatPhone';



type UserWithSubscription = Prisma.UserGetPayload<{
  include:{
    subscription:true
  }
}>

interface ProfileContentProps{
  user: UserWithSubscription
}

export function ProfileContent({user}:ProfileContentProps) {
    const router = useRouter();
    const {update} = useSession();

    const form = useProfileForm({
      name: user.name,
      address: user.address,
      phone: user.phone,
      timezone: user.timezone,
      status: user.status
    });

    const [selectedHours , setSelectedHours] = useState<string[]>(user.time_table ?? []);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    function generateTimesSlots() : string[]{
      const hours: string[] = [];

      for(let i = 8 ; i <= 23 ; i++){
        for(let j = 0; j < 2; j++){
          const hour = i.toString().padStart(2, "0");
          const minutes = (j * 30).toString().padStart(2 , "0");  
          hours.push(`${hour}:${minutes}`)
        }
      }

      return hours;
    }

    async function handleLogOut(){
      await signOut();
      await update();
      router.replace("/");
    }

    function toggleHour(hour:string){
        setSelectedHours((prev) => prev.includes(hour) ? prev.filter((h) =>  h !== hour) : [...prev, hour].sort())
    }
    
    const hours = generateTimesSlots();


    const timeZones = Intl.supportedValuesOf("timeZone").filter((zone) => 
      zone.startsWith("America/Sao_Paulo") ||
      zone.startsWith("America/Fortaleza") ||
      zone.startsWith("America/Bahia") ||
      zone.startsWith("America/Belem") ||
      zone.startsWith("America/Manaus") ||
      zone.startsWith("America/Cuiaba") ||
      zone.startsWith("America/Boa_Vista")
    );

    async function onsubmit(values: ProfileFormData){
    
        const extractPhone = extractPhoneNumber(values.phone || "")

        const response = await updateProfile({
          name: values.name,
          address: values.address,
          phone: extractPhone,
          status: values.status === 'active' ? true : false,
          timeZone: values.timeZone,
          times: selectedHours || []
        });

        if(response.error){
          toast(response.error , {closeButton:true})
          return
        }

        toast(response.data)

    }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)}>
          <Card>
              <CardHeader>
                <CardTitle>Meu perfil</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <div className='relative h-40 w-40 rounded-full overflow-hidden bg-gray-200'>
                      <Image
                      src={user.image ? user.image : imgUser}
                      alt='foto da clinica'
                      fill
                      className='object-cover'
                      />
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => ( 
                      <FormItem>
                        <FormLabel className='font-semibold'>Nome Completo</FormLabel>
                        <FormControl>
                          <Input
                          {...field}
                          placeholder='Digite o nome da clinica...'
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}

                    />
                    <FormField 
                    control={form.control}
                    name="address"
                    render={({field}) => ( 
                      <FormItem>
                        <FormLabel className='font-semibold'>Endereco Completo</FormLabel>
                        <FormControl>
                          <Input
                          {...field}
                          placeholder='Digite o endereco da clinica...'
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                    />
                    <FormField 
                    control={form.control}
                    name="phone"
                    render={({field}) => ( 
                      <FormItem>
                        <FormLabel className='font-semibold'>Phone</FormLabel>
                        <FormControl>
                          <Input
                          {...field}
                          placeholder='(67) 99123-4562'
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value)
                            field.onChange(formattedValue)
                          }}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                    />

                    <FormField 
                    control={form.control}
                    name="status"
                    render={({field}) => ( 
                      <FormItem>
                        <FormLabel className='font-semibold'>Status</FormLabel>
                        <FormControl className='w-full'>
                        <Select
                         onValueChange={field.onChange}
                         defaultValue={field.value ? "active" : "inactive"}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleceione o status da clinica"/>
                         </SelectTrigger>
                         <SelectContent>
                          <SelectItem value='active'> Ativo (Clinica Aberta)</SelectItem>
                          <SelectItem value='inactive'> Inativo (Clinica Fechada)</SelectItem>
                         </SelectContent>
                        </Select>

                        </FormControl>
                      </FormItem>
                    )}
                    />


                    <div className='space-y-2'>

                      <Label className='font-semibold'>
                        Configurar horarios da clinica
                      </Label>

                      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                        <DialogTrigger asChild>
                          <Button 
                          variant="outline"
                          className='w-full justify-between'
                          >
                            Clique aqui para selecionar horarios 
                            <ArrowRight className='w-5 h-5'/>
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Horarios da clinica</DialogTitle>
                            <DialogDescription>Selecione os horarios da clinica:</DialogDescription>
                          </DialogHeader>

                          <section className='py-4'>
                            <p className='text-sm text-muted-foreground mb-2'>
                              Clique nos horarios abaixo para marcar ou desmarcar
                            </p>

                            <div className='grid grid-cols-5 gap-2'>
                              {
                                hours.map((item) => (
                                  <Button
                                  onClick={() => toggleHour(item)}
                                  key={item}
                                  variant="outline"
                                  className={cn("h-10" , selectedHours.includes(item) && "border-2 border-emerald-500 text-primary")}
                                  >
                                    {item}
                                  </Button>
                                ))
                              }
                            </div>

                          </section>

                          <Button
                          onClick={() => setDialogIsOpen(false)}
                          className='w-full'>
                            Adicionar Horarios
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <FormField 
                    control={form.control}
                    name="timeZone"
                    render={({field}) => ( 
                      <FormItem>
                        <FormLabel className='font-semibold'>Time zone</FormLabel>
                        <FormControl className='w-full'>

                        <Select
                         onValueChange={field.onChange}
                         defaultValue={field.value}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o seu fuso horario"/>
                         </SelectTrigger>
                         <SelectContent>
                            {timeZones.map((item) => (
                              <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                         </SelectContent>
                        </Select>

                        </FormControl>
                      </FormItem>
                    )}
                    />

                    <Button 
                    type='submit'
                    className='w-full bg-emerald-500 hover:bg-emerald-400'
                    >
                      Salvar alteracoes
                    </Button>

                  </div>
              </CardContent>
          </Card>
        </form>
      </Form>

      <section className='mt-4'>
        <Button
        variant="destructive"
        onClick={handleLogOut}
        >
          Sair da conta
        </Button>
      </section>
    </div>
  )
}
