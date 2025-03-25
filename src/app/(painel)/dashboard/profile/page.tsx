import getSession from "@/lib/getSession";
import {redirect} from 'next/navigation'
import { getUserData } from "./_data-access/get-info-user";
import { ProfileContent } from "./_components/Profile";

export default  async function Profile() {

    const session = await getSession();
    
    if(!session){
      redirect("/")
    }

    const user = await getUserData({user_id: session.user?.id})
    
    if(!user){
      redirect("/")
    }

  return (
    <section>
        <ProfileContent/>
    </section>
  )
}
