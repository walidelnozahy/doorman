import Navbar from '@/components/navbar';
import Footer from './footer';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className='flex-grow flex'>
        <div className='container mx-auto w-full'>{children}</div>
      </main>
      <Footer />
    </>
  );
}
