"use client"

import { Button } from "@/components/ui/button";
import { Timeslot } from "./ScheduleContent";
import {cn} from '@/lib/utils'

import {isSlotInThePast,isToday} from './schedule-utils';

interface ScheduletimeListProps{
    selectedDate: Date;
    selecetedTime: string;
    requiredSlot: number;
    blockedTimes : string[];
    availableTimesSlots: Timeslot[];
    clinicTimes: string[];
    onSlectime: (time:string) => void;
}

export default function ScheduleTimeList({
        availableTimesSlots,
        blockedTimes,
        clinicTimes,
        requiredSlot,
        selecetedTime,
        selectedDate,
        onSlectime
}: ScheduletimeListProps) {

  const dateIsToday = isToday(selectedDate);
  

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {availableTimesSlots.map((slot) => {
        const slotIsInThePast = dateIsToday && isSlotInThePast(slot.time)
        return(
            <Button 
            onClick={() => onSlectime(slot.time)}
            className={cn("h-10 select-none" , 
                selecetedTime === slot.time && "border-2 border-emerald-500 text-primary"
            )}
            disabled={slotIsInThePast}
            key={slot.time}
            variant="outline"
            type="button">
                {slot.time}
            </Button>
        )
      })}
    </div>
  )
}
