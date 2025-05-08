import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import config from '@/config';
import './globals.css';

export const metadata = {
  metadataBase: new URL(config.origin),
  title: 'Doorman - Secure AWS Access Management',
  description:
    'Doorman makes it easy to securely request and manage access to your users’ AWS accounts with a simple, shareable link.',
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.className} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className='bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <div className='min-h-screen flex flex-col'>{children}</div>
            <Toaster />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
