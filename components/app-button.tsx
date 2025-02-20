'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

export default function AppButton() {
  const pathname = usePathname();

  if (pathname.includes('/app')) {
    return null;
  }
  return (
    <Button size='sm' color='primary'>
      <Link href='/app'>Dashboard</Link>
    </Button>
  );
}
