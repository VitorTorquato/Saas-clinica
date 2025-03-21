import Footer from "./_components/footer/Footer";
import { Header } from "./_components/header/Header"
import { Hero } from "./_components/hero/Hero";
import { Professionals } from "./_components/professionals/Professionals";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>

      <div>
        <Hero/>
        <Professionals/>
        <Footer/>
      </div>
    </div>
  );
}
