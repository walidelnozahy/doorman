'use client';

import { getQueryClient } from '@/utils/get-query-client';
import { QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
