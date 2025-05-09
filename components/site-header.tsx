import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { ModeToggle } from '@/components/mode-toggle';
import Image from 'next/image';
import { UserNav } from './user-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Sary Logo"
            width={40}
            height={40}
            className="h-8 w-8 rounded-full"
          />
          <UserNav/>
        </Link>
      </div>
    </header>
  );
}
