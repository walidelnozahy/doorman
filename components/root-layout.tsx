import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import AuthButton from '@/components/header-auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='border-b'>
        <nav className='container mx-auto py-3 flex justify-between items-center'>
          <Link href='/' className='text-xl font-bold text-primary'>
            Doorman
          </Link>
          <div className='flex items-center space-x-4'>
            <AuthButton />
          </div>
        </nav>
      </div>
      <main className='flex-grow flex'>
        <div className='container mx-auto w-full'>{children}</div>
      </main>
      <footer className='border-t bg-background-secondary'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center justify-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              © {new Date().getFullYear()} Doorman. All rights reserved.
            </span>
            <ThemeToggle size='sm' />
          </div>
        </div>
      </footer>
    </>
  );
}
