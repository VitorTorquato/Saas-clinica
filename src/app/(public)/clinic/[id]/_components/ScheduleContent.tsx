"use client";
import { useState, useCallback, useEffect } from "react";

import { MapPin } from "lucide-react";
import imageTest from "../../../../../../public/images/foto1.png";
import Image from "next/image";

import { Prisma } from "@prisma/client";
import { useAppoitnmentForm, AppointmentFormData } from "./schedule-form";


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
import ScheduleTimeList from "./schedule-time-list";
import { createNewAppointment } from "../_actions/create-appointment";
import { toast } from "sonner";

type UserwithServiceAndsubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
    services: true;
  };
}>;

interface ScheduleContentProps {
  clinic: UserwithServiceAndsubscription;
}

export interface Timeslot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlot, setAvailableTimeSlot] = useState<Timeslot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  //quais os horarios bloqueados
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  const form = useAppoitnmentForm();
  const { watch } = form;

  const selectedDate = watch("date");
  const selectedServiceId = watch("serviceId");

  //function to get blocked times slots
  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingSlots(true);
      try {
        const dateString = date.toISOString().split("T")[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?user_id=${clinic.id}&date=${dateString}`
        );

        const json = await response.json();
        setLoadingSlots(false);

        return json; //Retornar horarios que ja tem bloqueados naquele dia dessa clinica
      } catch (err) {
        console.error(err);
        setLoadingSlots(false);
        return [];
      }
    },
    [clinic.id]
  );

  async function handleRegisterAppointment(formData: AppointmentFormData) {
    if (!selectedTime) {
      return;
    }

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      serviceId: formData.serviceId,
      clinicId: clinic.id,
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Consilta agendada com sucesso!");
    form.reset()
    setSelectedTime("")
  }

  useEffect(() => {
    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked);
        const times = clinic.time_table || [];

        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time),
        }));

        setAvailableTimeSlot(finalSlots);

        //verificatr se o slot atual estiver indisponivel limpamos a selecao
        const stillAvailable = finalSlots.find((slot) => slot.time === selectedTime && slot.available)
        if(!stillAvailable){
          setSelectedTime("")
        }
      });
    }
  }, [selectedDate, clinic.time_table, fetchBlockedTimes, selectedTime]);

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
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointment)}
            className="space-y-6 bg-white border rounded-md shadow-sm mx-2 p-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
                <FormItem>
                  <FormLabel className="font-bold">Phone</FormLabel>
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
                <FormItem className="flex  items-center gap-2 space-y-1">
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
                <FormItem className="">
                  <FormLabel className="font-bold">
                    Selecione o servico
                  </FormLabel>
                  <FormControl className="w-full">
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleceione um servico" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - {Math.floor(item.duration / 60)}h{" "}
                            {item.duration % 60}min
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className="space-y-2">
                <Label className="font-bold">Horarios disponiveis</Label>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {loadingSlots ? (
                    <p>Carregando horarios</p>
                  ) : availableTimeSlot.length === 0 ? (
                    <p>Nenhum horario disponivel</p>
                  ) : (
                    <ScheduleTimeList
                      onSlectime={(time) => setSelectedTime(time)}
                      clinicTimes={clinic.time_table}
                      blockedTimes={blockedTimes}
                      availableTimesSlots={availableTimeSlot}
                      selecetedTime={selectedTime}
                      selectedDate={selectedDate}
                      requiredSlot={
                        clinic.services.find(
                          (service) => service.id === selectedServiceId
                        )
                          ? Math.ceil(
                              clinic.services.find(
                                (service) => service.id === selectedServiceId
                              )!.duration / 30
                            )
                          : 1
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {clinic.status ? (
              <Button
                disabled={
                  !watch("name") ||
                  !watch("email") ||
                  !watch("phone") ||
                  !watch("date") ||
                  !form.watch("serviceId")
                }
                className="w-full bg-emerald-500 hover:bg-emerald-400"
              >
                Realizar agendamento
              </Button>
            ) : (
              <p className="bg-red-500 text-white text-center px-4 rounde-md py-4">
                A clinica esta fechada nesse momento.
              </p>
            )}
          </form>
        </Form>
      </section>
    </div>
  );
}
