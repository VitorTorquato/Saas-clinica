import { Button } from '@/components/ui/button';
import heroImg from '../../../../../public/images/doctor-hero.png';
import Image from 'next/image';

export function Hero() {
  return (
    <section className='bg-green-50 '>
      <div className='container mx-auto px-4 pt-20 pb-4 sm:pb-0 sm:px-6 lg:px-8'>
        <main className='flex items-center justify-center'>
          <article className='flex-[2] max-w-3xl flex flex-col justify-center space-y-8'>
            <h1 className='text-4xl lg:text-6xl max-w-2xl font-bold tracking-tight'>Encontre os melhores profissionais em um único local!</h1>

            <p className='text-base md:text-lg text-gray-600'>Nós somos uma plataforma para profissionais da saúde com foco em agilizar seu atendimento de forma simplificada e organizada.</p>

            <Button className='bg-emerald-500 hover:bg-emerald-400 w-fit px-6 font-semibold'>
            Profissionais disponíveis
            </Button>
          </article>

          <div className='hidden lg:block'>
            <Image
              src={heroImg}
              alt='Foto ilustrativa profissional da saude'
              width={340}
              height={400}
              quality={100}
              priority
              className='object-contain'
            />
          </div>
        </main>
      </div>
      
    </section>
  )
}
