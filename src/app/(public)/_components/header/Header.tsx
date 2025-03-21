"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const session = null;
  
  const navItems = [
    {  href: "#profissionais" , label: "Profissionais"},
  ]


  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button 
        onClick={() => setIsOpen(false)}
        key={item.href}
        asChild
        className="bg-transparent hover:bg-transparent shadow-none text-base text-black font-light"
        >
          <Link 
          className="text-base"
          href={item.href}>
            {item.label}
          </Link>
        </Button>
      ))}

      {session ? (
        <Link 
        className="flex items-center justify-center font-light gap-2"
        href="/dasboard">
          Painel 
        </Link>
      ) : (
        <Button>
          Login
        </Button>
      )}
    </>
  )

  return (
    <header
    className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white"
    >
      <div className="container mx-auto flex items-center justify-between">
          <Link 
          href='/'
          className="text-3xl text-zinc-900 font-bold"
          >
            Odonto<span className="text-emerald-500">Pro</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <NavLinks/>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button 
                className="text-black hover:bg-transparent"
                size="icon"
                variant="ghost"
                >
                  <Menu className="w-6 h-6"/>
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[260px] sm:w-[320px] z-[999] p-2">
               
                <SheetTitle>
                  Menu
                </SheetTitle>
               
                <SheetHeader className="hidden"></SheetHeader>
               
                <SheetDescription>
                  Veja nossos links
                </SheetDescription>

                  <nav className="flex flex-col space-y-4 mt-6">
                    <NavLinks/>
                  </nav>
              
              </SheetContent>
          </Sheet>
      </div>
    </header>
  )
}
