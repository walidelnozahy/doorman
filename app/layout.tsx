import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import AuthButton from '@/components/header-auth';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { origin } from '@/config';

export const metadata = {
  metadataBase: new URL(origin),
  title: 'Doorman - Secure AWS Access Management',
  description:
    'Doorman makes it easy to securely request and manage access to your users’ AWS accounts with a simple, shareable link.',
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={geistSans.className} suppressHydrationWarning>
      <body className='bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <div className='min-h-screen flex flex-col'>
              <nav className='border-b'>
                <div className='container mx-auto py-4 flex justify-between items-center'>
                  <Link href='/' className='text-2xl font-bold text-primary'>
                    Doorman
                  </Link>
                  <div className='flex items-center space-x-4'>
                    <AuthButton />
                  </div>
                </div>
              </nav>

              <main className='flex-grow flex'>
                <div className='container mx-auto w-full'>{children}</div>
              </main>

              <footer className='border-t'>
                <div className='container mx-auto px-4 py-8'>
                  <div className='flex items-center justify-center gap-2'>
                    <span className='text-muted-foreground'>
                      © {new Date().getFullYear()} Doorman. All rights
                      reserved.
                    </span>
                    <ThemeToggle size='sm' />
                  </div>
                </div>
              </footer>
              <Toaster />
            </div>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
