import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServiceContent } from "./_components/ServicesContent";

export default async function Services() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <section>
      <ServiceContent user_id={session?.user?.id} />
    </section>
  );
}
