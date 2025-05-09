import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { MainNav } from '@/components/main-nav';
import { ModeToggle } from '@/components/mode-toggle';
import Image from 'next/image';
import { BuildingIcon } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          
          <Image
            src="https://sary.co/static/media/logo.0c4f2a3b.svg"
            alt="Sary Logo"
            width={40}
            height={40}
            className="hidden h-8 w-8 rounded-full sm:inline-block" >

            </Image>
          <span className="hidden font-bold sm:inline-block">
            Sary Network International
          </span>
          <span className="inline-block font-bold sm:hidden">Sary</span>
        </Link>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}