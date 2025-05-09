import { getAllServices } from "../_data-access/get_all-services"
import { ServicesList } from "./ServicesList";

interface ServiceContentProps{
    user_id:string
}
export async function ServiceContent({user_id}:ServiceContentProps){

    const services = await getAllServices({user_id:user_id});


  
  return (
    <div>
        <ServicesList services={services.data || []}/>
    </div>
  )
}
