import { redirect } from "next/navigation";
import { getSchedule } from "./data-access/get-info-schedule"
import { ScheduleContent } from "./_components/ScheduleContent";

export default async function SchedulePage({
    params,
}: {
    params: Promise<{id:string}>
}) {

    const user_id = (await params).id;
    const user = await getSchedule({user_id: user_id});

    console.log(user)

    if(!user){
        redirect("/")
    }

  return (
    <div>
        <ScheduleContent clinic={user}/>
    </div>
  )
}
