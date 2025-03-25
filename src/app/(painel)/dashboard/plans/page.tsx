import getSession from "@/lib/getSession";
import {redirect} from 'next/navigation'

export default async function Plans() {
  const session = await getSession();
      
      if(!session){
        redirect("/")
      }
  return (
    <section>
        <h1>Planos</h1>
    </section>
  )
}
