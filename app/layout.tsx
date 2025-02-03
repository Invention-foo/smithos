import type { Metadata } from 'next'
import './globals.css'
import { headers } from "next/headers";
import ContextProvider from '@/context';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookies = headers().get('cookie');
  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ContextProvider>
      </body>
    </html>
  )
}
