import getSession from "@/lib/getSession";
import {redirect} from 'next/navigation'

export default  async function Profile() {

    const session = await getSession();
    
    if(!session){
      redirect("/")
    }

    

  return (
    <section>
        <h1>Profile</h1>
    </section>
  )
}
