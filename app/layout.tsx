import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import config from '@/config';
import './globals.css';

export const metadata = {
  title: 'Doorman · Secure AWS Access Management',
  description:
    "Doorman makes it easy to securely request and manage access to your users' AWS accounts with a simple, shareable link.",
  openGraph: {
    title: 'Doorman · Secure AWS Access Management',
    description:
      "Doorman makes it easy to securely request and manage access to your users' AWS accounts with a simple, shareable link.",
    url: config.appUrl,
    images: [
      {
        url: '/meta.png',
        width: 800,
        height: 600,
        alt: 'Doorman - Secure AWS Access Management',
      },
    ],
    siteName: 'Doorman · Secure AWS Access Management',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doorman · Secure AWS Access Management',
    description:
      "Doorman makes it easy to securely request and manage access to your users' AWS accounts with a simple, shareable link.",
  },
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
