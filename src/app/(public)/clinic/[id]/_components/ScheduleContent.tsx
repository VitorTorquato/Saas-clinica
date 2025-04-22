"use client";
import { MapPin } from "lucide-react";
import imageTest from "../../../../../../public/images/foto1.png";
import Image from "next/image";

import { Prisma } from "@prisma/client";
import { useAppoitnmentForm, AppointmentFormData } from "./schedule-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { formatPhone } from "@/utils/formatPhone";
import { DateTimerPicker } from "./date-picker";

type UserwithServiceAndsubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
    services: true;
  };
}>;

interface ScheduleContentProps {
  clinic: UserwithServiceAndsubscription;
}
export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoitnmentForm();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500" />

      <section className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white -mt-16 mb-8">
              <Image
                src={clinic.image ? clinic.image : imageTest}
                alt="image teste"
                fill
                className="object-cover"
              />
            </div>

            <h1 className="font-bold text-2xl mb-2">{clinic.name}</h1>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>
                {clinic.address ? clinic.address : "Endereco nao informado"}
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-6">
        <Form {...form}>
          <form className="space-y-6 bg-white border rounded-md shadow-sm mx-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="m-6">
                  <FormLabel className="font-bold">Nome</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Digite seu nome completo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="m-6">
                  <FormLabel className="font-bold">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Digite seu email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="m-6">
                  <FormLabel className="font-bold">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatPhone(e.target.value);
                        field.onChange(formattedValue);
                      }}
                      id="phone"
                      placeholder="(XX) XXXX-XXXX"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="m-6 flex  items-center gap-2 space-y-1">
                  <FormLabel className="font-bold">
                    Data do agendamento
                  </FormLabel>
                  <FormControl>
                    <DateTimerPicker
                      initialDate={new Date()}
                      className="w-full rounded border-2 p-2"
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="m-6">
                  <FormLabel className="font-semibold">Selecione o servico</FormLabel>
                  <FormControl className="w-full">
                    <Select
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleceione um servico" />
                      </SelectTrigger>
                      <SelectContent>
                       {clinic.services.map((item) => (
                            <SelectItem  key={item.id} value={item.name}>
                                {item.name} - {Math.floor(item.duration / 60)}h {item.duration % 60}min
                          </SelectItem>
                       ))} 
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </section>
    </div>
  );
}
